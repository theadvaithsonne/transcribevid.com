"""Transcript exporters and analysis. Pure functions - no I/O, easy to test.

A transcript is a list of segment dicts:
    {"id", "start", "end", "text", "words": [{"start","end","word","probability"}] | None,
     "confidence": 0..1 | None}
`word` keeps Whisper's leading space so joining works for every language, including
those written without spaces (Chinese, Japanese, ...).
"""
import re
from collections import Counter

SENTENCE_END = re.compile(r"[.!?…。！？]['\")\]]*$")
CLAUSE_END = re.compile(r"[,;:、，；：]['\")\]]*$")

EXPORT_FORMATS = {
    "txt":   ("text/plain; charset=utf-8", "txt"),
    "plain": ("text/plain; charset=utf-8", "txt"),
    "srt":   ("application/x-subrip; charset=utf-8", "srt"),
    "vtt":   ("text/vtt; charset=utf-8", "vtt"),
    "json":  ("application/json; charset=utf-8", "json"),
    "md":    ("text/markdown; charset=utf-8", "md"),
    "pdf":   ("application/pdf", "pdf"),
}


def fmt_ts(sec, style="short"):
    """short: [h:]mm:ss   srt: hh:mm:ss,mmm   vtt: hh:mm:ss.mmm"""
    ms = max(0, int(round(sec * 1000)))
    h, rem = divmod(ms, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    if style == "srt":
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    if style == "vtt":
        return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


# --------------------------------------------------------------------------- subtitles

def _tokens(seg):
    """Word tokens for a segment; synthesises evenly-spread ones when no word timing exists
    (e.g. after the user edited the text)."""
    words = seg.get("words")
    if words:
        return [dict(w) for w in words]
    parts = re.findall(r"\S+", seg["text"])
    if not parts:
        return []
    total = sum(len(p) for p in parts) or 1
    dur = max(seg["end"] - seg["start"], 0.01)
    out, t = [], seg["start"]
    for p in parts:
        d = dur * len(p) / total
        out.append({"start": t, "end": t + d, "word": " " + p})
        t += d
    return out


def _wrap(text, max_chars, max_lines):
    """Break text into at most `max_lines` balanced lines of <= max_chars where possible."""
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_chars or max_lines < 2:
        return text
    words = text.split(" ")
    if len(words) == 1:
        return text
    best, best_score = None, None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        score = max(len(a), len(b)) + (1000 if max(len(a), len(b)) > max_chars else 0)
        if best_score is None or score < best_score:
            best, best_score = f"{a}\n{b}", score
    return best


def build_cues(segments, max_chars=42, max_lines=2, max_dur=6.0, min_dur=0.8):
    """Re-flow transcript segments into readable subtitle cues (<= max_lines x max_chars,
    <= max_dur seconds), splitting at sentence ends, clauses and pauses."""
    limit = max_chars * max_lines
    cues, cur = [], []

    def flush():
        nonlocal cur
        if not cur:
            return
        text = "".join(w["word"] for w in cur).strip()
        if text:
            cues.append({"start": cur[0]["start"], "end": cur[-1]["end"],
                         "text": _wrap(text, max_chars, max_lines)})
        cur = []

    for seg in segments:
        for w in _tokens(seg):
            if cur:
                text_len = len("".join(x["word"] for x in cur).strip())
                gap = w["start"] - cur[-1]["end"]
                dur = cur[-1]["end"] - cur[0]["start"]
                prev = cur[-1]["word"].strip()
                new_len = text_len + len(w["word"])
                if (new_len > limit or dur + (w["end"] - cur[-1]["end"]) > max_dur or gap > 0.9
                        or (SENTENCE_END.search(prev) and text_len >= 12)
                        or (CLAUSE_END.search(prev) and text_len >= max_chars * 0.75)):
                    flush()
            cur.append(w)
    flush()

    # tidy timing: enforce a minimum on-screen time without overlapping the next cue
    for i, c in enumerate(cues):
        nxt = cues[i + 1]["start"] if i + 1 < len(cues) else None
        if c["end"] - c["start"] < min_dur:
            c["end"] = c["start"] + min_dur
        if nxt is not None and c["end"] > nxt:
            c["end"] = max(c["start"] + 0.2, nxt)
    return cues


def to_srt(segments, **kw):
    cues = build_cues(segments, **kw)
    return "\n".join(f"{i}\n{fmt_ts(c['start'], 'srt')} --> {fmt_ts(c['end'], 'srt')}\n{c['text']}\n"
                     for i, c in enumerate(cues, 1))


def to_vtt(segments, **kw):
    cues = build_cues(segments, **kw)
    body = "\n".join(f"{fmt_ts(c['start'], 'vtt')} --> {fmt_ts(c['end'], 'vtt')}\n{c['text']}\n"
                     for c in cues)
    return "WEBVTT\n\n" + body


# --------------------------------------------------------------------------- text

def to_txt(segments, timestamps=True):
    return "\n".join(f"[{fmt_ts(s['start'])}] {s['text']}" if timestamps else s["text"]
                     for s in segments)


def paragraphs(segments, pause=1.6, max_chars=600):
    """Group segments into readable paragraphs (new one on a long pause or at a
    sentence end once the paragraph is long)."""
    paras, cur, size, last_end = [], [], 0, None
    for s in segments:
        if cur and ((last_end is not None and s["start"] - last_end > pause)
                    or (size >= max_chars and SENTENCE_END.search(cur[-1]["text"]))):
            paras.append(cur)
            cur, size = [], 0
        cur.append(s)
        size += len(s["text"])
        last_end = s["end"]
    if cur:
        paras.append(cur)
    return paras


def to_plain(segments):
    return "\n\n".join(" ".join(s["text"] for s in p) for p in paragraphs(segments))


def to_markdown(job):
    lines = [f"# {job['title']}", ""]
    meta = [f"Language: {job.get('language') or 'unknown'}",
            f"Duration: {fmt_ts(job.get('duration') or 0)}",
            f"Model: {job.get('options', {}).get('model', '?')}"]
    lines += ["*" + " · ".join(meta) + "*", ""]
    for p in paragraphs(job["segments"]):
        lines += [f"**[{fmt_ts(p[0]['start'])}]** " + " ".join(s["text"] for s in p), ""]
    return "\n".join(lines)


def render(job, fmt, **opts):
    """Render a job in the requested export format. Returns (body, mime, extension); body is bytes for pdf."""
    segs = job["segments"]
    if fmt == "srt":
        body = to_srt(segs, **opts)
    elif fmt == "vtt":
        body = to_vtt(segs, **opts)
    elif fmt == "plain":
        body = to_plain(segs)
    elif fmt == "md":
        body = to_markdown(job)
    elif fmt == "pdf":
        from .pdf import render_pdf  # lazy: only needs fpdf2 when a PDF is actually requested
        body = render_pdf(job)
    elif fmt == "json":
        import json
        body = json.dumps({k: job.get(k) for k in
                           ("title", "filename", "language", "language_probability", "duration",
                            "options", "stats", "segments")}, ensure_ascii=False, indent=2)
    else:
        fmt, body = "txt", to_txt(segs)
    mime, ext = EXPORT_FORMATS[fmt]
    return body, mime, ext


# --------------------------------------------------------------------------- analysis

_STOP = set("""a about above after again all also am an and any are as at be because been before being
below between both but by can could did do does doing down during each few for from further had has have
having he her here hers herself him himself his how i if in into is it its itself just let me more most
my myself no nor not now of off on once only or other our ours ourselves out over own same she should so
some such than that the their theirs them themselves then there these they this those through to too under
until up very was we were what when where which while who whom why will with would you your yours yourself
yourselves dont doesnt didnt isnt arent wasnt werent cant couldnt wouldnt shouldnt im ive ill youre youve
thats theres heres whats lets gonna wanna okay yeah really like going know get got one thing things""".split())


def compute_stats(segments, duration):
    text = " ".join(s["text"] for s in segments)
    words = re.findall(r"[^\W\d_][\w'’]*", text.lower())
    speech = sum(max(0.0, s["end"] - s["start"]) for s in segments)
    confs = [s["confidence"] for s in segments if s.get("confidence") is not None]
    freq = Counter(w.replace("'", "").replace("’", "") for w in words)
    keywords = [{"word": w, "count": c} for w, c in freq.most_common(80)
                if len(w) > 3 and w not in _STOP][:12]
    return {
        "word_count": len(words),
        "segment_count": len(segments),
        "speech_seconds": round(float(speech), 1),
        "words_per_minute": round(len(words) / (speech / 60)) if speech > 5 else None,
        "avg_confidence": round(float(sum(confs) / len(confs)), 3) if confs else None,
        "low_confidence_segments": sum(1 for c in confs if c < 0.6),
        "keywords": keywords,
    }
