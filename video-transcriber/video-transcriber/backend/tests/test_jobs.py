"""JobStore: session-only storage, editing, cancel/delete, upload limits."""
import asyncio
import shutil
import time
import uuid
from collections import namedtuple

import pytest
from fastapi.testclient import TestClient

from app import config, engine
from app.jobs import JobStore


def seg(i, text, start, end, words=True):
    return {"id": i, "start": start, "end": end, "text": text, "confidence": 0.9, "no_speech_prob": 0.0,
            "words": [{"start": start, "end": end, "word": text, "probability": 0.9}] if words else None}


@pytest.fixture()
def store(tmp_path):
    """A store whose worker thread is not started, so jobs stay exactly where a test puts them."""
    s = JobStore(tmp_path / "session", start_worker=False)
    yield s
    s.close()


def add_job(store, status="done", segments=None, **extra):
    """Insert a finished/queued/... job directly (bypassing upload + worker)."""
    jid = uuid.uuid4().hex
    d = store.dir(jid)
    d.mkdir(parents=True)
    (d / "media.mp4").write_bytes(b"x")
    job = store._new_job(jid, "t.mp4", "media.mp4", 1, {})
    segments = segments if segments is not None else []
    job.update(status=status, segments=segments, segment_count=len(segments), duration=10.0, language="en",
               created_at=time.time(), **extra)
    store.jobs[jid] = job
    return job


# ---------------------------------------------------------------- session semantics

def test_nothing_is_persisted_to_disk(store):
    job = add_job(store, "done", [seg(0, "hello", 0, 1)])
    store.update_segments(job["id"], [{"id": 0, "text": "changed"}])
    store.update_title(job["id"], "renamed")
    files = {p.name for p in store.root.rglob("*") if p.is_file()}
    # no job.json, no metadata file: only the uploaded media and the (empty-content) instance lock marker
    assert files == {"media.mp4", ".vt-session.lock"}


def stale_session(name="deadbeef0000", with_lock=True):
    d = config.SESSION_ROOT / name
    (d / ("a" * 32)).mkdir(parents=True)
    (d / ("a" * 32) / "media.mp4").write_bytes(b"leftover")
    (d / "tmp").mkdir()
    (d / "tmp" / "stale.f32").write_bytes(b"x")
    if with_lock:
        (d / ".vt-session.lock").write_bytes(b"x")
    return d


def test_a_new_store_starts_empty_and_removes_dead_sessions(isolated_storage):
    old = stale_session()
    s = JobStore(start_worker=False)  # default root = a fresh per-session dir
    try:
        assert s.jobs == {}
        assert not old.exists()  # its owner is gone (nobody holds the lock), so it is wiped
        assert s.root.parent == config.SESSION_ROOT and s.root.is_dir()
        assert s.tmp_dir == s.root / "tmp" and s.tmp_dir.is_dir()  # scratch lives inside the session
    finally:
        s.close()


def test_a_second_instance_never_touches_a_live_one(isolated_storage):
    first = JobStore(start_worker=False)
    try:
        job = add_job(first, "done")
        second = JobStore(start_worker=False)  # starts while `first` is alive
        try:
            assert first.root.exists() and (first.dir(job["id"]) / "media.mp4").exists()
        finally:
            second.close()
        assert first.root.exists() and (first.dir(job["id"]) / "media.mp4").exists()
    finally:
        first.close()
    assert not first.root.exists()


def test_folders_without_our_marker_are_never_deleted(isolated_storage):
    foreign = stale_session("not-ours", with_lock=False)
    legacy_jobs = config.DATA_DIR / "jobs" / ("b" * 32)
    legacy_jobs.mkdir(parents=True)
    s = JobStore(start_worker=False)
    try:
        assert foreign.exists() and legacy_jobs.exists()
    finally:
        s.close()


def test_close_removes_scratch_and_locked_temp_files(store, monkeypatch):
    f = store.tmp_dir / "leftover.f32"
    f.write_bytes(b"x")
    root = store.root
    store.close()
    assert not root.exists() and not f.exists()


def test_close_erases_everything_and_is_idempotent(store):
    add_job(store, "done")
    (store.tmp_dir / "x.f32").write_bytes(b"x")
    root = store.root
    store.close()
    assert not root.exists()
    store.close()  # second call is a no-op


def test_close_cancels_queued_jobs_and_refuses_new_uploads(store):
    job = add_job(store, "queued")
    store.close()
    assert store.get(job["id"])["status"] == "cancelled"

    async def chunks():
        yield b"abc"

    with pytest.raises(OSError):
        asyncio.run(store.create(chunks(), "a.mp4", {}))


# ---------------------------------------------------------------- re-run

def test_rerun_makes_a_new_job_from_the_same_media(store):
    j = add_job(store, "done")
    new = store.rerun(j["id"], {"model": "medium"})
    assert new["options"]["model"] == "medium" and new["title"] == j["title"]
    assert new["id"] != j["id"] and (store.dir(new["id"]) / "media.mp4").exists()
    assert "folder_id" not in new and "folder_id" not in store.summaries()[0]


def test_rerun_failure_leaves_no_orphan_folder(store, monkeypatch):
    j = add_job(store, "done")
    before = {p.name for p in job_dirs(store.root)}
    monkeypatch.setattr(JobStore, "_link_or_copy", staticmethod(lambda a, b: (_ for _ in ()).throw(OSError("disk full"))))
    with pytest.raises(OSError):
        store.rerun(j["id"], {})
    assert {p.name for p in job_dirs(store.root)} == before and len(store.jobs) == 1


def test_rerun_after_the_source_was_deleted_is_a_clean_not_found(store):
    j = add_job(store, "done")
    (store.dir(j["id"]) / "media.mp4").unlink()
    with pytest.raises(KeyError):
        store.rerun(j["id"], {})
    assert len(job_dirs(store.root)) == 1  # only the source dir; no orphan


def test_editing_a_deleted_job_is_a_clean_keyerror(store):
    for fn in (lambda: store.update_title("0" * 32, "x"), lambda: store.update_segments("0" * 32, [])):
        with pytest.raises(KeyError):
            fn()


def test_rename_a_job_title(store):
    j = add_job(store, "done")
    v0 = j["version"]
    assert store.update_title(j["id"], "  My interview  ")["title"] == "My interview"
    assert j["version"] > v0  # live viewers are told
    assert store.summaries()[0]["title"] == "My interview"
    store.update_title(j["id"], "   ")  # blank: keep the old title
    assert store.get(j["id"])["title"] == "My interview"
    assert len(store.update_title(j["id"], "x" * 500)["title"]) == 200


# ---------------------------------------------------------------- update_segments

def done_store(store, segments):
    return add_job(store, "done", segments=segments)["id"]


def test_text_edit_clears_words_and_marks_edited(store):
    jid = done_store(store, [seg(0, "hello", 0, 1), seg(1, "world", 1, 2)])
    job = store.update_segments(jid, [{"id": 0, "text": "  Hello!  "}])
    s0, s1 = job["segments"]
    assert s0["text"] == "Hello!" and s0["words"] is None and s0["edited"] is True
    assert s1["words"] is not None and "edited" not in s1  # untouched segment keeps word timings
    assert job["version"] >= 1
    assert job["stats"]["word_count"] == 2


def test_unchanged_text_keeps_words(store):
    jid = done_store(store, [seg(0, "hello", 0, 1)])
    job = store.update_segments(jid, [{"id": 0, "text": "hello", "start": 0.2, "end": 1.5}])
    s = job["segments"][0]
    assert s["words"] is not None and "edited" not in s
    assert (s["start"], s["end"]) == (0.2, 1.5)


def test_delete_segment_updates_count(store):
    jid = done_store(store, [seg(0, "a", 0, 1), seg(1, "b", 1, 2), seg(2, "c", 2, 3)])
    job = store.update_segments(jid, [{"id": 1, "text": "", "deleted": True}])
    assert [s["text"] for s in job["segments"]] == ["a", "c"]
    assert job["segment_count"] == 2


def test_minimum_duration_and_clamping(store):
    jid = done_store(store, [seg(0, "a", 1, 2)])
    job = store.update_segments(jid, [{"id": 0, "text": "a", "start": 5.0, "end": 4.0}])
    s = job["segments"][0]
    assert s["start"] == 5.0 and s["end"] == pytest.approx(5.1)
    job = store.update_segments(jid, [{"id": 0, "text": "a", "start": -3.0, "end": 0.0}])
    assert job["segments"][0]["start"] == 0.0 and job["segments"][0]["end"] == pytest.approx(0.1)


def test_update_segments_requires_done(store):
    job = add_job(store, "error")
    with pytest.raises(ValueError):
        store.update_segments(job["id"], [])


# ---------------------------------------------------------------- cancel / delete / ids

def test_cancel_queued_job(store):
    job = add_job(store, "queued")
    out = store.cancel(job["id"])
    assert out["status"] == "cancelled" and out["finished_at"]
    with pytest.raises(KeyError):
        store.cancel("0" * 32)


def test_delete_removes_directory(store):
    job = add_job(store, "done")
    store.delete(job["id"])
    assert not store.dir(job["id"]).exists() and store.get(job["id"]) is None
    with pytest.raises(KeyError):
        store.delete(job["id"])


def test_delete_running_refused(store):
    job = add_job(store, "done")
    store.jobs[job["id"]]["status"] = "running"
    with pytest.raises(ValueError):
        store.delete(job["id"])
    assert store.dir(job["id"]).exists()


@pytest.mark.parametrize("bad", ["../x", "..", "0" * 31, "0" * 33, "", "../" + "0" * 32,
                                 "0" * 31 + "/", "0" * 30 + "..", "G" * 32, "0" * 32 + "\n"])
def test_invalid_job_id_rejected(store, bad):
    with pytest.raises(KeyError):
        store.dir(bad)


def test_valid_id_stays_inside_root(store):
    assert store.dir(uuid.uuid4().hex).parent == store.root


# ---------------------------------------------------------------- worker

def test_worker_survives_a_failing_job_and_runs_the_next(tmp_path, monkeypatch):
    calls = []

    def fake(path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
        calls.append(options.get("prompt"))
        if options.get("prompt") == "boom":
            raise RuntimeError("model exploded")
        s = {"id": 0, "start": 0, "end": 1, "text": "ok", "words": None, "confidence": 0.9, "no_speech_prob": 0}
        on_segment(s, 1.0, {"language": "en", "duration": 1.0})
        return {"language": "en", "language_probability": 0.9, "duration": 1.0, "segments": [s]}

    monkeypatch.setattr(engine, "transcribe", fake)
    s = JobStore(tmp_path / "s")

    async def one(prompt):
        async def chunks():
            yield b"abc"
        return await s.create(chunks(), "a.mp4", {"prompt": prompt})

    try:
        bad = asyncio.run(one("boom"))
        good = asyncio.run(one("fine"))
        deadline = time.time() + 10
        while time.time() < deadline and s.get(good["id"])["status"] not in ("done", "error"):
            time.sleep(0.05)
        assert s.get(bad["id"])["status"] == "error" and "exploded" in s.get(bad["id"])["error"]
        assert s.get(good["id"])["status"] == "done"
    finally:
        s.close()


def test_cancel_before_start_is_not_overwritten_by_the_worker(tmp_path, monkeypatch):
    ran = []
    monkeypatch.setattr(engine, "transcribe", lambda *a, **k: ran.append(1))
    s = JobStore(tmp_path / "s", start_worker=False)
    try:
        job = add_job(s, "queued")
        s.cancel(job["id"])
        s._run(job)  # what the worker would do when it picks the id up
        assert job["status"] == "cancelled" and not ran
    finally:
        s.close()


# ---------------------------------------------------------------- upload limits (HTTP)

@pytest.fixture()
def client(monkeypatch):
    def cancelled(*a, **k):
        raise engine.Cancelled()
    monkeypatch.setattr(engine, "transcribe", cancelled)
    from app.main import app
    with TestClient(app) as c:
        yield c


def post(client, data, name="clip.mp4"):
    return client.post("/api/jobs", params={"filename": name, "options": "{}"}, content=data,
                       headers={"content-type": "application/octet-stream"})


def job_dirs(root):
    """Per-job folders only (the session folder also holds the lock marker and the tmp scratch dir)."""
    return [p for p in root.iterdir() if p.is_dir() and len(p.name) == 32]


def session_dirs():
    """Every job folder of every visitor session (data/session/<instance>/<visitor>/<job>)."""
    return [p for r in config.SESSION_ROOT.glob("*/*") if r.is_dir() for p in job_dirs(r)]


def test_upload_over_limit_413_leaves_nothing(client, monkeypatch):
    monkeypatch.setattr(config, "MAX_UPLOAD_BYTES", 1024)
    r = post(client, b"x" * 5000)
    assert r.status_code == 413
    assert session_dirs() == []
    assert client.get("/api/jobs").json() == []


def test_upload_at_limit_ok(client, monkeypatch):
    monkeypatch.setattr(config, "MAX_UPLOAD_BYTES", 1024)
    assert post(client, b"x" * 1024).status_code == 201


def test_disk_space_guard_507(client, monkeypatch):
    Usage = namedtuple("usage", "total used free")
    monkeypatch.setattr(shutil, "disk_usage", lambda p: Usage(100, 100, 10))
    r = post(client, b"x" * 5000)
    assert r.status_code == 507 and "disk space" in r.json()["detail"].lower()
    assert session_dirs() == []


def test_store_create_cleans_up_on_stream_error(store):
    async def chunks():
        yield b"abc"
        raise ConnectionError("client went away")

    with pytest.raises(ConnectionError):
        asyncio.run(store.create(chunks(), "a.mp4", {}))
    assert job_dirs(store.root) == []


def test_filename_extension_sanitised(store):
    async def chunks():
        yield b"abc"

    job = asyncio.run(store.create(chunks(), "evil.m p/4", {}))
    assert job["media_file"].startswith("media.") and "/" not in job["media_file"]
    job2 = asyncio.run(store.create(chunks(), "noext", {}))
    assert job2["media_file"] == "media.bin"
