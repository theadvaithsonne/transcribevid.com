"""Compare the outputs of several ASR systems (see run_systems.py) and build a consensus transcript.

    python -m tools.campaign analyze --dir data/campaign --out data/campaign/analysis [--backbone NAME]
                                     [--weights name=1.5,name2=1] [--systems a,b,c]

For every video it reports each system's speed, the pairwise word-level agreement matrix, each system's
leave-one-out disagreement with the vote of the others (a proxy - agreement is NOT accuracy), the ROVER
consensus, and the list of spans on which the systems disagree (what a human should listen to).
"""
import argparse
import bisect
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tools import consensus, metrics  # noqa: E402


def load_results(root: Path, video: str, only=None):
    out = {}
    for f in sorted((root / video).glob("*.json")):
        if f.name == "meta.json":
            continue
        r = json.loads(f.read_text(encoding="utf-8"))
        if only and r["system"] not in only:
            continue
        out[r["system"]] = r
    return out


def flat_words(result):
    """All Whisper word dicts of a result in order; falls back to splitting segment text when a
    system produced no word timings."""
    from app.engine import merge_number_pieces
    words = []
    for s in result["segments"]:
        if s.get("words"):
            words += merge_number_pieces(s["words"], s["text"])  # "10" + "000" -> "10,000" (see engine)
        else:
            toks = s["text"].split()
            for k, t in enumerate(toks):
                a = s["start"] + (s["end"] - s["start"]) * k / max(len(toks), 1)
                b = s["start"] + (s["end"] - s["start"]) * (k + 1) / max(len(toks), 1)
                words.append({"word": " " + t, "start": a, "end": b, "probability": None})
    return words


def norm_tokens(words):
    return [w["norm"] for w in words if w.get("norm")]


def speed_row(r):
    return {"seconds": r["seconds"], "realtime_x": r["realtime_x"], "segments": len(r["segments"]),
            "words": sum(len(s.get("words") or []) or len(s["text"].split()) for s in r["segments"])}


def leave_one_out(wordlists, weights=None):
    """For each system: WER of that system against the weighted vote of all the OTHER systems
    (backbone = the most typical of the others). Needs >= 4 systems for a meaningful vote."""
    names = list(wordlists)
    res = {}
    for n in names:
        rest = {k: v for k, v in wordlists.items() if k != n}
        if len(rest) < 3:
            res[n] = None
            continue
        mat = metrics.pairwise_matrix({k: norm_tokens(v) for k, v in rest.items()})
        bb_name = metrics.rank_by_agreement(mat)[0][0]
        others = {k: v for k, v in rest.items() if k != bb_name}
        dec = consensus.rover(rest[bb_name], others, weights={k: (weights or {}).get(k, 1.0) for k in others},
                              w_backbone=(weights or {}).get(bb_name, 1.0))
        vote = [d["chosen"]["norm"] for d in dec if d["chosen"].get("norm")]
        w = metrics.wer(vote, norm_tokens(wordlists[n]))
        res[n] = {"wer_vs_others_pct": round(100 * w["wer"], 3), "sub": w["sub"], "ins": w["ins"], "del": w["del"],
                  "pseudo_reference": bb_name}
    return res


def build_consensus(results, backbone, weights=None, min_votes=None):
    """ROVER with `backbone`'s word list; returns (decisions, backbone_words, wordlists)."""
    wl = {n: consensus.make_words(flat_words(r)) for n, r in results.items()}
    others = {n: w for n, w in wl.items() if n != backbone}
    wts = {n: (weights or {}).get(n, 1.0) for n in others}
    dec = consensus.rover(wl[backbone], others, weights=wts, w_backbone=(weights or {}).get(backbone, 1.0),
                          min_votes=min_votes)
    return dec, wl[backbone], wl


def segments_from_decisions(backbone_result, decisions):
    """Re-create the backbone's timestamped segments with the voted words.

    Each decision is assigned to the backbone segment that contains its (backbone) word start time; the
    segment text is rebuilt from the chosen surfaces, and word timings are kept for subtitle cue splitting."""
    segs = backbone_result["segments"]
    starts = [s["start"] for s in segs]
    buckets = [[] for _ in segs]
    last = 0
    for d in decisions:
        w = d["chosen"] if d["chosen"].get("start") is not None else (d.get("backbone") or {})
        t = w.get("start")
        if t is None:
            k = last
        else:
            k = max(0, min(len(segs) - 1, bisect.bisect_right(starts, t + 0.005) - 1))
        last = k = max(k, last)  # decisions are in order: never go back to an earlier segment
        buckets[k].append(d)
    out = []
    for s, ds in zip(segs, buckets):
        text = consensus.rebuild_text(ds).strip()
        words = []
        for cw in consensus.chosen_words(ds):
            surf = cw["surface"].strip()
            if not surf:
                continue
            words.append({"start": round(cw["start"] if cw.get("start") is not None else s["start"], 2),
                          "end": round(cw["end"] if cw.get("end") is not None else s["end"], 2),
                          "word": " " + surf, "probability": cw.get("probability") or 0.0})
        agree = [d["agreement"] for d in ds if not d.get("passthrough")]
        changed = sum(1 for d in ds if d["changed"])
        out.append({"start": s["start"], "end": s["end"], "text": text, "words": words or None,
                    "agreement_min": round(min(agree), 3) if agree else 1.0,
                    "agreement_mean": round(sum(agree) / len(agree), 4) if agree else 1.0,
                    "changed_words": changed,
                    "backbone_text": s["text"]})
    return [seg for seg in out if seg["text"]]


def apply_overrides(decisions, overrides):
    """Apply reviewed corrections to a decision list (mutates and returns it).

    overrides = [{"first": int, "last": int, "text": str}] where first/last are the decision positions of
    a span (as reported by consensus.disagreement_spans: first_decision/last_decision). The first decision
    of the range carries the replacement text, the others are dropped."""
    for o in overrides:
        a, b, text = int(o["first"]), int(o["last"]), o["text"].strip()
        first = decisions[a]
        w = first["chosen"]
        start = w.get("start")
        end = decisions[b]["chosen"].get("end", w.get("end"))
        toks = text.split()
        first["chosen"] = {"norm": " ".join(toks).lower() if toks else "", "surface": (" " + text) if text else "",
                           "start": start, "end": end, "probability": 1.0}
        first["changed"] = True
        first["agreement"] = 1.0
        for k in range(a + 1, b + 1):
            decisions[k]["chosen"] = {"norm": "", "surface": "", "start": decisions[k]["chosen"].get("start"),
                                      "end": decisions[k]["chosen"].get("end"), "probability": 1.0}
            decisions[k]["changed"] = True
            decisions[k]["agreement"] = 1.0
    return decisions


def glossary_patterns(terms):
    """Case/spacing-insensitive patterns for domain terms: 'BAT246' also matches 'Bat 246'/'bat-246',
    'All-Star' matches 'all star'/'All Stars'. An entry is either a string or {"term": "BAT246",
    "aliases": ["That 246"]} - aliases are KNOWN misheard forms that are replaced by the canonical term.
    Returns [(compiled, canonical)]."""
    import re

    def build(t):
        parts = re.findall(r"[A-Za-z]+|[0-9]+", t)
        if not parts:
            return None
        return r"(?<![A-Za-z0-9])" + r"[\s\-]*".join(re.escape(p) for p in parts) + r"(s?)(?![A-Za-z0-9])"

    out = []
    for entry in terms:
        canon, aliases = (entry, []) if isinstance(entry, str) else (entry["term"], entry.get("aliases", []))
        for form in [canon, *aliases]:
            pat = build(form)
            if pat:
                out.append((re.compile(pat, re.I), canon))
    return out


def apply_glossary(text, patterns):
    for rx, canon in patterns:
        text = rx.sub(lambda m: canon + m.group(1).lower(), text)
    return text


def apply_glossary_words(words, patterns):
    """Glossary on a segment's word list: a term that spans several words ('all star' -> 'All-Star') merges
    them into one word (timing = first start .. last end) so subtitle cues keep exact timing."""
    import re
    if not words or not patterns:
        return words
    for rx, canon in patterns:
        texts = [w["word"].strip() for w in words]
        joined, spans, pos = "", [], 0
        for t in texts:
            if joined:
                joined += " "
            spans.append((len(joined), len(joined) + len(t)))
            joined += t
        hits = []
        for m in rx.finditer(joined):
            idx = [i for i, (a, b) in enumerate(spans) if a < m.end() and b > m.start()]
            if idx:
                hits.append((idx[0], idx[-1], canon + m.group(1).lower()))
        if not hits:
            continue
        out, i = [], 0
        for a, b, text in hits:
            if a < i:
                continue
            out += words[i:a]
            probs = [w.get("probability") or 0.0 for w in words[a:b + 1]]
            out.append({"start": words[a]["start"], "end": words[b]["end"], "word": " " + text,
                        "probability": round(sum(probs) / len(probs), 3)})
            i = b + 1
        out += words[i:]
        words = out
    return words


def enrich_spans(decisions, spans):
    """Add what a reviewer needs to judge a dissent span: its number, and for every system the model's own
    confidence (mean word probability, 0..1) in the words it wrote there."""
    for k, sp in enumerate(spans):
        sp["span"] = k
        conf = {}
        seg = decisions[sp["first_decision"]: sp["last_decision"] + 1]
        probs = [d["backbone"]["probability"] for d in seg if d.get("backbone") and d["backbone"].get("probability") is not None]
        if probs:
            conf["backbone"] = round(sum(probs) / len(probs), 3)
        names = {n for d in seg for n in d["by_system"] if n != "backbone"}
        for n in sorted(names):
            ps = [d["by_system"][n]["probability"] for d in seg
                  if d["by_system"].get(n) and d["by_system"][n].get("probability") is not None]
            if ps:
                conf[n] = round(sum(ps) / len(ps), 3)
        sp["confidence"] = conf
    return spans


def finalize_video(root: Path, video: str, backbone, weights=None, overrides=None, glossary=None, only=None,
                   system_label=None):
    """Consensus transcript for one video as a job-shaped dict ready for app.formats.render()."""
    from app import formats
    results = load_results(root, video, only)
    dec, _, _ = build_consensus(results, backbone, weights)
    spans = enrich_spans(dec, consensus.disagreement_spans(dec, max_agreement=0.999))
    if overrides:
        apply_overrides(dec, overrides)
    bb = results[backbone]
    segs = segments_from_decisions(bb, dec)
    pats = glossary_patterns(glossary or [])
    final, gloss_changes = [], []
    for s in segs:
        before_text = s["text"]
        s["text"] = apply_glossary(s["text"], pats)
        if s["text"] != before_text:
            gloss_changes.append({"time": round(s["start"], 1), "before": before_text, "after": s["text"]})
        s["words"] = apply_glossary_words(s["words"], pats)
        probs = [w["probability"] for w in (s["words"] or []) if w.get("probability") is not None]
        final.append({"id": len(final), "start": round(s["start"], 2), "end": round(s["end"], 2), "text": s["text"],
                      "words": s["words"], "confidence": round(sum(probs) / len(probs), 3) if probs else None,
                      "agreement": s["agreement_min"], "backbone_text": s["backbone_text"]})
    duration = bb["duration"]
    job = {"title": video, "filename": f"{video}.mp4", "language": bb["language"], "duration": duration,
           "options": {"model": system_label or f"consensus of {len(results)} systems", "task": "transcribe"},
           "segments": final}
    job["stats"] = formats.compute_stats(final, duration)
    job["_meta"] = {"backbone": backbone, "systems": sorted(results), "weights": weights or {},
                    "rover": consensus.summarize(dec), "n_spans": len(spans), "overrides": len(overrides or []),
                    "glossary_changes": gloss_changes}
    return job, spans


def analyze_video(root: Path, video: str, backbone=None, weights=None, only=None, max_agreement=0.999):
    results = load_results(root, video, only)
    if len(results) < 2:
        return None
    wl = {n: consensus.make_words(flat_words(r)) for n, r in results.items()}
    toks = {n: norm_tokens(w) for n, w in wl.items()}
    mat = metrics.pairwise_matrix(toks)
    ranking = metrics.rank_by_agreement(mat)
    backbone = backbone if backbone in results else ranking[0][0]
    report = {"video": video, "duration": next(iter(results.values()))["duration"],
              "language": next(iter(results.values()))["language"],
              "systems": {n: speed_row(r) for n, r in results.items()},
              "word_counts": {n: len(t) for n, t in toks.items()},
              "agreement_rank": ranking, "pairwise_wer": mat["wer"], "backbone": backbone}
    if len(results) >= 4:
        report["leave_one_out"] = leave_one_out(wl, weights)
    if len(results) >= 3:
        dec, _, _ = build_consensus(results, backbone, weights)
        report["rover"] = consensus.summarize(dec)
        spans = consensus.disagreement_spans(dec, max_agreement=max_agreement)
        report["n_spans"] = len(spans)
        report["spans"] = spans
        report["_decisions"] = dec
    return report


def finalize_cli(args):
    root, out = Path(args.dir), Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    weights = {k: float(v) for k, v in (p.split("=") for p in args.weights.split(",") if p)}
    only = set(args.systems.split(",")) if args.systems else None
    glossary = json.loads(Path(args.glossary).read_text(encoding="utf-8")) if args.glossary else []
    vids = args.videos.split(",") if args.videos else sorted(p.name for p in root.iterdir() if (p / "meta.json").exists())
    for v in vids:
        ov = None
        if args.reviews and (Path(args.reviews) / f"{v}.json").exists():
            ov = json.loads((Path(args.reviews) / f"{v}.json").read_text(encoding="utf-8"))
        job, spans = finalize_video(root, v, args.backbone, weights, ov, glossary, only)
        (out / f"{v}.json").write_text(json.dumps(job, indent=1, ensure_ascii=False), encoding="utf-8")
        (out / f"{v}.spans.json").write_text(json.dumps(spans, indent=1, ensure_ascii=False), encoding="utf-8")
        m = job["_meta"]
        print(f"{v}: {len(job['segments'])} segments, {job['stats']['word_count']} words, ROVER changed {m['rover']['changed']}, "
              f"{m['n_spans']} dissent span(s), {m['overrides']} reviewed override(s)")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("analyze")
    a.add_argument("--dir", required=True)
    a.add_argument("--out", required=True)
    a.add_argument("--backbone")
    a.add_argument("--weights", default="")
    a.add_argument("--systems", default="")
    a.add_argument("--videos", default="")
    f = sub.add_parser("finalize")
    f.add_argument("--dir", required=True)
    f.add_argument("--out", required=True)
    f.add_argument("--backbone", required=True)
    f.add_argument("--weights", default="")
    f.add_argument("--systems", default="")
    f.add_argument("--videos", default="")
    f.add_argument("--glossary", default="", help="path to a JSON list of canonical terms")
    f.add_argument("--reviews", default="", help="dir with <video>.json override lists")
    args = ap.parse_args()
    if args.cmd == "finalize":
        return finalize_cli(args)
    root, out = Path(args.dir), Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    weights = {k: float(v) for k, v in (p.split("=") for p in args.weights.split(",") if p)}
    only = set(args.systems.split(",")) if args.systems else None
    vids = args.videos.split(",") if args.videos else sorted(p.name for p in root.iterdir() if (p / "meta.json").exists())
    for v in vids:
        rep = analyze_video(root, v, args.backbone, weights, only)
        if not rep:
            print(v, "not enough systems yet")
            continue
        rep.pop("_decisions", None)
        (out / f"{v}.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"\n== {v} ({rep['duration']:.0f}s, {rep['language']}) backbone={rep['backbone']}")
        for n, s in rep["systems"].items():
            loo = (rep.get("leave_one_out") or {}).get(n)
            print(f"  {n:18s} {s['seconds']:7.1f}s {s['realtime_x']:5.2f}x words={s['words']:5d}"
                  + (f"  vs-others WER {loo['wer_vs_others_pct']:.2f}%" if loo else ""))
        if "rover" in rep:
            print(f"  ROVER changed {rep['rover']['changed']} words; {rep['n_spans']} disagreement span(s); "
                  f"mean agreement {rep['rover']['mean_agreement']:.4f}")


if __name__ == "__main__":
    main()
