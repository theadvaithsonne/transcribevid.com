"""Write the final transcripts (TXT, SRT, PDF), an accuracy report and the golden test files.

    python -m tools.deliver --final data/campaign/final --out "C:/Users/<you>/Desktop/TranscribeVid transcripts" \
        --golden tests/golden --analysis data/campaign/analysis
"""
import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import formats  # noqa: E402

VIDEOS = ["V-1", "V-2", "V-3", "V-4", "V-5", "V-6"]


def fmt(t):
    t = int(t or 0)
    return f"{t // 60}:{t % 60:02d}"


def write_transcripts(job, out: Path, name: str):
    # the PDF/SRT builders read job["segments"]; "agreement"/"backbone_text" are extra and ignored
    for kind, ext in (("txt", "txt"), ("srt", "srt"), ("pdf", "pdf")):
        body, _, _ = formats.render(job, kind)
        p = out / f"{name}.{ext}"
        if isinstance(body, bytes):
            p.write_bytes(body)
        else:
            p.write_text(body, encoding="utf-8-sig" if kind == "txt" else "utf-8")


def report_markdown(jobs, reviews, stats):
    L = ["# Transcript accuracy report", "",
         f"Generated {time.strftime('%Y-%m-%d %H:%M')}. Files: one `.txt` (timestamps), `.srt` (subtitles) and `.pdf` per video.", ""]
    L += ["## How these transcripts were made", "",
          "Each video was transcribed by several independent Whisper speech-recognition models (small, large-v3-turbo with and without audio "
          "enhancement, medium, distil-large-v3.5). Their outputs were aligned word by word and combined by a weighted vote. Every spot where "
          "the models disagreed was then judged by two independent reviewers who could read the context but not hear the audio; the final "
          "text of each spot is the majority of three opinions (the model vote and the two reviewers). Spelling of the product and level names "
          "(BAT246, All-Star, Home Plate, First Base, Rookie, B2) was normalised.", "",
          "## What this does and does not prove", "",
          "- There is **no human-verified reference text** for these videos, so a true error rate cannot be measured. Agreement between "
          "independent systems is strong evidence, not proof: if every model makes the same mistake it stays.",
          "- The 'agreement' figures below are the share of words on which the recognisers did not disagree. Words in the 'listen' list are "
          "the ones a person should check against the audio; everything else is, with high likelihood, correct.", ""]
    L += ["## Summary per video", "",
          "| Video | Length | Words | Models | Words with no dissent | Disputed spots | Changed by reviewers | Listen list |",
          "|---|---|---|---|---|---|---|---|"]
    for v in VIDEOS:
        if v not in jobs:
            continue
        j, r, s = jobs[v], reviews.get(v, {}), stats.get(v, {})
        sm = r.get("summary", {})
        words = j["stats"]["word_count"]
        L.append(f"| {v} | {fmt(j['duration'])} | {words} | {len(j['_meta']['systems'])} | {s.get('undisputed_pct', '-')}% | "
                 f"{sm.get('spans', 0)} | {sm.get('changed', 0)} | {sm.get('listen', 0)} + {sm.get('extra_flags', 0)} |")
    L += [""]
    changes = [(v, c) for v in VIDEOS if v in jobs for c in jobs[v]["_meta"].get("glossary_changes", [])]
    if changes:
        L += ["## Automatic spelling normalisations", "",
              "Product and level names were spelled consistently (BAT246, All-Star, Home Plate, First Base, Rookie, B2), including the one "
              "place where every model mis-heard the name. Listed so nothing is changed silently:", ""]
        for v, c in changes[:60]:
            import difflib
            b, a = c["before"].split(), c["after"].split()
            d = [f"{' '.join(b[i1:i2])!r} -> {' '.join(a[j1:j2])!r}" for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, b, a).get_opcodes() if tag != "equal"]
            L.append(f"- {v} at {fmt(c['time'])}: " + "; ".join(d))
        L.append("")
    L += ["## Please listen to these spots (timestamps are minutes:seconds)", "",
          "Each line: where it is, the text used in the final transcript, and the other readings. If the final text is wrong, fix it in the "
          "TranscribeVid editor (or the PDF source) and export again.", ""]
    for v in VIDEOS:
        r = reviews.get(v)
        if not r:
            continue
        rows = [x for x in r["spans"] if x["listen"]]
        extra = r.get("extra_flags", [])
        L += [f"### {v}  ({len(rows)} disputed + {len(extra)} suspicious)", ""]
        if not rows and not extra:
            L += ["Nothing to check.", ""]
        for x in rows:
            alts = "; ".join(f"{k}: *{t}*" for k, t in (x.get("alternatives") or {}).items()) or "-"
            why = " / ".join(f"{k}: {d['text']!r} ({d['confidence']})" for k, d in (("A", x.get("reviewer_a")), ("B", x.get("reviewer_b"))) if d)
            L.append(f"- **{fmt(x['time'])}** ...{(x.get('context_before') or '')[-40:]} **[{x['final']}]** {(x.get('context_after') or '')[:40]}...  \n"
                     f"  other readings: {alts}  \n  reviewers: {why}")
        for e in extra:
            L.append(f"- **{fmt(e['time'])}** suspicious although all models agree: *{e['text']}* - {e['why']} (flagged by {', '.join(e['flagged_by'])})")
        L.append("")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--final", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--golden", default="")
    ap.add_argument("--analysis", default="")
    args = ap.parse_args()
    final, out = Path(args.final), Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    jobs, reviews, stats = {}, {}, {}
    for v in VIDEOS:
        f = final / f"{v}.json"
        if not f.exists():
            print(v, "missing")
            continue
        job = json.loads(f.read_text(encoding="utf-8"))
        jobs[v] = job
        write_transcripts(job, out, v)
        rv = final / f"{v}.review.json"
        if rv.exists():
            reviews[v] = json.loads(rv.read_text(encoding="utf-8"))
        sp = final / f"{v}.spans.json"
        words = job["stats"]["word_count"] or 1
        spans = json.loads(sp.read_text(encoding="utf-8")) if sp.exists() else []
        disputed = sum(len(s.get("rover_text", "").split()) for s in spans)
        stats[v] = {"undisputed_pct": round(100 * max(0, words - disputed) / words, 1)}
        if args.golden:
            g = Path(args.golden)
            g.mkdir(parents=True, exist_ok=True)
            (g / f"{v}.json").write_text(json.dumps(
                {"video": v, "language": job["language"], "duration": job["duration"],
                 "segments": [{"start": s["start"], "end": s["end"], "text": s["text"],
                               "words": [[w["start"], w["word"].strip()] for w in (s.get("words") or [])]}
                              for s in job["segments"]]},
                ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"{v}: wrote {v}.txt/.srt/.pdf ({len(job['segments'])} segments)")
    (out / "ACCURACY REPORT.md").write_text(report_markdown(jobs, reviews, stats), encoding="utf-8")
    print("wrote ACCURACY REPORT.md ->", out)


if __name__ == "__main__":
    main()
