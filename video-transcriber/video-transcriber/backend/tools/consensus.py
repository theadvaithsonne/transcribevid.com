"""ROVER-style consensus of several ASR transcripts on top of one backbone transcript.

Word dicts
----------
Every word is a dict ``{'norm', 'surface', 'start', 'end', 'probability'}``.  ``norm`` is the comparison
token (``tools.textnorm``), ``surface`` the text to emit (Whisper style, leading space and punctuation kept).
Words whose ``norm`` is empty (fillers, bare punctuation) are *pass-through*: they are never voted on and
are carried to the output unchanged.  ``make_words`` builds such lists from raw text or Whisper words.

Voting
------
Each other system is aligned to the backbone on ``norm`` (word-level Levenshtein, ``tools.align``).  For every
backbone position the candidates are: the backbone word (vote ``w_backbone``), the word each system aligned to
that position (vote ``weights[system]``, default 1.0) and the *empty token* for every system that omitted the
word.  Between positions (the "gaps") systems may have inserted words; each slot of an insertion is voted
on against "nothing" (the backbone and every system without a word in that slot vote for nothing).

The heaviest candidate wins.  Ties go to the backbone's candidate; ties among other candidates are broken by
the vote-weighted mean ``probability`` and then by system order.  ``prob_tiebreak=True`` also uses the
probability to break ties *with* the backbone.  ``min_votes`` is the minimum vote weight a candidate other
than the backbone's needs in order to win.  The winner keeps the surface of its own system, but the timing
(``start``/``end``) of the backbone position; accepted insertions are spread over the gap between their
neighbours.  Insertion slots are voted independently, so a phrase is only added when a majority agrees slot
by slot.

Output text
-----------
``rebuild_text`` prints the chosen surfaces.  A written word that normalised to several tokens (``BAT246``,
``50%``, ``well-known``; see ``make_words``) is printed once with its own surface while the vote keeps all of
its tokens, and spelled out token by token when only part of it survives.  Backbone words the vote left
alone keep the backbone's formatting.

When ROVER helps and when it does not (measured with ``tests/test_tools.py`` and on synthetic ground truth)
-------------------------------------------------------------------------------------------------------
* It needs at least three systems including the backbone: with two, every disagreement is a tie and the
  backbone always wins.
* It removes *independent* errors.  Errors that most systems share (the same model family misreading the same
  name) survive the vote, and a majority of correlated weak systems out-votes one good system: with one strong
  and four weak systems that share their mistakes, equal weights were worse than the strong system alone in
  every trial.  Give the better systems more weight (``weights``/``w_backbone``) and judge the result on a
  human-checked sample, not on agreement alone: ``metrics.rank_by_agreement`` finds the most *typical*
  system, which is not always the most accurate one.
"""
from __future__ import annotations

import math
from typing import Iterable, Mapping, Sequence

from .align import align
from .textnorm import tokenize_chunks_ex

__all__ = ["BACKBONE", "rover", "rebuild_text", "disagreement_spans", "make_words", "chosen_words", "summarize"]

BACKBONE = "backbone"  # reserved system name of the backbone in votes / alternatives
_EPS = 1e-9


class _Cand:
    __slots__ = ("norm", "weight", "voters", "order")

    def __init__(self, norm: str, order: int):
        self.norm, self.weight, self.voters, self.order = norm, 0.0, [], order


class _Ctx:
    __slots__ = ("names", "wmap", "total", "min_votes", "prob_tiebreak")

    def __init__(self, names, wmap, min_votes, prob_tiebreak):
        self.names, self.wmap = names, wmap
        self.total = sum(wmap.values())
        self.min_votes, self.prob_tiebreak = min_votes, prob_tiebreak


def _vote(cands: dict, norm: str, weight: float, name: str, word) -> None:
    c = cands.get(norm)
    if c is None:
        c = cands[norm] = _Cand(norm, len(cands))
    c.weight += weight
    c.voters.append((name, word))


def _mean_prob(c: _Cand, wmap: Mapping[str, float]) -> float:
    num = den = 0.0
    for name, w in c.voters:
        p = None if w is None else w.get("probability")
        if p is not None:
            num += wmap[name] * float(p)
            den += wmap[name]
    return num / den if den else 0.0


def _best_word(c: _Cand, wmap: Mapping[str, float]):
    """The voter word that represents candidate ``c`` (heaviest system, then highest probability)."""
    best, key = None, None
    for rank, (name, w) in enumerate(c.voters):
        if w is None:
            continue
        p = w.get("probability")
        k = (wmap[name], -1.0 if p is None else float(p), -rank)
        if key is None or k > key:
            best, key = w, k
    return best


def _resolve(cands: dict, bb_norm: str, ctx: _Ctx):
    """Pick the winning candidate -> (winner, votes, agreement, alternatives)."""
    best_w = max(c.weight for c in cands.values())
    top = [c for c in cands.values() if c.weight >= best_w - _EPS]
    bbc = cands[bb_norm]
    if bbc in top:
        win = bbc
        if ctx.prob_tiebreak and len(top) > 1:
            challenger = max((c for c in top if c is not bbc), key=lambda c: (_mean_prob(c, ctx.wmap), -c.order))
            if _mean_prob(challenger, ctx.wmap) > _mean_prob(bbc, ctx.wmap) + _EPS:
                win = challenger
    else:
        win = max(top, key=lambda c: (_mean_prob(c, ctx.wmap), -c.order))
    if win is not bbc and ctx.min_votes is not None and win.weight < ctx.min_votes - _EPS:
        win = bbc
    votes = {c.norm: c.weight for c in cands.values()}
    alts = []
    for c in sorted(cands.values(), key=lambda c: (-c.weight, c.order)):
        if c is win:
            continue
        w = _best_word(c, ctx.wmap)
        alts.append({"norm": c.norm, "surface": (w or {}).get("surface", "") if c.norm else "",
                     "weight": c.weight, "systems": [n for n, _ in c.voters],
                     "probability": (w or {}).get("probability")})
    return win, votes, (win.weight / ctx.total if ctx.total else 1.0), alts


def _empty_word(start, end) -> dict:
    return {"norm": "", "surface": "", "start": start, "end": end, "probability": None}


def _by_system(cands: dict) -> dict:
    out: dict = {}
    for c in cands.values():
        for name, w in c.voters:
            out[name] = w
    return out


def _position_decision(index: int, bb: dict, cands: dict, ctx: _Ctx) -> dict:
    winner, votes, agreement, alts = _resolve(cands, bb["norm"], ctx)
    if winner.norm == bb["norm"]:
        chosen = dict(bb)
    elif winner.norm == "":
        chosen = _empty_word(bb.get("start"), bb.get("end"))
    else:
        chosen = dict(_best_word(winner, ctx.wmap))
        chosen["start"], chosen["end"] = bb.get("start"), bb.get("end")
    return {"index": index, "gap": False, "passthrough": False, "chosen": chosen,
            "changed": winner.norm != bb["norm"], "backbone": bb, "votes": votes,
            "agreement": agreement, "alternatives": alts, "by_system": _by_system(cands)}


def _gap_decisions(orig: int, prop: dict, ctx: _Ctx, prev_w, next_w) -> list[dict]:
    """Decisions for the insertion slots proposed before backbone word ``orig`` (``prop``: system -> words)."""
    if not prop:
        return []
    slots = []
    for slot in range(max(len(v) for v in prop.values())):
        cands: dict = {}
        _vote(cands, "", ctx.wmap[BACKBONE], BACKBONE, None)  # the backbone proposes nothing
        for name in ctx.names:
            seq = prop.get(name, ())
            if len(seq) > slot:
                _vote(cands, seq[slot]["norm"], ctx.wmap[name], name, seq[slot])
            else:
                _vote(cands, "", ctx.wmap[name], name, None)
        winner, votes, agreement, alts = _resolve(cands, "", ctx)
        slots.append((winner, votes, agreement, alts, cands))
        if winner.norm == "":
            break  # nothing is inserted beyond the first slot that loses
    t0 = prev_w.get("end") if prev_w else None
    t1 = next_w.get("start") if next_w else None
    t0 = t1 if t0 is None else t0
    t1 = t0 if t1 is None else t1
    if t0 is not None and t1 < t0:  # the neighbours overlap: place the insertion at the start of the next word
        t0 = t1
    n_acc = sum(1 for s in slots if s[0].norm != "")
    out, j = [], 0
    for winner, votes, agreement, alts, cands in slots:
        if winner.norm != "":
            if t0 is None:
                s_j = e_j = None
            else:
                s_j, e_j = t0 + (t1 - t0) * j / n_acc, t0 + (t1 - t0) * (j + 1) / n_acc
            chosen = dict(_best_word(winner, ctx.wmap))
            chosen["start"], chosen["end"] = s_j, e_j
            j += 1
        else:
            chosen = _empty_word(t0, t1)
        out.append({"index": orig, "gap": True, "passthrough": False, "chosen": chosen,
                    "changed": winner.norm != "", "backbone": None, "votes": votes,
                    "agreement": agreement, "alternatives": alts, "by_system": _by_system(cands)})
    return out


def rover(backbone: Sequence[dict], others: Mapping[str, Sequence[dict]], weights: Mapping[str, float] | None = None,
          min_votes: float | None = None, *, w_backbone: float | None = None,
          prob_tiebreak: bool = False) -> list[dict]:
    """Vote ``others`` against ``backbone``; returns decisions in output order.

    Each decision: ``index`` (backbone word index; for insertions the index of the word the insertion
    precedes), ``gap`` (True for insertion slots), ``chosen`` (word dict; empty ``norm``/``surface`` means the
    word was dropped or nothing was inserted), ``changed``, ``votes`` ({norm: weight}, '' = vote for nothing),
    ``agreement`` (winning weight / total weight), ``alternatives`` (the losing candidates, heaviest first),
    ``backbone`` (the backbone word or None), ``by_system`` (system -> word or None) and ``passthrough``.
    """
    if BACKBONE in others:
        raise ValueError(f"{BACKBONE!r} is a reserved system name")
    weights = dict(weights or {})
    wb = float(w_backbone if w_backbone is not None else weights.get(BACKBONE, 1.0))
    names = list(others)
    wmap = {BACKBONE: wb, **{n: float(weights.get(n, 1.0)) for n in names}}
    if any(not math.isfinite(v) or v < 0 for v in wmap.values()):
        raise ValueError("weights must be finite and non-negative")
    if min_votes is not None and math.isnan(min_votes):
        raise ValueError("min_votes must be a number")
    ctx = _Ctx(names, wmap, min_votes, prob_tiebreak)

    bb = list(backbone)
    idx_map = [i for i, w in enumerate(bb) if w.get("norm")]  # alignable backbone words
    comp_of = {orig: k for k, orig in enumerate(idx_map)}
    bb_norms = [bb[i]["norm"] for i in idx_map]
    m = len(idx_map)
    pos: list[dict] = []
    for k in range(m):
        cands: dict = {}
        _vote(cands, bb_norms[k], wb, BACKBONE, bb[idx_map[k]])
        pos.append(cands)
    gaps: list[dict] = [dict() for _ in range(m + 1)]  # compressed gap -> {system: [words]}

    for name in names:
        words = [w for w in others[name] if w.get("norm")]
        wt = wmap[name]
        for tag, i1, i2, j1, j2 in align(bb_norms, [w["norm"] for w in words]):
            if tag in ("equal", "replace"):
                for t in range(i2 - i1):
                    w = words[j1 + t]
                    _vote(pos[i1 + t], w["norm"], wt, name, w)
            elif tag == "delete":
                for k in range(i1, i2):
                    _vote(pos[k], "", wt, name, None)
            else:  # insert before compressed position i1
                gaps[i1][name] = words[j1:j2]

    decisions: list[dict] = []
    n = len(bb)
    for i, w in enumerate(bb):
        k = comp_of.get(i)
        if k is None:  # pass-through word (filler / punctuation only)
            decisions.append({"index": i, "gap": False, "passthrough": True, "chosen": dict(w), "changed": False,
                              "backbone": w, "votes": {}, "agreement": 1.0, "alternatives": [], "by_system": {}})
            continue
        decisions += _gap_decisions(i, gaps[k], ctx, bb[i - 1] if i else None, w)
        decisions.append(_position_decision(i, w, pos[k], ctx))
    decisions += _gap_decisions(n, gaps[m], ctx, bb[n - 1] if n else None, None)
    return decisions


def _join_surfaces(surfaces: Iterable[str]) -> str:
    """Join surfaces; a space is inserted only where neither side already supplies whitespace."""
    text = ""
    for s in surfaces:
        if not s or not s.strip():
            continue
        if text and not s[0].isspace() and not text[-1].isspace():
            text += " "
        text += s
    return text.strip()


# --------------------------------------------------------------------- rendering decisions as text
#
# A written word that normalised to several tokens ("BAT246", "50%", "well-known", "$5.50") is a *group*:
# its tokens carry ``group`` / ``gpos`` / ``gsize`` and only the first token carries the surface.  The vote
# works on tokens, so rendering has to decide, run by run, whether a group came through intact (its surface
# is printed once) or was broken up (the tokens that remain are spelled out).  A group is *intact* when some
# system wrote it (the backbone first) and the vote kept exactly that system's tokens, one after the other.
# Text the backbone wrote and the vote left alone is never replaced by another system's formatting: such a
# group may only be re-written as a whole (the backbone word 2023 whose last token lost to "2024").

def _is_dropped(d: dict) -> bool:
    """A deleted backbone word or a rejected insertion: no token and no text of its own."""
    return not d["passthrough"] and not d["chosen"].get("norm")


def _group_starts(d: dict, norm: str) -> list:
    """``(system, word)`` pairs whose word at decision ``d`` is the first token of a multi-token written word."""
    by = d["by_system"]
    names = ([BACKBONE] if BACKBONE in by else []) + [n for n in by if n != BACKBONE]
    out = []
    for name in names:
        w = by.get(name)
        if w is not None and w.get("norm") == norm and w.get("gpos") == 0 and (w.get("gsize") or 1) > 1:
            out.append((name, w))
    return out


def _group_run(decisions: Sequence[dict], i: int, name: str, w0: dict):
    """Decision indices of the tokens of ``w0``'s group if the vote kept all of them in a row, else None."""
    k, g = w0["gsize"], w0.get("group")
    run, p, n = [i], i, len(decisions)
    for q in range(1, k):
        p += 1
        while p < n and _is_dropped(decisions[p]):
            p += 1
        if p >= n or decisions[p]["passthrough"]:
            return None
        d = decisions[p]
        w = d["by_system"].get(name)
        if w is None or w.get("group") != g or w.get("gpos") != q or w.get("norm") != d["chosen"].get("norm"):
            return None
        run.append(p)
    return run


def _backbone_groups(decisions: Sequence[dict]) -> dict:
    """decision index -> record of the multi-token backbone word it belongs to (``first``/``last`` decision)."""
    rec_of: dict = {}
    cur = None
    for p, d in enumerate(decisions):
        b = d["backbone"]
        if d["gap"] or b is None:
            continue
        g, gp, gs = b.get("group"), b.get("gpos"), b.get("gsize") or 1
        if g is None or gp is None or gs < 2:
            cur = None
            continue
        if cur is not None and cur["group"] == g and gp == cur["next"]:
            cur["next"] += 1
            cur["last"] = p
        else:
            cur = {"group": g, "first": p, "last": p, "next": gp + 1, "gsize": gs, "start": gp}
        rec_of[p] = cur
    return rec_of


def _may_replace(decisions: Sequence[dict], first: int, last: int, rec_of: dict) -> bool:
    """May decisions ``first..last`` be printed as one word written by some system?

    Only if every token in it was voted in (substituted or inserted), or the unchanged backbone tokens in it are
    either one complete backbone word that lies entirely inside the run (re-written as a whole), or just the
    run's first token, which the voted-in tokens extend (``3`` -> ``3.5``, ``well`` -> ``well-known``).  Several
    unchanged backbone words are never merged into another system's single word (``bat two forty six`` keeps its
    formatting when another system wrote ``BAT246``).
    """
    n = len(decisions)
    end = last
    while end + 1 < n and _is_dropped(decisions[end + 1]):
        end += 1  # the tail of that backbone word may have been voted away
    kept = None
    lone = []  # unchanged single-token backbone words inside the run
    for p in range(first, last + 1):
        d = decisions[p]
        if d["gap"] or d["changed"] or not d["chosen"].get("norm"):
            continue
        rec = rec_of.get(p)
        if rec is None:
            lone.append(p)
        elif kept is not None and rec is not kept:
            return False
        else:
            kept = rec
    if kept is None:
        return not lone or lone == [first]
    if lone:
        return False
    return kept["start"] == 0 and kept["next"] == kept["gsize"] and first <= kept["first"] and kept["last"] <= end


def _find_unit(decisions: Sequence[dict], i: int, rec_of: dict):
    d = decisions[i]
    for name, w0 in _group_starts(d, d["chosen"]["norm"]):
        run = _group_run(decisions, i, name, w0)
        if run is not None and _may_replace(decisions, i, run[-1], rec_of):
            return run[-1], w0.get("surface") or " ".join(decisions[p]["chosen"]["norm"] for p in run)
    return None


def _token_text(d: dict) -> str:
    """Text of a token that is not part of an intact multi-token word."""
    c = d["chosen"]
    if (c.get("gsize") or 1) > 1:
        return c["norm"]  # its surface describes the whole written word, which did not survive: spell the token
    s = c.get("surface") or ""
    if not s and d["changed"]:
        return c["norm"]
    return s


def _units(decisions: Sequence[dict]) -> list[tuple[int, int, str]]:
    """``(first, last, text)`` for every piece of output text, in order (``text`` may be '')."""
    rec_of = _backbone_groups(decisions)
    units: list[tuple[int, int, str]] = []
    i, n = 0, len(decisions)
    while i < n:
        d = decisions[i]
        c = d["chosen"]
        if not c.get("norm"):  # pass-through word, deleted word or rejected insertion
            units.append((i, i, c.get("surface") or ""))
            i += 1
            continue
        hit = _find_unit(decisions, i, rec_of)
        if hit is None:
            units.append((i, i, _token_text(d)))
            i += 1
        else:
            units.append((i, hit[0], hit[1]))
            i = hit[0] + 1
    return units


def _surfaces(decisions: Sequence[dict]) -> list[str]:
    """One text per decision: a word's text sits at its first decision, '' at the rest of it."""
    out = [""] * len(decisions)
    for first, _, text in _units(decisions):
        out[first] = text
    return out


def _words_text(words: Sequence[dict]) -> str:
    """Text of plain word dicts (no vote): a multi-token word present in full prints once, else its tokens."""
    parts: list[str] = []
    i, n = 0, len(words)
    while i < n:
        w = words[i]
        k = w.get("gsize") or 1
        if k > 1:
            if (w.get("gpos") == 0 and i + k <= n
                    and all(words[i + q].get("group") == w.get("group") and words[i + q].get("gpos") == q
                            for q in range(k))):
                parts.append(w.get("surface") or " ".join(x.get("norm", "") for x in words[i:i + k]))
                i += k
                continue
            parts.append(w.get("norm") or w.get("surface") or "")
        else:
            parts.append(w.get("surface") or "")
        i += 1
    return _join_surfaces(parts)


def rebuild_text(decisions: Sequence[dict]) -> str:
    """Re-join the chosen surfaces (dropped words and rejected insertions contribute nothing).

    A word that normalised to several tokens (``BAT246``, ``50%``, ``well-known``) is printed with its own
    surface, once, as long as the vote kept all its tokens (the backbone's word, or the word of a system whose
    tokens were all voted in).  If one token of it is outvoted, or only part of it was voted in, the tokens that
    remain are spelled out (``bat two hundred forty seven``) - a word is never printed twice.  Backbone words
    the vote left alone always keep the backbone's formatting.
    """
    return _join_surfaces(_surfaces(decisions))


def chosen_words(decisions: Sequence[dict]) -> list[dict]:
    """The words of the consensus text in output order, one dict per piece of non-blank text.

    Same segmentation as ``rebuild_text``.  A multi-token word that came through intact is a single dict whose
    ``norm`` joins its tokens with spaces, whose ``surface`` is the printed text and whose ``start``/``end``
    span all its tokens; every other entry is a copy of the chosen word dict with ``surface`` set to the
    printed text.
    """
    out: list[dict] = []
    for first, last, text in _units(decisions):
        if not text.strip():
            continue
        toks = [decisions[p]["chosen"] for p in range(first, last + 1) if decisions[p]["chosen"].get("norm")]
        if len(toks) > 1:
            out.append({"norm": " ".join(t["norm"] for t in toks), "surface": text, "start": toks[0].get("start"),
                        "end": toks[-1].get("end"), "probability": toks[0].get("probability")})
        else:
            w = dict(decisions[first]["chosen"])
            w["surface"] = text
            out.append(w)
    return out


def summarize(decisions: Sequence[dict]) -> dict:
    """Counts describing what ROVER did: substitutions, deletions, insertions, mean agreement."""
    voted = [d for d in decisions if not d.get("passthrough")]
    sub = sum(1 for d in voted if not d["gap"] and d["changed"] and d["chosen"]["norm"])
    dele = sum(1 for d in voted if not d["gap"] and d["changed"] and not d["chosen"]["norm"])
    ins = sum(1 for d in voted if d["gap"] and d["changed"])
    return {"decisions": len(decisions), "substituted": sub, "deleted": dele, "inserted": ins,
            "changed": sub + dele + ins,
            "mean_agreement": sum(d["agreement"] for d in voted) / len(voted) if voted else 1.0}


def disagreement_spans(decisions: Sequence[dict], max_agreement: float = 0.999, merge_gap: int = 1,
                       context: int = 6) -> list[dict]:
    """Group low-agreement decisions into spans a human can review against the audio.

    A decision is low-agreement when ``agreement <= max_agreement`` (the default flags any dissent).
    Flagged decisions separated by at most ``merge_gap`` other decisions form one span.  Each span is
    ``{start_idx, end_idx, start_time, end_time, backbone_text, rover_text, alternatives, context_before,
    context_after, min_agreement, first_decision, last_decision}`` where ``start_idx``/``end_idx`` are inclusive
    backbone word indices (an insertion counts as the word it precedes), ``alternatives`` maps every system
    whose reading of the span differs from the backbone to its text, and the context strings hold up to
    ``context`` chosen words on each side.
    """
    flagged = [p for p, d in enumerate(decisions) if not d.get("passthrough") and d["agreement"] <= max_agreement]
    groups: list[list[int]] = []
    for p in flagged:
        if groups and p - groups[-1][-1] - 1 <= merge_gap:
            groups[-1].append(p)
        else:
            groups.append([p])
    n_words = 1 + max((d["index"] for d in decisions if not d["gap"]), default=-1)
    texts = _surfaces(decisions) if groups else []  # the printed text of every decision (see rebuild_text)
    spans = []
    for g in groups:
        a, b = g[0], g[-1]
        seg = decisions[a:b + 1]
        idxs = [min(d["index"], max(n_words - 1, 0)) for d in seg]
        starts = [d["chosen"].get("start") for d in seg if d["chosen"].get("start") is not None]
        ends = [d["chosen"].get("end") for d in seg if d["chosen"].get("end") is not None]
        bb_words = [d["backbone"] for d in seg if d["backbone"] is not None]
        bb_norms = [w["norm"] for w in bb_words if w.get("norm")]
        systems = [s for d in seg for s in d["by_system"] if s != BACKBONE]
        alternatives = {}
        for s in dict.fromkeys(systems):
            words = [d["by_system"].get(s) for d in seg]
            words = [w for w in words if w is not None and w.get("norm")]
            if [w["norm"] for w in words] != bb_norms:
                alternatives[s] = _words_text(words)
        before: list[str] = []
        p = a - 1
        while p >= 0 and len(before) < context:
            s = texts[p]
            if s and s.strip():
                before.append(s)
            p -= 1
        after: list[str] = []
        p = b + 1
        while p < len(decisions) and len(after) < context:
            s = texts[p]
            if s and s.strip():
                after.append(s)
            p += 1
        spans.append({
            "start_idx": min(idxs), "end_idx": max(idxs),
            "start_time": min(starts) if starts else None, "end_time": max(ends) if ends else None,
            "backbone_text": _words_text(bb_words),
            "rover_text": _join_surfaces(_surfaces(seg)),
            "alternatives": alternatives,
            "context_before": _join_surfaces(reversed(before)),
            "context_after": _join_surfaces(after),
            "min_agreement": min(d["agreement"] for d in seg),
            "first_decision": a, "last_decision": b,
        })
    return spans


def _written_words(raw: list[dict]) -> list[dict]:
    """Glue Whisper's word pieces back into the words that were written.

    Whisper-style word lists mark the start of every word with a leading space and concatenate to the text:
    ``" $1"`` + ``",600"`` is the one word ``$1,600`` (likewise ``" All"`` + ``"-Star,"``, ``" 10"`` + ``"%"``).  When
    most entries start with whitespace, an entry that does not continues the previous one: the text is joined
    verbatim, ``start``/``end`` span the pieces and ``probability`` is their mean.  Lists in which fewer than half
    of the entries start with whitespace (words without the convention, languages written without spaces) are
    returned unchanged.
    """
    texts = [str(w.get("word", w.get("surface", w.get("text", "")))) for w in raw]
    if len(raw) < 2 or 2 * sum(t[:1].isspace() for t in texts) < len(raw):
        return raw
    out: list[dict] = []
    probs: list[list[float]] = []
    for w, t in zip(raw, texts):
        p = w.get("probability")
        if out and t and not t[:1].isspace():
            out[-1]["word"] += t
            if w.get("end") is not None:
                out[-1]["end"] = w["end"]
            if p is not None:
                probs[-1].append(float(p))
        else:
            out.append({"word": t, "start": w.get("start"), "end": w.get("end"), "probability": p})
            probs.append([float(p)] if p is not None else [])
    for w, ps in zip(out, probs):
        if len(ps) > 1:
            w["probability"] = sum(ps) / len(ps)
    return out


def make_words(source, drop_fillers: bool = True, **norm_kwargs) -> list[dict]:
    """Build ROVER word dicts from plain text or from raw words.

    ``source`` is a string (no timing), a list of strings, or a list of dicts with ``word`` (or ``surface``/
    ``text``) and optional ``start``, ``end``, ``probability`` - e.g. Whisper's word list, whose pieces without
    a leading space (``,600`` after ``$1``) are first glued to the word they continue.

    A word that normalises to several tokens (``BAT246``, ``$5.50``) becomes several dicts: the first carries
    the surface, the others have an empty surface and an equal share of the word's time span; all of them also
    carry ``group`` (the source word's index), ``gpos`` and ``gsize`` so ``rebuild_text`` can print the word once
    when the vote keeps all its tokens and spell the remaining tokens when it does not.  A word that normalises
    to nothing (a filler) becomes one pass-through dict with an empty ``norm``.  Words that a multi-word spelling
    variant swallowed (``all`` + ``right`` -> ``alright``) are folded into the word that holds the variant's
    tokens, so their text (``all right``) is never lost; ``end`` then covers the folded words as well.

    Build every system's list with one call per transcript: ``group`` ids are only unique within a call.
    """
    if isinstance(source, str):
        raw = [{"word": c} for c in source.split()]
    else:
        raw = _written_words([{"word": w} if isinstance(w, str) else w for w in source])  # strings are fine too
    chunks = [str(w.get("word", w.get("surface", w.get("text", "")))) for w in raw]
    tokens, absorbed = tokenize_chunks_ex([c.strip() for c in chunks], drop_fillers, **norm_kwargs)
    out: list[dict] = []
    n = len(raw)
    ci = 0
    while ci < n:
        w, chunk, toks = raw[ci], chunks[ci], tokens[ci]
        start, end, prob = w.get("start"), w.get("end"), w.get("probability")
        if not toks:
            out.append({"norm": "", "surface": chunk, "start": start, "end": end, "probability": prob})
            ci += 1
            continue
        nxt = ci + 1
        while nxt < n and absorbed[nxt] == ci:  # chunks this word's spelling variant swallowed
            chunk = chunk + chunks[nxt] if chunk[-1:].isspace() or chunks[nxt][:1].isspace() else chunk + " " + chunks[nxt]
            if raw[nxt].get("end") is not None:
                end = raw[nxt]["end"]
            nxt += 1
        k = len(toks)
        for j, t in enumerate(toks):
            if start is not None and end is not None:
                s_j, e_j = start + (end - start) * j / k, start + (end - start) * (j + 1) / k
            else:
                s_j, e_j = start, end
            word = {"norm": t, "surface": chunk if j == 0 else "", "start": s_j, "end": e_j, "probability": prob}
            if k > 1:  # remember which tokens came from one written word (see rebuild_text)
                word.update(group=ci, gpos=j, gsize=k)
            out.append(word)
        ci = nxt
    return out
