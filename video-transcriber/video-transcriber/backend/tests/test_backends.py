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
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [qwen_engine.Chunk(0, 24000), qwen_engine.Chunk(24000, 48000, True)])
    class Model:
        calls = 0
        def transcribe(self, audio, language=None, context=""):
            assert language == "Hindi" and audio[1] == 16000
            self.calls += 1
            return [NS(language="Hindi", text="तो student है।" if self.calls == 1 else "तो student है। और आगे")]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    live = []
    result = backends.transcribe("unused", {"engine": "qwen", "model": "qwen3-asr-0.6b", "language": "hi", "romanizer": "basic", "output_script": "hinglish"},
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
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [qwen_engine.Chunk(0, 400000), qwen_engine.Chunk(400000, 800000, True)])
    calls = []
    class Model:
        def transcribe(self, audio, **kwargs):
            calls.append((audio[0][0], len(audio[0])))
            return [NS(language="English", text="first short sentence" if len(calls) == 1 else "different continuation here")]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    result = qwen_engine.QwenEngine().transcribe("unused", {"model": "qwen3-asr-0.6b"})
    assert calls == [(0, 400000), (368000, 432000), (400000, 400000)]
    assert result["segments"][1]["start"] == 25
    assert result["segments"][1]["text"] == "different continuation here"
    assert result["segments"][1]["boundary_resolution"] == "audio_retry"
    assert result["segments"][1]["review_reasons"] == ["boundary_retry"]
    assert result["segments"][1]["overlap_recognition_text"] == "different continuation here"


def test_qwen_decode_error_always_releases_audio(monkeypatch):
    cleaned = []
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(16000), lambda: cleaned.append(True)))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [qwen_engine.Chunk(0, 16000)])
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


def test_pause_boundaries_do_not_redecode_or_remove_spoken_repetitions(monkeypatch):
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(800000), lambda: None))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [qwen_engine.Chunk(0, 400000), qwen_engine.Chunk(400000, 800000)])
    calls = []
    class Model:
        def transcribe(self, audio, **kwargs):
            calls.append(len(audio[0]))
            return [NS(language="English", text="yes we can yes we can")]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    result = qwen_engine.QwenEngine().transcribe("unused", {"model": "qwen3-asr-0.6b"})
    assert calls == [400000, 400000]
    assert all(s["text"] == "yes we can yes we can" for s in result["segments"])
    assert all(s["overlap_words_removed"] == 0 for s in result["segments"])


def test_silence_returns_no_invented_speech_without_loading_model(monkeypatch):
    cleaned = []
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(16000), lambda: cleaned.append(True)))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [])
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: pytest.fail("Silence must not load ASR"))
    result = qwen_engine.QwenEngine().transcribe("unused", {"model": "qwen3-asr-0.6b"})
    assert result["segments"] == [] and result["duration"] == 1
    assert cleaned == [True]


def test_chunk_plan_uses_short_pauses_and_skips_long_silence_with_original_offsets(monkeypatch):
    from faster_whisper import vad
    sr = engine.SAMPLE_RATE
    def speech(audio, vad_options):
        assert vad_options.min_silence_duration_ms == 300
        assert vad_options.speech_pad_ms == 100
        return [{"start": 0, "end": 19 * sr}, {"start": int(19.4 * sr), "end": 40 * sr},
                {"start": 60 * sr, "end": 65 * sr}]
    monkeypatch.setattr(vad, "get_speech_timestamps", speech)
    plan = list(qwen_engine.chunks(np.zeros(70 * sr)))
    assert plan == [qwen_engine.Chunk(0, int(19.2 * sr)),
                    qwen_engine.Chunk(int(19.2 * sr), 40 * sr),
                    qwen_engine.Chunk(60 * sr, 65 * sr)]


def test_continuous_speech_forces_bounded_chunks_and_vad_can_be_disabled(monkeypatch):
    from faster_whisper import vad
    sr = engine.SAMPLE_RATE
    monkeypatch.setattr(vad, "get_speech_timestamps", lambda *a, **k: pytest.fail("VAD disabled"))
    plan = list(qwen_engine.chunks(np.zeros(61 * sr), vad=False))
    assert plan == [qwen_engine.Chunk(0, 25 * sr), qwen_engine.Chunk(25 * sr, 50 * sr, True),
                    qwen_engine.Chunk(50 * sr, 61 * sr, True)]
    with pytest.raises(ValueError):
        list(qwen_engine.chunks(np.zeros(sr), seconds=0))


@pytest.mark.parametrize("language,first,overlapped,retry", [
    ("English", "ask about quantum fields", "quantum field and their properties", "and their properties"),
    ("Hindi", "अगले विषय पर बात करेंगे", "विषय पर बात करें फिर आगे", "फिर आगे"),
    ("Spanish", "vamos a estudiar física", "estudiar física luego química", "luego química"),
    ("English", "hello नमस्ते API version", "नमस्ते API versions then continue", "then continue"),
])
def test_unmatched_overlap_retries_audio_without_vocabulary_guesses(monkeypatch, language, first, overlapped, retry):
    cleaned, calls = [], []
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(800000), lambda: cleaned.append(True)))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [qwen_engine.Chunk(0, 400000), qwen_engine.Chunk(400000, 800000, True)])
    class Model:
        def transcribe(self, audio, **kwargs):
            calls.append(len(audio[0]))
            return [NS(language=language, text=[first, overlapped, retry][len(calls) - 1])]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    result = qwen_engine.QwenEngine().transcribe("unused", {"model": "qwen3-asr-0.6b", "output_script": "original"})
    last = result["segments"][-1]
    assert last["text"] == last["original_text"] == last["recognition_text"] == retry
    assert last["overlap_recognition_text"] == overlapped
    assert last["words"] is None and last["confidence"] is None
    assert calls == [400000, 432000, 400000] and cleaned == [True]


def test_cancellation_after_inference_prevents_boundary_retry(monkeypatch):
    state = {"cancel": False}
    cleaned = []
    monkeypatch.setattr(engine, "extract_audio", lambda *a, **k: (np.zeros(800000), lambda: cleaned.append(True)))
    monkeypatch.setattr(qwen_engine, "chunks", lambda a, **k: [qwen_engine.Chunk(0, 400000), qwen_engine.Chunk(400000, 800000, True)])
    class Model:
        calls = 0
        def transcribe(self, **kwargs):
            self.calls += 1
            if self.calls == 2:
                state["cancel"] = True
            assert self.calls <= 2
            return [NS(language="English", text="unmatched continuation" if self.calls == 2 else "first passage")]
    monkeypatch.setattr(qwen_engine, "load_model", lambda _: Model())
    with pytest.raises(engine.Cancelled):
        qwen_engine.QwenEngine().transcribe("unused", {"model": "qwen3-asr-0.6b"}, should_cancel=lambda: state["cancel"])
    assert cleaned == [True]


@pytest.mark.parametrize("text,expected", [
    ("go go go", False),
    ("This is a test. This is a test. This is a test.", True),
    ("यह मेरी बात यह मेरी बात यह मेरी बात", True),
    ("mañana veremos física mañana veremos química", False),
    ("नाम राम था नाम रमा था नाम रीमा था", False),
])
def test_repetition_is_a_language_independent_review_signal(text, expected):
    assert qwen_engine.repeated_phrase(text) is expected
