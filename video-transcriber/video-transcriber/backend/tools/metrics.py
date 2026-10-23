"""Accuracy metrics for ASR transcripts: WER, CER, pairwise agreement, diff reports, bootstrap CIs.

All functions work on already-normalised token lists (see ``tools.textnorm.normalize``) except the
``*_text`` helpers, which normalise first.

Conventions
-----------
* ``WER = (substitutions + insertions + deletions) / n_ref``.  With an empty reference the denominator is
  floored at 1, so WER is the number of inserted words (0.0 when the hypothesis is empty too); this keeps
  every number finite.  WER can exceed 1.0 (many insertions).  ``accuracy = max(0, 1 - WER)``.
* ``char_error_rate`` counts spaces as characters, like jiwer.
"""
from __future__ import annotations

import random
from typing import Sequence

from .align import align, count_ops, distance
from .textnorm import normalize

__all__ = [
    "wer", "wer_text", "char_error_rate", "pairwise_matrix", "mean_agreement", "rank_by_agreement",
    "diff_report", "window_errors", "segment_errors", "bootstrap_ci",
]


def _tokens(x, what: str):
    """Reject a plain string where a token list is required (it would silently be scored per character)."""
    if isinstance(x, (str, bytes)):
        raise TypeError(f"{what} must be a list of tokens, not a string: use wer_text() for raw text or "
                        "tools.textnorm.normalize() first (a string would be compared character by character)")
    return x


def wer(ref: Sequence[str], hyp: Sequence[str]) -> dict:
    """Word error rate of token list ``hyp`` against reference ``ref`` with the error breakdown.

    ``errors = sub + ins + del`` is the (unique) minimum edit distance; the split into sub/ins/del is that of one
    optimal alignment and is not unique (``a b`` -> ``b a`` is 2 substitutions or 1 deletion + 1 insertion; both
    cost 2), so rely on ``errors`` / ``wer`` and treat the split as indicative.  ``ins - del == n_hyp - n_ref``
    always holds.
    """
    _tokens(ref, "ref"), _tokens(hyp, "hyp")
    sub, ins, dele = count_ops(align(ref, hyp))
    n_ref, n_hyp = len(ref), len(hyp)
    errors = sub + ins + dele
    w = errors / max(n_ref, 1)
    return {"wer": w, "sub": sub, "ins": ins, "del": dele, "n_ref": n_ref, "n_hyp": n_hyp,
            "errors": errors, "accuracy": max(0.0, 1.0 - w)}


def wer_text(ref_text: str, hyp_text: str, **norm_kwargs) -> dict:
    """``wer`` of two raw strings after ``normalize`` (``norm_kwargs`` go to ``normalize``)."""
    return wer(normalize(ref_text, **norm_kwargs), normalize(hyp_text, **norm_kwargs))


def _as_chars(x) -> str:
    return x if isinstance(x, str) else " ".join(x)


def char_error_rate(ref, hyp) -> float:
    """Character error rate; ``ref``/``hyp`` are strings or token lists (joined with single spaces)."""
    r, h = _as_chars(ref), _as_chars(hyp)
    return distance(r, h) / max(len(r), 1)


class _Matrix(dict):
    """``pairwise_matrix`` result; ``m[ref][hyp]`` is a shortcut for ``m["wer"][ref][hyp]``."""

    def __missing__(self, key):
        wer_rows = self["wer"]
        if key in wer_rows:
            return wer_rows[key]
        raise KeyError(key)


def pairwise_matrix(systems: dict[str, Sequence[str]]) -> dict:
    """WER of every system against every other and a symmetric agreement score.

    Returns ``{"systems": [...], "wer": {ref: {hyp: wer}}, "agreement": {a: {b: agreement}}}`` where the
    WER rows are references and the columns hypotheses, and ``agreement = 1 - (wer(a->b) + wer(b->a)) / 2``
    (clipped to [0, 1]).  The edit distance is computed once per unordered pair.  Indexing the result with
    a system name returns that system's WER row (``m[ref][hyp] == m["wer"][ref][hyp]``).
    """
    names = list(systems)
    for a in names:
        _tokens(systems[a], f"systems[{a!r}]")
    w: dict[str, dict[str, float]] = {a: {a: 0.0} for a in names}
    agr: dict[str, dict[str, float]] = {a: {a: 1.0} for a in names}
    for k, a in enumerate(names):
        for b in names[k + 1:]:
            d = distance(systems[a], systems[b])
            w_ab = d / max(len(systems[a]), 1)
            w_ba = d / max(len(systems[b]), 1)
            w[a][b], w[b][a] = w_ab, w_ba
            agr[a][b] = agr[b][a] = min(1.0, max(0.0, 1.0 - (w_ab + w_ba) / 2))
    return _Matrix(systems=names, wer=w, agreement=agr)


def mean_agreement(matrix: dict) -> dict[str, float]:
    """Average agreement of each system with all the others (1.0 for a single system)."""
    agr = matrix["agreement"]
    out = {}
    for a in matrix["systems"]:
        others = [v for b, v in agr[a].items() if b != a]
        out[a] = sum(others) / len(others) if others else 1.0
    return out


def rank_by_agreement(matrix: dict) -> list[tuple[str, float]]:
    """Systems sorted by mean agreement with the rest, best first (the consensus 'medoid' leads)."""
    return sorted(mean_agreement(matrix).items(), key=lambda kv: (-kv[1], kv[0]))


def _fmt(before: Sequence[str], mid: Sequence[str], after: Sequence[str], start: int, end: int, n: int) -> str:
    parts = ["..."] if start > 0 else []
    parts += list(before)
    parts.append("[" + " ".join(mid) + "]")
    parts += list(after)
    if end < n:
        parts.append("...")
    return " ".join(parts)


def diff_report(ref: Sequence[str], hyp: Sequence[str], context: int = 4) -> list[str]:
    """One human-readable line per non-equal block, with +-``context`` words around it.

    ``REPLACE ref[12:14] hyp[12:15] | ... the quick [brown fox] jumps over ... => ... the quick [box today] ...``
    """
    _tokens(ref, "ref"), _tokens(hyp, "hyp")
    lines = []
    n_ref, n_hyp = len(ref), len(hyp)
    for tag, i1, i2, j1, j2 in align(ref, hyp, merge=True):
        if tag == "equal":
            continue
        a, b = max(0, i1 - context), max(0, j1 - context)
        left = _fmt(ref[a:i1], ref[i1:i2], ref[i2:i2 + context], a, min(n_ref, i2 + context), n_ref)
        right = _fmt(hyp[b:j1], hyp[j1:j2], hyp[j2:j2 + context], b, min(n_hyp, j2 + context), n_hyp)
        lines.append(f"{tag.upper():<7} ref[{i1}:{i2}] hyp[{j1}:{j2}] | {left} => {right}")
    return lines


def window_errors(ref: Sequence[str], hyp: Sequence[str], window: int = 25) -> tuple[list[int], list[int]]:
    """Split one global alignment into consecutive windows of ``window`` reference words.

    Returns ``(errors_per_window, ref_words_per_window)``; insertions are charged to the window of the
    reference word that follows them.  Feed the result to ``bootstrap_ci``.
    """
    _tokens(ref, "ref"), _tokens(hyp, "hyp")
    if window < 1:
        raise ValueError("window must be at least 1")
    n = len(ref)
    if n == 0:
        return [len(hyp)], [0]
    n_win = (n + window - 1) // window
    errs = [0] * n_win
    for tag, i1, i2, j1, j2 in align(ref, hyp):
        if tag in ("replace", "delete"):
            for i in range(i1, i2):
                errs[i // window] += 1
        elif tag == "insert":
            errs[min(i1, n - 1) // window] += j2 - j1
    lens = [window] * (n_win - 1) + [n - window * (n_win - 1)]
    return errs, lens


def segment_errors(ref_segments: Sequence[Sequence[str]], hyp_segments: Sequence[Sequence[str]]) -> tuple[list[int], list[int]]:
    """Per-segment ``(errors, ref_len)`` for pre-segmented, pairwise corresponding transcripts."""
    if len(ref_segments) != len(hyp_segments):
        raise ValueError("segment lists must have the same length")
    errs, lens = [], []
    for r, h in zip(ref_segments, hyp_segments):
        errs.append(distance(r, h))
        lens.append(len(r))
    return errs, lens


def bootstrap_ci(per_segment_errors: Sequence[float], per_segment_ref_len: Sequence[float], *,
                 n_boot: int = 2000, level: float = 0.95, seed: int = 0) -> dict:
    """Percentile bootstrap confidence interval of the corpus WER, resampling whole segments.

    Corpus WER is ``sum(errors) / sum(ref_len)``.  Returns ``{"wer", "low", "high", "level", "n_segments",
    "n_boot"}``.  Deterministic for a given ``seed``.
    """
    if len(per_segment_errors) != len(per_segment_ref_len):
        raise ValueError("errors and ref_len must have the same length")
    n = len(per_segment_errors)
    out = {"level": level, "n_segments": n, "n_boot": n_boot}
    if n == 0:
        return {"wer": 0.0, "low": 0.0, "high": 0.0, **out}
    alpha = (1.0 - level) / 2.0
    point = sum(per_segment_errors) / max(sum(per_segment_ref_len), 1)
    try:
        import numpy as np
    except ImportError:  # pragma: no cover - numpy ships with the app
        rnd = random.Random(seed)
        stats = []
        for _ in range(n_boot):
            idx = [rnd.randrange(n) for _ in range(n)]
            stats.append(sum(per_segment_errors[i] for i in idx) / max(sum(per_segment_ref_len[i] for i in idx), 1))
        stats.sort()
        low, high = stats[int(alpha * (n_boot - 1))], stats[int(round((1 - alpha) * (n_boot - 1)))]
    else:
        errs = np.asarray(per_segment_errors, dtype=float)
        lens = np.asarray(per_segment_ref_len, dtype=float)
        rng = np.random.default_rng(seed)
        stats_arr = np.empty(n_boot)
        batch = max(1, min(n_boot, 2_000_000 // n))
        for start in range(0, n_boot, batch):
            b = min(batch, n_boot - start)
            idx = rng.integers(0, n, size=(b, n))
            stats_arr[start:start + b] = errs[idx].sum(axis=1) / np.maximum(lens[idx].sum(axis=1), 1.0)
        low, high = (float(v) for v in np.percentile(stats_arr, [100 * alpha, 100 * (1 - alpha)]))
    return {"wer": point, "low": low, "high": high, **out}
