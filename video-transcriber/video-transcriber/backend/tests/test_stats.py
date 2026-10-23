"""The website-wide "videos transcribed" counter: the Counter class, when a job is counted, the config switches
and the GET /api/stats endpoint. Nothing here may ever touch a real stats file (conftest points it at tmp_path
and switches counting off; tests that need counting turn it on themselves with the `counting` fixture)."""
import asyncio
import json
import logging
import os
import subprocess
import sys
import threading
import time

import pytest
from fastapi.testclient import TestClient

from app import config, engine, stats
from app.jobs import JobStore
from app.logbuffer import BUFFER
from app.sessions import COOKIE_NAME, SessionManager
from app.stats import Counter


# ---------------------------------------------------------------- helpers

@pytest.fixture()
def logs():
    """WARNING/INFO records of the counter's logger (the `vt` logger does not propagate, so caplog cannot see them)."""
    records = []

    class Grab(logging.Handler):
        def emit(self, record):
            records.append(record)

    handler, lg = Grab(logging.DEBUG), logging.getLogger("vt.stats")
    old_level = lg.level
    lg.addHandler(handler)
    lg.setLevel(logging.DEBUG)
    yield records
    lg.removeHandler(handler)
    lg.setLevel(old_level)


def messages(records, level=None):
    return [r.getMessage() for r in records if level is None or r.levelno == level]


@pytest.fixture()
def counting(monkeypatch, tmp_path):
    """Counting switched ON, writing to a throw-away file. Yields that file's path."""
    path = tmp_path / "stats-volume" / "stats.json"
    monkeypatch.setattr(config, "COUNT_JOBS", True)
    monkeypatch.setattr(config, "STATS_FILE", path)
    stats.reset()
    return path


def read_file(path):
    return json.loads(path.read_text(encoding="utf-8"))


def fake_engine(path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
    """prompt 'boom' -> fails, 'slow' -> runs until cancelled, anything else -> finishes at once."""
    prompt = options.get("prompt")
    if prompt == "boom":
        raise RuntimeError("model exploded")
    if prompt == "slow":
        for _ in range(500):
            if should_cancel():
                raise engine.Cancelled()
            time.sleep(0.02)
    seg = {"id": 0, "start": 0.0, "end": 1.8, "text": "Hello world.", "words": None, "confidence": 0.95,
           "no_speech_prob": 0.01}
    on_phase("transcribing")
    on_segment(seg, 1.0, {"language": "en", "duration": 2.0})
    return {"language": "en", "language_probability": 0.99, "duration": 2.0, "segments": [dict(seg)]}


@pytest.fixture()
def store(tmp_path, monkeypatch):
    """A store without a worker thread: tests run jobs themselves with store._process(job_id), step by step."""
    monkeypatch.setattr(engine, "transcribe", fake_engine)
    monkeypatch.setattr(engine, "make_audio_preview", lambda s, d: d.write_bytes(b"mp3") or True)
    s = JobStore(tmp_path / "session", start_worker=False)
    yield s
    s.close()


def upload_job(store, prompt="", name="clip.mp4"):
    async def chunks():
        yield b"not-really-video"
    return asyncio.run(store.create(chunks(), name, {"prompt": prompt}))


def run(store, job):
    store._process(job["id"])
    return store.get(job["id"])["status"]


# ================================================================ Counter: persistence and robustness

def test_a_missing_file_means_zero_and_loading_creates_nothing(tmp_path):
    path = tmp_path / "data" / "stats.json"
    c = Counter(path)
    assert c.total == 0 and c.updated_at is None
    assert not path.exists() and not path.parent.exists()  # nothing is written until something is counted


def test_increment_persists_exactly_an_integer_and_a_timestamp(tmp_path):
    path = tmp_path / "stats.json"
    c = Counter(path)
    assert c.increment() == 1 and c.increment() == 2 and c.total == 2
    data = read_file(path)
    assert set(data) == {"transcribed", "updated_at"}  # no per-visitor data of any kind
    assert data["transcribed"] == 2 and isinstance(data["transcribed"], int)
    assert data["updated_at"].endswith("Z") and len(data["updated_at"]) == len("2026-01-01T00:00:00Z")
    assert c.updated_at == data["updated_at"]
    assert [p.name for p in tmp_path.iterdir()] == ["stats.json"]  # no temp file left behind


def test_the_count_survives_a_new_counter_instance(tmp_path):
    path = tmp_path / "stats.json"
    first = Counter(path)
    for _ in range(3):
        first.increment()
    second = Counter(path)  # "the server restarted"
    assert second.total == 3
    assert second.increment() == 4
    assert Counter(path).total == 4
    assert not (tmp_path / "stats.json.corrupt").exists()  # a healthy file is never quarantined


def test_huge_numbers_round_trip(tmp_path):
    path = tmp_path / "stats.json"
    path.write_text(json.dumps({"transcribed": 10 ** 15, "updated_at": "2026-01-01T00:00:00Z"}), encoding="utf-8")
    c = Counter(path)
    assert c.total == 10 ** 15 and c.increment() == 10 ** 15 + 1
    assert Counter(path).total == 10 ** 15 + 1


def test_extra_keys_in_an_existing_file_are_ignored_and_dropped_on_the_next_write(tmp_path):
    path = tmp_path / "stats.json"
    path.write_text(json.dumps({"transcribed": 7, "updated_at": "x", "visitors": ["a"]}), encoding="utf-8")
    c = Counter(path)
    assert c.total == 7
    c.increment()
    assert set(read_file(path)) == {"transcribed", "updated_at"}


CORRUPT = [
    b"", b"not json at all", b'{"transcribed": 12', b"[1, 2, 3]", b'"12"', b"{}", b'{"transcribed": "12"}',
    b'{"transcribed": -5}', b'{"transcribed": 1.5}', b'{"transcribed": true}', b'{"transcribed": null}',
    b"\xff\xfe\x00 garbage bytes", b"[" * 100000,
]


@pytest.mark.parametrize("payload", CORRUPT, ids=[repr(p[:24]) for p in CORRUPT])
def test_a_corrupt_file_means_zero_and_is_moved_aside(tmp_path, logs, payload):
    path = tmp_path / "stats.json"
    path.write_bytes(payload)
    c = Counter(path)  # must not raise
    assert c.total == 0
    assert not path.exists()
    assert (tmp_path / "stats.json.corrupt").read_bytes() == payload  # kept for inspection
    assert any("corrupt" in m for m in messages(logs, logging.WARNING))
    assert c.increment() == 1  # and counting carries on, writing a fresh valid file
    assert read_file(path)["transcribed"] == 1
    assert Counter(path).total == 1


def test_a_second_corrupt_file_replaces_the_first_quarantine_copy(tmp_path):
    path = tmp_path / "stats.json"
    path.write_bytes(b"first garbage")
    Counter(path)
    path.write_bytes(b"second garbage")
    assert Counter(path).total == 0
    assert (tmp_path / "stats.json.corrupt").read_bytes() == b"second garbage"


def test_a_path_that_cannot_be_written_never_crashes_and_keeps_counting_in_memory(tmp_path, logs):
    blocker = tmp_path / "blocker"
    blocker.write_text("i am a file, so nothing can be created below me")
    c = Counter(blocker / "sub" / "stats.json")
    assert c.increment() == 1 and c.increment() == 2 and c.total == 2  # still served from memory
    assert messages(logs, logging.WARNING)  # the problem is reported ...
    assert sorted(p.name for p in tmp_path.iterdir()) == ["blocker"]  # ... and nothing stray was created


def test_an_unreadable_existing_file_is_never_overwritten(tmp_path, logs):
    """A directory where the file should be (reading it fails with an OSError on every platform)."""
    path = tmp_path / "stats.json"
    path.mkdir()
    (path / "keep.txt").write_text("precious")
    c = Counter(path)
    assert c.total == 0 and c.increment() == 1  # in-memory only
    assert path.is_dir() and (path / "keep.txt").read_text() == "precious"
    assert len(messages(logs, logging.WARNING)) >= 2  # "cannot read" at start, "not saved" on the increment


@pytest.mark.skipif(os.name == "nt" or (hasattr(os, "geteuid") and os.geteuid() == 0),
                    reason="needs POSIX permissions and a non-root user")
def test_a_read_only_directory_does_not_crash(tmp_path, logs):
    d = tmp_path / "ro"
    d.mkdir()
    d.chmod(0o500)
    try:
        c = Counter(d / "stats.json")
        assert c.increment() == 1 and c.increment() == 2
        assert any("could not write" in m for m in messages(logs, logging.WARNING))
    finally:
        d.chmod(0o700)


@pytest.mark.parametrize("failing", ["replace", "fsync"])
def test_a_failed_write_keeps_the_old_file_intact_and_leaves_no_temp_file(tmp_path, monkeypatch, logs, failing):
    path = tmp_path / "stats.json"
    c = Counter(path)
    c.increment()
    before = path.read_bytes()

    def boom(*a, **k):
        raise OSError(28, "No space left on device")
    with monkeypatch.context() as m:
        m.setattr(os, failing, boom)
        assert c.increment() == 2 and c.total == 2  # the in-memory count moves on
    assert path.read_bytes() == before  # atomic: the file still holds the last good number, never half a write
    assert [p.name for p in tmp_path.iterdir()] == ["stats.json"]
    assert any("could not write" in m and "No space left" in m for m in messages(logs, logging.WARNING))
    assert c.increment() == 3 and read_file(path)["transcribed"] == 3  # and it recovers once the disk does


def test_the_write_goes_through_a_temp_file_in_the_same_folder(tmp_path, monkeypatch):
    seen = []
    real_replace = os.replace

    def spy(src, dst):
        seen.append((os.path.dirname(os.path.abspath(src)), os.path.abspath(dst), os.path.exists(src)))
        return real_replace(src, dst)
    monkeypatch.setattr(os, "replace", spy)
    Counter(tmp_path / "stats.json").increment()
    assert seen == [(str(tmp_path), str(tmp_path / "stats.json"), True)]  # same folder = a real atomic rename


# ================================================================ Counter: concurrency

def test_threads_incrementing_at_the_same_time_give_the_exact_total(tmp_path):
    path = tmp_path / "stats.json"
    c = Counter(path)
    n_threads, each = 8, 25
    barrier, results, errors = threading.Barrier(n_threads), [], []

    def work():
        try:
            barrier.wait()
            results.extend(c.increment() for _ in range(each))
        except BaseException as e:  # noqa
            errors.append(e)

    threads = [threading.Thread(target=work) for _ in range(n_threads)]
    [t.start() for t in threads]
    [t.join(60) for t in threads]
    assert not errors
    assert c.total == n_threads * each == 200
    assert sorted(results) == list(range(1, 201))  # every increment saw a different value: none lost, none doubled
    assert read_file(path)["transcribed"] == 200 and Counter(path).total == 200


def test_readers_never_see_the_count_go_backwards_while_writers_run(tmp_path):
    c = Counter(tmp_path / "stats.json")
    stop, seen = threading.Event(), []

    def read():
        while not stop.is_set():
            if not seen or c.total != seen[-1]:
                seen.append(c.total)
            time.sleep(0)

    reader = threading.Thread(target=read)
    reader.start()
    for _ in range(20):
        c.increment()
    stop.set()
    reader.join(10)
    assert seen == sorted(seen) and c.total == 20


# ================================================================ module level: switch, singleton, logging

def test_when_counting_is_off_the_count_is_zero_even_if_a_file_has_a_number(monkeypatch, tmp_path):
    path = tmp_path / "stats.json"
    path.write_text(json.dumps({"transcribed": 99, "updated_at": "x"}), encoding="utf-8")
    monkeypatch.setattr(config, "STATS_FILE", path)
    stats.reset()
    monkeypatch.setattr(config, "COUNT_JOBS", False)
    assert stats.total() == 0
    assert stats.record_transcription() is None
    assert read_file(path)["transcribed"] == 99  # untouched
    monkeypatch.setattr(config, "COUNT_JOBS", True)
    assert stats.total() == 99  # the number is only hidden, never lost


def test_record_transcription_counts_persists_and_logs_the_total_at_info(counting, logs):
    assert stats.record_transcription() == 1 and stats.record_transcription() == 2
    assert read_file(counting)["transcribed"] == 2
    infos = messages(logs, logging.INFO)
    assert any("1 video(s) transcribed" in m for m in infos) and any("2 video(s) transcribed" in m for m in infos)
    assert all(r.name == "vt.stats" for r in logs)


def test_a_failing_counter_never_breaks_the_caller(counting, monkeypatch, logs):
    monkeypatch.setattr(Counter, "increment", lambda self: (_ for _ in ()).throw(RuntimeError("kaput")))
    assert stats.record_transcription() is None
    assert any(r.levelno == logging.ERROR for r in logs)


def test_the_counter_follows_the_configured_file(monkeypatch, tmp_path):
    monkeypatch.setattr(config, "COUNT_JOBS", True)
    for name, expected in (("a.json", 1), ("b.json", 1)):
        monkeypatch.setattr(config, "STATS_FILE", tmp_path / name)
        assert stats.record_transcription() == expected
    assert stats.get_counter() is stats.get_counter()  # one shared instance per file
    assert Counter(tmp_path / "a.json").total == 1


# ================================================================ when a job is counted

def test_a_finished_upload_is_counted_exactly_once(counting, store, logs):
    job = upload_job(store)
    assert stats.total() == 0  # queued: not yet
    assert run(store, job) == "done"
    assert stats.total() == 1 and read_file(counting)["transcribed"] == 1
    assert any("1 video(s) transcribed" in m for m in messages(logs, logging.INFO))
    store._count_once(store.get(job["id"]))  # even a second attempt for the same job changes nothing
    assert stats.total() == 1


def test_every_uploaded_file_counts_once(counting, store):
    for i in range(3):
        assert run(store, upload_job(store, name=f"clip{i}.mp4")) == "done"
    assert stats.total() == 3 and Counter(counting).total == 3


def test_a_failed_job_is_not_counted(counting, store):
    assert run(store, upload_job(store, prompt="boom")) == "error"
    assert stats.total() == 0 and not counting.exists()


def test_a_job_cancelled_while_queued_is_not_counted(counting, store):
    job = upload_job(store)
    store.cancel(job["id"])
    assert store.get(job["id"])["status"] == "cancelled"
    assert run(store, job) == "cancelled"  # the worker skips it
    assert stats.total() == 0 and not counting.exists()


def test_a_job_cancelled_while_running_is_not_counted(counting, tmp_path, monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_engine)
    s = JobStore(tmp_path / "live")  # with its own worker thread
    try:
        job = upload_job(s, prompt="slow")
        end = time.time() + 10
        while s.get(job["id"])["status"] != "running" and time.time() < end:
            time.sleep(0.02)
        assert s.get(job["id"])["status"] == "running"
        s.cancel(job["id"])
        while s.get(job["id"])["status"] == "running" and time.time() < end:
            time.sleep(0.02)
        assert s.get(job["id"])["status"] == "cancelled"
        assert stats.total() == 0 and not counting.exists()
    finally:
        s.close()


def test_deleting_a_finished_job_does_not_uncount_it(counting, store):
    job = upload_job(store)
    run(store, job)
    store.delete(job["id"])
    assert stats.total() == 1


def test_a_rerun_of_a_counted_upload_is_not_counted_again(counting, store):
    job = upload_job(store)
    run(store, job)
    again = store.rerun(job["id"], {"model": "tiny"})
    assert again["counted"] is True  # not countable: inherited from the job it was made from
    assert run(store, again) == "done"
    third = store.rerun(again["id"], {})  # a re-run of the re-run
    assert run(store, third) == "done"
    assert stats.total() == 1 and read_file(counting)["transcribed"] == 1


def test_a_rerun_of_a_failed_upload_counts_once_when_it_first_succeeds(counting, store):
    """The file was never transcribed before, so this is its first success: count it - but only once."""
    first = upload_job(store, prompt="boom")
    assert run(store, first) == "error" and stats.total() == 0
    retry_a = store.rerun(first["id"], {"prompt": "fine"})
    retry_b = store.rerun(first["id"], {"prompt": "fine again"})  # queued before retry_a finished
    assert run(store, retry_a) == "done"
    assert stats.total() == 1
    assert run(store, retry_b) == "done"
    assert stats.total() == 1  # the same upload: still one
    retry_c = store.rerun(first["id"], {"prompt": "yet again"})  # made from the failed original, after the success
    assert run(store, retry_c) == "done"
    assert stats.total() == 1


def test_a_new_upload_of_the_same_file_name_is_a_new_count(counting, store):
    run(store, upload_job(store, name="same.mp4"))
    run(store, upload_job(store, name="same.mp4"))
    assert stats.total() == 2  # counting is per upload, not per file name


def test_nothing_is_counted_when_counting_is_off(monkeypatch, tmp_path, store):
    path = tmp_path / "off" / "stats.json"
    monkeypatch.setattr(config, "STATS_FILE", path)
    monkeypatch.setattr(config, "COUNT_JOBS", False)
    stats.reset()
    job = upload_job(store)
    assert run(store, job) == "done"
    assert stats.total() == 0 and not path.exists() and not path.parent.exists()
    assert store.get(job["id"])["counted"] is False


def test_public_mode_alone_does_not_start_counting_in_tests(monkeypatch, store):
    """config.COUNT_JOBS is decided once at start-up from VT_COUNT_JOBS / VT_PUBLIC; flipping PUBLIC later is not enough."""
    monkeypatch.setattr(config, "PUBLIC", True)
    run(store, upload_job(store))
    assert stats.total() == 0 and not config.STATS_FILE.exists()


def test_a_broken_counter_does_not_fail_the_transcription(counting, store, monkeypatch):
    monkeypatch.setattr(Counter, "increment", lambda self: (_ for _ in ()).throw(RuntimeError("kaput")))
    job = upload_job(store)
    assert run(store, job) == "done"
    assert len(store.get(job["id"])["segments"]) == 1  # the transcript is intact


def test_an_unwritable_stats_file_does_not_fail_the_transcription(monkeypatch, store, tmp_path, logs):
    blocker = tmp_path / "blocker"
    blocker.write_text("x")
    monkeypatch.setattr(config, "COUNT_JOBS", True)
    monkeypatch.setattr(config, "STATS_FILE", blocker / "stats.json")
    stats.reset()
    assert run(store, upload_job(store)) == "done"
    assert stats.total() == 1  # kept in memory
    assert messages(logs, logging.WARNING)


# ================================================================ configuration (read once at start-up)

def fresh_config(expr, **env):
    """Evaluate `expr` against app.config in a fresh interpreter (config is read at import)."""
    clean = {k: v for k, v in os.environ.items() if not k.startswith("VT_")}
    out = subprocess.run([sys.executable, "-c", f"from app import config; print({expr})"], capture_output=True,
                         text=True, env={**clean, **env}, cwd=str(config.BACKEND_DIR), timeout=60)
    assert out.returncode == 0, out.stderr[-500:]
    return out.stdout.strip()


@pytest.mark.parametrize("env, expected", [
    ({}, "False"),                                                # a plain local run never counts
    ({"VT_COUNT_JOBS": "auto"}, "False"),
    ({"VT_PUBLIC": "1"}, "True"),                                 # the public site counts by default
    ({"VT_PUBLIC": "1", "VT_COUNT_JOBS": "auto"}, "True"),
    ({"VT_PUBLIC": "1", "VT_COUNT_JOBS": " AUTO "}, "True"),
    ({"VT_COUNT_JOBS": "1"}, "True"),                             # forced on
    ({"VT_PUBLIC": "1", "VT_COUNT_JOBS": "1"}, "True"),
    ({"VT_PUBLIC": "1", "VT_COUNT_JOBS": "0"}, "False"),          # forced off
    ({"VT_COUNT_JOBS": "0"}, "False"),
    ({"VT_PUBLIC": "1", "VT_COUNT_JOBS": "nonsense"}, "False"),   # anything unrecognised fails safe: off
])
def test_vt_count_jobs_switch(env, expected):
    assert fresh_config("config.COUNT_JOBS", **env) == expected
    assert fresh_config("type(config.COUNT_JOBS).__name__", **env) == "bool"


def test_the_stats_file_defaults_to_the_data_dir_outside_the_wiped_session_folder(tmp_path):
    data = tmp_path / "vt-data"
    assert fresh_config("config.STATS_FILE", VT_DATA_DIR=str(data)) == str(data.resolve() / "stats.json")
    inside = fresh_config("config.SESSION_ROOT in config.STATS_FILE.parents", VT_DATA_DIR=str(data))
    assert inside == "False"
    elsewhere = tmp_path / "volume" / "counter.json"
    assert fresh_config("config.STATS_FILE", VT_DATA_DIR=str(data), VT_STATS_FILE=str(elsewhere)) == str(elsewhere)


def test_public_mode_has_unlimited_jobs_per_session_by_default():
    assert fresh_config("config.MAX_JOBS_PER_SESSION", VT_PUBLIC="1") == "0"
    assert fresh_config("config.MAX_JOBS_PER_SESSION") == "0"
    assert fresh_config("config.MAX_JOBS_PER_SESSION", VT_PUBLIC="1", VT_MAX_JOBS_PER_SESSION="7") == "7"
    # the protections that stay: queue cap, per-IP hourly rate limit, file size and duration
    assert fresh_config("(config.MAX_QUEUE, config.RATE_UPLOADS_PER_HOUR, config.MAX_UPLOAD_MB, config.MAX_DURATION_MIN)",
                        VT_PUBLIC="1") == "(30, 30, 500, 60)"


def test_a_session_can_hold_more_than_the_old_limit_of_twenty_jobs(store):
    assert config.MAX_JOBS_PER_SESSION == 0  # the default
    for _ in range(25):
        upload_job(store)
    assert len(store.jobs) == 25


def test_the_stats_file_is_not_touched_by_session_cleanup(counting, tmp_path):
    """Starting/stopping the session machinery wipes data/session, never the counter next to it."""
    counting.parent.mkdir(parents=True)
    counting.write_text(json.dumps({"transcribed": 5, "updated_at": "x"}), encoding="utf-8")
    JobStore.purge_stale_sessions()
    m = SessionManager(start_reaper=False)
    m.close()
    assert read_file(counting)["transcribed"] == 5 and Counter(counting).total == 5


# ================================================================ GET /api/stats

@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", fake_engine)
    monkeypatch.setattr(engine, "make_audio_preview", lambda s, d: d.write_bytes(b"mp3") or True)
    from app.main import app
    BUFFER.clear()
    with TestClient(app) as c:
        yield c


def api_upload(c, prompt="", headers=None):
    return c.post("/api/jobs", params={"filename": "clip.mp4", "options": json.dumps({"prompt": prompt})},
                  content=b"not-really-video", headers={"content-type": "application/octet-stream", **(headers or {})})


def api_wait(c, job_id, timeout=10):
    end = time.time() + timeout
    while time.time() < end:
        j = c.get(f"/api/jobs/{job_id}").json()
        if j["status"] in ("done", "error", "cancelled"):
            return j
        time.sleep(0.03)
    raise AssertionError("timeout")


def log_text(c, level):
    entries = c.get("/api/logs", params={"limit": 5000, "level": level}).json()["entries"]
    return "\n".join(f"{e['level']} {e['logger']} {e['message']}" for e in entries)


def test_stats_contract_when_counting_is_off(client):
    r = client.get("/api/stats")
    assert r.status_code == 200
    assert r.json() == {"transcribed": 0, "counting": False}
    assert r.headers["content-type"].startswith("application/json")


def test_stats_never_creates_a_session_or_sets_a_cookie(client):
    from app import main
    for _ in range(3):
        r = client.get("/api/stats")
        assert r.status_code == 200
        assert "set-cookie" not in r.headers and COOKIE_NAME not in client.cookies
    assert main.manager.stats()["sessions"] == 0
    assert client.get("/api/health").json()["session_id"] is None  # still no session anywhere


def test_stats_is_cacheable_for_thirty_seconds_unlike_the_rest_of_the_api(client):
    r = client.get("/api/stats")
    assert r.headers["cache-control"] == "public, max-age=30"
    assert "no-store" in client.get("/api/health").headers["cache-control"]  # the other endpoints are unchanged
    assert r.headers["x-content-type-options"] == "nosniff"  # the usual security headers still apply


def test_stats_is_zero_when_counting_is_off_even_if_a_file_has_a_number(client, monkeypatch, tmp_path):
    path = tmp_path / "old.json"
    path.write_text(json.dumps({"transcribed": 1234, "updated_at": "x"}), encoding="utf-8")
    monkeypatch.setattr(config, "STATS_FILE", path)
    stats.reset()
    assert client.get("/api/stats").json() == {"transcribed": 0, "counting": False}


def test_stats_reports_the_count_when_counting_is_on(counting, client):
    counting.parent.mkdir(parents=True)
    counting.write_text(json.dumps({"transcribed": 41, "updated_at": "x"}), encoding="utf-8")
    stats.reset()
    assert client.get("/api/stats").json() == {"transcribed": 41, "counting": True}


def test_stats_follows_real_uploads_through_the_api(counting, client):
    assert client.get("/api/stats").json() == {"transcribed": 0, "counting": True}
    a = api_upload(client).json()["id"]
    assert api_wait(client, a)["status"] == "done"
    assert client.get("/api/stats").json() == {"transcribed": 1, "counting": True}  # visible as soon as "done" is
    bad = api_upload(client, prompt="boom").json()["id"]
    assert api_wait(client, bad)["status"] == "error"
    slow = api_upload(client, prompt="slow").json()["id"]
    end = time.time() + 10
    while client.get(f"/api/jobs/{slow}").json()["status"] != "running" and time.time() < end:
        time.sleep(0.03)
    client.post(f"/api/jobs/{slow}/cancel")
    assert api_wait(client, slow)["status"] == "cancelled"
    assert client.get("/api/stats").json()["transcribed"] == 1  # neither the error nor the cancel counted
    rerun = client.post(f"/api/jobs/{a}/rerun", json={"model": "tiny"}).json()["id"]
    assert api_wait(client, rerun)["status"] == "done"
    assert client.get("/api/stats").json()["transcribed"] == 1  # nor the re-run
    b = api_upload(client).json()["id"]
    api_wait(client, b)
    assert client.get("/api/stats").json()["transcribed"] == 2
    assert read_file(counting)["transcribed"] == 2
    # the visitor's own data going away never changes the website's number
    client.delete(f"/api/jobs/{b}")
    assert client.delete("/api/session").status_code == 204
    assert client.get("/api/stats").json()["transcribed"] == 2
    # internal bookkeeping is not part of any job the API returns
    j = api_wait(client, api_upload(client).json()["id"])
    assert "counted" not in j and "origin" not in j
    assert all("counted" not in row and "origin" not in row for row in client.get("/api/jobs").json())
    # the new total is logged at INFO each time
    text = log_text(client, "INFO")
    assert "INFO vt.stats transcription counter: 1 video(s) transcribed" in text
    assert "INFO vt.stats transcription counter: 3 video(s) transcribed" in text


def test_the_count_survives_a_restart_and_the_end_of_all_sessions(monkeypatch, counting):
    monkeypatch.setattr(engine, "transcribe", fake_engine)
    from app.main import app
    with TestClient(app) as c:
        api_wait(c, api_upload(c).json()["id"])
        assert c.get("/api/stats").json()["transcribed"] == 1
        session_root = config.SESSION_ROOT
    assert not any(session_root.glob("*/*/*")) and counting.exists()  # shutdown wiped every visitor file, not the counter
    stats.reset()  # a new process
    with TestClient(app) as again:
        assert again.get("/api/stats").json() == {"transcribed": 1, "counting": True}
        api_wait(again, api_upload(again).json()["id"])
        assert again.get("/api/stats").json()["transcribed"] == 2


def test_stats_polling_is_not_logged_at_info_like_health(client):
    for _ in range(3):
        client.get("/api/stats")
        client.get("/api/health")
    assert "GET /api/stats ->" not in log_text(client, "INFO")
    assert "GET /api/health ->" not in log_text(client, "INFO")
    assert "GET /api/stats -> 200" in log_text(client, "DEBUG")


def test_stats_passes_the_middlewares_that_guard_other_requests(client):
    # OriginGuard only restricts state-changing methods, so a read from any origin is fine ...
    assert client.get("/api/stats", headers={"origin": "https://evil.example"}).status_code == 200
    assert client.get("/api/stats", headers={"origin": "null"}).status_code == 200
    # ... CORS answers for the Angular dev server ...
    r = client.get("/api/stats", headers={"origin": "http://localhost:4200"})
    assert r.headers["access-control-allow-origin"] == "http://localhost:4200"
    # ... the host allow-list applies exactly as for /api/health ...
    assert client.get("/api/stats", headers={"host": "evil.example"}).status_code == 400
    assert client.get("/api/stats", headers={"host": "localhost:8000"}).status_code == 200
    # ... and it is read-only
    assert client.post("/api/stats").status_code in (404, 405)
    assert client.delete("/api/stats").status_code in (404, 405)


def test_stats_on_the_public_site(monkeypatch, counting):
    monkeypatch.setattr(config, "PUBLIC", True)
    monkeypatch.setattr(config, "ADMIN_TOKEN", None)
    monkeypatch.setattr(config, "TRUST_PROXY", True)
    monkeypatch.setattr(engine, "transcribe", fake_engine)
    from app.main import app
    with TestClient(app) as c:
        h = {"host": "transcribevid.com", "x-forwarded-proto": "https"}
        r = c.get("/api/stats", headers=h, follow_redirects=False)
        assert r.status_code == 200 and r.json() == {"transcribed": 0, "counting": True}
        assert r.headers["cache-control"] == "public, max-age=30"
        assert "set-cookie" not in r.headers and "tv_sid" not in c.cookies
        assert "max-age=31536000" in TestClient(app, base_url="https://transcribevid.com").get("/api/stats").headers[
            "strict-transport-security"]
        # plain http is still redirected to https like every other URL
        redirect = c.get("/api/stats", headers={"host": "transcribevid.com", "x-forwarded-proto": "http"},
                         follow_redirects=False)
        assert redirect.status_code == 301 and redirect.headers["location"] == "https://transcribevid.com/api/stats"
