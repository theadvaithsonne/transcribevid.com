from types import SimpleNamespace as NS

import numpy as np
import pytest
from pydantic import ValidationError

from app import backends, engine, qwen_engine
from app.schemas import JobOptions


def test_backend_model_validation():
    assert JobOptions(engine="qwen", model="qwen3-asr-0.6b", language="hi").engine == "qwen"
    for options in ({"engine": "qwen"}, {"model": "qwen3-asr-0.6b"},
                    {"engine": "qwen", "model": "qwen3-asr-0.6b", "task": "translate"},
                    {"engine": "qwen", "model": "qwen3-asr-0.6b", "language": "bn"}):
        with pytest.raises(ValidationError):
            JobOptions(**options)


def test_qwen_outputs_incremental_chunks_without_fabricated_word_scores(monkeypatch):
    cleanup = []
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(48000, np.float32), lambda: cleanup.append(True)))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a: [(0, 24000), (24000, 48000)])
    class Model:
        calls = 0
        def transcribe(self, audio, language=None, context=""):
            assert language == "Hindi" and audio[1] == 16000
            self.calls += 1
            return [NS(language="Hindi", text="तो student है।" if self.calls == 1 else "तो student है। और आगे")]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    live = []
    result = backends.transcribe("unused", {"engine": "qwen", "model": "qwen3-asr-0.6b", "language": "hi", "romanizer": "basic"},
                                on_segment=lambda s, *a: live.append(s))
    assert result["segments"] == live and result["duration"] == 3
    assert [s["start"] for s in live] == [0, 1.5]
    assert live[0]["text"] == "toh student hai."
    assert live[0]["original_text"] == "तो student है।"
    assert all(s["words"] is None and s["confidence"] is None and s["timing"] == "chunk" for s in live)
    assert result["language_probability"] is None and cleanup == [True]
    assert live[1]["text"] == "aur aage"
    assert live[1]["recognition_text"] == "तो student है। और आगे"
    assert live[1]["overlap_words_removed"] == 3


@pytest.mark.parametrize("previous,current,expected,count", [
    ("we should maintain discipline", "Maintain discipline every day", "Maintain discipline every day", 0),
    ("we should maintain discipline daily.", "MAINTAIN discipline daily, and study", "and study", 3),
    ("I think", "think think again", "think think again", 0),
    ("तो उसको कैसे करें?", "उसको कैसे करें। फिर देखें", "फिर देखें", 3),
    ("a different sentence", "unrelated new words", "unrelated new words", 0),
    ("start one two three", "one two three", "", 3),
])
def test_overlap_preserves_uncertain_matches_and_real_short_repetitions(previous, current, expected, count):
    assert qwen_engine.trim_overlap(previous, current) == (expected, count)


def test_qwen_overlap_uses_real_audio_and_keeps_unmatched_text(monkeypatch):
    audio = np.arange(50 * 16000, dtype=np.float32)
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (audio, lambda: None))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a: [(0, 400000), (400000, 800000)])
    calls = []
    class Model:
        def transcribe(self, audio, **kwargs):
            calls.append((audio[0][0], len(audio[0])))
            return [NS(language="English", text="first short sentence" if len(calls) == 1 else "different continuation here")]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    result = qwen_engine.QwenEngine().transcribe("unused", {"model": "qwen3-asr-0.6b"})
    assert calls == [(0, 400000), (368000, 432000)]
    assert result["segments"][1]["start"] == 23
    assert result["segments"][1]["text"] == "different continuation here"


def test_qwen_decode_error_always_releases_audio(monkeypatch):
    cleaned = []
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(16000), lambda: cleaned.append(True)))
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: (_ for _ in ()).throw(RuntimeError("unavailable")))
    with pytest.raises(RuntimeError, match="unavailable"):
        backends.transcribe("unused", {"engine": "qwen", "model": "qwen3-asr-0.6b"})
    assert cleaned == [True]


def test_preview_runs_in_same_worker_pipeline_and_cancel_wins_before_preview(monkeypatch, tmp_path):
    seen = []
    monkeypatch.setattr(engine, "transcribe", lambda *a, **k: {"segments": []})
    monkeypatch.setattr(engine, "make_audio_preview", lambda src, dst: seen.append(dst))
    preview = tmp_path / "preview.mp3"
    backends.transcribe("talk.mkv", {"_preview_to": str(preview)})
    assert seen == [preview]
    with pytest.raises(engine.Cancelled):
        backends.transcribe("talk.mkv", {"_preview_to": str(preview)}, should_cancel=lambda: True)
    assert seen == [preview]
