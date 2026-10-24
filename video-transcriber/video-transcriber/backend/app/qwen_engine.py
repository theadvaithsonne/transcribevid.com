"""Optional local Qwen3-ASR adapter with honest chunk timing (no fabricated words)."""
import gc
import re
import unicodedata

from . import config, engine
from .hinglish import convert_segment

MODELS = {"qwen3-asr-0.6b": "Qwen/Qwen3-ASR-0.6B", "qwen3-asr-1.7b": "Qwen/Qwen3-ASR-1.7B"}
LANGUAGES = {"zh", "en", "yue", "ar", "de", "fr", "es", "pt", "id", "it", "ko", "ru", "th", "vi",
             "ja", "tr", "hi", "ms", "nl", "sv", "da", "fi", "pl", "cs", "tl", "fa", "el", "hu", "mk", "ro"}
_model = None
_name = None


def trim_overlap(previous, current, max_words=24):
    """Remove only a substantial exact suffix/prefix match at an audio overlap.

    Ignore case and punctuation, but never guess similar words or remove isolated
    repetitions. Unmatched text is retained for review rather than silently lost.
    """
    def key(token):
        return "".join(c for c in unicodedata.normalize("NFC", token).casefold()
                       if unicodedata.category(c)[0] in "LNM")
    left = [key(m.group()) for m in re.finditer(r"\S+", previous)]
    right = list(re.finditer(r"\S+", current))
    keys = [key(m.group()) for m in right]
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


def chunks(audio, seconds=25):
    """Prefer silence near the next boundary; keep exact offsets and cover all audio."""
    from faster_whisper.vad import get_speech_timestamps
    speech = get_speech_timestamps(audio)
    breaks = [(a["end"] + b["start"]) // 2 for a, b in zip(speech, speech[1:])]
    start, step = 0, seconds * engine.SAMPLE_RATE
    while start < len(audio):
        end = min(len(audio), start + step)
        nearby = [p for p in breaks if start + step * 0.6 <= p <= end]
        if end < len(audio) and nearby:
            end = nearby[-1]
        yield start, end
        start = end


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
            phase("loading_model", o["model"])
            model = load_model(o["model"])
            phase("transcribing")
            out, language = [], o.get("language")
            inverse = {name.lower(): code for code, name in engine.LANGUAGES.items()}
            spans = list(chunks(audio))
            previous_text = ""
            for start, end in spans:
                check()
                # Re-decode two seconds before the boundary to recover cut words.
                # Keep copies: numpy views would prevent decoded memmap cleanup.
                overlap = min(2 * engine.SAMPLE_RATE, (end - start) // 4)
                audio_start = max(0, start - overlap) if previous_text else start
                kwargs = {"audio": (np.array(audio[audio_start:end], copy=True), engine.SAMPLE_RATE),
                          "language": engine.LANGUAGES.get(o.get("language")), "context": o.get("prompt", "")}
                response = model.transcribe(**engine._supported(model.transcribe, **kwargs))[0]
                detected = inverse.get(response.language.lower())
                language = language or detected
                raw_text = response.text.strip()
                text, removed = trim_overlap(previous_text, raw_text) if audio_start < start else (raw_text, 0)
                if not text:
                    continue
                previous_text = raw_text
                # Without a reliable text match, expose the actual overlapping
                # audio boundary rather than pretending the words were aligned.
                segment_start = start if removed else audio_start
                seg = {"id": len(out), "start": round(segment_start / engine.SAMPLE_RATE, 2),
                       "end": round(end / engine.SAMPLE_RATE, 2), "text": text, "original_text": text,
                       "recognition_text": raw_text, "overlap_words_removed": removed,
                       "words": None, "confidence": None, "timing": "chunk", "edited": False}
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
