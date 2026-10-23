"""Tiny in-memory sliding-window rate limiter (per key, e.g. client IP). Nothing is persisted."""
import threading
import time
from collections import deque


class RateLimiter:
    def __init__(self, max_hits: int, per_seconds: float, clock=time.monotonic):
        self.max_hits, self.per, self.clock = max_hits, per_seconds, clock
        self._hits: dict[str, deque] = {}
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        """Record a hit for `key`; False when it already used up its allowance in the window."""
        if self.max_hits <= 0:
            return True
        now = self.clock()
        with self._lock:
            q = self._hits.setdefault(key, deque())
            while q and now - q[0] > self.per:
                q.popleft()
            if len(q) >= self.max_hits:
                return False
            q.append(now)
            if len(self._hits) > 5000:  # forget idle keys so a scan of many IPs cannot grow memory without bound
                for k in [k for k, v in self._hits.items() if not v or now - v[-1] > self.per]:
                    self._hits.pop(k, None)
            return True

    def retry_after(self, key: str) -> int:
        with self._lock:
            q = self._hits.get(key)
            if not q or len(q) < self.max_hits:
                return 0
            return max(1, int(self.per - (self.clock() - q[0])) + 1)
