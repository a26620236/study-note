#!/usr/bin/env python3
"""
english-coach: edge-tts audio generator.

Reads the "## Polished Dialogue" section of a session markdown file and
generates a high-quality MP3 using Microsoft Edge's neural voices via
edge-tts (free, no API key, requires internet).

Usage:
  python audio_edge.py <session_file> [-o <output.mp3>]
                       [--voice-a NAME] [--voice-b NAME]

Default voices:
  Speaker A: en-US-AriaNeural   (female, conversational)
  Speaker B: en-US-GuyNeural    (male,   conversational)

Run `python -m edge_tts --list-voices` to see all voices.
"""
import argparse
import asyncio
import re
import sys
from pathlib import Path

import edge_tts


DEFAULT_VOICE_A = "en-US-AriaNeural"  # first English speaker
DEFAULT_VOICE_B = "en-US-GuyNeural"   # second English speaker

# Speaker labels that mark Chinese translation lines in the session markdown.
# The session keeps these lines for bilingual reading reference, but the audio
# is intentionally English-only (commute listening); we skip them at TTS time.
SKIP_SPEAKER_LABELS = {"中", "中文", "ZH", "zh", "中譯", "翻譯"}

DIALOGUE_RE = re.compile(
    r"##\s*Polished\s*Dialogue\s*\r?\n+(.+?)(?=\r?\n##\s|\Z)",
    re.DOTALL,
)
LINE_RE = re.compile(r"^\s*\[?([^\]\n:]+?)\]?\s*:\s*(.+?)\s*$")


def parse_session(path: Path):
    text = path.read_text(encoding="utf-8")
    m = DIALOGUE_RE.search(text)
    if not m:
        sys.exit(f"ERROR: '## Polished Dialogue' section not found in {path}")
    body = m.group(1).strip()
    body = "\n".join(ln for ln in body.splitlines() if not ln.lstrip().startswith(">"))

    turns = []
    skipped = 0
    for ln in body.splitlines():
        if not ln.strip():
            continue
        lm = LINE_RE.match(ln)
        if lm:
            speaker = lm.group(1).strip()
            line_text = lm.group(2).strip()
            if not line_text:
                continue
            if speaker in SKIP_SPEAKER_LABELS:
                skipped += 1
                continue
            turns.append((speaker, line_text))

    if not turns:
        sys.exit("ERROR: no dialogue lines parsed from '## Polished Dialogue'.")
    if skipped:
        print(f"(Skipped {skipped} translation line(s) — audio is English-only by design.)")
    return turns


async def synthesize(text: str, voice: str) -> bytes:
    """Stream one MP3 chunk for given text + voice."""
    communicate = edge_tts.Communicate(text, voice)
    buf = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            buf.extend(chunk["data"])
    return bytes(buf)


async def main_async(args):
    session = Path(args.session_file)
    if not session.exists():
        sys.exit(f"ERROR: session file not found: {session}")

    turns = parse_session(session)

    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
    else:
        audio_dir = session.parent.parent / "audio"
        audio_dir.mkdir(parents=True, exist_ok=True)
        out = audio_dir / (session.stem + ".mp3")

    # First two distinct English speakers get voice A / B in encounter order.
    # 3rd+ unique speaker alternates. (Translation lines were already filtered out.)
    speaker_voice = {}
    for sp, _ in turns:
        if sp not in speaker_voice:
            idx = len(speaker_voice)
            speaker_voice[sp] = args.voice_a if idx % 2 == 0 else args.voice_b

    intro = f"English Practice Session. {session.stem.replace('-', ' ')}."

    print(f"Synthesising intro + {len(turns)} turns via edge-tts...", flush=True)

    parts = [await synthesize(intro, args.voice_a)]
    for i, (speaker, line_text) in enumerate(turns, 1):
        voice = speaker_voice[speaker]
        try:
            audio = await synthesize(line_text, voice)
        except Exception as e:
            sys.exit(f"ERROR on turn {i} ({speaker}): {e}")
        parts.append(audio)
        print(f"  [{i:>2}/{len(turns)}] {speaker:<12} -> {voice}  ({len(audio):>6} bytes)", flush=True)

    # Raw MP3 byte concatenation: works because all chunks come from the
    # same encoder/profile (edge-tts always returns 24kHz mono CBR mp3).
    out.write_bytes(b"".join(parts))

    size_kb = out.stat().st_size / 1024
    print()
    print(f"OK. Audio saved to: {out}  ({size_kb:.1f} KB)")
    print("Voice mapping:")
    for sp, v in speaker_voice.items():
        print(f"  - {sp} -> {v}")


def main():
    ap = argparse.ArgumentParser(description="Generate session audio via edge-tts neural voices.")
    ap.add_argument("session_file", help="Path to session markdown")
    ap.add_argument("-o", "--output", help="Output MP3 path (default: english-practice/audio/<basename>.mp3)")
    ap.add_argument("--voice-a", default=DEFAULT_VOICE_A, help=f"Voice for first speaker (default: {DEFAULT_VOICE_A})")
    ap.add_argument("--voice-b", default=DEFAULT_VOICE_B, help=f"Voice for second speaker (default: {DEFAULT_VOICE_B})")
    args = ap.parse_args()
    try:
        asyncio.run(main_async(args))
    except KeyboardInterrupt:
        sys.exit(130)


if __name__ == "__main__":
    main()
