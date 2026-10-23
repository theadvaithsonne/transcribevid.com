"""The website-wide "videos transcribed" counter.

It is ONE integer: how many uploaded files this website has transcribed so far, plus the time it last
changed. Nothing about visitors is stored - no ids, no IP addresses, no file names, no sessions - so the
number is not personal data. It is the only thing the app keeps between runs besides the Whisper model cache.

* Counted exactly once per uploaded file, when its job first reaches "done" (see JobStore._count_once).
* Only when `config.COUNT_JOBS` is on: VT_COUNT_JOBS=auto counts in public mode only, so a local copy never counts.
* Persisted to `config.STATS_FILE` (VT_STATS_FILE) with an atomic write (temp file in the same folder, fsync,
  os.replace), so a crash or power loss leaves either the old or the new number, never half a file.
* A missing file means 0. A corrupt file means 0 and is renamed to `<name>.corrupt`; the server never crashes
  because of it. If the file cannot be written the count stays in memory and the server keeps serving.
"""
import json
import logging
import os
import tempfile
import threading
from datetime import datetime, timezone
from pathlib import Path

from . import config

log = logging.getLogger("vt.stats")


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


class Counter:
    """Thread-safe counter of one integer, persisted to a small JSON file."""

    def __init__(self, path):
        self.path = Path(path)
        self._lock = threading.Lock()
        self._total = 0
        self._updated_at = None
        self._persist = True  # False when an existing file could not be read: never overwrite what we cannot see
        self._load()

    @property
    def total(self) -> int:
        """Current count. A plain read of an int (atomic in CPython): cheap enough for every page view."""
        return self._total

    @property
    def updated_at(self):
        return self._updated_at

    # ------------------------------------------------------------------ load
    def _load(self):
        try:
            raw = self.path.read_text(encoding="utf-8")
        except FileNotFoundError:
            return  # first run: 0
        except OSError as e:  # unreadable (permissions, it is a directory, ...): serve 0, keep the file untouched
            self._persist = False
            log.warning("transcription counter: cannot read %s (%s); counting in memory only", self.path, e)
            return
        except ValueError:  # not valid UTF-8
            self._quarantine("not valid text")
            return
        try:
            data = json.loads(raw)
            if not isinstance(data, dict):
                raise ValueError("not a JSON object")
            n = data["transcribed"]
            if isinstance(n, bool) or not isinstance(n, int) or n < 0:
                raise ValueError("'transcribed' must be a non-negative integer")
        except (ValueError, KeyError, RecursionError) as e:
            self._quarantine(e)
            return
        self._total = n
        updated = data.get("updated_at")
        self._updated_at = updated if isinstance(updated, str) else None
        log.info("transcription counter: %d video(s) transcribed so far (%s)", n, self.path)

    def _quarantine(self, why):
        """Move a corrupt file out of the way (kept for inspection) and start again from 0."""
        target = self.path.with_name(self.path.name + ".corrupt")
        try:
            os.replace(self.path, target)
            log.warning("transcription counter: %s is corrupt (%s); moved to %s and starting from 0",
                        self.path, why, target.name)
        except OSError as e:
            self._persist = False  # could not move it aside: do not overwrite it either
            log.warning("transcription counter: %s is corrupt (%s) and could not be moved aside (%s); "
                        "counting in memory only", self.path, why, e)

    # ------------------------------------------------------------------ count
    def increment(self) -> int:
        """Add one and persist. Returns the new total. Never raises: a failed write only logs a WARNING."""
        with self._lock:
            self._total += 1
            self._updated_at = _now_iso()
            self._save()
            return self._total

    def _save(self):
        if not self._persist:
            log.warning("transcription counter: not saved to %s (the existing file could not be read or moved "
                        "aside); the count of %d is kept in memory", self.path, self._total)
            return
        tmp = None
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            fd, tmp = tempfile.mkstemp(dir=self.path.parent, prefix=self.path.name + ".", suffix=".tmp")
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump({"transcribed": self._total, "updated_at": self._updated_at}, f)
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp, self.path)
            tmp = None
            self._sync_dir()
        except OSError as e:
            log.warning("transcription counter: could not write %s (%s); the count of %d is kept in memory",
                        self.path, e, self._total)
        finally:
            if tmp:
                try:
                    os.unlink(tmp)
                except OSError:
                    pass

    def _sync_dir(self):
        """Make the rename itself durable (POSIX only; best effort)."""
        if os.name == "nt":
            return
        try:
            fd = os.open(self.path.parent, os.O_RDONLY)
            try:
                os.fsync(fd)
            finally:
                os.close(fd)
        except OSError:
            pass


# ---------------------------------------------------------------------------- the process-wide counter

_counter = None
_counter_lock = threading.Lock()


def get_counter() -> Counter:
    """The counter for `config.STATS_FILE`, loaded on first use (and again if that setting changes, as in tests)."""
    global _counter
    path = Path(config.STATS_FILE)
    c = _counter
    if c is None or c.path != path:
        with _counter_lock:
            if _counter is None or _counter.path != path:
                _counter = Counter(path)
            c = _counter
    return c


def reset():
    """Forget the loaded counter (the next use reloads it from the file). For tests."""
    global _counter
    with _counter_lock:
        _counter = None


def total() -> int:
    """What /api/stats shows: the count, or 0 whenever counting is off (a local copy must never show a number)."""
    return get_counter().total if config.COUNT_JOBS else 0


def record_transcription():
    """Count one finished upload. Returns the new total, or None when counting is off or it failed."""
    if not config.COUNT_JOBS:
        return None
    try:
        n = get_counter().increment()
    except Exception:  # noqa - a statistics problem must never fail a transcription
        log.exception("transcription counter: could not count a finished job")
        return None
    log.info("transcription counter: %d video(s) transcribed", n)
    return n
