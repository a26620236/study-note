#!/usr/bin/env bash
# One-shot setup for macOS.
# Prereq: Homebrew + Python 3.10+
set -e

cd "$(dirname "$0")"

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew not found. Install from https://brew.sh first." >&2
  exit 1
fi

if ! brew list portaudio >/dev/null 2>&1; then
  echo "[setup] installing portaudio..."
  brew install portaudio
fi

PY=""
for candidate in python3.13 python3.12 python3.11 python3.10 python3; do
  if command -v "$candidate" >/dev/null 2>&1; then
    ver=$("$candidate" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
    major=${ver%.*}
    minor=${ver#*.}
    if [ "$major" -ge 3 ] && [ "$minor" -ge 10 ]; then
      PY="$candidate"
      break
    fi
  fi
done

if [ -z "$PY" ]; then
  echo "Need Python 3.10+. Install with: brew install python@3.13" >&2
  exit 1
fi

if [ ! -d venv ]; then
  echo "[setup] creating virtualenv with $PY ($($PY --version))..."
  "$PY" -m venv venv
fi

# shellcheck source=/dev/null
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f config.json ]; then
  cp config.example.json config.json
  echo "[setup] created config.json from example. Edit it if you want to tweak."
fi

echo
echo "[done] Run with:"
echo "  source venv/bin/activate && python app.py"
echo
echo "First run: System Settings -> Privacy & Security -> grant Microphone + Accessibility to Terminal (or your Python launcher)."
