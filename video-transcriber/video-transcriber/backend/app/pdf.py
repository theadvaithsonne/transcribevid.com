"""PDF transcript export: render_pdf(job) -> bytes (A4, real selectable text, any script).

Fonts are looked up on the machine (catalogue below): one primary face for Latin/Greek/Cyrillic/Hebrew/Arabic
plus script fallbacks that are registered only when the transcript needs them (a CJK font costs ~0.3 s to load).
Characters no installed font can draw are replaced by '?' before layout, so rendering cannot fail on odd input;
with no usable font at all the built-in Helvetica is used (Latin-1 only). To add or override fonts, drop
.ttf/.otf/.ttc files into backend/fonts/ or into the folder named by the VT_PDF_FONT_DIR environment variable.
"""
from __future__ import annotations

import fnmatch
import logging
import os
import re
import unicodedata
from collections import Counter
from functools import lru_cache
from inspect import signature
from pathlib import Path
from typing import NamedTuple

from fontTools.ttLib import TTCollection, TTFont
from fpdf import FPDF
from fpdf.enums import TextMode

from .formats import fmt_ts, paragraphs

__all__ = ["render_pdf", "clear_font_cache"]
log = logging.getLogger("vt.pdf")


class _QuietSubsetter(logging.Filter):
    """fontTools warns about every exotic table it drops (Segoe UI's 'MERG') on each export."""

    def filter(self, record):
        return "don't know how to subset" not in record.getMessage()


logging.getLogger("fontTools.subset").addFilter(_QuietSubsetter())

BACKEND_DIR = Path(__file__).resolve().parent.parent
try:
    import uharfbuzz  # noqa: F401 - Arabic, Indic, ... need HarfBuzz to be drawn correctly (joined, reordered)
    HAS_SHAPING = True
except (ImportError, OSError):
    HAS_SHAPING = False
HAS_TTC_INDEX = "collection_font_number" in signature(FPDF.add_font).parameters

# --------------------------------------------------------------------------- page design (points)
PAGE_W, PAGE_H = 595.28, 841.89
MARGIN = 62
TEXT_W = PAGE_W - 2 * MARGIN
BOTTOM = PAGE_H - 66                    # last usable y of the body (the footer lives below it)
BODY, LEAD, PARA_GAP = 10.5, 16.5, 9
STAMP, STAMP_GAP = 9, 6                 # timestamp size, space after it
INK, MUTED, ACCENT = (31, 35, 40), (107, 114, 128), (37, 99, 235)
RULE, TILE = (222, 226, 231), (244, 246, 249)
SANS = "vt-sans"

_LANGUAGES = dict(p.split(" ", 1) for p in (
    "en English|zh Chinese|de German|es Spanish|ru Russian|ko Korean|fr French|ja Japanese|pt Portuguese|tr Turkish|"
    "pl Polish|ca Catalan|nl Dutch|ar Arabic|sv Swedish|it Italian|id Indonesian|hi Hindi|fi Finnish|vi Vietnamese|"
    "he Hebrew|uk Ukrainian|el Greek|ms Malay|cs Czech|ro Romanian|da Danish|hu Hungarian|ta Tamil|no Norwegian|"
    "th Thai|ur Urdu|hr Croatian|bg Bulgarian|lt Lithuanian|la Latin|mi Maori|ml Malayalam|cy Welsh|sk Slovak|"
    "te Telugu|fa Persian|lv Latvian|bn Bengali|sr Serbian|az Azerbaijani|sl Slovenian|kn Kannada|et Estonian|"
    "mk Macedonian|br Breton|eu Basque|is Icelandic|hy Armenian|ne Nepali|mn Mongolian|bs Bosnian|kk Kazakh|"
    "sq Albanian|sw Swahili|gl Galician|mr Marathi|pa Punjabi|si Sinhala|km Khmer|sn Shona|yo Yoruba|so Somali|"
    "af Afrikaans|oc Occitan|ka Georgian|be Belarusian|tg Tajik|sd Sindhi|gu Gujarati|am Amharic|yi Yiddish|lo Lao|"
    "uz Uzbek|fo Faroese|ht Haitian Creole|ps Pashto|tk Turkmen|nn Nynorsk|mt Maltese|sa Sanskrit|lb Luxembourgish|"
    "my Myanmar|bo Tibetan|tl Tagalog|mg Malagasy|as Assamese|tt Tatar|haw Hawaiian|ln Lingala|ha Hausa|ba Bashkir|"
    "jw Javanese|su Sundanese|yue Cantonese").split("|"))

# --------------------------------------------------------------------------- text hygiene
# Controls, lone surrogates, noncharacters and invisible format characters (bidi marks, ZWSP, variation selectors...).
# ZWNJ/ZWJ (U+200C/D) stay: they matter for Persian and Indic shaping; they are dropped later if no font has them.
_NONCHARS = "".join(chr(p * 0x10000 + n) for p in range(1, 17) for n in (0xFFFE, 0xFFFF))
_INVISIBLE = re.compile(
    "[\x00-\x08\x0e-\x1f\x7f-\x84\x86-\x9f\ud800-\udfff"
    "\u00ad\u034f\u061c\u115f\u1160\u17b4\u17b5\u180b-\u180f\u200b\u200e\u200f\u202a-\u202e\u2060-\u206f"
    "\u3164\ufdd0-\ufdef\ufe00-\ufe0f\ufeff\uffa0\ufff0-\ufffb\ufffe\uffff"
    "\U0001d173-\U0001d17a\U000e0000-\U000e0fff" + _NONCHARS + "]")
# Scripts that need HarfBuzz (joining, reordering, mark placement), and those written right to left.
_COMPLEX = re.compile("[\u0300-\u036f\u0590-\u109f\u1780-\u18af\u1ab0-\u1bff\u1dc0-\u1dff\u20d0-\u20ff"
                      "\ua980-\ua9df\uaa60-\uaa7f\ufb1d-\ufdff\ufe20-\ufe2f\ufe70-\ufeff]")
_RTL = re.compile("[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]")
_RTL_LANGUAGES = frozenset("ar he fa ur yi ps sd ug dv ckb".split())
_VANISH = {"Mn", "Mc", "Me", "Cf"}      # unsupported marks and format characters disappear instead of showing '?'
_LATIN1 = str.maketrans({"\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u2013": "-", "\u2014": "-",
                         "\u2026": "...", "\u2022": "*", "\u00a0": " "})


def _clean(value) -> str:
    """One line of NFC text: no controls, invisibles or odd whitespace, single spaces."""
    s = unicodedata.normalize("NFC", "" if value is None else str(value))
    return " ".join(_INVISIBLE.sub("", s).split())


def _is_rtl(text: str, rtl_language: bool = False) -> bool:
    """Paragraph direction: right to left when the text has RTL letters and either the transcript's language is
    an RTL one (Latin brand names inside Arabic sentences must not flip them) or those letters are the majority."""
    if not _RTL.search(text):
        return False
    if rtl_language:
        return True
    n = 0
    for c in text:
        d = unicodedata.bidirectional(c)
        n += (d in ("R", "AL")) - (d == "L")
    return n > 0


# --------------------------------------------------------------------------- line breaking
_CJK_RANGES = "\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef\U00020000-\U0003ffff"
_OPEN = ("([{<\u2018\u201c\uff08\uff3b\uff5b\u3008\u300a\u300c\u300e\u3010\u3014\u3016"
         "\u0e40\u0e41\u0e42\u0e43\u0e44\u0ec0\u0ec1\u0ec2\u0ec3\u0ec4")      # ... and Thai/Lao vowels written before their consonant
_CLOSE = (")]}>,.;:!?%\u2019\u201d\u2026\u3001\u3002\uff0c\uff0e\uff1a\uff1b\uff01\uff1f\uff09\uff3d\uff5d\u3009\u300b"
          "\u300d\u300f\u3011\u3015\u3017\u30fc\u30fb")
_HAS_CJK = re.compile(f"[{_CJK_RANGES}]")
_UNIT = re.compile(f"[{re.escape(_OPEN)}]*(?:[{_CJK_RANGES}]|[^{_CJK_RANGES}]+)[{re.escape(_CLOSE)}]*")
EPS = 0.01


def _tokens(text: str) -> list[tuple[str, bool]]:
    """(piece, preceded_by_space): words split on spaces and CJK runs split per character, with closing
    punctuation stuck to the character before it and opening brackets to the one after."""
    out = []
    for word in text.split(" "):
        if word and _HAS_CJK.search(word):
            parts = _UNIT.findall(word)
            out.append((parts[0], True))
            out.extend((p, False) for p in parts[1:])
        elif word:
            out.append((word, True))
    return out


def _glued(a: str, b: str) -> bool:
    """True when a line may not break between a and b (combining mark, joiner, punctuation that must not
    start or end a line)."""
    return unicodedata.category(b)[0] == "M" or b in "\u200c\u200d" or b in _CLOSE or a in _OPEN


def _cut(tok: str, room: float, w) -> tuple[str, str]:
    """Split an over-long word after the last character that still fits in `room` (at least one)."""
    n = len(tok)
    hi = min(n, 64)
    while hi < n and w(tok[:hi]) <= room:
        hi = min(n, hi * 2)
    lo = 1
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if w(tok[:mid]) <= room:
            lo = mid
        else:
            hi = mid - 1
    while 1 < lo < n and _glued(tok[lo - 1], tok[lo]):
        lo -= 1
    return tok[:lo], tok[lo:]


def _measure(tok: str, room: float, w, probe: int = 600) -> float:
    """w(tok); a token far longer than any line (Thai/Khmer runs without spaces) is only measured over its first
    `probe` characters once that alone overflows `room`, so cutting a huge token stays linear."""
    if len(tok) > probe:
        part = w(tok[:probe])
        if part > room + EPS:
            return part
    return w(tok)


def _wrap(text: str, first: float, width: float, w) -> list[str]:
    """Greedy line breaking of single-spaced text. `w(s)` is the rendered width of s; the first line has `first`
    of room, the others `width`. Words wider than a whole line are cut instead of overflowing."""
    space, lines, cur, cw, room = w(" "), [], "", 0.0, first
    for tok, gap in _tokens(text):
        tw = _measure(tok, room, w)
        sp = space if cur and gap else 0.0
        if cur and cw + sp + tw > room + EPS:
            lines.append(cur)
            cur, cw, room, sp = "", 0.0, width, 0.0
        while tw > room + EPS:
            head, tok = _cut(tok, room, w)
            lines.append(head)
            room, tw = width, _measure(tok, width, w)
        if tok:
            cur += (" " if sp else "") + tok
            cw += sp + tw
    if cur:
        lines.append(cur)
    return lines


def _take(left: int, fit: int, fresh: bool) -> int:
    """How many of a paragraph's `left` lines go on this page when `fit` lines are free (0 = start a new page).
    A paragraph is only split with at least two lines on each side, so no single line is stranded."""
    if left <= fit:
        return left
    take = min(fit, left - 2)
    return take if take >= 2 else (max(fit, 1) if fresh else 0)


def _paginate(counts: list[int], y: float) -> list[list[tuple]]:
    """Flow paragraphs of `counts` lines onto pages, the first page starting at height y.
    Returns, per page, chunks (paragraph, first line, number of lines, y)."""
    pages, page = [], []
    for k, n in enumerate(counts):
        i = 0
        while i < n:
            take = _take(n - i, int((BOTTOM - y) // LEAD), y <= MARGIN + EPS)
            if take:
                page.append((k, i, take, y))
                y += take * LEAD
                i += take
            if not take or i < n:
                pages.append(page)
                page, y = [], MARGIN
        y += PARA_GAP
    return pages + [page]


# --------------------------------------------------------------------------- font catalogue and discovery
# Entries are lower-case file names (alternatives separated by ','; the primary list also names the bold file after
# a '|'). 'x.ttc#2' selects face 2 of a collection, 'x.ttc#sc regular' the face whose name contains those words;
# '*' matches several files.
_PRIMARY = (
    "segoeui.ttf|segoeuib.ttf", "arial.ttf|arialbd.ttf,arial bold.ttf", "dejavusans.ttf|dejavusans-bold.ttf",
    "notosans-regular.ttf|notosans-bold.ttf", "liberationsans-regular.ttf|liberationsans-bold.ttf",
    "tahoma.ttf|tahomabd.ttf", "calibri.ttf|calibrib.ttf", "freesans.ttf|freesansbold.ttf",
    "ubuntu-r.ttf|ubuntu-b.ttf", "roboto-regular.ttf|roboto-bold.ttf", "opensans-regular.ttf|opensans-bold.ttf",
    "verdana.ttf|verdanab.ttf",
)
_SCRIPTS = (            # scripts the primary face usually lacks (Indic, Thai, Khmer, African, ...): small, cheap to probe
    "nirmala.ttc#0", "nirmala.ttf", "mangal.ttf", "leelawui.ttf", "ebrima.ttf", "gadugi.ttf", "mmrtext.ttf",
    "himalaya.ttf", "khmerui.ttf", "laouui.ttf", "iskpota.ttf", "devanagarimt.ttc", "devanagari sangam mn.ttc",
    "thonburi.ttc", "geezapro.ttc", "notosans*-regular.ttf", "notosans*-regular.otf", "lohit-*.ttf",
)
_SYMBOLS = (
    "seguisym.ttf", "seguiemj.ttf", "apple symbols.ttf", "notosanssymbols-regular.ttf",
    "notosanssymbols2-regular.ttf", "notoemoji-regular.ttf", "symbola.ttf", "dejavusans.ttf",
)
_CJK = {                # by language, so Han characters get the matching regional glyphs
    "zh": ("msyh.ttc", "simsun.ttc", "msjh.ttc", "simhei.ttf", "pingfang.ttc#sc regular", "hiragino sans gb.ttc",
           "stheiti light.ttc", "songti.ttc", "notosanscjk-regular.ttc#sc regular", "notosanscjksc-regular.otf",
           "sourcehansanssc-regular.otf", "wqy-microhei.ttc", "wqy-zenhei.ttc", "droidsansfallbackfull.ttf"),
    "ja": ("yugothr.ttc", "meiryo.ttc", "msgothic.ttc", "hiragino sans w3.ttc", "notosanscjk-regular.ttc#jp regular",
           "notosanscjkjp-regular.otf", "ipag.ttf", "takaogothic.ttf"),
    "ko": ("malgun.ttf", "gulim.ttc", "batang.ttc", "applesdgothicneo.ttc", "applegothic.ttf",
           "notosanscjk-regular.ttc#kr regular", "notosanscjkkr-regular.otf", "nanumgothic.ttf", "undotum.ttf"),
}
_RARE = ("sylfaen.ttf", "seguihis.ttf", "monbaiti.ttf", "msyi.ttf", "javatext.ttf", "phagspa.ttf", "taile.ttf",
         "ntailu.ttf")
_WIDE = (               # broad but plain: last resorts
    "tahoma.ttf", "arial unicode.ttf", "arialuni.ttf", "micross.ttf", "freesans.ttf", "freeserif.ttf", "unifont.ttf",
    "unifont.otf",
)
_ASCII = frozenset(range(0x20, 0x7F))


class _Family(NamedTuple):
    regular: tuple          # (path, face number)
    bold: tuple | None = None


def _user_dirs() -> list[Path]:
    return [Path(p) for p in os.environ.get("VT_PDF_FONT_DIR", "").split(os.pathsep) if p] + [BACKEND_DIR / "fonts"]


def _system_dirs() -> list[Path]:
    try:
        home = Path.home()
    except RuntimeError:                                # no HOME in some containers
        home = Path("/nonexistent")
    local = os.environ.get("LOCALAPPDATA")
    win = Path(os.environ.get("SystemRoot") or os.environ.get("WINDIR") or r"C:\Windows")
    return ([Path(local) / "Microsoft" / "Windows" / "Fonts"] if local else []) + [
        win / "Fonts", home / "Library" / "Fonts", Path("/Library/Fonts"), Path("/System/Library/Fonts/Supplemental"),
        Path("/System/Library/Fonts"), home / ".fonts", home / ".local" / "share" / "fonts",
        Path("/usr/local/share/fonts"), Path("/usr/share/fonts")]


@lru_cache(maxsize=2)
def _index(user: bool) -> dict[str, Path]:
    """lower-case file name -> path for every font file in the user or system folders (first folder wins)."""
    found: dict[str, Path] = {}
    for d in _user_dirs() if user else _system_dirs():
        for root, _, files in os.walk(d):
            for f in files:
                if f.lower().endswith((".ttf", ".otf", ".ttc", ".otc")):
                    found.setdefault(f.lower(), Path(root, f))
    return found


@lru_cache(maxsize=256)
def _cmap(path: Path, face: int) -> frozenset:
    """Code points a font file can draw (empty when it cannot be read or its licence forbids embedding/subsetting)."""
    try:
        with TTFont(path, fontNumber=face, lazy=True) as font:
            if font["OS/2"].fsType & 0x0102:             # fsType bits: restricted licence / subsetting prohibited
                return frozenset()
            return frozenset(font.getBestCmap() or ())
    except Exception:  # noqa - a broken font file must only cost us that font
        return frozenset()


@lru_cache(maxsize=256)
def _face_no(path: Path, hint: str) -> int:
    """Face number inside a collection: a digit is used as is, a word is matched against the face names."""
    if hint.isdigit():
        return int(hint)
    if hint:
        try:
            for i, font in enumerate(TTCollection(path, lazy=True).fonts):
                names = font["name"]
                label = f"{names.getBestFamilyName()} {names.getBestSubFamilyName()}".lower()
                if re.search(rf"\b{re.escape(hint)}\b", label):
                    return i
        except Exception:  # noqa
            pass
    return 0


def _locate(spec: str, idx: dict[str, Path]):
    for alt in spec.split(","):
        name, _, hint = alt.partition("#")
        if name in idx:
            face = _face_no(idx[name], hint)
            if not face or HAS_TTC_INDEX:                  # older fpdf2 can only open the first face
                return idx[name], face
    return None


def _families(entry: str, idx: dict[str, Path]):
    reg, _, bold = entry.partition("|")
    if "*" in reg:
        for name in sorted(fnmatch.filter(idx, reg)):
            if "cjk" not in name:                          # CJK builds are picked by language instead
                yield _Family((idx[name], 0))
    elif found := _locate(reg, idx):
        yield _Family(found, _locate(bold, idx) if bold else None)


@lru_cache(maxsize=1)
def _primary() -> _Family | None:
    """First catalogue face (your folders before the system's) that has every printable ASCII character."""
    for user in (True, False):
        for entry in _PRIMARY:
            for fam in _families(entry, _index(user)):
                if _ASCII <= _cmap(*fam.regular):
                    bold = fam.bold if fam.bold and _ASCII <= _cmap(*fam.bold) else None
                    return _Family(fam.regular, bold)
    return None


def _coverage(fam: _Family) -> frozenset:
    """What the primary face can draw in both weights (the title is bold)."""
    cov = _cmap(*fam.regular)
    return cov & _cmap(*fam.bold) if fam.bold else cov


def _fallbacks(lang: str):
    """Candidate fallback families, best first: your own fonts, then scripts, symbols/CJK, wide-coverage fonts."""
    for path in sorted(_index(True).values()):
        yield _Family((path, 0))
    first = "zh" if lang == "yue" else lang
    cjk = tuple(e for k in sorted(_CJK, key=lambda k: k != first) for e in _CJK[k])
    system = _index(False)
    for group in (_SCRIPTS, *((cjk, _SYMBOLS) if first in _CJK else (_SYMBOLS, cjk)), _RARE, _WIDE):
        for entry in group:
            yield from _families(entry, system)


class _Plan(NamedTuple):
    primary: _Family | None
    fallbacks: tuple
    missing: frozenset      # code points none of the chosen fonts can draw


def _plan(chars: set, lang: str, fallbacks: bool = True) -> _Plan:
    """The fonts a text needs: the primary one plus just enough fallbacks (probed lazily) to cover the rest."""
    prim = _primary()
    if prim is None:
        return _Plan(None, (), frozenset())
    wanted = {ord(c) for c in chars} - _coverage(prim)
    need, picked = set(wanted), []
    if need and fallbacks:
        for fam in _fallbacks(lang):
            if fam.regular == prim.regular or any(fam.regular == p.regular for p, _ in picked):
                continue
            if hit := need & _cmap(*fam.regular):
                picked.append((fam, len(hit)))
                need -= hit
                if not need:
                    break
        covered = wanted - need
        for item in sorted(picked, key=lambda p: p[1]):          # a font loaded for a stray character that another
            rest = [_cmap(*f.regular) for f, _ in picked if f is not item[0]]   # picked font also has is dead weight
            if all(any(cp in cm for cm in rest) for cp in covered):
                picked.remove(item)
    return _Plan(prim, tuple(f for f, _ in picked), frozenset(need))


def clear_font_cache() -> None:
    """Forget the discovered fonts (call after changing VT_PDF_FONT_DIR or adding font files)."""
    for fn in (_index, _cmap, _face_no, _primary):
        fn.cache_clear()


def _translator(plan: _Plan):
    """str -> str without what the planned fonts cannot draw ('?' for letters, nothing for marks)."""
    if plan.primary is None:                                         # built-in Helvetica: Latin-1 only
        return lambda s: s.translate(_LATIN1).encode("latin-1", "replace").decode("latin-1")
    table = {cp: "" if unicodedata.category(chr(cp)) in _VANISH else "?" for cp in plan.missing}
    return (lambda s: " ".join(s.translate(table).split())) if table else (lambda s: s)


# --------------------------------------------------------------------------- job -> content
class _Content(NamedTuple):
    title: str
    meta: str
    stats: list             # [(label, value)]
    paras: list             # [(timestamp, text)]
    lang: str
    chars: set              # non-ASCII characters used anywhere


def _num(x, default=None, low=-1e9, high=1e9):
    """x as a float within [low, high]; `default` for anything that is not a finite number."""
    try:
        x = float(x)
    except (TypeError, ValueError, OverflowError):
        return default
    return min(max(x, low), high) if x == x and abs(x) != float("inf") else default


def _hms(sec: float) -> str:
    s = int(max(sec, 0))
    return f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}"


def _dict(x) -> dict:
    return x if isinstance(x, dict) else {}


def _prepare(job: dict) -> _Content:
    """Everything the PDF will show, as clean strings (fonts are decided afterwards)."""
    raw = job.get("segments")
    segs = [{"start": _num(s.get("start"), 0.0, 0), "end": _num(s.get("end"), 0.0, 0), "text": _clean(s.get("text"))}
            for s in (raw if isinstance(raw, (list, tuple)) else []) if isinstance(s, dict)]
    segs = [s for s in segs if s["text"]]
    title = (_clean(job.get("title")) or _clean(job.get("filename")) or "Transcript")[:300]
    language = _clean(job.get("language"))[:40]
    lang = re.split(r"[-_]", language.lower())[0]
    opts, stats = _dict(job.get("options")), _dict(job.get("stats"))
    duration = _num(job.get("duration"), None, 0) or max((s["end"] for s in segs), default=0) or None

    meta = [f"Language: {_LANGUAGES.get(lang, language)}" if language else "",
            f"Duration: {_hms(duration)}" if duration else "",
            f"Model: {_clean(opts.get('model'))[:60]}" if opts.get("model") else "",
            "Translated to English" if opts.get("task") == "translate" else ""]
    summary = []
    if stats:
        words, conf = _num(stats.get("word_count"), None, 0), _num(stats.get("avg_confidence"), None, 0, 100)
        if words is not None:
            summary.append(("Words", f"{int(words):,}"))
        if duration:
            summary.append(("Duration", _hms(duration)))
        if conf is not None:
            summary.append(("Avg. confidence", f"{conf if conf > 1 else conf * 100:.0f}%"))

    paras = [(f"[{fmt_ts(p[0]['start'])}]", " ".join(s["text"] for s in p)) for p in paragraphs(segs)]
    meta_line = "  \u00b7  ".join(m for m in meta if m)
    chars = set(title + meta_line + "".join(t for _, t in paras))
    return _Content(title, meta_line, summary, paras, lang, {c for c in chars if c > "\x7f"})


# --------------------------------------------------------------------------- document
class _Doc(FPDF):
    """A4 document with running header (title, pages 2+) and footer ('Page X of Y'); lays out its own lines."""

    def __init__(self, plan: _Plan, running: str, rtl_language: bool = False):
        super().__init__(unit="pt", format="A4")
        self.set_auto_page_break(False)
        self.set_margins(MARGIN, MARGIN, MARGIN)
        self.c_margin = 0
        self.render_color_fonts = False          # emoji fonts: draw their plain outlines, not colour layers
        self.running, self.sans, self.total = running, "helvetica", 1
        self.rtl_language = rtl_language
        self.title_align = ("R", True) if _is_rtl(running, rtl_language) else ("L", False)   # (alignment, direction)
        self._shaped, self._widths, self.faces = (False, None), {}, {}      # faces: font name -> code points it has
        self._header = None                                                  # the shortened running title
        if plan.primary:
            self.sans = SANS
            self._register(SANS, plan.primary.regular, "")
            self._register(SANS, plan.primary.bold or plan.primary.regular, "B")
            self.faces[SANS] = _cmap(*plan.primary.regular)
            for i, fam in enumerate(plan.fallbacks):
                self._register(f"vt-fb{i}", fam.regular, "")
                self.faces[f"vt-fb{i}"] = _cmap(*fam.regular)
            if plan.fallbacks:                                            # regular faces also serve bold text
                self.set_fallback_fonts(list(self.faces), exact_match=False)
        self.ellipsis = "\u2026" if plan.primary and 0x2026 in _coverage(plan.primary) else "..."

    def _register(self, name: str, face: tuple, style: str):
        path, no = face
        self.add_font(name, style, str(path), **({"collection_font_number": no} if no else {}))

    def release_fonts(self):
        for font in self.fonts.values():
            try:
                font.close()
            except Exception:  # noqa - core fonts have nothing to close
                pass

    # -- text primitives
    def shaping(self, on: bool, rtl: bool | None = None):
        """Switch HarfBuzz shaping: required for Arabic/Indic/..., slow and bulky for everything else."""
        state = (on and HAS_SHAPING, rtl if on else None)
        if state != self._shaped:
            self._shaped = state
            if state[0]:
                self.set_text_shaping(True, direction=None if rtl is None else "rtl" if rtl else "ltr")
            else:
                self.set_text_shaping(False)

    def measure(self, s: str) -> float:
        self.shaping(bool(_COMPLEX.search(s)))
        return self.get_string_width(s)

    def measurer(self, font: str):
        """measure() with a cache; only valid while `font` is the selected body font."""
        cache = self._widths.setdefault(font, {})

        def width(s: str) -> float:
            if len(s) > 48:
                return self.measure(s)
            w = cache.get(s)
            if w is None:
                w = cache[s] = self.measure(s)
            return w
        return width

    def base_font(self, text: str) -> str:
        """The face to set a paragraph in. When most of its letters are not in the primary face (Hindi, Chinese, ...)
        that is the fallback covering most of them: one run of text instead of a font switch at every space, which
        fpdf2 would otherwise take from the primary face (slow, and the Latin words match the script better too)."""
        if len(self.faces) < 2 or text.isascii():
            return self.sans
        counts = Counter(text.replace(" ", ""))
        foreign = {ch: k for ch, k in counts.items() if ord(ch) not in self.faces[self.sans]}
        if 2 * sum(foreign.values()) < sum(counts.values()):
            return self.sans
        best, top = self.sans, 0
        for name, cmap in self.faces.items():
            n = sum(k for ch, k in foreign.items() if ord(ch) in cmap)
            if n > top:
                best, top = name, n
        return best

    def put(self, text: str, x: float, y: float, w: float, h: float, align: str = "L", rtl: bool | None = None):
        self.shaping(bool(_COMPLEX.search(text)), rtl)
        self.set_xy(x, y)
        # fpdf2 skips re-selecting a font it believes the page already has, but a coloured line that starts in a
        # fallback font is wrapped in q...Q, which silently undoes that selection: the next line would come out in
        # the previous font (tofu). Selecting the font on every line removes the dependency on that bookkeeping.
        self.current_font_is_set_on_page = False
        self.cell(w, h, text, align=align)

    def look(self, bold: bool, size: float, color: tuple, font: str | None = None):
        self.set_font(font or self.sans, "B" if bold else "", size)
        self.set_text_color(*color)

    def shorten(self, text: str, w: float) -> str:
        """text cut with an ellipsis so that it fits w in the current font."""
        if self.measure(text) <= w:
            return text
        lo, hi = 0, len(text)
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if self.measure(text[:mid].rstrip() + self.ellipsis) <= w:
                lo = mid
            else:
                hi = mid - 1
        return text[:lo].rstrip() + self.ellipsis

    def rule(self, y: float, width: float = 0.5):
        self.set_draw_color(*RULE)
        self.set_line_width(width)
        self.line(MARGIN, y, MARGIN + TEXT_W, y)

    # -- page furniture (fpdf2 calls these from add_page() / output())
    def header(self):
        if self.page_no() > 1:
            self.look(False, 8.5, MUTED)
            if self._header is None:
                self._header = self.shorten(self.running, TEXT_W)
            self.put(self._header, MARGIN, 30, TEXT_W, 12, *self.title_align)
            self.rule(48)

    def footer(self):
        self.shaping(False)
        self.rule(PAGE_H - 52)
        self.look(False, 8, MUTED)
        self.put("TranscribeVid - transcribevid.com", MARGIN, PAGE_H - 42, TEXT_W / 2, 10)
        self.put(f"Page {self.page_no()} of {self.total}", MARGIN + TEXT_W / 2, PAGE_H - 42, TEXT_W / 2, 10, "R")

    # -- content
    def front_matter(self, title: str, meta: str, stats: list) -> float:
        """Title, metadata line and summary tiles; returns the y where the transcript starts."""
        y = MARGIN
        font = self.base_font(title)
        self.look(font == self.sans, 22, INK, font)
        if font != self.sans:                         # no bold face for this script: thicken the outlines instead
            self.set_draw_color(*INK)
            self.set_line_width(0.7)
            self.text_mode = TextMode.FILL_STROKE
        lines = _wrap(title, TEXT_W, TEXT_W, self.measure)
        if len(lines) > 3:
            lines = lines[:2] + [self.shorten(" ".join(lines[2:]), TEXT_W)]
        for line in lines:
            self.put(line, MARGIN, y, TEXT_W, 27, *self.title_align)
            y += 27
        self.text_mode = TextMode.FILL
        if meta:
            self.look(False, 9.5, MUTED)
            self.put(self.shorten(meta, TEXT_W), MARGIN, y + 3, TEXT_W, 14, "L", False)
            y += 17
        if stats:
            y += 14
            col = TEXT_W / len(stats)
            self.set_fill_color(*TILE)
            self.rect(MARGIN, y, TEXT_W, 46, style="F", round_corners=True, corner_radius=6)
            for i, (label, value) in enumerate(stats):
                x = MARGIN + i * col + 16
                self.look(False, 7.5, MUTED)
                self.put(label.upper(), x, y + 8, col - 24, 10)
                self.look(True, 15, INK)
                self.put(value, x, y + 20, col - 24, 20)
            y += 46
        y += 18
        self.rule(y, 0.6)
        return y + 20

    def new_page(self):
        self.add_page()
        self.look(False, BODY, INK)

    def transcript(self, paras: list, y: float):
        """Paragraphs of '[mm:ss] text' flowing over as many pages as needed. They are laid out completely before
        anything is drawn, so the page count for the footers is known."""
        self.look(True, STAMP, ACCENT)
        self.shaping(False)
        stamp_w = {ts: self.get_string_width(ts) for ts, _ in paras}
        blocks = []
        for ts, text in paras:
            font = self.base_font(text)
            self.look(False, BODY, INK, font)
            lines = _wrap(text, TEXT_W - stamp_w[ts] - STAMP_GAP, TEXT_W, self.measurer(font))
            blocks.append((ts, _is_rtl(text, self.rtl_language), font, lines))
        pages = _paginate([len(b[3]) for b in blocks], y)
        self.total = len(pages)
        if not blocks:
            self.look(False, BODY, MUTED)
            self.put("No speech was detected in this recording.", MARGIN, y, TEXT_W, LEAD)
        for n, page in enumerate(pages):
            if n:
                self.new_page()
            for k, first, count, y in page:
                ts, rtl, font, lines = blocks[k]
                self.look(False, BODY, INK, font)
                for j in range(first, first + count):
                    skip = 0
                    if j == 0:                                   # the timestamp starts the paragraph's first line
                        skip = stamp_w[ts] + STAMP_GAP
                        self.look(True, STAMP, ACCENT)
                        x = MARGIN + TEXT_W - stamp_w[ts] if rtl else MARGIN
                        self.put(ts, x, y + 0.3 * (BODY - STAMP), stamp_w[ts], LEAD)   # same baseline as the body
                        self.look(False, BODY, INK, font)
                    self.put(lines[j], MARGIN + (0 if rtl else skip), y, TEXT_W - skip, LEAD, "R" if rtl else "L", rtl)
                    y += LEAD


def _build(c: _Content, plan: _Plan) -> bytes:
    fix = _translator(plan)
    title, meta = fix(c.title) or "Transcript", fix(c.meta)
    doc = _Doc(plan, title, c.lang in _RTL_LANGUAGES)
    try:
        doc.set_title(c.title)
        doc.set_creator("TranscribeVid (transcribevid.com)")
        doc.add_page()
        y = doc.front_matter(title, meta, c.stats)
        doc.transcript([(ts, t) for ts, text in c.paras if (t := fix(text))], y)
        return bytes(doc.output())
    finally:
        doc.release_fonts()


def render_pdf(job: dict) -> bytes:
    """Render a finished job (title, filename, language, duration, options, stats, segments) as a PDF.
    Never raises on odd input: unsupported characters become '?' and, if a font misbehaves, simpler fonts are tried."""
    try:
        c = _prepare(job if isinstance(job, dict) else {})
    except Exception:  # noqa - a job we cannot read still gets a (blank) document
        log.warning("PDF export could not read the job; writing an empty transcript", exc_info=True)
        c = _prepare({})
    try:
        plan = _plan(c.chars, c.lang)
    except Exception:  # noqa - font discovery must never stop an export
        log.warning("PDF export could not look for fonts; using the built-in one", exc_info=True)
        plan = _Plan(None, (), frozenset())
    attempts = [plan]
    if plan.fallbacks:
        attempts.append(_plan(c.chars, c.lang, fallbacks=False))
    if plan.primary:
        attempts.append(_Plan(None, (), frozenset()))
    for p in attempts[:-1]:
        try:
            return _build(c, p)
        except Exception:
            log.warning("PDF export failed with fonts %s; retrying with simpler ones",
                        [f.regular[0].name for f in (p.primary, *p.fallbacks)], exc_info=True)
    return _build(c, attempts[-1])
