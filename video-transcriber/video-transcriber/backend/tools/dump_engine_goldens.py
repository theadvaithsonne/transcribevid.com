"""Golden fixtures for the browser engine's post-processing and exporters (frontend/src/app/engine/{post,export}).

Runs the PRODUCTION Python code (app.engine, app.formats, app.jobs, app.hinglish and faster-whisper 1.2.1's own
functions) on synthetic and realistic inputs and writes input -> expected pairs as TypeScript modules:

  frontend/src/app/engine/post/post-goldens.ts
  frontend/src/app/engine/export/export-goldens.ts

Three parts of faster-whisper's WhisperModel.generate_segments are not separate functions (the no-speech window
skip, the word / segment anomaly scores and the hallucination-silence guard). They are cut out of the installed
library's source by their first and last lines and executed unchanged, so these goldens also come from the library
code, not from a copy. generate_with_fallback and add_word_timestamps are called with a stand-in model (fixed decode
results, fixed alignments); engine.transcribe runs with a stand-in recogniser exactly like tests/test_engine.py.

    cd backend
    .venv/Scripts/python.exe -I -X utf8 tools/dump_engine_goldens.py
"""
import copy
import dataclasses
import inspect
import json
import logging
import shutil
import sys
import tempfile
import textwrap
import zlib
from pathlib import Path
from types import SimpleNamespace as NS
from typing import List, Optional
from unittest import mock
from urllib.parse import quote

import numpy as np

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))

from app import config, engine, formats, jobs  # noqa: E402
from faster_whisper import transcribe as fw  # noqa: E402
from faster_whisper.utils import get_end  # noqa: E402

ENGINE_DIR = BACKEND.parent / "frontend" / "src" / "app" / "engine"
F32 = lambda x: float(np.float32(x))  # noqa: E731 - what a Float32Array model output looks like as a double


def case(name, input, expected):
    return {"name": name, "input": input, "expected": expected}


# --------------------------------------------------------------------------- faster-whisper source blocks

_GEN_SRC = inspect.getsource(fw.WhisperModel.generate_segments).splitlines()


def _block(first, last):
    """Lines of generate_segments from the first line containing `first` to the next line containing `last`."""
    start = next(i for i, line in enumerate(_GEN_SRC) if first in line)
    end = next(i for i in range(start, len(_GEN_SRC)) if last in _GEN_SRC[i])
    return textwrap.dedent("\n".join(_GEN_SRC[start:end + 1]))


ANOMALY_SRC = _block("def word_anomaly_score(", 'return next((s for s in segments if s["words"]), None)')
SKIP_SRC = _block("if options.no_speech_threshold is not None:", "continue")
GUARD_SRC = _block("if options.hallucination_silence_threshold is not None:",
                   "last_speech_timestamp = last_word_end")
# transcribe.py:1135, read from the library source too
PUNCTUATION = eval(next(line for line in _GEN_SRC if "punctuation = " in line).split("=", 1)[1].strip())


def _run_block(src, env):
    """Execute a loop-body block once; `_skipped` stays True when the block hit `continue`."""
    code = "_skipped = True\nfor _once in range(1):\n" + textwrap.indent(src, "    ") + "\n    _skipped = False\n"
    exec(compile(code, "<generate_segments block>", "exec"), env)
    return env


def _anomaly_env():
    env = {"Optional": Optional, "List": List, "punctuation": PUNCTUATION}
    exec(compile(ANOMALY_SRC, "<anomaly block>", "exec"), env)
    return env


# --------------------------------------------------------------------------- post goldens

def round_cases():
    xs = [(0.125, 2), (0.375, 2), (2.675, 2), (1.005, 2), (0.5, 0), (1.5, 0), (2.5, 0), (-0.5, 0), (-2.5, 0),
          (-1.5, 0), (0.0005, 3), (0.0015, 3), (0.0025, 3), (7.21, 2), (9.950000000000001, 2), (1e-20, 3),
          (123456.785, 2), (-0.001, 2), (0.6065306597126334, 3), (16.099999999999998, 1), (1234.5, 0), (5.5, 0),
          (6.5, 0), (0.1 + 0.2, 2), (2.0 ** -30, 3), (127.49999999999999, 0), (0.70000000000001, 3),
          (59.9996 * 1000, 0), (0.0045, 3), (1e300, 2), (-7.125, 2), (3.0000000000000004, 4), (0.85, 1),
          (0.45, 1), (2.5e-3, 3), (99.995, 2), (F32(0.1), 2), (F32(0.926), 3), (F32(-0.3), 3), (1.15, 1)]
    out = [case(f"round({x!r}, {n})", {"x": x, "n": n}, round(x, n) if n else round(x)) for x, n in xs]
    reprs = [0.0, -0.0, 1.0, 2.5, 0.1, 1e16, 1e15, 123456789012345680.0, 1e-4, 1e-5, 0.00012, 1.5e-7,
             9.950000000000001, 1e22, 5e-324, 1.7976931348623157e308, 100.0, 12.0, 0.7, 1234567890123456.0,
             12345678901234567.0, -3.5e-9, 0.30000000000000004, F32(0.9)]
    out += [case(f"repr({x!r})", {"x": x, "repr": True}, repr(x)) for x in reprs]
    return out


def norm_cases():
    texts = ["Hello,  World!!", "  ...  ", "Don't_stop", "Don't_stop, नमस्ते!", "Thank you.", "THANK YOU",
             "Café déjà vu", "２０２０年", "İstanbul", "ΟΔΟΣ ΚΑΛΟΣ", "a b", "emoji 😀 ok", "x² ½", "٣ عربي",
             "", "日本語のテキスト", "तो student है।", "tab\there\nnew", "__init__"]
    return [case(repr(t), t, engine._norm(t)) for t in texts]


def number_text_cases():
    texts = ["earns 10 000 a month, 20 000 and 1,250 000 and 250 000",
             "call 555 000 now, 3.5 000, 0 000, 1000 000", "10 000 000", "it was 1,000 000 0000",
             "१० 000 रुपये", "no numbers here", "", "  10 000  ", "a10 000", "10 0000", "$10 000.", "5 100"]
    return [case(repr(t), t, engine.fix_number_text(t)) for t in texts]


def merge_number_cases():
    def w(t, a, b, p=0.9):
        return {"start": a, "end": b, "word": t, "probability": p}
    rows = [
        ("thousand", [w(" earns", 0.0, 1.0), w(" 10", 1.0, 1.4, 0.8), w(" 000", 1.4, 1.9, 0.6), w(" a", 2.0, 2.1),
                      w(" month", 2.1, 2.5)], "earns 10,000 a month"),
        ("chained", [w(" 1", 0.0, 1.0), w(" 250", 1.0, 2.0), w(" 000", 2.0, 3.0)], "1,250,000 dollars"),
        ("no comma in text", [w(" earns", 0.0, 1.0), w(" 10", 1.0, 2.0), w(" 000", 2.0, 3.0), w(" a", 3.0, 4.0)],
         "earns 10 000 a"),
        ("not confirmed", [w(" 5", 0.0, 1.0), w(" 100", 1.0, 2.0)], "5 100"),
        ("confirmed by text", [w(" 5", 0.0, 1.0), w(" 100", 1.0, 2.0)], "5,100 people"),
        ("empty", [], "x"),
        ("missing probability", [w(" 10", 0.0, 0.4, None), w(" 000", 0.4, 0.9, 0.6)], "10 000"),
        ("devanagari digits", [w(" १०", 0.0, 0.4, 0.8), w(" 000", 0.4, 0.9, 0.6)], "१० 000"),
        ("four digits stay", [w(" 1000", 0.0, 0.4), w(" 000", 0.4, 0.9)], "1000 000"),
        ("dollar piece", [w(" $10", 6.81, 7.21, 0.844), w(",000", 7.21, 7.89, 0.982)], "It earns $10,000 a month."),
        ("odd mean", [w(" 7", 0.0, 0.5, 0.333), w(" 000", 0.5, 1.0, 0.334)], "7 000"),
    ]
    out = []
    for name, words, text in rows:
        before = copy.deepcopy(words)
        got = engine.merge_number_pieces(words, text)
        assert words == before  # input not mutated
        out.append(case(name, {"words": before, "text": text}, got))
    return out


def raw_word(word, start, end, p):
    return {"start": start, "end": end, "word": word, "probability": p}


def _ns_segment(d):
    words = None if d["words"] is None else [NS(**w) for w in d["words"]]
    return NS(start=d["start"], end=d["end"], text=d["text"], words=words, avg_logprob=d["avg_logprob"],
              no_speech_prob=d["no_speech_prob"])


def raw_seg(start, end, text, words=None, avg_logprob=-0.3, nsp=0.01):
    return {"start": start, "end": end, "text": text, "words": words, "avg_logprob": avg_logprob,
            "no_speech_prob": nsp}


def segment_dict_cases():
    rows = [
        ("number words", 0, raw_seg(0.0, 1.0, " 10 000 a ", [raw_word(" 10", 0.0, 0.4, 0.8),
                                                             raw_word(" 000", 0.4, 0.9, 0.6)], -0.3, 0.01)),
        ("float32 values", 3, raw_seg(F32(0.1), 0.9, " hi there ", [raw_word(" hi", F32(0.1), 0.5, F32(0.9)),
                                                                   raw_word(" there", F32(0.5), F32(0.9), F32(0.7))],
                                      F32(-0.2), F32(0.02))),
        ("no words, logprob -0.5", 0, raw_seg(0.0, 1.0, " hi ", None, F32(-0.5))),
        ("no words, logprob -100", 1, raw_seg(0.0, 1.0, " hi ", None, -100.0)),
        ("no words, logprob +5", 2, raw_seg(0.0, 1.0, " hi ", None, 5.0)),
        ("empty word list", 4, raw_seg(1.234567, 2.345678, "Hello.", [], -0.25, 0.123456)),
        ("rounding", 5, raw_seg(12.345, 13.355, " Fine. ", [raw_word(" Fine.", 12.345, 13.355, 0.8885)], -0.1,
                                0.0005)),
        ("fixture words", 6, raw_seg(6.33, 8.45, " It earns $10,000 a month.",
                                     [raw_word(" It", 6.33, 6.61, 0.964), raw_word(" earns", 6.61, 6.81, 0.993),
                                      raw_word(" $10", 6.81, 7.21, 0.844), raw_word(",000", 7.21, 7.89, 0.982),
                                      raw_word(" a", 7.89, 8.13, 0.987), raw_word(" month.", 8.13, 8.45, 0.999)],
                                     -0.2, 0.011)),
    ]
    return [case(name, {"idx": idx, "segment": seg}, engine._segment_dict(idx, _ns_segment(seg)))
            for name, idx, seg in rows]


class _FakeModel:
    def __init__(self, segs, language, probability):
        self.segs, self.language, self.probability = segs, language, probability

    def transcribe(self, audio, language=None, task="transcribe"):
        return iter(self.segs), NS(language=self.language, language_probability=self.probability)


class _Capture(logging.Handler):
    def __init__(self):
        super().__init__(logging.INFO)
        self.messages = []

    def emit(self, record):
        self.messages.append(record.getMessage())


def run_pipeline(inp):
    model = _FakeModel([_ns_segment(s) for s in inp["segments"]], inp["language"], inp["language_probability"])
    audio = np.zeros(int(inp["duration"] * 16000), np.float32)
    cap = _Capture()
    log = logging.getLogger("vt.engine")
    log.addHandler(cap)
    log.setLevel(logging.INFO)
    progress = []
    try:
        with mock.patch.object(engine, "extract_audio", lambda *a, **k: (audio, lambda: None)), \
                mock.patch.object(engine, "load_model", lambda name: model), \
                mock.patch.object(engine, "_check_model_space", lambda name: None), \
                mock.patch.object(config, "MAX_DURATION_MIN", 0):
            result = engine.transcribe("x.wav", inp["options"],
                                       on_segment=lambda s, p, info: progress.append(p))
    finally:
        log.removeHandler(cap)
    dropped = {"empty": 0, "no_speech": 0, "repetition": 0}
    for m in cap.messages:
        if m.startswith("filtered out segments: "):
            for part in m[len("filtered out segments: "):].split(", "):
                k, v = part.split("=")
                dropped[k] = int(v)
    return {"result": result, "dropped": dropped, "progress": progress}


def pipeline_cases():
    orig = {"output_script": "original"}
    basic = {"output_script": "hinglish", "romanizer": "basic"}
    s = raw_seg
    rows = [
        ("basic progress", {"options": basic, "language": "en", "language_probability": 0.987654,
                            "duration": 10.0, "segments": [s(0.0, 2.0, " Hello"), s(2.0, 5.0, " World")]}),
        ("repetition loop", {"options": orig, "language": "en", "language_probability": 0.9, "duration": 10.0,
                             "segments": [s(float(i), i + 1.0, " Thank you.") for i in range(8)]
                             + [s(8.0, 9.0, " Something else")]}),
        ("repetition ignores case and punctuation", {
            "options": orig, "language": "en", "language_probability": 0.9, "duration": 6.0,
            "segments": [s(0.0, 1.0, "Okay."), s(1.0, 2.0, "okay"), s(2.0, 3.0, "OKAY!"), s(3.0, 4.0, "okay?"),
                         s(4.0, 5.0, "okay")]}),
        ("no-speech and blank", {
            "options": orig, "language": "en", "language_probability": 0.9, "duration": 6.0,
            "segments": [s(0.0, 1.0, "real", None, -0.2, 0.1), s(1.0, 2.0, "ghost", None, -1.5, 0.9),
                         s(2.0, 3.0, "   ", None, -0.2, 0.1), s(3.0, 4.0, "unsure but speech", None, -1.5, 0.2),
                         s(4.0, 5.0, "quiet but ok", None, -0.5, 0.9), s(5.0, 5.5, "edge", None, -1.0, 0.61),
                         s(5.5, 6.0, "edge2", None, -1.01, 0.6)]}),
        ("punctuation-only run", {
            "options": orig, "language": "en", "language_probability": 0.9, "duration": 8.0,
            "segments": [s(0.0, 1.0, "..."), s(1.0, 2.0, "?"), s(2.0, 3.0, "!!"), s(3.0, 4.0, "…"),
                         s(4.0, 5.0, "Real words."), s(5.0, 6.0, "real words")]}),
        ("dropped no-speech does not reset the repeat count", {
            "options": orig, "language": "en", "language_probability": 0.9, "duration": 6.0,
            "segments": [s(0.0, 1.0, "A"), s(1.0, 2.0, "A"), s(2.0, 3.0, "ghost", None, -2.0, 0.95),
                         s(3.0, 4.0, "A"), s(4.0, 5.0, "A"), s(5.0, 6.0, "B")]}),
        ("hindi to hinglish (basic) with words", {
            "options": basic, "language": "hi", "language_probability": 0.71234, "duration": 9.0,
            "segments": [s(0.0, 2.0, " तो student है।", [raw_word(" तो", 0.0, 0.4, 0.91),
                                                       raw_word(" student", 0.4, 1.2, 0.88),
                                                       raw_word(" है।", 1.2, 2.0, 0.45)], -0.4, 0.02),
                         s(2.5, 5.0, " नमस्ते API, भारत!", None, -0.6, 0.03),
                         s(5.0, 9.5, " Hello", [raw_word(" Hello", 5.0, 9.5, 0.99)], -0.1, 0.01)]}),
        ("hindi kept in original script", {
            "options": {**orig, "romanizer": "basic"}, "language": "hi", "language_probability": 0.95,
            "duration": 3.0, "segments": [s(0.0, 2.0, "तो student है।")]}),
        ("translate keeps the text", {
            "options": {**basic, "task": "translate"}, "language": "hi", "language_probability": 0.95,
            "duration": 3.0, "segments": [s(0.0, 2.0, "तो student है।")]}),
        ("marathi is not converted", {
            "options": basic, "language": "mr", "language_probability": 0.95, "duration": 3.0,
            "segments": [s(0.0, 2.0, "तो student है।")]}),
        ("number repair keeps the raw original_text", {
            "options": basic, "language": "en", "language_probability": 1.0, "duration": 3.0,
            "segments": [s(0.0, 2.5, " It earns 10 000 a month.",
                           [raw_word(" It", 0.0, 0.3, 0.96), raw_word(" earns", 0.3, 0.6, 0.99),
                            raw_word(" 10", 0.6, 1.0, 0.84), raw_word(" 000", 1.0, 1.5, 0.98),
                            raw_word(" a", 1.5, 1.7, 0.98), raw_word(" month.", 1.7, 2.5, 0.99)])]}),
        ("progress is capped at 1", {
            "options": orig, "language": "en", "language_probability": 0.5, "duration": 4.0,
            "segments": [s(0.0, 3.0, "one"), s(3.0, 4.6, "two")]}),
        ("nothing kept", {"options": orig, "language": "en", "language_probability": 0.61, "duration": 10.0,
                          "segments": []}),
    ]
    return [case(name, inp, run_pipeline(inp)) for name, inp in rows]


_FB_OPTIONS = NS(max_initial_timestamp=1.0, max_new_tokens=None, temperatures=[0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
                 best_of=5, beam_size=5, patience=1, length_penalty=1, repetition_penalty=1, no_repeat_ngram_size=0,
                 suppress_blank=True, suppress_tokens=[-1], compression_ratio_threshold=2.4, log_prob_threshold=-1.0,
                 no_speech_threshold=0.6)


def fallback_cases():
    normal = "Hello there, this is normal speech."
    loop = " ".join(["la"] * 60)
    rows = [
        ("first try passes", [(normal, -0.2, 10, 0.01)]),
        ("repetitive then fine", [(loop, -0.1, 60, 0.01), (normal, -0.3, 10, 0.01)]),
        ("low log-prob twice", [(normal, -1.5, 10, 0.1), (normal, -1.2, 10, 0.1), (normal, -0.9, 10, 0.1)]),
        ("silence is accepted", [(normal, -1.6, 10, 0.7)]),
        ("all fail, best below the ratio limit", [(normal, -1.5, 10, 0.1), (loop, -0.5, 60, 0.1),
                                                 (normal, -1.2, 10, 0.1), (normal, -1.9, 10, 0.1),
                                                 (loop, -0.2, 60, 0.1), (normal, -1.3, 10, 0.1)]),
        ("all repetitive", [(loop, -0.5, 60, 0.1), (loop, -0.3, 60, 0.1), (loop, -0.4, 60, 0.1),
                            (loop, -0.9, 60, 0.1), (loop, -0.3, 60, 0.1), (loop, -0.6, 60, 0.1)]),
        ("ties keep the first", [(normal, -1.1, 10, 0.1)] * 6),
        ("empty text", [("", 0.0, 0, 0.2)]),
        ("exactly at the limits", [(normal, -1.1, 10, 0.6), (normal, -1.0 * 11 / 10, 10, 0.61)]),
    ]
    out = []
    for name, attempts in rows:
        attempts = list(attempts) + [attempts[-1]] * (6 - len(attempts))
        results, calls = [], []

        class Model:
            def generate(self, enc, prompts, **kw):
                text, score, seq_len, nsp = attempts[len(calls)]
                calls.append(kw.get("sampling_temperature", 0.0))
                r = NS(sequences_ids=[[1000 + len(calls)] * seq_len], scores=[score], no_speech_prob=nsp)
                results.append(r)
                return [r]

        tok = NS(decode=lambda tokens: attempts[len(calls) - 1][0])
        me = NS(model=Model(), max_length=448, time_precision=0.02, logger=logging.getLogger("fw-golden"))
        result, avg, temperature, cr = fw.WhisperModel.generate_with_fallback(me, None, [1, 2, 3], tok, _FB_OPTIONS)
        chosen = next(i for i, r in enumerate(results) if r is result)
        inp = []
        for text, score, seq_len, nsp in attempts:
            inp.append({"text": text, "score": score, "seq_len": seq_len, "no_speech_prob": nsp,
                        "avg_logprob": score * seq_len / (seq_len + 1),
                        "compression_ratio": fw.get_compression_ratio(text.strip())})
        out.append(case(name, {"attempts": inp}, {"chosen": chosen, "avg_logprob": avg, "temperature": temperature,
                                                  "compression_ratio": cr, "tried": len(calls)}))
    return out


def compression_cases():
    texts = ["Hello there, this is normal speech.", " ".join(["la"] * 60), "तो student है। नमस्ते API, भारत!", "",
             "Thank you. " * 40, "a", ("The quick brown fox jumps over the lazy dog. " * 3) + "日本語のテキスト 😀"]
    return [case(repr(t[:40]), t, {"ratio": fw.get_compression_ratio(t), "bytes": len(t.encode("utf-8")),
                                   "compressed": len(zlib.compress(t.encode("utf-8")))}) for t in texts]


def window_skip_cases():
    rows = [(0.7, -1.2), (0.7, -0.5), (0.5, -2.0), (0.6, -2.0), (0.61, -1.0), (0.99, -1.0000001), (0.0, -5.0)]
    out = []
    for nsp, avg in rows:
        env = _run_block(SKIP_SRC, {"options": NS(no_speech_threshold=0.6, log_prob_threshold=-1.0),
                                    "result": NS(no_speech_prob=nsp), "avg_logprob": avg, "seek": 1200,
                                    "segment_size": 3000, "self": NS(logger=logging.getLogger("fw-golden"))})
        out.append(case(f"nsp {nsp} avg {avg}", {"no_speech_prob": nsp, "avg_logprob": avg, "seek": 1200,
                                                 "segment_size": 3000},
                        {"skip": env["_skipped"], "seek": env["seek"]}))
    return out


def ww(word, start, end, p=0.9):
    return {"word": word, "start": start, "end": end, "probability": p}


def anomaly_cases():
    env = _anomaly_env()
    rows = [
        ("normal words", [ww(" Hello", 0.0, 0.34, 0.926), ww(" everyone,", 0.34, 0.94, 0.905)]),
        ("improbable and short", [ww(" uh", 1.0, 1.02, 0.05), ww(" the", 1.02, 1.04, 0.1)]),
        ("one long word", [ww(" Thanks", 0.0, 4.5, 0.6)]),
        ("punctuation excluded", [ww(" ,", 0.0, 0.0, 0.01), ww("-", 0.0, 0.0, 0.01), ww(" ok", 0.0, 0.5, 0.9)]),
        ("only punctuation", [ww(".", 0.0, 0.0, 0.0)]),
        ("ten words, first eight counted", [ww(f" w{i}", i * 0.5, i * 0.5 + 0.4, 0.9) for i in range(8)]
         + [ww(" x", 4.0, 4.01, 0.01), ww(" y", 4.01, 4.02, 0.01)]),
        ("score just under three", [ww(" a", 0.0, 0.1, 0.1), ww(" b", 0.1, 0.2, 0.1), ww(" c", 0.2, 0.3, 0.9),
                                    ww(" d", 0.3, 0.4, 0.9)]),
        ("empty word list", []),
        ("exact 0.133", [ww(" ok", 0.0, 0.133, 0.15)]),
    ]
    out = []
    for name, words in rows:
        seg = {"words": copy.deepcopy(words)}
        out.append(case(name, words, {"scores": [env["word_anomaly_score"](w) for w in words],
                                      "anomaly": env["is_segment_anomaly"](seg)}))
    out.append(case("no segment", None, {"scores": [], "anomaly": env["is_segment_anomaly"](None)}))
    return out


def _sub(start, end, words):
    return {"start": start, "end": end, "words": words}


def guard_cases():
    good = lambda a: [ww(" real", a, a + 0.4, 0.95), ww(" speech", a + 0.4, a + 0.8, 0.93)]  # noqa: E731
    bad = lambda a: [ww(" Thank", a, a + 0.02, 0.05), ww(" you.", a + 0.02, a + 0.04, 0.08)]  # noqa: E731
    base = {"time_offset": 30.0, "segment_duration": 30.0, "window_end_time": 60.0, "content_duration": 300.0,
            "content_frames": 30000, "previous_seek": 3000, "seek": 5500, "last_speech_timestamp": 29.5}
    rows = [
        ("clean window", base, [_sub(30.5, 31.3, good(30.5)), _sub(32.0, 32.8, good(32.0))]),
        ("anomalous first segment after a long gap", base, [_sub(34.25, 34.29, bad(34.25)),
                                                            _sub(40.0, 40.8, good(40.0))]),
        ("anomalous first segment near the start", base, [_sub(30.5, 30.54, bad(30.5)),
                                                          _sub(31.0, 31.04, bad(31.0)),
                                                          _sub(40.0, 40.8, good(40.0))]),
        ("hallucination between silences", base, [_sub(30.2, 31.0, good(30.2)), _sub(36.0, 36.04, bad(36.0)),
                                                  _sub(45.0, 45.8, good(45.0))]),
        ("anomaly surrounded by speech is kept", base, [_sub(30.2, 31.0, good(30.2)),
                                                        _sub(31.5, 31.54, bad(31.5)),
                                                        _sub(32.0, 32.8, good(32.0))]),
        ("segments without words are skipped", base, [_sub(30.2, 31.0, good(30.2)), _sub(31.0, 33.0, []),
                                                      _sub(37.0, 37.04, bad(37.0))]),
        ("hallucination at the end of the file", {**base, "content_duration": 59.0, "content_frames": 5900},
         [_sub(30.2, 31.0, good(30.2)), _sub(57.5, 57.54, bad(57.5))]),
        ("no words at all", base, [_sub(30.0, 35.0, []), _sub(35.0, 40.0, [])]),
        ("first window of the file", {**base, "time_offset": 0.0, "window_end_time": 30.0, "previous_seek": 0,
                                      "seek": 2500, "last_speech_timestamp": 0.0},
         [_sub(1.0, 1.04, bad(1.0)), _sub(5.0, 5.8, good(5.0))]),
        ("rounding of the skip", {**base, "previous_seek": 3001}, [_sub(32.125, 32.165, bad(32.125))]),
    ]
    out = []
    for name, params, segments in rows:
        env = _anomaly_env()
        env.update(copy.deepcopy(params))
        env.update(current_segments=copy.deepcopy(segments), get_end=get_end,
                   options=NS(hallucination_silence_threshold=2.0), self=NS(frames_per_second=100))
        _run_block(GUARD_SRC, env)
        out.append(case(name, {**params, "segments": segments},
                        {"skip_window": env["_skipped"], "seek": env["seek"], "segments": env["current_segments"],
                         "last_speech_timestamp": env["last_speech_timestamp"]}))
    return out


def merge_punctuation_cases():
    def a(*items):
        return [{"word": w, "tokens": t, "start": 0.0, "end": 0.0, "probability": 0.9} for w, t in items]
    rows = [
        ("quotes and brackets", a((" \"", [1]), ("Hello", [2]), (",", [3]), (" (", [4]), ("world", [5]),
                                  (")", [6]), (".", [7]), ("\"", [8]))),
        ("leading space keeps punctuation separate", a((" Hello", [1]), (" ,", [2]), (" world", [3]))),
        ("chinese marks", a(("你好", [1, 2]), ("，", [3]), ("世界", [4]), ("。", [5]))),
        ("prepend chain", a((" ¿", [1]), (" (", [2]), ("Qué", [3]), ("?", [4]))),
        ("dash", a((" -", [1]), ("well", [2]), (" done", [3]), ("!", [4]), ("!", [5]))),
        ("single", a((" Hi", [1]),)),
        ("empty", []),
    ]
    out = []
    for name, al in rows:
        got = copy.deepcopy(al)
        fw.merge_punctuations(got, "\"'“¿([{-", "\"'.。,，!！?？:：”)]}、")
        out.append(case(name, al, got))
    return out


def word_timestamp_cases():
    def al(*items):
        return [{"word": w, "tokens": t, "start": s, "end": e, "probability": p} for w, t, s, e, p in items]
    eot = 50257
    rows = [
        ("two subsegments", 0, 0.0,
         [{"seek": 0, "start": 0.0, "end": 2.5, "tokens": [50364, 1, 2, 3, 50489]},
          {"seek": 0, "start": 2.5, "end": 5.0, "tokens": [50489, 4, 5, 50614]}],
         al((" Hello", [1], 0.0, 0.34, 0.926), (" every", [2], 0.34, 0.6, 0.9), ("one", [3], 0.6, 0.94, 0.91),
            (" good", [4], 2.6, 3.0, 0.8), (" morning.", [5], 3.0, 4.9, 0.95))),
        ("long first word after a pause", 1200, 5.0,
         [{"seek": 1200, "start": 12.0, "end": 16.0, "tokens": [50364, 1, 2, 3, 50564]}],
         al((" So", [1], 0.0, 2.6, 0.5), (" then", [2], 2.6, 2.9, 0.9), (" we", [3], 2.9, 3.1, 0.9))),
        ("sentence-end mark truncated", 0, 0.0,
         [{"seek": 0, "start": 0.0, "end": 6.0, "tokens": [50364, 1, 2, 3, 4, 50664]}],
         al((" Yes", [1], 0.0, 0.3, 0.9), (".", [2], 0.3, 3.0, 0.9), (" No", [3], 3.0, 5.5, 0.9),
            ("!", [4], 5.5, 5.6, 0.9))),
        ("segment start and end preferred", 0, 0.0,
         [{"seek": 0, "start": 2.0, "end": 3.0, "tokens": [50464, 1, 2, 50514]}],
         al((" Long", [1], 0.2, 2.3, 0.9), (" tail", [2], 2.3, 4.0, 0.9))),
        ("all durations zero", 300, 0.0,
         [{"seek": 300, "start": 3.0, "end": 4.0, "tokens": [1, 2]}],
         al((" a", [1], 0.0, 0.0, 0.5), (" b", [2], 0.0, 0.0, 0.5))),
        ("punctuation merged into words", 0, 0.0,
         [{"seek": 0, "start": 0.0, "end": 2.0, "tokens": [50364, 1, 2, 3, 4, 50464]}],
         al((" \"", [1], 0.0, 0.1, 0.9), ("Hi", [2], 0.1, 0.5, 0.9), (",", [3], 0.5, 0.6, 0.9),
            (" you", [4], 0.6, 1.9, 0.9))),
        ("rounding of word times", 1234, 10.0,
         [{"seek": 1234, "start": 12.34, "end": 14.0, "tokens": [1, 2]}],
         al((" one", [1], 0.005, 0.715, 0.9), (" two", [2], 0.715, 1.665, 0.9))),
        ("more words than tokens of the subsegment", 0, 0.0,
         [{"seek": 0, "start": 0.0, "end": 1.0, "tokens": [1]}, {"seek": 0, "start": 1.0, "end": 2.0, "tokens": []},
          {"seek": 0, "start": 1.0, "end": 2.0, "tokens": [3]}],
         al((" x", [1], 0.0, 0.5, 0.9), (" y", [2], 0.5, 1.0, 0.9), (" z", [3], 1.0, 1.5, 0.9))),
    ]
    out = []
    for name, seek, last, subsegments, alignment in rows:
        me = NS(frames_per_second=100, find_alignment=lambda tokenizer, text_tokens, enc, n: [copy.deepcopy(alignment)])
        segs = [copy.deepcopy(subsegments)]
        ret = fw.WhisperModel.add_word_timestamps(me, segs, NS(eot=eot), None, 3000, "\"'“¿([{-",
                                                  "\"'.。,，!！?？:：”)]}、", last_speech_timestamp=last)
        out.append(case(name, {"subsegments": subsegments, "alignment": alignment, "last_speech_timestamp": last,
                               "eot": eot},
                        {"subsegments": segs[0], "last_speech_timestamp": ret}))
    return out


def restore_cases():
    chunks = [{"start": 0, "end": 45312}, {"start": 46848, "end": 96000}, {"start": 97536, "end": 143104},
              {"start": 192768, "end": 280320}]
    fields = [f.name for f in dataclasses.fields(fw.Segment)]

    def seg(start, end, words=None):
        d = {f: None for f in fields}
        d.update(start=start, end=end, words=None if words is None else [fw.Word(*w) for w in words])
        return fw.Segment(**d)

    rows = [
        ("words map per chunk", [seg(0.0, 5.38, [(0.0, 0.34, " Hello", 0.9), (2.7, 2.95, " show.", 0.9),
                                                 (3.1, 5.38, " recognition.", 0.9)]),
                                 seg(5.38, 11.0, [(5.38, 5.7, " It", 0.9), (8.8, 9.2, " After", 0.9),
                                                  (10.5, 11.0, " part", 0.9)])]),
        ("segments without words", [seg(0.0, 2.832), seg(2.832, 5.904), seg(5.904, 11.5), seg(11.5, 14.0)]),
        ("end exactly at a chunk end", [seg(2.0, 2.832), seg(5.904, 8.752)]),
        ("time past the last chunk", [seg(13.0, 20.0), seg(14.0, 14.5, [(14.0, 14.5, " end", 0.5)])]),
    ]
    out = []
    for name, segments in rows:
        inp = [{"start": s.start, "end": s.end,
                "words": None if s.words is None else [dataclasses.asdict(w) for w in s.words]} for s in segments]
        got = list(fw.restore_speech_timestamps(copy.deepcopy(segments), chunks, 16000))
        exp = [{"start": s.start, "end": s.end,
                "words": None if s.words is None else [dataclasses.asdict(w) for w in s.words]} for s in got]
        out.append(case(name, {"chunks": chunks, "segments": inp, "sampling_rate": 16000}, exp))
    return out


def sseg(i, start, end, text, conf=0.9, words=None, **extra):
    d = {"id": i, "start": float(start), "end": float(end), "text": text, "words": words,
         "confidence": None if conf is None else float(conf)}
    d.update(extra)
    return d


LOREM = ("Kubernetes deployments need Kubernetes expertise and good monitoring tools. Monitoring clusters is "
         "important for every team that runs production services at scale.")


def stats_inputs():
    many_short = " ".join(f"w{i:02d}" for i in range(80)) + " ".join(" longword" + chr(97 + i) for i in range(5))
    return [
        ("appendix b5", [sseg(0, 0, 30, "Kubernetes deployments don't need Kubernetes expertise, it's good monitoring "
                                        "tools. Café déjà vu naïve résumé.", 0.5),
                         sseg(1, 30, 60, "Monitoring Kubernetes clusters is important. Monitoring 123 abc_def x1y2",
                              0.9)], 60.0),
        ("repo test", [sseg(0, 0, 30, "Kubernetes deployments need Kubernetes expertise and good monitoring tools."),
                       sseg(1, 30, 60, "Monitoring Kubernetes clusters is important.")], 60.0),
        ("empty", [], 0.0),
        ("short speech has no pace", [sseg(0, 0, 5, "Five seconds exactly here.", 0.55)], 5.0),
        ("no confidences", [sseg(0, 0, 3, "Qwen text here", None), sseg(1, 3, 9.25, "more qwen words", None)], 9.25),
        ("devanagari is cut at vowel signs", [sseg(0, 0, 7, "तो student है। नमस्ते भारत की दुनिया", 0.61),
                                              sseg(1, 7, 14, "toh student hai. namaste bhaarat duniya", 0.59)], 14.0),
        ("curly apostrophes and numbers", [sseg(0, 0, 10, "It’s John’s 2nd café’s ½ ²nd year’s don’t 10,000 people",
                                                0.72)], 10.0),
        ("negative durations and overlaps", [sseg(0, 5, 4, "backwards words here", 0.3),
                                             sseg(1, 3, 12.35, "overlapping speech words here", 0.95)], 12.35),
        ("cut after the top 80", [sseg(0, 0, 60, many_short, 0.8)], 60.0),
        ("more than twelve keywords", [sseg(0, 0, 61, LOREM + " " + LOREM.upper(), 0.875),
                                       sseg(1, 61, 122.4, "alpha bravo charlie delta echo foxtrot golf hotel india "
                                                          "juliet kilo lima mike november oscar papa quebec", 0.876)],
         122.4),
        ("rounding", [sseg(0, 0.05, 0.1, "Tiny", 0.0005), sseg(1, 0.1, 0.15, "Bits", 0.001)], 0.15),
    ]


def stats_cases():
    return [case(name, {"segments": segs, "duration": dur}, formats.compute_stats(segs, dur))
            for name, segs, dur in stats_inputs()]


def edit_cases():
    w = lambda t, a, b, p: {"start": a, "end": b, "word": t, "probability": p}  # noqa: E731
    segments = [
        sseg(0, 0.0, 2.0, "Hello there.", 0.95, [w(" Hello", 0.0, 0.5, 0.97), w(" there.", 0.5, 2.0, 0.93)],
             no_speech_prob=0.01, original_text="Hello there."),
        sseg(1, 2.5, 4.0, "toh student hai.", 0.7, [w(" toh", 2.5, 3.0, 0.8, ), w(" student", 3.0, 3.5, 0.9),
                                                   w(" hai.", 3.5, 4.0, 0.4)],
             no_speech_prob=0.02, romanizer="basic", conversion_warning="Basic phonetic conversion is being used. "
             "Names and unfamiliar words may have awkward spelling.", original_text="तो student है।"),
        sseg(2, 10.0, 12.0, "Third paragraph here.", 0.5, None, no_speech_prob=0.03,
             original_text="Third paragraph here."),
        sseg(3, 12.0, 13.0, "Fourth.", 0.9, None, no_speech_prob=0.0, original_text="Fourth."),
        sseg(5, 14.0, 15.0, "Sixth.", 0.88, None, no_speech_prob=0.0, original_text="Sixth."),
    ]
    rows = [
        ("text change drops words", [{"id": 0, "text": "  Hello there, friend.  ", "deleted": False}]),
        ("same text, new times", [{"id": 1, "text": "toh student hai.", "start": 2.4, "end": 4.2, "deleted": False}]),
        ("delete and unknown id", [{"id": 2, "text": "x", "deleted": True}, {"id": 99, "text": "ghost",
                                                                              "deleted": False}]),
        ("whitespace text stays as empty", [{"id": 3, "text": "   \n ", "deleted": False}]),
        ("negative start and end before start", [{"id": 5, "text": "Sixth.", "start": -3.0, "end": -5.0,
                                                  "deleted": False}]),
        ("hinglish line edited keeps original_text", [{"id": 1, "text": "to student hai", "deleted": False}]),
        ("end only", [{"id": 0, "text": "Hello there.", "end": 2.25, "deleted": False}]),
        ("nothing", []),
    ]
    out = []
    root = Path(tempfile.mkdtemp(prefix="vt-goldens-"))
    try:
        store = jobs.JobStore(root=root, start_worker=False, instance=False)
        for name, edits in rows:
            jid = "0" * 31 + "1"
            store.jobs[jid] = {"id": jid, "status": "done", "segments": copy.deepcopy(segments), "duration": 15.0,
                               "segment_count": len(segments), "stats": None, "version": 0, "title": "Old"}
            job = store.update_segments(jid, copy.deepcopy(edits))
            out.append(case(name, {"segments": segments, "edits": edits, "duration": 15.0},
                            {"segments": job["segments"], "segment_count": job["segment_count"],
                             "stats": job["stats"]}))
        titles = []
        for t in ["  New name  ", "", "   ", "x" * 500, "नया शीर्षक", " a\tb "]:
            store.jobs["f" * 32] = {"id": "f" * 32, "title": "Old", "version": 0}
            titles.append(case(repr(t[:20]), {"previous": "Old", "title": t},
                               store.update_title("f" * 32, t)["title"]))
    finally:
        shutil.rmtree(root, ignore_errors=True)
    return out, titles


# --------------------------------------------------------------------------- export goldens

def fmt_ts_cases():
    secs = [0, 0.0, 0.0004, 0.0005, 0.0015, 0.0025, 1.5, 65.5, 3661.2, -3, 59.9996, 3599.9995, 172800.5,
            0.1 + 0.2, 1.0005, 2.0005, 12.345, 7.21, 36000.0, 5.15, 9.950000000000001, 4.923076923076923, 0.0125]
    return [case(f"{s!r} {st}", {"sec": s, "style": st}, formats.fmt_ts(s, st))
            for s in secs for st in ("short", "srt", "vtt")]


def wrap_cases():
    rows = [("The quick brown fox jumps over the lazy dog near the river bank today", 42, 2),
            ("Short line", 42, 2), ("a" * 60, 42, 2), ("The quick brown fox jumps over the lazy dog near", 42, 1),
            ("The quick brown fox jumps over the lazy dog near the river bank today", 42, 3),
            ("Tabs\tand\nnewlines   and  spaces  everywhere in this rather long line here", 30, 2),
            ("x" * 42, 42, 2), ("😀 " * 30, 20, 2), ("日本語のテキストはスペースなしで書かれます。" * 3, 20, 2),
            ("nbsp joined words that are long enough to wrap twice over", 20, 2),
            ("one two three four five six seven eight nine ten eleven twelve thirteen", 20, 2),
            ("averyveryverylongwordthatcannotbreak and short", 20, 2), ("  ", 42, 2), ("", 42, 2)]
    return [case(repr(t[:30]) + f" {c}x{n}", {"text": t, "max_chars": c, "max_lines": n}, formats._wrap(t, c, n))
            for t, c, n in rows]


def fw_words(*items, p=0.9):
    return [{"start": float(s), "end": float(e), "word": w, "probability": p} for w, s, e in items]


def cue_cases():
    text40 = " ".join(f"word{i}" for i in range(40)) + "."
    w40 = fw_words(*[(f" word{i}", i * 0.4, i * 0.4 + 0.35) for i in range(40)])
    rows = [
        ("40 words", [sseg(0, 0, 16, text40, 0.9, w40)], {}),
        ("40 words, 20 chars, 1 line", [sseg(0, 0, 16, text40, 0.9, w40)], {"max_chars": 20, "max_lines": 1}),
        ("40 words, 80 chars, 3 lines", [sseg(0, 0, 16, text40, 0.9, w40)], {"max_chars": 80, "max_lines": 3}),
        ("edited segment without words", [sseg(0, 0, 10, "This is a fairly long edited sentence. And here is "
                                                         "another one that follows it.")], {}),
        ("sentence and pause splits", [sseg(0, 0, 2, "Welcome everyone today. Bye",
                                            words=fw_words((" Welcome", 0, 0.5), (" everyone", 0.5, 1.0),
                                                           (" today.", 1.0, 1.5), (" Bye", 1.6, 2.0))),
                                       sseg(1, 2, 4, "first second", words=fw_words((" first", 2.0, 2.5),
                                                                                    (" second", 3.5, 4.0)))], {}),
        ("flow across segments", [sseg(0, 0, 2, "Let us test whether",
                                       words=fw_words((" Let", 0, .3), (" us", .3, .6), (" test", .6, 1),
                                                      (" whether", 1, 2))),
                                  sseg(1, 2, 4, "Kubernetes works.",
                                       words=fw_words((" Kubernetes", 2.05, 3), (" works.", 3, 4)))], {}),
        ("clause split", [sseg(0, 0, 8, "x", words=fw_words(*[(f" clause{i}{',' if i % 4 == 3 else ''}", i * 0.3,
                                                                i * 0.3 + 0.25) for i in range(20)]))], {}),
        ("one word", [sseg(0, 1, 1.2, "Hi.", words=fw_words((" Hi.", 1.0, 1.2)))], {}),
        ("overlapping and backwards times", [sseg(0, 0, 3, "Overlap one", words=fw_words((" Overlap", 0, 1.5),
                                                                                       (" one", 1.5, 3.0))),
                                             sseg(1, 2.5, 3.2, "two", words=fw_words((" two", 2.5, 3.2))),
                                             sseg(2, 1.0, 1.5, "back", words=fw_words((" back", 1.0, 1.5)))], {}),
        ("very long word", [sseg(0, 0, 4, "see https://example.com/a/very/long/path/that/never/ends/index.html now",
                                 None)], {}),
        ("unicode without spaces", [sseg(0, 0, 6, "日本語", words=fw_words(("日本", 0, 1), ("語", 1, 2),
                                                                         ("の", 2, 2.5), ("テキスト。", 2.5, 4),
                                                                         ("次", 4.1, 6)))], {}),
        ("emoji words", [sseg(0, 0, 3, "😀 " * 30, None)], {"max_chars": 20}),
        ("empty and whitespace text", [sseg(0, 0, 1, ""), sseg(1, 1, 2, "   "), sseg(2, 2, 3, "Kept.")], {}),
        ("empty word list falls back to text", [sseg(0, 0, 2, "From text", words=[])], {}),
        ("zero-length segment", [sseg(0, 5, 5, "Instant words")], {}),
        ("short cues get the minimum time", [sseg(0, 0, 0.3, "A.", words=fw_words((" A.", 0, 0.1))),
                                             sseg(1, 0.5, 0.6, "B.", words=fw_words((" B.", 0.5, 0.6))),
                                             sseg(2, 3, 3.1, "C.", words=fw_words((" C.", 3.0, 3.1)))], {}),
        ("quoted sentence end", [sseg(0, 0, 4, "x", words=fw_words((" He", 0, .3), (" said", .3, .6),
                                                                    (" \"Stop.\"", .6, 1.0), (" Then", 1.0, 1.4),
                                                                    (" left.", 1.4, 2.0)))], {}),
        ("hindi words with original_word", [sseg(0, 0, 2, "toh student hai.", 0.75,
                                                 [{"start": 0.0, "end": 0.4, "word": " toh", "probability": 0.91,
                                                   "original_word": " तो"},
                                                  {"start": 0.4, "end": 1.2, "word": " student", "probability": 0.88},
                                                  {"start": 1.2, "end": 2.0, "word": " hai.", "probability": 0.45,
                                                   "original_word": " है।"}])], {}),
    ]
    return [case(name, {"segments": segs, "options": opts}, formats.build_cues(segs, **opts))
            for name, segs, opts in rows]


def make_job(title, segments, language="en", duration=None, options=None, language_probability=None,
             filename=None):
    opts = {**engine.DEFAULT_OPTIONS, **(options or {})}
    job = {"title": title, "filename": filename or f"{title}.mp4", "language": language,
           "language_probability": language_probability, "duration": duration, "options": opts,
           "segments": segments}
    job["stats"] = formats.compute_stats(segments, duration) if segments is not None else None
    return job


def export_jobs():
    b3 = [sseg(0, 0, 2, "Hello there.", no_speech_prob=0.01, original_text="Hello there."),
          sseg(1, 2.5, 4, "General Kenobi.", no_speech_prob=0.01, original_text="General Kenobi."),
          sseg(2, 10, 12, "Third paragraph here.", no_speech_prob=0.01, original_text="Third paragraph here.")]
    pipe = run_pipeline({
        "options": {"output_script": "hinglish", "romanizer": "basic"}, "language": "hi",
        "language_probability": 0.71234, "duration": 9.0,
        "segments": [raw_seg(0.0, 2.0, " तो student है।", [raw_word(" तो", 0.0, 0.4, 0.91),
                                                        raw_word(" student", 0.4, 1.2, 0.88),
                                                        raw_word(" है।", 1.2, 2.0, 0.45)], -0.4, 0.02),
                     raw_seg(2.5, 5.0, " नमस्ते API, भारत!", None, -0.6, 0.03),
                     raw_seg(5.0, 9.0, " It earns 10 000 a month.",
                             [raw_word(" It", 5.0, 5.3, 0.96), raw_word(" earns", 5.3, 5.6, 0.99),
                              raw_word(" 10", 5.6, 6.0, 0.84), raw_word(" 000", 6.0, 6.5, 0.98),
                              raw_word(" a", 6.5, 6.7, 0.98), raw_word(" month.", 6.7, 9.0, 0.99)], -0.1, 0.01)]})
    hindi = pipe["result"]
    edited_store = edit_cases()[0][0]["expected"]["segments"]
    long_segments, t = [], 0.0
    for i in range(14):
        sentence = f"Sentence number {i} talks about the ongoing project and its many details at some length."
        long_segments.append(sseg(i, t, t + 4.5, sentence, 0.8 + i / 100, no_speech_prob=0.02,
                                  original_text=sentence))
        t += 4.6 if i != 9 else 8.0
    edge = [sseg(0, 0, 0.5, "Hi.", words=fw_words((" Hi.", 0.0, 0.5))),
            sseg(1, 0.4, 3.0, "Overlap \"quoted\" — dash, emoji 😀 and tab\there", 0.42),
            sseg(2, 3.0, 3.0, "", None),
            sseg(3, 3.5, 9.0, "supercalifragilisticexpialidocious" * 3, 0.6),
            sseg(4, 3661.0, 3663.5, "مرحبا بالعالم", 0.7), sseg(5, 3664.0, 3670.0, "日本語のテキストです。", 0.65),
            sseg(6, 3670.0, 3671.0, "Back\\slash and \"quotes\" and   separator", 0.99)]
    qwen = [{"id": 0, "start": 0.0, "end": 24.5, "text": "toh hum shuru karte hain", "original_text": "तो हम शुरू करते हैं",
             "recognition_text": "तो हम शुरू करते हैं", "overlap_words_removed": 0, "boundary_resolution": "none",
             "review_reasons": [], "words": None, "confidence": None, "timing": "chunk", "edited": False,
             "romanizer": "basic"},
            {"id": 1, "start": 24.5, "end": 49.0, "text": "aur phir aage badhte hain", "original_text": "और फिर आगे बढ़ते हैं",
             "recognition_text": "और फिर आगे बढ़ते हैं", "overlap_words_removed": 3,
             "boundary_resolution": "retry", "review_reasons": ["boundary_retry"], "words": None,
             "confidence": None, "timing": "chunk", "edited": False, "romanizer": "basic"}]
    return [
        ("appendix b3", make_job("T", b3, "en", 12.0, {"model": "small"}, filename="t.mp4")),
        ("hindi hinglish pipeline", make_job("हिंदी क्लास", hindi["segments"], hindi["language"], hindi["duration"],
                                             {"romanizer": "basic"}, hindi["language_probability"],
                                             "हिंदी क्लास.mp4")),
        ("edited lines", make_job("My talk: \"A/B\" test?", edited_store, "en", 15.0, {"model": "base"}, 0.997)),
        ("long transcript", make_job("Long", long_segments, "en", t, {"model": "large-v3-turbo"}, 0.99)),
        ("edge cases", make_job("edge 😀", edge, None, 3671.0, {"model": "tiny", "task": "translate"}, None)),
        ("qwen chunks", make_job("Qwen", qwen, "hi", 49.0, {"engine": "qwen", "model": "qwen3-asr-0.6b"}, None)),
        ("empty transcript", make_job("Empty", [], "en", None, {"model": "small"}, 0.61)),
    ]


def export_cases():
    out = []
    for name, job in export_jobs():
        exp = {}
        for fmt in ("txt", "plain", "srt", "vtt", "json", "md", "bogus"):
            body, mime, ext = formats.render(job, fmt)
            exp[fmt] = {"body": body, "mime": mime, "ext": ext}
        exp["srt_20x1"] = formats.render(job, "srt", max_chars=20, max_lines=1)[0]
        exp["srt_80x3"] = formats.render(job, "srt", max_chars=80, max_lines=3)[0]
        exp["vtt_30x2"] = formats.render(job, "vtt", max_chars=30, max_lines=2)[0]
        exp["txt_no_timestamps"] = formats.to_txt(job["segments"], timestamps=False)
        exp["paragraphs"] = [[s["id"] for s in p] for p in formats.paragraphs(job["segments"])]
        exp["filenames"] = {fmt: f"{job['title']}.{formats.EXPORT_FORMATS[fmt][1]}" for fmt in formats.EXPORT_FORMATS}
        exp["quoted"] = {fmt: quote(n) for fmt, n in exp["filenames"].items()}
        out.append(case(name, job, exp))
    md_rows = [
        ("no options", {"title": "No options", "segments": [sseg(0, 0, 1, "Hi.")]}),
        ("model none", {"title": "None model", "language": "", "duration": 0, "options": {"model": None},
                        "segments": []}),
        ("missing model", {"title": "Missing", "options": {}, "segments": [sseg(0, 0, 1, "Hi.")]}),
    ]
    for name, job in md_rows:
        out.append(case("markdown " + name, job, {"md": {"body": formats.to_markdown(job)}}))
    return out


# --------------------------------------------------------------------------- write

HEADER = """// GENERATED by backend/tools/dump_engine_goldens.py from the production Python code - do not edit.
// Regenerate: cd backend && .venv/Scripts/python.exe -I -X utf8 tools/dump_engine_goldens.py
/* eslint-disable */

export interface GoldenCase {
  name: string;
  input: any;
  expected: any;
}

"""


def write(path, const, groups):
    lines = [HEADER, f"export const {const}: Record<string, GoldenCase[]> = {{"]
    total = 0
    for key, cases in groups.items():
        lines.append(f"  {json.dumps(key)}: [")
        for c in cases:
            lines.append("    " + json.dumps(c, ensure_ascii=False, allow_nan=False) + ",")
        lines.append("  ],")
        total += len(cases)
    lines.append("};\n")
    path.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    return total


def main():
    edits, titles = edit_cases()
    post = {
        "round": round_cases(), "norm": norm_cases(), "fix_number_text": number_text_cases(),
        "merge_number_pieces": merge_number_cases(), "segment_dict": segment_dict_cases(),
        "pipeline": pipeline_cases(), "fallback": fallback_cases(), "compression": compression_cases(),
        "window_skip": window_skip_cases(), "anomaly": anomaly_cases(), "hallucination": guard_cases(),
        "merge_punctuations": merge_punctuation_cases(), "word_timestamps": word_timestamp_cases(),
        "restore": restore_cases(), "stats": stats_cases(), "edits": edits, "title": titles,
    }
    export = {"fmt_ts": fmt_ts_cases(), "wrap": wrap_cases(), "cues": cue_cases(), "jobs": export_cases()}
    n1 = write(ENGINE_DIR / "post" / "post-goldens.ts", "POST_GOLDENS", post)
    n2 = write(ENGINE_DIR / "export" / "export-goldens.ts", "EXPORT_GOLDENS", export)
    print("post:", {k: len(v) for k, v in post.items()}, n1)
    print("export:", {k: len(v) for k, v in export.items()}, n2)


if __name__ == "__main__":
    main()
