"""Command-line use:  python cli.py video.mp4 [--model small] [--lang en] [--srt]"""
import argparse, sys
import transcriber

p = argparse.ArgumentParser()
p.add_argument("file")
p.add_argument("--model", default="small")
p.add_argument("--lang", default=None)
p.add_argument("--srt", action="store_true", help="output SRT instead of text")
p.add_argument("-o", "--out", help="write to file instead of stdout")
a = p.parse_args()
r = transcriber.transcribe(a.file, a.model, a.lang)
text = transcriber.to_srt(r) if a.srt else transcriber.to_txt(r)
if a.out:
    open(a.out, "w", encoding="utf-8").write(text); print("Wrote", a.out)
else:
    print(text)
