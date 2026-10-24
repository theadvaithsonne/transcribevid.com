import pytest
from pydantic import ValidationError

from app.schemas import JobOptions, RerunRequest


def test_defaults():
    o = JobOptions()
    assert o.model == "small" and o.language is None and o.task == "transcribe" and o.beam_size == 5
    assert o.output_script == "hinglish"


def test_output_script_validation_and_partial_rerun():
    assert JobOptions(output_script="original").output_script == "original"
    assert RerunRequest(output_script="original").model_dump(exclude_unset=True) == {"output_script": "original"}
    assert "output_script" not in RerunRequest(model="small").model_dump(exclude_unset=True)
    with pytest.raises(ValidationError):
        JobOptions(output_script="english")
    with pytest.raises(ValidationError):
        RerunRequest(output_script="english")


@pytest.mark.parametrize("m", ["tiny", "base", "small", "medium", "large-v3", "large-v3-turbo"])
def test_known_models(m):
    assert JobOptions(model=m).model == m


@pytest.mark.parametrize("m", ["", "nope", "SMALL", "large"])
def test_unknown_model(m):
    with pytest.raises(ValidationError):
        JobOptions(model=m)


@pytest.mark.parametrize("raw,expected", [("EN", "en"), (" fr ", "fr"), ("", None), ("   ", None), (None, None)])
def test_language_normalisation(raw, expected):
    assert JobOptions(language=raw).language == expected


def test_unsupported_language():
    with pytest.raises(ValidationError):
        JobOptions(language="xx")


def test_task():
    assert JobOptions(task="translate").task == "translate"
    with pytest.raises(ValidationError):
        JobOptions(task="summarise")


@pytest.mark.parametrize("b,ok", [(0, False), (1, True), (10, True), (11, False), (-3, False)])
def test_beam_size_bounds(b, ok):
    if ok:
        assert JobOptions(beam_size=b).beam_size == b
    else:
        with pytest.raises(ValidationError):
            JobOptions(beam_size=b)


def test_prompt_length_limit():
    JobOptions(prompt="x" * 1000)
    with pytest.raises(ValidationError):
        JobOptions(prompt="x" * 1001)


def test_rerun_request_partial():
    assert RerunRequest(model="tiny").model_dump(exclude_none=True) == {"model": "tiny"}
    with pytest.raises(ValidationError):
        RerunRequest(beam_size=0)
