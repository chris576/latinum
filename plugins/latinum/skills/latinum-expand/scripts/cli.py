#!/usr/bin/env python3
"""
Latinum Expand CLI

Usage:
    latinum <filepath>
"""

import sys

for _stream in (sys.stdout, sys.stderr):
    reconfigure = getattr(_stream, "reconfigure", None)
    if callable(reconfigure):
        try:
            reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

from pathlib import Path

from .compress import backup_dir_for, expand_file
from .detect import detect_file_type, should_expand


def print_usage():
    print("Usage: latinum <filepath>")


def main():
    if len(sys.argv) != 2:
        print_usage()
        sys.exit(1)

    filepath = Path(sys.argv[1])

    if not filepath.exists():
        print(f"File not found: {filepath}")
        sys.exit(1)

    if not filepath.is_file():
        print(f"Not a file: {filepath}")
        sys.exit(1)

    filepath = filepath.resolve()

    file_type = detect_file_type(filepath)

    print(f"Detected: {file_type}")

    if not should_expand(filepath):
        print("Skipping: file is not natural language (code/config)")
        sys.exit(0)

    print("Starting latinum expansion...\n")

    try:
        success = expand_file(filepath)

        if success:
            print("\nExpansion completed successfully")
            backup_path = backup_dir_for(filepath) / (filepath.stem + ".original.md")
            print(f"Expanded: {filepath}")
            print(f"Original: {backup_path}")
            sys.exit(0)
        else:
            print("\nExpansion failed after retries")
            sys.exit(2)

    except KeyboardInterrupt:
        print("\nInterrupted by user")
        sys.exit(130)

    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
