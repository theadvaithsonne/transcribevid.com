"""Killable yt-dlp process: no browser cookies, playlists, or arbitrary URL fetches."""
import ipaddress
import multiprocessing
import os
import shutil
import signal
import socket
import subprocess
import time
from pathlib import Path


class DownloadCancelled(Exception):
    pass


class DownloadRejected(ValueError):
    """A controlled message that may be shown to a visitor."""


def _public_network_only():
    original = socket.getaddrinfo
    def resolve(*args, **kwargs):
        answers = original(*args, **kwargs)
        if any(not ipaddress.ip_address(a[4][0].split("%")[0]).is_global for a in answers):
            raise OSError("Non-public network address refused")
        return answers
    socket.getaddrinfo = resolve


def _message(error):
    value = str(error).lower()
    if "sign in" in value or "login" in value or "private" in value or "cookies" in value:
        return "This video needs login or is restricted. Try a public video link."
    if "403" in value or "429" in value or "blocked" in value or "bot" in value:
        return "The platform blocked this download. Try again later or use another public link."
    if "format" in value:
        return "An MP4 video is unavailable at this quality. Try another quality or link."
    if "unavailable" in value or "not found" in value or "404" in value:
        return "This video is unavailable, deleted, or not accessible from this server."
    return "Could not download this video. Check the public link and try again."


def _download(conn, url, output, quality, settings):
    if os.name != "nt":
        os.setsid()
    try:
        _public_network_only()
        import yt_dlp
        folder = Path(output)
        max_bytes, max_duration = settings["max_bytes"], settings["max_duration"]
        last = 0
        def emit(payload):
            conn.send(("event", payload))
        def progress(data):
            nonlocal last
            downloaded = data.get("downloaded_bytes", 0) or 0
            stored = sum(p.stat().st_size for p in folder.iterdir() if p.is_file())
            if downloaded > max_bytes or stored > max_bytes * 2 or (data["status"] == "finished" and stored > max_bytes):
                raise DownloadRejected("The video exceeds the download size limit.")
            now = time.monotonic()
            if data["status"] == "finished":
                emit({"phase": "processing", "progress": None})
            elif now - last > 0.3:
                total = data.get("total_bytes") or data.get("total_bytes_estimate")
                # Separate video/audio streams restart their byte counters. Avoid
                # a misleading overall percentage until the final file is ready.
                emit({"phase": "downloading", "progress": None,
                      "downloaded_bytes": downloaded, "total_bytes": total})
                last = now
        def check(info, *, incomplete=False):
            if info.get("is_live") or info.get("live_status") in ("is_live", "is_upcoming"):
                return "Live streams are not supported. Use a finished video."
            if max_duration and (info.get("duration") or 0) > max_duration:
                return "This video exceeds the duration limit."
            if (info.get("filesize") or 0) > max_bytes:
                return "The video exceeds the download size limit."
        class Quiet:
            def debug(self, msg): pass
            def info(self, msg): pass
            def warning(self, msg): pass
            def error(self, msg): pass
        selector = (f"bestvideo[ext=mp4][vcodec^=avc1][protocol=https][height<=?{quality}]+bestaudio[ext=m4a][protocol=https]"
                    f"/best[ext=mp4][protocol=https][height<=?{quality}]")
        options = {"format": selector, "outtmpl": str(folder / "video.%(ext)s"),
            "merge_output_format": "mp4", "ffmpeg_location": settings["ffmpeg"],
            "noplaylist": True, "quiet": True, "no_warnings": True,
            "logger": Quiet(), "progress_hooks": [progress], "match_filter": check,
            "max_filesize": max_bytes, "socket_timeout": 20, "retries": 2,
            "fragment_retries": 2, "concurrent_fragment_downloads": 1,
            "cachedir": False, "proxy": "", "windowsfilenames": True,
            "overwrites": False, "allowed_extractors": ["youtube", "instagram"],
            "js_runtimes": {name: {} for name in ("node", "deno") if shutil.which(name)}}
        with yt_dlp.YoutubeDL(options) as ydl:
            info = ydl.extract_info(url, download=False)
            if not info or info.get("_type") in ("playlist", "multi_video") or "entries" in info:
                raise DownloadRejected("Use a single available video/Reel link, not a playlist or carousel.")
            reason = check(info)
            if reason:
                raise DownloadRejected(reason)
            emit({"title": str(info.get("title") or "video")[:200], "phase": "downloading"})
            # process_ie_result downloads the extracted item without fetching the
            # same webpage twice. No client-provided downloader options are used.
            result = ydl.process_ie_result(info, download=True)
        path = folder / "video.mp4"
        if not path.is_file() or not 0 < path.stat().st_size <= max_bytes:
            raise DownloadRejected("The video exceeds the download size limit or could not be saved as MP4.")
        conn.send(("done", {"title": result.get("title") or "video"}))
    except Exception as exc:
        # Controlled local validation messages are safe; extractor messages may
        # contain signed media URLs, cookies, or local paths and are never relayed.
        message = str(exc) if isinstance(exc, DownloadRejected) else _message(exc)
        conn.send(("error", message))
    finally:
        conn.close()


class DownloadWorker:
    def __init__(self, target=_download):
        self.target = target

    def run(self, url, folder, quality, on_event, cancelled):
        from . import config, engine
        from .downloads import DownloadError
        ctx = multiprocessing.get_context("spawn")
        parent, child = ctx.Pipe(duplex=False)
        settings = {"max_bytes": config.MAX_DOWNLOAD_BYTES, "max_duration": config.MAX_DOWNLOAD_DURATION,
                    "ffmpeg": engine.ffmpeg_exe()}
        proc = ctx.Process(target=self.target, args=(child, url, str(folder), quality, settings),
                           daemon=True, name="vt-downloader")
        started = False
        try:
            if cancelled():
                raise DownloadCancelled()
            proc.start()
            started = True
            child.close()
            deadline = time.monotonic() + config.DOWNLOAD_TIMEOUT
            while True:
                if cancelled():
                    raise DownloadCancelled()
                if time.monotonic() > deadline:
                    raise DownloadError("The download timed out. Try a shorter video or another link.")
                if not parent.poll(0.15):
                    if not proc.is_alive():
                        raise DownloadError("The download worker stopped. Please try again.")
                    continue
                kind, payload = parent.recv()
                if cancelled():
                    raise DownloadCancelled()
                if kind == "event":
                    on_event(payload)
                elif kind == "done":
                    return payload
                elif kind == "error":
                    raise DownloadError(payload)
        except (EOFError, BrokenPipeError, OSError) as exc:
            raise DownloadError("The download connection closed. Please try again.") from exc
        finally:
            if started:
                if proc.is_alive():
                    if os.name == "nt":
                        subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"],
                                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    else:
                        try:
                            os.killpg(proc.pid, signal.SIGKILL)
                        except ProcessLookupError:
                            proc.kill()
                proc.join(timeout=3)
                if proc.is_alive():
                    proc.kill()
                    proc.join(timeout=2)
                proc.close()
            parent.close()
            child.close()
