"""tools.reconcile: majority-of-three decisions for disputed spots."""
from tools import reconcile


def span(k, rover, first=None, last=None, alts=None):
    return {"span": k, "rover_text": rover, "backbone_text": rover, "first_decision": first if first is not None else k * 3,
            "last_decision": last if last is not None else k * 3 + 1, "start_time": 10.0 + k,
            "context_before": "before", "context_after": "after", "alternatives": alts or {}}


def rev(*items, extra=()):
    return {"decisions": [{"span": k, "text": t, "confidence": c, "needs_audio_check": audio, "reason": "r"}
                          for k, t, c, audio in items], "extra_flags": list(extra)}


def test_reviewers_agreeing_override_the_vote():
    ov, rep = reconcile.reconcile_video([span(0, "ray crock", alts={"medium_b5": "Ray Kroc"})], rev((0, "Ray Kroc", 0.95, False)), rev((0, "ray kroc", 0.9, False)))
    assert ov == [{"first": 0, "last": 1, "text": "Ray Kroc"}]
    assert rep["spans"][0]["outcome"] == "reviewers_agree" and not rep["spans"][0]["listen"]


def test_one_reviewer_siding_with_the_vote_keeps_the_vote():
    ov, rep = reconcile.reconcile_video([span(0, "team's")], rev((0, "team's", 0.9, False)), rev((0, "team has", 0.85, False)))
    assert ov == [] and rep["spans"][0]["outcome"] == "rover_plus_one" and rep["spans"][0]["final"] == "team's"


def test_a_three_way_split_keeps_the_vote_and_asks_for_a_listen():
    ov, rep = reconcile.reconcile_video([span(0, "it puts")], rev((0, "it's put", 0.7, False)), rev((0, "it splits", 0.7, False)))
    row = rep["spans"][0]
    assert ov == [] and row["outcome"] == "three_way_split" and row["listen"] and row["final"] == "it puts"


def test_unanimity_changes_nothing_and_needs_no_listen():
    ov, rep = reconcile.reconcile_video([span(0, "the")], rev((0, "the", 0.95, False)), rev((0, "The", 0.9, False)))
    assert ov == [] and rep["spans"][0]["outcome"] == "all_agree" and not rep["spans"][0]["listen"]


def test_audio_check_or_low_confidence_always_lands_on_the_listen_list_even_when_agreeing():
    ov, rep = reconcile.reconcile_video([span(0, "x y"), span(1, "a b")], rev((0, "x y", 0.95, True), (1, "a b", 0.5, False)),
                                        rev((1, "a b", 0.9, False), (0, "x y", 0.9, False)))
    assert [r["listen"] for r in rep["spans"]] == [True, True]
    assert ov == []


def test_a_missing_or_invalid_reviewer_never_causes_a_blind_change():
    spans = [span(0, "keep me", alts={"s": "changed"}), span(1, "old", alts={"s": "new"})]
    ov, rep = reconcile.reconcile_video(spans, rev((0, "changed", 0.6, False), (1, "new", 0.9, False)), None)
    assert [o["text"] for o in ov] == ["new"]  # only a confident single opinion may override
    assert all(r["listen"] for r in rep["spans"]) and rep["spans"][0]["outcome"] == "single_reviewer"
    ov, rep = reconcile.reconcile_video(spans, None, None)
    assert ov == [] and all(r["final"] == r["rover"] for r in rep["spans"])


def test_deleting_a_phrase_is_an_override_with_empty_text():
    ov, _ = reconcile.reconcile_video([span(0, "um hallucinated words")], rev((0, "", 0.9, False)), rev((0, "", 0.9, False)))
    assert ov == [{"first": 0, "last": 1, "text": ""}]


def test_extra_flags_are_merged_by_time_and_credit_both_reviewers():
    f = lambda t, w: {"time": t, "text": w, "suspicion": "odd"}  # noqa: E731
    _, rep = reconcile.reconcile_video([], rev(extra=[f(12.0, "cabernets"), f(80.0, "xyz")]), rev(extra=[f(13.5, "cabernets")]))
    assert [(e["time"], e["flagged_by"]) for e in rep["extra_flags"]] == [(12.0, ["A", "B"]), (80.0, ["A"])]


def test_summary_counts():
    spans = [span(0, "a"), span(1, "b", alts={"s": "B2"}), span(2, "c", alts={"s1": "x", "s2": "y"})]
    a = rev((0, "a", 0.9, False), (1, "B2", 0.9, False), (2, "x", 0.8, False))
    b = rev((0, "a", 0.9, False), (1, "B2", 0.9, False), (2, "y", 0.8, False))
    ov, rep = reconcile.reconcile_video(spans, a, b)
    s = reconcile.summarize(rep)
    assert s["spans"] == 3 and s["all_agree"] == 1 and s["reviewers_override_rover"] == 1 and s["three_way_split"] == 1
    assert s["changed"] == 1 and s["listen"] == 1


def test_a_correction_with_words_no_recogniser_produced_is_never_applied_automatically():
    sp = span(0, "we're not in kansas anymore")
    sp["alternatives"] = {"turbo_b5_raw": "i don't know if you're in kansas anymore"}
    ov, rep = reconcile.reconcile_video([sp], rev((0, "Toto, we're not in Kansas anymore", 0.7, True)),
                                        rev((0, "Toto we're not in Kansas anymore", 0.7, True)))
    row = rep["spans"][0]
    assert ov == [] and row["final"] == "we're not in kansas anymore" and row["outcome"] == "unsupported_custom"
    assert row["listen"] and row["proposed_unsupported"].startswith("Toto")
    # ...whereas choosing one of the recognisers' own alternatives is fine
    ov, rep = reconcile.reconcile_video([sp], rev((0, "i don't know if you're in kansas anymore", 0.9, False)),
                                        rev((0, "I don't know if you're in Kansas anymore", 0.9, False)))
    assert len(ov) == 1 and rep["spans"][0]["outcome"] == "reviewers_agree"


def test_disputes_nobody_reviewed_are_flagged_not_silently_accepted():
    ov, rep = reconcile.reconcile_video([span(0, "x")], rev(), rev())
    assert ov == [] and rep["spans"][0]["outcome"] == "unreviewed" and rep["spans"][0]["listen"]
    assert reconcile.summarize(rep)["unreviewed"] == 1


def test_a_stutter_loop_in_the_vote_is_replaced_by_a_loop_free_candidate():
    assert reconcile.is_degenerate("ma, ma, ma, ma, ma, ma,") and reconcile.is_degenerate("no no no no")
    assert not reconcile.is_degenerate("very very good") and not reconcile.is_degenerate("")
    sp = span(0, "ma, ma, ma, ma, ma, ma,", alts={"distil": "mil.", "medium": "m-m-m-m-m-mill."})
    ov, rep = reconcile.reconcile_video([sp], rev((0, "mil.", 0.4, True)), rev((0, "million.", 0.5, True)))
    row = rep["spans"][0]
    assert row["final"] == "mil." and row["outcome"] == "loop_replaced" and row["listen"]
    assert ov == [{"first": 0, "last": 1, "text": "mil."}]
    # nothing loop-free and supported to choose: the vote stands, flagged
    ov, rep = reconcile.reconcile_video([sp], rev((0, "million.", 0.5, True)), rev((0, "millions", 0.5, True)))
    assert ov == [] and rep["spans"][0]["listen"]
