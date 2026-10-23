"""Transcription engine: media file -> timestamped segments with word timing and confidence.

faster-whisper (CTranslate2) does the recognition; ffmpeg (bundled via imageio-ffmpeg, nothing to
install system-wide) decodes any audio/video container. Accuracy features:

* speech-band filtering + dynamic loudness normalisation before recognition (quiet speakers)
* Silero VAD to skip silence/music, the main source of Whisper hallucinations
* beam search + temperature fallback, hallucination guard, loop suppression
* optional vocabulary/context prompt (names, jargon) and hotwords
* word-level timestamps and per-segment confidence for review in the UI
"""
import inspect
import logging
import math
import os
import re
import shutil
import gc
import subprocess
import threading
import time
import traceback

import numpy as np

from . import config

log = logging.getLogger("vt.engine")
SAMPLE_RATE = 16000

# Order matters: shown in this order in the UI.
MODEL_CATALOG = [
    {"id": "tiny", "label": "Tiny", "size_mb": 75, "speed": 5, "accuracy": 1,
     "note": "Fastest, rough drafts only"},
    {"id": "base", "label": "Base", "size_mb": 145, "speed": 4, "accuracy": 2,
     "note": "Fast, clean audio"},
    {"id": "small", "label": "Small", "size_mb": 465, "speed": 3, "accuracy": 3,
     "note": "Good balance (default)"},
    {"id": "medium", "label": "Medium", "size_mb": 1500, "speed": 2, "accuracy": 4,
     "note": "High accuracy, slower"},
    {"id": "large-v3-turbo", "label": "Large v3 Turbo", "size_mb": 1600, "speed": 3, "accuracy": 5,
     "note": "Near-best accuracy, much faster than Large"},
    {"id": "large-v3", "label": "Large v3", "size_mb": 3100, "speed": 1, "accuracy": 5,
     "note": "Best accuracy, slowest"},
    {"id": "distil-large-v3", "label": "Distil Large v3", "size_mb": 1500, "speed": 4, "accuracy": 4,
     "note": "English only, very fast and accurate"},
]

LANGUAGES = {
    "af": "Afrikaans", "ar": "Arabic", "az": "Azerbaijani", "be": "Belarusian", "bg": "Bulgarian",
    "bn": "Bengali", "bs": "Bosnian", "ca": "Catalan", "cs": "Czech", "cy": "Welsh", "da": "Danish",
    "de": "German", "el": "Greek", "en": "English", "es": "Spanish", "et": "Estonian", "fa": "Persian",
    "fi": "Finnish", "fr": "French", "gl": "Galician", "gu": "Gujarati", "he": "Hebrew", "hi": "Hindi",
    "hr": "Croatian", "hu": "Hungarian", "hy": "Armenian", "id": "Indonesian", "is": "Icelandic",
    "it": "Italian", "ja": "Japanese", "kk": "Kazakh", "kn": "Kannada", "ko": "Korean",
    "lt": "Lithuanian", "lv": "Latvian", "mk": "Macedonian", "ml": "Malayalam", "mr": "Marathi",
    "ms": "Malay", "ne": "Nepali", "nl": "Dutch", "no": "Norwegian", "pa": "Punjabi", "pl": "Polish",
    "pt": "Portuguese", "ro": "Romanian", "ru": "Russian", "sk": "Slovak", "sl": "Slovenian",
    "sr": "Serbian", "sv": "Swedish", "sw": "Swahili", "ta": "Tamil", "te": "Telugu", "th": "Thai",
    "tl": "Tagalog", "tr": "Turkish", "uk": "Ukrainian", "ur": "Urdu", "vi": "Vietnamese",
    "zh": "Chinese",
}

DEFAULT_OPTIONS = {
    "model": "small",
    "language": None,          # None = auto-detect
    "task": "transcribe",      # or "translate" (any language -> English)
    "prompt": "",              # vocabulary / context hint: names, jargon, spelling
    "beam_size": 5,
    "vad": True,               # skip non-speech
    "enhance_audio": True,     # filter + normalise before recognition
    "word_timestamps": True,
    "condition_on_previous": False,  # False = fewer repetition loops on long files
}

_AUDIO_FILTER = "highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9"

_model_lock = threading.Lock()
_loaded = {"name": None, "model": None}


class Cancelled(Exception):
    pass


# --------------------------------------------------------------------------- environment

def ffmpeg_exe():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def device_info():
    """(device, compute_type) - uses a CUDA GPU when one is available."""
    device = config.DEVICE
    if device == "auto":
        try:
            import ctranslate2
            device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
        except Exception:  # noqa
            device = "cpu"
    compute = config.COMPUTE_TYPE
    if compute == "auto":
        compute = "float16" if device == "cuda" else "int8"
    return device, compute


def available_model_ids():
    from faster_whisper import available_models
    return set(available_models())


_downloaded_cache = {}  # name -> (checked_at, bool): the lookup touches the disk cache, and the UI polls it
_DOWNLOADED_TTL = 15.0


def model_downloaded(name):
    hit = _downloaded_cache.get(name)
    if hit and time.monotonic() - hit[0] < _DOWNLOADED_TTL:
        return hit[1]
    from faster_whisper.utils import download_model
    try:
        download_model(name, local_files_only=True, cache_dir=config.MODEL_DIR)
        ok = True
    except Exception:  # noqa
        ok = False
    _downloaded_cache[name] = (time.monotonic(), ok)
    return ok


def list_models():
    ok = available_model_ids()
    return [dict(m, downloaded=model_downloaded(m["id"])) for m in MODEL_CATALOG
            if m["id"] in ok and (not config.ALLOWED_MODELS or m["id"] in config.ALLOWED_MODELS)]


def load_model(name):
    """Load (and cache) a model. Only one model is kept in memory at a time."""
    from faster_whisper import WhisperModel
    with _model_lock:
        if _loaded["name"] != name or _loaded["model"] is None:
            if _loaded["name"]:
                log.info("unloading model %r to free memory", _loaded["name"])
            _loaded["model"], _loaded["name"] = None, None  # free memory first; a failed load must not leave a stale name
            device, compute = device_info()
            cached = model_downloaded(name)
            log.info("loading model %r (%s, %s, threads=%s, %s)", name, device, compute,
                     config.CPU_THREADS or "default", "from local cache" if cached else "DOWNLOADING - first use only")
            t0 = time.perf_counter()
            model = WhisperModel(name, device=device, compute_type=compute,
                                 cpu_threads=config.CPU_THREADS, download_root=config.MODEL_DIR)
            _loaded["model"], _loaded["name"] = model, name
            _downloaded_cache[name] = (time.monotonic(), True)  # it is on disk now
            log.info("model %r ready in %.1fs", name, time.perf_counter() - t0)
        else:
            log.debug("model %r already loaded", name)
        return _loaded["model"]


class _BackgroundLoad:
    """Loads a model in a worker thread so it overlaps with audio decoding (they use different
    resources: disk/RAM vs ffmpeg CPU). result() waits and re-raises any load error."""

    def __init__(self, name):
        self.name, self.model, self.error = name, None, None
        self.thread = threading.Thread(target=self._run, name=f"load-{name}", daemon=True)
        self.thread.start()

    def _run(self):
        try:
            _check_model_space(self.name)
            self.model = load_model(self.name)
        except BaseException as e:  # noqa - handed to the caller in result()
            self.error = e

    def result(self, cancelled=None):
        """Wait for the model. A cancel request returns control at once (the loader is a daemon thread
        and simply finishes in the background) instead of waiting out a multi-GB download."""
        while self.thread.is_alive():
            self.thread.join(0.25)
            if cancelled and cancelled():
                raise Cancelled()
        if self.error:
            log.error("could not load model %r: %s", self.name, self.error)
            raise RuntimeError(f"Could not load the '{self.name}' model: {self.error}") from self.error
        if self.model is None:
            raise RuntimeError(f"Could not load the '{self.name}' model.")
        return self.model


def warm_up(name=None):
    """Preload the default model in the background so the first job doesn't wait for it.
    Never downloads anything on its own - only a model that is already on disk is loaded."""
    name = name or DEFAULT_OPTIONS["model"]
    if config.ALLOWED_MODELS and name not in config.ALLOWED_MODELS:
        name = config.ALLOWED_MODELS[0]  # e.g. a public server that only offers some models
    try:
        if model_downloaded(name):
            log.info("warming up model %r in the background", name)
            load_model(name)
        else:
            log.info("warm-up skipped: model %r is not downloaded yet (it downloads on first use)", name)
    except Exception:  # noqa - warm-up is an optimisation only
        log.exception("warm-up failed")


def _check_model_space(name):
    info = next((m for m in MODEL_CATALOG if m["id"] == name), None)
    if not info or model_downloaded(name):
        return
    os.makedirs(config.MODEL_DIR, exist_ok=True)
    free = shutil.disk_usage(config.MODEL_DIR).free
    need = info["size_mb"] * 1.3 * 2**20
    log.info("model %r needs a download of ~%d MB (%.1f GB free on the models drive)", name,
             info["size_mb"], free / 2**30)
    if free < need:
        log.error("not enough disk space for model %r: need %.1f GB, have %.1f GB", name,
                  need / 2**30, free / 2**30)
        raise RuntimeError(f"Not enough disk space to download the '{name}' model: needs about "
                           f"{need / 2**30:.1f} GB, only {free / 2**30:.1f} GB free on the drive holding "
                           f"{config.MODEL_DIR}. Free some space or set VT_MODEL_DIR to another drive.")


# --------------------------------------------------------------------------- audio

def _ffmpeg_error(stderr: bytes):
    msg = stderr.decode("utf-8", "replace").strip()
    if "does not contain any stream" in msg or "Output file #0 does not contain" in msg:
        return "This file has no audio track."
    if "Invalid data found" in msg or "moov atom not found" in msg:
        return "The file is corrupted or not a supported media format."
    return msg.splitlines()[-1] if msg else "ffmpeg could not read this file."


_procs = set()          # running ffmpeg processes, so shutdown can kill them
_procs_lock = threading.Lock()
_undeleted = []         # temp files that were still locked when we tried to remove them


def kill_all():
    """Kill any ffmpeg still running (called when the session ends)."""
    with _procs_lock:
        procs = list(_procs)
    for p in procs:
        try:
            p.kill()
        except OSError:
            pass


def purge_undeleted():
    for f in list(_undeleted):
        try:
            os.remove(f)
        except FileNotFoundError:
            pass
        except OSError:
            continue
        _undeleted.remove(f)


def _remove_with_retries(path, tries=40):
    """Windows keeps a memory-mapped file locked until every reference is gone; give the garbage
    collector a moment instead of silently leaving hundreds of MB behind."""
    for _ in range(tries):
        try:
            os.remove(path)
            return True
        except FileNotFoundError:
            return True
        except OSError:
            gc.collect()
            time.sleep(0.05)
    log.warning("could not delete temp audio %s yet - it will be removed when the session ends", path)
    _undeleted.append(path)
    return False


def extract_audio(path, enhance=True, workdir=None, should_cancel=None):
    """Decode any media file to 16 kHz mono float32 PCM.

    ffmpeg writes straight to a file that is memory-mapped, so a 4-hour recording costs disk,
    not RAM. Returns (samples, cleanup) - call cleanup() when recognition is finished.
    `should_cancel()` is polled while ffmpeg runs: on True ffmpeg is killed and Cancelled is raised."""
    import tempfile
    if workdir:
        os.makedirs(workdir, exist_ok=True)
    fd, raw = tempfile.mkstemp(suffix=".f32", dir=workdir)
    os.close(fd)

    def cleanup():
        _remove_with_retries(raw)

    cmd = [ffmpeg_exe(), "-v", "error", "-nostdin", "-y", "-i", str(path), "-vn", "-map", "0:a:0?"]
    if enhance:
        cmd += ["-af", _AUDIO_FILTER]
    cmd += ["-ac", "1", "-ar", str(SAMPLE_RATE), "-f", "f32le", raw]
    t0 = time.perf_counter()
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    with _procs_lock:
        _procs.add(proc)
    try:
        while True:
            try:
                _, stderr = proc.communicate(timeout=0.25)  # also drains the pipe, so ffmpeg can never block on it
                break
            except subprocess.TimeoutExpired:
                if should_cancel and should_cancel():
                    proc.kill()
                    proc.communicate()
                    cleanup()
                    log.info("audio decoding cancelled")
                    raise Cancelled()
    finally:
        with _procs_lock:
            _procs.discard(proc)
    if proc.returncode != 0:
        cleanup()
        err = _ffmpeg_error(stderr)
        log.error("ffmpeg failed on %s (exit %s): %s", os.path.basename(str(path)), proc.returncode, err)
        raise RuntimeError(err)
    if os.path.getsize(raw) < 4:
        cleanup()
        log.error("ffmpeg produced no audio for %s", os.path.basename(str(path)))
        raise RuntimeError("This file has no audio track.")
    log.info("audio decoded: %.1fs of audio in %.1fs (enhance=%s)", os.path.getsize(raw) / 4 / SAMPLE_RATE,
             time.perf_counter() - t0, enhance)
    return np.memmap(raw, dtype=np.float32, mode="r"), cleanup


def make_audio_preview(src, dst):
    """Small mp3 so the browser can play formats it can't decode natively (mkv, avi, ...)."""
    cmd = [ffmpeg_exe(), "-v", "error", "-nostdin", "-y", "-i", str(src), "-vn", "-map", "0:a:0?",
           "-ac", "1", "-ar", "22050", "-b:a", "48k", str(dst)]
    ok = subprocess.run(cmd, capture_output=True).returncode == 0
    log.debug("audio preview %s -> %s", "ok" if ok else "FAILED", os.path.basename(str(dst)))
    return ok


# --------------------------------------------------------------------------- recognition

def _supported(fn, **kwargs):
    """Drop kwargs the installed faster-whisper version doesn't know about."""
    params = inspect.signature(fn).parameters
    return {k: v for k, v in kwargs.items() if k in params}


def _norm(text):
    return re.sub(r"[\W_]+", " ", text.lower()).strip()


_THOUSANDS_HEAD = re.compile(r"\d{1,3}(?:,\d{3})*")
_THOUSANDS_TAIL = re.compile(r"\d{3}")
_ZERO_TRIPLE_TEXT = re.compile(r"(?<![\d.,])(\d{1,3}(?:,\d{3})*) 000(?!\d)")


def fix_number_text(text):
    """Whisper writes "ten thousand" as "10 000" (the word "thousand" becomes the digits 000, the comma is
    lost). "000" never stands alone in speech, so "10 000" is 10,000."""
    return _ZERO_TRIPLE_TEXT.sub(lambda m: m.group(1) + ",000", text)


def merge_number_pieces(words, text):
    """Re-join number pieces of Whisper's word list so subtitles read "10,000" and consensus/analysis never
    sees a bogus word "000": (a) " 10" + " 000" (000 = "thousand", see fix_number_text), (b) " 10" + " 250"
    when the segment text itself reads "10,250"."""
    out = []
    for w in words:
        prev = out[-1] if out else None
        if prev is not None:
            a, b = prev["word"].strip(), w["word"].strip()
            if _THOUSANDS_HEAD.fullmatch(a) and _THOUSANDS_TAIL.fullmatch(b) and (b == "000" or f"{a},{b}" in text):
                prev["word"] += "," + b
                prev["end"] = w["end"]
                if prev.get("probability") is not None and w.get("probability") is not None:
                    prev["probability"] = round((prev["probability"] + w["probability"]) / 2, 3)
                continue
        out.append(dict(w))
    return out


def _segment_dict(idx, s):
    # float() everywhere: CTranslate2 hands back numpy scalars, which json can't serialise
    words = [{"start": round(float(w.start), 2), "end": round(float(w.end), 2), "word": w.word,
              "probability": round(float(w.probability), 3)} for w in (s.words or [])]
    words = merge_number_pieces(words, s.text)
    text = fix_number_text(s.text.strip())
    if words:
        conf = sum(w["probability"] for w in words) / len(words)
    else:
        conf = math.exp(max(min(float(s.avg_logprob), 0.0), -10.0))
    return {"id": idx, "start": round(float(s.start), 2), "end": round(float(s.end), 2),
            "text": text, "words": words or None, "confidence": round(conf, 3),
            "no_speech_prob": round(float(s.no_speech_prob), 3)}


def transcribe(path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
    """Run the full pipeline. Callbacks:
        on_phase(name, detail=None)   name in extracting|loading_model|transcribing
        on_segment(seg_dict, progress 0..1, info)   called as each segment is recognised
        should_cancel() -> bool
    workdir: where the decoded audio is written (default: config.TMP_DIR).
    Returns {"language","language_probability","duration","segments"}.
    """
    o = {**DEFAULT_OPTIONS, **{k: v for k, v in options.items() if v is not None or k == "language"}}
    phase = on_phase or (lambda *a, **k: None)
    cancelled = should_cancel or (lambda: False)

    t_start = time.perf_counter()
    log.info("transcribing %s: model=%s language=%s task=%s beam=%s vad=%s enhance=%s word_timestamps=%s prompt=%s",
             os.path.basename(str(path)), o["model"], o["language"] or "auto", o["task"], o["beam_size"],
             o["vad"], o["enhance_audio"], o["word_timestamps"], "yes" if (o["prompt"] or "").strip() else "no")
    loader = _BackgroundLoad(o["model"])  # runs while ffmpeg decodes the audio below
    phase("extracting")
    workdir = str(workdir or config.TMP_DIR)
    os.makedirs(workdir, exist_ok=True)
    audio, cleanup = extract_audio(path, o["enhance_audio"], workdir=workdir, should_cancel=cancelled)
    try:
        result = _recognise(audio, o, phase, on_segment, cancelled, loader)
    except BaseException as e:
        traceback.clear_frames(e.__traceback__)  # the traceback would keep the memmap alive and the file locked
        raise
    finally:
        del audio  # release the memmap before deleting the file (required on Windows)
        cleanup()
    took = time.perf_counter() - t_start
    log.info("transcription finished: %d segment(s), %.1fs of audio in %.1fs total (%.2fx realtime)",
             len(result["segments"]), result["duration"], took, result["duration"] / max(took, 1e-6))
    return result


def _recognise(audio, o, phase, on_segment, cancelled, loader):
    duration = len(audio) / SAMPLE_RATE
    if duration < 0.3:
        raise RuntimeError("The audio is too short to transcribe.")
    if config.MAX_DURATION_MIN and duration > config.MAX_DURATION_MIN * 60:
        raise RuntimeError(f"This file is {duration / 60:.0f} minutes long; the limit on this server is "
                           f"{config.MAX_DURATION_MIN} minutes.")
    if cancelled():
        raise Cancelled()

    phase("loading_model", o["model"])
    model = loader.result(cancelled)  # usually already finished: it ran while the audio was being decoded
    if cancelled():
        raise Cancelled()

    phase("transcribing")
    prompt = (o["prompt"] or "").strip() or None
    kwargs = dict(
        language=o["language"] or None,
        task=o["task"],
        beam_size=int(o["beam_size"]),
        best_of=5,
        temperature=[0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
        condition_on_previous_text=bool(o["condition_on_previous"]),
        initial_prompt=prompt,
        compression_ratio_threshold=2.4,
        log_prob_threshold=-1.0,
        no_speech_threshold=0.6,
        word_timestamps=bool(o["word_timestamps"]),
        hallucination_silence_threshold=2.0 if o["word_timestamps"] else None,
        vad_filter=bool(o["vad"]),
        vad_parameters=dict(threshold=0.45, min_silence_duration_ms=500, speech_pad_ms=400),
        language_detection_segments=4,
        language_detection_threshold=0.5,
    )
    segments, info = model.transcribe(audio, **_supported(model.transcribe, **kwargs))

    log.info("language: %s (p=%.2f), duration after VAD: %.1fs of %.1fs", info.language, info.language_probability,
             getattr(info, "duration_after_vad", duration), duration)
    out, repeats, last_norm = [], 0, None
    dropped = {"empty": 0, "no_speech": 0, "repetition": 0}
    for s in segments:
        if cancelled():
            raise Cancelled()
        text = s.text.strip()
        if not text:
            dropped["empty"] += 1
            continue
        # Whisper's standard "this is silence it made up" test
        if s.no_speech_prob > 0.6 and s.avg_logprob < -1.0:
            dropped["no_speech"] += 1
            log.debug("dropped no-speech segment at %.1fs: %r", s.start, text[:60])
            continue
        # break runaway repetition loops (a real speaker rarely says the same line 4x in a row)
        n = _norm(text)
        repeats = repeats + 1 if n == last_norm else 0
        last_norm = n
        if repeats >= 3:
            dropped["repetition"] += 1
            log.debug("dropped repeated segment at %.1fs: %r", s.start, text[:60])
            continue
        seg = _segment_dict(len(out), s)
        out.append(seg)
        log.debug("segment %d [%.1f-%.1f] conf=%.2f: %s", seg["id"], seg["start"], seg["end"],
                  seg["confidence"], text[:80])
        if on_segment:
            on_segment(seg, min(s.end / duration, 1.0), {"language": info.language,
                                                          "duration": duration})
    if any(dropped.values()):
        log.info("filtered out segments: %s", ", ".join(f"{k}={v}" for k, v in dropped.items() if v))
    return {"language": info.language, "language_probability": round(info.language_probability, 3),
            "duration": round(duration, 2), "segments": out}
