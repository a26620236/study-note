# voice-input

Push-to-talk voice input. Hold a hotkey, speak, release — the transcribed text gets pasted at your cursor in any app. Free, local, cross-platform.

On Apple Silicon it uses **mlx-whisper** (Metal/Neural Engine, ~6× faster than CPU). On other platforms it falls back to **faster-whisper**.

## Setup

### macOS

```bash
cd voice-input
./setup-mac.sh
source venv/bin/activate
python app.py
```

First run: open **System Settings → Privacy & Security** and grant your terminal (or the venv `python` binary if launched via launchd) two permissions:
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

1. Run `python app.py`. First launch downloads the Whisper model (~480–500MB for `small`).
2. Hold `Ctrl+Alt+Space` (default).
3. Speak. The menu-bar icon turns red while recording, yellow while transcribing.
4. Release — the text is copied to your clipboard and pasted at the cursor.

## Configuration

Copy `config.example.json` to `config.json` and edit. Fields:

| Field | Default | Description |
|---|---|---|
| `engine` | `"auto"` | `auto` / `faster-whisper` / `mlx-whisper`. `auto` picks mlx on Apple Silicon, faster-whisper elsewhere |
| `model_size` | `"small"` | `tiny` / `base` / `small` / `medium` / `large-v3` |
| `language` | `null` | `null` = auto, or `"en"` / `"zh"` to force |
| `device` | `"auto"` | `auto` / `cpu` / `cuda` (faster-whisper only) |
| `compute_type` | `"auto"` | `auto` / `int8` / `float16` / `float32` |
| `sample_rate` | `16000` | Hz |
| `hotkey` | `"<ctrl>+<alt>+<space>"` | pynput format |
| `min_recording_seconds` | `0.3` | shorter recordings are dropped |
| `paste_after_transcribe` | `true` | if false, only prints to terminal |
| `english_log` | `false` | append English transcripts to a daily voice-log markdown |
| `english_log_dir` | `null` | log directory; `null` = `<repo>/english-practice/voice-log` |
| `tray_enabled` | `true` | show menu-bar / system-tray icon with state |

## English-practice integration

Set `"english_log": true`. Whenever a transcript is detected as English, it is appended to:

```
study-note/english-practice/voice-log/YYYY-MM-DD.md
```

Each line: `` - `HH:MM:SS` (Ns) <transcript>``. Feed the daily file to the `english-coach` skill for batch grammar review.

## Auto-start on login (macOS)

```bash
./autostart-mac.sh install     # writes ~/Library/LaunchAgents/com.user.voice-input.plist
./autostart-mac.sh status
./autostart-mac.sh uninstall
```

Logs at `~/Library/Logs/voice-input.log` and `voice-input.err`. After install you must grant **Microphone** + **Accessibility** to the venv `python` binary (the install command prints the exact path). Auto-restart on crash; clean Quit from the tray menu does not respawn.

## Roadmap

- [x] Smoke test on macOS
- [x] Apple Silicon fast path via `mlx-whisper`
- [x] System tray icon
- [x] English-practice integration
- [x] Auto-start on login (macOS)
- [ ] Auto-start on login (Windows / Task Scheduler)
- [ ] Traditional Chinese post-processing (OpenCC)
- [ ] VAD-triggered hands-free mode (alternative to push-to-talk)

See `HANDOFF.md` for design notes.
