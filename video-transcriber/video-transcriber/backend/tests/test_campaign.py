"""tools.campaign: consensus transcripts from several systems, overrides, glossary, job export."""
import json
import random

import pytest

from app import formats
from tools import campaign, consensus

TRUTH = ("okay so you might think it is a pretty bold statement to say that your board never stops moving "
         "well BAT246 is designed to ensure that every board keeps moving there can never be a dead board "
         "but what happens if despite everything the sales team runs out of steam and no sales are created").split()


def make_result(name, words, seg_len=8, wrong=None, probs=None):
    """A run_systems-style result: `words` split into segments of `seg_len` words with 0.4 s per word."""
    segs, t = [], 0.0
    for i in range(0, len(words), seg_len):
        chunk, ws = words[i:i + seg_len], []
        start = t
        for k, w in enumerate(chunk):
            p = (probs or {}).get(i + k, 0.95)
            ws.append({"start": round(t, 2), "end": round(t + 0.4, 2), "word": " " + w, "probability": p})
            t += 0.4
        segs.append({"start": round(start, 2), "end": round(t, 2), "text": " ".join(chunk), "words": ws,
                     "avg_logprob": -0.2, "no_speech_prob": 0.01, "compression_ratio": 1.2})
    return {"video": "V-X", "system": name, "config": {}, "language": "en", "language_probability": 1.0,
            "duration": round(t, 2), "seconds": 10.0, "realtime_x": 2.0, "segments": segs}


def corrupt(words, rng, rate, vocab=("alpha", "beta", "gamma", "delta")):
    out = []
    for w in words:
        r = rng.random()
        if r < rate / 3:
            out.append(rng.choice(vocab))
        elif r < 2 * rate / 3:
            continue
        else:
            out.append(w)
        if rng.random() < rate / 6:
            out.append(rng.choice(vocab))
    return out


@pytest.fixture()
def campaign_dir(tmp_path):
    rng = random.Random(5)
    root = tmp_path / "campaign"
    (root / "V-X").mkdir(parents=True)
    (root / "V-X" / "meta.json").write_text(json.dumps({"language": "en"}))
    systems = {"best": TRUTH[:], "b": corrupt(TRUTH, rng, 0.15), "c": corrupt(TRUTH, rng, 0.15),
               "d": corrupt(TRUTH, rng, 0.15)}
    systems["best"][8] = "statements"  # one error of the backbone that the others do not share
    for name, words in systems.items():
        (root / "V-X" / f"{name}.json").write_text(json.dumps(make_result(name, words)))
    return root


def norm(words):
    return [w.lower() for w in words]


def test_consensus_beats_the_single_backbone(campaign_dir):
    from tools import metrics, textnorm
    truth = textnorm.normalize(" ".join(TRUTH))
    job, _ = campaign.finalize_video(campaign_dir, "V-X", "best")
    text = " ".join(s["text"] for s in job["segments"])
    best = campaign.load_results(campaign_dir, "V-X")["best"]
    best_text = " ".join(s["text"] for s in best["segments"])
    w_final = metrics.wer(truth, textnorm.normalize(text))["errors"]
    w_best = metrics.wer(truth, textnorm.normalize(best_text))["errors"]
    assert w_final < w_best  # the lone backbone error ("statements") was voted away
    assert "statement to say" in text


def test_segments_keep_backbone_timing_and_order(campaign_dir):
    job, _ = campaign.finalize_video(campaign_dir, "V-X", "best")
    segs = job["segments"]
    assert [s["id"] for s in segs] == list(range(len(segs)))
    assert all(a["end"] <= b["start"] + 1e-6 for a, b in zip(segs, segs[1:]))
    assert segs[0]["start"] == 0.0
    for s in segs:
        assert s["text"] and s["words"]
        assert all(w["word"].startswith(" ") for w in s["words"])
        assert 0 <= s["agreement"] <= 1


def test_job_dict_exports_to_every_format(campaign_dir):
    job, _ = campaign.finalize_video(campaign_dir, "V-X", "best", system_label="consensus of 4")
    assert job["options"]["model"] == "consensus of 4" and job["stats"]["word_count"] > 20
    for fmt in ("txt", "plain", "srt", "vtt", "md", "json", "pdf"):
        body, mime, ext = formats.render(job, fmt)
        assert body, fmt
    srt = formats.render(job, "srt")[0]
    assert "00:00:00,000 --> " in srt


def test_disagreement_spans_point_at_the_dissent(campaign_dir):
    _, spans = campaign.finalize_video(campaign_dir, "V-X", "best")
    assert spans and all("first_decision" in s and "alternatives" in s for s in spans)
    assert any("statements" in s["backbone_text"] for s in spans)


def test_overrides_replace_a_span(campaign_dir):
    _, spans = campaign.finalize_video(campaign_dir, "V-X", "best")
    sp = next(s for s in spans if "statements" in s["backbone_text"] or "statement" in s["rover_text"])
    ov = [{"first": sp["first_decision"], "last": sp["last_decision"], "text": "bold STATEMENT"}]
    job, _ = campaign.finalize_video(campaign_dir, "V-X", "best", overrides=ov)
    text = " ".join(s["text"] for s in job["segments"])
    assert "bold STATEMENT" in text and job["_meta"]["overrides"] == 1


def test_apply_overrides_drops_the_rest_of_the_range():
    bb = consensus.make_words("one two three four")
    dec = consensus.rover(bb, {"x": consensus.make_words("one two three four"),
                               "y": consensus.make_words("one two three four")})
    campaign.apply_overrides(dec, [{"first": 1, "last": 2, "text": "TWO-THREE"}])
    assert consensus.rebuild_text(dec).split() == ["one", "TWO-THREE", "four"]


def test_glossary_normalises_spelling_and_merges_words():
    pats = campaign.glossary_patterns(["BAT246", "All-Star", "Home Plate"])
    assert campaign.apply_glossary("Bat 246 and the all star at homeplate", pats) == "BAT246 and the All-Star at Home Plate"
    words = [{"start": 0.0, "end": 0.3, "word": " the", "probability": 0.9},
             {"start": 0.3, "end": 0.5, "word": " all", "probability": 0.8},
             {"start": 0.5, "end": 0.9, "word": " star", "probability": 0.6},
             {"start": 0.9, "end": 1.2, "word": " team", "probability": 0.9}]
    out = campaign.apply_glossary_words(words, pats)
    assert [w["word"] for w in out] == [" the", " All-Star", " team"]
    assert (out[1]["start"], out[1]["end"]) == (0.3, 0.9) and out[1]["probability"] == pytest.approx(0.7)


def test_glossary_does_not_touch_other_words():
    pats = campaign.glossary_patterns(["B2", "Rookie"])
    assert campaign.apply_glossary("b20 and rookies, ROOKIE b2", pats) == "b20 and Rookies, Rookie B2"


def test_analyze_reports_agreement_and_leave_one_out(campaign_dir):
    rep = campaign.analyze_video(campaign_dir, "V-X")
    assert set(rep["systems"]) == {"best", "b", "c", "d"} and rep["backbone"] in rep["systems"]
    assert rep["leave_one_out"]["best"]["wer_vs_others_pct"] < rep["leave_one_out"]["b"]["wer_vs_others_pct"]
    assert rep["rover"]["mean_agreement"] > 0.8 and rep["n_spans"] > 0
    assert campaign.analyze_video(campaign_dir, "V-X", only={"best"}) is None  # one system: nothing to compare


def test_cli_finalize_writes_json(campaign_dir, tmp_path, capsys, monkeypatch):
    import sys
    out = tmp_path / "final"
    monkeypatch.setattr(sys, "argv", ["campaign", "finalize", "--dir", str(campaign_dir), "--out", str(out),
                                      "--backbone", "best"])
    campaign.main()
    job = json.loads((out / "V-X.json").read_text(encoding="utf-8"))
    assert job["segments"] and job["_meta"]["backbone"] == "best"
    assert (out / "V-X.spans.json").exists()
    assert "V-X:" in capsys.readouterr().out


def test_spans_carry_a_number_and_each_systems_confidence(campaign_dir):
    _, spans = campaign.finalize_video(campaign_dir, "V-X", "best")
    assert [s["span"] for s in spans] == list(range(len(spans)))
    with_conf = [s for s in spans if s["confidence"]]
    assert with_conf and all(0 <= v <= 1 for s in with_conf for v in s["confidence"].values())
    assert any("backbone" in s["confidence"] for s in with_conf)


def test_flat_words_repairs_numbers_whose_comma_was_lost():
    seg = {"start": 0, "end": 3, "text": " earns 10 000 a month", "words": [
        {"start": 0, "end": 1, "word": " earns", "probability": 0.9}, {"start": 1, "end": 1.4, "word": " 10", "probability": 0.9},
        {"start": 1.4, "end": 1.9, "word": " 000", "probability": 0.9}, {"start": 2, "end": 3, "word": " a month", "probability": 0.9}]}
    words = campaign.flat_words({"segments": [seg]})
    assert [w["word"] for w in words] == [" earns", " 10,000", " a month"]
    from tools import textnorm
    assert textnorm.normalize(" ".join(w["word"] for w in words)) == ["earns", "ten", "thousand", "a", "month"]


def test_glossary_aliases_replace_known_mishearings_and_changes_are_reported(campaign_dir):
    pats = campaign.glossary_patterns([{"term": "BAT246", "aliases": ["That 246"]}, "All-Star"])
    assert campaign.apply_glossary("Let me explain. That 246 has a rule. Bat 246 too.", pats) == \
        "Let me explain. BAT246 has a rule. BAT246 too."
    assert campaign.apply_glossary("that 2460 and what 246x", pats) == "that 2460 and what 246x"  # no partial matches
    job, _ = campaign.finalize_video(campaign_dir, "V-X", "best", glossary=[{"term": "BAT246", "aliases": ["BAT246"]}])
    assert job["_meta"]["glossary_changes"] == []  # an identical spelling is not a change
    job, _ = campaign.finalize_video(campaign_dir, "V-X", "best", glossary=["Board"])  # the text says "board"
    ch = job["_meta"]["glossary_changes"]
    assert ch and all("Board" in c["after"] and "Board" not in c["before"] for c in ch)
