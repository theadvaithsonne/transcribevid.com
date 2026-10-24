import os
import sys
from pathlib import Path

os.environ.setdefault("VT_WARMUP", "0")  # tests never preload a real Whisper model
os.environ["VT_COUNT_JOBS"] = "0"  # tests never touch the "videos transcribed" counter unless they turn it on themselves
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest  # noqa: E402


@pytest.fixture(autouse=True)
def isolated_storage(tmp_path, monkeypatch):
    """Every test gets its own session/tmp/model dirs, so nothing touches the real data folder
    (the app wipes these on start/stop)."""
    from app import config
    # Unit/API fixtures replace recognition in-process. Real process lifecycle is
    # tested separately with ProcessWorker, including a permanently blocked decode.
    from app import jobs, backends
    class InlineWorker:
        def transcribe(self, *args, **kwargs):
            return backends.transcribe(*args, **kwargs)
        def close(self):
            pass
    monkeypatch.setattr(jobs, "ProcessWorker", InlineWorker)
    data = tmp_path / "data"
    monkeypatch.setattr(config, "DATA_DIR", data)
    monkeypatch.setattr(config, "SESSION_ROOT", data / "session")
    monkeypatch.setattr(config, "TMP_DIR", data / "tmp")
    monkeypatch.setattr(config, "MODEL_DIR", str(data / "models"))
    # the website-wide counter: off, and pointed at a throw-away file, so no test can ever change a real number
    from app import stats
    monkeypatch.setattr(config, "COUNT_JOBS", False)
    monkeypatch.setattr(config, "STATS_FILE", data / "stats.json")
    stats.reset()
    yield data
    stats.reset()


def pytest_collection_modifyitems(config, items):
    """Real-video tests transcribe minutes of audio with a real model: opt in with VT_REAL_VIDEOS=1."""
    if os.environ.get("VT_REAL_VIDEOS") == "1":
        return
    skip = pytest.mark.skip(reason="slow real-video test: run `npm run test:real` (sets VT_REAL_VIDEOS=1)")
    for item in items:
        if "real_videos" in item.keywords:
            item.add_marker(skip)
