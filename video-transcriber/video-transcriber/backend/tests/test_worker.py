"""Real spawned-process checks: blocked inference must not block cancellation."""
import os
import threading
import time

import pytest

from app import engine
from app.worker import ProcessWorker


def fake_server(conn, settings):
    if os.name != "nt":
        os.setsid()
    while True:
        request = conn.recv()
        if request is None:
            return
        _, options, _ = request
        conn.send(("phase", ("transcribing",)))
        if options.get("prompt") == "crash":
            os._exit(3)
        if options.get("prompt") == "block-before-text":
            while True:
                time.sleep(0.1)
        seg = {"id": 0, "start": 0, "end": 1, "text": "kept", "words": None, "confidence": None}
        conn.send(("segment", (seg, 0.5, {"duration": 2, "language": "en"})))
        if options.get("prompt") == "block":
            while True:
                time.sleep(0.1)
        conn.send(("result", {"language": "en", "duration": 2, "segments": [seg]}))


def test_blocked_native_work_is_killed_partial_text_kept_and_next_job_runs():
    worker = ProcessWorker(target=fake_server)
    cancel, partial = threading.Event(), []
    def segment(s, *args):
        partial.append(s)
        cancel.set()
    try:
        started = time.monotonic()
        with pytest.raises(engine.Cancelled):
            worker.transcribe("unused", {"prompt": "block"}, on_segment=segment, should_cancel=cancel.is_set)
        assert time.monotonic() - started < 10
        assert [s["text"] for s in partial] == ["kept"]
        assert worker.process is None
        result = worker.transcribe("unused", {})
        assert result["segments"][0]["text"] == "kept"
    finally:
        worker.close()


def test_cancel_does_not_require_a_first_segment():
    worker, cancel = ProcessWorker(target=fake_server), threading.Event()
    try:
        with pytest.raises(engine.Cancelled):
            worker.transcribe("unused", {"prompt": "block-before-text"},
                              on_phase=lambda *args: cancel.set(), should_cancel=cancel.is_set)
        assert worker.process is None
    finally:
        worker.close()


def test_success_reuses_process_and_crash_is_recoverable():
    worker = ProcessWorker(target=fake_server)
    try:
        worker.transcribe("unused", {})
        pid = worker.process.pid
        worker.transcribe("unused", {})
        assert worker.process.pid == pid
        with pytest.raises(RuntimeError):
            worker.transcribe("unused", {"prompt": "crash"})
        assert worker.transcribe("unused", {})["segments"][0]["text"] == "kept"
    finally:
        worker.close()


def test_cancel_before_start_never_launches_process():
    worker = ProcessWorker(target=fake_server)
    with pytest.raises(engine.Cancelled):
        worker.transcribe("unused", {}, should_cancel=lambda: True)
    assert worker.process is None
