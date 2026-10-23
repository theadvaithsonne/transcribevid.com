"""Regression tests on REAL videos (V-1 .. V-6).

The videos are the user's own files and are never copied into the repository: the tests look for them in
$VT_TEST_VIDEOS (default: ~/Desktop/New folder (2)) and skip when they are missing. What IS stored is
`tests/golden/V-n.json` - the reviewed consensus transcript of each video (text + timing only, a few KB).

    npm run test:real                       # all of it (a few minutes)
    VT_TEST_MODEL=large-v3-turbo npm run test:real

Each test cuts a short excerpt out of the video (ffmpeg), transcribes it with the real engine and compares
the words with the golden transcript for the same time window.
"""
import json
import os
import subprocess
import time
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app import config, engine, formats
from tools import metrics, textnorm

VIDEO_DIR = Path(os.environ.get("VT_TEST_VIDEOS", Path.home() / "Desktop" / "New folder (2)"))
GOLDEN_DIR = Path(__file__).parent / "golden"
MODEL = os.environ.get("VT_TEST_MODEL", "small")
# Allowed word-level disagreement between this model's excerpt and the golden transcript. The golden text is
# the consensus of much larger models, so the small default model is allowed more.
MAX_WER = float(os.environ.get("VT_TEST_MAX_WER", {"small": 0.10, "medium": 0.07}.get(MODEL, 0.05)))
EXCERPT_START, EXCERPT_LEN = 0, 45
NAMES = [f"V-{i}" for i in range(1, 7)]

REAL_MODEL_DIR = config.MODEL_DIR  # captured at import, before the shared fixture redirects it to a temp dir

pytestmark = pytest.mark.real_videos


@pytest.fixture(autouse=True)
def real_model_cache(monkeypatch):
    """Use the real, already-downloaded Whisper models instead of the per-test temporary cache."""
    monkeypatch.setattr(config, "MODEL_DIR", REAL_MODEL_DIR)
    engine._downloaded_cache.clear()


def video(name):
    p = VIDEO_DIR / f"{name}.mp4"
    if not p.exists():
        pytest.skip(f"{p} not found (set VT_TEST_VIDEOS)")
    return p


def golden(name):
    p = GOLDEN_DIR / f"{name}.json"
    if not p.exists():
        pytest.skip(f"no golden transcript for {name} yet")
    return json.loads(p.read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def ffmpeg():
    return engine.ffmpeg_exe()


def cut(ffmpeg, src, dst, start=EXCERPT_START, length=EXCERPT_LEN):
    subprocess.run([ffmpeg, "-v", "error", "-y", "-ss", str(start), "-t", str(length), "-i", str(src), "-vn",
                    "-ac", "1", "-ar", "16000", str(dst)], check=True)
    return dst


def words_before(segments, t):
    """Normalised words that START before time `t`, by word timestamps (falls back to whole segments for
    segments without word timing). Cutting by time, not by segment, keeps differently-segmented transcripts
    of the same audio comparable."""
    out = []
    for s in segments:
        words = s.get("words")
        if words:
            out += [(w[1] if isinstance(w, (list, tuple)) else w["word"]) for w in words
                    if (w[0] if isinstance(w, (list, tuple)) else w["start"]) < t]
        elif s["end"] <= t:
            out.append(s["text"])
    return textnorm.normalize(" ".join(out))


def wer_vs_golden(name, segments, start=EXCERPT_START, length=EXCERPT_LEN):
    """WER of an excerpt transcription against the golden transcript for the same window. Words in the last
    few seconds are left out of both sides, where the cut of the excerpt can split a word or a number."""
    edge = 2.0
    gold = [dict(s, words=[[w[0] - start, w[1]] for w in (s.get("words") or [])], start=s["start"] - start, end=s["end"] - start)
            for s in golden(name)["segments"] if s["end"] > start - 0.01 and s["start"] < start + length]
    ref = words_before(gold, length - edge)
    hyp = words_before(segments, length - edge)
    assert len(ref) >= 30, f"{name}: too little golden speech in the first {length}s ({len(ref)} words)"
    return metrics.wer(ref, hyp), ref, hyp


# ------------------------------------------------------------------------------------------ decoding

@pytest.mark.parametrize("name", NAMES)
def test_every_video_decodes_to_speech_audio(name, tmp_path):
    src = video(name)
    audio, cleanup = engine.extract_audio(src, enhance=True, workdir=str(tmp_path))
    try:
        assert len(audio) / engine.SAMPLE_RATE > 60  # all six are minutes long
        assert float(abs(audio[: 16000 * 30]).max()) > 0.05  # there is actual speech energy, not silence
        assert float(abs(audio).max()) < 2.0  # float PCM may overshoot 1.0 a little after the stereo downmix; far more = a bug
    finally:
        del audio
        cleanup()
    assert not list(tmp_path.glob("*.f32"))


# ------------------------------------------------------------------------------------------ recognition

@pytest.mark.parametrize("name", NAMES)
def test_engine_matches_the_golden_transcript(name, ffmpeg, tmp_path):
    gold = golden(name)
    clip = cut(ffmpeg, video(name), tmp_path / f"{name}.wav")
    result = engine.transcribe(clip, {"model": MODEL, "language": "en"})
    segs = result["segments"]
    assert result["language"] == "en" and len(segs) >= 3
    assert all(a["end"] <= b["start"] + 0.3 for a, b in zip(segs, segs[1:])), "segments overlap"
    assert all(0.0 <= (s["confidence"] or 0) <= 1.0 and s["text"].strip() for s in segs)
    m, ref, hyp = wer_vs_golden(name, segs)
    print(f"\n{name} [{MODEL}] excerpt WER vs golden: {100 * m['wer']:.2f}% ({m['errors']} of {m['n_ref']} words)")
    if m["wer"] > MAX_WER:
        pytest.fail(f"{name}: WER {100 * m['wer']:.1f}% > {100 * MAX_WER:.0f}%\n" + "\n".join(metrics.diff_report(ref, hyp)[:15]))
    assert gold["language"] == "en"


@pytest.mark.parametrize("name", ["V-3"])
def test_vocabulary_hint_does_not_hurt_and_keeps_brand_spelling(name, ffmpeg, tmp_path):
    """The hint steers names/jargon; the brand must come out as one token-consistent spelling."""
    clip = cut(ffmpeg, video(name), tmp_path / "clip.wav")
    result = engine.transcribe(clip, {"model": MODEL, "language": "en", "prompt": "BAT246, All-Star, Rookie, Home Plate"})
    text = " ".join(s["text"] for s in result["segments"])
    m, ref, hyp = wer_vs_golden(name, result["segments"])
    assert m["wer"] <= MAX_WER + 0.02, "\n".join(metrics.diff_report(ref, hyp)[:10])
    assert text.strip()


# ------------------------------------------------------------------------------------------ through the API

def test_full_api_flow_on_a_real_clip(ffmpeg, tmp_path):
    name = "V-3"
    clip = cut(ffmpeg, video(name), tmp_path / "clip.mp4", length=30)
    from app.main import app
    with TestClient(app) as c:
        r = c.post("/api/jobs", params={"filename": f"{name}.mp4", "options": json.dumps({"model": MODEL, "language": "en"})},
                   content=clip.read_bytes(), headers={"content-type": "application/octet-stream"})
        assert r.status_code == 201, r.text
        job_id = r.json()["id"]
        t0 = time.time()
        while time.time() - t0 < 600:
            j = c.get(f"/api/jobs/{job_id}").json()
            if j["status"] in ("done", "error", "cancelled"):
                break
            time.sleep(1)
        assert j["status"] == "done", j.get("error")
        assert j["language"] == "en" and j["duration"] == pytest.approx(30, abs=1.0)
        assert j["stats"]["word_count"] > 40 and 0 < j["stats"]["avg_confidence"] <= 1
        assert j["media_url"] and c.get(j["media_url"]).status_code == 200
        for fmt, head in (("srt", "1\n00:00:"), ("vtt", "WEBVTT"), ("txt", "["), ("md", "# "), ("pdf", "%PDF")):
            body = c.get(f"/api/jobs/{job_id}/export", params={"format": fmt}).content.decode("latin-1")
            assert body.startswith(head) or head in body[:40], fmt
        # an edit shows up in every export
        seg = j["segments"][0]
        c.patch(f"/api/jobs/{job_id}", json={"segments": [{"id": seg["id"], "text": "Edited first line."}]})
        assert "Edited first line." in c.get(f"/api/jobs/{job_id}/export", params={"format": "plain"}).text
        m, ref, hyp = wer_vs_golden(name, [s for s in j["segments"]], length=30)
        assert m["wer"] <= MAX_WER + 0.03, "\n".join(metrics.diff_report(ref, hyp)[:10])


def test_live_segments_stream_in_order_for_a_real_clip(ffmpeg, tmp_path):
    clip = cut(ffmpeg, video("V-6"), tmp_path / "clip.wav", length=30)
    seen = []
    t0 = time.time()
    result = engine.transcribe(clip, {"model": MODEL, "language": "en"},
                               on_segment=lambda s, p, info: seen.append((time.time() - t0, s["id"], p)))
    assert [i for _, i, _ in seen] == list(range(len(result["segments"])))  # streamed in order, none skipped
    assert all(a[2] <= b[2] + 1e-9 for a, b in zip(seen, seen[1:]))  # progress never goes backwards
    assert seen[-1][2] <= 1.0
