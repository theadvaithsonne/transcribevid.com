import copy
import unicodedata

import pytest

from app.hinglish import convert_segment, romanize, restyle_segment
from app import formats


@pytest.mark.parametrize("source,expected", [
    ("तो एक स्टूडेंट की लाइफ में डिसिप्लिन बहुत इंपॉर्टेंट है while you're preparing.",
     "toh ek student ki life mein discipline bahut important hai while you're preparing."),
    ("तो उस डिसिप्लिन को कैसे मेंटेन किया जाए?", "toh us discipline ko kaise maintain kiya jaaye?"),
    ("मैं यहाँ हूँ, आप कहाँ हैं?", "main yahan hoon, aap kahan hain?"),
    ("करना समझना लड़का राम अमित", "karna samajhna ladka raam amit"),
    ("फ़ाइल ज़रा", "file zara"),
    ("नंबर १२३।\nटाइम 00:04!", "number 123.\ntime 00:04!"),
    ("English  PostgreSQL, API v2.0\n你好 مرحبا", "English  PostgreSQL, API v2.0\n你好 مرحبا"),
    ("", ""),
])
def test_conversational_hindi_and_preserved_text(source, expected):
    assert romanize(source) == expected


def test_nukta_normalization():
    text = "फ़ाइल ज़रा"
    assert romanize(unicodedata.normalize("NFC", text)) == romanize(unicodedata.normalize("NFD", text))


def test_segment_keeps_recognition_evidence_timing_confidence_and_input():
    segment = {"id": 1, "start": 4.0, "end": 5.0, "confidence": 0.8,
               "text": "तो student है।", "words": [
                   {"word": " तो", "start": 4.0, "end": 4.2, "probability": 0.7},
                   {"word": " student", "start": 4.2, "end": 4.7, "probability": 0.9},
                   {"word": " है।", "start": 4.7, "end": 5.0, "probability": 0.8},
               ]}
    before = copy.deepcopy(segment)
    converted = convert_segment(segment)
    assert segment == before
    assert converted["text"] == "toh student hai."
    assert converted["original_text"] == segment["text"]
    assert "".join(w["word"] for w in converted["words"]).strip() == converted["text"]
    for original, word in zip(segment["words"], converted["words"]):
        assert (word["start"], word["end"], word["probability"]) == (original["start"], original["end"], original["probability"])
        assert word.get("original_word", word["word"]) == original["word"]
    assert converted["start"] == 4.0 and converted["end"] == 5.0 and converted["confidence"] == 0.8


def test_unchanged_english_needs_no_original_copy():
    segment = {"text": "Hello English.", "words": None}
    assert convert_segment(segment) == segment


def test_conversion_is_not_a_semantic_rewrite():
    # Do not invent 'important' from the incomplete recognition 'इंट'.
    assert "important" not in romanize("इंट")


@pytest.mark.parametrize("method", ["basic", "indicxlit"])
def test_natural_spellings_use_hindi_evidence_without_rewriting_english(method):
    source = "आ रखूँ बनाई बनाए बीच सकता लगता उसके वापस beach aaa rakhuun API"
    assert romanize(source, method) == "aa rakhun banayi banaye beech sakta lagta uske wapas beach aaa rakhuun API"
    # Distinct source words must not be merged by a broad spelling correction.
    assert romanize("भर बढ़", method="basic").split()[0] != romanize("भर बढ़", method="basic").split()[1]


def test_restyle_round_trip_keeps_original_evidence_and_edits():
    source = {"text": "तो student है।", "start": 4, "end": 6, "words": [
        {"word": " तो", "start": 4, "end": 4.2, "probability": 0.8}]}
    roman = restyle_segment(source, "hinglish", "basic")
    assert roman["text"] == "toh student hai."
    native = restyle_segment(roman, "original")
    assert native["text"] == source["text"]
    assert native["words"][0]["word"] == " तो"
    assert "conversion_warning" not in native
    edited = {**roman, "edited": True, "text": "My correction", "words": None}
    assert restyle_segment(edited, "original") == edited


def test_neural_conversion_only_changes_hindi_words_and_preserves_word_timing(monkeypatch):
    import app.hinglish as h
    calls = []
    def model(word):
        calls.append(word)
        return {"नमस्ते": "namaste", "भारत": "bharat"}[word]
    monkeypatch.setattr(h, "_neural_word", model)
    result = convert_segment({"text": "नमस्ते API, भारत!", "words": [{"word": " नमस्ते", "start": 1, "end": 2, "probability": 0.7}]}, "indicxlit")
    assert result["text"] == "namaste API, bharat!" and result["romanizer"] == "indicxlit"
    assert result["words"][0]["start"] == 1 and result["words"][0]["probability"] == 0.7
    assert calls == ["नमस्ते", "भारत"]  # one request-local conversion reused for timing words
    convert_segment({"text": "नमस्ते", "words": None}, "indicxlit")
    assert calls[-1] == "नमस्ते" and len(calls) == 3  # no cross-visitor input cache


@pytest.mark.parametrize("export_format", ["plain", "txt", "md", "srt", "vtt", "json"])
def test_exports_use_the_same_hinglish_as_the_live_segment(export_format):
    segment = convert_segment({"id": 0, "start": 4.0, "end": 6.0,
                               "text": "तो student है।", "words": None, "confidence": 0.8})
    job = {"title": "Talk", "filename": "talk.mp4", "language": "hi", "duration": 6.0,
           "options": {"model": "small", "output_script": "hinglish"}, "segments": [segment]}
    body, _, _ = formats.render(job, export_format)
    assert "toh student hai." in body
    if export_format == "json":
        assert '"original_text": "तो student है।"' in body
