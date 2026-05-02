# Voice Input — Handoff Notes

> **For the next Claude session (likely on macOS)**: read this end-to-end before touching code. It captures every decision made on the Windows side so you can pick up cleanly.

## What we're building

A free, cross-platform voice-input tool. Hold a hotkey → speak → release → the transcribed text gets pasted at the cursor in any app. Equivalent to Wispr Flow, but local and free, powered by `faster-whisper`.

The user is a Taiwanese frontend engineer switching from Windows 10 to macOS for development of this tool. They want this both for personal use and as material for an internal "AI-era dev workflow" talk at their company. They're targeting foreign-company interviews within ~6 months, so an English-practice integration is a likely future extension (deliberately deferred from v1).

## Decisions already made

| Topic | Choice | Why |
|---|---|---|
| Engine | `faster-whisper` | 3–4× faster than vanilla `openai-whisper` on CPU; cross-platform; CPU/GPU both fine |
| Default model | `small` (multilingual) | Best balance of speed + Chinese accuracy on CPU. ~500MB |
| Recording lib | `sounddevice` | Cross-platform; needs PortAudio on Mac (`brew install portaudio`) |
| Hotkey lib | `pynput` | Cross-platform, no admin required (vs `keyboard` lib which needs admin on Win) |
| Trigger style | **Push-to-talk** (hold to record, release to transcribe) | Avoids voice-activity-detection edge cases; user has explicit control |
| Output method | Clipboard + simulated paste (`Ctrl+V` / `Cmd+V`) | Works for CJK characters; avoids `keyboard.write()` Unicode issues |
| OS-aware paste | `platform.system() == "Darwin"` → `Cmd+V`, else `Ctrl+V` | One code path, two platforms |
| Default hotkey | `Ctrl+Alt+Space` | Unlikely to clash; works on both OSes (Mac users may want to switch to `<cmd>+<alt>+<space>` later) |
| Config | `config.json` (gitignored) + `config.example.json` (committed) | User-local overrides without leaking personal prefs |

## Deliberately out of scope for v1

- System tray icon / GUI
- Auto-start on login
- english-practice integration (logging English utterances to `english-practice/voice-log/`)
- Live streaming transcription (we batch the whole hold-period)
- LLM post-processing (cleaning口語 → 書面語)
- Mac-specific MLX/Core ML acceleration (note: `mlx-whisper` would be much faster on Apple Silicon — flagged for future)

## File layout

```
voice-input/
├── HANDOFF.md              # this file
├── README.md               # user-facing docs
├── app.py                  # main script (~150 lines)
├── requirements.txt
├── config.example.json
├── setup-mac.sh
├── setup-win.ps1
└── .gitignore              # venv/, models/, config.json, __pycache__/
```

## How the code is structured (`app.py`)

1. `load_config()` — merges `config.json` over `DEFAULT_CONFIG`
2. `resolve_compute()` — picks `device` and `compute_type` from `"auto"` (uses CUDA if available, else CPU int8)
3. `Recorder` class — wraps `sounddevice.InputStream` with start/stop and a frame buffer
4. `paste_text()` — `pyperclip.copy()` then simulate platform-specific paste shortcut via `pynput.keyboard.Controller`
5. `main()` — load model, register `pynput.keyboard.Listener`, track pressed-key set, start/stop recording when the configured hotkey set is fully pressed/no-longer-pressed
6. Transcription runs on a background thread so the listener stays responsive

The push-to-talk implementation tracks a `pressed` set and the parsed hotkey set; recording starts when `hotkey_keys.issubset(pressed)` becomes true and stops when it's no longer true. This is more robust than `pynput.HotKey` (which is press-fires-once, not hold-style).

## Mac setup (what the next session will need to do)

```bash
cd voice-input
brew install portaudio          # required for sounddevice
./setup-mac.sh                   # creates venv, installs deps
source venv/bin/activate
cp config.example.json config.json   # then edit if needed
python app.py
```

Then grant **Microphone** + **Accessibility** permissions to the Python/Terminal binary in System Settings → Privacy & Security. First run will fail silently on hotkey until Accessibility is granted.

First model download (~500MB for `small`) happens automatically on first transcription call — takes a minute.

## Likely next steps for Mac session

In rough priority order:

1. **Smoke test on Mac** — `python app.py`, hold hotkey, speak, verify text appears in any text field.
2. **Tune push-to-talk feel** — current minimum recording length is `0.3s`. May need to adjust based on real usage.
3. **Add Apple Silicon fast path** — if user is on M-series, evaluate `mlx-whisper` as an alternative engine. Abstract into an `engine` interface so swap is one config flip.
4. **System tray icon** — `pystray` for both OSes; shows recording state.
5. **English-practice hook** — when `language_hint == "en"` in config, append `(timestamp, transcript)` to `study-note/english-practice/voice-log/YYYY-MM-DD.md`. The `english-coach` skill can later batch-review these.
6. **Auto-start on login** — `launchctl` plist on Mac, Task Scheduler entry on Win.

## Things to double-check before extending

- `pynput.keyboard.HotKey.parse()` returns a set of `Key`/`KeyCode` objects. Canonicalization via `listener.canonical()` is essential, otherwise `ctrl_l` and `ctrl_r` are seen as different keys.
- On Mac, `pynput`'s listener requires Accessibility permission, otherwise `on_press` never fires. There is no error message — it just silently does nothing.
- `sounddevice` on Mac sometimes picks the wrong default input. If transcription returns empty, list devices with `sd.query_devices()` and pin `device=...` in `InputStream`.
- `faster-whisper` will try to use CUDA if `nvidia-cublas` libs are present. On Mac this won't apply; on Win without GPU, it falls back to CPU automatically when `device="auto"`.

## Known limitations of v1

- No echo cancellation; loud speakers nearby may be transcribed.
- VAD is on (`vad_filter=True`) but won't filter mid-sentence pauses well.
- If the user releases the hotkey mid-word, the audio is cut.
- Non-text apps (terminals with weird paste handling, password fields) may behave oddly.

## Why these tradeoffs (in case the user pushes back)

- **Why not Wispr Flow?** Paid, closed-source, sends audio to their servers. User wanted free + local first.
- **Why not WhisperWriter (the OSS one)?** Heavier than needed; the user wanted ownership of the code for an internal demo.
- **Why push-to-talk over VAD?** Predictable, no false starts, simpler to debug. VAD-triggered recording is a good v2 if wanted.
- **Why clipboard paste over typing?** `keyboard.write()` and `pynput.Controller.type()` both have issues with CJK and emoji on Windows. Clipboard is universal.

## Git state at handoff

- Branch: `main`
- Files committed: this `HANDOFF.md`, `README.md`, `app.py`, `requirements.txt`, `config.example.json`, `setup-mac.sh`, `setup-win.ps1`, `.gitignore`
- Remote: `origin` (GitHub: a26620236/study-note)
- Pushed: yes — Mac side just needs `git pull`
