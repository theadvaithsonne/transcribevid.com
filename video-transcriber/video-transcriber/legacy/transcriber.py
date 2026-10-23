"""Core transcription logic: video/audio file -> timestamped segments.

Uses faster-whisper (CPU, int8) and a bundled ffmpeg from imageio-ffmpeg,
so nothing needs to be installed system-wide.
"""
import os
import subprocess
import tempfile

import numpy as np
from faster_whisper import WhisperModel

_MODEL_CACHE = {}


def get_ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def load_model(size="small"):
    if size not in _MODEL_CACHE:
        _MODEL_CACHE[size] = WhisperModel(size, device="cpu", compute_type="int8")
    return _MODEL_CACHE[size]


def extract_audio(path):
    """Decode any media file to 16 kHz mono float32 PCM via ffmpeg."""
    cmd = [get_ffmpeg(), "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "16000",
           "-f", "s16le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def fmt_ts(sec, srt=False):
    ms = int(round(sec * 1000))
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    if srt:
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    return f"{h:02d}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def transcribe(path, model_size="small", language=None, progress=None):
    """Return dict with language, segments [{start,end,text}], and duration."""
    audio = extract_audio(path)
    duration = len(audio) / 16000.0
    model = load_model(model_size)
    segs, info = model.transcribe(audio, language=language, vad_filter=True)
    out = []
    for s in segs:
        out.append({"start": s.start, "end": s.end, "text": s.text.strip()})
        if progress:
            progress(min(s.end / duration, 1.0) if duration else 1.0)
    return {"language": info.language, "language_probability": info.language_probability,
            "duration": duration, "segments": out}


def to_txt(result, timestamps=True):
    lines = []
    for s in result["segments"]:
        lines.append(f"[{fmt_ts(s['start'])}] {s['text']}" if timestamps else s["text"])
    return "\n".join(lines)


def to_srt(result):
    blocks = []
    for i, s in enumerate(result["segments"], 1):
        blocks.append(f"{i}\n{fmt_ts(s['start'], True)} --> {fmt_ts(s['end'], True)}\n{s['text']}\n")
    return "\n".join(blocks)


if __name__ == "__main__":
    import sys
    r = transcribe(sys.argv[1])
    print(to_txt(r))
