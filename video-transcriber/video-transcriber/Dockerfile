# TranscribeVid production image.  Build context = repository root (see .dockerignore).
#
#   docker build -t transcribevid-app .
#   docker build --build-arg CJK_FONTS=0 -t transcribevid-app .     # smaller image, no Chinese/Japanese/Korean PDF fonts
#
# In production use docker-compose.yml (adds Caddy for HTTPS, volumes and hardening).

# ---------------------------------------------------------------------------------------------------------------------
# Stage 1: build the Angular app (public pages prerendered to static HTML)  ->  /build/frontend/dist/frontend/browser
# ---------------------------------------------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS frontend
WORKDIR /build/frontend
ENV NG_CLI_ANALYTICS=false \
    CI=true
# Dependencies first: this layer is only rebuilt when package.json / package-lock.json change.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
# The production build prerenders the public pages (src/app/app.routes.server.ts) and writes index.csr.html, the shell for
# every client-rendered page: fail the image build if that did not happen.
RUN npm run build -- --configuration production \
 && test -f dist/frontend/browser/index.csr.html \
 && test -f dist/frontend/browser/faq/index.html \
 && test -f dist/frontend/browser/how-it-works/index.html

# ---------------------------------------------------------------------------------------------------------------------
# Stage 2: runtime (Python API that also serves the built Angular app)
# ---------------------------------------------------------------------------------------------------------------------
FROM python:3.12-slim AS runtime

# Fonts for the PDF export (the app looks in /usr/share/fonts). The CJK set is ~100 MB; without it Chinese,
# Japanese and Korean text in PDFs is replaced by '?'.
ARG CJK_FONTS=1
RUN apt-get update \
 && apt-get install -y --no-install-recommends fonts-noto-core fonts-dejavu-core libstdc++6 \
 && if [ "$CJK_FONTS" = "1" ]; then apt-get install -y --no-install-recommends fonts-noto-cjk; fi \
 && rm -rf /var/lib/apt/lists/*

# Unprivileged user. /data is the only place the app writes besides /tmp: /data/models (Whisper model cache),
# /data/session (uploads; wiped when the app stops or a visitor goes idle) and /data/stats (the "videos transcribed"
# counter: one small JSON file with a single integer, kept across restarts). All three are volumes in
# docker-compose.yml; a new named volume inherits the ownership set here.
RUN groupadd --system --gid 10001 app \
 && useradd --system --uid 10001 --gid app --no-create-home --shell /usr/sbin/nologin app \
 && mkdir -p /data/models /data/session /data/stats \
 && chown -R app:app /data

WORKDIR /app/backend

# yt-dlp uses Node 22+ for YouTube's JavaScript challenge solver.
COPY --from=frontend /usr/local/bin/node /usr/local/bin/node

# Runtime dependencies only (requirements-dev.txt is for tests and the backend/tools accuracy scripts).
# ffmpeg comes from the imageio-ffmpeg wheel, so no system ffmpeg is needed.
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --disable-pip-version-check --root-user-action=ignore -r requirements.txt

COPY backend/app ./app
COPY backend/run.py ./run.py
COPY --from=frontend /build/frontend/dist/frontend/browser /app/frontend/dist/frontend/browser

# Public-site defaults. Everything else (VT_PUBLIC_URL, VT_ALLOWED_HOSTS, VT_TRUST_PROXY, the limits, ...) comes from
# deploy/.env at run time. HF_HOME and the Xet switch keep Hugging Face's side caches in /tmp (small, in memory)
# instead of the read-only root filesystem; the models themselves are cached in VT_MODEL_DIR.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    NO_BROWSER=1 \
    VT_PUBLIC=1 \
    VT_HOST=0.0.0.0 \
    VT_PORT=8000 \
    VT_DATA_DIR=/data \
    VT_MODEL_DIR=/data/models \
    VT_STATS_FILE=/data/stats/stats.json \
    VT_STATIC_DIR=/app/frontend/dist/frontend/browser \
    HF_HOME=/tmp/hf-home \
    HF_HUB_DISABLE_XET=1 \
    HF_HUB_DISABLE_TELEMETRY=1

USER app
EXPOSE 8000

# Healthy = GET /api/health answers 200 (urlopen raises on any other status). The model warm-up runs in the
# background, so the API is up within a few seconds; start-period only covers slow disks and first starts.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD ["python", "-c", "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.environ.get('VT_PORT', '8000') + '/api/health', timeout=4).read()"]

# SIGTERM makes the app wipe all session data before exiting (needs a few seconds: see stop_grace_period).
STOPSIGNAL SIGTERM
CMD ["python", "run.py"]
