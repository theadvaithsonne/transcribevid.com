"""Offline, best-effort conversational Roman Hindi; this is not translation.

Keep Latin text, punctuation, and timing intact. Common spellings make everyday
Hindi and English loanwords readable; unknown Devanagari words use phonetic
transliteration. Recognition errors and ambiguous spellings still need review.
"""
import re
import unicodedata
import importlib.util
from functools import lru_cache


class RomanizerUnavailable(RuntimeError):
    pass


@lru_cache(maxsize=1)
def _indicxlit():
    try:
        from .indicxlit import IndicXlit, prepared
        if prepared():
            return IndicXlit()
        from ai4bharat.transliteration import XlitEngine
        return XlitEngine("hi", src_script_type="indic", beam_width=4, rescore=False)
    except (ImportError, OSError) as exc:
        raise RomanizerUnavailable("IndicXlit is unavailable. Install backend/requirements-indicxlit.txt and run python -m tools.prepare_indicxlit from backend, or choose Basic romanization.") from exc


def _neural_word(word):
    candidates = _indicxlit().translit_word(word, lang_code="hi", topk=1)
    if isinstance(candidates, dict):
        candidates = candidates.get("hi", [])
    if not candidates or not isinstance(candidates[0], str) or not re.fullmatch(r"[A-Za-z'-]+", candidates[0]):
        raise RomanizerUnavailable("IndicXlit returned no valid Roman spelling. Review this word or choose Basic romanization.")
    return candidates[0]


_SPELLINGS = {
    "मैं": "main", "में": "mein", "हैं": "hain", "है": "hai", "हूँ": "hoon",
    "हूं": "hoon", "हां": "haan", "हाँ": "haan", "नहीं": "nahi", "नही": "nahi",
    "ये": "ye", "यह": "yeh", "वो": "woh", "वह": "woh", "क्या": "kya",
    "क्यों": "kyun", "क्यूं": "kyun", "क्यूँ": "kyun", "क्योंकि": "kyunki",
    "कैसे": "kaise", "कैसा": "kaisa", "ऐसे": "aise", "ऐसा": "aisa",
    "तो": "toh", "हो": "ho", "होता": "hota", "होती": "hoti", "होते": "hote",
    "हुआ": "hua", "हुई": "hui", "हुए": "hue", "था": "tha", "थी": "thi", "थे": "the",
    "कि": "ki", "की": "ki", "के": "ke", "को": "ko", "का": "ka", "से": "se",
    "और": "aur", "या": "ya", "भी": "bhi", "ही": "hi", "एक": "ek",
    "आप": "aap", "आपको": "aapko", "आपका": "aapka", "आपकी": "aapki",
    "हम": "hum", "हमें": "humein", "हमारे": "hamare", "हमारी": "hamari",
    "तुम": "tum", "तुम्हें": "tumhe", "मुझे": "mujhe", "मेरा": "mera",
    "मेरी": "meri", "मेरे": "mere", "अपने": "apne", "अपनी": "apni",
    "इस": "is", "उस": "us", "इसको": "isko", "उसको": "usko", "इसमें": "ismein",
    "वहाँ": "wahan", "यहाँ": "yahan", "जहाँ": "jahan", "कहाँ": "kahan",
    "बहुत": "bahut", "अच्छा": "achha", "अच्छी": "achhi", "अच्छे": "achhe",
    "सही": "sahi", "गलत": "galat", "बात": "baat", "भाई": "bhai",
    "लिए": "liye", "चाहिए": "chahiye", "जैसे": "jaise", "जब": "jab", "अब": "ab",
    "सब": "sab", "बस": "bas", "अगर": "agar", "फिर": "phir", "लेकिन": "lekin",
    "कुछ": "kuch", "कोई": "koi", "कभी": "kabhi", "अभी": "abhi", "साथ": "saath",
    "रहा": "raha", "रही": "rahi", "रहे": "rahe", "रख": "rakh",
    "कर": "kar", "करना": "karna", "करने": "karne", "करते": "karte", "करो": "karo",
    "किया": "kiya", "करे": "kare", "करें": "karein", "करेंगे": "karenge",
    "जाए": "jaaye", "जाये": "jaaye", "जाना": "jaana", "जाता": "jaata",
    "देख": "dekh", "देखो": "dekho", "समझ": "samajh", "पता": "pata",
    "समझना": "samajhna", "लड़का": "ladka", "ज़रा": "zara", "नंबर": "number",
    "दिन": "din", "दस": "das", "बना": "bana", "चली": "chali",
    "आ": "aa", "आता": "aata", "आती": "aati", "आते": "aate",
    "रखूं": "rakhun", "रखूँ": "rakhun", "बनाई": "banayi", "बनाए": "banaye",
    "बनाये": "banaye", "बीच": "beech", "वापस": "wapas", "पीछे": "peechhe",
    "सकता": "sakta", "सकती": "sakti", "सकते": "sakte", "लगता": "lagta",
    "उसके": "uske", "उसकी": "uski", "उसका": "uska", "जरूरी": "zaroori",
    "ज़रूरी": "zaroori", "जरुरी": "zaroori", "पूछिए": "poochhiye",
    "इंग्लिश": "English", "हिंदी": "Hindi", "हिन्दी": "Hindi", "हिंग्लिश": "Hinglish",
    "स्टूडेंट": "student", "स्टूडेन्ट": "student", "स्टुडेंट": "student", "स्तुडन्त": "student",
    "लाइफ": "life", "डिसिप्लिन": "discipline", "डिसिप्लीन": "discipline",
    "दिसिप्लिन": "discipline", "दिसिप्लेन": "discipline",
    "इंपॉर्टेंट": "important", "इम्पोर्टेन्ट": "important", "इम्पोर्टेंट": "important",
    "मेंटेन": "maintain", "मेंटिन": "maintain", "मेंटेनेंस": "maintenance",
    "सैंपल": "sample", "सैम्पल": "sample", "साम्पल": "sample",
    "स्ट्रैटेजी": "strategy", "स्ट्रेटेजी": "strategy", "स्टर्टेजी": "strategy",
    "प्रिपेयर": "prepare", "प्रिपेयरिंग": "preparing", "प्रिपरेशन": "preparation",
    "टाइम": "time", "स्पीड": "speed", "वीडियो": "video", "ऑडियो": "audio",
    "ट्रांसक्रिप्ट": "transcript", "मॉडल": "model", "सेटिंग": "setting",
    "कंप्यूटर": "computer", "मोबाइल": "mobile", "फाइल": "file", "फ़ाइल": "file",
    "डाउनलोड": "download", "अपलोड": "upload", "बटन": "button", "क्लिक": "click",
    "क्लास": "class", "टीचर": "teacher", "सर": "sir", "स्कूल": "school",
    "एग्जाम": "exam", "एग्ज़ाम": "exam", "कोचिंग": "coaching", "नॉर्मल": "normal",
}

_VOWELS = dict(zip("अआइईउऊऋॠऌॡऍऎएऐऑऒओऔ", ("a", "aa", "i", "ee", "u", "oo", "ri", "ri", "li", "li", "e", "e", "e", "ai", "o", "o", "o", "au")))
_MARKS = dict(zip("ािीुूृॄॢॣॅॆेैॉॊोौ", ("aa", "i", "ee", "u", "oo", "ri", "ri", "li", "li", "e", "e", "e", "ai", "o", "o", "o", "au")))
_CONSONANTS = dict(zip("कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळ", ("k", "kh", "g", "gh", "ng", "ch", "chh", "j", "jh", "ny", "t", "th", "d", "dh", "n", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "sh", "sh", "s", "h", "l")))
_NUKTA = {"क": "q", "ख": "kh", "ग": "g", "ज": "z", "ड": "r", "ढ": "rh", "फ": "f", "य": "y"}
_WORDS = re.compile(r"[\u0900-\u0963\u0971-\u097f]+")
_DIGITS = str.maketrans("०१२३४५६७८९।॥", "0123456789..")


def _romanize_word(match):
    word = unicodedata.normalize("NFC", match.group())
    if word in _SPELLINGS:
        return _SPELLINGS[word]
    # Decompose precomposed nukta consonants so both Unicode spellings agree.
    word = unicodedata.normalize("NFD", word)
    syllables = []  # [consonant, vowel, is_inherent_schwa]
    i = 0
    while i < len(word):
        char = word[i]
        if char in _CONSONANTS:
            sound = _CONSONANTS[char]
            if i + 1 < len(word) and word[i + 1] == "़":
                sound = _NUKTA.get(char, sound)
                i += 1
            vowel, inherent = "a", True
            if i + 1 < len(word) and word[i + 1] in _MARKS:
                vowel, inherent = _MARKS[word[i + 1]], False
                i += 1
            elif i + 1 < len(word) and word[i + 1] == "्":
                vowel, inherent = "", False
                i += 1
            syllables.append([sound, vowel, inherent])
        elif char in _VOWELS:
            syllables.append(["", _VOWELS[char], False])
        elif char in "ंँ":
            syllables.append(["n", "", False])
        elif char == "ः":
            syllables.append(["h", "", False])
        elif char not in "़्\u200c\u200d":
            # Keep unfamiliar characters rather than silently losing text.
            syllables.append([char, "", False])
        i += 1
    if len(syllables) > 1 and syllables[-1][2]:
        syllables[-1][1] = ""
    for i in range(len(syllables) - 2, 0, -1):
        if syllables[i][2] and syllables[i - 1][1] and syllables[i + 1][1]:
            syllables[i][1] = ""
    return "".join(consonant + vowel for consonant, vowel, _ in syllables)


def romanize(text: str, method="basic", cache=None) -> str:
    """Convert Hindi script without rewriting English or guessing missing words."""
    if method == "indicxlit":
        cache = {} if cache is None else cache
        def convert(match):
            word = match.group()
            if word not in cache:
                # Stabilize frequent conversational spellings; learned inference
                # covers words outside this small normalization vocabulary.
                cache[word] = _SPELLINGS.get(unicodedata.normalize("NFC", word)) or _neural_word(word)
            return cache[word]
        return _WORDS.sub(convert, text).translate(_DIGITS)
    return _WORDS.sub(_romanize_word, text).translate(_DIGITS)


def convert_segment(segment: dict, romanizer="basic") -> dict:
    """Apply the same spelling to segment and word text; retain recognition evidence."""
    result = dict(segment)
    method = romanizer
    if method == "auto":
        from .indicxlit import prepared
        try:
            available = prepared() or importlib.util.find_spec("ai4bharat.transliteration") is not None
        except ModuleNotFoundError:
            available = False
        method = "indicxlit" if available else "basic"
    cache = {}  # recognition text must never be cached across visitor sessions
    text = romanize(segment["text"], method, cache)
    if _WORDS.search(segment["text"]):
        result["romanizer"] = method
        if method == "basic":
            result["conversion_warning"] = "Basic phonetic conversion is being used. Names and unfamiliar words may have awkward spelling."
    if text != segment["text"]:
        result.update(text=text, original_text=segment["text"])
    if segment.get("words"):
        result["words"] = []
        for word in segment["words"]:
            item = dict(word)
            converted = romanize(word["word"], method, cache)
            if converted != word["word"]:
                item.update(word=converted, original_word=word["word"])
            result["words"].append(item)
    return result


def restyle_segment(segment: dict, output_script: str, romanizer="auto") -> dict:
    """Reconvert recognition evidence, retaining user edits rather than overwriting them."""
    if segment.get("edited"):
        return dict(segment)
    result = dict(segment)
    result["text"] = segment.get("original_text", segment["text"])
    result["original_text"] = result["text"]
    result.pop("romanizer", None)
    result.pop("conversion_warning", None)
    if segment.get("words"):
        result["words"] = [dict(w, word=w.get("original_word", w["word"])) for w in segment["words"]]
    return convert_segment(result, romanizer) if output_script == "hinglish" else result
