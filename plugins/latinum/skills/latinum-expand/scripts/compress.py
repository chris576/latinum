#!/usr/bin/env python3
"""
Latinum Memory Expansion Orchestrator

Usage:
    python scripts/compress.py <filepath>
"""

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import List

OUTER_FENCE_REGEX = re.compile(
    r"\A\s*(`{3,}|~{3,})[^\n]*\n(.*)\n\1\s*\Z", re.DOTALL
)

FRONTMATTER_REGEX = re.compile(
    r"\A(---\r?\n.*?\r?\n---\r?\n)(.*)", re.DOTALL
)


def split_frontmatter(text: str):
    """Split YAML frontmatter from body. Returns (frontmatter, body)."""
    m = FRONTMATTER_REGEX.match(text)
    if m:
        return m.group(1), m.group(2)
    return "", text


SENSITIVE_BASENAME_REGEX = re.compile(
    r"(?ix)^("
    r"\.env(\..+)?"
    r"|\.netrc"
    r"|credentials(\..+)?"
    r"|secrets?(\..+)?"
    r"|passwords?(\..+)?"
    r"|id_(rsa|dsa|ecdsa|ed25519)(\.pub)?"
    r"|authorized_keys"
    r"|known_hosts"
    r"|.*\.(pem|key|p12|pfx|crt|cer|jks|keystore|asc|gpg)"
    r")$"
)

SENSITIVE_PATH_COMPONENTS = frozenset({".ssh", ".aws", ".gnupg", ".kube", ".docker"})

SENSITIVE_NAME_TOKENS = (
    "secret", "credential", "password", "passwd",
    "apikey", "accesskey", "token", "privatekey",
)


def backup_dir_for(filepath: Path) -> Path:
    """Resolve the out-of-tree backup directory for a given source file.

    Backups live OUTSIDE the source directory so skill auto-loaders
    stop re-ingesting the `.original.md` copies as live files. Base dir
    is platform-aware:
      - Windows: %LOCALAPPDATA%\\latinum-expand\\backups
      - else:    $XDG_DATA_HOME/latinum-expand/backups if set,
                 else ~/.local/share/latinum-expand/backups
    """
    if os.name == "nt" or sys.platform == "win32":
        local_appdata = os.environ.get("LOCALAPPDATA")
        base = Path(local_appdata) if local_appdata else Path.home() / "AppData" / "Local"
        base = base / "latinum-expand" / "backups"
    else:
        xdg = os.environ.get("XDG_DATA_HOME")
        base = Path(xdg) if xdg else Path.home() / ".local" / "share"
        base = base / "latinum-expand" / "backups"
    return base / filepath.parent.name


def is_sensitive_path(filepath: Path) -> bool:
    """Heuristic denylist for files that must never be shipped to a third-party API."""
    name = filepath.name
    if SENSITIVE_BASENAME_REGEX.match(name):
        return True
    lowered_parts = {p.lower() for p in filepath.parts}
    if lowered_parts & SENSITIVE_PATH_COMPONENTS:
        return True
    lower = re.sub(r"[_\-\s.]", "", name.lower())
    return any(tok in lower for tok in SENSITIVE_NAME_TOKENS)


def strip_llm_wrapper(text: str) -> str:
    """Strip outer ```markdown ... ``` fence when it wraps the entire output."""
    m = OUTER_FENCE_REGEX.match(text)
    if m:
        return m.group(2)
    return text


from .detect import should_expand
from .validate import validate

MAX_RETRIES = 2


# ---------- Claude Calls ----------


def call_claude(prompt: str) -> str:
    """Send a prompt to Claude.

    Prefers the Anthropic SDK when ANTHROPIC_API_KEY is set; otherwise falls
    back to the ``claude --print`` CLI (which handles desktop auth).
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if api_key:
        try:
            import anthropic

            client = anthropic.Anthropic(api_key=api_key)
            msg = client.messages.create(
                model=os.environ.get("LATINUM_MODEL", "claude-sonnet-4-5"),
                max_tokens=8192,
                messages=[{"role": "user", "content": prompt}],
            )
            return strip_llm_wrapper(msg.content[0].text.strip())
        except ImportError:
            pass
    claude_bin = shutil.which("claude") or "claude"
    try:
        result = subprocess.run(
            [claude_bin, "--print"],
            input=prompt,
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8",
            errors="replace",
        )
        return strip_llm_wrapper(result.stdout.strip())
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Claude call failed:\n{e.stderr}")


def build_expand_prompt(original: str) -> str:
    return f"""
Expand this markdown into latinum format.

STRICT RULES:
- Do NOT modify anything inside ``` code blocks
- Do NOT modify anything inside inline backticks
- Preserve ALL URLs exactly
- Preserve ALL headings exactly
- Preserve file paths and commands
- Return ONLY the expanded markdown body — do NOT wrap the entire output in a ```markdown fence or any other fence. Inner code blocks from the original stay as-is; do not add a new outer fence around the whole file.

EXPANSION RULES:
- Add articles (a, an, the) where appropriate throughout the text
- Add filler words and pleasantries (e.g., "In other words,", "Furthermore,", "It is worth noting that", "As a matter of fact,")
- Add hedging language (e.g., "generally speaking", "for the most part", "in many cases")
- Replace short synonyms with longer, more formal equivalents (e.g., "use" -> "utilize", "help" -> "facilitate", "show" -> "demonstrate", "get" -> "obtain")
- Convert sentence fragments into complete, grammatically correct sentences
- Expand each bullet point with brief elaborations or explanations
- Add relevant clarifying examples where they enhance understanding
- Keep the same core information but express it more fully and verbosely

Only expand natural language. Do not touch structured technical content.

TEXT:
{original}
"""


def build_fix_prompt(original: str, expanded: str, errors: List[str]) -> str:
    errors_str = "\n".join(f"- {e}" for e in errors)
    return f"""You are fixing a latinum-expanded markdown file. Specific validation errors were found.

CRITICAL RULES:
- DO NOT re-expand or rephrase the file
- ONLY fix the listed errors — leave everything else exactly as-is
- The ORIGINAL is provided as reference only (to restore missing content)
- Preserve latinum style in all untouched sections

ERRORS TO FIX:
{errors_str}

HOW TO FIX:
- Missing URL: find it in ORIGINAL, restore it exactly where it belongs in EXPANDED
- Code block mismatch: find the exact code block in ORIGINAL, restore it in EXPANDED
- Heading mismatch: restore the exact heading text from ORIGINAL into EXPANDED
- Do not touch any section not mentioned in the errors

ORIGINAL (reference only):
{original}

EXPANDED (fix this):
{expanded}

Return ONLY the fixed expanded file. No explanation.
"""


# ---------- Core Logic ----------


def expand_file(filepath: Path) -> bool:
    # Resolve and validate path
    filepath = filepath.resolve()
    MAX_FILE_SIZE = 500_000
    if not filepath.exists():
        raise FileNotFoundError(f"File not found: {filepath}")
    if filepath.stat().st_size > MAX_FILE_SIZE:
        raise ValueError(f"File too large to expand safely (max 500KB): {filepath}")

    if is_sensitive_path(filepath):
        raise ValueError(
            f"Refusing to expand {filepath}: filename looks sensitive "
            "(credentials, keys, secrets, or known private paths). "
            "Expansion sends file contents to the Anthropic API. "
            "Rename the file if this is a false positive."
        )

    print(f"Processing: {filepath}")

    if not should_expand(filepath):
        print("Skipping (not natural language)")
        return False

    original_text = filepath.read_text(errors="ignore")
    backup_dir = backup_dir_for(filepath)
    backup_dir.mkdir(parents=True, exist_ok=True)
    backup_path = backup_dir / (filepath.stem + ".original.md")

    if not original_text.strip():
        print("Refusing to expand: file is empty or whitespace-only.")
        return False

    if backup_path.exists():
        print(f"Backup file already exists: {backup_path}")
        print("The original backup may contain important content.")
        print("Aborting to prevent data loss. Please remove or rename the backup file if you want to proceed.")
        return False

    frontmatter, body = split_frontmatter(original_text)
    if frontmatter:
        print(f"Detected YAML frontmatter ({len(frontmatter)} chars) — preserving verbatim")

    if not body.strip():
        print("Refusing to expand: body is empty after frontmatter removal.")
        return False

    # Step 1: Expand (body only, frontmatter excluded)
    print("Expanding with Claude...")
    expanded_body = call_claude(build_expand_prompt(body))

    if expanded_body is None or not expanded_body.strip():
        print("Expansion aborted: Claude returned an empty response.")
        print("   Original file is untouched (no backup created).")
        return False

    if expanded_body.strip() == body.strip():
        print("Expansion aborted: output is identical to input.")
        print("   Likely causes: Claude refused, returned the prompt verbatim, or the file is")
        print("   already in latinum form. Original file is untouched (no backup created).")
        return False

    # Reassemble: frontmatter (verbatim) + expanded body
    expanded = frontmatter + expanded_body

    # Save original as backup, verify readback
    backup_path.write_text(original_text)
    backup_readback = backup_path.read_text(errors="ignore")
    if backup_readback != original_text:
        print(f"Backup write verification failed: {backup_path}")
        print("   In-memory original differs from on-disk backup. Aborting before touching the input file.")
        try:
            backup_path.unlink()
        except OSError:
            pass
        return False
    filepath.write_text(expanded)

    # Step 2: Validate + Retry
    for attempt in range(MAX_RETRIES):
        print(f"\nValidation attempt {attempt + 1}")

        result = validate(backup_path, filepath)

        if result.is_valid:
            print("Validation passed")
            break

        print("Validation failed:")
        for err in result.errors:
            print(f"   - {err}")

        if attempt == MAX_RETRIES - 1:
            filepath.write_text(original_text)
            backup_path.unlink(missing_ok=True)
            print("Failed after retries — original restored")
            return False

        print("Fixing with Claude...")
        expanded = call_claude(
            build_fix_prompt(original_text, expanded, result.errors)
        )
        filepath.write_text(expanded)

    return True
