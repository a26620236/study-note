"""Voice input — push-to-talk Whisper transcription with clipboard paste.

Hold the configured hotkey to record; release to transcribe and paste at
the cursor. Cross-platform (Windows / macOS).
"""
from __future__ import annotations

import json
import platform
import sys
import threading
from datetime import datetime
from pathlib import Path

import numpy as np
import pyperclip
import sounddevice as sd
from pynput import keyboard

CONFIG_PATH = Path(__file__).parent / "config.json"
EXAMPLE_PATH = Path(__file__).parent / "config.example.json"

DEFAULT_CONFIG = {
    "engine": "auto",            # "auto" | "faster-whisper" | "mlx-whisper"
    "model_size": "small",
    "language": None,            # None = auto-detect; "en" / "zh" to force
    "device": "auto",            # "auto" | "cpu" | "cuda" (faster-whisper only)
    "compute_type": "auto",      # "auto" | "int8" | "float16" | "float32"
    "sample_rate": 16000,
    "hotkey": "<ctrl>+<alt>+<space>",  # legacy: used only if "hotkeys" not set
    "hotkeys": None,                   # list of {keys, language}; overrides "hotkey"+"language"
    "min_recording_seconds": 0.3,
    "paste_after_transcribe": True,
    "english_log": False,        # log English transcripts for later english-coach review
    "english_log_dir": None,     # null = <repo>/english-practice/voice-log; or absolute path
    "tray_enabled": True,        # menu-bar / system-tray icon with recording state
}


def load_config() -> dict:
    source = CONFIG_PATH if CONFIG_PATH.exists() else EXAMPLE_PATH
    if source.exists():
        with source.open(encoding="utf-8") as f:
            return {**DEFAULT_CONFIG, **json.load(f)}
    return DEFAULT_CONFIG


def resolve_compute(cfg: dict) -> tuple[str, str]:
    device = cfg["device"]
    compute = cfg["compute_type"]
    if device == "auto":
        try:
            import torch  # type: ignore
            device = "cuda" if torch.cuda.is_available() else "cpu"
        except ImportError:
            device = "cpu"
    if compute == "auto":
        compute = "float16" if device == "cuda" else "int8"
    return device, compute


def is_apple_silicon() -> bool:
    return platform.system() == "Darwin" and platform.machine() == "arm64"


MLX_REPO_BY_SIZE = {
    "tiny": "mlx-community/whisper-tiny-mlx",
    "base": "mlx-community/whisper-base-mlx",
    "small": "mlx-community/whisper-small-mlx",
    "medium": "mlx-community/whisper-medium-mlx",
    "large-v3": "mlx-community/whisper-large-v3-mlx",
}


class FasterWhisperEngine:
    name = "faster-whisper"

    def __init__(self, model_size: str, device: str, compute_type: str):
        from faster_whisper import WhisperModel  # type: ignore
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
        self.label = f"faster-whisper/{model_size} ({device}/{compute_type})"

    def transcribe(self, audio: np.ndarray, language: str | None) -> tuple[str, str]:
        segments, info = self.model.transcribe(audio, language=language, vad_filter=True)
        text = " ".join(s.text.strip() for s in segments).strip()
        return text, info.language


class MlxWhisperEngine:
    name = "mlx-whisper"

    def __init__(self, model_size: str):
        import mlx_whisper  # type: ignore
        self._mlx = mlx_whisper
        self.repo = MLX_REPO_BY_SIZE.get(model_size, model_size)
        self.label = f"mlx-whisper/{self.repo}"

    def transcribe(self, audio: np.ndarray, language: str | None) -> tuple[str, str]:
        result = self._mlx.transcribe(audio, path_or_hf_repo=self.repo, language=language)
        return result["text"].strip(), result.get("language", language or "")


def make_engine(cfg: dict):
    choice = cfg.get("engine", "auto")
    if choice == "auto":
        choice = "mlx-whisper" if is_apple_silicon() else "faster-whisper"
    if choice == "mlx-whisper":
        if not is_apple_silicon():
            print("[warn] mlx-whisper requested on non-Apple-Silicon; falling back to faster-whisper", file=sys.stderr)
            choice = "faster-whisper"
        else:
            return MlxWhisperEngine(cfg["model_size"])
    if choice == "faster-whisper":
        device, compute = resolve_compute(cfg)
        return FasterWhisperEngine(cfg["model_size"], device, compute)
    raise ValueError(f"Unknown engine: {choice!r} (expected 'auto' | 'faster-whisper' | 'mlx-whisper')")


class Recorder:
    def __init__(self, sample_rate: int):
        self.sample_rate = sample_rate
        self.frames: list[np.ndarray] = []
        self.stream: sd.InputStream | None = None
        self.recording = False

    def _callback(self, indata, frames, time_info, status):
        if status:
            print(f"[audio] {status}", file=sys.stderr)
        self.frames.append(indata.copy())

    def start(self):
        self.frames = []
        self.recording = True
        self.stream = sd.InputStream(
            channels=1,
            samplerate=self.sample_rate,
            dtype="float32",
            callback=self._callback,
        )
        self.stream.start()

    def stop(self) -> np.ndarray:
        self.recording = False
        if self.stream is not None:
            self.stream.stop()
            self.stream.close()
            self.stream = None
        if not self.frames:
            return np.zeros(0, dtype=np.float32)
        return np.concatenate(self.frames, axis=0).flatten()


def make_status_icon(color: tuple[int, int, int]):
    from PIL import Image, ImageDraw
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Mic capsule
    d.rounded_rectangle((22, 8, 42, 38), radius=10, fill=color)
    # Stand arc
    d.arc((14, 22, 50, 50), start=0, end=180, fill=color, width=4)
    # Stem
    d.rectangle((30, 44, 34, 54), fill=color)
    # Base
    d.rectangle((20, 54, 44, 58), fill=color)
    return img


STATUS_COLORS = {
    "idle": (128, 128, 128),
    "recording": (220, 40, 40),
    "transcribing": (220, 180, 40),
}


def english_log_path(cfg: dict) -> Path:
    override = cfg.get("english_log_dir")
    if override:
        base = Path(override).expanduser()
    else:
        base = Path(__file__).resolve().parent.parent / "english-practice" / "voice-log"
    return base


def append_english_log(cfg: dict, text: str, audio_seconds: float):
    base = english_log_path(cfg)
    base.mkdir(parents=True, exist_ok=True)
    now = datetime.now()
    log_file = base / f"{now.strftime('%Y-%m-%d')}.md"
    is_new = not log_file.exists()
    with log_file.open("a", encoding="utf-8") as f:
        if is_new:
            f.write(f"# Voice Log — {now.strftime('%Y-%m-%d')}\n\n")
            f.write("> Auto-captured English push-to-talk transcripts. ")
            f.write("Feed to `english-coach` for batch review.\n\n")
        f.write(f"- `{now.strftime('%H:%M:%S')}` ({audio_seconds:.1f}s) {text}\n")


def paste_text(text: str):
    if not text:
        return
    pyperclip.copy(text)
    ctl = keyboard.Controller()
    paste_mod = keyboard.Key.cmd if platform.system() == "Darwin" else keyboard.Key.ctrl
    with ctl.pressed(paste_mod):
        ctl.press("v")
        ctl.release("v")


def main():
    cfg = load_config()
    print(f"[init] building engine (config engine={cfg.get('engine','auto')})")
    engine = make_engine(cfg)
    print(f"[init] engine ready: {engine.label}")

    recorder = Recorder(cfg["sample_rate"])
    lock = threading.Lock()

    raw_hotkeys = cfg.get("hotkeys") or [{"keys": cfg["hotkey"], "language": cfg["language"]}]
    default_mode = cfg.get("hotkey_mode", "push-to-talk")
    hotkey_specs = [
        (
            set(keyboard.HotKey.parse(h["keys"])),
            h.get("language"),
            h["keys"],
            h.get("mode", default_mode),
        )
        for h in raw_hotkeys
    ]
    pressed: set = set()
    active = {"keys": None, "lang": None, "mode": None}
    autostop_timer: dict = {"thread": None}
    max_seconds = float(cfg.get("max_recording_seconds", 60))

    icon_holder: dict = {"icon": None}

    def set_status(state: str):
        icon = icon_holder["icon"]
        if icon is None:
            return
        icon.icon = make_status_icon(STATUS_COLORS[state])
        icon.title = f"voice-input — {state}"

    def transcribe(audio: np.ndarray, language_override: str | None):
        if audio.size < cfg["sample_rate"] * cfg["min_recording_seconds"]:
            print("[skip] recording too short")
            set_status("idle")
            return
        set_status("transcribing")
        try:
            text, lang = engine.transcribe(audio, language=language_override)
            print(f"[lang={lang}] {text}")
            if not text:
                return
            if cfg["paste_after_transcribe"]:
                paste_text(text)
            if cfg.get("english_log") and lang == "en":
                try:
                    append_english_log(cfg, text, audio.size / cfg["sample_rate"])
                except Exception as exc:
                    print(f"[warn] english_log failed: {exc}", file=sys.stderr)
        finally:
            set_status("idle")

    def start_recording():
        with lock:
            if recorder.recording:
                return
            print("[rec] start")
            recorder.start()
        set_status("recording")

    def stop_and_transcribe(lang: str | None):
        with lock:
            if not recorder.recording:
                return
            audio = recorder.stop()
            print(f"[rec] stop ({audio.size / cfg['sample_rate']:.1f}s, lang_hint={lang})")
        threading.Thread(target=transcribe, args=(audio, lang), daemon=True).start()

    listener_ref: dict = {}

    def best_match_in(pressed_set):
        # Pick the most specific hotkey whose keys are all in pressed_set.
        candidates = [s for s in hotkey_specs if s[0].issubset(pressed_set)]
        candidates.sort(key=lambda x: -len(x[0]))
        return candidates[0] if candidates else None

    def begin_active(keys, lang, mode):
        active["keys"] = keys
        active["lang"] = lang
        active["mode"] = mode
        start_recording()
        # Safety timeout: if user forgets to press toggle again, auto-stop
        if mode == "toggle" and max_seconds > 0:
            def autostop():
                import time
                time.sleep(max_seconds)
                if recorder.recording and active["keys"] is keys:
                    print(f"[rec] auto-stop after {max_seconds:.0f}s (toggle timeout)")
                    finish_active()
            t = threading.Thread(target=autostop, daemon=True)
            autostop_timer["thread"] = t
            t.start()

    def finish_active():
        lang = active["lang"]
        active["keys"] = None
        active["lang"] = None
        active["mode"] = None
        stop_and_transcribe(lang)

    def on_press(key):
        canonical = listener_ref["listener"].canonical(key)
        was_complete = best_match_in(pressed)
        pressed.add(canonical)
        if was_complete is not None:
            return  # Held-key event, ignore
        m = best_match_in(pressed)
        if m is None:
            return
        keys, lang, _, mode = m
        if mode == "toggle":
            if recorder.recording and active["keys"] is not None:
                finish_active()
            else:
                begin_active(keys, lang, mode)
        else:  # push-to-talk
            if not recorder.recording:
                begin_active(keys, lang, mode)

    def on_release(key):
        canonical = listener_ref["listener"].canonical(key)
        pressed.discard(canonical)
        if (
            recorder.recording
            and active["mode"] == "push-to-talk"
            and active["keys"] is not None
            and not active["keys"].issubset(pressed)
        ):
            finish_active()

    bindings_summary = ", ".join(f"{label}→{lang or 'auto'}({mode})" for _, lang, label, mode in hotkey_specs)
    print(f"[ready] {bindings_summary}. Ctrl+C to quit.")
    listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    listener_ref["listener"] = listener
    listener.start()

    if cfg.get("tray_enabled", True):
        try:
            import pystray  # type: ignore
        except ImportError:
            print("[warn] pystray not installed; tray disabled", file=sys.stderr)
            listener.join()
            return

        def on_quit(icon, item):
            listener.stop()
            icon.stop()

        menu_items = [pystray.MenuItem(f"engine: {engine.name}", None, enabled=False)]
        for _, lang, label, mode in hotkey_specs:
            menu_items.append(pystray.MenuItem(f"{label} → {lang or 'auto'} ({mode})", None, enabled=False))
        menu_items.append(pystray.Menu.SEPARATOR)
        menu_items.append(pystray.MenuItem("Quit", on_quit))
        menu = pystray.Menu(*menu_items)
        icon = pystray.Icon(
            "voice-input",
            icon=make_status_icon(STATUS_COLORS["idle"]),
            title="voice-input — idle",
            menu=menu,
        )
        icon_holder["icon"] = icon
        icon.run()
    else:
        try:
            listener.join()
        except KeyboardInterrupt:
            listener.stop()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[exit] bye")
