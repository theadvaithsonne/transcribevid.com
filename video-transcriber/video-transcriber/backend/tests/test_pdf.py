"""PDF export. Pages are read back with pypdf, so these check what a person could select and copy."""
import io
import random
import re
import shutil
import threading
import time
import unicodedata

import pytest
from pypdf import PdfReader

from app import formats, pdf

# Characters that are invisible, combine with their neighbour or cannot be written in a source file are built here.
ZWSP, ZWNJ, ZWJ, RLO, BOM = (chr(c) for c in (0x200B, 0x200C, 0x200D, 0x202E, 0xFEFF))
ACUTE, DIAERESIS = chr(0x301), chr(0x308)
NBSP, IDEOGRAPHIC_SPACE, LINE_SEP, PARA_SEP = (chr(c) for c in (0xA0, 0x3000, 0x2028, 0x2029))
LONE_HIGH, LONE_LOW = chr(0xD800), chr(0xDFFF)          # unpaired surrogates, as bad decoding can leave in a str
NONCHAR = chr(0x10FFFD)                                  # private use plane 16: no font has it
FAMILY_EMOJI = "".join(chr(c) for c in (0x1F468, 0x200D, 0x1F469, 0x200D, 0x1F467))


def seg(i, start, end, text):
    return {"id": i, "start": start, "end": end, "text": text, "words": None, "confidence": 0.9}


def make_job(segments=None, **over):
    job = {"title": "Team sync", "filename": "sync.mp4", "language": "en", "duration": 125.0,
           "options": {"model": "small", "task": "transcribe"},
           "stats": {"word_count": 25431, "avg_confidence": 0.934, "keywords": [{"word": "sync", "count": 2}]},
           "segments": [seg(0, 0, 3, "Hello world."), seg(1, 3.2, 6, "This is the second sentence.")]
           if segments is None else segments}
    job.update(over)
    return job


def pages_of(data):
    return [p.extract_text() for p in PdfReader(io.BytesIO(data)).pages]


def flat(text):
    return " ".join(text.split())


def long_job(n=400, words=12, seed=1, **over):
    rnd = random.Random(seed)
    vocab = ["".join(rnd.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(rnd.randint(2, 9))) for _ in range(900)]
    segs, t = [], 0.0
    for i in range(n):
        text = " ".join(rnd.choice(vocab) for _ in range(rnd.randint(words - 3, words + 3))).capitalize() + "."
        segs.append(seg(i, t, t + 3.5, text))
        t += 3.5 + (2.0 if rnd.random() < 0.15 else 0.2)
    return make_job(segs, **{"duration": t, **over})


@pytest.fixture
def no_fonts(monkeypatch):
    """A machine without any usable font file."""
    pdf.clear_font_cache()
    monkeypatch.setattr(pdf, "_user_dirs", lambda: [])
    monkeypatch.setattr(pdf, "_system_dirs", lambda: [])
    yield
    monkeypatch.undo()
    pdf.clear_font_cache()


# --------------------------------------------------------------------------- the document
def test_renders_a_searchable_a4_document():
    data = pdf.render_pdf(make_job())
    assert data.startswith(b"%PDF-") and data.rstrip().endswith(b"%%EOF")
    assert b"/Subtype /Image" not in data                       # text is text, not a picture
    reader = PdfReader(io.BytesIO(data))
    assert len(reader.pages) == 1
    assert [round(float(x)) for x in reader.pages[0].mediabox[2:]] == [595, 842]
    assert reader.metadata.title == "Team sync"
    text = flat(pages_of(data)[0])
    for expected in ("Team sync", "Language: English", "Duration: 0:02:05", "Model: small", "[00:00] Hello world.",
                     "This is the second sentence.", "TranscribeVid", "Page 1 of 1"):
        assert expected in text
    assert len(data) < 150_000                                  # fonts are subset, not embedded whole


def test_summary_row_only_when_there_are_stats():
    with_stats = flat(pages_of(pdf.render_pdf(make_job()))[0])
    assert "25,431" in with_stats and "93%" in with_stats and "0:02:05" in with_stats
    for none in (None, {}):
        text = flat(pages_of(pdf.render_pdf(make_job(stats=none)))[0])
        assert "WORDS" not in text and "CONFIDENCE" not in text and "Hello world." in text
    partial = flat(pages_of(pdf.render_pdf(make_job(stats={"word_count": 7, "avg_confidence": None})))[0])
    assert "WORDS" in partial and "CONFIDENCE" not in partial


def test_paragraphs_start_with_a_timestamp():
    segs = [seg(0, 0, 3, "First part."), seg(1, 3.1, 6, "Still the first paragraph."),
            seg(2, 12, 15, "After a long pause."), seg(3, 3723.4, 3726, "Past the hour mark.")]
    text = flat(pages_of(pdf.render_pdf(make_job(segs, duration=3730)))[0])
    assert "[00:00] First part. Still the first paragraph." in text
    assert "[00:12] After a long pause." in text
    assert "[1:02:03] Past the hour mark." in text


def test_empty_segments_and_missing_fields():
    for job in (make_job([]), make_job([], stats=None, options=None), {"segments": []}, {}, None,
                {"segments": [seg(0, 0, 1, "Only this.")]},
                make_job([{"text": "no timing"}, {"start": None, "end": "x", "text": "bad numbers"},
                          {"start": float("nan"), "end": float("inf"), "text": "not finite"}, "junk", None,
                          seg(9, 5, 6, "   "), seg(10, 7, 8, None)], duration=None, title=None, language=None)):
        data = pdf.render_pdf(job)
        assert data.startswith(b"%PDF-") and len(PdfReader(io.BytesIO(data)).pages) == 1
    assert "No speech was detected" in flat(pages_of(pdf.render_pdf(make_job([])))[0])
    assert "Transcript" in flat(pages_of(pdf.render_pdf({}))[0])


def test_hostile_job_values_are_tolerated():
    huge = 10 ** 400                                         # float(huge) overflows
    for job in (make_job(options="x", stats=[1], title=12345, language=5),
                make_job([seg(0, 1e306, 1e307, "far future"), seg(1, -50, -40, "negative times")], duration=1e308),
                make_job(duration=huge, stats={"word_count": huge, "avg_confidence": huge}),
                make_job(stats={"word_count": float("nan"), "avg_confidence": "high"}, options={"model": None}),
                make_job("not a list"), make_job(5), make_job({"a": 1}), make_job(segments=(seg(0, 0, 1, "tuple ok"),))):
        data = pdf.render_pdf(job)
        assert data.startswith(b"%PDF-") and pages_of(data)
    text = flat(pages_of(pdf.render_pdf(make_job(stats={"word_count": 5, "avg_confidence": 250})))[0])
    assert "100%" in text                                    # confidence is clamped, not printed as 25000%


def test_language_label_and_translation_note():
    def meta(**kw):
        return flat(pages_of(pdf.render_pdf(make_job(**kw)))[0])
    assert "Language: Hindi" in meta(language="hi") and "Language: Portuguese" in meta(language="pt-BR")
    assert "Language: Spanish" in meta(language="Spanish") and "Language: xx" in meta(language="xx")
    assert "Language:" not in meta(language=None) and "Translated to English" not in meta()
    assert "Translated to English" in meta(options={"model": "small", "task": "translate"})
    assert "sync.mp4" in flat(pages_of(pdf.render_pdf(make_job(title="", filename="sync.mp4")))[0])


def test_page_count_grows_with_content():
    counts = [len(pages_of(pdf.render_pdf(long_job(n)))) for n in (3, 60, 400)]
    assert counts[0] == 1 and counts[0] < counts[1] < counts[2]


def test_footers_say_page_x_of_y_and_later_pages_carry_the_title():
    data = pdf.render_pdf(long_job(300, title="Quarterly review"))
    pages = pages_of(data)
    n = len(pages)
    assert n >= 4
    for i, text in enumerate(pages, 1):
        t = flat(text)
        assert f"Page {i} of {n}" in t and "TranscribeVid" in t
        assert t.count("Quarterly review") == 1                 # big title on page 1, running header after that
    assert flat(pages[1]).startswith("Quarterly review")


def test_no_stranded_lines_between_pages():
    lines = [int(x) for x in random.Random(5).choices(range(1, 9), k=300)]
    pages = pdf._paginate(lines, 400)
    placed = {}
    for page in pages:
        for k, first, count, y in page:
            assert y + count * pdf.LEAD <= pdf.BOTTOM + 1e-6
            placed.setdefault(k, []).append((first, count))
    for k, n in enumerate(lines):
        chunks = placed[k]
        assert sum(c for _, c in chunks) == n and [f for f, _ in chunks] == sorted(f for f, _ in chunks)
        if len(chunks) > 1:                                      # a split paragraph never leaves one line behind
            assert all(c >= 2 for _, c in chunks)
    assert all(page for page in pages[:-1])                      # and no blank pages in between


def test_no_timestamp_is_left_alone_at_the_bottom_of_a_page():
    for text in pages_of(pdf.render_pdf(long_job(300)))[:-1]:
        last = text.rsplit("TranscribeVid", 1)[0].rstrip().splitlines()[-1]
        assert not re.fullmatch(r"\[[\d:]+\]", last.strip()) and len(last.split()) > 1


def test_right_to_left_paragraphs_are_right_aligned():
    primary = pdf._primary()
    if not primary or 0x645 not in pdf._coverage(primary) or not pdf.HAS_SHAPING:
        pytest.skip("needs a font with Arabic and HarfBuzz")
    arabic = " ".join(["مرحبا بالعالم هذه جملة اختبار"] * 6)
    runs = []

    def visit(text, cm, tm, font_dict, font_size):
        if text.strip():
            runs.append((text.strip(), tm[4]))

    data = pdf.render_pdf(make_job([seg(0, 0, 1, arabic), seg(1, 9, 10, "Plain English text.")]))
    for page in PdfReader(io.BytesIO(data)).pages:
        page.extract_text(visitor_text=visit)
    stamps = {t: x for t, x in runs if t.startswith("[0")}
    assert stamps["[00:00]"] > pdf.PAGE_W * 0.7 and stamps["[00:09]"] < pdf.PAGE_W * 0.2


def test_special_characters_survive():
    text = "a & b < c > d \\ e ( f ) g % h # i _ j ~ k ^ { l } [ m ] | n \"q\" 'r' $5 *s* +1 =2 @ ! ? ; : , ."
    assert text in flat(pages_of(pdf.render_pdf(make_job([seg(0, 0, 1, text)], title="R&D (v2) <draft>")))[0])
    assert "R&D (v2) <draft>" in flat(pages_of(pdf.render_pdf(make_job(title="R&D (v2) <draft>")))[0])


def test_very_long_tokens_are_cut_not_overflowing():
    token, url = "x" * 5000, "https://example.com/" + "a1b2c3/" * 600
    data = pdf.render_pdf(make_job([seg(0, 0, 1, f"before {token} between {url} after")], title="T" * 3000))
    lines = [ln for page in pages_of(data) for ln in page.splitlines()]
    assert max(len(ln) for ln in lines) < 140                    # a line holds ~90 'x'; more would run off the page
    text = " ".join(pages_of(data))
    joined = "".join(text.split())
    assert joined.count("x") >= 5000 and joined.count("a1b2c3") >= 500          # nothing was dropped
    assert "before" in text and "between" in text and "after" in text


def test_two_hour_transcript_is_fast_and_small():
    job = long_job(2500, words=10, seed=3, duration=7200)
    assert 22000 < sum(len(s["text"].split()) for s in job["segments"]) < 28000
    t0 = time.perf_counter()
    data = pdf.render_pdf(job)
    took = time.perf_counter() - t0
    print(f"\n2-hour transcript: {took:.2f}s, {len(data) / 1024:.0f} KB, {len(PdfReader(io.BytesIO(data)).pages)} pages")
    assert took < 15 and len(data) < 1_000_000


# --------------------------------------------------------------------------- scripts
SAMPLES = {
    "hindi": "नमस्ते दुनिया, यह एक परीक्षण है। क्षमा करें, ज्ञान और विज्ञान।",
    "chinese": "你好，世界。这是一个测试。繁體中文也可以。",
    "japanese": "こんにちは世界。これはテストです。カタカナ。",
    "korean": "안녕하세요 세계. 이것은 테스트입니다.",
    "arabic": "مرحبا بالعالم، هذا اختبار للنص العربي ١٢٣ ثم 456.",
    "hebrew": "שלום עולם, זהו מבחן בעברית (בדיקה) 123.",
    "thai": "สวัสดีชาวโลก นี่คือการทดสอบ",
    "tamil": "வணக்கம் உலகம்",
    "russian": "Привет, мир! Это тест кириллицы. Ёжик.",
    "greek": "Γειά σου Κόσμε! Αυτό είναι ένα τεστ.",
    "symbols": "♪ ♫ ✓ → ≤ ½ © ™ 😀 👍",
    "accents": f"café naïve Ünïcödé e{ACUTE} a{DIAERESIS} Việt Nam",
}


@pytest.mark.parametrize("name", sorted(SAMPLES))
def test_every_script_renders(name):
    data = pdf.render_pdf(make_job([seg(0, 0, 2, SAMPLES[name]), seg(1, 10, 12, "English as well.")],
                                   title=f"{name} sample", language=None))
    pages = pages_of(data)
    assert data.startswith(b"%PDF-") and len(pages) == 1 and flat(pages[0])
    assert "English as well." in flat(pages[0])
    if name in ("russian", "greek") and pdf._primary():          # covered by every primary font
        assert SAMPLES[name] in flat(pages[0])
    if name == "accents" and pdf._primary():
        assert unicodedata.normalize("NFC", SAMPLES[name]) in flat(pages[0])


def test_titles_in_scripts_without_a_bold_face_are_thickened_not_left_light():
    def stroked(title):
        data = pdf.render_pdf(make_job([seg(0, 0, 2, "Body text stays plain.")], title=title))
        return PdfReader(io.BytesIO(data)).pages[0].get_contents().get_data().decode("latin-1").count(" 2 Tr"), data
    assert stroked("Quarterly review")[0] == 0                  # bold face exists: nothing to fake
    if not pdf._plan(set(SAMPLES["chinese"] + SAMPLES["korean"]), "en").fallbacks:
        pytest.skip("needs CJK fonts")
    for name in ("chinese", "korean"):
        n, data = stroked(SAMPLES[name])
        assert 1 <= n <= 3                                      # the title lines only, never the body
        text = flat(pages_of(data)[0])
        assert SAMPLES[name] in text and "Body text stays plain." in text


def test_script_fallback_fonts_are_chosen_by_coverage():
    if not pdf._primary():
        pytest.skip("no TrueType font on this machine")
    cyrillic = "".join(chr(c) for c in range(0x410, 0x450))
    plan = pdf._plan(set(cyrillic + "é"), "en")
    assert plan.fallbacks == () and not plan.missing             # the primary face already draws it
    exotic = {NONCHAR, chr(0xF0001)}                             # private use planes: nobody has these
    assert pdf._plan(exotic, "en").missing == {ord(c) for c in exotic}
    assert pdf._plan(exotic, "en", fallbacks=False).fallbacks == ()
    assert "a?b" in flat(pages_of(pdf.render_pdf(make_job([seg(0, 0, 1, f"a{NONCHAR}b")])))[0])


def test_a_line_after_a_fallback_font_line_keeps_its_own_font():
    # fpdf2 quirk: a coloured line that begins in a fallback font left the page believing the body font was
    # selected, so the next line came out in the previous (bold timestamp) font - tofu, and wrong text when copied.
    line1 = "आज का topic है Kubernetes deployment। 我们用 Docker 部署。 ثم استخدمنا Python و FastAPI."
    line2 = "Всё работает ♪ ✓ 😀 → ½"
    plan = pdf._plan(set(line1 + line2), "en")
    if len(plan.fallbacks) < 2:
        pytest.skip("needs fallback fonts for Devanagari and Chinese")
    doc = pdf._Doc(plan, "t")
    doc.set_fallback_fonts([n for n in doc.faces if n != pdf.SANS], exact_match=False)   # the trigger: body font not a fallback
    try:
        doc.add_page()
        doc.look(True, pdf.STAMP, pdf.ACCENT)                 # a bold timestamp was the last thing drawn
        doc.put("[00:00]", 62, 100.5, 30, 16.5)
        doc.look(False, pdf.BODY, pdf.INK)
        doc.put(line1, 98, 100, 435, 16.5, "L", False)
        doc.put(line2, 62, 116.5, 470, 16.5, "L", False)
        text = flat(PdfReader(io.BytesIO(bytes(doc.output()))).pages[0].extract_text())
    finally:
        doc.release_fonts()
    assert "Всё работает" in text and "Docker" in text


def test_paragraphs_are_set_in_the_script_font_when_most_letters_need_it():
    plan = pdf._plan(set("नमस्ते世界"), "en")
    if len(plan.fallbacks) < 2:
        pytest.skip("needs Devanagari and CJK fonts")
    doc = pdf._Doc(plan, "t")
    try:
        hindi = doc.base_font("नमस्ते दुनिया यह test")
        chinese = doc.base_font("你好，世界。 Hello")
        assert hindi != pdf.SANS and chinese != pdf.SANS and hindi != chinese
        assert doc.base_font("Plain English with one 世 character in it") == pdf.SANS
        assert doc.base_font("Привет мир") == pdf.SANS            # the primary font has Cyrillic
    finally:
        doc.release_fonts()


def test_cjk_font_follows_the_language():
    names = {p.name.lower() for p in pdf._index(False).values()}
    if not {"yugothr.ttc", "msyh.ttc"} <= names:
        pytest.skip("needs Yu Gothic and Microsoft YaHei")
    kanji = set("こんにちは世界漢字")
    assert pdf._plan(kanji, "ja").fallbacks[0].regular[0].name.lower() == "yugothr.ttc"
    assert pdf._plan(kanji, "zh").fallbacks[0].regular[0].name.lower() == "msyh.ttc"
    assert pdf._plan(set("안녕"), "ko").fallbacks[0].regular[0].name.lower() == "malgun.ttf"


def test_without_harfbuzz_complex_scripts_still_render(monkeypatch):
    monkeypatch.setattr(pdf, "HAS_SHAPING", False)
    data = pdf.render_pdf(make_job([seg(0, 0, 2, SAMPLES["arabic"]), seg(1, 9, 11, SAMPLES["hindi"]),
                                    seg(2, 20, 22, "Plain text.")]))
    assert data.startswith(b"%PDF-") and "Plain text." in flat(pages_of(data)[0])


def test_unsupported_characters_become_question_marks(no_fonts):
    data = pdf.render_pdf(make_job([seg(0, 0, 1, "Plain “quoted” – text 你好 done")]))
    text = flat(pages_of(data)[0])
    assert 'Plain "quoted" - text ?? done' in text


def test_built_in_font_is_used_when_no_font_file_exists(no_fonts):
    assert pdf._primary() is None
    data = pdf.render_pdf(make_job([seg(0, 0, 1, "Hello, नमस्ते world 😀")], title="Café"))
    assert b"Helvetica" in data
    text = flat(pages_of(data)[0])
    assert "Café" in text and "Hello, ?????? world ?" in text
    assert len(PdfReader(io.BytesIO(data)).pages) == 1


def test_a_font_that_breaks_pdf_generation_degrades_instead_of_failing(monkeypatch):
    if not pdf._primary():
        pytest.skip("no TrueType font on this machine")
    real = pdf._Doc._register

    def broken(self, name, face, style):
        if name.startswith("vt-fb"):
            raise RuntimeError("corrupt font")
        return real(self, name, face, style)

    monkeypatch.setattr(pdf._Doc, "_register", broken)
    data = pdf.render_pdf(make_job([seg(0, 0, 1, "Latin 你好 नमस्ते end")]))
    assert "Latin" in flat(pages_of(data)[0]) and "end" in flat(pages_of(data)[0])


def test_font_discovery_failure_falls_back_to_the_built_in_font(monkeypatch):
    def explode(*args, **kwargs):
        raise OSError("disk on fire")

    monkeypatch.setattr(pdf, "_plan", explode)
    data = pdf.render_pdf(make_job())
    assert b"Helvetica" in data and "Hello world." in flat(pages_of(data)[0])


def test_random_unicode_never_breaks_generation():
    ranges = [(0x20, 0x7E)] * 6 + [(0, 0x1F), (0x7F, 0x9F), (0xA0, 0x24F), (0x300, 0x36F), (0x370, 0x4FF), (0x590, 0x6FF),
                                   (0x900, 0xDFF), (0xE00, 0xEFF), (0x1100, 0x11FF), (0x2000, 0x20FF), (0x2190, 0x27BF),
                                   (0x3000, 0x30FF), (0x4E00, 0x9FFF), (0xAC00, 0xD7AF), (0xD800, 0xDFFF),
                                   (0xE000, 0xF8FF), (0xFB00, 0xFDFF), (0xFE00, 0xFE0F), (0xFE70, 0xFEFF),
                                   (0xFF00, 0xFFFF), (0x1F300, 0x1F9FF), (0x20000, 0x2A6DF), (0xE0000, 0xE007F),
                                   (0x10FFFE, 0x10FFFF)]
    nasty = [ZWJ * 50, RLO + "abc", "e" + ACUTE * 200, "क्" * 100, "a" + chr(0) + "b", LONE_HIGH, LONE_LOW + LONE_HIGH,
             FAMILY_EMOJI, chr(0xFDFA) * 30, "(((( \\\\ ))))", "\n\n\t\t", LINE_SEP + PARA_SEP, "x" * 4000, "你" * 1500,
             "ا" * 1000, "क" * 1000, chr(0x1F600) * 200, " " * 100]
    rnd = random.Random(2024)
    jobs = []
    for _ in range(3):
        segs = []
        for i in range(rnd.randint(1, 12)):
            chars = [chr(rnd.randint(*rnd.choice(ranges))) for _ in range(rnd.choice([1, 5, 40, 120]))]
            segs.append(seg(i, i * 5.0, i * 5.0 + rnd.random() * 4, "".join(c if rnd.random() > 0.15 else " " for c in chars)))
        jobs.append(make_job(segs, title="".join(chr(rnd.randint(*rnd.choice(ranges))) for _ in range(30)),
                             language=rnd.choice(["en", "ja", "ko", "zh", "ar", "yue", "xx", ""])))
    jobs.append(make_job([seg(i, i * 5.0, i * 5.0 + 2, t) for i, t in enumerate(nasty)], title="".join(nasty[:6]) * 20))
    for job in jobs:
        data = pdf.render_pdf(job)
        assert data.startswith(b"%PDF-")
        assert pages_of(data)                                    # parses, every page extractable


# --------------------------------------------------------------------------- building blocks
def test_clean_text():
    assert pdf._clean("a" + chr(0) + f"b{ZWSP}c{LONE_HIGH}d{BOM}e{RLO}") == "abcde"
    assert pdf._clean(f"e{ACUTE}  a\n\t b{NBSP}c{IDEOGRAPHIC_SPACE}d") == "é a b c d"
    assert pdf._clean(None) == "" and pdf._clean(12) == "12"
    assert pdf._clean(f"x{ZWNJ}y") == f"x{ZWNJ}y"                # Persian/Indic joiners are kept for shaping


def test_right_to_left_detection():
    assert pdf._is_rtl("مرحبا بالعالم") and pdf._is_rtl("שלום עולם") and pdf._is_rtl("كلمة word كلمة كلمة")
    assert not pdf._is_rtl("Hello world") and not pdf._is_rtl("Hello مرحبا world again") and not pdf._is_rtl("123")
    mostly_latin = "استخدمنا Kubernetes و Docker"
    assert not pdf._is_rtl(mostly_latin) and pdf._is_rtl(mostly_latin, rtl_language=True)
    assert not pdf._is_rtl("plain english", rtl_language=True)           # no RTL letters, nothing to flip


def w5(s):
    return 5.0 * len(s)


def test_wrap_respects_the_width():
    text = "The quick brown fox jumps over the lazy dog " * 20
    lines = pdf._wrap(text.strip(), 200, 300, w5)
    assert " ".join(lines) == text.strip()
    assert w5(lines[0]) <= 200 and all(w5(ln) <= 300 for ln in lines)
    assert pdf._wrap("", 100, 100, w5) == [] and pdf._wrap("one", 100, 100, w5) == ["one"]


def test_wrap_cuts_words_longer_than_a_line():
    lines = pdf._wrap("ab " + "x" * 101 + " cd", 100, 100, w5)
    assert lines == ["ab", "x" * 20, "x" * 20, "x" * 20, "x" * 20, "x" * 20, "x" + " cd"]
    assert all(w5(ln) <= 100 for ln in lines)


def test_cutting_a_huge_token_stays_linear():
    measured = []

    def w(s):
        measured.append(len(s))
        return 5.0 * len(s)

    lines = pdf._wrap("x" * 50_000, 100, 100, w)                # a Thai/Khmer paragraph without spaces looks like this
    assert "".join(lines) == "x" * 50_000 and all(len(ln) <= 20 for ln in lines)
    assert sum(measured) < 50_000 * 100                         # re-measuring the remainder each time would be ~60M


def test_wrap_breaks_cjk_between_characters_and_keeps_punctuation_off_line_starts():
    lines = pdf._wrap("你好世界。你好吗？再见！", 40, 40, w5)
    assert "".join(lines) == "你好世界。你好吗？再见！"
    assert all(w5(ln) <= 40 for ln in lines)
    assert not any(ln[0] in "。？！，、" for ln in lines)


def test_wrap_never_splits_a_cluster():
    word = "a" + ACUTE + "b" * 30                                # a + combining acute stays together
    lines = pdf._wrap(word, 20, 20, w5)
    assert "".join(lines) == word and not any(ln.startswith(ACUTE) for ln in lines)
    assert pdf._glued("a", ACUTE) and pdf._glued("a", ZWJ) and pdf._glued("a", "。") and pdf._glued("「", "a")
    assert pdf._glued("เ", "ก") and pdf._glued("ไ", "ก")                 # Thai leading vowels stay with their consonant
    assert not pdf._glued("-", "a") and not pdf._glued("a", "b")


def test_font_catalogue_lookup(tmp_path):
    names = ["segoeui.ttf", "segoeuib.ttf", "notosansdevanagari-regular.ttf", "notosansdevanagari-bold.ttf",
             "notosanscjksc-regular.otf", "notosanstamil-regular.ttf", "nirmala.ttc", "arial bold.ttf", "arial.ttf"]
    idx = {n: tmp_path / n for n in names}
    fam, = pdf._families("segoeui.ttf|segoeuib.ttf", idx)
    assert fam.regular == (idx["segoeui.ttf"], 0) and fam.bold == (idx["segoeuib.ttf"], 0)
    assert list(pdf._families("missing.ttf", idx)) == []
    arial, = pdf._families("arial.ttf|arialbd.ttf,arial bold.ttf", idx)
    assert arial.bold == (idx["arial bold.ttf"], 0)             # alternative file names
    wild = [f.regular[0].name for f in pdf._families("notosans*-regular.ttf", idx)]
    assert wild == ["notosansdevanagari-regular.ttf", "notosanstamil-regular.ttf"]    # sorted, CJK builds excluded
    face, = pdf._families("nirmala.ttc#0", idx)
    assert face.regular == (idx["nirmala.ttc"], 0)


def test_user_font_folder_wins_over_system_fonts(tmp_path, monkeypatch):
    primary = pdf._primary()
    if not primary or primary.regular[0].suffix.lower() != ".ttf":
        pytest.skip("needs a plain .ttf font to copy")
    shutil.copy(primary.regular[0], tmp_path / pdf._PRIMARY[-1].split("|")[0])    # the catalogue's least preferred name
    try:
        monkeypatch.setenv("VT_PDF_FONT_DIR", str(tmp_path))
        pdf.clear_font_cache()
        assert pdf._primary().regular[0].parent == tmp_path
        data = pdf.render_pdf(make_job())
        assert "Hello world." in flat(pages_of(data)[0])
        assert any(f.regular[0].parent == tmp_path for f in pdf._fallbacks("en"))
    finally:
        monkeypatch.undo()
        pdf.clear_font_cache()


def test_any_font_dropped_into_the_font_folder_becomes_a_fallback(tmp_path, monkeypatch):
    # A tiny OpenType/CFF font (the flavour of Noto Sans CJK) that has only Hangul code points, drawn with Latin shapes.
    primary = pdf._primary()
    if not primary or primary.regular[0].suffix.lower() != ".ttf":
        pytest.skip("needs a plain .ttf font to borrow outlines from")
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.t2CharStringPen import T2CharStringPen
    from fontTools.ttLib import TTFont
    with TTFont(primary.regular[0]) as src:
        glyphs, cmap, upem = src.getGlyphSet(), src.getBestCmap(), src["head"].unitsPerEm
        asc, desc = src["hhea"].ascent, src["hhea"].descent
        shapes = {".notdef": cmap[0x20], "space": cmap[0x20], "g0": cmap[ord("A")], "g1": cmap[ord("B")]}
        strings = {}
        for name, source in shapes.items():
            pen = T2CharStringPen(glyphs[source].width, glyphs)
            glyphs[source].draw(pen)
            strings[name] = pen.getCharString()
        widths = {name: (glyphs[source].width, 0) for name, source in shapes.items()}
    fb = FontBuilder(upem, isTTF=False)
    fb.setupGlyphOrder(list(shapes))
    fb.setupCharacterMap({0x20: "space", 0xAC00: "g0", 0xAC01: "g1"})
    fb.setupCFF("Synth-Regular", {"FullName": "Synth Regular", "FamilyName": "Synth"}, strings, {})
    fb.setupHorizontalMetrics(widths)
    fb.setupHorizontalHeader(ascent=asc, descent=desc)
    fb.setupNameTable({"familyName": "Synth", "styleName": "Regular"})
    fb.setupOS2(sTypoAscender=asc, sTypoDescender=desc, usWinAscent=asc, usWinDescent=-desc)
    fb.setupPost()
    fb.save(tmp_path / "synth.otf")
    try:
        monkeypatch.setenv("VT_PDF_FONT_DIR", str(tmp_path))
        pdf.clear_font_cache()
        plan = pdf._plan({chr(0xAC00), chr(0xAC01)}, "en")
        assert [f.regular[0].name for f in plan.fallbacks] == ["synth.otf"] and not plan.missing
        text = flat(pages_of(pdf.render_pdf(make_job([seg(0, 0, 1, "Latin " + chr(0xAC00) + chr(0xAC01) + " end")])))[0])
        assert "Latin " + chr(0xAC00) + chr(0xAC01) + " end" in text and "?" not in text
    finally:
        monkeypatch.undo()
        pdf.clear_font_cache()


def test_fonts_whose_licence_forbids_embedding_are_not_used(tmp_path):
    primary = pdf._primary()
    if not primary or primary.regular[0].suffix.lower() != ".ttf":
        pytest.skip("needs a plain .ttf font to copy")
    from fontTools.ttLib import TTFont
    for flag, name in ((0x0002, "restricted.ttf"), (0x0100, "nosubset.ttf"), (0x0004, "preview.ttf")):
        font = TTFont(primary.regular[0])
        font["OS/2"].fsType = flag
        font.save(tmp_path / name)
        font.close()
    assert pdf._cmap(tmp_path / "restricted.ttf", 0) == frozenset() and pdf._cmap(tmp_path / "nosubset.ttf", 0) == frozenset()
    assert 0x41 in pdf._cmap(tmp_path / "preview.ttf", 0)           # "preview & print" embedding is fine for a PDF


def test_collection_faces_are_found_by_number_or_name():
    ttc = next((p for p in pdf._index(False).values() if p.name.lower() == "nirmala.ttc"), None)
    if not ttc or not pdf.HAS_TTC_INDEX:
        pytest.skip("no Nirmala UI collection on this machine")
    assert pdf._face_no(ttc, "1") == 1 and pdf._face_no(ttc, "bold") == 1 and pdf._face_no(ttc, "") == 0
    assert pdf._face_no(ttc, "nosuchface") == 0


def test_collection_faces_need_a_new_enough_fpdf2(monkeypatch, tmp_path):
    idx = {"x.ttc": tmp_path / "x.ttc"}
    monkeypatch.setattr(pdf, "_face_no", lambda path, hint: int(hint) if hint.isdigit() else 0)
    monkeypatch.setattr(pdf, "HAS_TTC_INDEX", False)
    assert pdf._locate("x.ttc#2", idx) is None and pdf._locate("x.ttc#0", idx) == (idx["x.ttc"], 0)
    assert pdf._locate("x.ttc#2,x.ttc", idx) == (idx["x.ttc"], 0)       # falls through to the next alternative
    monkeypatch.setattr(pdf, "HAS_TTC_INDEX", True)
    assert pdf._locate("x.ttc#2", idx) == (idx["x.ttc"], 2)


def test_font_files_are_released_after_rendering(tmp_path, monkeypatch):
    primary = pdf._primary()
    if not primary or primary.regular[0].suffix.lower() != ".ttf":
        pytest.skip("needs a plain .ttf font to copy")
    font = tmp_path / pdf._PRIMARY[-1].split("|")[0]
    shutil.copy(primary.regular[0], font)
    try:
        monkeypatch.setenv("VT_PDF_FONT_DIR", str(tmp_path))
        pdf.clear_font_cache()
        assert "Hello" in flat(pages_of(pdf.render_pdf(make_job([seg(0, 0, 1, "Hello مرحبا")])))[0])
        font.unlink()                                                  # Windows refuses while a handle is still open
    finally:
        monkeypatch.undo()
        pdf.clear_font_cache()


def test_concurrent_exports_do_not_interfere():
    jobs = [make_job([seg(0, 0, 1, SAMPLES[n])], title=n) for n in ("hindi", "arabic", "chinese", "russian")]
    jobs.append(long_job(60, seed=9))
    expected = [[flat(t) for t in pages_of(pdf.render_pdf(j))] for j in jobs]
    results, errors = [None] * len(jobs), []

    def run(i):
        try:
            results[i] = [flat(t) for t in pages_of(pdf.render_pdf(jobs[i]))]
        except Exception as exc:  # noqa
            errors.append(exc)

    threads = [threading.Thread(target=run, args=(i,)) for i in range(len(jobs))]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert not errors and results == expected


def test_formats_dispatches_pdf():
    body, mime, ext = formats.render(make_job(), "pdf")
    assert (mime, ext) == ("application/pdf", "pdf") and body.startswith(b"%PDF-")
