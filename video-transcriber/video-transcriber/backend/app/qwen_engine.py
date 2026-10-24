"""Optional local Qwen3-ASR adapter with honest chunk timing (no fabricated words)."""
import gc
import re
import unicodedata
from dataclasses import dataclass

from . import config, engine
from .hinglish import convert_segment

MODELS = {"qwen3-asr-0.6b": "Qwen/Qwen3-ASR-0.6B", "qwen3-asr-1.7b": "Qwen/Qwen3-ASR-1.7B"}
LANGUAGES = {"zh", "en", "yue", "ar", "de", "fr", "es", "pt", "id", "it", "ko", "ru", "th", "vi",
             "ja", "tr", "hi", "ms", "nl", "sv", "da", "fi", "pl", "cs", "tl", "fa", "el", "hu", "mk", "ro"}
_model = None
_name = None


@dataclass(frozen=True)
class Chunk:
    start: int
    end: int
    overlap: bool = False  # only a forced cut inside continuous speech needs context


def token_key(token):
    return "".join(c for c in unicodedata.normalize("NFC", token).casefold()
                   if unicodedata.category(c)[0] in "LNM")


def trim_overlap(previous, current, max_words=24):
    """Remove only a substantial exact suffix/prefix match at an audio overlap.

    Ignore case and punctuation, but never guess similar words or remove isolated
    repetitions. Unmatched text is retained for review rather than silently lost.
    """
    left = [token_key(m.group()) for m in re.finditer(r"\S+", previous)]
    right = list(re.finditer(r"\S+", current))
    keys = [token_key(m.group()) for m in right]
    for size in range(min(max_words, len(left), len(keys)), 2, -1):
        if all(keys[:size]) and left[-size:] == keys[:size]:
            return current[right[size - 1].end():].lstrip(), size
    return current, 0


def load_model(name):
    global _model, _name
    if _model is not None and _name == name:
        return _model
    try:
        import torch
        from qwen_asr import Qwen3ASRModel
    except ImportError as exc:
        raise RuntimeError("Qwen is not installed. Install backend/requirements-qwen.txt in the backend environment.") from exc
    _model = None
    gc.collect()
    # Do not hold a Whisper model and a Qwen model in memory simultaneously.
    engine._loaded.update(name=None, model=None)
    device = engine.device_info()[0]
    torch.set_num_threads(config.CPU_THREADS or 4)
    _model = Qwen3ASRModel.from_pretrained(MODELS[name],
        dtype=torch.float16 if device == "cuda" else torch.float32,
        device_map="cuda:0" if device == "cuda" else "cpu", cache_dir=config.MODEL_DIR,
        max_inference_batch_size=1, max_new_tokens=512)
    _name = name
    return _model


def chunks(audio, seconds=25, vad=True):
    """Split at natural pauses, skip long silence, overlap only forced cuts.

    Sample offsets always refer to the original audio, even across skipped gaps.
    No transcript vocabulary or assumed spoken language affects this plan.
    """
    from faster_whisper.vad import VadOptions, get_speech_timestamps
    step = int(seconds * engine.SAMPLE_RATE)
    if step <= 0:
        raise ValueError("Chunk duration must be positive.")
    speech = (get_speech_timestamps(audio, vad_options=VadOptions(
        min_silence_duration_ms=300, speech_pad_ms=100,
    )) if vad else [{"start": 0, "end": len(audio)}])
    if not speech:
        return
    # Do not ask the recognizer to invent speech over long empty intervals.
    groups, group = [], []
    for interval in speech:
        if group and interval["start"] - group[-1]["end"] >= 2 * engine.SAMPLE_RATE:
            groups.append(group)
            group = []
        group.append(interval)
    groups.append(group)
    for group in groups:
        start, stop = group[0]["start"], group[-1]["end"]
        breaks = [(a["end"] + b["start"]) // 2 for a, b in zip(group, group[1:])
                  if b["start"] > a["end"]]
        overlap = False
        while start < stop:
            end = min(stop, start + step)
            nearby = [p for p in breaks if start + step * 0.6 <= p <= end]
            forced = end < stop
            if forced and nearby:
                end, forced = nearby[-1], False
            yield Chunk(start, end, overlap)
            start, overlap = end, forced


def repeated_phrase(text):
    """A review signal, never an instruction to delete potentially spoken words."""
    words = [key for token in text.split() if (key := token_key(token))]
    for width in range(3, min(12, len(words) // 3) + 1):
        for start in range(len(words) - 3 * width + 1):
            phrase = words[start:start + width]
            if phrase == words[start + width:start + 2 * width] == words[start + 2 * width:start + 3 * width]:
                return True
    return False


class QwenEngine:
    def transcribe(self, path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
        import numpy as np
        o = {**engine.DEFAULT_OPTIONS, **options}
        phase = on_phase or (lambda *args: None)
        def check():
            if should_cancel and should_cancel():
                raise engine.Cancelled()
        if o["task"] != "transcribe":
            raise ValueError("Qwen supports transcription here; select Whisper for English translation.")
        check()
        phase("extracting")
        audio, cleanup = engine.extract_audio(path, enhance=o["enhance_audio"], workdir=workdir,
                                              should_cancel=should_cancel)
        try:
            duration = len(audio) / engine.SAMPLE_RATE
            if duration < 0.3:
                raise ValueError("The audio is too short to transcribe.")
            if config.MAX_DURATION_MIN and duration > config.MAX_DURATION_MIN * 60:
                raise ValueError("The recording exceeds this server's duration limit.")
            check()
            spans = list(chunks(audio, vad=o["vad"]))
            check()
            if not spans:
                return {"language": o.get("language"), "language_probability": None,
                        "duration": round(duration, 2), "segments": []}
            phase("loading_model", o["model"])
            model = load_model(o["model"])
            phase("transcribing")
            out, language = [], o.get("language")
            inverse = {name.lower(): code for code, name in engine.LANGUAGES.items()}
            previous_text = ""
            def decode(start, end):
                check()
                kwargs = {"audio": (np.array(audio[start:end], copy=True), engine.SAMPLE_RATE),
                          "language": engine.LANGUAGES.get(o.get("language")), "context": o.get("prompt", "")}
                response = model.transcribe(**engine._supported(model.transcribe, **kwargs))[0]
                check()
                return response

            for chunk in spans:
                start, end = chunk.start, chunk.end
                check()
                # Re-decode two seconds before the boundary to recover cut words.
                # Keep copies: numpy views would prevent decoded memmap cleanup.
                overlap = min(2 * engine.SAMPLE_RATE, (end - start) // 4)
                audio_start = max(0, start - overlap) if previous_text and chunk.overlap else start
                response = decode(audio_start, end)
                raw_text = response.text.strip()
                text, removed = trim_overlap(previous_text, raw_text) if audio_start < start else (raw_text, 0)
                boundary, reasons = "pause", []
                overlap_text = None
                if audio_start < start:
                    if removed:
                        boundary = "exact_overlap"
                    else:
                        # Text-only fuzzy matching can delete real speech, names,
                        # or code-switching. Retry the non-overlapping audio once.
                        overlap_text = raw_text
                        response = decode(start, end)
                        raw_text = text = response.text.strip()
                        boundary = "audio_retry"
                        reasons.append("boundary_retry")
                detected = inverse.get((response.language or "").lower())
                language = language or detected
                if not text:
                    previous_text = ""
                    continue
                previous_text = raw_text
                if repeated_phrase(text):
                    reasons.append("repeated_phrase")
                seg = {"id": len(out), "start": round(start / engine.SAMPLE_RATE, 2),
                       "end": round(end / engine.SAMPLE_RATE, 2), "text": text, "original_text": text,
                       "recognition_text": raw_text, "overlap_words_removed": removed,
                       "boundary_resolution": boundary, "review_reasons": reasons,
                       "words": None, "confidence": None, "timing": "chunk", "edited": False}
                if overlap_text is not None:
                    seg["overlap_recognition_text"] = overlap_text
                if o["output_script"] == "hinglish" and (detected or language) in ("hi", "en"):
                    seg = convert_segment(seg, o.get("romanizer", "auto"))
                out.append(seg)
                if on_segment:
                    on_segment(seg, end / len(audio), {"language": language, "duration": duration})
            check()
            return {"language": language, "language_probability": None, "duration": round(duration, 2), "segments": out}
        finally:
            del audio
            cleanup()
