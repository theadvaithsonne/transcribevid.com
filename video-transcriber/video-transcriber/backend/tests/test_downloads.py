import socket
import threading
import time

import pytest
from fastapi.testclient import TestClient

from app import config
from app.downloads import DownloadError, DownloadStore, normalize_url
from app.download_worker import DownloadCancelled, DownloadWorker, _public_network_only

URL = "https://www.youtube.com/watch?v=BaW_jenozKc"


@pytest.mark.parametrize("url,canonical,platform", [
    ("https://youtu.be/BaW_jenozKc?si=tracking", URL, "YouTube"),
    ("https://m.youtube.com/shorts/BaW_jenozKc", URL, "YouTube"),
    (URL + "&list=playlist", URL, "YouTube"),
    ("http://www.instagram.com/reel/AbC_123-/?igsh=tracking", "https://www.instagram.com/reel/AbC_123-/", "Instagram"),
])
def test_only_canonical_public_video_urls(url, canonical, platform):
    assert normalize_url(url) == (canonical, platform)


@pytest.mark.parametrize("url", [
    "file:///etc/passwd", "http://127.0.0.1/video", "https://youtube.com.evil.test/watch?v=BaW_jenozKc",
    "https://evil.test@youtube.com/watch?v=BaW_jenozKc", "https://youtube.com:8080/watch?v=BaW_jenozKc",
    "https://youtube.com/redirect?q=http://127.0.0.1/", "https://youtube.com/playlist?list=123",
    "https://instagram.com/accounts/login/", "https://youtube.com/watch?v=invalid",
    "https://youtu.be/BaW_jenozKc/extra", "https://youtube.com/watch?v=BaW_jenozKc&v=another",
    "https://www.youtube.com\\@localhost/watch?v=BaW_jenozKc", "ftp://youtube.com/watch?v=BaW_jenozKc",
])
def test_unsafe_urls_are_rejected_before_network_access(url):
    with pytest.raises(DownloadError):
        normalize_url(url)


@pytest.fixture
def fake_download(monkeypatch):
    def run(self, url, folder, quality, on_event, cancelled):
        if cancelled():
            raise DownloadCancelled()
        on_event({"title": "A test / video", "phase": "downloading", "downloaded_bytes": 12})
        (folder / "video.mp4").write_bytes(b"test-mp4")
        return {"title": "A test / video"}
    monkeypatch.setattr(DownloadWorker, "run", run)


def until(store, jid):
    deadline = time.monotonic() + 5
    while time.monotonic() < deadline:
        job = store.snapshot(jid)
        if job["status"] not in ("queued", "running"):
            return job
        time.sleep(0.01)
    pytest.fail("Download did not reach a terminal state")


def test_download_file_cannot_escape_session_and_clear_removes_data(tmp_path, fake_download):
    store = DownloadStore(tmp_path / "downloads")
    try:
        job = store.create(URL, 720)
        final = until(store, job["id"])
        assert final["status"] == "done" and final["filename"] == "A test _ video.mp4"
        assert all(not key.startswith("_") for key in final)
        path, filename = store.file(job["id"])
        assert path.read_bytes() == b"test-mp4" and filename.endswith(".mp4")
        store.delete(job["id"])
        assert not path.exists() and store.list() == []
        with pytest.raises(DownloadError):
            store.file("../outside")
    finally:
        store.close()


def test_cancellation_stops_worker_and_removes_partial_files(tmp_path, monkeypatch):
    entered = threading.Event()
    def run(self, url, folder, quality, on_event, cancelled):
        (folder / "video.mp4.part").write_bytes(b"partial")
        entered.set()
        while not cancelled():
            time.sleep(0.01)
        raise DownloadCancelled()
    monkeypatch.setattr(DownloadWorker, "run", run)
    store = DownloadStore(tmp_path / "downloads")
    try:
        job = store.create(URL, 360)
        assert entered.wait(2)
        store.cancel(job["id"])
        assert until(store, job["id"])["status"] == "cancelled"
        store.close()
        assert not (store.root / job["id"]).exists()
    finally:
        store.close()


def test_cancel_wins_over_late_success(tmp_path, monkeypatch):
    entered, release = threading.Event(), threading.Event()
    def run(self, url, folder, quality, on_event, cancelled):
        entered.set()
        assert release.wait(2)
        (folder / "video.mp4").write_bytes(b"late")
        return {"title": "late"}
    monkeypatch.setattr(DownloadWorker, "run", run)
    store = DownloadStore(tmp_path / "downloads")
    try:
        job = store.create(URL, 720)
        assert entered.wait(2)
        store.cancel(job["id"])
        release.set()
        assert until(store, job["id"])["status"] == "cancelled"
    finally:
        release.set()
        store.close()


def test_completed_file_size_is_enforced(tmp_path, monkeypatch, fake_download):
    monkeypatch.setattr(config, "MAX_DOWNLOAD_BYTES", 2)
    store = DownloadStore(tmp_path / "downloads")
    try:
        final = until(store, store.create(URL, 720)["id"])
        assert final["status"] == "error"
        with pytest.raises(DownloadError):
            store.file(final["id"])
    finally:
        store.close()


def test_download_api_isolates_visitors_and_session_reset_erases_files(fake_download):
    from app import main
    with TestClient(main.app) as a:
        b = TestClient(main.app)
        response = a.post("/api/downloads", json={"url": URL, "quality": 720})
        assert response.status_code == 201
        jid = response.json()["id"]
        store = next(iter(main.manager.sessions.values())).store
        assert until(store.downloads, jid)["status"] == "done"
        assert a.get(f"/api/downloads/{jid}/file").content == b"test-mp4"
        assert a.get(f"/api/downloads/{jid}/file").headers["content-disposition"].startswith("attachment;")
        assert b.get("/api/downloads").json() == []
        for method, path in [("GET", f"/{jid}"), ("GET", f"/{jid}/file"), ("POST", f"/{jid}/cancel"), ("DELETE", f"/{jid}")]:
            assert b.request(method, "/api/downloads" + path).status_code == 404
        path, _ = store.downloads.file(jid)
        assert a.delete("/api/session").status_code == 204
        assert not path.exists()
        assert a.get("/api/downloads").json() == []


def test_api_validates_quality_url_and_origin(fake_download):
    from app import main
    with TestClient(main.app) as client:
        assert client.post("/api/downloads", json={"url": URL, "quality": 999}).status_code == 422
        assert client.post("/api/downloads", json={"url": "http://localhost:8000"}).status_code == 422
        assert client.post("/api/downloads", json={"url": URL}, headers={"origin": "https://evil.test"}).status_code == 403


def test_network_guard_refuses_private_dns_results(monkeypatch):
    monkeypatch.setattr(socket, "getaddrinfo", lambda *a, **k: [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("127.0.0.1", 443))])
    _public_network_only()
    with pytest.raises(OSError, match="Non-public"):
        socket.getaddrinfo("cdn.example", 443)


def blocked_child(conn, url, output, quality, settings):
    import os
    if os.name != "nt":
        os.setsid()
    while True:
        time.sleep(1)


def test_real_process_timeout_kills_blocked_downloader(tmp_path, monkeypatch):
    monkeypatch.setattr(config, "DOWNLOAD_TIMEOUT", 0.4)
    started = time.monotonic()
    with pytest.raises(DownloadError, match="timed out"):
        DownloadWorker(target=blocked_child).run(URL, tmp_path, 720, lambda _: None, lambda: False)
    assert time.monotonic() - started < 8


def test_real_process_cancel_does_not_wait_for_blocked_network_call(tmp_path):
    cancelled = threading.Event()
    timer = threading.Timer(0.5, cancelled.set)
    timer.start()
    started = time.monotonic()
    try:
        with pytest.raises(DownloadCancelled):
            DownloadWorker(target=blocked_child).run(URL, tmp_path, 720, lambda _: None, cancelled.is_set)
        assert time.monotonic() - started < 8
    finally:
        timer.cancel()
