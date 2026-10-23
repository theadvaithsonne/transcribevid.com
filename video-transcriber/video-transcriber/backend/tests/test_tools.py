"""Tests for backend/tools: text normalisation, alignment, metrics and ROVER consensus."""
from __future__ import annotations

import difflib
import json
import random
import re
import time

import pytest

from tools import align as A
from tools import consensus as C
from tools import metrics as M
from tools import textnorm as T
from tools.textnorm import normalize, tokenize_words


# ===================================================================== textnorm

@pytest.mark.parametrize("text, expected", [
    ("Hello, World!", ["hello", "world"]),
    ("", []),
    ("   ...  ?! ", []),
    ("Don't STOP", ["don't", "stop"]),
    ("It\u2019s five o\u2019clock", ["it's", "five", "o'clock"]),
    ("he said \u201chello\u201d", ["he", "said", "hello"]),
    ("'quoted' words", ["quoted", "words"]),
    ("the dogs' bowls", ["the", "dogs", "bowls"]),
    ("rock 'n' roll", ["rock", "n", "roll"]),
    ("well-known and/or snake_case", ["well", "known", "and", "or", "snake", "case"]),
    ("em\u2014dash en\u2013dash non\u2011breaking", ["em", "dash", "en", "dash", "non", "breaking"]),
    ("end.The next,word;here", ["end", "the", "next", "word", "here"]),
    ("wait\u2026what", ["wait", "what"]),
    ("U.S.A. at 5 p.m., e.g. now", ["usa", "at", "five", "pm", "eg", "now"]),
    ("R&D and AT&T", ["r", "and", "d", "and", "at", "and", "t"]),
    ("C++ user@example.com", ["c", "plus", "plus", "user", "at", "example", "com"]),
])
def test_basic_normalisation(text, expected):
    assert normalize(text) == expected


SPOKEN = [
    # cardinals
    ("0", "zero"), ("7", "seven"), ("13", "thirteen"), ("20", "twenty"), ("99", "ninety nine"),
    ("100", "one hundred"), ("101", "one hundred one"), ("246", "two hundred forty six"),
    ("1000", "one thousand"), ("1,000", "one thousand"), ("10,000", "ten thousand"),
    ("1,234", "one thousand two hundred thirty four"),
    ("1,234,567", "one million two hundred thirty four thousand five hundred sixty seven"),
    ("12,34,567", "one million two hundred thirty four thousand five hundred sixty seven"),
    ("999999999", "nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine"),
    # decimals, identifiers
    ("3.14", "three point one four"), ("0.5", "zero point five"), ("10.05", "ten point zero five"),
    ("1,234.5", "one thousand two hundred thirty four point five"),
    ("007", "zero zero seven"), ("1234567890", "one two three four five six seven eight nine zero"),
    # percent and currency
    ("50%", "fifty percent"), ("12.5%", "twelve point five percent"), ("100 %", "one hundred percent"),
    ("$5", "five dollars"), ("$1", "one dollar"), ("$5.50", "five dollars fifty cents"),
    ("$0.99", "ninety nine cents"), ("$1,200", "one thousand two hundred dollars"),
    ("\u00a33", "three pounds"), ("\u20ac2.01", "two euros one cent"), ("5\u20ac", "five euros"),
    ("$2.5 million", "two point five million dollars"), ("$1 million", "one million dollars"),
    # ordinals
    ("1st", "first"), ("2nd", "second"), ("3rd", "third"), ("4th", "fourth"), ("11th", "eleventh"),
    ("12th", "twelfth"), ("17th", "seventeenth"), ("20th", "twentieth"), ("21st", "twenty first"),
    ("100th", "one hundredth"), ("101st", "one hundred first"),
    # years 1900-2099
    ("1999", "nineteen ninety nine"), ("2024", "twenty twenty four"), ("2005", "two thousand five"),
    ("2000", "two thousand"), ("1905", "nineteen oh five"), ("1900", "one thousand nine hundred"),
    ("2010", "twenty ten"), ("2099", "twenty ninety nine"),
    # not years
    ("1899", "one thousand eight hundred ninety nine"), ("2100", "two thousand one hundred"),
    ("1,999", "one thousand nine hundred ninety nine"),
    # decades
    ("1990s", "nineteen nineties"), ("1990's", "nineteen nineties"), ("80s", "eighties"),
    ("'80s", "eighties"), ("2000s", "two thousands"), ("1900s", "nineteen hundreds"), ("20s", "twenties"),
    ("mid-90s", "mid nineties"),
]


@pytest.mark.parametrize("digits, words", SPOKEN)
def test_digits_become_spoken_words(digits, words):
    assert normalize(digits) == words.split()
    assert normalize(digits) == normalize(words)  # what a recogniser that writes words produces


def test_246_variants_and_documented_non_conversions():
    a = normalize("246")
    assert a == ["two", "hundred", "forty", "six"]
    assert normalize("two hundred forty six") == a
    assert normalize("two hundred and forty six") == a
    assert normalize("Two Hundred And Forty-Six") == a
    # "two forty six" is a digit-pair reading: not deterministic, so deliberately NOT converted
    assert normalize("two forty six") == ["two", "forty", "six"] != a


def test_and_is_only_dropped_inside_numbers():
    assert normalize("five dollars and fifty cents") == normalize("$5.50")
    assert normalize("a hundred and one dogs") == ["one", "hundred", "one", "dogs"]  # "a hundred" == "100"
    assert normalize("salt and pepper") == ["salt", "and", "pepper"]
    assert normalize("one and a half") == ["one", "and", "a", "half"]
    assert normalize("hundred and") == ["hundred", "and"]


@pytest.mark.parametrize("text", ["BAT246", "bat246", "Bat-246", "BAT 246", "bat246,", "(BAT246)", "BAT_246!"])
def test_brand_token_is_stable(text):
    assert normalize(text) == ["bat", "two", "hundred", "forty", "six"]


def test_letter_digit_boundaries_split_and_a_number_reads_the_same_glued_or_spaced():
    # two recognisers that only differ in the space ("BAT 2024" / "BAT2024") must not disagree
    assert normalize("BAT2024") == normalize("BAT 2024") == ["bat", "twenty", "twenty", "four"]
    assert normalize("2024BAT") == normalize("2024 BAT") == ["twenty", "twenty", "four", "bat"]
    assert normalize("Windows2000") == normalize("Windows 2000") == ["windows", "two", "thousand"]
    assert normalize("Office2019") == normalize("Office 2019") == ["office", "twenty", "nineteen"]
    assert normalize("A1999") == normalize("A 1999") == ["a", "nineteen", "ninety", "nine"]
    assert normalize("BAT2100") == normalize("BAT 2100") == ["bat", "two", "thousand", "one", "hundred"]  # not a year
    assert normalize("H2O") == ["h", "two", "o"]
    assert normalize("mp3 24x7") == ["mp", "three", "twenty", "four", "x", "seven"]
    assert normalize("in 2024.") == ["in", "twenty", "twenty", "four"]  # standalone -> a year


def test_fillers():
    assert normalize("Um, well, uh... I think, hmm, yes. Mhm! ah er erm uhm mm") == ["well", "i", "think", "yes"]
    assert normalize("um uh") == []
    assert normalize("Um, well", drop_fillers=False) == ["um", "well"]
    assert normalize("so-um-yeah") == ["so", "yeah"]
    assert normalize("yum umbrella") == ["yum", "umbrella"]  # only whole tokens are fillers
    assert normalize("hmm okay", fillers={"okay"}) == ["hmm"]  # custom filler set


def test_spelling_variants():
    for t in ("ok", "OK", "okay", "Okay,", "O.K."):
        assert normalize(t) == ["okay"], t
    assert normalize("all right") == normalize("alright") == ["alright"]
    assert normalize("per cent") == normalize("percent") == ["percent"]
    assert normalize("e-mail") == normalize("email") == ["email"]
    assert normalize("gonna wanna") == ["going", "to", "want", "to"]
    assert normalize("colour", variants={("colour",): ("color",)}) == ["color"]
    assert normalize("ok", variants={}) == ["ok"]


def test_unicode_handling():
    assert normalize("\uff21\uff22\uff23\uff11\uff12\uff13") == ["abc", "one", "hundred", "twenty", "three"]
    assert normalize("\ufb01nal \ufb02ow") == ["final", "flow"]
    assert normalize("caf\u00e9") == normalize("cafe\u0301") == ["caf\u00e9"]
    assert normalize("hel\u200blo co\u00adoperate") == ["hello", "cooperate"]
    assert normalize("a\u00a0b") == ["a", "b"]
    assert normalize("hello \U0001F600 world \u266a") == ["hello", "world"]
    hindi = "\u0928\u092e\u0938\u094d\u0924\u0947 \u0926\u0941\u0928\u093f\u092f\u093e"  # combining marks must survive
    assert normalize(hindi) == hindi.split()
    assert normalize("\u0967\u0968\u0969") == ["one", "hundred", "twenty", "three"]
    assert normalize(None) == []


def test_tokenize_words_surfaces():
    pairs = tokenize_words("Hello, World! BAT246 is OK")
    assert pairs == [("Hello,", "hello"), ("World!", "world"), ("BAT246", "bat"), ("", "two"), ("", "hundred"),
                     ("", "forty"), ("", "six"), ("is", "is"), ("OK", "okay")]
    text = "Um, so BAT246 is all right, I think!"
    assert [n for _, n in tokenize_words(text)] == normalize(text)
    full = tokenize_words(text, keep_empty=True)
    assert " ".join(s for s, _ in full if s) == text  # lossless with keep_empty
    assert ("Um,", "") in full and ("right,", "") in full  # chunks that vanished into a neighbour / filler
    assert tokenize_words("") == [] and tokenize_words("   ") == []
    assert [n for _, n in tokenize_words("Um, so", drop_fillers=False)] == ["um", "so"]


def test_tokenize_chunks_stays_aligned_with_input():
    chunks = [" Hello,", " um,", " BAT246", " $5", " million", " all", " right."]
    out = T.tokenize_chunks([c.strip() for c in chunks])
    assert [len(o) for o in out] == [1, 0, 5, 1, 2, 1, 0]
    assert out[3] == ["five"] and out[4] == ["million", "dollars"]  # "$5 million" -> five million dollars


def _clean(spoken: str) -> list[str]:
    return [t for t in re.split(r"[\s,\-]+", spoken) if t and t != "and"]


def test_number_words_agree_with_num2words():
    num2words = pytest.importorskip("num2words").num2words
    rnd = random.Random(0)
    numbers = list(range(0, 1300)) + [rnd.randrange(0, 1_000_000_000) for _ in range(500)]
    numbers += [10**k for k in range(0, 9)] + [10**k + 1 for k in range(1, 9)] + [999_999_999, 1_000_000_000 - 1000]
    for n in numbers:
        assert T.cardinal_words(n) == _clean(num2words(n)), n
        assert T.ordinal_words(n) == _clean(num2words(n, to="ordinal")), n
    for y in range(1900, 2100):
        assert T.year_words(y) == _clean(num2words(y, to="year")), y
    with pytest.raises(ValueError):
        T.cardinal_words(10**9)


def test_stray_marks_variation_selectors_and_emoji_are_separators_not_tokens():
    # review finding: U+FE0F (emoji variation selector), keycap U+20E3 and stray accents were scanned as "letters"
    # and came out as phantom one-character tokens, i.e. a spurious word error against a system without the emoji
    assert normalize("I \u2764\ufe0f you") == ["i", "you"]
    assert normalize("press 1\ufe0f\u20e3 now") == ["press", "one", "now"]
    assert normalize("\u2764\ufe0e ok") == ["okay"]
    assert normalize("hello \u0301 world") == ["hello", "world"]                 # a lone combining accent
    assert normalize("\u093e abc") == ["abc"]                                     # a lone Devanagari vowel sign
    assert normalize("\u0301abc \u093c\u0947xyz") == ["abc", "xyz"]              # marks in front of a word
    assert normalize("\U0001f468\u200d\U0001f469\u200d\U0001f467 hi") == ["hi"]   # ZWJ emoji family
    assert normalize("\U0001f44d\U0001f3fd ok \U0001f1ee\U0001f1f3") == ["okay"]
    # marks that follow a letter stay with it, in every script
    namaste = "\u0928\u092e\u0938\u094d\u0924\u0947"
    assert normalize(f"cafe\u0301 {namaste}\ufe0f {namaste}") == ["caf\u00e9", namaste, namaste]
    assert normalize("5\u0301 x") == ["five", "x"]


def test_normalize_is_idempotent_deterministic_and_never_raises_on_hostile_unicode():
    # review finding: lower() of U+0130 leaves marks out of canonical order, and a removed ZWNJ lets marks compose
    # only on the second pass, so normalising the normaliser's own output used to change it
    tricky = ["\u0130\u094d", "W\u200c\u0301", "lx\u200d\u03a3", "\u0130\u093c21\u00fch", "\ud83d", "ab\ud83dcd",
              "\x00\x1f\x85\u2028", "\u00ad\u200b\ufeff", "\uff11\uff12\u0661\u0662\u06f3", "\u2460\u00b2\u00bd",
              "a" + "\u0301" * 50, "\u03a3\u0391\u03a3.", "\u1e9e\u00df", "\ufb03", "\u2160\u2167"]
    rnd = random.Random(2024)
    alphabet = (list("abcAB19 ,.'-$%&_") + list("\u0130\u03a3\u03c2\u0301\u0308\u093c\u094d\u0928\u0938\u200c\u200d"
                                                  "\ufe0f\u20e3\u00ad\u0661\ufb01\U0001f600\u2019\u00b4`"))
    cases = tricky + ["".join(rnd.choice(alphabet) for _ in range(rnd.randrange(0, 14))) for _ in range(4000)]
    for s in cases:
        once = normalize(s)
        assert normalize(" ".join(once)) == once, ascii(s)       # idempotent
        assert normalize(s) == once, ascii(s)                    # deterministic
        assert [n for _, n in tokenize_words(s)] == once, ascii(s)
        for t in once:
            assert t and not any(ch.isspace() or "0" <= ch <= "9" for ch in t), ascii(s)
            assert any(ch.isalpha() for ch in t), ascii(s)       # never a token made of marks/symbols only


def test_comma_grouped_numbers_beyond_a_billion_are_quantities_not_phone_numbers():
    # review finding: "1,000,000,000" was read digit by digit ("one zero zero ...") while "one billion" is a word
    assert normalize("1,000,000,000") == ["one", "billion"]
    assert normalize("7,900,000,000") == "seven billion nine hundred million".split()
    assert normalize("$1,000,000,000") == ["one", "billion", "dollars"]
    assert normalize("1,500,000,000,000") == "one trillion five hundred billion".split()
    assert normalize("1,234,567,890.5")[-2:] == ["point", "five"]
    assert normalize("1000000000") == ["one"] + ["zero"] * 9          # no separators: an identifier / phone number
    assert len(normalize("1,000,000,000,000,000")) == 16                # beyond 999 trillion: digit by digit
    num2words = pytest.importorskip("num2words").num2words
    rnd = random.Random(3)
    for _ in range(300):
        n = rnd.randrange(10**9, 10**15)
        assert normalize(f"{n:,}") == _clean(num2words(n)), n


def test_a_hundred_is_one_hundred():
    # "100" is read "one hundred", so a recogniser that writes the spoken form "a hundred" must agree with it
    for spoken, digits in [("a hundred", "100"), ("a thousand", "1,000"), ("a million", "1,000,000"),
                           ("a billion", "1,000,000,000")]:
        assert normalize(spoken) == normalize(digits) == normalize("one " + spoken.split()[1]), spoken
    assert normalize("a hundred and ten percent") == normalize("110%") == normalize("one hundred and ten percent")
    assert normalize("a dog and a hundred cats") == ["a", "dog", "and", "one", "hundred", "cats"]


def test_tokenize_chunks_ex_reports_chunks_swallowed_by_a_multi_word_variant():
    toks, absorbed = T.tokenize_chunks_ex(["so", "all", "right", "now"])
    assert toks == [["so"], ["alright"], [], ["now"]] and absorbed == [None, None, 1, None]
    toks, absorbed = T.tokenize_chunks_ex(["um", "a", "hundred"])
    assert toks == [[], ["one", "hundred"], []] and absorbed == [None, None, 1]   # a filler is not "absorbed"
    assert T.tokenize_chunks_ex([]) == ([], [])
    assert T.tokenize_chunks(["all", "right"]) == [["alright"], []]              # the plain API is unchanged


# renderings of the SAME speech that two recognisers may produce: every member of a class must normalise alike
EQUIVALENT = [
    ["246", "two hundred forty six", "two hundred and forty six", "Two Hundred Forty-Six"],
    ["$5", "5 dollars", "five dollars", "$5.00"],
    ["$5.50", "five dollars and fifty cents", "five dollars fifty cents"],
    ["50%", "50 percent", "fifty percent", "fifty per cent", "50 %"],
    ["17th", "seventeenth", "17TH"],
    ["3.5", "three point five"],
    ["OK", "okay", "O.K.", "Okay", "ok"],
    ["email", "e-mail", "E-mail", "e mail"],
    ["gonna", "going to"],
    ["all right", "alright", "All right"],
    ["1,250", "1250", "one thousand two hundred fifty", "one thousand, two hundred and fifty"],
    ["1,000,000", "1000000", "one million", "1 million", "a million"],
    ["2024", "twenty twenty four", "twenty twenty-four"],
    ["1999", "nineteen ninety nine", "nineteen ninety-nine"],
    ["10:30", "ten thirty"],
    ["5 p.m.", "5 pm", "5 PM", "five pm", "5 P.M."],
    ["BAT246", "BAT 246", "bat-246", "bat two hundred forty six", "Bat246", "BAT_246"],
    ["BAT2024", "BAT 2024", "bat twenty twenty four"],
    ["R&D", "R & D", "r and d", "R and D"],
    ["well-known", "well known", "Well-Known"],
    ["don't", "don\u2019t", "DON'T", "Don`t"],
    ["1990s", "nineteen nineties", "1990's"],
    ["21st", "twenty first", "twenty-first"],
    ["\u20b9500", "500 rupees", "five hundred rupees"],
    ["hello,", "Hello", "HELLO!", "\u201chello\u201d", "(hello)"],
    ["um hello", "hello", "Uh, hello", "hello, hmm"],
    ["a hundred", "100", "one hundred"],
    ["\u0928\u092e\u0938\u094d\u0924\u0947", "\u0928\u092e\u0938\u094d\u0924\u0947\u0964", "\u0928\u092e\u0938\u094d\u0924\u0947,"],
]


@pytest.mark.parametrize("renderings", EQUIVALENT, ids=[r[0] for r in EQUIVALENT])
def test_equivalent_renderings_normalise_identically(renderings):
    for frame in ["{} was there", "the code is {} today", "I said {}.", "{}"]:
        outs = {r: tuple(normalize(frame.format(r))) for r in renderings}
        assert len(set(outs.values())) == 1, (frame, outs)


@pytest.mark.parametrize("a, b", [
    ("5", "50"), ("1,250", "1,205"), ("3.5", "3.05"), ("17th", "18th"), ("2024", "2025"), ("$5", "$6"),
    ("$5", "\u20ac5"), ("BAT246", "BAT247"), ("okay", "oak"), ("50%", "15%"), ("5 percent", "5 dollars"),
    ("2000", "2001"), ("1st", "2nd"), ("two hundred", "two thousand"), ("one point five", "one point six"),
    ("\u0928\u092e\u0938\u094d\u0924\u0947", "\u0928\u092e\u0938\u094d\u0915\u093e\u0930"), ("007", "7"),
    ("100", "10"), ("$1.50", "$1.05"), ("a", "the"), ("1990s", "1980s"), ("12:30", "12:31"),
    ("1,000,000,000", "1,000,000"), ("BAT2024", "BAT2025"),
])
def test_different_things_stay_different(a, b):
    assert normalize(a) != normalize(b)


# ===================================================================== align

def _check_ops(ref, hyp, ops):
    """Structural validity shared with difflib.get_opcodes(): the ops tile both sequences."""
    i = j = 0
    for tag, i1, i2, j1, j2 in ops:
        assert (i1, j1) == (i, j)
        if tag == "equal":
            assert i2 - i1 == j2 - j1 > 0 and ref[i1:i2] == hyp[j1:j2]
        elif tag == "replace":
            assert i2 > i1 and j2 > j1
        elif tag == "delete":
            assert i2 > i1 and j1 == j2
        elif tag == "insert":
            assert i1 == i2 and j2 > j1
        else:
            pytest.fail(f"unknown tag {tag!r}")
        i, j = i2, j2
    assert (i, j) == (len(ref), len(hyp))


def _apply(ref, hyp, ops):
    out = []
    for tag, i1, i2, j1, j2 in ops:
        out += ref[i1:i2] if tag == "equal" else hyp[j1:j2]
    return out


def _rand_pair(rnd, vocab, max_len):
    ref = [str(rnd.randrange(vocab)) for _ in range(rnd.randrange(0, max_len))]
    hyp = [str(rnd.randrange(vocab)) for _ in range(rnd.randrange(0, max_len))]
    return ref, hyp


def test_align_matches_difflib_semantics_on_random_inputs():
    rnd = random.Random(42)
    for _ in range(600):
        ref, hyp = _rand_pair(rnd, rnd.choice([2, 3, 6, 30]), 30)
        ops = A.align(ref, hyp)
        dl = difflib.SequenceMatcher(None, ref, hyp, autojunk=False).get_opcodes()
        _check_ops(ref, hyp, ops)
        _check_ops(ref, hyp, dl)
        assert _apply(ref, hyp, ops) == hyp
        # a Levenshtein alignment is optimal, so it is never costlier than difflib's
        assert sum(A.count_ops(ops)) <= sum(A.count_ops(dl))
        merged = A.align(ref, hyp, merge=True)
        _check_ops(ref, hyp, merged)  # difflib-style blocks: no two non-equal blocks are adjacent
        assert all(not (x[0] != "equal" and y[0] != "equal") for x, y in zip(merged, merged[1:]))
        assert sum(A.count_ops(merged)) == sum(A.count_ops(ops))


@pytest.mark.parametrize("ref, hyp", [
    ("a b c d e f", "a b X d e f"),    # one substitution
    ("a b c d e f", "a b d e f"),      # one deletion
    ("a b c d e f", "a b c X d e f"),  # one insertion
    ("a b c d e", "a X Y e"),          # 3 words become 2
    ("a b c", "a b c"), ("a b c", "x y z"), ("", "a b"), ("a b", ""), ("", ""),
])
def test_align_equals_difflib_when_the_optimum_is_unambiguous(ref, hyp):
    r, h = ref.split(), hyp.split()
    assert A.align(r, h, merge=True) == difflib.SequenceMatcher(None, r, h, autojunk=False).get_opcodes()


def test_align_empty_and_identical_inputs():
    assert A.align([], []) == []
    assert A.align([], ["a", "b"]) == [("insert", 0, 0, 0, 2)]
    assert A.align(["a", "b"], []) == [("delete", 0, 2, 0, 0)]
    assert A.align(["a", "b", "c"], ["a", "b", "c"]) == [("equal", 0, 3, 0, 3)]
    assert A.align(["a", "b", "c"], ["a", "x", "c"]) == [("equal", 0, 1, 0, 1), ("replace", 1, 2, 1, 2),
                                                          ("equal", 2, 3, 2, 3)]
    assert A.distance([], []) == 0 and A.distance(["a"], []) == 1 and A.distance(["a", "b"], ["b", "a"]) == 2


def test_python_fallback_agrees_with_rapidfuzz():
    if not A.have_rapidfuzz():
        pytest.skip("rapidfuzz not installed")
    rnd = random.Random(5)
    for _ in range(300):
        ref, hyp = _rand_pair(rnd, 4, 30)
        py = A.align(ref, hyp, backend="python")
        rf = A.align(ref, hyp, backend="rapidfuzz")
        _check_ops(ref, hyp, py)
        _check_ops(ref, hyp, rf)
        d = A.distance(ref, hyp, backend="rapidfuzz")
        assert sum(A.count_ops(py)) == sum(A.count_ops(rf)) == d == A.distance(ref, hyp, backend="python")


def test_python_fallback_handles_oversized_input_with_difflib(monkeypatch):
    monkeypatch.setattr(A, "MAX_DP_CELLS", 50)
    ref = [str(i % 7) for i in range(60)]
    hyp = [str((i * 3) % 7) for i in range(55)]
    with pytest.warns(RuntimeWarning):
        ops = A.align(ref, hyp, backend="python")
    _check_ops(ref, hyp, ops)
    assert all(t != "replace" or i2 - i1 == j2 - j1 for t, i1, i2, j1, j2 in ops)  # still unmerged semantics


def test_backend_selection_errors():
    with pytest.raises(ValueError):
        A.align(["a"], ["b"], backend="nope")
    assert A.align(["a"], ["b"], backend="python") == [("replace", 0, 1, 0, 1)]


def test_align_20k_words_under_two_seconds():
    if not A.have_rapidfuzz():
        pytest.skip("rapidfuzz not installed")
    rnd = random.Random(1)
    vocab = [f"w{i}" for i in range(400)]
    ref = [rnd.choice(vocab) for _ in range(20000)]
    hyp = list(ref)
    for _ in range(2000):  # ~10% edits: substitutions, deletions and insertions
        k = rnd.randrange(len(hyp))
        r = rnd.random()
        if r < 1 / 3:
            hyp[k] = rnd.choice(vocab)
        elif r < 2 / 3:
            del hyp[k]
        else:
            hyp.insert(k, rnd.choice(vocab))
    t0 = time.perf_counter()
    ops = A.align(ref, hyp)
    elapsed = time.perf_counter() - t0
    _check_ops(ref, hyp, ops)
    assert sum(A.count_ops(ops)) <= 2000  # 2000 edits were applied, so the optimum cannot be worse
    assert elapsed < 2.0, f"aligning 20k words took {elapsed:.2f}s"


def test_count_ops_and_merge_ops():
    ops = [("equal", 0, 1, 0, 1), ("replace", 1, 3, 1, 3), ("insert", 3, 3, 3, 4), ("equal", 3, 4, 4, 5),
           ("delete", 4, 5, 5, 5)]
    assert A.count_ops(ops) == (2, 1, 1)  # (substitutions, insertions, deletions)
    merged = A.merge_ops(ops)
    assert merged == [("equal", 0, 1, 0, 1), ("replace", 1, 3, 1, 4), ("equal", 3, 4, 4, 5), ("delete", 4, 5, 5, 5)]
    assert A.count_ops(merged) == (2, 1, 1)


# ===================================================================== metrics

def _toks(s: str) -> list[str]:
    return s.split()


@pytest.mark.parametrize("ref, hyp, sub, ins, dele", [
    ("the cat sat on the mat", "the cat sat on the mat", 0, 0, 0),
    ("the cat sat on the mat", "the cat sit on the mat", 1, 0, 0),
    ("the cat sat on the mat", "the cat sit on mat", 1, 0, 1),
    ("the cat sat on the mat", "the cat sat on the mat today", 0, 1, 0),
    ("a b c d", "", 0, 0, 4),
    ("a b c d", "w x y z", 4, 0, 0),
    ("a", "a b c d", 0, 3, 0),
    ("hello world", "goodbye", 1, 0, 1),
])
def test_wer_known_values(ref, hyp, sub, ins, dele):
    r = M.wer(_toks(ref), _toks(hyp))
    assert (r["sub"], r["ins"], r["del"]) == (sub, ins, dele)
    assert r["n_ref"] == len(ref.split()) and r["n_hyp"] == len(hyp.split())
    assert r["wer"] == pytest.approx((sub + ins + dele) / len(ref.split()))
    assert r["accuracy"] == pytest.approx(max(0.0, 1 - r["wer"]))


def test_wer_hand_computed_percentages():
    assert M.wer(_toks("the cat sat on the mat"), _toks("the cat sit on mat"))["wer"] == pytest.approx(2 / 6)
    assert M.wer(_toks("a b c d"), _toks("a b c d e f"))["wer"] == pytest.approx(0.5)
    assert M.wer(_toks("a"), _toks("a b c d"))["wer"] == pytest.approx(3.0)  # can exceed 1
    assert M.wer(_toks("a"), _toks("a b c d"))["accuracy"] == 0.0           # accuracy is clipped at 0


def test_wer_identical_is_zero_and_empty_edge_cases():
    rnd = random.Random(8)
    for _ in range(50):
        ref = [str(rnd.randrange(9)) for _ in range(rnd.randrange(1, 40))]
        r = M.wer(ref, list(ref))
        assert r["wer"] == 0.0 and r["accuracy"] == 1.0 and r["errors"] == 0
    both = M.wer([], [])
    assert both["wer"] == 0.0 and both["accuracy"] == 1.0 and both["n_ref"] == both["n_hyp"] == 0
    extra = M.wer([], ["a", "b"])
    assert extra["wer"] == 2.0 and extra["ins"] == 2 and extra["accuracy"] == 0.0  # finite, no ZeroDivisionError
    assert M.wer(["a"], [])["wer"] == 1.0 and M.wer(["a"], [])["del"] == 1
    assert M.wer_text("", "")["wer"] == 0.0


def test_wer_components_sum_to_edit_distance():
    rnd = random.Random(11)
    for _ in range(200):
        ref, hyp = _rand_pair(rnd, 5, 40)
        r = M.wer(ref, hyp)
        assert r["sub"] + r["ins"] + r["del"] == r["errors"] == A.distance(ref, hyp, backend="python")
        assert r["wer"] == pytest.approx(r["errors"] / max(len(ref), 1))
        assert r["n_ref"] - r["del"] - r["sub"] == r["n_hyp"] - r["ins"] - r["sub"]  # matched words


def test_wer_text_normalises_before_comparing():
    ref = "Hello, World! It's BAT246 at 5 p.m. -- OK?"
    hyp = "hello world it's bat two hundred and forty six at five pm okay"
    assert M.wer_text(ref, hyp)["wer"] == 0.0
    assert M.wer_text("um hello there", "hello there")["wer"] == 0.0
    r = M.wer_text("um hello there", "hello there", drop_fillers=False)  # kwargs reach normalize()
    assert r["del"] == 1 and r["wer"] == pytest.approx(1 / 3)
    r = M.wer_text("it's 246", "its two hundred forty six")
    assert r["sub"] == 1 and r["n_ref"] == 5


def test_char_error_rate():
    assert M.char_error_rate("kitten", "sitting") == pytest.approx(3 / 6)  # classic Levenshtein example
    assert M.char_error_rate("abc", "abc") == 0.0
    assert M.char_error_rate("", "") == 0.0
    assert M.char_error_rate("abc", "") == 1.0
    assert M.char_error_rate("", "abc") == 3.0
    assert M.char_error_rate(["the", "cat"], "the cat") == 0.0
    assert M.char_error_rate(["the", "cat"], ["the", "cut"]) == pytest.approx(1 / 7)


def test_pairwise_matrix_symmetry_and_values():
    systems = {"a": _toks("the cat sat on the mat"), "b": _toks("the cat sit on mat"),
               "c": _toks("the cat sat on a mat")}
    m = M.pairwise_matrix(systems)
    assert m["systems"] == ["a", "b", "c"]
    for x in systems:
        assert m["wer"][x][x] == 0.0 and m["agreement"][x][x] == 1.0
        for y in systems:
            assert m["agreement"][x][y] == m["agreement"][y][x]  # symmetric
            assert 0.0 <= m["agreement"][x][y] <= 1.0
            # same edit distance in both directions, only the denominators differ
            assert m["wer"][x][y] * len(systems[x]) == pytest.approx(m["wer"][y][x] * len(systems[y]))
            if x != y:
                assert m["wer"][x][y] == pytest.approx(M.wer(systems[x], systems[y])["wer"])
    assert m["a"]["b"] == m["wer"]["a"]["b"] and m["c"]["a"] == m["wer"]["c"]["a"]  # shortcut: m[ref][hyp]
    assert set(m) == {"systems", "wer", "agreement"}
    with pytest.raises(KeyError):
        m["nope"]
    assert json.loads(json.dumps(m))["agreement"]["a"]["b"] == m["agreement"]["a"]["b"]  # plain-dict serialisable
    assert m["wer"]["a"]["b"] == pytest.approx(2 / 6)  # row = reference, column = hypothesis
    assert m["wer"]["b"]["a"] == pytest.approx(2 / 5)
    assert m["agreement"]["a"]["b"] == pytest.approx(1 - (2 / 6 + 2 / 5) / 2)
    ranking = M.rank_by_agreement(m)
    assert [name for name, _ in ranking] == ["a", "c", "b"]  # b is the odd one out
    assert M.mean_agreement(m)["b"] == pytest.approx((m["agreement"]["b"]["a"] + m["agreement"]["b"]["c"]) / 2)


def test_pairwise_matrix_handles_empty_systems():
    m = M.pairwise_matrix({"x": [], "y": ["a", "b"], "z": []})
    assert m["agreement"]["x"]["z"] == 1.0 and m["wer"]["x"]["z"] == 0.0
    assert m["agreement"]["x"]["y"] == 0.0  # clipped, not negative
    assert all(v == v and abs(v) != float("inf") for row in m["wer"].values() for v in row.values())


def test_diff_report():
    ref = "one two three four five six seven eight nine ten".split()
    assert M.diff_report(ref, ref) == []
    hyp = ref.copy()
    hyp[3] = "FOUR"
    assert M.diff_report(ref, hyp, context=2) == [
        "REPLACE ref[3:4] hyp[3:4] | ... two three [four] five six ... => ... two three [FOUR] five six ..."]
    short = M.diff_report(ref, hyp, context=0)
    assert len(short) == 1 and "[four]" in short[0] and "[FOUR]" in short[0] and "three" not in short[0]
    # deletion, insertion and several blocks
    letters = list("abcdefg")
    (line,) = M.diff_report(letters, list("abcefg"), context=2)
    assert line.startswith("DELETE") and "[d]" in line and "=> ... b c [] e f ..." in line
    (line,) = M.diff_report(list("abcefg"), letters, context=1)
    assert line.startswith("INSERT") and "[]" in line.split("=>")[0] and "[d]" in line.split("=>")[1]
    many = M.diff_report(ref, ["x", "two", "three", "four", "five", "six", "seven", "eight", "nine"], context=1)
    assert len(many) == 2 and many[0].startswith("REPLACE") and many[1].startswith("DELETE")
    # one line per non-equal block of the merged alignment
    rnd = random.Random(13)
    for _ in range(30):
        r, h = _rand_pair(rnd, 6, 25)
        assert len(M.diff_report(r, h)) == sum(1 for op in A.align(r, h, merge=True) if op[0] != "equal")


def _segment_data(rnd, n, p=0.1):
    lens = [rnd.randint(8, 30) for _ in range(n)]
    errs = [sum(rnd.random() < p for _ in range(length)) for length in lens]
    return errs, lens


def test_bootstrap_ci_contains_point_estimate_and_is_deterministic():
    errs, lens = _segment_data(random.Random(1), 400)
    ci = M.bootstrap_ci(errs, lens, seed=3)
    assert ci["low"] <= ci["wer"] <= ci["high"]
    assert ci["wer"] == pytest.approx(sum(errs) / sum(lens))
    assert ci["n_segments"] == 400 and ci["level"] == 0.95
    assert ci == M.bootstrap_ci(errs, lens, seed=3)
    assert M.bootstrap_ci(errs, lens, seed=4)["low"] != ci["low"]
    wide = M.bootstrap_ci(errs, lens, level=0.99, seed=3)
    narrow = M.bootstrap_ci(errs, lens, level=0.90, seed=3)
    assert wide["high"] - wide["low"] > narrow["high"] - narrow["low"]


def test_bootstrap_ci_narrows_with_more_data():
    errs, lens = _segment_data(random.Random(2), 4000)
    widths = []
    for n in (50, 400, 4000):
        ci = M.bootstrap_ci(errs[:n], lens[:n], seed=0)
        assert ci["low"] <= ci["wer"] <= ci["high"]
        widths.append(ci["high"] - ci["low"])
    assert widths[0] > widths[1] > widths[2]
    assert widths[2] < widths[0] / 4  # ~1/sqrt(n): 80x the data is ~9x narrower


def test_bootstrap_ci_edge_cases():
    assert M.bootstrap_ci([], []) == {"wer": 0.0, "low": 0.0, "high": 0.0, "level": 0.95, "n_segments": 0,
                                      "n_boot": 2000}
    ci = M.bootstrap_ci([0, 0, 0], [10, 10, 10])
    assert ci["wer"] == ci["low"] == ci["high"] == 0.0
    ci = M.bootstrap_ci([5], [10])
    assert ci["wer"] == ci["low"] == ci["high"] == 0.5  # a single segment cannot vary
    with pytest.raises(ValueError):
        M.bootstrap_ci([1, 2], [10])


def test_window_and_segment_errors_feed_the_bootstrap():
    rnd = random.Random(9)
    ref = [str(rnd.randrange(50)) for _ in range(500)]
    hyp = [w if rnd.random() > 0.1 else str(rnd.randrange(50)) for w in ref]
    errs, lens = M.window_errors(ref, hyp, window=25)
    assert len(errs) == 20 and lens == [25] * 20
    assert sum(errs) == M.wer(ref, hyp)["errors"]
    errs, lens = M.window_errors(ref[:130], hyp[:130], window=50)
    assert lens == [50, 50, 30]
    assert M.window_errors(["a", "b"], ["a", "b", "c", "d"], window=10) == ([2], [2])  # trailing insertions
    assert M.window_errors([], ["x", "y"]) == ([2], [0])
    ci = M.bootstrap_ci(*M.window_errors(ref, hyp, window=25))
    assert ci["low"] <= M.wer(ref, hyp)["wer"] <= ci["high"]
    e, n = M.segment_errors([["a", "b"], ["c"]], [["a", "x"], []])
    assert (e, n) == ([1, 1], [2, 1])
    with pytest.raises(ValueError):
        M.segment_errors([["a"]], [])


def _plain_dp_distance(ref, hyp):
    """Textbook Wagner-Fischer, deliberately independent of tools.align (and of rapidfuzz)."""
    prev = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        cur = [i]
        for j, h in enumerate(hyp, 1):
            cur.append(min(prev[j - 1] + (r != h), prev[j] + 1, cur[j - 1] + 1))
        prev = cur
    return prev[-1]


def test_wer_matches_an_independent_plain_dynamic_programme():
    rnd = random.Random(20241014)
    cases = [([], []), ([], ["a"]), (["a"], []), (["a"], ["a"]), (["a"], ["b"]), (["very"] * 3, ["very"] * 2),
             (["very"] * 2, ["very"] * 3), (["a", "b"], ["b", "a"]), (["a", "b", "c"], ["c", "b", "a"]),
             (["x"] * 50, ["x"] * 49), (["x"] * 50 + ["y"], ["y"] + ["x"] * 50), (["a", "a", "b", "b"], ["b", "b", "a", "a"])]
    for _ in range(300):
        v = rnd.choice([2, 3, 6, 40])
        ref = [f"w{rnd.randrange(v)}" for _ in range(rnd.choice([0, 1, 2, 5, 12, 40, 120]))]
        if rnd.random() < 0.5:   # a corrupted copy
            hyp = [t for t in ref if rnd.random() > 0.1]
            for _ in range(rnd.randrange(0, 6)):
                hyp.insert(rnd.randrange(len(hyp) + 1), f"w{rnd.randrange(v)}")
            hyp = [f"w{rnd.randrange(v)}" if rnd.random() < 0.1 else t for t in hyp]
        else:                    # an unrelated sequence
            hyp = [f"w{rnd.randrange(v)}" for _ in range(rnd.choice([0, 1, 5, 40, 120]))]
        cases.append((ref, hyp))
    for ref, hyp in cases:
        r = M.wer(ref, hyp)
        d = _plain_dp_distance(ref, hyp)
        assert r["errors"] == r["sub"] + r["ins"] + r["del"] == d, (ref, hyp)
        assert r["wer"] == pytest.approx(d / max(len(ref), 1))
        assert r["ins"] - r["del"] == len(hyp) - len(ref)          # holds for every alignment
        _check_ops(ref, hyp, A.align(ref, hyp))                      # the reported split comes from a real alignment
        assert sum(A.count_ops(A.align(ref, hyp, backend="python"))) == d
        assert A.distance(ref, hyp) == d


def test_wer_sub_ins_del_split_is_one_optimal_alignment_not_unique():
    r = M.wer(["a", "b"], ["b", "a"])  # 2 substitutions, or 1 deletion + 1 insertion: both cost 2
    assert r["errors"] == 2 and r["wer"] == 1.0
    assert (r["sub"], r["ins"], r["del"]) in {(2, 0, 0), (0, 1, 1)}


def test_token_list_functions_refuse_plain_strings():
    # review finding: wer("hello world", "hello word") silently compared characters (n_ref == 11)
    for call in (lambda: M.wer("a b", "a b"), lambda: M.wer(["a"], "a"), lambda: M.pairwise_matrix({"x": "a b", "y": ["a"]}),
                 lambda: M.diff_report("ab", ["a"]), lambda: M.window_errors("ab", ["a"])):
        with pytest.raises(TypeError, match="wer_text"):
            call()
    with pytest.raises(ValueError):
        M.window_errors(["a"], ["a"], window=0)
    assert M.wer_text("hello world", "hello word")["wer"] == pytest.approx(0.5)
    assert M.char_error_rate("ab", "ac") == 0.5                      # the character-level helper does take strings


# ===================================================================== consensus (ROVER)

def W(text, t0=0.0, step=0.5, probs=None):
    """Word dicts for a sentence: Whisper-style surfaces (leading space), norm = lower-case letters only."""
    out = []
    for i, w in enumerate(text.split()):
        out.append({"norm": re.sub(r"[^\w']", "", w.lower()), "surface": " " + w,
                    "start": round(t0 + i * step, 6), "end": round(t0 + (i + 1) * step, 6),
                    "probability": None if probs is None else probs[i]})
    return out


def test_majority_fixes_backbone_error():
    bb = W("the cot sat on the mat")
    others = {"A": W("the cat sat on the mat"), "B": W("the cat sat on the mat"), "C": W("the cut sat on the mat")}
    dec = C.rover(bb, others)
    assert len(dec) == 6
    d = dec[1]
    assert d["chosen"]["norm"] == "cat" and d["chosen"]["surface"] == " cat" and d["changed"] is True
    assert d["votes"] == {"cot": 1.0, "cat": 2.0, "cut": 1.0}
    assert d["agreement"] == pytest.approx(2 / 4)
    assert [a["norm"] for a in d["alternatives"]] == ["cot", "cut"]
    assert d["alternatives"][0]["systems"] == ["backbone"] and d["alternatives"][1]["systems"] == ["C"]
    assert d["index"] == 1 and d["gap"] is False and d["backbone"]["norm"] == "cot"
    assert d["by_system"]["A"]["norm"] == "cat" and d["by_system"]["backbone"]["norm"] == "cot"
    assert all(not x["changed"] and x["agreement"] == 1.0 for i, x in enumerate(dec) if i != 1)
    assert C.rebuild_text(dec) == "the cat sat on the mat"
    assert C.summarize(dec)["substituted"] == 1 and C.summarize(dec)["changed"] == 1


def test_tie_keeps_the_backbone():
    bb = W("the cat sat")
    dec = C.rover(bb, {"A": W("the dog sat")})  # 1 vs 1
    assert dec[1]["chosen"]["norm"] == "cat" and dec[1]["changed"] is False
    assert dec[1]["agreement"] == pytest.approx(0.5)
    dec = C.rover(bb, {"A": W("the dog sat"), "B": W("the cow sat")})  # three-way tie
    assert dec[1]["chosen"]["norm"] == "cat"
    dec = C.rover(bb, {"A": W("the dog sat"), "B": W("the dog sat"), "C": W("the cat sat")})  # 2 vs 2
    assert dec[1]["chosen"]["norm"] == "cat" and dec[1]["agreement"] == pytest.approx(2 / 4)
    assert C.rebuild_text(dec) == "the cat sat"


def test_insertion_majority_adds_a_word():
    bb = W("the") + W("cat sat", t0=2.0, step=1.0)  # 'the' ends at 0.5, 'cat' starts at 2.0
    yes = C.rover(bb, {"A": W("the big cat sat"), "B": W("the big cat sat")})
    assert C.rebuild_text(yes) == "the big cat sat"
    gaps = [d for d in yes if d["gap"]]
    assert len(gaps) == 1
    g = gaps[0]
    assert g["changed"] and g["index"] == 1 and g["chosen"]["norm"] == "big" and g["backbone"] is None
    assert g["votes"] == {"": 1.0, "big": 2.0} and g["agreement"] == pytest.approx(2 / 3)
    assert (g["chosen"]["start"], g["chosen"]["end"]) == (0.5, 2.0)  # spread over the gap between its neighbours
    assert C.summarize(yes)["inserted"] == 1
    no = C.rover(bb, {"A": W("the big cat sat")})  # 1 vs 1: nothing is inserted
    assert C.rebuild_text(no) == "the cat sat"
    (rejected,) = [d for d in no if d["gap"]]
    assert not rejected["changed"] and rejected["chosen"]["surface"] == "" and rejected["agreement"] == pytest.approx(0.5)
    assert [a["norm"] for a in rejected["alternatives"]] == ["big"]
    # insertions at the very start and at the very end
    edge = C.rover(W("cat sat"), {"A": W("the cat sat today"), "B": W("the cat sat today")})
    assert C.rebuild_text(edge) == "the cat sat today"
    assert [(d["index"], d["chosen"]["start"], d["chosen"]["end"]) for d in edge if d["gap"]] == [(0, 0.0, 0.0), (2, 1.0, 1.0)]


def test_multiword_insertion_is_voted_slot_by_slot():
    bb = W("the") + W("cat sat", t0=2.0, step=1.0)
    full = W("the very big cat sat")
    dec = C.rover(bb, {"A": full, "B": full, "C": full, "D": W("the very cat sat")})
    assert C.rebuild_text(dec) == "the very big cat sat"
    very, big = [d["chosen"] for d in dec if d["gap"]]
    assert (very["start"], very["end"], big["start"], big["end"]) == (0.5, 1.25, 1.25, 2.0)
    half = W("the very cat sat")
    dec = C.rover(bb, {"A": full, "B": full, "C": half, "D": half})  # 'very' 4/5 but 'big' only 2 vs 3
    assert C.rebuild_text(dec) == "the very cat sat"
    assert [d["changed"] for d in dec if d["gap"]] == [True, False]


def test_deletion_majority_removes_a_word():
    bb = W("the big cat sat")
    dec = C.rover(bb, {"A": W("the cat sat"), "B": W("the cat sat")})
    assert C.rebuild_text(dec) == "the cat sat"
    d = dec[1]
    assert d["changed"] and d["chosen"]["norm"] == "" and d["chosen"]["surface"] == ""
    assert d["votes"] == {"big": 1.0, "": 2.0} and d["agreement"] == pytest.approx(2 / 3)
    assert (d["chosen"]["start"], d["chosen"]["end"]) == (bb[1]["start"], bb[1]["end"])
    assert C.summarize(dec)["deleted"] == 1
    tie = C.rover(bb, {"A": W("the cat sat")})  # a single omission is only a tie
    assert C.rebuild_text(tie) == "the big cat sat" and not tie[1]["changed"]


def test_timing_of_the_backbone_position_is_preserved():
    bb = W("a b c d", t0=10.0, step=1.0)
    wild = W("a X c d", t0=0.0, step=100.0)
    dec = C.rover(bb, {"A": wild, "B": wild, "C": wild})
    assert dec[1]["chosen"]["norm"] == "x" and dec[1]["chosen"]["surface"] == " X"
    for d, w in zip(dec, bb):
        assert (d["chosen"]["start"], d["chosen"]["end"]) == (w["start"], w["end"])
    assert C.rebuild_text(dec) == "a X c d"


def test_rebuild_text():
    assert C.rebuild_text([]) == ""
    bb = W("Hello world, how are you today?")
    other = W("Hello world how are you doing?")
    dec = C.rover(bb, {"A": other, "B": other})
    assert C.rebuild_text(dec) == "Hello world, how are you doing?"  # winner's surface; backbone's where norms agree
    # surfaces without leading spaces get single spaces; expansions are not duplicated
    assert C.rebuild_text(C.rover(C.make_words("call BAT246 now"), {})) == "call BAT246 now"
    # a multi-token word keeps its surface unless one of its tokens is outvoted
    bb = C.make_words("the code is 2023 now")
    digits = C.make_words("the code is 2024 now")
    assert C.rebuild_text(C.rover(bb, {"A": digits, "B": digits})) == "the code is 2024 now"  # winner's own surface
    spoken = C.make_words("the code is twenty twenty four now")
    assert C.rebuild_text(C.rover(bb, {"A": spoken, "B": spoken})) == "the code is twenty twenty four now"
    assert C.rebuild_text(C.rover(bb, {"A": C.make_words("the code is 2023 now")})) == "the code is 2023 now"


def test_disagreement_spans_are_grouped_with_context():
    base = [f"w{i}" for i in range(20)]

    def variant(changes):
        words = list(base)
        for i, w in changes.items():
            words[i] = w
        return W(" ".join(words))

    bb = W(" ".join(base))
    others = {"A": variant({5: "x5", 7: "x7", 15: "x15"}), "B": variant({5: "y5"}), "C": variant({})}
    dec = C.rover(bb, others)
    spans = C.disagreement_spans(dec, context=3)
    assert len(spans) == 2  # positions 5 and 7 are one unflagged word apart -> merged (merge_gap=1)
    s = spans[0]
    assert (s["start_idx"], s["end_idx"]) == (5, 7)
    assert (s["start_time"], s["end_time"]) == (bb[5]["start"], bb[7]["end"]) == (2.5, 4.0)
    assert s["backbone_text"] == s["rover_text"] == "w5 w6 w7"
    assert s["alternatives"] == {"A": "x5 w6 x7", "B": "y5 w6 w7"}  # C agrees with the backbone: not listed
    assert (s["context_before"], s["context_after"]) == ("w2 w3 w4", "w8 w9 w10")
    assert s["min_agreement"] == pytest.approx(0.5) and (s["first_decision"], s["last_decision"]) == (5, 7)
    t = spans[1]
    assert (t["start_idx"], t["end_idx"], t["backbone_text"]) == (15, 15, "w15")
    assert t["alternatives"] == {"A": "x15"} and t["min_agreement"] == pytest.approx(0.75)
    assert (t["context_before"], t["context_after"]) == ("w12 w13 w14", "w16 w17 w18")
    assert len(C.disagreement_spans(dec, merge_gap=0)) == 3
    assert len(C.disagreement_spans(dec, max_agreement=0.5)) == 1  # only position 5 is this contested
    assert C.disagreement_spans(dec, max_agreement=0.4) == []
    edge = C.disagreement_spans(C.rover(bb, {"A": variant({0: "z0"}), "B": variant({})}), context=6)
    assert edge[0]["context_before"] == "" and edge[0]["context_after"] == "w1 w2 w3 w4 w5 w6"
    assert C.disagreement_spans(C.rover(bb, {"A": variant({}), "B": variant({})})) == []
    # a rejected insertion is reviewable too
    short = W("the cat sat")
    dec = C.rover(short, {"A": W("the big cat sat"), "B": W("the big cat sat"), "C": W("the cat sat")})
    (ins,) = C.disagreement_spans(dec)
    assert ins["alternatives"] == {"A": "big", "B": "big"} and ins["backbone_text"] == "" and ins["rover_text"] == ""
    assert (ins["start_idx"], ins["end_idx"]) == (1, 1)
    assert (ins["context_before"], ins["context_after"]) == ("the", "cat sat")


def test_weights_and_min_votes():
    bb = W("the cat sat")
    others = {"A": W("the dog sat"), "B": W("the cat sat")}
    assert C.rover(bb, others)[1]["chosen"]["norm"] == "cat"
    heavy = C.rover(bb, others, weights={"A": 3.0})
    assert heavy[1]["chosen"]["norm"] == "dog" and heavy[1]["agreement"] == pytest.approx(3 / 5)
    assert C.rover(bb, {"A": W("the dog sat")}, w_backbone=2.0)[1]["chosen"]["norm"] == "cat"
    assert C.rover(bb, {"A": W("the dog sat")}, weights={"backbone": 0.5})[1]["chosen"]["norm"] == "dog"
    three = {n: W("the dog sat") for n in "ABC"}
    assert C.rover(bb, three)[1]["chosen"]["norm"] == "dog"
    assert C.rover(bb, three, min_votes=3)[1]["chosen"]["norm"] == "dog"
    blocked = C.rover(bb, three, min_votes=4)
    assert blocked[1]["chosen"]["norm"] == "cat" and not blocked[1]["changed"]
    big = W("the big cat sat")
    assert C.rebuild_text(C.rover(big, {"A": W("the cat sat"), "B": W("the cat sat")}, min_votes=3)) == "the big cat sat"
    assert C.rebuild_text(C.rover(bb, {"A": big, "B": big}, min_votes=3)) == "the cat sat"
    with pytest.raises(ValueError):
        C.rover(bb, {"A": bb}, weights={"A": -1})
    with pytest.raises(ValueError):
        C.rover(bb, {"backbone": bb})


def test_probability_breaks_ties():
    bb = W("the cat sat", probs=[0.9, 0.3, 0.9])
    other = {"A": W("the dog sat", probs=[0.9, 0.95, 0.9])}
    assert C.rover(bb, other)[1]["chosen"]["norm"] == "cat"  # ties go to the backbone ...
    assert C.rover(bb, other, prob_tiebreak=True)[1]["chosen"]["norm"] == "dog"  # ... unless asked to use probability
    sure = W("the cat sat", probs=[0.9, 0.99, 0.9])
    assert C.rover(sure, other, prob_tiebreak=True)[1]["chosen"]["norm"] == "cat"
    plain = W("the cat sat")
    weights = {"A": 2.0, "B": 2.0}  # two challengers tie above the backbone: the more probable word wins
    first = {"A": W("the dog sat", probs=[.5, .6, .5]), "B": W("the cow sat", probs=[.5, .9, .5])}
    assert C.rover(plain, first, weights=weights)[1]["chosen"]["norm"] == "cow"
    second = {"A": W("the dog sat", probs=[.5, .9, .5]), "B": W("the cow sat", probs=[.5, .6, .5])}
    assert C.rover(plain, second, weights=weights)[1]["chosen"]["norm"] == "dog"


def test_passthrough_words_are_carried_not_voted():
    bb = C.make_words("so um the cat sat")
    assert [w["norm"] for w in bb] == ["so", "", "the", "cat", "sat"]
    dec = C.rover(bb, {"A": C.make_words("so the cat sat"), "B": C.make_words("so uh the cat sat")})
    assert len(dec) == 5 and dec[1]["passthrough"] and dec[1]["chosen"]["surface"] == "um"
    assert all(not d["changed"] and d["agreement"] == 1.0 for d in dec)
    assert C.rebuild_text(dec) == "so um the cat sat"
    assert C.disagreement_spans(dec) == []


def test_make_words():
    raw = [{"word": " Call", "start": 0.0, "end": 0.4, "probability": 0.9},
           {"word": " BAT246,", "start": 0.4, "end": 1.2, "probability": 0.5},
           {"word": " um,", "start": 1.2, "end": 1.4, "probability": 0.3},
           {"word": " now.", "start": 1.4, "end": 1.8, "probability": 0.8}]
    words = C.make_words(raw)
    assert [w["norm"] for w in words] == ["call", "bat", "two", "hundred", "forty", "six", "", "now"]
    assert [w["surface"] for w in words] == [" Call", " BAT246,", "", "", "", "", " um,", " now."]
    bat = words[1:6]  # five tokens share 0.4 .. 1.2 equally, back to back
    assert bat[0]["start"] == 0.4 and bat[-1]["end"] == pytest.approx(1.2)
    assert all(a["end"] == pytest.approx(b["start"]) for a, b in zip(bat, bat[1:]))
    assert all(w["probability"] == 0.5 for w in bat)
    assert [(w["group"], w["gpos"], w["gsize"]) for w in bat] == [(1, j, 5) for j in range(5)]
    assert "group" not in words[0] and "group" not in words[6]
    assert C.rebuild_text(C.rover(words, {})) == "Call BAT246, um, now."
    plain = C.make_words("Hello, World!")
    assert [(w["norm"], w["surface"], w["start"], w["probability"]) for w in plain] == [
        ("hello", "Hello,", None, None), ("world", "World!", None, None)]
    assert C.make_words("") == [] and C.make_words([]) == []
    assert [w["norm"] for w in C.make_words("um hello", drop_fillers=False)] == ["um", "hello"]


def test_expansions_written_differently_still_agree():
    bb = C.make_words([{"word": " call", "start": 0.0, "end": 1.0}, {"word": " BAT246", "start": 1.0, "end": 2.0},
                       {"word": " now", "start": 2.0, "end": 3.0}])
    other = C.make_words("call bat two hundred and forty six now")
    dec = C.rover(bb, {"A": other})
    assert all(d["agreement"] == 1.0 and not d["changed"] for d in dec) and len(dec) == 7
    assert C.rebuild_text(dec) == "call BAT246 now"


def test_degenerate_inputs():
    assert C.rover([], {}) == []
    assert C.rebuild_text(C.rover([], {"A": []})) == ""
    alone = C.rover(W("a b"), {})
    assert [d["agreement"] for d in alone] == [1.0, 1.0] and C.rebuild_text(alone) == "a b"
    built = C.rover([], {"A": W("hello world"), "B": W("hello world")})  # nothing to align to: majority builds text
    assert C.rebuild_text(built) == "hello world" and built[0]["chosen"]["start"] is None
    bb = W("the cat sat")
    assert C.rebuild_text(C.rover(bb, {"A": []})) == "the cat sat"  # a lone empty system is only a tie
    gone = C.rover(bb, {"A": [], "B": []})
    assert C.rebuild_text(gone) == "" and C.summarize(gone)["deleted"] == 3
    assert C.summarize([])["mean_agreement"] == 1.0
    assert C.chosen_words(C.rover(bb, {})) == bb


def test_end_to_end_text_pipeline():
    truth = "Call BAT246 at 5 p.m. on the 3rd, it costs $5.50 -- okay?"
    sys_a = "call bat 246 at five pm on the third it costs five dollars fifty cents okay"
    sys_b = "Call BAT246 at 5 p.m. on the 3rd, um, it costs $5.50, OK?"
    sys_c = "call bat two forty six at five pm on the third it costs five fifty okay"
    assert M.wer_text(truth, sys_a)["wer"] == 0.0 and M.wer_text(truth, sys_b)["wer"] == 0.0
    assert M.wer_text(truth, sys_c)["errors"] == 3  # hundred, dollars, cents missing
    dec = C.rover(C.make_words(sys_c), {"a": C.make_words(sys_a), "b": C.make_words(sys_b)})
    fused = C.rebuild_text(dec)
    assert fused == "call bat two hundred forty six at five pm on the third it costs five dollars fifty cents okay"
    assert M.wer_text(truth, fused)["wer"] == 0.0
    # with the good system as backbone the vote leaves it (and its original formatting) alone
    dec = C.rover(C.make_words(sys_b), {"a": C.make_words(sys_a), "c": C.make_words(sys_c)})
    assert C.summarize(dec)["changed"] == 0 and C.rebuild_text(dec) == sys_b


def _fused_text_and_tokens(bb_text, *others):
    dec = C.rover(C.make_words(bb_text), {f"s{i}": C.make_words(o) for i, o in enumerate(others)})
    return C.rebuild_text(dec), [d["chosen"]["norm"] for d in dec if d["chosen"]["norm"]]


def test_a_voted_in_multi_token_word_is_printed_once():
    # review finding: the winner's surface sat on its first token and the continuation tokens were spelled out
    # again, so the consensus text read "50% percent", "R&D and d", "well-known known", "246 hundred forty six"
    for bb, others, expected in [
        ("the cat", ["the 50% cat"] * 2, "the 50% cat"),                                # inserted, 2 tokens
        ("the mat", ["the well-known"] * 2, "the well-known"),                          # substituted + inserted
        ("go home", ["go home R&D"] * 2, "go home R&D"),                                # appended, 3 tokens
        ("cents", ["cents 246"] * 2, "cents 246"),                                      # 4 tokens
        ("it is ok", ["it is $5.50 ok"] * 2, "it is $5.50 ok"),                         # 4 tokens before an unchanged word
        ("a b", ["a 21st b"] * 3, "a 21st b"),
        ("call now", ["call BAT246 now"] * 2, "call BAT246 now"),                       # 5 tokens, keeps the winner's text
        ("x 3 y", ["x 3.5 y"] * 2, "x 3.5 y"),                                          # backbone word 3 -> 3.5
        ("x 5 y", ["x 5% y"] * 2, "x 5% y"),                                            # 5 -> 5%
        ("a well", ["a well-known"] * 2, "a well-known"),                               # well -> well-known
    ]:
        text, tokens = _fused_text_and_tokens(bb, *others)
        assert text == expected, (bb, others)
        assert normalize(text) == tokens, (bb, text)  # and the text reads back as exactly the voted tokens


def test_a_multi_token_word_that_only_partly_wins_is_spelled_out():
    # "21st" = twenty + first: 'twenty' is voted in by four systems, 'first' only by two of five
    others = ["the 21st cat", "the 21st cat", "the twenty cat", "the twenty cat"]
    text, tokens = _fused_text_and_tokens("the cat", *others)
    assert tokens == ["the", "twenty", "cat"] and text == "the twenty cat"
    # the backbone's own multi-token word that loses a token is re-written as a whole or spelled out, never mixed
    text, tokens = _fused_text_and_tokens("call BAT246 now", "call BAT247 now", "call BAT247 now", "call BAT247 now")
    assert text == "call BAT247 now" and tokens == "call bat two hundred forty seven now".split()
    text, tokens = _fused_text_and_tokens("call BAT246 now", *["call bat two hundred forty seven now"] * 3)
    assert text == "call bat two hundred forty seven now"
    # unchanged backbone words keep the backbone's formatting even when another system wrote them as part of a word
    text, _ = _fused_text_and_tokens("call bat two forty six", "call BAT246", "call BAT246")
    assert text == "call bat two hundred forty six"


def test_a_multi_chunk_variant_keeps_the_text_of_every_chunk():
    # "all right" -> alright puts the token on "all"; the chunk "right" used to be a pass-through word of its own
    # that disappeared when a vote replaced the word
    words = C.make_words("so all right now")
    assert [w["norm"] for w in words] == ["so", "alright", "now"]
    assert [w["surface"] for w in words] == ["so", "all right", "now"]
    raw = [{"word": " all", "start": 1.0, "end": 1.4}, {"word": " right,", "start": 1.4, "end": 2.0}]
    (w,) = C.make_words(raw)
    assert (w["norm"], w["surface"], w["start"], w["end"]) == ("alright", " all right,", 1.0, 2.0)
    assert [(w["norm"], w["surface"]) for w in C.make_words("all um right")] == [("alright", "all"), ("", "um"), ("", "right")]
    text, tokens = _fused_text_and_tokens("so alrite now", "so all right now", "so all right now")
    assert text == "so all right now" and tokens == ["so", "alright", "now"]
    text, _ = _fused_text_and_tokens("it was a hundred percent", "it was 100 percent", "it was 100 percent")
    assert text == "it was a hundred percent"                      # equal after normalisation: the backbone is left alone
    text, _ = _fused_text_and_tokens("it was a fundred percent", "it was a hundred percent", "it was a hundred percent")
    assert text == "it was a hundred percent"


def test_make_words_glues_whisper_pieces_that_have_no_leading_space():
    # review finding on real faster-whisper output: "$1,600" arrives as " $1" + ",600", "10%" as " 10" + "%" and
    # "All-Star," as " All" + "-Star,"; read as separate words "$1" + ",600" became "one dollar six hundred"
    raw = [{"word": " It", "start": 0.0, "end": 0.2, "probability": 0.9}, {"word": " costs", "start": 0.2, "end": 0.4, "probability": 0.9},
           {"word": " $1", "start": 0.4, "end": 0.7, "probability": 0.8}, {"word": ",600", "start": 0.7, "end": 1.2, "probability": 0.4},
           {"word": " for", "start": 1.2, "end": 1.4, "probability": 0.9}, {"word": " an", "start": 1.4, "end": 1.5, "probability": 0.9},
           {"word": " All", "start": 1.5, "end": 1.8, "probability": 0.9}, {"word": "-Star,", "start": 1.8, "end": 2.2, "probability": 0.7},
           {"word": " 10", "start": 2.2, "end": 2.4, "probability": 0.9}, {"word": "%", "start": 2.4, "end": 2.6, "probability": 0.5}]
    words = C.make_words(raw)
    text = "It costs $1,600 for an All-Star, 10%"
    assert [w["norm"] for w in words] == normalize(text)
    assert C.rebuild_text(C.rover(words, {})) == text
    price = next(w for w in words if w.get("gpos") == 0 and w["surface"] == " $1,600")
    group = [w for w in words if w.get("group") == price["group"]]       # one thousand six hundred dollars
    assert [w["norm"] for w in group] == "one thousand six hundred dollars".split() and price["gsize"] == 5
    assert group[0]["start"] == 0.4 and group[-1]["end"] == pytest.approx(1.2)          # the pieces' time spans
    assert all(w["probability"] == pytest.approx(0.6) for w in group)                    # mean of 0.8 and 0.4
    assert [w["surface"] for w in words if w["surface"]] == [" It", " costs", " $1,600", " for", " an", " All-Star,", " 10%"]
    # lists that do not follow the leading-space convention are left alone: every entry is a word
    assert [w["norm"] for w in C.make_words([{"word": "a"}, {"word": ",600"}])] == ["a", "six", "hundred"]
    assert [w["norm"] for w in C.make_words(["10", "%"])] == ["ten", "percent"]
    assert [w["surface"] for w in C.make_words([" 10", "%"])] == [" 10%", ""]   # a list of strings follows the same rule


def test_make_words_accepts_a_list_of_strings():
    words = C.make_words(["Hello,", "World!", "BAT246"])
    assert [w["norm"] for w in words][:2] == ["hello", "world"] and words[0]["surface"] == "Hello,"
    assert C.rebuild_text(C.rover(words, {})) == "Hello, World! BAT246"


def test_spans_and_chosen_words_treat_a_multi_token_word_as_one_word():
    bb = C.make_words("call BAT246 now")
    other = C.make_words("call BAT247 now")
    dec = C.rover(bb, {"A": other, "B": other, "D": other, "C": bb})  # only the last token of BAT246 is contested
    assert C.rebuild_text(dec) == "call BAT247 now"
    (span,) = C.disagreement_spans(dec)
    # review finding: a span made of a continuation token used to show blank texts
    assert span["backbone_text"] == "six" and span["rover_text"] == "seven"
    assert span["alternatives"] == {"A": "seven", "B": "seven", "D": "seven"}
    assert (span["context_before"], span["context_after"]) == ("call BAT247", "now")
    raw = [{"word": " Call", "start": 0.0, "end": 0.5}, {"word": " BAT246,", "start": 0.5, "end": 1.5},
           {"word": " now.", "start": 1.5, "end": 2.0}]
    words = C.chosen_words(C.rover(C.make_words(raw), {}))
    assert [w["surface"] for w in words] == [" Call", " BAT246,", " now."]
    bat = words[1]
    assert bat["norm"] == "bat two hundred forty six" and bat["start"] == 0.5 and bat["end"] == pytest.approx(1.5)
    # a word whose tokens were only partly kept is listed token by token
    words = C.chosen_words(dec)
    assert [w["surface"] for w in words] == ["call", "BAT247", "now"]


def test_weights_must_be_finite_and_non_negative():
    bb = W("the cat sat")
    for bad in (float("nan"), float("inf"), float("-inf"), -1.0):
        with pytest.raises(ValueError, match="finite and non-negative"):
            C.rover(bb, {"A": bb}, weights={"A": bad})
        with pytest.raises(ValueError, match="finite and non-negative"):
            C.rover(bb, {"A": bb}, w_backbone=bad)
    with pytest.raises(ValueError):
        C.rover(bb, {"A": bb}, min_votes=float("nan"))
    assert C.rover(bb, {"A": W("the dog sat")}, min_votes=float("inf"))[1]["chosen"]["norm"] == "cat"  # "never change"


def _reference_vote(bb, others, weights=None, wb=1.0, min_votes=None):
    """The documented voting rule written out plainly (tokens only), on top of the opcodes of A.align."""
    weights = weights or {}
    names = list(others)
    pos = [{bb[k]: wb} for k in range(len(bb))]  # dicts keep insertion order: the backbone's candidate comes first
    gaps = [{} for _ in range(len(bb) + 1)]
    for name in names:
        w, words = float(weights.get(name, 1.0)), others[name]
        for tag, i1, i2, j1, j2 in A.align(bb, words):
            if tag in ("equal", "replace"):
                for t in range(i2 - i1):
                    pos[i1 + t][words[j1 + t]] = pos[i1 + t].get(words[j1 + t], 0.0) + w
            elif tag == "delete":
                for k in range(i1, i2):
                    pos[k][""] = pos[k].get("", 0.0) + w
            else:
                gaps[i1][name] = words[j1:j2]

    def pick(votes, bb_cand):
        top = [c for c, v in votes.items() if v >= max(votes.values()) - 1e-9]
        win = bb_cand if bb_cand in top else top[0]
        return bb_cand if win != bb_cand and min_votes is not None and votes[win] < min_votes - 1e-9 else win

    out = []

    def gap(g):
        for slot in range(max((len(v) for v in gaps[g].values()), default=0)):
            votes = {"": wb}
            for name in names:
                seq = gaps[g].get(name, [])
                c = seq[slot] if len(seq) > slot else ""
                votes[c] = votes.get(c, 0.0) + float(weights.get(name, 1.0))
            win = pick(votes, "")
            if not win:
                break
            out.append(win)

    for k in range(len(bb)):
        gap(k)
        win = pick(pos[k], bb[k])
        if win:
            out.append(win)
    gap(len(bb))
    return out


def test_rover_matches_an_independent_reference_voter_and_keeps_its_invariants():
    rnd = random.Random(424242)
    for _ in range(800):
        v = rnd.choice([2, 3, 4, 8, 40])
        bb = [f"w{rnd.randrange(v)}" for _ in range(rnd.randrange(0, 14))]
        base = bb if bb and rnd.random() < 0.7 else [f"w{rnd.randrange(v)}" for _ in range(rnd.randrange(0, 14))]
        others = {}
        for s in range(rnd.randrange(0, 6)):   # includes "all systems identical", "one system empty / wildly different"
            t = list(base)
            for _ in range(rnd.randrange(0, 4)):
                r = rnd.random()
                if t and r < 0.4:
                    t[rnd.randrange(len(t))] = f"w{rnd.randrange(v)}"
                elif t and r < 0.7:
                    del t[rnd.randrange(len(t))]
                else:
                    t.insert(rnd.randrange(len(t) + 1), f"w{rnd.randrange(v)}")
            others[f"s{s}"] = [f"w{rnd.randrange(v)}" for _ in range(rnd.randrange(0, 14))] if rnd.random() < 0.05 else t
        weights = {k: rnd.choice([0.0, 0.5, 1.0, 1.0, 2.0, 3.7]) for k in others} if rnd.random() < 0.5 else None
        wb = rnd.choice([1.0, 1.0, 0.0, 0.5, 2.0])
        mv = rnd.choice([None, None, 1.0, 2.0, 3.0])
        bbw = _timed(bb)
        dec = C.rover(bbw, {k: _timed(t) for k, t in others.items()}, weights=weights, w_backbone=wb, min_votes=mv)
        assert _fused_tokens(dec) == _reference_vote(bb, others, weights, wb, mv), (bb, others, weights, wb, mv)
        total = wb + sum((weights or {}).get(k, 1.0) for k in others)
        assert [d["index"] for d in dec if not d["gap"]] == list(range(len(bb)))   # every backbone word exactly once
        for d in dec:
            assert 0.0 <= d["agreement"] <= 1.0
            assert abs(sum(d["votes"].values()) - total) < 1e-9
            assert d["agreement"] == (pytest.approx(d["votes"][d["chosen"]["norm"]] / total) if total > 0 else 1.0)
            if d["gap"]:
                assert d["changed"] == bool(d["chosen"]["norm"]) and d["backbone"] is None
            else:
                w = bbw[d["index"]]
                assert d["changed"] == (d["chosen"]["norm"] != w["norm"])        # flag agrees with chosen vs original
                assert (d["chosen"]["start"], d["chosen"]["end"]) == (w["start"], w["end"])  # backbone timing kept
                if not d["changed"]:
                    assert d["chosen"] == w
        if C.summarize(dec)["changed"] == 0:
            assert C.rebuild_text(dec) == " ".join(bb)                            # nothing changed: round-trips


def test_duplicate_words_and_ties_are_voted_consistently():
    # "very very very" with systems that drop one: the deletions must land on the same word to be counted together
    fused = _fused_tokens(C.rover(_timed("so very very very good".split()),
                                  {n: _timed("so very very good".split()) for n in "ABC"}))
    assert fused == "so very very good".split()
    fused = _fused_tokens(C.rover(_timed(["very"] * 3), {"a": _timed(["very"] * 2), "b": _timed(["very"]),
                                                       "c": _timed(["very"] * 2), "d": _timed(["very"] * 3)}))
    assert fused == ["very", "very"]                                  # the median count of the five systems
    assert _fused_tokens(C.rover(_timed(list("abc")), {"a": _timed(list("axc"))})) == list("abc")   # 1 vs 1: backbone


def test_rebuilt_text_normalises_back_to_the_voted_tokens(monkeypatch):
    # The random vocabulary glues unrelated numbers together ("twenty" + "two hundred fifty"), which the
    # spoken-hundreds rule would (rightly, for real speech) read as one number; switch that rule off here.
    monkeypatch.setattr(T, "_HUNDREDS", {})
    vocab = ("the cat sat mat 246 BAT246 50% 17th 3.5 2024 1999 R&D well-known e-mail $5.50 1,250 21st hello OK U.S.A. "
             "10:30 don't it's 1,000,000 4K").split()
    rnd = random.Random(99)

    def mutate(words):
        out = list(words)
        for _ in range(rnd.randrange(0, 4)):
            r = rnd.random()
            if out and r < 0.4:
                out[rnd.randrange(len(out))] = rnd.choice(vocab)
            elif out and r < 0.7:
                del out[rnd.randrange(len(out))]
            else:
                out.insert(rnd.randrange(len(out) + 1), rnd.choice(vocab))
        return out

    changed = 0
    for _ in range(800):
        base = [rnd.choice(vocab) for _ in range(rnd.randrange(1, 10))]
        text, tokens = _fused_text_and_tokens(" ".join(mutate(base)), *[" ".join(mutate(base)) for _ in range(rnd.randrange(2, 5))])
        assert normalize(text) == tokens, (base, text)
        changed += 1
    assert changed == 800


def _hetero_corpus(seed, specs, c, n_words=3000, vocab_size=2000, h=0.15):
    """One truth, several systems; ``specs[i] = (error rate on hard words, error rate on the others)``.  An error on a
    hard word is the same shared mistake in every system with probability ``c``, otherwise an independent one."""
    rnd = random.Random(seed)
    vocab = [f"w{i:05d}" for i in range(vocab_size)]
    truth = [rnd.choice(vocab) for _ in range(n_words)]
    hard = [rnd.random() < h for _ in truth]
    mode = [rnd.choice("SDI") for _ in truth]
    partner = [rnd.choice(vocab) for _ in truth]
    systems = {}
    for s, (p_hard, p_easy) in enumerate(specs):
        r = random.Random(seed * 1000 + s)
        out = []
        for i, w in enumerate(truth):
            if r.random() < (p_hard if hard[i] else p_easy):
                m, repl = (mode[i], partner[i]) if hard[i] and r.random() < c else (r.choice("SDI"), r.choice(vocab))
                if m == "S":
                    out.append(repl)
                elif m == "I":
                    out += [w, repl]
            else:
                out.append(w)
        systems[f"sys{s}"] = out
    return truth, systems


def test_equal_weight_rover_can_lose_to_a_strong_system_when_weak_systems_share_errors():
    # documented limitation: voting removes independent errors, not shared ones.  One strong system and four weak
    # ones that make the same mistakes: the weak majority out-votes the strong system (measured: 3.2% -> 11.4% mean
    # WER over 20 seeds, worse in 20/20), and the agreement ranking does not even pick the strong system.
    specs = [(0.15, 0.01)] + [(0.85, 0.03)] * 4
    truth, systems = _hetero_corpus(101, specs, c=0.9)
    single = {n: M.wer(truth, t)["wer"] for n, t in systems.items()}
    assert single["sys0"] < 0.05 < 0.12 < min(v for n, v in single.items() if n != "sys0")
    assert M.rank_by_agreement(M.pairwise_matrix(systems))[0][0] != "sys0"
    equal = M.wer(truth, _fused_tokens(_fuse(systems, "sys0")))["wer"]
    assert equal > 2 * single["sys0"]
    # a backbone weight of at least the number of weak systems protects the strong one (ROVER then changes nothing)
    protected = M.wer(truth, _fused_tokens(_fuse(systems, "sys0", w_backbone=4.0)))["wer"]
    assert protected == pytest.approx(single["sys0"])
    # the same quality gap with independent errors: the weak systems are harmless and the vote still helps a little
    truth, systems = _hetero_corpus(101, specs, c=0.0)
    single = {n: M.wer(truth, t)["wer"] for n, t in systems.items()}
    assert M.wer(truth, _fused_tokens(_fuse(systems, "sys0")))["wer"] < 1.25 * single["sys0"]


def test_two_systems_cannot_be_improved_by_voting():
    truth, systems, _ = _synthetic_corpus(5, n_systems=2)
    best = min(systems, key=lambda n: M.wer(truth, systems[n])["wer"])
    assert _fused_tokens(_fuse(systems, best)) == systems[best]       # every disagreement is a tie: the backbone wins


# ===================================================================== synthetic ground-truth validation

def _synthetic_corpus(seed, n_words=3000, vocab_size=400, n_systems=5):
    """Ground truth from a 400-word vocabulary plus 5 systems that corrupt it independently (6-12% each)."""
    rnd = random.Random(seed)
    vocab = [f"w{i:03d}" for i in range(vocab_size)]
    truth = [rnd.choice(vocab) for _ in range(n_words)]
    systems, rates = {}, {}
    for s in range(n_systems):
        r = random.Random(seed * 1000 + s)
        rate = r.uniform(0.06, 0.12)
        out = []
        for w in truth:
            x = r.random()
            if x < rate / 3:        # substitution
                out.append(r.choice(vocab))
            elif x < 2 * rate / 3:  # deletion
                continue
            elif x < rate:          # insertion after the word
                out += [w, r.choice(vocab)]
            else:
                out.append(w)
        systems[f"sys{s}"] = out
        rates[f"sys{s}"] = rate
    return truth, systems, rates


def _timed(tokens):
    return [{"norm": t, "surface": " " + t, "start": i * 0.3, "end": i * 0.3 + 0.3, "probability": None}
            for i, t in enumerate(tokens)]


def _fuse(systems, backbone, **kw):
    others = {n: _timed(t) for n, t in systems.items() if n != backbone}
    return C.rover(_timed(systems[backbone]), others, **kw)


def _fused_tokens(decisions):
    return [d["chosen"]["norm"] for d in decisions if d["chosen"]["norm"]]


def test_synthetic_ground_truth_rover_beats_best_single_system(capsys):
    truth, systems, rates = _synthetic_corpus(2024)
    assert len(truth) == 3000 and 300 < len(set(truth)) <= 400 and len(systems) == 5
    single = {n: M.wer(truth, t) for n, t in systems.items()}
    for n, r in single.items():  # nominal 6-12% corruption (a few random substitutions pick the same word)
        assert 0.04 < r["wer"] < 0.14, (n, r["wer"])
    best = min(single, key=lambda n: single[n]["wer"])

    decisions = _fuse(systems, best)  # backbone = best system, others = the remaining four
    fused = _fused_tokens(decisions)
    r = M.wer(truth, fused)
    ci_best = M.bootstrap_ci(*M.window_errors(truth, systems[best], window=25), seed=1)
    ci_fused = M.bootstrap_ci(*M.window_errors(truth, fused, window=25), seed=1)

    matrix = M.pairwise_matrix(systems)
    ranking = M.rank_by_agreement(matrix)
    spans = C.disagreement_spans(decisions)
    flagged = {i for sp in spans for i in range(sp["start_idx"], sp["end_idx"] + 1)}
    backbone_tokens = systems[best]
    wrong = set()  # backbone words that are wrong against the truth (substituted, inserted or missing before)
    for tag, i1, i2, j1, j2 in A.align(truth, backbone_tokens):
        if tag in ("replace", "insert"):
            wrong.update(range(j1, j2))
        elif tag == "delete":
            wrong.add(min(j1, len(backbone_tokens) - 1))
    recall = len(wrong & flagged) / len(wrong)
    coverage = len(flagged) / len(backbone_tokens)

    with capsys.disabled():  # visible in the normal pytest output
        print()
        print("SYNTHETIC GROUND TRUTH: 3000 words, 400-word vocabulary, 5 independently corrupted systems")
        for n in sorted(single):
            s = single[n]
            print(f"  {n}: nominal error rate {rates[n] * 100:5.2f}%  WER {s['wer'] * 100:5.2f}%"
                  f"  (S {s['sub']} I {s['ins']} D {s['del']})")
        print(f"  best single system        : {best}  WER {single[best]['wer'] * 100:.2f}%"
              f"  95% CI [{ci_best['low'] * 100:.2f}, {ci_best['high'] * 100:.2f}]")
        print(f"  ROVER (backbone={best} + 4) : WER {r['wer'] * 100:.2f}%  (S {r['sub']} I {r['ins']} D {r['del']})"
              f"  95% CI [{ci_fused['low'] * 100:.2f}, {ci_fused['high'] * 100:.2f}]")
        print(f"  relative error reduction  : {100 * (1 - r['wer'] / single[best]['wer']):.1f}%")
        print(f"  agreement ranking (no ground truth): {', '.join(f'{n} {a:.3f}' for n, a in ranking)}")
        print(f"  review spans: {len(spans)} covering {coverage * 100:.1f}% of the words, "
              f"catching {recall * 100:.1f}% of the backbone's {len(wrong)} errors")

    assert r["wer"] < single[best]["wer"]  # the required property: strictly better than the best single system
    assert r["wer"] < 0.5 * single[best]["wer"]
    assert ci_fused["high"] < ci_best["low"]  # and not by chance: the 95% intervals do not even overlap
    assert C.rebuild_text(decisions).split() == fused
    chosen = C.chosen_words(decisions)
    assert [w["start"] for w in chosen] == sorted(w["start"] for w in chosen)  # timeline stays monotonic
    assert all(w["end"] >= w["start"] for w in chosen)
    summary = C.summarize(decisions)
    assert summary["changed"] > 0 and summary["substituted"] + summary["deleted"] + summary["inserted"] == summary["changed"]
    changed = [d["agreement"] for d in decisions if d["changed"]]
    kept = [d["agreement"] for d in decisions if not d["changed"]]
    assert sum(changed) / len(changed) < sum(kept) / len(kept)  # contested words are the ones that get changed
    assert recall >= 0.95 and coverage < 0.75  # the review list is both complete and much shorter than the text
    assert ranking[0][0] in sorted(single, key=lambda n: single[n]["wer"])[:2]  # agreement alone finds a top system


@pytest.mark.parametrize("seed", range(1, 9))
def test_synthetic_rover_improves_on_every_seed(seed):
    truth, systems, _ = _synthetic_corpus(seed)
    single = {n: M.wer(truth, t)["wer"] for n, t in systems.items()}
    best = min(single, key=single.get)
    fused = M.wer(truth, _fused_tokens(_fuse(systems, best)))["wer"]
    assert fused < single[best]
    assert fused < 0.5 * single[best]
    ranking = M.rank_by_agreement(M.pairwise_matrix(systems))
    assert ranking[0][0] in sorted(single, key=single.get)[:2]


def test_synthetic_rover_does_not_depend_on_which_system_is_the_backbone():
    truth, systems, _ = _synthetic_corpus(7)
    best = min(M.wer(truth, t)["wer"] for t in systems.values())
    for backbone in systems:  # even the worst system as backbone beats every single system
        assert M.wer(truth, _fused_tokens(_fuse(systems, backbone)))["wer"] < best


def test_synthetic_weights_favouring_the_accurate_system_do_not_hurt():
    truth, systems, _ = _synthetic_corpus(11)
    single = {n: M.wer(truth, t)["wer"] for n, t in systems.items()}
    best = min(single, key=single.get)
    plain = M.wer(truth, _fused_tokens(_fuse(systems, best)))["wer"]
    weights = {n: 1.0 / single[n] for n in systems}  # inverse-error weights
    scale = weights[best]
    weighted = M.wer(truth, _fused_tokens(_fuse(systems, best, weights={n: w / scale for n, w in weights.items()},
                                                 w_backbone=1.0)))["wer"]
    assert weighted < single[best] and plain < single[best]


def test_spoken_hundreds_are_the_same_number_as_the_digits():
    # "sixteen hundred" (how 1,600 is said) == "$1,600" read digit-wise == "one thousand six hundred"
    same = ["sixteen hundred dollars", "$1,600", "one thousand six hundred dollars", "1,600 dollars"]
    assert len({tuple(normalize(x)) for x in same[:1] + same[2:3]}) == 1
    assert normalize("sixteen hundred") == normalize("1600") == normalize("one thousand six hundred")
    assert normalize("seventy five hundred and fifty") == normalize("7,550")
    assert normalize("twenty one hundred") == normalize("two thousand one hundred")
    # single digits are untouched, and the rule only STARTS a number (never continues one)
    assert normalize("six hundred") == ["six", "hundred"] and normalize("one hundred") == ["one", "hundred"]
    assert normalize("three twenty hundred") == ["three", "twenty", "hundred"]
    assert normalize("1,250 246") == ["one", "thousand", "two", "hundred", "fifty", "two", "hundred", "forty", "six"]
