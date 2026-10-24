"""Recognition engine boundary: shared segment/phase callback contract."""
from . import engine
from pathlib import Path


class WhisperEngine:
    def transcribe(self, *args, **kwargs):
        return engine.transcribe(*args, **kwargs)


def transcribe(path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
    options = dict(options)
    preview = options.pop("_preview_to", None)  # supplied only by JobStore, never by the public schema
    if options.get("engine", "whisper") == "qwen":
        from .qwen_engine import QwenEngine
        recognize = QwenEngine().transcribe
    else:
        import sys
        qwen = sys.modules.get("app.qwen_engine")
        if qwen is not None and qwen._model is not None:
            qwen._model = qwen._name = None
            import gc
            gc.collect()
            torch = sys.modules.get("torch")
            if torch is not None and torch.cuda.is_available():
                torch.cuda.empty_cache()
        recognize = WhisperEngine().transcribe
    result = recognize(path, options, on_phase, on_segment, should_cancel, workdir)
    if should_cancel and should_cancel():
        raise engine.Cancelled()
    if preview:
        engine.make_audio_preview(path, Path(preview))
    return result
