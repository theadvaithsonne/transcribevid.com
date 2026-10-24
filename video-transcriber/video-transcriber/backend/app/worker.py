"""A persistent, killable inference process. Only the scheduler thread uses it.

The API process never loads recognition models. Successful jobs reuse the child;
cancellation kills its process tree, including native decoding and ffmpeg, before
the queue advances. Model downloads remain cached on disk.
"""
import logging
import multiprocessing
import os
import signal
import subprocess
import threading

from . import engine

log = logging.getLogger("vt.worker")


def _serve(conn, settings):
    if os.name != "nt":
        os.setsid()
    from . import config
    for name, value in settings.items():
        setattr(config, name, value)
    try:
        while True:
            request = conn.recv()
            if request is None:
                return
            path, options, workdir = request
            try:
                from .backends import transcribe
                result = transcribe(path, options,
                    on_phase=lambda *args: conn.send(("phase", args)),
                    on_segment=lambda *args: conn.send(("segment", args)), workdir=workdir)
                conn.send(("result", result))
            except Exception as exc:
                conn.send(("error", str(exc) or type(exc).__name__))
            finally:
                # Keep model weights, never keep the previous visitor's transcript in an idle worker.
                result = request = path = options = workdir = None
    except (EOFError, BrokenPipeError):
        return
    finally:
        conn.close()


class ProcessWorker:
    def __init__(self, target=_serve):
        self.target = target
        self.process = None
        self.connection = None
        self._closed = threading.Event()

    def _start(self):
        from . import config
        if self._closed.is_set():
            raise engine.Cancelled()
        if self.process is not None and self.process.is_alive():
            return
        self._stop()
        ctx = multiprocessing.get_context("spawn")
        parent, child = ctx.Pipe()
        settings = {name: getattr(config, name) for name in (
            "MODEL_DIR", "TMP_DIR", "DEVICE", "COMPUTE_TYPE", "CPU_THREADS", "MAX_DURATION_MIN")}
        proc = ctx.Process(target=self.target, args=(child, settings), daemon=True, name="vt-inference")
        try:
            proc.start()
        except BaseException:
            parent.close()
            raise
        finally:
            child.close()
        self.process, self.connection = proc, parent

    def _stop(self):
        proc, conn = self.process, self.connection
        self.process = self.connection = None
        if proc is not None:
            if proc.is_alive():
                if os.name == "nt":
                    subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"],
                                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    try:
                        os.killpg(proc.pid, signal.SIGTERM)
                    except ProcessLookupError:
                        proc.terminate()
                proc.join(timeout=2)
                if proc.is_alive():
                    proc.kill()
                    proc.join(timeout=2)
            else:
                proc.join(timeout=0)
            proc.close()
        if conn is not None:
            conn.close()

    def close(self):
        # Called by the scheduler after its active request has returned.
        self._closed.set()
        self._stop()

    def transcribe(self, path, options, on_phase=None, on_segment=None, should_cancel=None, workdir=None):
        cancelled = lambda: self._closed.is_set() or bool(should_cancel and should_cancel())
        if cancelled():
            raise engine.Cancelled()
        self._start()
        try:
            self.connection.send((str(path), options, workdir))
            while True:
                if cancelled():
                    self._stop()
                    raise engine.Cancelled()
                if not self.connection.poll(0.1):
                    if not self.process.is_alive():
                        raise RuntimeError("The transcription worker stopped unexpectedly. Try again.")
                    continue
                kind, payload = self.connection.recv()
                if cancelled():
                    self._stop()
                    raise engine.Cancelled()
                if kind == "phase" and on_phase:
                    on_phase(*payload)
                elif kind == "segment" and on_segment:
                    on_segment(*payload)
                elif kind == "result":
                    return payload
                elif kind == "error":
                    raise RuntimeError(payload)
        except (EOFError, BrokenPipeError, OSError) as exc:
            self._stop()
            if cancelled():
                raise engine.Cancelled() from exc
            raise RuntimeError("The transcription worker connection closed. Try again.") from exc
        except BaseException:
            self._stop()
            raise
