"""Video Transcriber - local web app.

Run:  python app.py   (or double-click run.bat / run.sh)
Then open http://127.0.0.1:5000 in your browser.
"""
import os
import sys
import threading
import uuid
import webbrowser
import tempfile

from flask import Flask, render_template, request, jsonify, Response

import transcriber

BASE = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
app = Flask(__name__, template_folder=os.path.join(BASE, "templates"))
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024 * 1024  # 2 GB

JOBS = {}  # id -> {"status", "progress", "result", "error", "filename"}


def run_job(job_id, path, model_size, language):
    job = JOBS[job_id]
    try:
        job["status"] = "running"
        def prog(p):
            job["progress"] = p
        job["result"] = transcriber.transcribe(path, model_size, language or None, prog)
        job["progress"] = 1.0
        job["status"] = "done"
    except Exception as e:  # noqa
        job["status"] = "error"
        job["error"] = str(e)
    finally:
        try:
            os.remove(path)
        except OSError:
            pass


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/transcribe", methods=["POST"])
def start():
    f = request.files.get("file")
    if not f or not f.filename:
        return jsonify({"error": "No file uploaded"}), 400
    model_size = request.form.get("model", "small")
    language = request.form.get("language", "").strip()
    tmp = os.path.join(tempfile.gettempdir(), f"vt_{uuid.uuid4().hex}_{os.path.basename(f.filename)}")
    f.save(tmp)
    job_id = uuid.uuid4().hex
    JOBS[job_id] = {"status": "queued", "progress": 0.0, "result": None, "error": None,
                    "filename": f.filename}
    threading.Thread(target=run_job, args=(job_id, tmp, model_size, language), daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/status/<job_id>")
def status(job_id):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error": "unknown job"}), 404
    out = {k: job[k] for k in ("status", "progress", "error", "filename")}
    if job["status"] == "done":
        r = job["result"]
        out["language"] = r["language"]
        out["duration"] = r["duration"]
        out["segments"] = [{"start": s["start"], "end": s["end"],
                            "ts": transcriber.fmt_ts(s["start"]), "text": s["text"]}
                           for s in r["segments"]]
    return jsonify(out)


@app.route("/download/<job_id>/<fmt>")
def download(job_id, fmt):
    job = JOBS.get(job_id)
    if not job or job["status"] != "done":
        return "Not ready", 404
    base = os.path.splitext(job["filename"])[0]
    if fmt == "srt":
        body, mime, ext = transcriber.to_srt(job["result"]), "application/x-subrip", "srt"
    elif fmt == "plain":
        body, mime, ext = transcriber.to_txt(job["result"], timestamps=False), "text/plain", "txt"
    else:
        body, mime, ext = transcriber.to_txt(job["result"]), "text/plain", "txt"
    return Response(body, mimetype=mime,
                    headers={"Content-Disposition": f'attachment; filename="{base}-transcript.{ext}"'})


def main():
    port = int(os.environ.get("PORT", "5000"))
    url = f"http://127.0.0.1:{port}"
    print(f"\n  Video Transcriber running at {url}\n  Press Ctrl+C to stop.\n")
    if os.environ.get("NO_BROWSER") != "1":
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    app.run(host="127.0.0.1", port=port, debug=False, threaded=True)


if __name__ == "__main__":
    main()
