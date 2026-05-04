# One-shot setup for Windows.
# Prereq: Python 3.10+ on PATH.
$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python not on PATH. Install from https://www.python.org/downloads/ and check 'Add Python to PATH'."
    exit 1
}

if (-not (Test-Path "venv")) {
    Write-Host "[setup] creating virtualenv..."
    python -m venv venv
}

. .\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

if (-not (Test-Path "config.json")) {
    Copy-Item config.example.json config.json
    Write-Host "[setup] created config.json from example. Edit it if you want to tweak."
}

Write-Host ""
Write-Host "[done] Run with:"
Write-Host "  .\venv\Scripts\Activate.ps1; python app.py"
