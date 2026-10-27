import json
import threading
import time

import pytest
from fastapi.testclient import TestClient

from app import config, engine
from app.logbuffer import BUFFER


def fake_transcribe(path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
    on_phase("extracting")
    on_phase("transcribing")
    segs = []
    for i, text in enumerate(["Hello world.", "This is a test of Kubernetes."]):
        s = {"id": i, "start": i * 2.0, "end": i * 2.0 + 1.8, "text": text, "words": None,
             "confidence": 0.95 if i == 0 else 0.4, "no_speech_prob": 0.01}
        segs.append(s)
        on_segment(s, (i + 1) / 2, {"language": "en", "duration": 4.0})
        if options.get("prompt") == "slow":
            for _ in range(100):
                if should_cancel():
                    raise engine.Cancelled()
                time.sleep(0.02)
    return {"language": "en", "language_probability": 0.99, "duration": 4.0, "segments": segs}


@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    monkeypatch.setattr(engine, "make_audio_preview", lambda s, d: d.write_bytes(b"mp3") or True)
    from app.main import app
    BUFFER.clear()
    with TestClient(app) as c:
        yield c


def upload(client, name="clip.mp4", options=None, data=b"not-really-video"):
    params = {"filename": name, "options": json.dumps(options or {})}
    return client.post("/api/jobs", params=params, content=data,
                       headers={"content-type": "application/octet-stream"})


def wait(client, job_id, want=("done", "error", "cancelled"), timeout=10):
    end = time.time() + timeout
    while time.time() < end:
        j = client.get(f"/api/jobs/{job_id}").json()
        if j["status"] in want:
            return j
        time.sleep(0.05)
    raise AssertionError("timeout: " + str(j))


def log_text(client, **params):
    entries = client.get("/api/logs", params={"limit": 5000, **params}).json()["entries"]
    return "\n".join(f"{e['level']} {e['logger']} {e['message']}" for e in entries)


# ---------------------------------------------------------------- meta + session

def test_health_and_meta(client):
    h = client.get("/api/health").json()
    assert h["status"] == "ok"
    assert h["persistent"] is False and h["session_id"] is None and h["started_at"] > 1e9  # no session yet:
    client.get("/api/jobs")                                                               # health never makes one
    assert len(client.get("/api/health").json()["session_id"]) == 12
    assert any(m["id"] == "small" for m in client.get("/api/models").json())
    assert {"code": "en", "name": "English"} in client.get("/api/languages").json()


def test_session_data_is_wiped_when_the_app_stops(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    from app.main import app
    with TestClient(app) as c:
        job_id = upload(c).json()["id"]
        wait(c, job_id)
        instance_dir = next(config.SESSION_ROOT.iterdir())
        visitor_dir = next(p for p in instance_dir.iterdir() if p.is_dir())
        assert (visitor_dir / job_id / "media.mp4").exists()
    assert not instance_dir.exists()  # shutdown erased the uploaded media
    with TestClient(app) as again:  # a new session starts empty
        assert again.get("/api/jobs").json() == []
        assert again.get("/api/health").json()["session_id"] != ""


# ---------------------------------------------------------------- jobs

def test_full_job_lifecycle_and_exports(client):
    r = upload(client, options={"model": "tiny", "language": "EN "})
    assert r.status_code == 201
    job_id = r.json()["id"]
    assert r.json()["options"]["language"] == "en" and "folder_id" not in r.json()

    j = wait(client, job_id)
    assert j["status"] == "done" and j["language"] == "en"
    assert [s["text"] for s in j["segments"]] == ["Hello world.", "This is a test of Kubernetes."]
    assert j["stats"]["low_confidence_segments"] == 1
    assert j["media_url"] == f"/api/jobs/{job_id}/media"
    assert "playable" not in j and "media_file" not in j and "version" not in j
    assert client.get(j["media_url"]).status_code == 200

    srt = client.get(f"/api/jobs/{job_id}/export?format=srt")
    assert srt.status_code == 200 and "00:00:00,000 --> " in srt.text
    assert "clip.srt" in srt.headers["content-disposition"]
    assert client.get(f"/api/jobs/{job_id}/export?format=vtt").text.startswith("WEBVTT")
    assert "[00:02] This is a test" in client.get(f"/api/jobs/{job_id}/export?format=txt").text
    assert client.get(f"/api/jobs/{job_id}/export?format=bogus").status_code == 422

    rows = client.get("/api/jobs").json()  # history list: no heavy segments payload
    assert rows[0]["id"] == job_id and "segments" not in rows[0]


def test_pdf_export(client):
    job_id = upload(client, name="My Talk.mp4").json()["id"]
    wait(client, job_id)
    r = client.get(f"/api/jobs/{job_id}/export?format=pdf")
    assert r.status_code == 200 and r.headers["content-type"] == "application/pdf"
    assert r.content.startswith(b"%PDF") and len(r.content) > 1000
    assert "My%20Talk.pdf" in r.headers["content-disposition"]
    import io
    from pypdf import PdfReader
    text = "".join(p.extract_text() for p in PdfReader(io.BytesIO(r.content)).pages)
    assert "Hello world." in text and "Kubernetes" in text


def test_export_refused_until_done(client):
    job_id = upload(client, options={"prompt": "slow"}).json()["id"]
    wait(client, job_id, want=("running",))
    assert client.get(f"/api/jobs/{job_id}/export?format=pdf").status_code == 409
    client.post(f"/api/jobs/{job_id}/cancel")
    wait(client, job_id)


def test_edit_segments_and_title(client):
    job_id = upload(client).json()["id"]
    wait(client, job_id)
    r = client.patch(f"/api/jobs/{job_id}", json={
        "title": "My talk", "segments": [{"id": 1, "text": "This is a test of Kubernetes!!"},
                                         {"id": 0, "text": "", "deleted": True}]})
    assert r.status_code == 200
    j = client.get(f"/api/jobs/{job_id}").json()
    assert j["title"] == "My talk"
    assert [s["text"] for s in j["segments"]] == ["This is a test of Kubernetes!!"]
    assert j["segments"][0]["edited"] is True
    assert "Kubernetes!!" in client.get(f"/api/jobs/{job_id}/export?format=plain").text
    assert client.patch(f"/api/jobs/{'0' * 32}", json={"title": "x"}).status_code == 404


def test_validation(client):
    assert upload(client, options={"model": "nope"}).status_code == 422
    assert upload(client, options={"language": "xx"}).status_code == 422
    assert upload(client, options={"beam_size": 99}).status_code == 422
    assert upload(client, options={"output_script": "nope"}).status_code == 422
    assert upload(client, data=b"").status_code == 400
    assert client.get("/api/jobs").json() == []  # a rejected upload leaves nothing behind
    assert client.get("/api/jobs/" + "0" * 32).status_code == 404
    assert client.get("/api/jobs/..%2F..%2Fetc").status_code == 404
    assert client.get("/api/jobs/" + "0" * 32 + "%0A").status_code == 404


def test_original_script_default_and_hinglish_rerun(client):
    created = upload(client).json()
    assert created["options"]["output_script"] == "original"
    wait(client, created["id"])
    rerun = client.post(f"/api/jobs/{created['id']}/rerun", json={"output_script": "hinglish"})
    assert rerun.status_code == 201
    assert rerun.json()["options"]["output_script"] == "hinglish"
    wait(client, rerun.json()["id"])
    again = client.post(f"/api/jobs/{rerun.json()['id']}/rerun", json={"model": "base"})
    assert again.status_code == 201
    assert again.json()["options"]["output_script"] == "hinglish"


def test_cancel_and_delete(client):
    job_id = upload(client, options={"prompt": "slow"}).json()["id"]
    wait(client, job_id, want=("running",))
    assert client.delete(f"/api/jobs/{job_id}").status_code == 409  # still running
    client.post(f"/api/jobs/{job_id}/cancel")
    assert wait(client, job_id)["status"] == "cancelled"
    assert client.delete(f"/api/jobs/{job_id}").status_code == 204
    assert client.get(f"/api/jobs/{job_id}").status_code == 404


def test_rerun_with_other_model(client):
    job_id = upload(client, options={"model": "tiny", "language": "en"}).json()["id"]
    wait(client, job_id)
    r = client.post(f"/api/jobs/{job_id}/rerun", json={"model": "medium"})
    assert r.status_code == 201
    new = r.json()
    assert new["id"] != job_id and new["options"]["model"] == "medium"
    assert wait(client, new["id"])["status"] == "done"
    # an explicit null resets the language to auto-detect
    r2 = client.post(f"/api/jobs/{job_id}/rerun", json={"language": None})
    assert r2.json()["options"]["language"] is None


def test_event_stream_ends_when_job_finishes(client):
    job_id = upload(client).json()["id"]
    wait(client, job_id)
    with client.stream("GET", f"/api/jobs/{job_id}/events") as r:
        body = "".join(r.iter_text())
    assert "event: segments" in body and "event: job" in body and body.rstrip().endswith("data: {}")


def test_event_stream_ends_when_a_queued_job_is_deleted(client):
    from app import main
    client.get("/api/jobs")  # creates this visitor's session
    store = next(iter(main.manager.sessions.values())).store
    job = store._new_job("a" * 32, "x.mp4", "media.mp4", 1, {})  # queued, never handed to the worker
    store.dir(job["id"]).mkdir(parents=True)
    store.jobs[job["id"]] = job
    threading.Timer(0.6, lambda: store.delete(job["id"])).start()
    with client.stream("GET", f"/api/jobs/{job['id']}/events") as r:
        body = "".join(r.iter_text())
    assert "event: end" in body


# ---------------------------------------------------------------- the folder feature is gone

def test_folder_endpoints_and_fields_no_longer_exist(client):
    for method, url in (("get", "/api/folders"), ("post", "/api/folders"), ("patch", "/api/folders/000000000000"),
                        ("delete", "/api/folders/000000000000")):
        kwargs = {"json": {"name": "x"}} if method in ("post", "patch") else {}
        assert getattr(client, method)(url, **kwargs).status_code in (404, 405), (method, url)
    job_id = upload(client).json()["id"]
    j = wait(client, job_id)
    assert "folder_id" not in j and "folder_id" not in client.get("/api/jobs").json()[0]
    assert "folder_count" not in client.get("/api/session").json()
    # an old client that still sends the field is simply ignored (no error, nothing stored)
    assert client.patch(f"/api/jobs/{job_id}", json={"folder_id": "0" * 12, "title": "kept"}).json()["title"] == "kept"
    assert "folder_id" not in client.get(f"/api/jobs/{job_id}").json()
    r = client.post("/api/jobs", params={"filename": "x.mp4", "folder_id": "0" * 12}, content=b"abc",
                    headers={"content-type": "application/octet-stream"})
    assert r.status_code == 201 and "folder_id" not in r.json()


def test_renaming_a_job_and_deleting_the_session_still_work(client):
    job_id = upload(client).json()["id"]
    wait(client, job_id)
    r = client.patch(f"/api/jobs/{job_id}", json={"title": "  Weekly sync  "})
    assert r.status_code == 200 and r.json()["title"] == "Weekly sync"
    assert client.get("/api/jobs").json()[0]["title"] == "Weekly sync"
    assert client.get(f"/api/jobs/{job_id}/export?format=srt").headers["content-disposition"].count("Weekly") == 1
    assert client.delete("/api/session").status_code == 204
    assert client.get("/api/jobs").json() == [] and client.get(f"/api/jobs/{job_id}").status_code == 404


# ---------------------------------------------------------------- logging

def test_requests_and_job_lifecycle_are_logged(client):
    job_id = upload(client, name="talk.mp4", options={"model": "tiny"}).json()["id"]
    wait(client, job_id)
    client.get(f"/api/jobs/{job_id}/export?format=srt")
    client.get("/api/jobs")  # the sidebar polls this constantly
    text = log_text(client, level="INFO")
    assert "POST /api/jobs -> 201" in text
    assert "upload complete: 'talk.mp4'" in text
    assert f"job {job_id[:8]} started" in text and f"job {job_id[:8]} done" in text
    assert f"export srt of job {job_id[:8]}" in text
    assert "GET /api/logs" not in text  # the log viewer never logs itself
    assert "session " in text and "started" in text  # session start is recorded
    # frequently polled endpoints are DEBUG-only, so the INFO view stays readable
    assert "GET /api/jobs ->" not in text
    assert "GET /api/jobs -> 200" in log_text(client, level="DEBUG")


def test_client_side_logs_appear_in_the_same_feed(client):
    assert client.post("/api/logs/client", json={"level": "ERROR", "message": "button exploded",
                                                  "context": "stack"}).status_code == 204
    text = log_text(client, level="ERROR")
    assert "ERROR vt.client button exploded | stack" in text


def test_failures_are_logged_with_the_right_severity(client):
    assert client.get("/api/jobs/" + "0" * 32).status_code == 404
    assert "WARNING vt.api GET /api/jobs/" + "0" * 32 + " -> 404" in log_text(client, level="WARNING")


def test_unhandled_errors_return_json_500_and_are_logged(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    from app import main
    from app.main import app
    with TestClient(app, raise_server_exceptions=False) as c:
        def boom(*a, **k):
            raise RuntimeError("kaput")
        c.get("/api/jobs")  # creates this visitor's session
        monkeypatch.setattr(next(iter(main.manager.sessions.values())).store, "summaries", boom)
        r = c.get("/api/jobs")
        assert r.status_code == 500 and "try again" in r.json()["detail"]
        text = log_text(c, level="ERROR")
        assert "kaput" in text and "GET /api/jobs -> 500" in text


def test_job_failure_reason_reaches_the_log(client, monkeypatch):
    def broken(*a, **k):
        raise RuntimeError("This file has no audio track.")
    monkeypatch.setattr(engine, "transcribe", broken)
    job_id = upload(client).json()["id"]
    j = wait(client, job_id)
    assert j["status"] == "error" and j["error"] == "This file has no audio track."
    assert "no audio track" in log_text(client, level="ERROR")


# ---------------------------------------------------------------- security hardening

def test_foreign_host_headers_are_refused(client):
    assert client.get("/api/health", headers={"host": "evil.example"}).status_code == 400
    assert client.get("/api/health", headers={"host": "evil.example:8000"}).status_code == 400
    assert client.get("/api/health", headers={"host": "localhost:8000"}).status_code == 200
    assert client.get("/api/health", headers={"host": "127.0.0.1"}).status_code == 200


def upload_from(client, origin):
    return client.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc",
                       headers={"content-type": "application/octet-stream", "origin": origin})


def test_cross_site_writes_are_refused(client):
    base = {"content-type": "application/octet-stream"}
    evil = client.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc",
                       headers={**base, "origin": "https://evil.example"})
    assert evil.status_code == 403 and client.get("/api/jobs").json() == []
    assert client.delete("/api/session", headers={"origin": "https://evil.example"}).status_code == 403
    assert client.delete("/api/session", headers={"origin": "null"}).status_code == 403
    # our own pages are fine: same origin, and the Angular dev server
    assert upload_from(client, "http://testserver").status_code == 201
    assert upload_from(client, "http://localhost:4200").status_code == 201
    assert "cross-site" in log_text(client, level="WARNING")


def test_upload_requires_the_octet_stream_content_type(client):
    r = client.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc", headers={"content-type": "text/plain"})
    assert r.status_code == 415 and "octet-stream" in r.json()["detail"]
    assert client.get("/api/jobs").json() == []


def test_oversized_uploads_are_refused_before_any_bytes_are_stored(client, monkeypatch):
    monkeypatch.setattr(config, "MAX_UPLOAD_BYTES", 100)
    r = upload(client, data=b"x" * 500)
    assert r.status_code == 413 and "limit" in r.json()["detail"]
    assert client.get("/api/health").json()["max_upload_mb"] == config.MAX_UPLOAD_MB


def test_api_responses_are_never_cacheable(client):
    job_id = upload(client).json()["id"]
    wait(client, job_id)
    for url in ("/api/health", "/api/jobs", f"/api/jobs/{job_id}", f"/api/jobs/{job_id}/media",
                f"/api/jobs/{job_id}/export?format=txt", f"/api/jobs/{job_id}/export?format=pdf", "/api/session"):
        assert "no-store" in client.get(url).headers["cache-control"], url
    with client.stream("GET", f"/api/jobs/{job_id}/events") as r:  # event streams already say no-cache
        assert "no-cache" in r.headers["cache-control"]


def test_crafted_urls_cannot_forge_log_lines(client):
    client.get("/api/health%0AFAKE%20LINE%20INFO%20vt.jobs:%20job%20deadbeef%20done")
    lines = log_text(client, level="DEBUG").splitlines()
    forged = [ln for ln in lines if ln.startswith("FAKE LINE")]
    assert not forged  # the newline was escaped, so no log line can start with attacker-chosen text
    assert any("FAKE" in ln and (chr(92) + "n") in ln for ln in lines)  # escaped: backslash + n


def test_rerun_validation_errors_are_422_not_409(client):
    job_id = upload(client).json()["id"]
    wait(client, job_id)
    r = client.post(f"/api/jobs/{job_id}/rerun", json={"beam_size": 99})
    assert r.status_code == 422
    assert client.post(f"/api/jobs/{'0' * 32}/rerun", json={}).status_code == 404
