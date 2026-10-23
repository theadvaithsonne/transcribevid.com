"""Command line use (no server needed):

    python cli.py talk.mp4                       # timestamped text to the console
    python cli.py talk.mp4 --format srt -o talk.srt
    python cli.py talk.mp4 --model large-v3-turbo --lang en --prompt "Kubernetes, PostgreSQL"
"""
import argparse
import sys

from app import engine, formats


def main():
    p = argparse.ArgumentParser(description="Transcribe a video/audio file locally with Whisper.")
    p.add_argument("file")
    p.add_argument("--model", default="small", help="tiny, base, small, medium, large-v3-turbo, large-v3")
    p.add_argument("--lang", default=None, help="spoken language code, e.g. en (default: auto-detect)")
    p.add_argument("--translate", action="store_true", help="translate speech to English")
    p.add_argument("--prompt", default="", help="names/jargon that appear in the audio")
    p.add_argument("--format", default="txt", choices=["txt", "plain", "srt", "vtt", "md", "json"])
    p.add_argument("-o", "--out", help="write to a file instead of the console")
    a = p.parse_args()

    def on_phase(name, detail=None):
        print(f"[{name}{' ' + detail if detail else ''}]", file=sys.stderr)

    def on_segment(seg, progress, info):
        print(f"\r{progress:5.0%}", end="", file=sys.stderr)

    r = engine.transcribe(a.file, {"model": a.model, "language": a.lang, "prompt": a.prompt,
                                   "task": "translate" if a.translate else "transcribe"},
                          on_phase, on_segment)
    print(file=sys.stderr)
    job = {"title": a.file, "filename": a.file, "options": {"model": a.model},
           "stats": formats.compute_stats(r["segments"], r["duration"]), **r}
    body = formats.render(job, a.format)[0]
    if a.out:
        with open(a.out, "w", encoding="utf-8") as f:
            f.write(body)
        print("Wrote", a.out, file=sys.stderr)
    else:
        print(body)


if __name__ == "__main__":
    main()
