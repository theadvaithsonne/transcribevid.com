"""Word-level alignment of two token sequences (Levenshtein, difflib-style opcodes).

``align(ref, hyp)`` returns a list of ``(tag, i1, i2, j1, j2)`` tuples with the same meaning as
``difflib.SequenceMatcher.get_opcodes()``: ``ref[i1:i2]`` is turned into ``hyp[j1:j2]`` and ``tag`` is
``'equal'``, ``'replace'``, ``'delete'`` or ``'insert'``.  The opcodes tile both sequences without gaps.

Unlike difflib (longest matching blocks) the alignment is a *minimum edit distance* alignment, which is what
word error rate is defined on.  By default consecutive edits of the same kind stay separate, so a
``'replace'`` always has ``i2 - i1 == j2 - j1`` (pure substitutions) and insertions/deletions are their own
ops.  ``merge=True`` (or ``merge_ops``) coalesces neighbouring edits into one difflib-style block, which
is nicer for display.

Backend: ``rapidfuzz.distance.Levenshtein.opcodes`` (C++, 20 000 words in ~0.1 s) with a pure-python
dynamic programme as a fallback when rapidfuzz is not importable.
"""
from __future__ import annotations

import warnings
from difflib import SequenceMatcher
from typing import Hashable, Sequence

try:  # pragma: no cover - exercised implicitly
    from rapidfuzz.distance import Levenshtein as _Lev
except Exception:  # ImportError, or a broken binary wheel
    _Lev = None

Op = tuple  # (tag, i1, i2, j1, j2)

#: Largest DP table (cells) the pure-python fallback solves exactly; beyond it difflib is used.
MAX_DP_CELLS = 6_000_000

__all__ = ["align", "distance", "merge_ops", "count_ops", "have_rapidfuzz", "MAX_DP_CELLS"]


def have_rapidfuzz() -> bool:
    return _Lev is not None


def _pick(backend: str | None) -> str:
    if backend in (None, "auto"):
        return "rapidfuzz" if _Lev is not None else "python"
    if backend == "rapidfuzz" and _Lev is None:
        raise RuntimeError("rapidfuzz is not available")
    if backend not in ("rapidfuzz", "python"):
        raise ValueError(f"unknown backend {backend!r}")
    return backend


# --------------------------------------------------------------------- pure python fallback

def _steps_to_ops(steps: Sequence[int], i: int, j: int) -> list[Op]:
    """Compress per-word steps (1 equal, 2 sub, 3 del, 4 ins) into grouped opcodes starting at (i, j)."""
    tags = {1: "equal", 2: "replace", 3: "delete", 4: "insert"}
    ops: list[Op] = []
    k, n = 0, len(steps)
    while k < n:
        s = steps[k]
        e = k
        while e < n and steps[e] == s:
            e += 1
        run = e - k
        di = run if s in (1, 2, 3) else 0
        dj = run if s in (1, 2, 4) else 0
        ops.append((tags[s], i, i + di, j, j + dj))
        i += di
        j += dj
        k = e
    return ops


def _dp_steps(a: Sequence[Hashable], b: Sequence[Hashable]) -> list[int]:
    n, m = len(a), len(b)
    if n == 0:
        return [4] * m
    if m == 0:
        return [3] * n
    back: list[bytearray] = [bytearray([4]) * (m + 1)]  # row 0: only insertions
    back[0][0] = 0
    prev = list(range(m + 1))
    for i in range(1, n + 1):
        ai = a[i - 1]
        cur = [i] + [0] * m
        row = bytearray(m + 1)
        row[0] = 3
        for j in range(1, m + 1):
            same = ai == b[j - 1]
            diag = prev[j - 1] + (0 if same else 1)
            dele = prev[j] + 1
            ins = cur[j - 1] + 1
            if diag <= dele and diag <= ins:
                cur[j] = diag
                row[j] = 1 if same else 2
            elif dele <= ins:
                cur[j] = dele
                row[j] = 3
            else:
                cur[j] = ins
                row[j] = 4
        back.append(row)
        prev = cur
    steps: list[int] = []
    i, j = n, m
    while i > 0 or j > 0:
        s = back[i][j]
        steps.append(s)
        if s in (1, 2):
            i -= 1
            j -= 1
        elif s == 3:
            i -= 1
        else:
            j -= 1
    steps.reverse()
    return steps


def _split_replaces(ops: Sequence[Op]) -> list[Op]:
    """Make every 'replace' square: a 2->3 replace becomes replace(2) + insert(1)."""
    out: list[Op] = []
    for tag, i1, i2, j1, j2 in ops:
        a, b = i2 - i1, j2 - j1
        if tag == "replace" and a != b:
            k = min(a, b)
            out.append(("replace", i1, i1 + k, j1, j1 + k))
            out.append(("delete", i1 + k, i2, j1 + k, j1 + k) if a > b else ("insert", i1 + k, i1 + k, j1 + k, j2))
        else:
            out.append((tag, i1, i2, j1, j2))
    return out


def _python_ops(ref: Sequence[Hashable], hyp: Sequence[Hashable]) -> list[Op]:
    n, m = len(ref), len(hyp)
    p = 0
    while p < n and p < m and ref[p] == hyp[p]:
        p += 1
    s = 0
    while s < n - p and s < m - p and ref[n - 1 - s] == hyp[m - 1 - s]:
        s += 1
    a, b = ref[p:n - s], hyp[p:m - s]
    if (len(a) + 1) * (len(b) + 1) > MAX_DP_CELLS:
        warnings.warn("tools.align: input too large for the pure-python DP and rapidfuzz is missing; "
                      "using difflib (alignment is valid but not guaranteed minimal)", RuntimeWarning, stacklevel=3)
        core = _split_replaces(SequenceMatcher(None, a, b, autojunk=False).get_opcodes())
        core = [(t, i1 + p, i2 + p, j1 + p, j2 + p) for t, i1, i2, j1, j2 in core]
    else:
        core = _steps_to_ops(_dp_steps(a, b), p, p)
    ops: list[Op] = []
    if p:
        ops.append(("equal", 0, p, 0, p))
    ops.extend(core)
    if s:
        if ops and ops[-1][0] == "equal":  # whole input equal inside the trimmed core cannot happen; be safe
            t, i1, _, j1, _ = ops[-1]
            ops[-1] = (t, i1, n, j1, m)
        else:
            ops.append(("equal", n - s, n, m - s, m))
    return ops


# --------------------------------------------------------------------- public API

def align(ref: Sequence[Hashable], hyp: Sequence[Hashable], *, merge: bool = False,
          backend: str | None = None) -> list[Op]:
    """Minimum-edit-distance opcodes turning ``ref`` into ``hyp`` (see module docstring)."""
    if _pick(backend) == "rapidfuzz":
        ops = _Lev.opcodes(ref, hyp).as_list()
    else:
        ops = _python_ops(ref, hyp)
    return merge_ops(ops) if merge else ops


def distance(ref: Sequence[Hashable], hyp: Sequence[Hashable], *, backend: str | None = None) -> int:
    """Word-level Levenshtein distance (substitutions + insertions + deletions)."""
    if _pick(backend) == "rapidfuzz":
        return _Lev.distance(ref, hyp)
    return sum(count_ops(_python_ops(ref, hyp)))


def merge_ops(ops: Sequence[Op]) -> list[Op]:
    """Coalesce neighbouring non-equal ops into single difflib-style blocks (replace/delete/insert)."""
    merged: list[list] = []
    for tag, i1, i2, j1, j2 in ops:
        if tag != "equal" and merged and merged[-1][0] != "equal":
            merged[-1][2], merged[-1][4] = i2, j2
        else:
            merged.append([tag, i1, i2, j1, j2])
    out: list[Op] = []
    for tag, i1, i2, j1, j2 in merged:
        if tag != "equal":
            tag = "replace" if i2 > i1 and j2 > j1 else ("delete" if i2 > i1 else "insert")
        out.append((tag, i1, i2, j1, j2))
    return out


def count_ops(ops: Sequence[Op]) -> tuple[int, int, int]:
    """``(substitutions, insertions, deletions)`` of merged or unmerged opcodes."""
    sub = ins = dele = 0
    for tag, i1, i2, j1, j2 in ops:
        a, b = i2 - i1, j2 - j1
        if tag == "replace":
            sub += min(a, b)
            dele += max(a - b, 0)
            ins += max(b - a, 0)
        elif tag == "delete":
            dele += a
        elif tag == "insert":
            ins += b
    return sub, ins, dele
