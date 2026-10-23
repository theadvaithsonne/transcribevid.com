"""Per-visitor sessions.

Every browser gets its own isolated JobStore (jobs, uploaded media) behind an unguessable
cookie. Sessions share ONE transcription worker (jobs of all visitors run first come, first served).
A session is deleted - media, transcripts, everything - when its visitor asks for it, when it has been
idle for `SESSION_IDLE_MINUTES` with no work in progress, or when the app stops. Nothing outlives that.
"""
import atexit
import logging
import re
import secrets
import shutil
import threading
import time
import uuid

from . import config
from .jobs import LOCK_NAME, Busy, JobStore, Scheduler, _try_lock

log = logging.getLogger("vt.sessions")
COOKIE_NAME = "tv_sid"
SID_RE = re.compile(r"[0-9a-f]{32}")


class Session:
    def __init__(self, sid: str, store: JobStore):
        self.id = sid
        self.store = store
        self.created_at = time.time()
        self.last_seen = self.created_at

    @property
    def short_id(self):
        return self.id[:12]

    def touch(self):
        self.last_seen = time.time()

    def idle_seconds(self, now=None):
        """Seconds since the visitor last did anything (a request, or one of their jobs finishing)."""
        return (now or time.time()) - max(self.last_seen, self.store.last_activity)


class SessionManager:
    def __init__(self, root=None, idle_minutes=None, max_sessions=None, start_reaper=True):
        self.idle_seconds = (idle_minutes if idle_minutes is not None else config.SESSION_IDLE_MINUTES) * 60
        self.max_sessions = max_sessions if max_sessions is not None else config.MAX_SESSIONS
        self.started_at = time.time()
        self.instance_id = uuid.uuid4().hex[:12]
        if root is None:
            JobStore.purge_stale_sessions()  # leftovers of crashed/killed instances (never a live one)
            self.root = config.SESSION_ROOT / self.instance_id
        else:
            self.root = root
        self.root.mkdir(parents=True, exist_ok=True)
        self._lock_file = open(self.root / LOCK_NAME, "a+b")  # marks the folder as ours and alive
        if self._lock_file.tell() == 0:
            self._lock_file.write(b"x")
            self._lock_file.flush()
        _try_lock(self._lock_file)
        self.scheduler = Scheduler()
        self.sessions: dict[str, Session] = {}
        self.lock = threading.RLock()
        self._stop = threading.Event()
        self._closed = False
        self.reaper = None
        if start_reaper:
            self.reaper = threading.Thread(target=self._reap_loop, name="session-reaper", daemon=True)
            self.reaper.start()
        atexit.register(self.close)
        log.info("session manager ready: idle timeout %d min, max %d sessions, scratch %s",
                 self.idle_seconds // 60, self.max_sessions, self.root)

    # ------------------------------------------------------------------ lookup / creation
    def get(self, sid):
        if not sid or not SID_RE.fullmatch(sid):
            return None
        with self.lock:
            return self.sessions.get(sid)

    def create(self) -> Session:
        with self.lock:
            if self._closed:
                raise Busy("The server is shutting down.", status=503)
            if len(self.sessions) >= self.max_sessions:
                self._reap_locked()
                if len(self.sessions) >= self.max_sessions:
                    log.warning("refusing a new session: %d/%d in use", len(self.sessions), self.max_sessions)
                    raise Busy("The server is full right now. Please try again in a few minutes.", status=503)
            sid = secrets.token_hex(16)
            sess = Session(sid, self._new_store(sid))
            self.sessions[sid] = sess
        log.info("new session %s (%d active)", sess.short_id, len(self.sessions))
        return sess

    def _new_store(self, sid):
        return JobStore(self.root / sid, scheduler=self.scheduler, instance=False, session_id=sid[:12])

    # ------------------------------------------------------------------ ending sessions
    def reset(self, sess: Session):
        """'Delete my data now': wipe everything of this visitor; the session itself (cookie) stays valid."""
        with self.lock:
            old = sess.store
            n = len(old.jobs)
            old.close(kill_ffmpeg=False)  # cancels what is running, deletes the media
            sess.store = self._new_store(sess.id)
            sess.touch()
        log.info("session %s: all data deleted on request (%d job(s))", sess.short_id, n)

    def _drop(self, sess: Session, why: str):
        self.sessions.pop(sess.id, None)
        n = len(sess.store.jobs)
        sess.store.close(kill_ffmpeg=False)
        log.info("session %s ended (%s): %d job(s) and all media deleted; %d session(s) left",
                 sess.short_id, why, n, len(self.sessions))

    def reap(self, now=None) -> int:
        with self.lock:
            return self._reap_locked(now)

    def _reap_locked(self, now=None) -> int:
        now = now or time.time()
        dead = [s for s in self.sessions.values()
                if s.store.active_jobs() == 0 and s.idle_seconds(now) > self.idle_seconds]
        for s in dead:
            self._drop(s, f"idle for {int(s.idle_seconds(now) // 60)} min")
        return len(dead)

    def _reap_loop(self):
        interval = max(1.0, min(30.0, self.idle_seconds / 4))
        while not self._stop.wait(interval):
            try:
                self.reap()
            except Exception:  # noqa - the reaper must survive anything
                log.exception("session reaper failed")

    # ------------------------------------------------------------------ info / shutdown
    def stats(self):
        with self.lock:
            return {"sessions": len(self.sessions), "jobs": sum(len(s.store.jobs) for s in self.sessions.values()),
                    "pending": self.scheduler.pending}

    def expires_in(self, sess: Session) -> int:
        return max(0, int(self.idle_seconds - sess.idle_seconds()))

    def close(self):
        if self._closed:
            return
        self._closed = True
        atexit.unregister(self.close)
        self._stop.set()
        with self.lock:
            sessions = list(self.sessions.values())
            self.sessions.clear()
        from . import engine
        for s in sessions:
            s.store.close(kill_ffmpeg=False)
        engine.kill_all()
        try:
            self._lock_file.close()
        except OSError:
            pass
        for _ in range(5):
            shutil.rmtree(self.root, ignore_errors=True)
            if not self.root.exists():
                break
            time.sleep(0.2)
        engine.purge_undeleted()
        log.info("session manager closed: %d session(s) deleted", len(sessions))
