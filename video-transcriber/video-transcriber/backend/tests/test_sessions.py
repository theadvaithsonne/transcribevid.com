"""Per-visitor sessions, public-mode limits and website hardening (transcribevid.com)."""
import json
import threading
import time

import pytest
from fastapi.testclient import TestClient

from app import config, engine
from app.limits import RateLimiter
from app.logbuffer import BUFFER
from app.sessions import COOKIE_NAME, SessionManager

SEG = [{"id": 0, "start": 0.0, "end": 1.8, "text": "Hello world.", "words": None, "confidence": 0.95,
        "no_speech_prob": 0.01}]


def fake_transcribe(path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
    on_phase("extracting")
    on_phase("transcribing")
    if options.get("prompt", "").startswith("slow"):
        for _ in range(250):
            if should_cancel():
                raise engine.Cancelled()
            time.sleep(0.02)
    on_segment(SEG[0], 1.0, {"language": "en", "duration": 2.0})
    return {"language": "en", "language_probability": 0.99, "duration": 2.0, "segments": [dict(SEG[0])]}


@pytest.fixture()
def app_ctx(monkeypatch):
    """Yields (app module, a client = visitor A). Visitor B: `TestClient(main.app)` (own cookie jar)."""
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    monkeypatch.setattr(engine, "make_audio_preview", lambda s, d: d.write_bytes(b"mp3") or True)
    from app import main
    BUFFER.clear()
    with TestClient(main.app) as a:
        yield main, a


def upload(c, name="clip.mp4", prompt="", data=b"not-really-video"):
    params = {"filename": name, "options": json.dumps({"prompt": prompt})}
    return c.post("/api/jobs", params=params, content=data, headers={"content-type": "application/octet-stream"})


def wait(c, job_id, want=("done", "error", "cancelled"), timeout=10):
    end = time.time() + timeout
    while time.time() < end:
        j = c.get(f"/api/jobs/{job_id}").json()
        if j["status"] in want:
            return j
        time.sleep(0.05)
    raise AssertionError(f"timeout: {j}")


# ---------------------------------------------------------------- isolation between visitors

def test_visitors_never_see_each_others_data(app_ctx):
    main, a = app_ctx
    b = TestClient(main.app)
    ja = upload(a, "secret-a.mp4").json()["id"]
    wait(a, ja)
    assert b.get("/api/jobs").json() == []
    jb = upload(b, "secret-b.mp4").json()["id"]
    wait(b, jb)
    assert [j["id"] for j in a.get("/api/jobs").json()] == [ja]
    assert [j["id"] for j in b.get("/api/jobs").json()] == [jb]
    # knowing another visitor's ids gives no access to anything
    for url in (f"/api/jobs/{ja}", f"/api/jobs/{ja}/media", f"/api/jobs/{ja}/export?format=txt",
                f"/api/jobs/{ja}/export?format=pdf", f"/api/jobs/{ja}/events"):
        assert b.get(url).status_code == 404, url
    assert b.patch(f"/api/jobs/{ja}", json={"title": "pwned"}).status_code == 404
    assert b.delete(f"/api/jobs/{ja}").status_code == 404
    assert b.post(f"/api/jobs/{ja}/cancel").status_code == 404
    assert b.post(f"/api/jobs/{ja}/rerun", json={}).status_code == 404
    assert a.get(f"/api/jobs/{ja}").json()["title"] == "secret-a"  # untouched
    assert main.manager.stats()["sessions"] == 2


def test_each_visitor_has_a_separate_scratch_folder(app_ctx):
    main, a = app_ctx
    b = TestClient(main.app)
    ja, jb = upload(a).json()["id"], upload(b).json()["id"]
    wait(a, ja), wait(b, jb)
    sessions = list(main.manager.sessions.values())
    assert len(sessions) == 2 and sessions[0].store.root != sessions[1].store.root
    assert sessions[0].store.root.parent == sessions[1].store.root.parent == main.manager.root


def test_two_visitors_share_one_worker_first_come_first_served(app_ctx):
    main, a = app_ctx
    b = TestClient(main.app)
    first = upload(a, prompt="slow-first").json()["id"]
    wait(a, first, want=("running",))
    second = upload(b).json()["id"]  # B arrives while A's job runs
    assert b.get(f"/api/jobs/{second}").json()["status"] == "queued"
    assert main.manager.scheduler.pending == 2
    a.post(f"/api/jobs/{first}/cancel")
    assert wait(a, first)["status"] == "cancelled"
    assert wait(b, second)["status"] == "done"  # B's job started only after A's finished


# ---------------------------------------------------------------- the cookie

def test_session_cookie_is_set_once_httponly_and_reused(app_ctx):
    main, a = app_ctx
    assert COOKIE_NAME not in a.cookies
    assert a.get("/api/health").status_code == 200 and COOKIE_NAME not in a.cookies  # health makes no session
    assert a.get("/api/models").status_code == 200 and COOKIE_NAME not in a.cookies
    r = a.get("/api/jobs")
    sc = r.headers["set-cookie"]
    assert sc.startswith(f"{COOKIE_NAME}=") and "HttpOnly" in sc and "SameSite=Lax" in sc and "Path=/" in sc
    assert "Secure" not in sc  # plain http (local use)
    sid = a.cookies[COOKIE_NAME]
    assert len(sid) == 32 and int(sid, 16) >= 0
    assert "set-cookie" not in a.get("/api/jobs").headers  # not re-sent
    assert a.cookies[COOKIE_NAME] == sid and main.manager.stats()["sessions"] == 1


def test_cookie_is_secure_over_https(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    from app import main
    with TestClient(main.app, base_url="https://testserver") as c:
        assert "Secure" in c.get("/api/jobs").headers["set-cookie"]


def test_forged_or_unknown_cookies_get_a_fresh_session(app_ctx):
    main, a = app_ctx
    for bad in ("0" * 32, "../../etc", "x" * 200, "", "A" * 32):
        c = TestClient(main.app, cookies={COOKIE_NAME: bad})
        r = c.get("/api/jobs")
        assert r.status_code == 200 and r.json() == []
        new_sid = r.headers["set-cookie"].split(";")[0].split("=", 1)[1]
        assert new_sid != bad and len(new_sid) == 32  # a fresh random id: a client-supplied value is never adopted


def test_session_info_and_delete_my_data(app_ctx):
    main, a = app_ctx
    jid = upload(a).json()["id"]
    wait(a, jid)
    info = a.get("/api/session").json()
    assert info["job_count"] == 1 and "folder_count" not in info and info["expires_in_seconds"] > 60
    sess = main.manager.get(a.cookies[COOKIE_NAME])
    media_dir = sess.store.dir(jid)
    assert media_dir.exists()
    assert a.delete("/api/session").status_code == 204
    assert not media_dir.exists()  # the uploaded file is physically gone
    assert a.get("/api/jobs").json() == []
    assert a.get(f"/api/jobs/{jid}").status_code == 404
    again = a.get("/api/session").json()
    assert again["job_count"] == 0  # same cookie, fresh empty workspace
    assert upload(a).status_code == 201  # and it still works


def test_delete_my_data_cancels_a_running_job_and_ends_its_event_stream(app_ctx):
    main, a = app_ctx
    jid = upload(a, prompt="slow").json()["id"]
    wait(a, jid, want=("running",))
    threading.Timer(0.8, lambda: a.delete("/api/session")).start()
    t0 = time.time()
    with a.stream("GET", f"/api/jobs/{jid}/events") as r:
        body = "".join(r.iter_text())
    assert "event: end" in body and time.time() - t0 < 6


# ---------------------------------------------------------------- expiry

def test_idle_sessions_are_deleted_with_all_their_data(app_ctx):
    main, a = app_ctx
    jid = upload(a).json()["id"]
    wait(a, jid)
    sess = main.manager.get(a.cookies[COOKIE_NAME])
    root = sess.store.root
    idle = main.manager.idle_seconds
    assert main.manager.reap(time.time() + idle - 120) == 0 and root.exists()  # not idle long enough
    assert main.manager.reap(time.time() + idle + 120) == 1
    assert not root.exists() and main.manager.stats()["sessions"] == 0
    assert a.get("/api/jobs").json() == []  # the expired visitor just gets a fresh, empty workspace
    assert "ended (idle for" in "\n".join(e["message"] for e in BUFFER.query(level="INFO")[0])


def test_a_session_with_work_in_progress_does_not_expire(app_ctx):
    main, a = app_ctx
    jid = upload(a, prompt="slow").json()["id"]
    wait(a, jid, want=("running",))
    assert main.manager.reap(time.time() + main.manager.idle_seconds * 3) == 0
    a.post(f"/api/jobs/{jid}/cancel")
    wait(a, jid)


def test_finishing_a_job_counts_as_activity(app_ctx):
    """A visitor who queued a long job and went away gets the full idle window AFTER it finishes."""
    main, a = app_ctx
    jid = upload(a).json()["id"]
    wait(a, jid)
    sess = main.manager.get(a.cookies[COOKIE_NAME])
    sess.last_seen -= main.manager.idle_seconds * 5  # they have not been seen for ages...
    assert sess.idle_seconds() < main.manager.idle_seconds  # ...but their job only just finished
    assert main.manager.reap() == 0


def test_the_server_refuses_new_visitors_when_full_and_recovers(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    monkeypatch.setattr(config, "MAX_SESSIONS", 2)
    from app import main
    with TestClient(main.app) as a:
        b, c = TestClient(main.app), TestClient(main.app)
        assert a.get("/api/jobs").status_code == 200 and b.get("/api/jobs").status_code == 200
        r = c.get("/api/jobs")
        assert r.status_code == 503 and "full" in r.json()["detail"] and r.headers["retry-after"]
        assert COOKIE_NAME not in c.cookies
        main.manager.reap(time.time() + main.manager.idle_seconds + 60)  # both are idle now
        assert c.get("/api/jobs").status_code == 200


# ---------------------------------------------------------------- public-mode limits

def test_jobs_per_session_quota(app_ctx, monkeypatch):
    main, a = app_ctx
    monkeypatch.setattr(config, "MAX_JOBS_PER_SESSION", 2)
    ids = [upload(a).json()["id"] for _ in range(2)]
    [wait(a, i) for i in ids]
    r = upload(a)
    assert r.status_code == 429 and "Delete some" in r.json()["detail"]
    a.delete(f"/api/jobs/{ids[0]}")
    assert upload(a).status_code == 201  # room again
    assert a.post(f"/api/jobs/{ids[1]}/rerun", json={}).status_code in (201, 429)


def test_queue_limit_protects_the_server(app_ctx, monkeypatch):
    main, a = app_ctx
    monkeypatch.setattr(config, "MAX_QUEUE", 1)
    first = upload(a, prompt="slow").json()["id"]
    wait(a, first, want=("running",))
    r = upload(TestClient(main.app))
    assert r.status_code == 429 and "busy" in r.json()["detail"] and r.headers["retry-after"]
    a.post(f"/api/jobs/{first}/cancel")
    wait(a, first)


def test_upload_rate_limit_per_ip(app_ctx, monkeypatch):
    main, a = app_ctx
    monkeypatch.setattr(main, "upload_limiter", RateLimiter(2, 3600))
    assert upload(a).status_code == 201 and upload(a).status_code == 201
    r = upload(a)
    assert r.status_code == 429 and int(r.headers["retry-after"]) > 0
    assert len(a.get("/api/jobs").json()) == 2  # the refused upload stored nothing


def test_rate_limiter_unit():
    now = [0.0]
    rl = RateLimiter(2, 10, clock=lambda: now[0])
    assert rl.allow("ip") and rl.allow("ip") and not rl.allow("ip")
    assert rl.allow("other") and rl.retry_after("ip") == 11
    now[0] = 10.5
    assert rl.allow("ip")  # the window moved on
    assert RateLimiter(0, 10).allow("x")  # 0 = off


def test_low_disk_space_is_a_clean_507(app_ctx, monkeypatch):
    main, a = app_ctx
    monkeypatch.setattr(config, "MIN_FREE_GB", 10 ** 9)  # more than any disk has
    r = upload(a)
    assert r.status_code == 507 and "disk space" in r.json()["detail"]
    assert a.get("/api/jobs").json() == []


def test_media_longer_than_the_limit_fails_with_a_clear_message(monkeypatch):
    import numpy as np
    monkeypatch.setattr(config, "MAX_DURATION_MIN", 1)
    audio = np.zeros(16000 * 90, np.float32)  # 90 s > 1 min
    loader = type("L", (), {"thread": type("T", (), {"is_alive": lambda s: False})(), "result": lambda s, c=None: None})()
    with pytest.raises(RuntimeError, match=r"limit on this server is 1 minutes"):
        engine._recognise(audio, dict(engine.DEFAULT_OPTIONS), lambda *a, **k: None, None, lambda: False, loader)


def test_only_allowed_models_are_offered_and_accepted(app_ctx, monkeypatch):
    main, a = app_ctx
    monkeypatch.setattr(config, "ALLOWED_MODELS", ["base", "small"])
    assert {m["id"] for m in a.get("/api/models").json()} == {"base", "small"}
    r = a.post("/api/jobs", params={"filename": "x.mp4", "options": json.dumps({"model": "large-v3"})}, content=b"abc",
               headers={"content-type": "application/octet-stream"})
    assert r.status_code == 422 and "not available on this server" in r.json()["detail"]
    assert upload(a).status_code == 201  # the default model ("small") is allowed


# ---------------------------------------------------------------- the public website

@pytest.fixture()
def public(monkeypatch):
    monkeypatch.setattr(config, "PUBLIC", True)
    monkeypatch.setattr(config, "ADMIN_TOKEN", None)
    monkeypatch.setattr(config, "TRUST_PROXY", True)
    monkeypatch.setattr(engine, "transcribe", fake_transcribe)
    from app import main
    BUFFER.clear()
    with TestClient(main.app) as c:
        yield main, c


def test_logs_are_hidden_on_the_public_site_unless_an_admin_token_is_set(public, monkeypatch):
    main, c = public
    assert c.get("/api/logs").status_code == 404 and c.get("/api/logs/stream").status_code == 404
    assert c.delete("/api/logs").status_code == 404
    assert c.get("/api/health").json()["logs_enabled"] is False
    assert c.post("/api/logs/client", json={"level": "ERROR", "message": "boom"}).status_code == 204  # still accepted

    monkeypatch.setattr(config, "ADMIN_TOKEN", "s3cret-token")
    h = c.get("/api/health").json()
    assert h["logs_enabled"] is True and h["logs_require_token"] is True
    assert c.get("/api/logs").status_code == 401
    assert c.get("/api/logs", headers={"authorization": "Bearer wrong"}).status_code == 401
    assert c.get("/api/logs", params={"token": "wrong"}).status_code == 401
    ok = c.get("/api/logs", headers={"authorization": "Bearer s3cret-token"})
    assert ok.status_code == 200 and any("boom" in e["message"] for e in ok.json()["entries"])
    assert c.get("/api/logs", params={"token": "s3cret-token"}).status_code == 200


def test_logs_stay_open_on_a_local_install(app_ctx):
    main, a = app_ctx
    assert a.get("/api/logs").status_code == 200
    assert a.get("/api/health").json()["logs_enabled"] is True


def test_public_health_exposes_branding_and_limits_but_not_hardware(public):
    main, c = public
    h = c.get("/api/health").json()
    assert h["public"] is True and h["brand"]["name"] == "TranscribeVid" and h["brand"]["domain"] == "transcribevid.com"
    assert h["brand"]["url"] == "https://transcribevid.com"
    assert h["device"] is None and h["compute_type"] is None
    assert h["max_upload_mb"] == config.MAX_UPLOAD_MB and "session_idle_minutes" in h and "max_duration_min" in h


def test_www_redirects_to_the_bare_domain_and_http_to_https(public):
    main, c = public
    r = c.get("/about?x=1", headers={"host": "www.transcribevid.com"}, follow_redirects=False)
    assert r.status_code == 301 and r.headers["location"] == "https://transcribevid.com/about?x=1"
    r = c.post("/api/session", headers={"host": "www.transcribevid.com"}, follow_redirects=False)
    assert r.status_code == 308  # a POST keeps its method
    r = c.get("/api/health", headers={"host": "transcribevid.com", "x-forwarded-proto": "http"}, follow_redirects=False)
    assert r.status_code == 301 and r.headers["location"] == "https://transcribevid.com/api/health"
    ok = c.get("/api/health", headers={"host": "transcribevid.com", "x-forwarded-proto": "https"}, follow_redirects=False)
    assert ok.status_code == 200
    # health checks from inside the container (no forwarded header, host 127.0.0.1) are never redirected
    assert c.get("/api/health", headers={"host": "127.0.0.1:8000"}, follow_redirects=False).status_code == 200


def test_only_our_own_hostnames_are_served(public):
    main, c = public
    for host in ("evil.example", "transcribevid.com.evil.example", "evil-transcribevid.com", "attacker.com:8000"):
        assert c.get("/api/health", headers={"host": host}).status_code == 400, host
    for host in ("transcribevid.com", "localhost:8000", "127.0.0.1", "app:8000"):
        assert c.get("/api/health", headers={"host": host, "x-forwarded-proto": "https"}).status_code == 200, host


def upload_with(c, headers):
    return c.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc",
                  headers={"content-type": "application/octet-stream", **headers})


def test_the_public_origin_may_write_but_other_sites_may_not(public):
    main, c = public
    h = {"host": "transcribevid.com", "x-forwarded-proto": "https"}
    assert upload_with(c, {**h, "origin": "https://transcribevid.com"}).status_code == 201
    assert upload_with(c, {**h, "origin": "https://evil.example"}).status_code == 403
    assert c.delete("/api/session", headers={**h, "origin": "https://evil.example"}).status_code == 403  # no CSRF wipe


def test_every_response_carries_security_headers_and_https_is_pinned(public):
    main, c = public
    r = c.get("/api/health", headers={"x-forwarded-proto": "https"})
    for k, v in (("x-content-type-options", "nosniff"), ("x-frame-options", "DENY"),
                 ("referrer-policy", "strict-origin-when-cross-origin")):
        assert r.headers[k] == v
    assert "microphone=(self)" in r.headers["permissions-policy"]
    https = TestClient(main.app, base_url="https://transcribevid.com")  # no `with`: reuse this test's app lifespan
    assert "max-age=31536000" in https.get("/api/health").headers["strict-transport-security"]
    assert "strict-transport-security" not in c.get("/api/health").headers  # never over plain http


def test_a_visitors_data_is_gone_after_the_session_is_deleted_even_on_disk(public):
    main, c = public
    jid = upload(c).json()["id"]
    wait(c, jid)
    sess = main.manager.get(c.cookies[COOKIE_NAME])
    files = [p for p in sess.store.root.rglob("*") if p.is_file()]
    assert any(p.name.startswith("media") for p in files)
    c.delete("/api/session")
    assert not any(p.exists() for p in files if p.name.startswith("media"))


def test_public_mode_from_the_environment_applies_safe_defaults():
    """VT_PUBLIC=1 at start-up: no API docs, tighter limits (unlimited jobs per session: "free, unlimited"), logs
    closed, transcription counter on. (Fresh interpreter: config is read at import.)"""
    import subprocess, sys, os
    code = ("from app import config, main; "
            "print(main.app.docs_url, main.app.openapi_url, config.MAX_UPLOAD_MB, config.SESSION_IDLE_MINUTES, "
            "config.MAX_DURATION_MIN, config.RATE_UPLOADS_PER_HOUR, config.MAX_JOBS_PER_SESSION, config.MAX_QUEUE, "
            "config.PUBLIC_URL, config.ADMIN_TOKEN, config.COUNT_JOBS)")
    env = {**os.environ, "VT_PUBLIC": "1", "VT_DATA_DIR": str(config.DATA_DIR)}
    for k in ("VT_MAX_UPLOAD_MB", "VT_ADMIN_TOKEN", "VT_PUBLIC_URL", "VT_MAX_JOBS_PER_SESSION", "VT_COUNT_JOBS"):
        env.pop(k, None)
    out = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, env=env,
                         cwd=str(__import__("pathlib").Path(config.BACKEND_DIR)), timeout=120)
    assert out.returncode == 0, out.stderr[-500:]
    assert out.stdout.split() == ["None", "None", "500", "30", "60", "30", "0", "30", "https://transcribevid.com", "None", "True"]


def test_real_pages_are_200_and_unknown_urls_are_a_true_404_with_the_app_shell(app_ctx):
    main, a = app_ctx
    if not config.STATIC_DIR.is_dir():
        pytest.skip("the Angular app is not built")
    for path in ("/", "/about", "/privacy", "/terms", "/logs", "/jobs/" + "a" * 32):
        r = a.get(path)
        assert r.status_code == 200 and "<app-root" in r.text, path
    for path in ("/nope", "/jobs/abc", "/jobs/" + "a" * 33, "/privacy/x", "/.env", "/admin"):
        r = a.get(path)
        assert r.status_code == 404 and "<app-root" in r.text, path  # the friendly in-app 404 page, real status
    assert a.get("/api/nonexistent").status_code == 404 and a.get("/api/nonexistent").json()["detail"] == "Not found"
