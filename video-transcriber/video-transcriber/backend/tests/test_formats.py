from app import formats


def words(*items):
    return [{"start": s, "end": e, "word": w, "probability": 0.9} for w, s, e in items]


def seg(i, start, end, text, ws=None):
    return {"id": i, "start": start, "end": end, "text": text, "words": ws, "confidence": 0.9}


def test_timestamps():
    assert formats.fmt_ts(65.5) == "01:05"
    assert formats.fmt_ts(3661.2) == "1:01:01"
    assert formats.fmt_ts(1.5, "srt") == "00:00:01,500"
    assert formats.fmt_ts(1.5, "vtt") == "00:00:01.500"
    assert formats.fmt_ts(-3) == "00:00"


def test_srt_numbering_and_format():
    srt = formats.to_srt([seg(0, 0, 2, "Hello there."), seg(1, 2.5, 4, "General Kenobi.")])
    blocks = srt.strip().split("\n\n")
    assert blocks[0].splitlines()[:2] == ["1", "00:00:00,000 --> 00:00:02,000"] or blocks[0].startswith("1\n")
    assert "General Kenobi." in blocks[1]
    assert blocks[1].startswith("2\n")


def test_vtt_header():
    assert formats.to_vtt([seg(0, 0, 2, "Hi.")]).startswith("WEBVTT\n\n")


def test_long_segment_is_split_into_short_cues_using_word_timing():
    text = " ".join(f"word{i}" for i in range(40)) + "."
    ws = words(*[(f" word{i}", i * 0.4, i * 0.4 + 0.35) for i in range(40)])
    cues = formats.build_cues([seg(0, 0, 16, text, ws)], max_chars=42, max_lines=2, max_dur=6)
    assert len(cues) >= 3
    for c in cues:
        assert all(len(line) <= 42 for line in c["text"].split("\n"))
        assert c["end"] - c["start"] <= 6.5
    assert all(a["end"] <= b["start"] + 1e-6 for a, b in zip(cues, cues[1:]))


def test_edited_segment_without_words_still_splits():
    cues = formats.build_cues([seg(0, 0, 10, "This is a fairly long edited sentence. And here is another one that follows it.")])
    assert len(cues) >= 2
    assert cues[0]["start"] == 0 and cues[-1]["end"] <= 10.01


def test_cues_split_on_pauses_and_sentences():
    # split at a sentence end once the cue is long enough to stand alone
    ws = words((" Welcome", 0, 0.5), (" everyone", 0.5, 1.0), (" today.", 1.0, 1.5), (" Bye", 1.6, 2.0))
    cues = formats.build_cues([seg(0, 0, 2, "Welcome everyone today. Bye", ws)])
    assert [c["text"] for c in cues][0] == "Welcome everyone today."
    assert cues[1]["text"] == "Bye"
    # ...and at a long pause even without punctuation
    ws = words((" first", 0, 0.5), (" second", 3.0, 3.5))
    assert len(formats.build_cues([seg(0, 0, 4, "first second", ws)])) == 2


def test_plain_text_paragraphs():
    segs = [seg(0, 0, 2, "One."), seg(1, 2.2, 4, "Two."), seg(2, 10, 12, "Three.")]
    assert formats.to_plain(segs) == "One. Two.\n\nThree."


def test_render_json_and_md():
    job = {"title": "T", "filename": "t.mp4", "language": "en", "duration": 4, "options": {"model": "small"},
           "segments": [seg(0, 0, 2, "Hi.")], "stats": {}}
    body, mime, ext = formats.render(job, "json")
    assert ext == "json" and '"Hi."' in body
    body, _, ext = formats.render(job, "md")
    assert body.startswith("# T") and "**[00:00]** Hi." in body
    assert formats.render(job, "bogus")[2] == "txt"


def test_stats_are_json_serialisable_even_with_numpy_inputs():
    import json
    import numpy as np
    segs = [dict(seg(0, 0, 30, "plenty of words here for the speech rate"), confidence=np.float32(0.8))]
    json.dumps(formats.compute_stats(segs, 30))


def test_cues_flow_across_whisper_segment_boundaries():
    a = seg(0, 0, 2, "Let us test whether", words((" Let", 0, .3), (" us", .3, .6), (" test", .6, 1), (" whether", 1, 2)))
    b = seg(1, 2, 4, "Kubernetes works.", words((" Kubernetes", 2.05, 3), (" works.", 3, 4)))
    cues = formats.build_cues([a, b])
    assert len(cues) == 1 and cues[0]["text"].replace("\n", " ") == "Let us test whether Kubernetes works."


def test_stats():
    segs = [seg(0, 0, 30, "Kubernetes deployments need Kubernetes expertise and good monitoring tools."),
            seg(1, 30, 60, "Monitoring Kubernetes clusters is important.")]
    st = formats.compute_stats(segs, 60)
    assert st["word_count"] == 14
    assert st["keywords"][0]["word"] == "kubernetes"
    assert st["avg_confidence"] == 0.9
