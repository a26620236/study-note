"""Voice input — push-to-talk Whisper transcription with clipboard paste.

Hold the configured hotkey to record; release to transcribe and paste at
the cursor. Cross-platform (Windows / macOS).
"""
from __future__ import annotations

import json
import platform
import sys
import threading
from pathlib import Path

import numpy as np
import pyperclip
import sounddevice as sd
from faster_whisper import WhisperModel
from pynput import keyboard

CONFIG_PATH = Path(__file__).parent / "config.json"
EXAMPLE_PATH = Path(__file__).parent / "config.example.json"

DEFAULT_CONFIG = {
    "model_size": "small",
    "language": None,            # None = auto-detect; "en" / "zh" to force
    "device": "auto",            # "auto" | "cpu" | "cuda"
    "compute_type": "auto",      # "auto" | "int8" | "float16" | "float32"
    "sample_rate": 16000,
    "hotkey": "<ctrl>+<alt>+<space>",
    "min_recording_seconds": 0.3,
    "paste_after_transcribe": True,
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
    device, compute = resolve_compute(cfg)
    print(f"[init] loading model={cfg['model_size']} device={device} compute={compute}")
    model = WhisperModel(cfg["model_size"], device=device, compute_type=compute)
    print("[init] model ready")

    recorder = Recorder(cfg["sample_rate"])
    lock = threading.Lock()

    hotkey_keys = set(keyboard.HotKey.parse(cfg["hotkey"]))
    pressed: set = set()

    def transcribe(audio: np.ndarray):
        if audio.size < cfg["sample_rate"] * cfg["min_recording_seconds"]:
            print("[skip] recording too short")
            return
        segments, info = model.transcribe(
            audio,
            language=cfg["language"],
            vad_filter=True,
        )
        text = " ".join(s.text.strip() for s in segments).strip()
        print(f"[lang={info.language}] {text}")
        if text and cfg["paste_after_transcribe"]:
            paste_text(text)

    def start_recording():
        with lock:
            if recorder.recording:
                return
            print("[rec] start")
            recorder.start()

    def stop_and_transcribe():
        with lock:
            if not recorder.recording:
                return
            audio = recorder.stop()
            print(f"[rec] stop ({audio.size / cfg['sample_rate']:.1f}s)")
        threading.Thread(target=transcribe, args=(audio,), daemon=True).start()

    listener_ref: dict = {}

    def on_press(key):
        canonical = listener_ref["listener"].canonical(key)
        pressed.add(canonical)
        if hotkey_keys.issubset(pressed):
            start_recording()

    def on_release(key):
        canonical = listener_ref["listener"].canonical(key)
        pressed.discard(canonical)
        if recorder.recording and not hotkey_keys.issubset(pressed):
            stop_and_transcribe()

    print(f"[ready] hold {cfg['hotkey']} to record. Ctrl+C to quit.")
    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener_ref["listener"] = listener
        listener.join()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[exit] bye")
