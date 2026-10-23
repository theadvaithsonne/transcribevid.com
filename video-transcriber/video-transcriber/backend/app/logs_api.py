"""Log API: read, follow (SSE) and clear the in-memory log buffer, and accept log lines from the browser."""
import asyncio
import json
import logging
import re
import threading
import time
from collections import deque
from typing import Callable, Literal, Optional

from fastapi import APIRouter, Query, Request, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .logbuffer import BUFFER, setup_logging

router = APIRouter(prefix="/api/logs", tags=["logs"])         # read / follow / clear: operator only (main.py guards it)
client_router = APIRouter(prefix="/api/logs", tags=["logs"])  # browser error reports: anyone, rate limited

Level = Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
POLL_SECONDS = 0.25       # how often a stream looks for new entries
KEEPALIVE_SECONDS = 10.0  # an idle stream sends a comment at least this often (proxies drop silent connections)
STREAM_BATCH = 500        # entries per poll; a bigger backlog is sent in consecutive batches

MAX_MESSAGE, MAX_CONTEXT = 4000, 1000
CLIENT_RATE = 100         # browser log lines accepted per second (extras are dropped)
_CONTROL = re.compile(r"[\x00-\x08\x0a-\x1f\x7f-\x9f]")  # control characters except tab
_CLIENT_LEVELS = {"DEBUG": logging.DEBUG, "INFO": logging.INFO, "WARNING": logging.WARNING,
                  "WARN": logging.WARNING, "ERROR": logging.ERROR, "CRITICAL": logging.CRITICAL,
                  "FATAL": logging.CRITICAL}


class _RateLimit:
    """Allows at most `n` hits in any sliding window of `per` seconds."""

    def __init__(self, n: int, per: float, clock: Optional[Callable[[], float]] = None):
        self.per, self.clock = per, clock  # clock: injectable for tests; default time.monotonic
        self._hits = deque(maxlen=n)
        self._lock = threading.Lock()

    def allow(self):
        now = (self.clock or time.monotonic)()
        with self._lock:
            if len(self._hits) == self._hits.maxlen and now - self._hits[0] < self.per:
                return False
            self._hits.append(now)
            return True

    def reset(self):
        with self._lock:
            self._hits.clear()


_client_limit = _RateLimit(CLIENT_RATE, 1.0)


class ClientLog(BaseModel):
    """A log line from the browser. Over-long text is truncated, never rejected, so no line is lost."""
    level: str = "INFO"
    message: str
    context: Optional[str] = None


def _clean(text: str, limit: int) -> str:
    return _CONTROL.sub("", text)[:limit]


def _ensure_wired():
    """The router must work even if the app never called setup_logging(): make vt.* reach the buffer."""
    if BUFFER not in logging.getLogger("vt").handlers:
        setup_logging()


@router.get("")
def read_logs(after: int = 0, level: Level = "DEBUG", q: str = Query("", max_length=200),
              limit: int = Query(1000, ge=1, le=5000)):
    """after=0: the newest `limit` entries; after>0: entries newer than that seq, oldest first (page forward).
    `last_seq` is the newest seq in the buffer even when nothing matched."""
    entries, last_seq = BUFFER.query(after=after, level=level, q=q, limit=limit)
    return {"entries": entries, "last_seq": last_seq}


@router.get("/stream")
async def stream_logs(request: Request, after: int = 0, level: Level = "DEBUG"):
    """Server-Sent Events: one `log` event per new entry (seq > after; with after=0 only entries from now on).
    Idle streams send `: keep-alive` comments, and a stream ends as soon as the client is gone."""
    # fixed now, not when the first chunk is produced, so nothing logged from this moment on is missed
    last = BUFFER.last_seq
    cursor = last if after <= 0 else min(after, last)

    async def events():
        nonlocal cursor
        quiet_since = time.monotonic()
        while not await request.is_disconnected():
            entries, newest = BUFFER.query(after=cursor, level=level, limit=STREAM_BATCH)
            full = len(entries) == STREAM_BATCH
            cursor = entries[-1]["seq"] if full else newest  # entries skipped by the level filter are passed too
            if entries:
                quiet_since = time.monotonic()
                yield "".join(f"event: log\ndata: {json.dumps(e, ensure_ascii=False)}\n\n" for e in entries)
                if full:
                    continue  # more are waiting
            elif time.monotonic() - quiet_since >= KEEPALIVE_SECONDS:
                quiet_since = time.monotonic()
                yield ": keep-alive\n\n"
            await asyncio.sleep(POLL_SECONDS)

    return StreamingResponse(events(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.delete("", status_code=204, response_class=Response)
def clear_logs():
    """Empty the buffer (sequence numbers keep counting)."""
    BUFFER.clear()
    _ensure_wired()
    logging.getLogger("vt.logs").info("Log buffer cleared")  # after the clear, so it is the first new entry
    return Response(status_code=204)


@client_router.post("/client", status_code=204, response_class=Response)
def client_log(body: ClientLog):
    """A log line from the browser -> logger `vt.client` (control characters stripped, text truncated).
    More than 100 per second are dropped (still 204) so a runaway client cannot flood the buffer."""
    if _client_limit.allow():
        _ensure_wired()
        text = _clean(body.message, MAX_MESSAGE)
        context = _clean(body.context or "", MAX_CONTEXT)
        if context:
            text = f"{text} | {context}"
        level = _CLIENT_LEVELS.get(body.level.strip().upper(), logging.INFO)
        logging.getLogger("vt.client").log(level, "%s", text)
    return Response(status_code=204)
