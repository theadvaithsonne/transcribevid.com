"""Combine three independent opinions on every disputed spot of a transcript.

    python -m tools.reconcile --dir data/campaign --review data/campaign/review --out data/campaign/final

Opinions per spot: (1) ROVER, the weighted vote of the recognisers, (2) reviewer A, (3) reviewer B.
Reviewers see the candidates and the context but cannot hear the audio and do not see each other.

  * A and B agree                       -> their text wins (an override when it differs from ROVER)
  * exactly one of them agrees w/ ROVER -> ROVER stands (2 of 3)
  * all three differ                    -> ROVER stands and the spot is flagged for a human listen
  * a stutter loop in the vote ("ma ma ma ma") is replaced by a loop-free reading a recogniser produced
  * a reviewed text that contains words NO recogniser produced is a guess, not evidence: it is never applied
    automatically (ROVER stands) and the proposal is shown on the listen list instead
Spots where a reviewer said "needs audio check", or where the winning side is not confident, are flagged
too: they are what a person should listen to. Output: overrides for tools.campaign + a review report.
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tools import textnorm  # noqa: E402

LOW_CONFIDENCE = 0.7


def _norm(text):
    return tuple(textnorm.normalize(text or ""))


def _load(path):
    p = Path(path)
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def _supported_by_candidates(text, sp):
    """True when every word of `text` was produced by at least one recogniser at this spot."""
    seen = set(_norm(sp.get("rover_text")) + _norm(sp.get("backbone_text")))
    for alt in (sp.get("alternatives") or {}).values():
        seen.update(_norm(alt))
    return all(tok in seen for tok in _norm(text))


def is_degenerate(text, run=4):
    """A recogniser stutter loop ("ma ma ma ma ma"): one word repeated `run` or more times in a row."""
    toks = textnorm.normalize(text or "", drop_fillers=False)
    streak = 1
    for x, y in zip(toks, toks[1:]):
        streak = streak + 1 if x == y else 1
        if streak >= run:
            return True
    return False


def reconcile_video(spans, a, b):
    """-> (overrides, report). `a`/`b` are the parsed reviewer files (or None when missing/invalid)."""
    da = {d["span"]: d for d in (a or {}).get("decisions", [])}
    db = {d["span"]: d for d in (b or {}).get("decisions", [])}
    overrides, rows = [], []
    for sp in spans:
        k = sp["span"]
        rover = sp["rover_text"]
        ta, tb = da.get(k), db.get(k)
        na, nb, nr = (_norm(ta["text"]) if ta else None), (_norm(tb["text"]) if tb else None), _norm(rover)
        confs = [x.get("confidence", 0.5) for x in (ta, tb) if x]
        audio = any(x.get("needs_audio_check") for x in (ta, tb) if x)
        text, outcome = rover, "rover"
        if ta and tb:
            if na == nb:
                outcome = "reviewers_agree" if na != nr else "all_agree"
                text = ta["text"] if na != nr else rover
            elif na == nr or nb == nr:
                outcome = "rover_plus_one"
                text = rover
            else:
                outcome = "three_way_split"
                text = rover
        elif ta or tb:  # only one reviewer answered: trust ROVER unless it is clearly doubted
            outcome = "single_reviewer"
            r = ta or tb
            text = r["text"] if _norm(r["text"]) != nr and r.get("confidence", 0) >= 0.85 else rover
        else:
            outcome = "unreviewed"  # nobody looked at this dispute: the vote stands, a human should
        if is_degenerate(rover):  # a stutter loop is an artefact: prefer a loop-free reading a recogniser produced
            ok = [x for x in (ta, tb) if x and not is_degenerate(x["text"]) and _supported_by_candidates(x["text"], sp)]
            if ok:
                text, outcome = max(ok, key=lambda x: x.get("confidence", 0))["text"], "loop_replaced"
        proposed = None
        if text is not rover and _norm(text) != nr and not _supported_by_candidates(text, sp):
            proposed, text, outcome = text, rover, "unsupported_custom"
        changed = _norm(text) != nr or text.strip() != rover.strip()
        if changed:
            overrides.append({"first": sp["first_decision"], "last": sp["last_decision"], "text": text})
        flag = (audio or outcome in ("three_way_split", "single_reviewer", "unreviewed", "unsupported_custom", "loop_replaced")
                or (confs and min(confs) < LOW_CONFIDENCE) or outcome == "rover_plus_one" and (confs and min(confs) < 0.8))
        rows.append({"span": k, "time": sp.get("start_time"), "context_before": sp.get("context_before"),
                     "context_after": sp.get("context_after"), "rover": rover, "final": text, "outcome": outcome, "proposed_unsupported": proposed,
                     "changed": changed, "listen": bool(flag), "alternatives": sp.get("alternatives"),
                     "reviewer_a": ta and {"text": ta["text"], "confidence": ta.get("confidence"),
                                           "audio": ta.get("needs_audio_check"), "reason": ta.get("reason")},
                     "reviewer_b": tb and {"text": tb["text"], "confidence": tb.get("confidence"),
                                           "audio": tb.get("needs_audio_check"), "reason": tb.get("reason")}})
    # suspicious places OUTSIDE the disputed spots (all recognisers agree but the words look wrong)
    extra = []
    for who, r in (("A", a), ("B", b)):
        for f in (r or {}).get("extra_flags", []) or []:
            t = f.get("time")
            if t is None:
                continue
            same = next((e for e in extra if abs(e["time"] - t) <= 2.0), None)
            if same:
                same["flagged_by"].append(who)
            else:
                extra.append({"time": t, "text": f.get("text", ""), "why": f.get("suspicion", ""), "flagged_by": [who]})
    return overrides, {"spans": rows, "extra_flags": sorted(extra, key=lambda e: e["time"])}


def summarize(report):
    rows = report["spans"]
    n = len(rows)
    count = lambda o: sum(1 for r in rows if r["outcome"] == o)  # noqa: E731
    return {"spans": n, "all_agree": count("all_agree"), "reviewers_override_rover": count("reviewers_agree"),
            "rover_plus_one": count("rover_plus_one"), "three_way_split": count("three_way_split"),
            "single_reviewer": count("single_reviewer"), "unreviewed": count("unreviewed"),
            "unsupported_custom": count("unsupported_custom"), "loop_replaced": count("loop_replaced"), "changed": sum(1 for r in rows if r["changed"]),
            "listen": sum(1 for r in rows if r["listen"]), "extra_flags": len(report["extra_flags"])}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--review", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--videos", default="V-1,V-2,V-3,V-4,V-5,V-6")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    for v in args.videos.split(","):
        spans = _load(out / f"{v}.spans.json")
        if spans is None:
            print(v, "no spans file")
            continue
        a, b = _load(Path(args.review) / f"{v}.reviewerA.json"), _load(Path(args.review) / f"{v}.reviewerB.json")
        overrides, report = reconcile_video(spans, a, b)
        report["summary"] = summarize(report)
        (out / f"{v}.overrides.json").write_text(json.dumps(overrides, indent=1, ensure_ascii=False), encoding="utf-8")
        (out / f"{v}.review.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
        print(v, json.dumps(report["summary"]), "reviewers:", "A" if a else "-", "B" if b else "-")


if __name__ == "__main__":
    main()
