#!/usr/bin/env python3
from pathlib import Path
import sys

try:
    from .validate import validate
except ImportError:
    sys.path.insert(0, str(Path(__file__).parent))
    from validate import validate

try:
    import tiktoken
    _enc = tiktoken.get_encoding("o200k_base")
except ImportError:
    _enc = None


def count_tokens(text):
    if _enc is None:
        return len(text.split())
    return len(_enc.encode(text))


def benchmark_pair(orig_path: Path, exp_path: Path):
    orig_text = orig_path.read_text()
    exp_text = exp_path.read_text()

    orig_tokens = count_tokens(orig_text)
    exp_tokens = count_tokens(exp_text)
    growth = 100 * (exp_tokens - orig_tokens) / orig_tokens if orig_tokens > 0 else 0.0
    result = validate(orig_path, exp_path)

    return (exp_path.name, orig_tokens, exp_tokens, growth, result.is_valid)


def print_table(rows):
    print("\n| File | Original | Expanded | Growth % | Valid |")
    print("|------|----------|----------|----------|-------|")
    for r in rows:
        print(f"| {r[0]} | {r[1]} | {r[2]} | {r[3]:.1f}% | {'✓' if r[4] else '✗'} |")


def main():
    # Direct file pair: python3 benchmark.py original.md expanded.md
    if len(sys.argv) == 3:
        orig = Path(sys.argv[1]).resolve()
        exp = Path(sys.argv[2]).resolve()
        if not orig.exists():
            print(f"Not found: {orig}")
            sys.exit(1)
        if not exp.exists():
            print(f"Not found: {exp}")
            sys.exit(1)
        print_table([benchmark_pair(orig, exp)])
        return

    # Glob mode: repo_root/tests/latinum-expand/
    tests_dir = Path(__file__).resolve().parents[3] / "tests" / "latinum-expand"
    if not tests_dir.exists():
        print(f"Tests dir not found: {tests_dir}")
        sys.exit(1)

    rows = []
    for orig in sorted(tests_dir.glob("*.original.md")):
        exp = orig.with_name(orig.stem.removesuffix(".original") + ".md")
        if exp.exists():
            rows.append(benchmark_pair(orig, exp))

    if not rows:
        print("No expanded file pairs found.")
        return

    print_table(rows)


if __name__ == "__main__":
    main()
