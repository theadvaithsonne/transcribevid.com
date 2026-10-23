"""Text normalisation for comparing ASR transcripts.

``normalize(text)`` turns free text into a list of comparison tokens so that
formatting differences between recognisers (case, punctuation, "246" versus
"two hundred forty six", "O.K." versus "okay", ...) do not count as errors.

Pipeline, applied per whitespace-separated chunk and then across chunks
--------------------------------------------------------------------
1. Unicode NFKC, lower-case, curly quotes -> ``'``, all dashes -> ``-``,
   zero-width/format characters and variation selectors removed, non-ASCII decimal digits -> ASCII.  The steps are repeated
   until the text stops changing, so normalising a result again never changes it (idempotent).
2. Single-letter abbreviations lose their dots without splitting: ``U.S.`` -> ``us``,
   ``p.m.`` -> ``pm``, ``O.K.`` -> ``ok``.
3. A character scanner cuts the chunk into words, numbers and symbols.  Words start with a
   letter and continue with letters/combining marks (so Devanagari etc. survive), with
   apostrophes kept only *inside* a word (``don't``, ``o'clock``); every other punctuation
   character, including ``-``, ``/``, ``_`` and ``.``, separates tokens.  Symbols, emoji and
   combining marks or variation selectors that follow no letter (a heart emoji with its
   variation selector, a keycap digit, a stray accent) are separators too, never tokens of
   their own.
4. Numbers are spoken in English, deterministically:
   * cardinals up to 9 digits, with ``,`` thousands separators (``1,234`` and the
     Indian ``12,34,567``; comma-grouped numbers reach 999 trillion, ``1,000,000,000`` ->
     ``one billion``): ``246`` -> ``two hundred forty six`` (no "and", no hyphen);
   * ordinals ``1st 2nd 3rd 17th 21st`` -> ``first second third seventeenth twenty first``;
   * simple decimals ``3.14`` -> ``three point one four``;
   * ``%`` -> ``percent``; currency ``$5`` -> ``five dollars``, ``$1.50`` ->
     ``one dollar fifty cents``, ``$2.5 million`` -> ``two point five million dollars``
     (``$ EUR GBP JPY INR KRW``, prefix or suffix);
   * a 4-digit number 1900-2099 is read as a year (``1999`` -> ``nineteen
     ninety nine``, ``2024`` -> ``twenty twenty four``, ``2005`` -> ``two thousand
     five``); decades ``1990s`` / ``80s`` -> ``nineteen nineties`` / ``eighties``;
   * digit strings with a leading zero (``007``) or of 10+ digits without separators (phone
     numbers) are read digit by digit (``zero zero seven``).
   * Letters and digits are always split at their boundary, and a number reads the same
     whether or not it is glued to letters: ``BAT246`` == ``BAT 246`` -> ``bat two hundred
     forty six`` and ``BAT2024`` == ``BAT 2024`` -> ``bat twenty twenty four`` (two recognisers
     that only differ in the space must not disagree).
   * Deliberately NOT converted (not deterministic): ``two forty six`` (digit-pair
     reading), fractions (``1/2``), times (``9:30`` -> ``nine thirty`` only), negative
     signs, ``k``/``m`` suffixes.
5. ``and`` is dropped between a magnitude/currency word and a number word
   (``two hundred and forty six`` == ``246``; ``five dollars and fifty cents``).
6. A small, extendable spelling table (``VARIANTS``) unifies ok/okay, all right/alright,
   per cent/percent, gonna/going to, a hundred/one hundred, ...
7. Optional filler removal (``FILLERS``: um, uh, uhm, er, erm, hmm, mm, mhm, ah, ...).

``tokenize_words(text)`` returns ``(surface, norm)`` pairs: the *first* token a chunk
produces carries the original chunk as ``surface`` and later tokens of the same chunk
(``BAT246`` -> 5 tokens) get ``surface == ""`` so that joining the non-empty surfaces
rebuilds the text.  Chunks that vanish (fillers, bare punctuation) appear as
``(surface, "")`` only with ``keep_empty=True``.
"""
from __future__ import annotations

import re
import unicodedata
from typing import Iterable, Mapping, Sequence

__all__ = [
    "FILLERS", "VARIANTS", "normalize", "tokenize_words", "tokenize_chunks", "tokenize_chunks_ex",
    "cardinal_words", "ordinal_words", "year_words",
]

# --------------------------------------------------------------------- tables (extend freely)

#: Tokens removed when ``drop_fillers`` is true.
FILLERS = frozenset({"um", "umm", "uh", "uhh", "uhm", "er", "erm", "hmm", "hm", "mm", "mmm", "mhm", "ah"})

#: Spelling variants: tuple of tokens -> replacement tuple of tokens (longest match wins).
VARIANTS: dict[tuple[str, ...], tuple[str, ...]] = {
    ("ok",): ("okay",),
    ("all", "right"): ("alright",),
    ("per", "cent"): ("percent",),
    ("e", "mail"): ("email",),
    ("can", "not"): ("cannot",),
    ("gonna",): ("going", "to"),
    ("wanna",): ("want", "to"),
    ("gotta",): ("got", "to"),
    # "100" is read "one hundred", so "a hundred" must be the same thing (a spoken form written in words)
    ("a", "hundred"): ("one", "hundred"),
    ("a", "thousand"): ("one", "thousand"),
    ("a", "million"): ("one", "million"),
    ("a", "billion"): ("one", "billion"),
}

_CHAR_MAP = str.maketrans({
    **{c: "'" for c in "\u2018\u2019\u201a\u201b\u02bc\u02b9\u2032\u00b4`"},
    **{c: '"' for c in "\u201c\u201d\u201e\u201f\u00ab\u00bb\u2033"},
    **{c: "-" for c in "\u2010\u2011\u2012\u2013\u2014\u2015\u2212\u2043"},
})

_SYMBOL_WORDS = {"%": "percent", "&": "and", "+": "plus", "@": "at", "=": "equals", "\u00a2": "cents"}
# symbol -> (unit, units, minor unit, minor units)
_CURRENCY = {
    "$": ("dollar", "dollars", "cent", "cents"),
    "\u20ac": ("euro", "euros", "cent", "cents"),
    "\u00a3": ("pound", "pounds", "penny", "pence"),
    "\u00a5": ("yen", "yen", None, None),
    "\u20b9": ("rupee", "rupees", "paisa", "paise"),
    "\u20a9": ("won", "won", None, None),
}
_SYMS = frozenset(_SYMBOL_WORDS) | frozenset(_CURRENCY)
_MAGNITUDES = frozenset({"hundred", "thousand", "million", "billion", "trillion"})

# --------------------------------------------------------------------- number words

_ONES = ("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen "
         "fifteen sixteen seventeen eighteen nineteen").split()
_TENS = ("", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety")
_ORD_IRREGULAR = {"one": "first", "two": "second", "three": "third", "five": "fifth",
                  "eight": "eighth", "nine": "ninth", "twelve": "twelfth"}
_AND_BEFORE = _MAGNITUDES | {"dollar", "dollars", "euro", "euros", "pound", "pounds", "rupee", "rupees"}
_SMALL_NUMBERS = frozenset(_ONES[1:] + list(_TENS[2:]))


def _below_1000(n: int) -> list[str]:
    out: list[str] = []
    h, r = divmod(n, 100)
    if h:
        out += [_ONES[h], "hundred"]
    if r >= 20:
        out.append(_TENS[r // 10])
        if r % 10:
            out.append(_ONES[r % 10])
    elif r:
        out.append(_ONES[r])
    return out


_GROUP_NAMES = ("", "thousand", "million", "billion", "trillion")


def _cardinal_grouped(n: int) -> list[str]:
    """Words for ``0 <= n < 10**15`` (used directly for comma-grouped numbers such as 1,000,000,000)."""
    if n == 0:
        return ["zero"]
    parts = []
    while n:
        n, r = divmod(n, 1000)
        parts.append(r)
    out: list[str] = []
    for k in range(len(parts) - 1, -1, -1):
        if parts[k]:
            out += _below_1000(parts[k])
            if _GROUP_NAMES[k]:
                out.append(_GROUP_NAMES[k])
    return out


def cardinal_words(n: int) -> list[str]:
    """English words for ``0 <= n <= 999_999_999``: 246 -> ['two','hundred','forty','six']."""
    if not 0 <= n <= 999_999_999:
        raise ValueError(f"cardinal_words supports 0..999999999, got {n}")
    return _cardinal_grouped(n)


def ordinal_words(n: int) -> list[str]:
    """17 -> ['seventeenth'], 21 -> ['twenty','first'], 100 -> ['one','hundredth']."""
    w = cardinal_words(n)
    last = w[-1]
    if last in _ORD_IRREGULAR:
        w[-1] = _ORD_IRREGULAR[last]
    elif last.endswith("y"):
        w[-1] = last[:-1] + "ieth"
    else:
        w[-1] = last + "th"
    return w


def year_words(y: int) -> list[str]:
    """Spoken year for 1900..2099: 1999 -> nineteen ninety nine, 2024 -> twenty twenty four."""
    if y == 2000:
        return ["two", "thousand"]
    if 2001 <= y <= 2009:
        return ["two", "thousand"] + cardinal_words(y - 2000)
    hi, lo = divmod(y, 100)
    out = cardinal_words(hi)
    if lo == 0:
        return out + ["hundred"]
    if lo < 10:
        return out + ["oh", _ONES[lo]]
    return out + cardinal_words(lo)




def _digits_words(s: str) -> list[str]:
    return [_ONES[int(c)] for c in s]


def _int_words(digits: str, grouped: bool = False) -> list[str]:
    if len(digits) > 1 and digits[0] == "0":
        return _digits_words(digits)  # identifiers: digit by digit
    if len(digits) > 9:
        if grouped and len(digits) <= 15:
            return _cardinal_grouped(int(digits))  # 1,000,000,000 is a quantity, not a phone number
        return _digits_words(digits)  # phone numbers / long identifiers: digit by digit
    return cardinal_words(int(digits))


def _number_words(num: str) -> list[str]:
    ip, dot, fp = num.replace(",", "").partition(".")
    out = _int_words(ip, "," in num)
    return out + ["point"] + _digits_words(fp) if dot else out


def _decade_words(v: int) -> list[str]:
    w = year_words(v) if v >= 1900 else cardinal_words(v)
    last = w[-1]
    w[-1] = last[:-1] + "ies" if last.endswith("y") else last + "s"
    return w


class _Money:
    """Placeholder for a currency amount; rendered once the following word is known."""
    __slots__ = ("sym", "num")

    def __init__(self, sym: str, num: str):
        self.sym, self.num = sym, num


def _money_words(sym: str, num: str) -> list[str]:
    one, many, minor_one, minor_many = _CURRENCY[sym]
    ip, _, fp = num.replace(",", "").partition(".")
    simple = len(ip) <= 9 and (len(ip) == 1 or ip[0] != "0") and len(fp) <= 2 and (not fp or minor_one)
    if not simple:
        return _number_words(num) + [many]
    units = int(ip)
    minor = int((fp + "00")[:2]) if fp else 0
    out: list[str] = []
    if units or not minor:
        out += cardinal_words(units) + [one if units == 1 else many]
    if minor:
        out += cardinal_words(minor) + [minor_one if minor == 1 else minor_many]
    return out


# --------------------------------------------------------------------- scanning

_NUM_RE = re.compile(r"(?:(?:\d{1,2}(?:,\d{2})+,\d{3}|\d{1,3}(?:,\d{3})+)(?!\d)(?:\.\d+)?)|\d+(?:\.\d+)?")
_ABBR_RE = re.compile(r"(?<![^\W\d_])[^\W\d_](?:\.[^\W\d_])+(?![^\W\d_])\.?")
_FAST_RE = re.compile(r"[a-z]+(?:'[a-z]+)*")


def _fix_char(c: str) -> str:
    if c.isascii():
        return c
    cat = unicodedata.category(c)
    if cat == "Nd":
        return str(unicodedata.decimal(c))
    if cat == "Cf":
        return ""
    o = ord(c)
    if 0xFE00 <= o <= 0xFE0F or 0xE0100 <= o <= 0xE01EF or 0x180B <= o <= 0x180D:
        return ""  # variation selectors (emoji VS15/VS16, ideographic, Mongolian): invisible, never part of a word
    return c


def _prepare(s: str) -> str:
    s = s.translate(_CHAR_MAP)
    if s.isascii():
        return s.lower()
    # Dropping format characters, NFKC and lower() can each enable the next (a removed ZWNJ lets two
    # marks compose; lower() of U+0130 can leave marks out of canonical order), so repeat until the
    # text is stable: then normalising the output again can never change it.
    for _ in range(4):
        t = "".join(map(_fix_char, s))
        t = unicodedata.normalize("NFKC", t).lower()
        t = unicodedata.normalize("NFKC", t).translate(_CHAR_MAP)
        if t == s:
            break
        s = t
    return s


def _is_letter(c: str) -> bool:
    """Letter, or a combining mark (which can only *continue* a word, see ``_scan``)."""
    return c.isalpha() or (c > "\x7f" and unicodedata.category(c)[0] == "M")


def _scan(s: str) -> list[tuple[str, str]]:
    """Cut into atoms: ('w', word) ('n', number) ('s', symbol) ('_', separator run)."""
    atoms: list[tuple[str, str]] = []
    i, n = 0, len(s)
    while i < n:
        c = s[i]
        if "0" <= c <= "9":
            m = _NUM_RE.match(s, i)
            atoms.append(("n", m.group()))
            i = m.end()
        elif c.isalpha():  # a word starts at a real letter; a mark/variation selector alone is a separator
            j = i + 1
            while j < n:
                d = s[j]
                if _is_letter(d):
                    j += 1
                elif d == "'" and j + 1 < n and s[j + 1].isalpha():
                    j += 2  # apostrophe inside a word
                else:
                    break
            atoms.append(("w", s[i:j]))
            i = j
        elif c in _SYMS:
            atoms.append(("s", c))
            i += 1
        else:
            if atoms and atoms[-1][0] == "_":
                atoms[-1] = ("_", atoms[-1][1] + c)
            else:
                atoms.append(("_", c))
            i += 1
    return atoms


def _expand_chunk(chunk: str) -> list:
    """Comparison tokens for one whitespace-free chunk (strings, plus _Money placeholders)."""
    if chunk.isascii():
        low = chunk.lower()
        if _FAST_RE.fullmatch(low):
            return [low]
    s = _ABBR_RE.sub(lambda m: m.group().replace(".", ""), _prepare(chunk))
    atoms = _scan(s)
    out: list = []
    n = len(atoms)
    k = 0
    while k < n:
        kind, val = atoms[k]
        nxt = atoms[k + 1] if k + 1 < n else None
        if kind == "w":
            out.append(val)
        elif kind == "s":
            if val in _CURRENCY:
                if nxt and nxt[0] == "n":  # $5
                    out.append(_Money(val, nxt[1]))
                    k += 2
                    continue
                out.append(_CURRENCY[val][1])
            else:
                out.append(_SYMBOL_WORDS[val])
        elif kind == "n":
            integer = val.isdigit()
            digits = val.replace(",", "")
            if integer and len(val) in (2, 4) and val[-1] == "0" and val[0] != "0" \
                    and (len(val) == 2 or 1900 <= int(val) <= 2099):  # decades: 80s, 1990s, 1990's
                j = k + 1 + (1 if k + 1 < n and atoms[k + 1] == ("_", "'") else 0)
                if j < n and atoms[j] == ("w", "s"):
                    out += _decade_words(int(val))
                    k = j + 1
                    continue
            if "." not in val and nxt and nxt[0] == "w" and nxt[1] in ("st", "nd", "rd", "th") \
                    and len(digits) <= 9 and (len(digits) == 1 or digits[0] != "0"):
                out += ordinal_words(int(digits))  # 1st 2nd 17th
                k += 2
                continue
            if nxt and nxt[0] == "s" and nxt[1] in _CURRENCY:  # 5$
                out.append(_Money(nxt[1], val))
                k += 2
                continue
            if integer and len(val) == 4 and 1900 <= int(val) <= 2099:
                out += year_words(int(val))  # also when glued to letters: "BAT2024" == "BAT 2024"
            else:
                out += _number_words(val)
        k += 1
    return out


# --------------------------------------------------------------------- cross-chunk passes
# `flat` is a list of [chunk_index, token] entries.

def _render_money(flat: list) -> list:
    out: list = []
    k, n = 0, len(flat)
    while k < n:
        ci, t = flat[k]
        if isinstance(t, _Money):
            nxt = flat[k + 1] if k + 1 < n else None
            if nxt is not None and nxt[1] in _MAGNITUDES:  # "$2.5 million" -> "two point five million dollars"
                out.extend([ci, w] for w in _number_words(t.num))
                out.append(nxt)
                out.append([nxt[0], _CURRENCY[t.sym][1]])
                k += 2
                continue
            out.extend([ci, w] for w in _money_words(t.sym, t.num))
        else:
            out.append(flat[k])
        k += 1
    return out


def _drop_number_and(flat: list) -> list:
    out: list = []
    for k, e in enumerate(flat):
        if e[1] == "and" and out and out[-1][1] in _AND_BEFORE \
                and k + 1 < len(flat) and flat[k + 1][1] in _SMALL_NUMBERS:
            continue
        out.append(e)
    return out


# "sixteen hundred" is how 1,600 is usually *said* (and how a recogniser may write it); "$1,600" reads
# "one thousand six hundred": treat every "<11..99> hundred" that STARTS a number as the same thing.
_HUNDREDS = {tuple(cardinal_words(_x)) + ("hundred",): tuple(cardinal_words(_x * 100)) for _x in range(11, 100)}
_NUMBER_WORDS = frozenset(_ONES) | frozenset(_TENS[2:]) | _MAGNITUDES


def _starts_a_number(out: list) -> bool:
    return not out or out[-1][1] not in _NUMBER_WORDS


def _apply_variants(flat: list, table: Mapping[tuple[str, ...], tuple[str, ...]],
                    swallowed: dict | None = None, guard=None) -> list:
    """Replace token sequences found in ``table``; the replacement is attributed to the first token's chunk.

    ``swallowed`` (optional) collects ``{chunk_index: first_chunk_index}`` for every later chunk that lost a
    token to a multi-chunk match such as ``all right`` -> ``alright``.
    """
    if not table:
        return flat
    maxlen = max(len(key) for key in table)
    out: list = []
    i, n = 0, len(flat)
    while i < n:
        for length in range(min(maxlen, n - i), 0, -1):
            rep = table.get(tuple(e[1] for e in flat[i:i + length]))
            if rep is not None and (guard is None or guard(out)):
                first = flat[i][0]
                out.extend([first, t] for t in rep)
                if swallowed is not None:
                    for e in flat[i + 1:i + length]:
                        if e[0] != first:
                            swallowed.setdefault(e[0], first)
                i += length
                break
        else:
            out.append(flat[i])
            i += 1
    return out


# --------------------------------------------------------------------- public API

def tokenize_chunks_ex(chunks: Sequence[str], drop_fillers: bool = True, *,
                       fillers: Iterable[str] | None = None,
                       variants: Mapping[tuple[str, ...], tuple[str, ...]] | None = None
                       ) -> tuple[list[list[str]], list[int | None]]:
    """``tokenize_chunks`` plus ``absorbed``: for chunk ``i``, the index of the earlier chunk whose multi-chunk
    spelling variant swallowed it (``all`` + ``right`` -> ``alright`` gives ``absorbed[1] == 0``), else ``None``.

    An absorbed chunk has no tokens of its own, but unlike a filler it is still part of a written word, so
    ``consensus.make_words`` keeps its text with the word that holds the variant's tokens.
    """
    flat: list = []
    for ci, chunk in enumerate(chunks):
        for t in _expand_chunk(chunk or ""):
            flat.append([ci, t])
    flat = _render_money(flat)
    if drop_fillers:
        fset = FILLERS if fillers is None else frozenset(fillers)
        flat = [e for e in flat if e[1] not in fset]
    flat = _drop_number_and(flat)
    swallowed: dict[int, int] = {}
    flat = _apply_variants(flat, VARIANTS if variants is None else variants, swallowed)
    flat = _apply_variants(flat, _HUNDREDS, swallowed, guard=_starts_a_number)
    out: list[list[str]] = [[] for _ in chunks]
    for ci, t in flat:
        out[ci].append(t)
    absorbed: list[int | None] = [None] * len(chunks)
    for ci, first in swallowed.items():
        if not out[ci]:  # a chunk that kept some token of its own is not "absorbed"
            absorbed[ci] = first
    return out, absorbed


def tokenize_chunks(chunks: Sequence[str], drop_fillers: bool = True, *,
                    fillers: Iterable[str] | None = None,
                    variants: Mapping[tuple[str, ...], tuple[str, ...]] | None = None) -> list[list[str]]:
    """Normalise each chunk; returns one token list per input chunk (possibly empty).

    Cross-chunk rules (``and`` removal, ``$5 million``, multi-word variants) are applied, and the
    result stays aligned 1:1 with ``chunks`` so callers can map tokens back to e.g. Whisper words.
    """
    return tokenize_chunks_ex(chunks, drop_fillers, fillers=fillers, variants=variants)[0]


def tokenize_words(text: str, drop_fillers: bool = True, *, keep_empty: bool = False,
                   fillers: Iterable[str] | None = None,
                   variants: Mapping[tuple[str, ...], tuple[str, ...]] | None = None) -> list[tuple[str, str]]:
    """``(surface, norm)`` pairs; see the module docstring for the surface convention."""
    chunks = (text or "").split()
    pairs: list[tuple[str, str]] = []
    for chunk, toks in zip(chunks, tokenize_chunks(chunks, drop_fillers, fillers=fillers, variants=variants)):
        if not toks:
            if keep_empty:
                pairs.append((chunk, ""))
            continue
        pairs.append((chunk, toks[0]))
        pairs.extend(("", t) for t in toks[1:])
    return pairs


def normalize(text: str, drop_fillers: bool = True, *, fillers: Iterable[str] | None = None,
              variants: Mapping[tuple[str, ...], tuple[str, ...]] | None = None) -> list[str]:
    """Comparison tokens of ``text`` (see module docstring)."""
    chunks = (text or "").split()
    return [t for toks in tokenize_chunks(chunks, drop_fillers, fillers=fillers, variants=variants) for t in toks]
