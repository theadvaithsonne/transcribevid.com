"""In-memory log buffer: a ring of the newest log records that feeds the Logs page, plus the one call
that wires up logging for the whole app. Nothing is ever written to disk (the app is session-only)."""
import logging
import os
import threading
from collections import deque
from itertools import islice, takewhile
from typing import Optional, Union

LEVELS = {"DEBUG": logging.DEBUG, "INFO": logging.INFO, "WARNING": logging.WARNING,
          "ERROR": logging.ERROR, "CRITICAL": logging.CRITICAL}
CONSOLE_FORMAT = "%(asctime)s %(levelname)-7s %(name)s: %(message)s"
CONSOLE_NAME = "vt-console"  # lets setup_logging() recognise its own console handler on a repeat call
# Third-party loggers whose messages are worth seeing in the Logs page (they get the ring, not a console copy).
EXTERNAL_LOGGERS = ("uvicorn.error", "faster_whisper", "huggingface_hub", "py.warnings")


def _default_size():
    try:
        n = int(os.environ.get("VT_LOG_BUFFER", ""))
    except ValueError:
        n = 0
    return n if n > 0 else 10000


class RingBufferHandler(logging.Handler):
    """Thread-safe ring of the newest records, as dicts {seq, ts, level, logger, message}.

    `seq` counts records from 1 for the life of the process and is never reset (not even by clear()),
    so a follower can always continue with `after=<last seq it saw>`. `message` is the formatted
    message with the formatted traceback appended when the record carries exc_info.
    """

    def __init__(self, maxlen: Optional[int] = None, level: int = logging.NOTSET):
        super().__init__(level)
        self._buf = deque(maxlen=max(1, int(maxlen)) if maxlen else _default_size())  # (levelno, entry)
        self._seq = 0

    @property
    def maxlen(self) -> int:
        return self._buf.maxlen

    @property
    def last_seq(self) -> int:
        """Sequence number of the newest record ever logged (0 before the first)."""
        with self.lock:
            return self._seq

    def emit(self, record):
        try:
            text = self.format(record)  # message + traceback (+ stack), exactly as the console shows it
            if not text.isascii():  # a lone surrogate would later break UTF-8 encoding of JSON/SSE output
                text = text.encode("utf-8", "backslashreplace").decode("utf-8")
            with self.lock:
                self._seq += 1
                self._buf.append((record.levelno, {"seq": self._seq, "ts": record.created,
                                                   "level": record.levelname, "logger": record.name,
                                                   "message": text}))
        except Exception:  # noqa - logging must never raise into the code that logs
            self.handleError(record)

    def query(self, after: int = 0, level: Union[str, int] = "DEBUG", q: str = "",
              limit: int = 1000) -> tuple[list[dict], int]:
        """-> (entries, last_seq). Entries are copies, oldest first.

        level: minimum level. q: case-insensitive substring of the logger name or the message.
        after == 0: the NEWEST `limit` matching entries (the tail of the log).
        after  > 0: the OLDEST `limit` matching entries with seq > after (so a client can page forward).
        last_seq is the newest seq in the whole buffer, matched or not, so a follower can resume from it.
        """
        floor = level if isinstance(level, int) else LEVELS.get(str(level).upper())
        if floor is None:
            raise ValueError(f"Unknown log level: {level!r}")
        needle = (q or "").lower()
        limit = max(0, limit)
        with self.lock:  # only snapshot under the lock; filtering happens outside so writers never wait on it
            last = self._seq
            if after > 0:
                rows = list(takewhile(lambda r: r[1]["seq"] > after, reversed(self._buf)))  # cost ~ new entries
                rows.reverse()
            else:
                rows = list(self._buf)

        def match(row):
            no, e = row
            return no >= floor and (not needle or needle in e["logger"].lower() or needle in e["message"].lower())

        if after > 0:
            hits = list(islice(filter(match, rows), limit))
        else:
            hits = list(islice(filter(match, reversed(rows)), limit))
            hits.reverse()
        return [dict(e) for _, e in hits], last

    def clear(self):
        """Forget all entries. seq keeps counting, so followers never see numbers repeat."""
        with self.lock:
            self._buf.clear()


BUFFER = RingBufferHandler()  # size from VT_LOG_BUFFER (default 10000)

_setup_lock = threading.Lock()


def setup_logging(console_level: Union[str, int] = "INFO") -> logging.Logger:
    """Wire up logging for the app; idempotent (safe to call repeatedly, e.g. under uvicorn --reload).

    Logger `vt` (everything the app logs) gets the ring buffer plus a console handler at `console_level`;
    a few third-party loggers get the ring buffer only. Returns the `vt` logger.
    """
    with _setup_lock:
        log = logging.getLogger("vt")
        console = next((h for h in log.handlers if h.get_name() == CONSOLE_NAME), None) or logging.StreamHandler()
        console.setLevel(console_level.upper() if isinstance(console_level, str) else console_level)  # ValueError if bad
        log.setLevel(logging.DEBUG)
        log.propagate = False  # the console handler below is the only console output
        log.addHandler(BUFFER)  # addHandler ignores a handler that is already attached
        if console not in log.handlers:
            console.set_name(CONSOLE_NAME)
            console.setFormatter(logging.Formatter(CONSOLE_FORMAT, "%H:%M:%S"))
            log.addHandler(console)
        for name in EXTERNAL_LOGGERS:
            logging.getLogger(name).addHandler(BUFFER)
        logging.captureWarnings(True)  # warnings.warn(...) -> logger "py.warnings"
    return log
