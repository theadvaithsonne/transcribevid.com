"""Start the API (and the built Angular app, if present):  python run.py"""
import os
import threading
import webbrowser

import uvicorn

from app import config

if __name__ == "__main__":
    url = f"http://{'127.0.0.1' if config.HOST in ('0.0.0.0', '::') else config.HOST}:{config.PORT}"
    served = config.STATIC_DIR.is_dir()
    print(f"\n  TranscribeVid {'running at ' + url if served else 'API running at ' + url + '/api (run the Angular app separately: see README)'}"
          f"\n  Press Ctrl+C to stop.\n")
    if served and os.environ.get("NO_BROWSER") != "1":
        threading.Timer(1.5, lambda: webbrowser.open(url)).start()
    # timeout_graceful_shutdown: open event streams (job progress, /logs) must not block Ctrl+C - without it
    # uvicorn waits for them forever and the session cleanup in the lifespan never runs
    uvicorn.run("app.main:app", host=config.HOST, port=config.PORT, log_level="warning", timeout_graceful_shutdown=3,
                # behind the reverse proxy (Caddy): believe X-Forwarded-For/-Proto so rate limits see the real client
                proxy_headers=True, forwarded_allow_ips="*" if config.TRUST_PROXY else "127.0.0.1")
