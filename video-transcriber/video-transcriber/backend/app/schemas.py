from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from . import config, engine


class JobOptions(BaseModel):
    engine: Literal["whisper", "qwen"] = "whisper"
    romanizer: Literal["auto", "indicxlit", "basic"] = "auto"
    model: str = "small"
    language: Optional[str] = None
    task: str = "transcribe"
    output_script: Literal["hinglish", "original"] = "original"
    prompt: str = Field("", max_length=1000)
    beam_size: int = Field(5, ge=1, le=10)
    vad: bool = True
    enhance_audio: bool = True
    word_timestamps: bool = True
    condition_on_previous: bool = False

    @model_validator(mode="after")
    def _backend_options(self):
        is_qwen = self.model.startswith("qwen3-asr-")
        if is_qwen != (self.engine == "qwen"):
            raise ValueError("Choose a model belonging to the selected recognition engine.")
        if is_qwen:
            from .qwen_engine import LANGUAGES
            if self.task != "transcribe":
                raise ValueError("Select Whisper for English translation.")
            if self.language and self.language not in LANGUAGES:
                raise ValueError("This language is not supported by the Qwen adapter.")
        return self

    @field_validator("model")
    @classmethod
    def _model(cls, v):
        if v not in {m["id"] for m in engine.MODEL_CATALOG}:
            raise ValueError(f"Unknown model '{v}'")
        if config.ALLOWED_MODELS and v not in config.ALLOWED_MODELS:
            raise ValueError(f"The model '{v}' is not available on this server (available: "
                             f"{', '.join(config.ALLOWED_MODELS)}).")
        return v

    @field_validator("language")
    @classmethod
    def _lang(cls, v):
        v = (v or "").strip().lower() or None
        if v and v not in engine.LANGUAGES:
            raise ValueError(f"Unsupported language '{v}'")
        return v

    @field_validator("task")
    @classmethod
    def _task(cls, v):
        if v not in ("transcribe", "translate"):
            raise ValueError("task must be 'transcribe' or 'translate'")
        return v


class RerunRequest(BaseModel):
    engine: Optional[Literal["whisper", "qwen"]] = None
    romanizer: Optional[Literal["auto", "indicxlit", "basic"]] = None
    model: Optional[str] = None
    language: Optional[str] = None
    task: Optional[str] = None
    output_script: Optional[Literal["hinglish", "original"]] = None
    prompt: Optional[str] = Field(None, max_length=1000)
    beam_size: Optional[int] = Field(None, ge=1, le=10)
    vad: Optional[bool] = None
    enhance_audio: Optional[bool] = None
    word_timestamps: Optional[bool] = None
    condition_on_previous: Optional[bool] = None


class SegmentEdit(BaseModel):
    id: int
    text: str = Field(max_length=5000)
    start: Optional[float] = None
    end: Optional[float] = None
    deleted: bool = False


class JobPatch(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    segments: Optional[list[SegmentEdit]] = None
    output_script: Optional[Literal["hinglish", "original"]] = None
    romanizer: Optional[Literal["auto", "indicxlit", "basic"]] = None
