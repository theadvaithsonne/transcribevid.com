"""Offline analysis tools for measuring and improving speech-recognition accuracy.

Modules
-------
textnorm   normalise transcripts into comparable word tokens (digits -> words, fillers, ...)
align      word-level Levenshtein alignment (rapidfuzz, with a pure-python fallback)
metrics    WER / CER, pairwise system agreement, diff reports, bootstrap confidence intervals
consensus  ROVER-style voting of several ASR transcripts on top of one backbone transcript

Nothing here is imported by the web application; the four modules above only depend on the
standard library and (optionally, but recommended) ``rapidfuzz`` and ``numpy``.
"""

__all__ = ["textnorm", "align", "metrics", "consensus"]
