import json
import subprocess
from types import SimpleNamespace as NS

import numpy as np
import pytest

from app import engine


# ---------------------------------------------------------------- helpers

def test_norm():
    assert engine._norm("Hello,  World!!") == "hello world"
    assert engine._norm("  ...  ") == ""
    assert engine._norm("Don't_stop") == "don t stop"


def test_supported_filters_kwargs():
    def fn(a, b=1, *, c=2):
        pass
    assert engine._supported(fn, a=1, c=3, zzz=9) == {"a": 1, "c": 3}
    assert engine._supported(fn) == {}


def fake_seg(start=0.0, end=1.0, text=" hi ", words=None, avg_logprob=-0.3, nsp=0.01):
    return NS(start=start, end=end, text=text, words=words, avg_logprob=avg_logprob, no_speech_prob=nsp)


def test_segment_dict_numpy_json_serialisable():
    words = [NS(start=np.float32(0.1), end=np.float64(0.5), word=" hi", probability=np.float32(0.9)),
             NS(start=np.float32(0.5), end=np.float32(0.9), word=" there", probability=np.float32(0.7))]
    s = fake_seg(np.float32(0.1), np.float64(0.9), " hi there ", words, np.float32(-0.2), np.float32(0.02))
    d = engine._segment_dict(3, s)
    json.dumps(d)  # must not raise
    assert d["id"] == 3 and d["text"] == "hi there" and len(d["words"]) == 2
    assert d["confidence"] == pytest.approx(0.8, abs=0.001)
    assert type(d["start"]) is float and type(d["no_speech_prob"]) is float


def test_segment_dict_without_words_uses_logprob():
    d = engine._segment_dict(0, fake_seg(avg_logprob=np.float32(-0.5)))
    json.dumps(d)
    assert d["words"] is None and d["confidence"] == pytest.approx(0.607, abs=0.001)
    assert 0 <= engine._segment_dict(0, fake_seg(avg_logprob=-100))["confidence"] < 0.001
    assert engine._segment_dict(0, fake_seg(avg_logprob=5.0))["confidence"] == 1.0


# ---------------------------------------------------------------- ffmpeg

@pytest.fixture(scope="module")
def ffmpeg():
    return engine.ffmpeg_exe()


def test_extract_audio_sine(tmp_path, ffmpeg):
    wav = tmp_path / "sine.wav"
    subprocess.run([ffmpeg, "-v", "error", "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
                    "-y", str(wav)], check=True)
    for enhance in (True, False):
        a, cleanup = engine.extract_audio(wav, enhance=enhance, workdir=str(tmp_path))
        raw = list(tmp_path.glob("*.f32"))
        assert len(raw) == 1
        assert a.dtype == np.float32 and a.ndim == 1
        assert abs(len(a) - 16000) < 800
        assert 0.05 < np.abs(a).max() <= 1.0
        del a
        cleanup()
        assert not list(tmp_path.glob("*.f32"))


def test_extract_audio_garbage(tmp_path):
    f = tmp_path / "junk.mp4"
    f.write_bytes(b"this is definitely not media" * 50)
    with pytest.raises(RuntimeError) as e:
        engine.extract_audio(f, workdir=str(tmp_path))
    assert str(e.value).strip() and "Traceback" not in str(e.value)
    assert not list(tmp_path.glob("*.f32"))  # temp file removed on failure


def test_extract_audio_video_without_audio(tmp_path, ffmpeg):
    v = tmp_path / "silent.mp4"
    r = subprocess.run([ffmpeg, "-v", "error", "-f", "lavfi", "-i", "color=c=black:s=64x64:d=1",
                        "-y", str(v)], capture_output=True)
    if r.returncode != 0:
        pytest.skip("ffmpeg build cannot encode test video")
    with pytest.raises(RuntimeError, match="no audio"):
        engine.extract_audio(v, workdir=str(tmp_path))
    assert not list(tmp_path.glob("*.f32"))


# ---------------------------------------------------------------- transcribe() with a fake model

class FakeModel:
    def __init__(self, segs):
        self.segs = segs
        self.kwargs = None

    def transcribe(self, audio, language=None, task="transcribe", beam_size=5, initial_prompt=None,
                   vad_filter=False):
        # deliberately a narrow signature: other options must be filtered out by _supported
        self.kwargs = dict(language=language, task=task, beam_size=beam_size,
                           initial_prompt=initial_prompt, vad_filter=vad_filter)
        return iter(self.segs), NS(language=getattr(self, "language", "en"), language_probability=0.987654)


@pytest.fixture()
def patched(monkeypatch):
    def install(segs, seconds=10.0):
        model = FakeModel(segs)
        cleaned = []
        model.cleaned = cleaned
        monkeypatch.setattr(engine, "extract_audio",
                            lambda p, enhance=True, workdir=None, should_cancel=None: (np.zeros(int(seconds * 16000), np.float32),
                                                                   lambda: cleaned.append(1)))
        monkeypatch.setattr(engine, "load_model", lambda name: model)
        monkeypatch.setattr(engine, "_check_model_space", lambda name: None)
        return model
    return install


def test_transcribe_basic_and_progress(patched):
    patched([fake_seg(0, 2, "Hello"), fake_seg(2, 5, "World")])
    seen, phases = [], []
    out = engine.transcribe("x.wav", {"model": "tiny"}, on_phase=lambda n, d=None: phases.append(n),
                            on_segment=lambda s, p, info: seen.append((s["text"], p, info)))
    assert phases == ["extracting", "loading_model", "transcribing"]
    assert [s["text"] for s in out["segments"]] == ["Hello", "World"]
    assert [s["id"] for s in out["segments"]] == [0, 1]
    assert out["duration"] == 10.0 and out["language"] == "en" and out["language_probability"] == 0.988
    assert seen[1][1] == pytest.approx(0.5) and seen[0][2] == {"language": "en", "duration": 10.0}


def test_transcribe_passes_options_and_drops_unsupported(patched):
    model = patched([fake_seg(0, 1, "a")])
    engine.transcribe("x.wav", {"language": "de", "prompt": "  Kubernetes ", "beam_size": 3,
                                "task": "translate", "vad": False})
    assert model.kwargs == {"language": "de", "task": "translate", "beam_size": 3,
                            "initial_prompt": "Kubernetes", "vad_filter": False}


@pytest.mark.parametrize("options,language,expected", [
    ({}, "hi", "तो student है।"),  # the default keeps the original script
    ({"output_script": "hinglish"}, "hi", "toh student hai."),
    ({"output_script": "original"}, "hi", "तो student है।"),
    ({"output_script": "hinglish", "task": "translate"}, "hi", "तो student है।"),
    ({"output_script": "hinglish"}, "mr", "तो student है।"),
])
def test_original_default_and_hinglish_live_and_final_output(patched, options, language, expected):
    model = patched([fake_seg(0, 2, "तो student है।")])
    model.language = language
    live = []
    result = engine.transcribe("x.wav", options, on_segment=lambda s, *a: live.append(s))
    assert result["segments"][0]["text"] == expected
    assert live == result["segments"]
    assert result["segments"][0]["start"] == 0 and result["segments"][0]["end"] == 2


def test_repetition_loop_is_broken(patched):
    patched([fake_seg(i, i + 1, "Thank you.") for i in range(8)] + [fake_seg(8, 9, "Something else")])
    out = engine.transcribe("x.wav", {})
    texts = [s["text"] for s in out["segments"]]
    assert texts.count("Thank you.") == 3  # original + 2 repeats kept, rest dropped
    assert texts[-1] == "Something else"
    assert [s["id"] for s in out["segments"]] == list(range(len(texts)))


def test_repetition_normalises_punctuation_and_case(patched):
    patched([fake_seg(0, 1, "Okay."), fake_seg(1, 2, "okay"), fake_seg(2, 3, "OKAY!"),
             fake_seg(3, 4, "okay?"), fake_seg(4, 5, "okay")])
    assert len(engine.transcribe("x.wav", {})["segments"]) == 3


def test_no_speech_filter_and_blank_text(patched):
    patched([fake_seg(0, 1, "real", avg_logprob=-0.2, nsp=0.1),
             fake_seg(1, 2, "ghost", avg_logprob=-1.5, nsp=0.9),   # silence hallucination
             fake_seg(2, 3, "   ", avg_logprob=-0.2, nsp=0.1),     # blank
             fake_seg(3, 4, "unsure but speech", avg_logprob=-1.5, nsp=0.2),  # low logprob only: keep
             fake_seg(4, 5, "quiet but ok", avg_logprob=-0.5, nsp=0.9)])      # high nsp only: keep
    texts = [s["text"] for s in engine.transcribe("x.wav", {})["segments"]]
    assert texts == ["real", "unsure but speech", "quiet but ok"]


def test_too_short_audio(patched):
    patched([], seconds=0.1)
    with pytest.raises(RuntimeError, match="too short"):
        engine.transcribe("x.wav", {})


def test_cancel_before_model_load(patched):
    patched([fake_seg(0, 1, "a")])
    with pytest.raises(engine.Cancelled):
        engine.transcribe("x.wav", {}, should_cancel=lambda: True)


def test_cancel_mid_stream(patched):
    patched([fake_seg(i, i + 1, f"line {i}") for i in range(5)])
    got = []
    with pytest.raises(engine.Cancelled):
        engine.transcribe("x.wav", {}, on_segment=lambda s, p, i: got.append(s),
                          should_cancel=lambda: len(got) >= 2)
    assert len(got) == 2


def test_model_load_failure_is_readable(patched, monkeypatch):
    patched([])

    def boom(name):
        raise OSError("network down")
    monkeypatch.setattr(engine, "load_model", boom)
    with pytest.raises(RuntimeError, match="Could not load the 'small' model: network down"):
        engine.transcribe("x.wav", {})


def test_cleanup_always_called(patched):
    model = patched([fake_seg(0, 1, "a")])
    engine.transcribe("x.wav", {})
    assert model.cleaned == [1]
    model = patched([fake_seg(0, 1, "a")])
    with pytest.raises(engine.Cancelled):
        engine.transcribe("x.wav", {}, should_cancel=lambda: True)
    assert model.cleaned == [1]


def test_numbers_that_lost_their_comma_between_word_pieces_are_rejoined():
    w = lambda t, a, b, p=0.9: {"start": a, "end": b, "word": t, "probability": p}  # noqa: E731
    words = [w(" earns", 0, 1), w(" 10", 1, 1.4, 0.8), w(" 000", 1.4, 1.9, 0.6), w(" a", 2, 2.1), w(" month", 2.1, 2.5)]
    out = engine.merge_number_pieces(words, "earns 10,000 a month")
    assert [x["word"] for x in out] == [" earns", " 10,000", " a", " month"]
    assert (out[1]["start"], out[1]["end"], out[1]["probability"]) == (1, 1.9, 0.7)
    assert words[1]["word"] == " 10"  # the input is not mutated
    # chained groups, and only when the segment text confirms the comma
    big = [w(" 1", 0, 1), w(" 250", 1, 2), w(" 000", 2, 3)]
    assert [x["word"] for x in engine.merge_number_pieces(big, "1,250,000 dollars")] == [" 1,250,000"]
    # "000" after a number is how Whisper writes the WORD "thousand" ("10 000" = 10,000), even with no comma in the text
    out = engine.merge_number_pieces([w(" earns", 0, 1), w(" 10", 1, 2), w(" 000", 2, 3), w(" a", 3, 4)], "earns 10 000 a")
    assert [x["word"] for x in out] == [" earns", " 10,000", " a"]
    assert engine.fix_number_text("earns 10 000 a month, 20 000 and 1,250 000 and 250 000") == "earns 10,000 a month, 20,000 and 1,250,000 and 250,000"
    assert engine.fix_number_text("call 555 000 now, 3.5 000, 0 000, 1000 000") == "call 555,000 now, 3.5 000, 0,000, 1000 000"
    assert len(engine.merge_number_pieces([w(" 5", 0, 1), w(" 100", 1, 2)], "5 100")) == 2
    assert engine.merge_number_pieces([], "x") == []
