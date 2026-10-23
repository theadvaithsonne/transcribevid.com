"""Tests for the in-memory log subsystem: the ring buffer and logging setup (app/logbuffer.py) and its
HTTP API (app/logs_api.py). Nothing here starts a server; the API runs in-process."""
import asyncio
import json
import logging
import re
import sys
import threading
import time
import warnings

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from starlette.requests import Request

from app import logbuffer, logs_api
from app.logbuffer import BUFFER, RingBufferHandler, setup_logging

OWN_LOGGERS = ("vt",) + logbuffer.EXTERNAL_LOGGERS


# --------------------------------------------------------------------------- fixtures / helpers

@pytest.fixture()
def pristine_logging():
    """Run with none of the app's logging set up, and put whatever was there before back afterwards."""
    saved = {}
    for name in OWN_LOGGERS:
        lg = logging.getLogger(name)
        saved[name] = (lg.handlers[:], lg.level, lg.propagate)
        for h in lg.handlers[:]:
            lg.removeHandler(h)
        lg.setLevel(logging.NOTSET)
        lg.propagate = True
    logging.captureWarnings(False)
    BUFFER.clear()
    logs_api._client_limit.reset()
    yield
    for name, (handlers, level, propagate) in saved.items():
        lg = logging.getLogger(name)
        for h in lg.handlers[:]:
            lg.removeHandler(h)
        for h in handlers:
            lg.addHandler(h)
        lg.setLevel(level)
        lg.propagate = propagate
    logging.captureWarnings(False)
    BUFFER.clear()
    logs_api._client_limit.reset()


@pytest.fixture()
def wired(pristine_logging):
    """Logging set up as the app does it, with an empty buffer."""
    setup_logging()
    return logging.getLogger("vt")


@pytest.fixture()
def app():
    a = FastAPI()
    a.include_router(logs_api.router)
    a.include_router(logs_api.client_router)
    return a


@pytest.fixture()
def client(app, wired):
    with TestClient(app) as c:
        yield c


def make(maxlen=10000, name="vt.unit"):
    """A private handler + logger pair, outside the logging tree, so unit tests never touch app state."""
    h = RingBufferHandler(maxlen)
    return h, logger_for(h, name)


def logger_for(handler, name):
    lg = logging.Logger(name)
    lg.setLevel(logging.DEBUG)
    lg.addHandler(handler)
    return lg


def seqs(entries):
    return [e["seq"] for e in entries]


def messages(entries):
    return [e["message"] for e in entries]


# --------------------------------------------------------------------------- ring buffer

def test_entry_shape_and_seq_starts_at_one():
    h, lg = make()
    assert h.last_seq == 0 and h.query() == ([], 0)
    before = time.time()
    lg.warning("hello %s %d", "world", 3)
    (e,), last = h.query()
    assert set(e) == {"seq", "ts", "level", "logger", "message"}
    assert (e["seq"], e["level"], e["logger"], e["message"]) == (1, "WARNING", "vt.unit", "hello world 3")
    assert before - 1 <= e["ts"] <= time.time() + 1  # epoch seconds (float)
    assert last == h.last_seq == 1


def test_ring_overflow_keeps_newest_and_seq_stays_monotonic():
    h, lg = make(maxlen=5)
    for i in range(1, 13):
        lg.info("m%d", i)
    entries, last = h.query()
    assert seqs(entries) == [8, 9, 10, 11, 12] and last == 12
    assert messages(entries) == ["m8", "m9", "m10", "m11", "m12"]
    lg.info("m13")
    assert seqs(h.query()[0]) == [9, 10, 11, 12, 13] and h.last_seq == 13


def test_after_zero_returns_the_newest_entries_in_ascending_order():
    h, lg = make()
    for i in range(1, 21):
        lg.info("m%d", i)
    entries, last = h.query(limit=5)
    assert seqs(entries) == [16, 17, 18, 19, 20] and last == 20
    assert seqs(h.query(limit=1000)[0]) == list(range(1, 21))
    assert h.query(limit=0)[0] == []
    assert seqs(h.query(after=-3, limit=2)[0]) == [19, 20]  # a negative cursor means "from the start"


def test_after_pages_forward_oldest_first():
    h, lg = make()
    for i in range(1, 21):
        lg.info("m%d", i)
    entries, last = h.query(after=5, limit=3)
    assert seqs(entries) == [6, 7, 8] and last == 20  # last_seq is the buffer's newest, not the page's
    seen, cursor = [], 5
    while True:  # following the cursor visits every entry exactly once
        page, _ = h.query(after=cursor, limit=4)
        if not page:
            break
        seen += seqs(page)
        cursor = page[-1]["seq"]
    assert seen == list(range(6, 21))
    assert h.query(after=20) == ([], 20) and h.query(after=500) == ([], 20)  # nothing newer / stale cursor


def test_after_older_than_the_ring_returns_what_is_left():
    h, lg = make(maxlen=3)
    for i in range(1, 11):
        lg.info("m%d", i)
    assert seqs(h.query(after=2)[0]) == [8, 9, 10]


def test_level_filter_is_a_minimum():
    h, lg = make()
    lg.debug("d")
    lg.info("i")
    lg.warning("w")
    lg.error("e")
    lg.critical("c")

    def levels(**kw):
        return [e["level"] for e in h.query(**kw)[0]]

    assert levels() == ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
    assert levels(level="INFO") == ["INFO", "WARNING", "ERROR", "CRITICAL"]
    assert levels(level="WARNING") == ["WARNING", "ERROR", "CRITICAL"]
    assert levels(level="ERROR") == ["ERROR", "CRITICAL"]
    assert levels(level="CRITICAL") == ["CRITICAL"]
    assert levels(level="WARNING", after=2) == ["WARNING", "ERROR", "CRITICAL"]
    assert levels(level="ERROR", after=4) == ["CRITICAL"]  # only seq 5 is newer
    assert levels(level=logging.ERROR) == ["ERROR", "CRITICAL"]  # numeric levels work too
    with pytest.raises(ValueError):
        h.query(level="LOUD")


def test_levels_without_a_name_are_filtered_by_number():
    h, lg = make()
    lg.log(45, "between ERROR and CRITICAL")  # logging names it "Level 45"
    assert [e["level"] for e in h.query(level="ERROR")[0]] == ["Level 45"]
    assert h.query(level="CRITICAL")[0] == []


def test_text_search_is_case_insensitive_over_logger_and_message():
    h = RingBufferHandler()
    jobs, engine = logger_for(h, "vt.jobs"), logger_for(h, "vt.engine")
    jobs.info("Upload STARTED for clip.mp4")
    engine.info("model loaded")
    jobs.warning("nothing to see")

    def found(**kw):
        return messages(h.query(**kw)[0])

    assert found(q="started") == ["Upload STARTED for clip.mp4"]
    assert found(q="UPLOAD") == ["Upload STARTED for clip.mp4"]
    assert found(q="vt.engine") == ["model loaded"]  # matches the logger name
    assert found(q="JOBS") == ["Upload STARTED for clip.mp4", "nothing to see"]
    assert found(q="zzz") == []
    assert found(q="jobs", level="WARNING") == ["nothing to see"]  # combines with the level filter
    assert found(q="jobs", after=1) == ["nothing to see"]  # ...and with a cursor
    assert found(q="") == found()


def test_limit_counts_matches_not_raw_entries():
    h, lg = make()
    for i in range(12):
        lg.info("noise %d", i)
        if i % 4 == 0:
            lg.error("failure %d", i)
    assert messages(h.query(level="ERROR", limit=2)[0]) == ["failure 4", "failure 8"]  # newest two, ascending
    assert messages(h.query(q="failure", limit=1)[0]) == ["failure 8"]
    assert messages(h.query(q="failure", after=1, limit=2)[0]) == ["failure 0", "failure 4"]  # OLDEST two after seq 1


def test_last_seq_is_reported_even_when_nothing_matches():
    h, lg = make()
    for _ in range(3):
        lg.info("x")
    assert h.query(q="zzz") == ([], 3)
    assert h.query(level="ERROR") == ([], 3)
    assert h.query(after=3) == ([], 3)


def test_clear_empties_the_buffer_but_never_resets_seq():
    h, lg = make()
    for _ in range(3):
        lg.info("old")
    h.clear()
    assert h.query() == ([], 3) and h.last_seq == 3
    lg.info("new")
    entries, last = h.query()
    assert seqs(entries) == [4] and last == 4
    h.clear()
    h.clear()  # harmless when already empty
    assert h.query(after=4) == ([], 4)


def test_traceback_is_appended_to_the_message():
    h, lg = make()
    try:
        raise ValueError("bad thing")
    except ValueError:
        lg.exception("it failed: %s", "x")
    (e,), _ = h.query()
    assert e["level"] == "ERROR"
    assert e["message"].startswith("it failed: x\nTraceback (most recent call last):\n")
    assert e["message"].endswith("ValueError: bad thing") and "test_traceback_is_appended" in e["message"]

    lg.warning("with a stack", stack_info=True)
    assert "Stack (most recent call last):" in h.query()[0][-1]["message"]
    try:
        raise KeyError("k")
    except KeyError:
        lg.error("explicit exc_info", exc_info=sys.exc_info())
    assert h.query()[0][-1]["message"].endswith("KeyError: 'k'")


def test_query_returns_copies():
    h, lg = make()
    lg.info("original")
    h.query()[0][0]["message"] = "tampered"
    assert messages(h.query()[0]) == ["original"]


def test_unicode_survives_and_lone_surrogates_cannot_break_encoding():
    h, lg = make()
    text = "Привет नमस्ते 日本語 🎬"
    lg.info(text)
    lg.info("bad file name: %s", "clip\udc80.mp4")  # e.g. an undecodable file name
    entries, _ = h.query()
    assert entries[0]["message"] == text
    json.dumps(entries, ensure_ascii=False).encode("utf-8")  # a raw lone surrogate would raise here
    assert entries[1]["message"].startswith("bad file name: clip") and entries[1]["message"].endswith(".mp4")


def test_a_malformed_log_call_never_raises_into_the_caller(monkeypatch):
    monkeypatch.setattr(logging, "raiseExceptions", False)  # no "--- Logging error ---" noise on stderr
    h, lg = make()
    lg.info("%d items", "not a number")
    lg.info("still working")
    entries, last = h.query()
    assert messages(entries) == ["still working"] and last == 1


def test_buffer_size_comes_from_the_environment(monkeypatch):
    monkeypatch.delenv("VT_LOG_BUFFER", raising=False)
    assert RingBufferHandler().maxlen == 10000
    monkeypatch.setenv("VT_LOG_BUFFER", "3")
    h = RingBufferHandler()
    lg = logger_for(h, "vt.unit")
    assert h.maxlen == 3
    for i in range(7):
        lg.info("m%d", i)
    assert messages(h.query()[0]) == ["m4", "m5", "m6"]
    assert RingBufferHandler(maxlen=7).maxlen == 7  # an explicit size wins
    for bad in ("abc", "0", "-5", "", "2.5"):  # nonsense falls back to the default instead of crashing
        monkeypatch.setenv("VT_LOG_BUFFER", bad)
        assert RingBufferHandler().maxlen == 10000


def test_concurrent_writers_lose_nothing_and_never_repeat_a_seq():
    h, lg = make(maxlen=10000)
    writers, per = 8, 500
    errors, stop = [], threading.Event()

    def write(n):
        for i in range(per):
            lg.info("t%d-%d", n, i)

    def read():  # readers must always see a consistent snapshot while writers run
        try:
            while not stop.is_set():
                entries, last = h.query(limit=50)
                got = seqs(entries)
                assert got == sorted(set(got)) and (not got or got[-1] == last)  # last_seq never runs ahead
                paged, _ = h.query(after=max(0, last - 100), q="t1-")
                assert seqs(paged) == sorted(set(seqs(paged)))
        except Exception as exc:  # noqa - reported from the main thread
            errors.append(exc)

    reader = threading.Thread(target=read)
    threads = [threading.Thread(target=write, args=(n,)) for n in range(writers)]
    reader.start()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    stop.set()
    reader.join()

    assert not errors, errors
    entries, last = h.query(limit=10**6)
    assert last == writers * per and seqs(entries) == list(range(1, writers * per + 1))
    for n in range(writers):  # each writer's own lines stay in order
        mine = [int(m.split("-")[1]) for m in messages(entries) if m.startswith(f"t{n}-")]
        assert mine == list(range(per))


def test_emit_itself_is_thread_safe():
    """Logger.handle() already serialises handlers; emit() called directly must be safe as well."""
    h = RingBufferHandler(maxlen=10000)

    def write(n):
        for i in range(500):
            h.emit(logging.LogRecord("vt.unit", logging.INFO, __file__, 1, f"t{n}-{i}", None, None))

    threads = [threading.Thread(target=write, args=(n,)) for n in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert seqs(h.query(limit=10**6)[0]) == list(range(1, 4001)) and h.last_seq == 4000


def test_a_reader_never_sees_a_seq_before_its_entry():
    """emit() takes the next seq and stores the entry under one lock. Otherwise a follower could read a
    last_seq whose entry is not there yet, resume from it and never receive that entry."""
    h = RingBufferHandler()
    readers, snapshots = [], []

    class Racy(logging.LogRecord):
        @property
        def levelno(self):  # emit() reads this after taking the new seq and before storing the entry
            r = threading.Thread(target=lambda: snapshots.append(h.query()))
            readers.append(r)
            r.start()
            r.join(0.1)  # a correct emit() still holds the lock, so the reader can only wait
            return logging.INFO

        @levelno.setter
        def levelno(self, value):
            pass

    h.emit(Racy("vt.unit", logging.INFO, __file__, 1, "x", None, None))
    readers[0].join(2)
    entries, last = snapshots[0]
    assert last == (entries[-1]["seq"] if entries else 0) == 1


# --------------------------------------------------------------------------- setup_logging

def test_setup_logging_is_idempotent(pristine_logging):
    for _ in range(3):
        log = setup_logging()
    assert log is logging.getLogger("vt") and log.level == logging.DEBUG and log.propagate is False
    assert log.handlers.count(BUFFER) == 1
    consoles = [h for h in log.handlers if type(h) is logging.StreamHandler]
    assert len(consoles) == 1 and len(log.handlers) == 2
    for name in logbuffer.EXTERNAL_LOGGERS:  # ring only, no extra console handler
        assert logging.getLogger(name).handlers == [BUFFER]


def test_setup_logging_leaves_the_root_logger_alone_and_recovers_removed_handlers(pristine_logging):
    root_before = logging.getLogger().handlers[:]
    log = setup_logging()
    assert logging.getLogger().handlers == root_before
    (console,) = [h for h in log.handlers if h is not BUFFER]
    log.removeHandler(console)
    log.removeHandler(BUFFER)
    logging.getLogger("faster_whisper").removeHandler(BUFFER)
    setup_logging()
    assert len(log.handlers) == 2 and BUFFER in log.handlers and BUFFER in logging.getLogger("faster_whisper").handlers


def test_vt_records_reach_the_buffer_and_the_console_in_the_documented_format(pristine_logging, capsys):
    setup_logging()
    lg = logging.getLogger("vt.demo")
    lg.debug("quiet")
    lg.info("hello %s", "world")
    lg.error("bad")
    console = capsys.readouterr().err.splitlines()
    assert len(console) == 2  # the console is INFO and up
    assert re.fullmatch(r"\d\d:\d\d:\d\d INFO    vt\.demo: hello world", console[0])
    assert re.fullmatch(r"\d\d:\d\d:\d\d ERROR   vt\.demo: bad", console[1])
    assert [(e["level"], e["message"]) for e in BUFFER.query()[0]] == [
        ("DEBUG", "quiet"), ("INFO", "hello world"), ("ERROR", "bad")]  # the buffer keeps DEBUG too


def test_console_level_is_adjustable_on_a_repeat_call(pristine_logging, capsys):
    setup_logging("DEBUG")
    logging.getLogger("vt.x").debug("shown")
    setup_logging("error")  # level names are case-insensitive
    logging.getLogger("vt.x").info("hidden")
    logging.getLogger("vt.x").error("shown too")
    assert capsys.readouterr().err.count("\n") == 2
    assert len([h for h in logging.getLogger("vt").handlers if h is not BUFFER]) == 1
    assert messages(BUFFER.query()[0]) == ["shown", "hidden", "shown too"]
    with pytest.raises(ValueError):
        setup_logging("LOUD")


def test_a_bad_console_level_changes_nothing(pristine_logging):
    with pytest.raises(ValueError):
        setup_logging("LOUD")
    assert logging.getLogger("vt").handlers == [] and logging.getLogger("faster_whisper").handlers == []


def test_third_party_loggers_feed_the_buffer_but_not_the_console(pristine_logging, capsys):
    setup_logging()
    logging.getLogger("uvicorn.error").error("uvicorn trouble")
    logging.getLogger("faster_whisper").warning("whisper warning")
    logging.getLogger("huggingface_hub").warning("hub warning")
    assert [(e["logger"], e["message"]) for e in BUFFER.query()[0]] == [
        ("uvicorn.error", "uvicorn trouble"), ("faster_whisper", "whisper warning"),
        ("huggingface_hub", "hub warning")]
    assert capsys.readouterr().err == ""


def test_python_warnings_are_captured(pristine_logging):
    setup_logging()
    with warnings.catch_warnings():
        warnings.simplefilter("always")
        warnings.warn("careful now", UserWarning)
    (e,), _ = BUFFER.query()
    assert (e["logger"], e["level"]) == ("py.warnings", "WARNING")
    assert "UserWarning: careful now" in e["message"]


# --------------------------------------------------------------------------- HTTP: read / clear

def test_read_logs_when_empty(client):
    r = client.get("/api/logs")
    assert r.status_code == 200
    assert r.json() == {"entries": [], "last_seq": BUFFER.last_seq}


def test_read_logs_returns_entries_oldest_first(client):
    lg = logging.getLogger("vt.demo")
    lg.info("one")
    lg.warning("two %s", "x")
    body = client.get("/api/logs").json()
    assert messages(body["entries"]) == ["one", "two x"]
    assert set(body["entries"][0]) == {"seq", "ts", "level", "logger", "message"}
    assert body["entries"][1]["level"] == "WARNING" and body["entries"][1]["logger"] == "vt.demo"
    assert body["last_seq"] == body["entries"][-1]["seq"] == BUFFER.last_seq


def test_read_logs_after_limit_level_and_q(client):
    lg = logging.getLogger("vt.demo")
    first = BUFFER.last_seq
    for i in range(10):
        lg.info("Line %d", i)
        if i % 5 == 0:
            lg.error("Failure %d", i)

    def get(**params):
        r = client.get("/api/logs", params=params)
        assert r.status_code == 200
        return r.json()

    assert messages(get(limit=2)["entries"]) == ["Line 8", "Line 9"]  # newest two, oldest first
    page = get(after=first + 2, limit=3)
    assert seqs(page["entries"]) == [first + 3, first + 4, first + 5]  # oldest first after the cursor
    assert page["last_seq"] == BUFFER.last_seq
    assert messages(get(level="ERROR")["entries"]) == ["Failure 0", "Failure 5"]
    assert messages(get(q="LINE 3")["entries"]) == ["Line 3"]
    assert messages(get(q="vt.demo", level="ERROR", limit=1)["entries"]) == ["Failure 5"]
    nothing = get(q="no such text")
    assert nothing["entries"] == [] and nothing["last_seq"] == BUFFER.last_seq
    assert len(get(limit=1)["entries"]) == 1 and len(get(limit=5000)["entries"]) == 12  # bounds are inclusive
    assert get(q="x" * 200)["entries"] == []


def test_read_logs_defaults_to_the_newest_1000(client):
    lg = logging.getLogger("vt.demo")
    for i in range(1005):
        lg.debug("line %d", i)  # DEBUG is included by default
    entries = client.get("/api/logs").json()["entries"]
    assert len(entries) == 1000 and entries[0]["message"] == "line 5" and entries[-1]["message"] == "line 1004"
    assert len(client.get("/api/logs", params={"limit": 5000}).json()["entries"]) == 1005


def test_the_documented_contract(app):
    paths = app.openapi()["paths"]
    assert {(path, method): sorted(op["responses"]) for path, ops in paths.items() for method, op in ops.items()} == {
        ("/api/logs", "get"): ["200", "422"], ("/api/logs", "delete"): ["204"],
        ("/api/logs/stream", "get"): ["200", "422"], ("/api/logs/client", "post"): ["204", "422"]}
    level = paths["/api/logs"]["get"]["parameters"]
    assert [p["schema"].get("enum") for p in level if p["name"] == "level"] == [
        ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]]


@pytest.mark.parametrize("params", [
    {"level": "LOUD"}, {"level": ""}, {"level": "WARN"},
    {"limit": 0}, {"limit": -1}, {"limit": 5001}, {"limit": "many"},
    {"after": "soon"}, {"q": "x" * 201},
])
def test_read_logs_rejects_bad_parameters(client, params):
    assert client.get("/api/logs", params=params).status_code == 422


def test_clear_logs_empties_the_buffer_then_logs_one_notice(client):
    lg = logging.getLogger("vt.demo")
    lg.info("a")
    lg.info("b")
    before = BUFFER.last_seq
    r = client.delete("/api/logs")
    assert r.status_code == 204 and r.content == b""
    body = client.get("/api/logs").json()
    assert [(e["level"], e["logger"], e["message"]) for e in body["entries"]] == [
        ("INFO", "vt.logs", "Log buffer cleared")]  # the notice is written AFTER the clear
    assert body["entries"][0]["seq"] == body["last_seq"] == before + 1  # seq never restarts
    assert client.delete("/api/logs").status_code == 204
    assert messages(client.get("/api/logs").json()["entries"]) == ["Log buffer cleared"]
    assert BUFFER.last_seq == before + 2


# --------------------------------------------------------------------------- HTTP: browser log lines

def post_client(client, **body):
    return client.post("/api/logs/client", json=body)


def last_entry(client):
    return client.get("/api/logs", params={"limit": 1}).json()["entries"][-1]


def test_client_log_is_written_to_vt_client(client):
    r = post_client(client, level="WARNING", message="Button exploded", context="at app.ts:1:2")
    assert r.status_code == 204 and r.content == b""
    e = last_entry(client)
    assert (e["level"], e["logger"], e["message"]) == ("WARNING", "vt.client", "Button exploded | at app.ts:1:2")
    assert post_client(client, message="just text").status_code == 204  # level defaults to INFO, context is optional
    e = last_entry(client)
    assert (e["level"], e["message"]) == ("INFO", "just text")
    post_client(client, message="no context", context=None)
    assert last_entry(client)["message"] == "no context"


@pytest.mark.parametrize("sent, logged", [
    ("DEBUG", "DEBUG"), ("INFO", "INFO"), ("WARNING", "WARNING"), ("ERROR", "ERROR"), ("CRITICAL", "CRITICAL"),
    ("error", "ERROR"), (" Warning ", "WARNING"), ("warn", "WARNING"), ("fatal", "CRITICAL"),
    ("verbose", "INFO"), ("", "INFO"), ("🙂", "INFO"),  # unknown -> INFO
])
def test_client_log_level_mapping(client, sent, logged):
    assert post_client(client, level=sent, message="m").status_code == 204
    assert last_entry(client)["level"] == logged


def test_client_log_strips_control_characters_but_keeps_tabs(client):
    post_client(client, message="a\x00b\x07c\x1b[31md\te\nf\rg\x7fh\u0085i", context="x\x00\ny")
    assert last_entry(client)["message"] == "abc[31md\tefghi | xy"
    post_client(client, message="only\nmessage", context="\x00\x01")  # a context that is nothing but control chars
    assert last_entry(client)["message"] == "onlymessage"
    post_client(client, message="100% done %s %(x)s {0}")  # no accidental %-formatting of client text
    assert last_entry(client)["message"] == "100% done %s %(x)s {0}"
    post_client(client, message="Привет 🎬 日本")
    assert last_entry(client)["message"] == "Привет 🎬 日本"


def test_client_log_is_truncated_not_rejected(client):
    r = post_client(client, message="m" * 10_000, context="c" * 5_000)
    assert r.status_code == 204
    assert last_entry(client)["message"] == "m" * 4000 + " | " + "c" * 1000
    post_client(client, message="\x00" * 500 + "x" * 4000)  # stripped characters do not use up the budget
    assert last_entry(client)["message"] == "x" * 4000
    post_client(client, message="m" * 4000)
    assert last_entry(client)["message"] == "m" * 4000  # at the limit: untouched


@pytest.mark.parametrize("body", [
    {}, {"level": "INFO"}, {"message": None}, {"message": 5}, {"message": "x", "level": 3}, {"message": "x", "context": 1},
])
def test_client_log_validation(client, body):
    assert client.post("/api/logs/client", json=body).status_code == 422
    assert client.get("/api/logs").json()["entries"] == []  # nothing was logged


def test_client_log_rejects_a_non_json_body(client):
    r = client.post("/api/logs/client", content=b"not json", headers={"content-type": "application/json"})
    assert r.status_code == 422


def test_client_flood_is_dropped_but_still_answered_204(client, monkeypatch):
    now = [1000.0]
    monkeypatch.setattr(logs_api._client_limit, "clock", lambda: now[0])
    codes = {post_client(client, message=f"m{i}").status_code for i in range(105)}
    assert codes == {204}
    assert messages(client.get("/api/logs", params={"limit": 5000}).json()["entries"]) == [f"m{i}" for i in range(100)]
    now[0] = 1000.9  # still inside the same second
    post_client(client, message="too soon")
    assert last_entry(client)["message"] == "m99"
    now[0] = 1001.0  # a full second since the first batch: allowed again
    post_client(client, message="later")
    assert last_entry(client)["message"] == "later"


def test_rate_limiter_is_a_true_sliding_window():
    now = [0.0]
    limit = logs_api._RateLimit(3, 1.0, clock=lambda: now[0])
    assert [limit.allow() for _ in range(4)] == [True, True, True, False]
    now[0] = 0.5
    assert limit.allow() is False
    now[0] = 1.0  # the three hits at t=0 have left the window
    assert [limit.allow() for _ in range(4)] == [True, True, True, False]
    limit.reset()
    assert limit.allow() is True


def test_the_router_wires_logging_itself_if_the_app_did_not(pristine_logging):
    a = FastAPI()
    a.include_router(logs_api.router)
    a.include_router(logs_api.client_router)
    with TestClient(a) as c:  # note: no setup_logging() call
        assert c.post("/api/logs/client", json={"message": "hi", "level": "debug"}).status_code == 204
        assert [(e["level"], e["message"]) for e in c.get("/api/logs").json()["entries"]] == [("DEBUG", "hi")]
        assert BUFFER in logging.getLogger("vt").handlers
        logging.getLogger("vt").removeHandler(BUFFER)
        assert c.delete("/api/logs").status_code == 204
        assert messages(c.get("/api/logs").json()["entries"]) == ["Log buffer cleared"]


# --------------------------------------------------------------------------- HTTP: live stream (SSE)

def parse_sse(body):
    """Entries of the `event: log` blocks in an SSE body (each must be exactly an event line + a data line)."""
    out = []
    for block in body.split("\n\n"):
        if not block or block.startswith(":"):  # blank, or a keep-alive comment
            continue
        lines = block.split("\n")
        assert len(lines) == 2 and lines[0] == "event: log" and lines[1].startswith("data: "), block
        out.append(json.loads(lines[1][len("data: "):]))
    return out


class SseConn:
    """An in-process ASGI connection (no server, no sockets) with real streaming semantics: chunks are seen
    as the app sends them and the "browser" can hang up at any moment. Starlette's TestClient can do neither:
    it buffers the whole response and never reports a disconnect while the response is still open."""

    def __init__(self, app, query="", spec_version="2.4", path="/api/logs/stream"):
        self.app, self.status, self.headers = app, None, {}
        self.body, self.comments, self._pending = "", [], ""
        self.scope = {"type": "http", "asgi": {"version": "3.0", "spec_version": spec_version},
                      "http_version": "1.1", "method": "GET", "scheme": "http", "path": path,
                      "raw_path": path.encode(), "root_path": "", "query_string": query.encode(),
                      "headers": [(b"host", b"testserver")], "client": ("127.0.0.1", 50000),
                      "server": ("testserver", 80)}

    async def __aenter__(self):
        self._hang_up, self._chunks, self._started = asyncio.Event(), asyncio.Queue(), asyncio.Event()
        asked = False

        async def receive():
            nonlocal asked
            if not asked:  # the (empty) request body comes first, then silence until the browser hangs up
                asked = True
                return {"type": "http.request", "body": b"", "more_body": False}
            await self._hang_up.wait()
            return {"type": "http.disconnect"}

        async def send(message):
            if message["type"] == "http.response.start":
                self.status = message["status"]
                self.headers = {k.decode().lower(): v.decode() for k, v in message["headers"]}
                self._started.set()
            elif message.get("body"):
                self._chunks.put_nowait(message["body"].decode("utf-8"))

        self.task = asyncio.create_task(self.app(self.scope, receive, send))
        deadline = time.monotonic() + 5
        while not self._started.is_set():
            if self.task.done():
                self.task.result()  # surface a crash instead of waiting for a timeout
                raise AssertionError("the app finished without starting a response")
            assert time.monotonic() < deadline, "no response from the app"
            await asyncio.sleep(0.005)
        return self

    async def __aexit__(self, *exc):
        if not self.task.done():
            self.task.cancel()
        await asyncio.gather(self.task, return_exceptions=True)

    async def _block(self, timeout):
        """The next complete SSE block (text up to a blank line)."""
        deadline = time.monotonic() + timeout
        while "\n\n" not in self._pending:
            if self.task.done() and self._chunks.empty():
                self.task.result()
                raise AssertionError("the stream ended; got so far: %r" % self.body)
            left = deadline - time.monotonic()
            assert left > 0, "timed out waiting for the stream; got so far: %r" % self.body
            try:
                chunk = self._chunks.get_nowait()
            except asyncio.QueueEmpty:
                await asyncio.sleep(0.005)
                continue
            self._pending += chunk
            self.body += chunk
        block, self._pending = self._pending.split("\n\n", 1)
        return block

    async def events(self, n, timeout=3):
        """The next `n` log entries; keep-alive comments met on the way are collected in self.comments."""
        out = []
        while len(out) < n:
            block = await self._block(timeout)
            if block.startswith(":"):
                self.comments.append(block)
                continue
            lines = block.split("\n")
            assert len(lines) == 2 and lines[0] == "event: log" and lines[1].startswith("data: "), block
            out.append(json.loads(lines[1][len("data: "):]))
        return out

    async def hang_up(self, timeout=2):
        """The browser goes away. Returns how long the app took to finish the response."""
        t0 = time.perf_counter()
        self._hang_up.set()
        await asyncio.wait_for(self.task, timeout)
        return time.perf_counter() - t0


@pytest.fixture()
def fast_stream(monkeypatch):
    monkeypatch.setattr(logs_api, "POLL_SECONDS", 0.01)


@pytest.mark.parametrize("spec_version", ["2.0", "2.4"])
def test_stream_follows_live_and_stops_promptly_when_the_client_disconnects(app, wired, fast_stream, spec_version):
    # uvicorn announces ASGI spec 2.3, where Starlette itself listens for the disconnect and cancels the stream.
    # From spec 2.4 on it does not, so there only the endpoint's own request.is_disconnected() polling ends it.
    async def scenario():
        logging.getLogger("vt.sse").info("history: not replayed")
        async with SseConn(app, spec_version=spec_version) as conn:
            assert conn.status == 200
            assert conn.headers["content-type"].startswith("text/event-stream")
            assert conn.headers["cache-control"] == "no-cache" and conn.headers["x-accel-buffering"] == "no"
            emitter = threading.Thread(target=lambda: logging.getLogger("vt.sse").warning("from another thread"))
            emitter.start()
            (e,) = await conn.events(1)
            emitter.join()
            assert (e["level"], e["logger"], e["message"]) == ("WARNING", "vt.sse", "from another thread")
            took = await conn.hang_up()
        assert "history" not in conn.body
        return took

    assert asyncio.run(scenario()) < 1.0


def test_stream_event_framing_is_exact(app, wired, fast_stream):
    async def scenario():
        async with SseConn(app) as conn:
            logging.getLogger("vt.sse").info("framing")
            await conn.events(1)
            await conn.hang_up()
        return conn.body

    body = asyncio.run(scenario())
    assert re.fullmatch(r'event: log\ndata: \{.*"message": ?"framing".*\}\n\n', body), body
    assert parse_sse(body)[0]["message"] == "framing"


def test_stream_after_replays_what_was_missed_then_follows(app, wired, fast_stream):
    lg = logging.getLogger("vt.sse")
    lg.info("a")
    cursor = BUFFER.last_seq
    lg.info("b")
    lg.error("c")

    async def scenario():
        async with SseConn(app, f"after={cursor}") as conn:
            replay = await conn.events(2)
            lg.info("d")
            (live,) = await conn.events(1)
            await conn.hang_up()
        return replay, live, conn.body

    replay, live, body = asyncio.run(scenario())
    assert messages(replay) == ["b", "c"] and messages([live]) == ["d"]
    assert seqs(replay + [live]) == list(range(cursor + 1, cursor + 4))
    assert "event: log" in body and '"message": "a"' not in body and '"message":"a"' not in body


@pytest.mark.parametrize("after", [0, 999_999_999])  # a live tail, and a cursor from a previous server run
def test_stream_starts_from_the_request_not_from_the_first_poll(wired, after):
    class Req:  # stands in for the request of a client that stays connected
        async def is_disconnected(self):
            return False

    async def scenario():
        resp = await logs_api.stream_logs(Req(), after=after, level="DEBUG")
        logging.getLogger("vt.sse").info("logged between the request and the first poll")
        chunk = await asyncio.wait_for(resp.body_iterator.__anext__(), 2)
        await resp.body_iterator.aclose()
        return chunk

    assert "logged between the request and the first poll" in asyncio.run(scenario())


def test_stream_level_filter_and_no_repeats(app, wired, fast_stream):
    lg = logging.getLogger("vt.sse")

    async def scenario():
        async with SseConn(app, "level=ERROR") as conn:
            lg.info("quiet 1")
            lg.warning("quiet 2")
            lg.error("loud 1")
            (first,) = await conn.events(1)
            await asyncio.sleep(0.1)  # many polls with nothing new: nothing may be sent twice
            lg.critical("loud 2")
            (second,) = await conn.events(1)
            await conn.hang_up()
        return first, second, conn.body

    first, second, body = asyncio.run(scenario())
    assert (first["message"], second["message"]) == ("loud 1", "loud 2")
    assert "quiet" not in body and body.count("event: log") == 2


def test_stream_sends_a_big_backlog_in_order_without_gaps(app, wired, fast_stream, monkeypatch):
    monkeypatch.setattr(logs_api, "STREAM_BATCH", 100)
    lg = logging.getLogger("vt.sse")
    start = BUFFER.last_seq
    for i in range(350):
        lg.info("n%d", i)

    async def scenario():
        async with SseConn(app, f"after={start}") as conn:
            got = await conn.events(350)
            lg.info("after the backlog")
            (extra,) = await conn.events(1)
            await conn.hang_up()
        return got, extra

    got, extra = asyncio.run(scenario())
    assert seqs(got) == list(range(start + 1, start + 351)) and extra["seq"] == start + 351


def test_stream_keeps_following_across_a_clear(app, wired, fast_stream):
    lg = logging.getLogger("vt.sse")

    async def scenario():
        async with SseConn(app) as conn:
            lg.info("before the clear")
            (before,) = await conn.events(1)
            logs_api.clear_logs()  # what DELETE /api/logs does
            lg.info("after the clear")
            notice, after = await conn.events(2)
            await conn.hang_up()
        return before, notice, after

    before, notice, after = asyncio.run(scenario())
    assert (before["message"], notice["message"], after["message"]) == (
        "before the clear", "Log buffer cleared", "after the clear")
    assert before["seq"] < notice["seq"] < after["seq"]  # numbering went on, so the follower lost nothing


def test_stream_with_a_cursor_from_the_future_just_follows_new_entries(app, wired, fast_stream):
    async def scenario():
        async with SseConn(app, "after=999999999") as conn:  # e.g. numbering of a previous server run
            logging.getLogger("vt.sse").info("fresh")
            (e,) = await conn.events(1)
            await conn.hang_up()
        return e

    assert asyncio.run(scenario())["message"] == "fresh"


def test_stream_carries_non_ascii_text_intact(app, wired, fast_stream):
    async def scenario():
        async with SseConn(app) as conn:
            logging.getLogger("vt.sse").info("Привет 🎬 \u2028 line-sep")
            (e,) = await conn.events(1)
            await conn.hang_up()
        return e

    assert asyncio.run(scenario())["message"] == "Привет 🎬 \u2028 line-sep"


def test_idle_stream_sends_keep_alive_comments(app, wired, fast_stream, monkeypatch):
    monkeypatch.setattr(logs_api, "KEEPALIVE_SECONDS", 0.05)

    async def scenario():
        async with SseConn(app) as conn:
            first = await conn._block(2)
            second = await conn._block(2)
            await conn.hang_up()
        return first, second

    assert asyncio.run(scenario()) == (": keep-alive", ": keep-alive")


def test_keep_alive_default_is_well_inside_the_15_second_proxy_limit():
    assert 0 < logs_api.KEEPALIVE_SECONDS <= 15 and 0 < logs_api.POLL_SECONDS <= 0.25


# The TestClient variant of the stream tests. Starlette's TestClient buffers a response until the app
# finishes and never reports a disconnect mid-stream, so the stream's request.is_disconnected() is replaced by
# one the test controls; everything else (routing, validation, framing, headers) is the real thing.

class Gate:
    """Counts the stream's polls and decides when its "client" has disconnected."""

    def __init__(self):
        self.polls, self.stopping, self._cond = 0, False, threading.Condition()

    def poll(self):
        with self._cond:
            self.polls += 1
            self._cond.notify_all()
            return self.stopping

    def wait_polls(self, n, timeout=5):
        with self._cond:
            start = self.polls
            assert self._cond.wait_for(lambda: self.polls >= start + n, timeout), "the stream stopped polling"

    def stop(self):
        with self._cond:
            self.stopping = True


@pytest.fixture()
def gate(monkeypatch, fast_stream):
    g = Gate()

    async def is_disconnected(self):
        return g.poll()

    monkeypatch.setattr(Request, "is_disconnected", is_disconnected)
    return g


def read_stream(client, gate, work=lambda: None, params=None, timeout=5):
    """GET the SSE endpoint on a worker thread. Once it is polling, `work()` runs here; after the stream has
    looked at the buffer again it is told its client is gone. Returns (response, body)."""
    out = {}

    def fetch():
        try:
            with client.stream("GET", "/api/logs/stream", params=params) as r:
                out["response"], out["body"] = r, "".join(r.iter_text())
        except BaseException as exc:  # noqa - re-raised on the test thread
            out["error"] = exc

    worker = threading.Thread(target=fetch, daemon=True)
    worker.start()
    try:
        gate.wait_polls(1, timeout)  # the stream is up and polling
        work()
        gate.wait_polls(2, timeout)  # ...and has read the buffer again since `work`
    finally:
        gate.stop()
    worker.join(timeout)
    assert not worker.is_alive(), "the stream did not end"
    if "error" in out:
        raise out["error"]
    return out["response"], out["body"]


def test_testclient_stream_delivers_entries_logged_after_connecting(client, gate):
    lg = logging.getLogger("vt.sse")
    lg.info("before connecting")  # after=0 is a live tail: history is not replayed

    def emit():
        lg.info("first live")
        lg.error("second live")

    resp, body = read_stream(client, gate, emit)
    assert resp.status_code == 200 and resp.headers["content-type"].startswith("text/event-stream")
    assert resp.headers["cache-control"] == "no-cache" and resp.headers["x-accel-buffering"] == "no"
    assert body.startswith("event: log\ndata: ")
    assert [(e["level"], e["message"]) for e in parse_sse(body)] == [("INFO", "first live"), ("ERROR", "second live")]


def test_testclient_stream_honours_after_and_level(client, gate):
    lg = logging.getLogger("vt.sse")
    lg.info("a")
    cursor = BUFFER.last_seq
    lg.info("b")
    lg.error("c")
    _, body = read_stream(client, gate, params={"after": cursor, "level": "ERROR"})
    assert messages(parse_sse(body)) == ["c"]


def test_testclient_stream_sends_keep_alive_when_idle(client, gate, monkeypatch):
    monkeypatch.setattr(logs_api, "KEEPALIVE_SECONDS", 0.03)
    _, body = read_stream(client, gate, work=lambda: time.sleep(0.2))
    assert ": keep-alive\n\n" in body and parse_sse(body) == []


@pytest.mark.parametrize("params", [{"level": "LOUD"}, {"level": ""}, {"after": "soon"}])
def test_stream_rejects_bad_parameters(client, gate, params):
    gate.stop()  # were a bad request wrongly accepted, its stream would end at once instead of hanging the suite
    assert client.get("/api/logs/stream", params=params).status_code == 422
