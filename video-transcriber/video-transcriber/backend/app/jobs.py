"""One visitor's session: jobs and uploaded media.

Everything here lives only as long as the session: jobs, uploaded media and transcripts are held
in memory / in a scratch directory that is wiped when the session ends (visitor closes it, goes idle, or
the app stops). Nothing is ever saved for a later session.

A JobStore is one session. sessions.py runs many of them side by side (one per visitor) on top of ONE
shared Scheduler, so jobs of all visitors run one at a time (Whisper already uses every CPU core).
Used on its own (tests, simple scripts) a JobStore brings its own scheduler.

Several app instances may run side by side: an instance's folder holds a lock file that its owner keeps
locked for as long as it lives, and a starting instance only removes folders whose lock is free (their
owner is gone). Folders without our lock file are never touched.
"""
import atexit
import logging
import os
import queue
import re
import shutil
import threading
import time
import uuid
from pathlib import Path

from . import config, engine, formats, stats, backends
from .worker import ProcessWorker

log = logging.getLogger("vt.jobs")
LOCK_NAME = ".vt-session.lock"


def _try_lock(f) -> bool:
    """Take an exclusive, non-blocking lock on the open file; False if another process holds it."""
    try:
        if os.name == "nt":
            import msvcrt
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return True
    except OSError:
        return False


def _unlock(f):
    try:
        if os.name == "nt":
            import msvcrt
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl
            fcntl.flock(f, fcntl.LOCK_UN)
    except OSError:
        pass


class Busy(Exception):
    """The server (or this visitor's quota) cannot take more work right now. `status` is the HTTP code."""

    def __init__(self, message, status=429):
        super().__init__(message)
        self.status = status


class Scheduler:
    """One worker thread running the jobs of every session, first come first served."""

    def __init__(self, name="transcriber"):
        self.queue = queue.Queue()
        self.pending = 0  # waiting + running, all sessions
        self._lock = threading.Lock()
        self._closed = threading.Event()
        self.worker = ProcessWorker()
        self.thread = threading.Thread(target=self._work, name=name, daemon=True)
        self.thread.start()

    def submit(self, store, job_id):
        with self._lock:
            self.pending += 1
        self.queue.put((store, job_id))

    def close(self):
        self._closed.set()
        self.queue.put(None)
        self.thread.join(timeout=5)

    def _work(self):
        while True:
            item = self.queue.get()
            if item is None:
                self.worker.close()
                return
            store, job_id = item
            try:
                store._process(job_id)
            except BaseException:  # noqa - the worker must never die
                log.exception("scheduler: job %s crashed", job_id[:8])
            finally:
                with self._lock:
                    self.pending -= 1


JOB_ID_RE = re.compile(r"[0-9a-f]{32}")
BROWSER_PLAYABLE = {".mp4", ".m4v", ".webm", ".ogv", ".mp3", ".wav", ".ogg", ".oga", ".m4a", ".aac",
                    ".flac", ".opus"}
AUDIO_EXT = {".mp3", ".wav", ".ogg", ".oga", ".m4a", ".aac", ".flac", ".opus", ".wma", ".amr"}

# Fields shown in the history list (the full job additionally carries segments and stats).
SUMMARY_FIELDS = ("id", "title", "filename", "status", "phase", "progress", "eta_seconds", "error", "cancel_requested",
                  "created_at", "started_at", "finished_at", "language", "duration", "size_bytes",
                  "media_kind", "options", "segment_count")


class JobStore:
    def __init__(self, root: Path = None, start_worker=True, scheduler: "Scheduler" = None, instance=True,
                 session_id=None):
        """root: this session's folder (default: a fresh one under data/session). scheduler: a shared worker
        (sessions.py); without one, `start_worker` gives the store its own. instance=False: the caller (the
        SessionManager) owns the lock file and cleanup of the parent folder."""
        self.session_id = session_id or uuid.uuid4().hex[:12]
        self.started_at = time.time()
        if root is None:
            self.purge_stale_sessions()
            self.root = config.SESSION_ROOT / self.session_id
        else:
            self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)
        self._lock_file = None
        if instance:
            self._lock_file = open(self.root / LOCK_NAME, "a+b")  # held (locked) until close()
            self._lock_file.write(b"x") if self._lock_file.tell() == 0 else None
            self._lock_file.flush()
            _try_lock(self._lock_file)
        self.tmp_dir = self.root / "tmp"  # decoded audio lives inside the session folder too
        self.tmp_dir.mkdir(parents=True, exist_ok=True)
        self.jobs = {}
        self.last_activity = time.time()  # bumped when one of our jobs finishes (the reaper uses it)
        self.lock = threading.RLock()
        self.queue = queue.Queue()  # only used when there is no scheduler (tests inspect it)
        self._cancel = set()
        self._closing = False
        self._scheduler = scheduler or (Scheduler() if start_worker else None)
        self._owns_scheduler = scheduler is None and start_worker
        if instance:
            atexit.register(self.close)
        log.info("session %s started - nothing is saved; all data is discarded when it ends "
                 "(scratch dir: %s)", self.session_id, self.root)

    def _enqueue(self, job_id):
        if self._scheduler:
            self._scheduler.submit(self, job_id)
        else:
            self.queue.put(job_id)

    def queue_position(self):
        return self._scheduler.pending if self._scheduler else self.queue.qsize()

    def active_jobs(self):
        with self.lock:
            return sum(1 for j in self.jobs.values() if j["status"] in ("queued", "running"))

    def _check_quota(self):
        """Public-mode limits: raise Busy / OSError instead of accepting work the server cannot carry."""
        if config.MAX_JOBS_PER_SESSION and len(self.jobs) >= config.MAX_JOBS_PER_SESSION:
            raise Busy(f"You already have {len(self.jobs)} transcripts in this session. Delete some to add more.")
        sched = self._scheduler
        if config.MAX_QUEUE and sched and sched.pending >= config.MAX_QUEUE:
            raise Busy("The server is busy right now. Please try again in a few minutes.")
        if config.MIN_FREE_GB and shutil.disk_usage(self.root).free < config.MIN_FREE_GB * 2**30:
            raise OSError("The server is low on disk space right now. Please try again later.")

    @staticmethod
    def purge_stale_sessions():
        """Remove session folders whose owner is gone (crash, kill, closed terminal). Folders that are
        still locked by a live instance, or that are not ours (no lock file), are left alone."""
        root = config.SESSION_ROOT
        if not root.is_dir():
            return
        for d in root.iterdir():
            lock = d / LOCK_NAME
            if not d.is_dir() or not lock.is_file():
                continue
            try:
                f = open(lock, "r+b")
            except OSError:
                continue
            try:
                if not _try_lock(f):
                    continue  # a running instance owns it
                _unlock(f)
            finally:
                f.close()
            log.info("removing leftovers of an earlier session: %s", d.name)
            for _ in range(3):  # a just-killed owner may still release its files for a moment
                shutil.rmtree(d, ignore_errors=True)
                if not d.exists():
                    break
                time.sleep(0.2)

    # ------------------------------------------------------------------ paths
    def dir(self, job_id):
        if not JOB_ID_RE.fullmatch(job_id):
            raise KeyError(job_id)
        return self.root / job_id

    def media_path(self, job):
        return self.dir(job["id"]) / job["media_file"]

    @staticmethod
    def _touch(job):
        job["version"] = job.get("version", 0) + 1

    def close(self, kill_ffmpeg=True):
        """End the session: stop work and erase every trace of it. Safe to call twice."""
        if self._closing:
            return
        self._closing = True
        atexit.unregister(self.close)
        with self.lock:
            n = len(self.jobs)
            for jid, j in self.jobs.items():
                if j["status"] == "running":
                    self._cancel.add(jid)
                elif j["status"] == "queued":
                    j["status"] = "cancelled"
        deadline = time.time() + 5
        while time.time() < deadline and any(j["status"] == "running" for j in list(self.jobs.values())):
            time.sleep(0.1)
        if self._owns_scheduler:
            self._scheduler.close()
        if kill_ffmpeg:
            engine.kill_all()  # an ffmpeg still decoding would keep its files open
        if self._lock_file:
            try:
                self._lock_file.close()  # releases the lock
            except OSError:
                pass
        for _ in range(5):
            shutil.rmtree(self.root, ignore_errors=True)
            if not self.root.exists():
                break
            time.sleep(0.2)
        engine.purge_undeleted()
        log.info("session %s closed: %d job(s) and all media discarded%s", self.session_id, n,
                 "" if not self.root.exists() else f" (WARNING: {self.root} could not be fully removed)")

    # ------------------------------------------------------------------ jobs
    async def create(self, chunks, filename, options, expected_size=0):
        """Stream an upload (async iterator of bytes) straight to its final place on disk -
        no temp copy - and enqueue it."""
        from starlette.concurrency import run_in_threadpool
        if self._closing:
            raise OSError("The app is shutting down.")
        self._check_quota()
        free = shutil.disk_usage(self.root).free
        if expected_size and expected_size * 1.1 > free:
            log.error("upload refused: need %.1f GB, only %.1f GB free on %s",
                      expected_size / 2**30, free / 2**30, self.root)
            raise OSError(f"Not enough free disk space on the drive that holds {self.root} "
                          f"(need {expected_size / 2**30:.1f} GB, have {free / 2**30:.1f} GB).")
        job_id = uuid.uuid4().hex
        d = self.dir(job_id)
        d.mkdir(parents=True)
        ext = Path(filename).suffix.lower()[:10] or ".bin"
        ext = ext if re.fullmatch(r"\.[a-z0-9]+", ext) else ".bin"
        media_name = "media" + ext
        written, t0 = 0, time.perf_counter()
        log.info("upload started: %r (%s expected) -> job %s", filename,
                 f"{expected_size / 2**20:.1f} MB" if expected_size else "size unknown", job_id[:8])
        try:
            with open(d / media_name, "wb") as out:
                async for chunk in chunks:
                    written += len(chunk)
                    if written > config.MAX_UPLOAD_BYTES:
                        raise ValueError(f"File is larger than the {config.MAX_UPLOAD_BYTES // 2**20} MB limit.")
                    await run_in_threadpool(out.write, chunk)
            if written == 0:
                raise ValueError("The uploaded file is empty.")
        except BaseException as e:  # bad input, disk full, client went away...: leave nothing behind
            log.warning("upload of %r failed after %.1f MB: %s", filename, written / 2**20,
                        e.__class__.__name__ if not str(e) else e)
            shutil.rmtree(d, ignore_errors=True)
            raise
        elapsed = max(time.perf_counter() - t0, 1e-6)
        with self.lock:
            job = self._new_job(job_id, filename, media_name, written, options)
            self.jobs[job_id] = job
        self._enqueue(job_id)
        log.info("upload complete: %r %.1f MB in %.1fs (%.0f MB/s) -> queued job %s (%d in line, model=%s, language=%s)",
                 filename, written / 2**20, elapsed, written / 2**20 / elapsed, job_id[:8],
                 self.queue_position(), job["options"].get("model"), job["options"].get("language") or "auto")
        return job

    def _new_job(self, job_id, filename, media_name, size, options, origin=None):
        """`origin` = id of the first job made from this upload: re-runs share it, so the upload is counted once."""
        ext = Path(media_name).suffix
        return {
            "id": job_id, "title": Path(filename).stem or "Untitled", "filename": filename,
            "media_file": media_name, "size_bytes": size,
            "origin": origin or job_id, "counted": False,  # bookkeeping for the "videos transcribed" counter
            "media_kind": "audio" if ext in AUDIO_EXT else "video",
            "playable": ext in BROWSER_PLAYABLE,
            "status": "queued", "phase": None, "progress": 0.0, "eta_seconds": None, "error": None, "cancel_requested": False,
            "created_at": time.time(), "started_at": None, "finished_at": None,
            "language": None, "language_probability": None, "duration": None,
            "options": {**engine.DEFAULT_OPTIONS, **{k: v for k, v in options.items()}},
            "segments": [], "segment_count": 0, "stats": None, "version": 0,
        }

    def get(self, job_id):
        return self.jobs.get(job_id)

    def summaries(self):
        with self.lock:
            rows = [{k: j.get(k) for k in SUMMARY_FIELDS} for j in self.jobs.values()]
        return sorted(rows, key=lambda r: r["created_at"], reverse=True)

    def rerun(self, job_id, options):
        """Transcribe the same media again (e.g. with a bigger model) as a new job."""
        src = self.get(job_id)
        if not src:
            raise KeyError(job_id)
        if src["status"] in ("queued", "running"):
            raise ValueError("This job is still in progress.")
        self._check_quota()
        new_id = uuid.uuid4().hex
        d = self.dir(new_id)
        d.mkdir(parents=True)
        try:
            for name in (src["media_file"], "preview.mp3"):
                if (self.dir(job_id) / name).exists():
                    self._link_or_copy(self.dir(job_id) / name, d / name)
            if not (d / src["media_file"]).exists():
                raise KeyError(job_id)  # the source was deleted meanwhile
        except BaseException:  # disk full, source vanished...: leave no orphan folder behind
            shutil.rmtree(d, ignore_errors=True)
            raise
        with self.lock:
            job = self._new_job(new_id, src["filename"], src["media_file"], src["size_bytes"],
                                {**src["options"], **options}, origin=src.get("origin", src["id"]))
            job["counted"] = bool(src.get("counted"))  # a re-run of a counted upload is never counted again
            job["title"] = src["title"]
            self.jobs[new_id] = job
        self._enqueue(new_id)
        log.info("re-transcribe: job %s -> new job %s (model=%s, language=%s)", job_id[:8], new_id[:8],
                 job["options"].get("model"), job["options"].get("language") or "auto")
        return job

    @staticmethod
    def _link_or_copy(src, dst):
        try:
            os.link(src, dst)  # same bytes, no extra disk space (media is never modified)
        except OSError:
            shutil.copy2(src, dst)

    def snapshot(self, job_id, with_segments=True):
        """Consistent copy of a job, taken under the lock (the worker mutates the live dict)."""
        job = self.get(job_id)
        if not job:
            return None
        with self.lock:
            out = {k: v for k, v in job.items() if k != "segments"}
            if with_segments:
                out["segments"] = list(job["segments"])
        return out

    def segments_since(self, job_id, start):
        with self.lock:
            job = self.jobs.get(job_id)
            return list(job["segments"][start:]) if job else []

    def cancel(self, job_id):
        job = self.get(job_id)
        if not job:
            raise KeyError(job_id)
        with self.lock:
            if job["status"] == "queued":
                log.info("job %s cancelled while queued", job_id[:8])
                self._finish(job, "cancelled")
            elif job["status"] == "running":
                log.info("job %s: cancel requested (stopping inference worker)", job_id[:8])
                self._cancel.add(job_id)
                job["cancel_requested"] = True
                self._touch(job)
        return job

    def delete(self, job_id):
        job = self.get(job_id)
        if not job:
            raise KeyError(job_id)
        with self.lock:
            if job["status"] == "running":
                self._cancel.add(job_id)
                log.info("job %s: delete refused while running (cancel requested)", job_id[:8])
                raise ValueError("Cancel the running job first.")
            job["status"] = "cancelled"  # a queued job is skipped by the worker
            self.jobs.pop(job_id, None)
        shutil.rmtree(self.dir(job_id), ignore_errors=True)
        log.info("job %s deleted (%r)", job_id[:8], job["title"])

    def update_title(self, job_id, title):
        job = self.get(job_id)
        if not job:
            raise KeyError(job_id)
        with self.lock:
            job["title"] = title.strip()[:200] or job["title"]
            self._touch(job)
        log.info("job %s renamed to %r", job_id[:8], job["title"])
        return job

    def update_segments(self, job_id, edits):
        """Apply user edits. `edits` = [{id, text, start?, end?}] for the segments that changed;
        a segment may also carry "deleted": true. Word timings are dropped for edited text."""
        job = self.get(job_id)
        if not job:
            raise KeyError(job_id)
        if job["status"] != "done":
            raise ValueError("The transcript is not finished yet.")
        by_id = {e["id"]: e for e in edits}
        with self.lock:
            new, changed, removed = [], 0, 0
            for s in job["segments"]:
                e = by_id.get(s["id"])
                if e and e.get("deleted"):
                    removed += 1
                    continue
                if e:
                    text = e["text"].strip()
                    if text != s["text"]:
                        s["text"], s["words"] = text, None
                        s["edited"] = True
                        changed += 1
                    s["start"] = max(0.0, float(e.get("start", s["start"])))
                    s["end"] = max(s["start"] + 0.1, float(e.get("end", s["end"])))
                new.append(s)
            job["segments"] = new
            job["segment_count"] = len(new)
            job["stats"] = formats.compute_stats(new, job["duration"])
            self._touch(job)
        log.info("job %s edited: %d segment(s) changed, %d deleted", job_id[:8], changed, removed)
        return job

    def restyle(self, job_id, output_script=None, romanizer=None):
        import copy
        from .hinglish import restyle_segment
        job = self.get(job_id)
        if not job:
            raise KeyError(job_id)
        with self.lock:
            if job["status"] not in ("done", "cancelled"):
                raise ValueError("Wait for transcription to finish or cancel it before changing its style.")
            if job["options"]["task"] == "translate":
                raise ValueError("This transcript is an English translation; its script cannot be changed.")
            script = output_script or job["options"]["output_script"]
            method = romanizer or job["options"].get("romanizer", "auto")
            version = job["version"]
            source, language = copy.deepcopy(job["segments"]), job["language"]
        # Model inference must not hold the store lock or block another job's cancellation.
        segments = [restyle_segment(s, script, method) if language in ("hi", "en") else dict(s) for s in source]
        with self.lock:
            if self.get(job_id) is not job or job["version"] != version:
                raise ValueError("The transcript changed during conversion. Try applying the style again.")
            job["segments"] = segments
            job["options"] = {**job["options"], "output_script": script, "romanizer": method}
            job["stats"] = formats.compute_stats(segments, job["duration"])
            self._touch(job)
        return job

    # ------------------------------------------------------------------ worker
    def _finish(self, job, status, error=None):
        job.update(status=status, error=error, phase=None, eta_seconds=None, cancel_requested=False,
                   finished_at=time.time())
        self.last_activity = job["finished_at"]
        if status == "done":
            job["progress"] = 1.0
        self._touch(job)

    def _count_once(self, job):
        """Add a finished upload to the website-wide counter (stats.py) - exactly once per uploaded file, and only
        when counting is on (public site). Not for errors or cancels (this runs only on "done"). A re-run
        shares `origin` with the job it came from, so it is not counted again; if the first run failed or was
        cancelled, the first re-run that succeeds is the one that counts. Called with self.lock held, so a client
        that sees "done" can already see the new total."""
        if not config.COUNT_JOBS or job.get("counted"):
            return
        for other in self.jobs.values():  # siblings (re-runs of the same upload) must not count again either
            if other.get("origin") == job["origin"]:
                other["counted"] = True
        job["counted"] = True
        stats.record_transcription()

    def _process(self, job_id):
        """Run one queued job (called by the scheduler's worker thread)."""
        job = None
        try:
            job = self.jobs.get(job_id)
            if job:
                self._run(job)
        except Exception as e:  # noqa - one bad job must never stop the queue
            log.exception("job %s failed", job_id[:8])
            with self.lock:
                if job:
                    self._finish(job, "error", str(e) or e.__class__.__name__)

    def _run(self, job):
        job_id = job["id"]
        with self.lock:
            if job["status"] != "queued":  # cancelled or deleted while waiting
                return
            job.update(status="running", started_at=time.time(), progress=0.0, error=None,
                       segments=[], segment_count=0)
            self._touch(job)
        log.info("job %s started: %r (model=%s)", job_id[:8], job["filename"], job["options"].get("model"))
        t0 = {"transcribing": None}

        def on_phase(name, detail=None):
            with self.lock:
                job["phase"] = name
                if name == "transcribing":
                    t0["transcribing"] = time.time()
                self._touch(job)
            log.info("job %s phase: %s%s", job_id[:8], name, f" ({detail})" if detail else "")

        def on_segment(seg, progress, info):
            with self.lock:
                job["segments"].append(seg)
                job["segment_count"] = len(job["segments"])
                job["language"] = info["language"]
                job["duration"] = info["duration"]
                job["progress"] = round(progress, 4)
                el = time.time() - (t0["transcribing"] or time.time())
                job["eta_seconds"] = round(el / progress - el) if progress > 0.03 and el > 3 else None
                self._touch(job)

        try:
            scratch = self.dir(job_id) / "scratch"
            runner = self._scheduler.worker.transcribe if self._scheduler else backends.transcribe
            options = dict(job["options"])
            if not job["playable"] and not (self.dir(job_id) / "preview.mp3").exists():
                options["_preview_to"] = str(self.dir(job_id) / "preview.mp3")
            result = runner(
                self.media_path(job), options, on_phase, on_segment,
                should_cancel=lambda: job_id in self._cancel or self._closing, workdir=str(scratch))
            if job_id in self._cancel or self._closing:
                raise engine.Cancelled()
        except engine.Cancelled:
            with self.lock:
                self._cancel.discard(job_id)
                self._finish(job, "cancelled")
            log.info("job %s cancelled after %d segment(s)", job_id[:8], len(job["segments"]))
            return
        finally:
            shutil.rmtree(scratch, ignore_errors=True)
        # Non-browser audio previews are made inside the killable worker too.
        with self.lock:
            if job_id in self._cancel or self._closing:
                self._cancel.discard(job_id)
                self._finish(job, "cancelled")
                return
            job["segments"] = result["segments"]
            job["segment_count"] = len(result["segments"])
            job["language"] = result["language"]
            job["language_probability"] = result["language_probability"]
            job["duration"] = result["duration"]
            job["stats"] = formats.compute_stats(result["segments"], result["duration"])
            self._finish(job, "done")
            self._count_once(job)
        took = max(job["finished_at"] - job["started_at"], 1e-6)
        log.info("job %s done: %d segment(s), %d word(s), language=%s (p=%s), %.1fs of audio in %.1fs (%.1fx realtime)",
                 job_id[:8], len(result["segments"]), job["stats"]["word_count"], result["language"],
                 result["language_probability"], result["duration"], took, result["duration"] / took)

    def preview_path(self, job):
        """File the browser should play: the original if it can, else the mp3 preview."""
        if job["playable"]:
            return self.media_path(job)
        p = self.dir(job["id"]) / "preview.mp3"
        return p if p.exists() else None
