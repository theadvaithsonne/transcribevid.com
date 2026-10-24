"""Session-owned public video downloads, independent of the recognition queue."""
import copy
import importlib.util
import re
import shutil
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor, wait
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from . import config

_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="video-download")
_slots = threading.BoundedSemaphore(20)  # includes queued work across all visitors
_ID = re.compile(r"[a-f0-9]{32}\Z")


class DownloadError(ValueError):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def normalize_url(value):
    """Allow only canonical video URLs, never arbitrary fetch/redirect endpoints."""
    value = value.strip()
    try:
        url = urlsplit(value)
        if (url.scheme not in ("https", "http") or url.username or url.password or url.port
                or any(ord(c) < 33 for c in value) or "\\" in value):
            raise ValueError()
        host, path = (url.hostname or "").lower(), url.path
        video = None
        if host in ("youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"):
            if path == "/watch":
                ids = parse_qs(url.query).get("v", [])
                video = ids[0] if len(ids) == 1 else None
            else:
                match = re.fullmatch(r"/(?:shorts|embed|live)/([\w-]{11})/?", path, re.ASCII)
                video = match[1] if match else None
        elif host == "youtu.be":
            video = path.strip("/")
        if video and re.fullmatch(r"[A-Za-z0-9_-]{11}", video):
            return f"https://www.youtube.com/watch?v={video}", "YouTube"
        if host in ("instagram.com", "www.instagram.com", "m.instagram.com"):
            match = re.fullmatch(r"/(reel|p|tv)/([A-Za-z0-9_-]{1,64})/?", path)
            if match:
                return f"https://www.instagram.com/{match[1]}/{match[2]}/", "Instagram"
    except ValueError:
        pass
    raise DownloadError("Paste a YouTube video/Shorts link or an Instagram Reel/video post link.", 422)


class DownloadStore:
    def __init__(self, root):
        self.root = Path(root)
        self.jobs = {}
        self.lock = threading.RLock()
        self.closed = False

    def active_count(self):
        with self.lock:
            return sum(j["status"] in ("queued", "running") for j in self.jobs.values())

    def snapshot(self, jid):
        with self.lock:
            job = self.jobs.get(jid) if _ID.fullmatch(jid) else None
            if not job:
                raise DownloadError("Download not found.", 404)
            result = copy.deepcopy({k: v for k, v in job.items() if not k.startswith("_")})
            result["file_url"] = f"/api/downloads/{jid}/file" if job["status"] == "done" else None
            return result

    def list(self):
        with self.lock:
            return [self.snapshot(jid) for jid in reversed(self.jobs)]

    def create(self, url, quality):
        url, platform = normalize_url(url)
        if quality not in (360, 720, 1080):
            raise DownloadError("Choose 360p, 720p or 1080p.", 422)
        if not importlib.util.find_spec("yt_dlp"):
            raise DownloadError("Video downloading is unavailable. Install the backend requirements.", 503)
        with self.lock:
            if self.closed:
                raise DownloadError("The session has ended. Refresh and try again.", 409)
            if self.active_count() >= 2 or len(self.jobs) >= 10:
                raise DownloadError("Finish or clear an existing download before starting another.", 429)
            if not _slots.acquire(blocking=False):
                raise DownloadError("The download queue is full. Try again shortly.", 429)
            try:
                enough_space = not config.MIN_FREE_GB or shutil.disk_usage(self.root.parent).free >= config.MIN_FREE_GB * 1024**3
            except OSError:
                _slots.release()
                raise DownloadError("The download storage is unavailable. Try again later.", 507)
            if not enough_space:
                _slots.release()
                raise DownloadError("The server has insufficient free space. Try again later.", 507)
            jid = uuid.uuid4().hex
            self.jobs[jid] = {"id": jid, "url": url, "platform": platform, "quality": quality,
                "status": "queued", "phase": "queued", "title": "", "progress": None,
                "downloaded_bytes": 0, "total_bytes": None, "size_bytes": None,
                "error": None, "cancel_requested": False, "created_at": time.time(),
                "filename": None, "_future": None}
            try:
                future = _executor.submit(self._run, jid)
                self.jobs[jid]["_future"] = future
                future.add_done_callback(lambda _: _slots.release())
            except BaseException:
                self.jobs.pop(jid, None)
                _slots.release()
                raise
            return self.snapshot(jid)

    def _run(self, jid):
        from .download_worker import DownloadWorker, DownloadCancelled
        folder = self.root / jid
        def cancelled():
            with self.lock:
                job = self.jobs.get(jid)
                return self.closed or not job or job["cancel_requested"]
        def event(payload):
            with self.lock:
                job = self.jobs.get(jid)
                if job and not cancelled():
                    for key in ("phase", "title", "progress", "downloaded_bytes", "total_bytes"):
                        if key in payload:
                            job[key] = payload[key]
        try:
            with self.lock:
                if cancelled():
                    if jid in self.jobs:
                        self.jobs[jid].update(status="cancelled", phase="cancelled", cancel_requested=False)
                    return
                self.jobs[jid].update(status="running", phase="extracting")
                url, quality = self.jobs[jid]["url"], self.jobs[jid]["quality"]
            folder.mkdir(parents=True, exist_ok=True)
            result = DownloadWorker().run(url, folder, quality, event, cancelled)
            path = folder / "video.mp4"
            if not path.is_file() or not 0 < path.stat().st_size <= config.MAX_DOWNLOAD_BYTES:
                raise DownloadError("The video exceeds the download size limit or could not be saved.")
            with self.lock:
                if cancelled():
                    raise DownloadCancelled()
                title = str(result.get("title") or "video")[:200]
                name = re.sub(r'[<>:"/\\|?*\x00-\x1f\x7f]', "_", title).strip(" .")[:120] or "video"
                self.jobs[jid].update(status="done", phase="done", progress=1, title=title,
                    filename=name + ".mp4", size_bytes=path.stat().st_size)
        except DownloadCancelled:
            with self.lock:
                if jid in self.jobs:
                    self.jobs[jid].update(status="cancelled", phase="cancelled", cancel_requested=False)
        except Exception as exc:
            with self.lock:
                if jid in self.jobs:
                    message = str(exc) if isinstance(exc, DownloadError) else "The download failed. Please try again."
                    self.jobs[jid].update(status="cancelled" if cancelled() else "error",
                        phase="cancelled" if cancelled() else "error", error=None if cancelled() else message, cancel_requested=False)
        finally:
            with self.lock:
                keep = jid in self.jobs and self.jobs[jid]["status"] == "done"
            if not keep:
                shutil.rmtree(folder, ignore_errors=True)

    def cancel(self, jid):
        with self.lock:
            self.snapshot(jid)
            job = self.jobs[jid]
            if job["status"] in ("queued", "running"):
                job["cancel_requested"] = True
                future = job["_future"]
                if future and future.cancel():
                    job.update(status="cancelled", phase="cancelled", cancel_requested=False)
            return self.snapshot(jid)

    def file(self, jid):
        job = self.snapshot(jid)
        path = self.root / jid / "video.mp4"
        if job["status"] != "done" or not path.is_file():
            raise DownloadError("The video is not ready to save.", 409)
        return path, job["filename"]

    def delete(self, jid):
        self.cancel(jid)
        with self.lock:
            future = self.jobs[jid]["_future"]
        if future and not future.done():
            wait([future], timeout=5)
            if not future.done():
                raise DownloadError("The download is stopping. Try clearing it again shortly.", 409)
        with self.lock:
            self.jobs.pop(jid, None)
        shutil.rmtree(self.root / jid, ignore_errors=True)

    def close(self):
        with self.lock:
            self.closed = True
            futures = []
            for job in self.jobs.values():
                job["cancel_requested"] = True
                if job["_future"]:
                    job["_future"].cancel()
                    futures.append(job["_future"])
        wait(futures, timeout=6)
