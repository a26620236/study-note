# voice-input

Push-to-talk voice input powered by `faster-whisper`. Hold a hotkey, speak, release — the transcribed text gets pasted at your cursor in any app. Free, local, cross-platform.

> ⚠️ Status: v1 in progress. Initial scaffolding done on Windows, will be smoke-tested on macOS next.

## Setup

### macOS

```bash
cd voice-input
./setup-mac.sh
source venv/bin/activate
python app.py
```

First run: open **System Settings → Privacy & Security** and grant your terminal (or Python launcher) two permissions:
- **Microphone**
- **Accessibility** (otherwise the global hotkey is silently ignored)

### Windows

```powershell
cd voice-input
.\setup-win.ps1
.\venv\Scripts\Activate.ps1
python app.py
```

## Usage

1. Run `python app.py`. First launch downloads the Whisper model (`small` ≈ 500MB).
2. Hold `Ctrl+Alt+Space` (or `Cmd+Alt+Space` on Mac if you remap it).
3. Speak.
4. Release — the text is copied to your clipboard and pasted at the cursor.

## Configuration

Copy `config.example.json` to `config.json` and edit. Fields:

| Field | Default | Description |
|---|---|---|
| `model_size` | `"small"` | `tiny` / `base` / `small` / `medium` / `large-v3` |
| `language` | `null` | `null` = auto, or `"en"` / `"zh"` to force |
| `device` | `"auto"` | `auto` / `cpu` / `cuda` |
| `compute_type` | `"auto"` | `auto` / `int8` / `float16` / `float32` |
| `sample_rate` | `16000` | Hz |
| `hotkey` | `"<ctrl>+<alt>+<space>"` | pynput format |
| `min_recording_seconds` | `0.3` | shorter recordings are dropped |
| `paste_after_transcribe` | `true` | if false, only prints to terminal |

## Roadmap

See `HANDOFF.md` for the full list. Headline items:

- Smoke test on macOS
- Apple Silicon fast path via `mlx-whisper`
- System tray icon
- English-practice integration (log English utterances for the `english-coach` skill to review)
- Auto-start on login
