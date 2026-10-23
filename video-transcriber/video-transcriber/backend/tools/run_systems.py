"""Run several ASR configurations ("systems") over a set of media files and store the raw,
word-level results for comparison (accuracy campaign tooling; not used by the app itself).

    python -m tools.run_systems --systems campaign/systems.json --out data/campaign \
        --video V-1=C:/path/V-1.mp4 --video V-2=C:/path/V-2.mp4

Resumable: an existing <out>/<video>/<system>.json is skipped, so it can be re-run safely after
an interruption or after adding systems. Systems that share a model run back to back so each
model is loaded once. Audio is decoded once per (video, enhance) and cached on the output drive.
"""
import argparse
import json
import logging
import os
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import config, engine  # noqa: E402

log = logging.getLogger("vt.campaign")

DEFAULT_SYSTEM = {
    "model": "small", "beam_size": 5, "language": "auto", "prompt": "", "batch_size": None,
    "vad": True, "vad_params": {"threshold": 0.45, "min_silence_duration_ms": 500, "speech_pad_ms": 400},
    "enhance_audio": True, "word_timestamps": True, "condition_on_previous": False,
    "temperature": [0.0, 0.2, 0.4, 0.6, 0.8, 1.0], "best_of": 5, "cpu_threads": 0,
    "no_speech_threshold": 0.6, "log_prob_threshold": -1.0, "compression_ratio_threshold": 2.4,
    "hallucination_silence_threshold": 2.0, "repetition_penalty": 1.0, "patience": 1.0,
    "max_seconds": None,   # only transcribe the first N seconds (quick experiments)
}


def decode(video_dir: Path, path: str, enhance: bool, max_seconds=None):
    """Cached 16 kHz mono float32 audio for a video; returns a read-only memmap."""
    tag = "enh" if enhance else "raw"
    f = video_dir / f"audio_{tag}.f32"
    if not f.exists():
        audio, cleanup = engine.extract_audio(path, enhance, workdir=str(video_dir))
        raw = Path(audio.filename)
        del audio
        os.replace(raw, f)
    a = np.memmap(f, dtype=np.float32, mode="r")
    return a[: int(max_seconds * engine.SAMPLE_RATE)] if max_seconds else a


def run_one(model, audio, s, language):
    from faster_whisper import BatchedInferencePipeline
    kw = dict(
        language=language, task="transcribe", beam_size=int(s["beam_size"]), best_of=int(s["best_of"]),
        patience=float(s["patience"]), temperature=s["temperature"],
        condition_on_previous_text=bool(s["condition_on_previous"]),
        initial_prompt=(s["prompt"] or "").strip() or None,
        compression_ratio_threshold=s["compression_ratio_threshold"],
        log_prob_threshold=s["log_prob_threshold"], no_speech_threshold=s["no_speech_threshold"],
        word_timestamps=bool(s["word_timestamps"]), repetition_penalty=s["repetition_penalty"],
        vad_filter=bool(s["vad"]), vad_parameters=s["vad_params"],
        hallucination_silence_threshold=s["hallucination_silence_threshold"] if s["word_timestamps"] else None,
        language_detection_segments=4, language_detection_threshold=0.5,
    )
    pipe = BatchedInferencePipeline(model) if s.get("batch_size") else model
    if s.get("batch_size"):
        kw["batch_size"] = int(s["batch_size"])
        kw.pop("condition_on_previous_text", None)  # not supported by the batched pipeline
    kw = engine._supported(pipe.transcribe, **kw)
    t0 = time.perf_counter()
    segs, info = pipe.transcribe(audio, **kw)
    out = []
    for g in segs:
        out.append({
            "start": round(float(g.start), 3), "end": round(float(g.end), 3), "text": g.text.strip(),
            "avg_logprob": round(float(g.avg_logprob), 4), "no_speech_prob": round(float(g.no_speech_prob), 4),
            "compression_ratio": round(float(g.compression_ratio), 3),
            "words": [{"start": round(float(w.start), 3), "end": round(float(w.end), 3), "word": w.word,
                       "probability": round(float(w.probability), 4)} for w in (g.words or [])],
        })
    return out, info, time.perf_counter() - t0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--systems", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--video", action="append", required=True, metavar="NAME=PATH")
    ap.add_argument("--only", help="comma separated system names to run")
    ap.add_argument("--max-seconds", type=float, default=None)
    a = ap.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s", datefmt="%H:%M:%S")

    systems = json.load(open(a.systems, encoding="utf-8"))
    systems = [{**DEFAULT_SYSTEM, **s} for s in systems]
    if a.only:
        keep = set(a.only.split(","))
        systems = [s for s in systems if s["name"] in keep]
    videos = dict(v.split("=", 1) for v in a.video)
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    # run in file order, but keep systems that share a model together so each model loads once
    first = {}
    for s in systems:
        first.setdefault((s["model"], s["cpu_threads"]), len(first))
    order = sorted(systems, key=lambda s: first[(s["model"], s["cpu_threads"])])
    from faster_whisper import WhisperModel
    current = (None, None)
    for s in order:
        todo = [(v, p) for v, p in videos.items() if not (out / v / f"{s['name']}.json").exists()]
        if not todo:
            continue
        key = (s["model"], s["cpu_threads"])
        if current[0] != key:
            current = (key, None)
            device, compute = engine.device_info()
            t0 = time.perf_counter()
            model = WhisperModel(s["model"], device=device, compute_type=compute,
                                 cpu_threads=int(s["cpu_threads"]), download_root=config.MODEL_DIR)
            log.info("model %s loaded in %.1fs (threads=%s)", s["model"], time.perf_counter() - t0, s["cpu_threads"])
        for v, p in todo:
            vd = out / v
            vd.mkdir(parents=True, exist_ok=True)
            meta_f = vd / "meta.json"
            meta = json.load(open(meta_f)) if meta_f.exists() else {}
            if s.get("english_only") and meta.get("language") not in (None, "en"):
                log.info("%-6s %-28s skipped (English-only model, video is %s)", v, s["name"], meta["language"])
                continue
            audio = decode(vd, p, s["enhance_audio"], s.get("max_seconds") or a.max_seconds)
            lang = None if s["language"] == "auto" else s["language"]
            if lang is None and s["language"] == "auto" and meta.get("language"):
                lang = meta["language"]
            segs, info, took = run_one(model, audio, s, lang)
            dur = len(audio) / engine.SAMPLE_RATE
            if "language" not in meta:
                meta.update(language=info.language, language_probability=round(float(info.language_probability), 3),
                            duration=round(dur, 2), source=p)
                json.dump(meta, open(meta_f, "w"), indent=1)
            res = {"video": v, "system": s["name"], "config": s, "language": info.language,
                   "language_probability": round(float(info.language_probability), 3),
                   "duration": round(dur, 2), "seconds": round(took, 2), "realtime_x": round(dur / took, 2),
                   "segments": segs}
            tmp = out / v / f"{s['name']}.json.tmp"
            json.dump(res, open(tmp, "w", encoding="utf-8"), ensure_ascii=False)
            os.replace(tmp, out / v / f"{s['name']}.json")
            log.info("%-6s %-28s %6.1fs for %6.1fs audio (%.2fx) lang=%s segs=%d words=%d", v, s["name"], took,
                     dur, dur / took, info.language, len(segs), sum(len(g["words"]) or len(g["text"].split()) for g in segs))
            del audio


if __name__ == "__main__":
    main()
