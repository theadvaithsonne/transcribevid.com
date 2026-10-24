"""Compare real ASR engines on the SAME short clip, with bounded runtime.

python -m tools.compare_engines video.mp4 --seconds 60 --download
No accuracy claim is made without --reference FILE --reference-verified.
"""
import argparse
import json
import os
import subprocess
import tempfile
import time
from pathlib import Path

from app import config, engine, formats
from app.schemas import JobOptions
from app.worker import ProcessWorker
from . import metrics, textnorm


def score(reference, segments):
    text = " ".join(s.get("original_text", s["text"]) for s in segments)
    return metrics.wer(textnorm.normalize(reference), textnorm.normalize(text))


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("source", type=Path)
    p.add_argument("--seconds", type=float, default=60)
    p.add_argument("--start", type=float, default=0)
    p.add_argument("--timeout", type=float, default=300, help="Maximum seconds PER engine, including loading")
    p.add_argument("--models", nargs="+", default=["small", "qwen3-asr-0.6b"])
    p.add_argument("--language", default="hi")
    p.add_argument("--enhance-audio", action="store_true", help="Compare against the unfiltered baseline separately")
    p.add_argument("--download", action="store_true", help="Allow missing model weights to download")
    p.add_argument("--reference", type=Path)
    p.add_argument("--reference-verified", action="store_true")
    p.add_argument("--out", type=Path, default=Path("../output/review/engine-comparison"))
    args = p.parse_args()
    if not 0 < args.seconds <= 120 or args.start < 0 or args.timeout <= 0:
        p.error("Use 0 < seconds <= 120, start >= 0 and timeout > 0.")
    if args.reference_verified and not args.reference:
        p.error("--reference-verified requires --reference.")
    if not args.download:
        os.environ["HF_HUB_OFFLINE"] = "1"
    args.out.mkdir(parents=True, exist_ok=True)
    config.TMP_DIR.mkdir(parents=True, exist_ok=True)
    reports = []
    reference = args.reference.read_text(encoding="utf-8") if args.reference else None
    with tempfile.TemporaryDirectory(dir=config.TMP_DIR, prefix="comparison-") as folder:
        clip = Path(folder) / "clip.wav"
        subprocess.run([engine.ffmpeg_exe(), "-v", "error", "-y", "-ss", str(args.start),
                        "-i", str(args.source.resolve()), "-t", str(args.seconds), "-ac", "1", "-ar", "16000", str(clip)], check=True)
        for model in args.models:
            options = JobOptions(engine="qwen" if model.startswith("qwen3-asr-") else "whisper",
                model=model, language=args.language, output_script="original", enhance_audio=args.enhance_audio).model_dump()
            worker = ProcessWorker()
            began = time.monotonic()
            report = {"model": model, "options": options, "source_start": args.start,
                      "requested_seconds": args.seconds, "reference_verified": bool(reference and args.reference_verified)}
            try:
                result = worker.transcribe(clip, options,
                    on_phase=lambda phase, *a: print(f"{model}: {phase}", flush=True),
                    on_segment=lambda seg, progress, info: print(f"{model}: {progress:.0%}", flush=True),
                    should_cancel=lambda: time.monotonic() - began > args.timeout, workdir=folder)
                report.update(status="completed", result=result, stats=formats.compute_stats(result["segments"], result["duration"]))
                if reference and args.reference_verified:
                    report["word_error_rate"] = score(reference, result["segments"])
                else:
                    report["accuracy_note"] = "Unverified: listen and supply a verified reference before comparing accuracy."
                transcript = "\n".join(f"[{s['start']:.2f}] {s['text']}" for s in result["segments"])
                (args.out / f"{model}.txt").write_text(transcript, encoding="utf-8")
            except engine.Cancelled:
                report.update(status="timed_out", error="Runtime limit reached; worker was stopped.")
            except Exception as exc:
                report.update(status="failed", error=str(exc))
            finally:
                worker.close()
            report["elapsed_seconds"] = round(time.monotonic() - began, 2)
            (args.out / f"{model}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
            reports.append({k: v for k, v in report.items() if k not in ("result", "options", "stats")})
            print(f"{model}: {report['status']} ({report['elapsed_seconds']}s)", flush=True)
    (args.out / "summary.json").write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
