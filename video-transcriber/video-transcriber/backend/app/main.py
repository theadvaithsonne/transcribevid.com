"""TranscribeVid API (FastAPI) - https://transcribevid.com

Dev:   npm run dev                              (API on :8000 + Angular dev server on :4200)
Prod:  npm start  /  python run.py              (API + built Angular app on :8000; see deploy/ for the website)

Every visitor gets an isolated, session-only workspace (sessions.py): jobs, media and
transcripts live in memory / a scratch dir and are deleted when the session ends - on request,
after the idle timeout, or when the app stops.
"""
import asyncio
import gzip
import hashlib
import hmac
import html
import json
import logging
import re
import threading
import time
import zlib
from collections import OrderedDict
from contextlib import asynccontextmanager
from datetime import timezone
from email.utils import formatdate, parsedate_to_datetime
from urllib.parse import quote, urlsplit

import anyio.to_thread

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse, Response, StreamingResponse
from pydantic import ValidationError
from starlette.datastructures import Headers, MutableHeaders
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.requests import ClientDisconnect

from . import __version__, config, engine, formats, logs_api, stats
from .jobs import Busy, JobStore
from .limits import RateLimiter
from .logbuffer import setup_logging
from .schemas import JobOptions, JobPatch, RerunRequest
from .sessions import COOKIE_NAME, Session, SessionManager

log = logging.getLogger("vt.api")
manager: SessionManager = None
upload_limiter = RateLimiter(config.RATE_UPLOADS_PER_HOUR, 3600)

EXPORT_PATTERN = "^(txt|plain|srt|vtt|json|md|pdf)$"
# Requests that are polled constantly: logged at DEBUG so the INFO log stays readable.
_QUIET = ("/api/health", "/api/stats", "/api/models", "/api/languages", "/api/session")
_HASHED_ASSET = re.compile(r"^[\w.-]+-[A-Z0-9]{8}\.(js|css)$")  # Angular's content-hashed build files

# THE list of the Angular app's real pages (paths without slashes; "/" and /jobs/<id> are added in is_app_page).
# Anything else is answered with a true 404 status (search engines drop 404s), so a new route in the frontend
# (frontend/src/app/app.routes.ts) MUST be added here too - tests/test_spa.py compares this list with the frontend's
# tool pages and with sitemap.xml.
APP_PAGES = (
    "how-it-works", "faq", "privacy", "terms", "logs",
    # keyword landing pages (frontend/src/app/features/tool-pages/tool-pages.list.ts)
    "video-to-text", "audio-to-text", "mp4-to-text", "mp3-to-text", "srt-subtitle-generator",
    "voice-recording-to-text",
)
# Old addresses of pages that moved: one permanent redirect (301) to the new address, so links and search engines move
# along at once (the app's own redirect in app.routes.ts only happens after it has loaded).
MOVED = {"about": "how-it-works"}
_JOB_PAGE = re.compile(r"^jobs/[0-9a-f]{32}$")
# Never indexed: the JSON API, the operator log viewer and a visitor's private transcript pages.
_NOINDEX = re.compile(r"^/(api(/|$)|logs(/|$)|jobs/)")
_LONG_CACHED = re.compile(r"\.(png|ico|svg|jpe?g|webp|gif|webmanifest)$", re.I)  # icons, og-image, manifest, favicons
# Same on every platform. ads.txt must be text/plain, or Google ignores it.
_MEDIA_TYPES = {".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8"}


def is_app_page(page: str) -> bool:
    """`page` = the URL path without its leading and trailing slash ("" is the home page)."""
    return page == "" or page in APP_PAGES or bool(_JOB_PAGE.match(page))


@asynccontextmanager
async def lifespan(app):
    global manager
    setup_logging()
    device, compute = engine.device_info()
    log.info("%s %s starting in %s mode (device=%s, compute=%s, models=%s, static=%s)", config.BRAND_NAME,
             __version__, "PUBLIC" if config.PUBLIC else "local", device, compute, config.MODEL_DIR,
             "yes" if config.STATIC_DIR.is_dir() else "no (API only)")
    if config.PUBLIC:
        log.info("public limits: upload %d MB, %s min/file, %d sessions, %s jobs/session, queue %s, %s uploads/h per IP, "
                 "idle %d min, models %s, logs %s", config.MAX_UPLOAD_MB, config.MAX_DURATION_MIN or "unlimited",
                 config.MAX_SESSIONS, config.MAX_JOBS_PER_SESSION or "unlimited", config.MAX_QUEUE or "unlimited",
                 config.RATE_UPLOADS_PER_HOUR or "unlimited", config.SESSION_IDLE_MINUTES,
                 ",".join(config.ALLOWED_MODELS) if config.ALLOWED_MODELS else "all",
                 "admin token" if config.ADMIN_TOKEN else "disabled")
    if config.GOOGLE_SITE_VERIFICATION or config.BING_SITE_VERIFICATION or config.INDEXNOW_KEY:
        log.info("search engines: %d Google and %d Bing verification tag(s) in every page, IndexNow key %s",
                 len(config.GOOGLE_SITE_VERIFICATION), len(config.BING_SITE_VERIFICATION),
                 "served" if config.INDEXNOW_KEY else "not set")
    if config.BAD_VERIFICATION_CODES:
        log.warning("ignored %d site verification code(s) that are not a plain code (copy only the content=\"...\" "
                    "part of the tag into VT_GOOGLE_SITE_VERIFICATION / VT_BING_SITE_VERIFICATION)",
                    len(config.BAD_VERIFICATION_CODES))
    if config.BAD_INDEXNOW_KEY:
        log.warning("ignored VT_INDEXNOW_KEY: it must be 8-128 letters, digits or dashes")
    manager = SessionManager()
    if config.COUNT_JOBS:
        log.info("counting finished transcriptions: %d so far (%s)", stats.total(), config.STATS_FILE)
    else:
        log.info("transcription counter is off (VT_COUNT_JOBS=auto counts in public mode only)")
    # Models belong to the reusable inference process, never to the API process.
    try:
        yield
    finally:
        log.info("shutting down")
        manager.close()


# --------------------------------------------------------------------------- middleware (pure ASGI)

_SECURITY_HEADERS = (
    (b"x-content-type-options", b"nosniff"),
    (b"referrer-policy", b"strict-origin-when-cross-origin"),
    (b"x-frame-options", b"DENY"),
    (b"permissions-policy", b"microphone=(self), camera=(), geolocation=()"),
)


class AccessLog:
    """Request logger + the headers every response gets (security, no-store for /api, the session cookie).
    Pure ASGI: BaseHTTPMiddleware mishandles streaming responses and client disconnects."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        path = scope.get("path", "")
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        quiet_self = path.startswith("/api/logs")  # never log the log viewer itself
        t0, status = time.perf_counter(), 0

        async def send_wrapper(message):
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
                headers = list(message["headers"])
                have = {k.lower() for k, _ in headers}
                for k, v in _SECURITY_HEADERS:
                    if k not in have:
                        headers.append((k, v))
                if _NOINDEX.match(path) and b"x-robots-tag" not in have:
                    headers.append((b"x-robots-tag", b"noindex, nofollow"))
                if path.startswith("/api/") and b"cache-control" not in have:
                    # transcripts and media must never land in the browser's disk cache (session-only app)
                    headers.append((b"cache-control", b"no-store"))
                if config.PUBLIC and scope.get("scheme") == "https" and b"strict-transport-security" not in have:
                    headers.append((b"strict-transport-security", b"max-age=31536000; includeSubDomains"))
                sid = scope.get("tv_set_cookie")
                if sid:  # a visitor just got a new session
                    secure = "; Secure" if scope.get("scheme") == "https" else ""
                    headers.append((b"set-cookie", f"{COOKIE_NAME}={sid}; Path=/; HttpOnly; SameSite=Lax{secure}".encode()))
                message["headers"] = headers
            await send(message)

        try:
            await self.app(scope, receive, send_wrapper)
        except Exception:
            status = status or 500
            raise
        finally:
            if not quiet_self:
                ms = (time.perf_counter() - t0) * 1000
                method = scope["method"]
                if status >= 500:
                    level = logging.ERROR
                elif status >= 400 and not (status == 404 and not path.startswith("/api/")):
                    level = logging.WARNING
                elif method == "GET" and (path == "/api/jobs" or path.startswith(_QUIET) or not path.startswith("/api/")):
                    level = logging.DEBUG  # polling + the Angular app's own files (/, /main-*.js, ...)
                else:
                    level = logging.INFO
                safe = path.encode("unicode_escape").decode("ascii")  # a crafted URL cannot forge log lines
                log.log(level, "%s %s -> %s (%.0f ms)", method, safe, status or "-", ms)


class OriginGuard:
    """Refuse state-changing requests that a *different website* sent from the user's browser (CSRF):
    a browser always attaches `Origin` to cross-site POST/PATCH/DELETE, and only our own pages
    (same host, or the Angular dev server) are allowed."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope["method"] in ("POST", "PUT", "PATCH", "DELETE"):
            headers = {k.decode("latin-1").lower(): v.decode("latin-1") for k, v in scope["headers"]}
            origin = headers.get("origin")
            if origin:  # absent for non-browser clients (curl, tests); "null" for sandboxed/opaque pages
                same_site = origin != "null" and urlsplit(origin).netloc == headers.get("host")
                if not (same_site or origin in config.CORS_ORIGINS):
                    log.warning("blocked cross-site %s %s from origin %s", scope["method"],
                                scope.get("path", "").encode("unicode_escape").decode("ascii"), origin[:100])
                    await JSONResponse({"detail": "Cross-site request refused."}, status_code=403)(scope, receive, send)
                    return
        await self.app(scope, receive, send)


class CanonicalHost:
    """Public site only: www.transcribevid.com -> transcribevid.com, and plain http -> https when a trusted
    reverse proxy says the visitor used http (one canonical URL for visitors, links and search engines)."""

    def __init__(self, app):
        self.app = app
        self.canonical = urlsplit(config.PUBLIC_URL)

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and config.PUBLIC:
            headers = {k.decode("latin-1").lower(): v.decode("latin-1") for k, v in scope["headers"]}
            host = headers.get("host", "").split(":")[0].lower()
            proto = headers.get("x-forwarded-proto", "").lower() if config.TRUST_PROXY else scope.get("scheme", "")
            path = scope.get("path", "/") or "/"
            query = scope.get("query_string", b"").decode("latin-1")
            target = None
            if host == "www." + (self.canonical.hostname or ""):
                target = f"{config.PUBLIC_URL}{path}"
            elif proto == "http" and self.canonical.scheme == "https" and host == self.canonical.hostname:
                target = f"https://{host}{path}"
            if target:
                if query:
                    target += "?" + query
                await RedirectResponse(target, status_code=301 if scope["method"] in ("GET", "HEAD") else 308)(
                    scope, receive, send)
                return
        await self.app(scope, receive, send)


# Text worth compressing. A positive list on purpose: the live event streams (text/event-stream) must reach the browser
# the moment they are written, and media, PDFs and images are compressed already.
_COMPRESSIBLE = re.compile(r"^\s*(text/(html|css|javascript|plain|xml|vtt|markdown|csv)|image/svg\+xml|"
                           r"application/(javascript|json|ld\+json|manifest\+json|xml|x-subrip))\s*(;|$)", re.I)
_GZIP_MIN = 1024              # smaller answers are not worth it
_GZIP_BUFFER = 4 << 20        # compressed in one piece (with a Content-Length) up to this size, streamed beyond it
_GZIP_THREAD = 64 << 10       # larger bodies are compressed in a worker thread, not on the event loop
_GZIP_CACHE_ITEM = 2 << 20    # the app's own files are compressed once and kept: bodies up to this size ...
_GZIP_CACHE_TOTAL = 24 << 20  # ... and this much in all (the least recently used go first)


def accepts_gzip(header: str) -> bool:
    """Whether an Accept-Encoding value allows gzip: "gzip;q=0" refuses it, "*" allows it unless gzip is named."""
    star = False
    for part in header.split(","):
        coding, *params = [p.strip() for p in part.split(";")]
        q = 1.0
        for p in params:
            k, _, v = p.partition("=")
            if k.strip().lower() == "q":
                try:
                    q = float(v)
                except ValueError:
                    q = 0.0
        coding = coding.lower()
        if coding in ("gzip", "x-gzip"):
            return q > 0
        if coding == "*":
            star = q > 0
    return star


def _gzip(data: bytes) -> bytes:
    return gzip.compress(data, compresslevel=6, mtime=0)


def _mark_gzip(headers: MutableHeaders):
    headers["content-encoding"] = "gzip"
    etag = headers.get("etag")
    if etag and not etag.startswith("W/"):  # same content, other bytes: a weak validator (as nginx does)
        headers["etag"] = "W/" + etag


class Compress:
    """gzip for text answers when the browser accepts it: pages, scripts, styles, JSON, SVG and the text exports. Pure
    ASGI, innermost. It never touches the live event streams (text/event-stream is not on the list, so they pass through
    unbuffered), partial (206) or already-encoded answers, media or PDFs. A reverse proxy in front keeps an encoded
    answer as it is (deploy/Caddyfile). The build's files are compressed once and kept in memory; visitors' data
    (anything under /api/) never is. VT_COMPRESS=0 turns it off."""

    def __init__(self, app):
        self.app = app
        self.cache: OrderedDict[bytes, bytes] = OrderedDict()
        self.cached = 0

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or not config.COMPRESS:
            return await self.app(scope, receive, send)
        extensions = scope.get("extensions") or {}
        if "http.response.pathsend" in extensions:  # a file must come back as bytes to be compressed
            scope = {**scope, "extensions": {k: v for k, v in extensions.items() if k != "http.response.pathsend"}}
        accept = accepts_gzip(Headers(scope=scope).get("accept-encoding", ""))
        head = scope["method"] == "HEAD"
        keep = not scope.get("path", "").startswith("/api/")
        start, chunks, size, z = None, [], 0, None

        async def wrapped(message):
            nonlocal start, size, z
            if message["type"] == "http.response.start":
                headers = MutableHeaders(raw=list(message["headers"]))
                if (not _COMPRESSIBLE.match(headers.get("content-type", "")) or message["status"] in (204, 206, 304)
                        or "content-encoding" in headers or "content-range" in headers):
                    return await send(message)
                headers.add_vary_header("Accept-Encoding")
                length = headers.get("content-length", "")
                if (not accept or (length.isdigit() and int(length) < _GZIP_MIN)
                        or "no-transform" in headers.get("cache-control", "").lower()):
                    return await send({**message, "headers": headers.raw})
                if head:  # what the GET would say (its compressed length is only known once the body exists)
                    _mark_gzip(headers)
                    del headers["content-length"]
                    return await send({**message, "headers": headers.raw})
                start = {**message, "headers": headers.raw}  # held until the body is known
                return
            if start is None or message["type"] != "http.response.body":
                return await send(message)
            body, more = message.get("body", b""), message.get("more_body", False)
            if z is None:
                chunks.append(body)
                size += len(body)
                if more and size <= _GZIP_BUFFER:
                    return
                body = b"".join(chunks)
                chunks.clear()
                if not more:
                    return await self._whole(start, body, send, keep)
                headers = MutableHeaders(raw=start["headers"])  # too big to hold: compressed as it streams
                _mark_gzip(headers)
                del headers["content-length"]
                await send({**start, "headers": headers.raw})
                z = zlib.compressobj(6, zlib.DEFLATED, 31)
            out = z.compress(body) + (b"" if more else z.flush())
            if out or not more:
                await send({"type": "http.response.body", "body": out, "more_body": more})

        await self.app(scope, receive, wrapped)

    async def _whole(self, start, data: bytes, send, keep: bool):
        headers = MutableHeaders(raw=start["headers"])
        if len(data) < _GZIP_MIN:  # small after all (no length was announced): sent as it is
            await send(start)
            return await send({"type": "http.response.body", "body": data, "more_body": False})
        key = hashlib.blake2b(data, digest_size=20).digest() if keep else None
        gz = self.cache.get(key) if key else None
        if gz is None:
            gz = await anyio.to_thread.run_sync(_gzip, data) if len(data) > _GZIP_THREAD else _gzip(data)
            if key and len(gz) <= _GZIP_CACHE_ITEM:
                self.cache[key] = gz
                self.cached += len(gz)
                while self.cached > _GZIP_CACHE_TOTAL:
                    self.cached -= len(self.cache.popitem(last=False)[1])
        else:
            self.cache.move_to_end(key)
        _mark_gzip(headers)
        headers["content-length"] = str(len(gz))
        await send({**start, "headers": headers.raw})
        await send({"type": "http.response.body", "body": gz, "more_body": False})


def _allowed_hosts():
    if config.HOST in ("0.0.0.0", "::") and not config.PUBLIC:  # the user chose to share it on their network
        return ["*"]
    canon = urlsplit(config.PUBLIC_URL).hostname or config.BRAND_DOMAIN
    hosts = ["localhost", "127.0.0.1", "[::1]", "::1", "testserver", "app", canon, "www." + canon, *config.EXTRA_ALLOWED_HOSTS]
    if config.HOST not in ("0.0.0.0", "::"):
        hosts.append(config.HOST)
    return hosts


app = FastAPI(title=f"{config.BRAND_NAME} API", version=__version__, lifespan=lifespan,
              docs_url=None if config.PUBLIC else "/docs", redoc_url=None, openapi_url=None if config.PUBLIC else "/openapi.json")
app.add_middleware(Compress)  # innermost: sees each answer exactly as the endpoint made it
app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGINS, allow_methods=["*"],
                   allow_headers=["*"], expose_headers=["Content-Disposition"])
app.add_middleware(OriginGuard)
app.add_middleware(AccessLog)  # times and logs everything below it, including refusals
app.add_middleware(CanonicalHost)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=_allowed_hosts())  # outermost: blocks DNS-rebinding hosts


def logs_access(request: Request):
    """/api/logs is for the operator: open on a local install, behind VT_ADMIN_TOKEN on the public site."""
    token = config.ADMIN_TOKEN
    if token:
        auth = request.headers.get("authorization", "")
        supplied = auth[7:] if auth.lower().startswith("bearer ") else request.query_params.get("token", "")
        if not supplied or not hmac.compare_digest(supplied.encode(), token.encode()):
            raise HTTPException(401, "The admin token is required.", headers={"WWW-Authenticate": "Bearer"})
    elif config.PUBLIC:
        raise HTTPException(404, "Not found")


app.include_router(logs_api.router, dependencies=[Depends(logs_access)])
app.include_router(logs_api.client_router)  # browser-side error reports: anyone, rate limited


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    log.exception("unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse({"detail": "Internal server error. Please try again."}, status_code=500)


# --------------------------------------------------------------------------- session plumbing

def get_session(request: Request) -> Session:
    """The visitor's session (created on first use; the cookie is attached to the response by AccessLog)."""
    sess = manager.get(request.cookies.get(COOKIE_NAME))
    if sess is None:
        try:
            sess = manager.create()
        except Busy as e:
            raise HTTPException(e.status, str(e), headers={"Retry-After": "60"})
        request.scope["tv_set_cookie"] = sess.id
    sess.touch()
    return sess


def get_store(sess: Session = Depends(get_session)) -> JobStore:
    return sess.store


def _job(store, job_id):
    job = store.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job


def _public(store, job, with_segments=True):
    snap = store.snapshot(job["id"], with_segments)  # consistent copy, safe against the worker thread
    out = {k: v for k, v in snap.items() if k not in ("media_file", "version", "playable", "origin", "counted")}
    out["media_url"] = f"/api/jobs/{job['id']}/media" if store.preview_path(job) else None
    return out


# --------------------------------------------------------------------------- meta

@app.api_route("/api/health", methods=["GET", "HEAD"])
def health(request: Request):
    """Public facts about this server. Never creates a session (uptime monitors call it constantly)."""
    device, compute = engine.device_info()
    sess = manager.get(request.cookies.get(COOKIE_NAME))
    return {"status": "ok", "version": __version__, "device": None if config.PUBLIC else device,
            "compute_type": None if config.PUBLIC else compute,
            "session_id": sess.short_id if sess else None, "started_at": manager.started_at, "persistent": False,
            "max_upload_mb": config.MAX_UPLOAD_MB, "max_duration_min": config.MAX_DURATION_MIN,
            "session_idle_minutes": config.SESSION_IDLE_MINUTES, "public": config.PUBLIC,
            "brand": {"name": config.BRAND_NAME, "domain": config.BRAND_DOMAIN, "url": config.PUBLIC_URL,
                      "contact_email": config.CONTACT_EMAIL},
            "logs_enabled": bool(config.ADMIN_TOKEN) or not config.PUBLIC, "logs_require_token": bool(config.ADMIN_TOKEN),
            "allowed_models": config.ALLOWED_MODELS, "queue_pending": manager.scheduler.pending}


@app.api_route("/api/stats", methods=["GET", "HEAD"])
def public_stats(response: Response):
    """The website-wide 'videos transcribed' number for the page header. One integer from memory: no session, no
    cookie, nothing per visitor. `transcribed` is 0 whenever `counting` is false (local copies never show a count)."""
    response.headers["Cache-Control"] = "public, max-age=30"
    return {"transcribed": stats.total(), "counting": config.COUNT_JOBS}


@app.get("/api/models")
def models():
    return engine.list_models()


@app.get("/api/languages")
def languages():
    return [{"code": c, "name": n} for c, n in sorted(engine.LANGUAGES.items(), key=lambda x: x[1])]


@app.get("/api/session")
def session_info(sess: Session = Depends(get_session)):
    return {"session_id": sess.short_id, "created_at": sess.created_at, "last_seen": sess.last_seen,
            "expires_in_seconds": manager.expires_in(sess), "job_count": len(sess.store.jobs)}


@app.delete("/api/session", status_code=204)
def delete_session_data(sess: Session = Depends(get_session)):
    """'Delete my data now': every job and uploaded file of this visitor is erased immediately."""
    manager.reset(sess)
    return Response(status_code=204)


# --------------------------------------------------------------------------- jobs

@app.post("/api/jobs", status_code=201)
async def create_job(request: Request, filename: str = Query(..., min_length=1, max_length=255),
                     options: str = Query("{}", max_length=8000),
                     store: JobStore = Depends(get_store)):
    """Body = the raw file bytes (not multipart), so it streams to disk exactly once."""
    if request.headers.get("content-type", "").split(";")[0].strip().lower() != "application/octet-stream":
        # also forces a CORS preflight for any cross-site page, which this server then refuses
        raise HTTPException(415, "Send the file as the raw request body with Content-Type: application/octet-stream.")
    declared = int(request.headers.get("content-length") or 0)
    if declared > config.MAX_UPLOAD_BYTES:
        raise HTTPException(413, f"File is larger than the {config.MAX_UPLOAD_MB} MB limit.")
    ip = request.client.host if request.client else "unknown"
    if not upload_limiter.allow(ip):
        raise HTTPException(429, "You have started a lot of transcriptions recently. Please wait a bit and try again.",
                            headers={"Retry-After": str(upload_limiter.retry_after(ip))})
    try:
        opts = JobOptions(**json.loads(options or "{}")).model_dump()
    except (ValueError, TypeError) as e:
        raise HTTPException(422, f"Invalid options: {e}")
    try:
        job = await store.create(request.stream(), filename, opts, declared)
    except Busy as e:
        raise HTTPException(e.status, str(e), headers={"Retry-After": "60"})
    except ValueError as e:
        raise HTTPException(413 if "larger" in str(e) else 400, str(e))
    except ClientDisconnect:
        raise HTTPException(400, "Upload was interrupted")
    except OSError as e:
        raise HTTPException(507, f"Could not save the upload: {e}")
    return _public(store, job, with_segments=False)


@app.get("/api/jobs")
def list_jobs(store: JobStore = Depends(get_store)):
    return store.summaries()


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str, store: JobStore = Depends(get_store)):
    return _public(store, _job(store, job_id))


@app.patch("/api/jobs/{job_id}")
def patch_job(job_id: str, body: JobPatch, store: JobStore = Depends(get_store)):
    job = _job(store, job_id)
    try:
        if body.title is not None:
            store.update_title(job_id, body.title)
        if body.segments:
            store.update_segments(job_id, [s.model_dump(exclude_none=True) for s in body.segments])
        if body.output_script is not None or body.romanizer is not None:
            store.restyle(job_id, body.output_script, body.romanizer)
    except KeyError:
        raise HTTPException(404, "Job not found")
    except ValueError as e:
        raise HTTPException(409, str(e))
    except RuntimeError as e:
        raise HTTPException(422, str(e))
    return _public(store, job)


@app.post("/api/jobs/{job_id}/cancel")
def cancel_job(job_id: str, store: JobStore = Depends(get_store)):
    _job(store, job_id)
    return _public(store, store.cancel(job_id), with_segments=False)


@app.post("/api/jobs/{job_id}/rerun", status_code=201)
def rerun_job(job_id: str, body: RerunRequest, store: JobStore = Depends(get_store)):
    _job(store, job_id)
    try:
        changes = body.model_dump(exclude_unset=True)  # explicit null (language -> auto) is honoured
        merged = JobOptions(**{**_job(store, job_id)["options"], **changes}).model_dump()
        return _public(store, store.rerun(job_id, merged), with_segments=False)
    except ValidationError as e:
        raise HTTPException(422, "; ".join(f"{'.'.join(map(str, x['loc']))}: {x['msg']}" for x in e.errors()))
    except Busy as e:
        raise HTTPException(e.status, str(e), headers={"Retry-After": "60"})
    except KeyError:
        raise HTTPException(404, "Job not found")
    except ValueError as e:
        raise HTTPException(409, str(e))
    except OSError as e:
        raise HTTPException(507, f"Could not copy the media for a new run: {e}")


@app.delete("/api/jobs/{job_id}", status_code=204)
def delete_job(job_id: str, store: JobStore = Depends(get_store)):
    _job(store, job_id)
    try:
        store.delete(job_id)
    except ValueError as e:
        raise HTTPException(409, str(e))
    return Response(status_code=204)


@app.get("/api/jobs/{job_id}/media")
def media(job_id: str, store: JobStore = Depends(get_store)):
    path = store.preview_path(_job(store, job_id))
    if not path:
        raise HTTPException(404, "No playable media for this job")
    return FileResponse(path)  # Starlette serves HTTP Range requests, so seeking works


@app.get("/api/jobs/{job_id}/export")
def export(job_id: str, format: str = Query("txt", pattern=EXPORT_PATTERN),
           max_chars: int = Query(42, ge=20, le=80), max_lines: int = Query(2, ge=1, le=3),
           store: JobStore = Depends(get_store)):
    job = store.snapshot(job_id) or _job(store, job_id)
    if job["status"] != "done":
        raise HTTPException(409, "The transcript is not ready yet")
    opts = {"max_chars": max_chars, "max_lines": max_lines} if format in ("srt", "vtt") else {}
    t0 = time.perf_counter()
    body, mime, ext = formats.render(job, format, **opts)
    log.info("export %s of job %s: %d segment(s), %.0f KB in %.0f ms", format, job_id[:8],
             len(job["segments"]), len(body) / 1024, (time.perf_counter() - t0) * 1000)
    name = quote(f"{job['title']}.{ext}")
    return Response(body, media_type=mime,
                    headers={"Content-Disposition": f"attachment; filename*=UTF-8''{name}"})


@app.get("/api/jobs/{job_id}/events")
async def events(job_id: str, since: int = 0, sess: Session = Depends(get_session)):
    """Server-sent events: `job` (status/progress), `segments` (newly recognised text), `end`."""
    store = sess.store
    job = _job(store, job_id)
    log.debug("SSE stream opened for job %s (from segment %d)", job_id[:8], since)

    async def stream():
        sent, version = since, -1
        try:
            while True:
                sess.touch()  # a visitor watching a job is an active visitor
                if sess.store is not store or store.get(job_id) is None:  # deleted / session wiped meanwhile
                    yield "event: end\ndata: {}\n\n"
                    return
                if job.get("version") != version:
                    version = job.get("version")
                    segs = store.segments_since(job_id, sent)
                    if segs:
                        sent += len(segs)
                        yield f"event: segments\ndata: {json.dumps(segs, ensure_ascii=False, default=float)}\n\n"
                    yield f"event: job\ndata: {json.dumps(_public(store, job, False), ensure_ascii=False, default=float)}\n\n"
                    if job["status"] not in ("queued", "running"):
                        yield "event: end\ndata: {}\n\n"
                        return
                else:
                    yield ": keep-alive\n\n"
                await asyncio.sleep(0.5)
        finally:
            log.debug("SSE stream closed for job %s", job_id[:8])

    return StreamingResponse(stream(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


# --------------------------------------------------------------------------- Angular app
# Serves the built frontend (config.STATIC_DIR, looked up per request so tests can point it elsewhere). In order:
#   (a) an exact static file                      -> its own cache policy (hashed = immutable, icons 1 day, robots/sitemap/ads.txt 1 h)
#   (b) <path>/index.html (a prerendered page)    -> 200, no-cache ("/" is the root index.html)
#   (c) a known app page / /jobs/<id>             -> index.csr.html (client-only shell) if built, else index.html, 200
#   (d) anything else                             -> the same shell with a TRUE 404 (no "soft 404"s for search engines)
# One canonical URL per page: /faq/ -> 301 /faq, /index.html -> 301 /, and the client-only shell is never served
# under its own name. GET and HEAD behave identically (crawlers and uptime monitors use HEAD). Every file and page has
# an ETag, and a browser that already has the current copy gets "304 Not Modified" (no body) when it revalidates.
# Pages (b)-(d) also carry the search-engine verification tags (config.GOOGLE/BING_SITE_VERIFICATION) after <head>;
# a file dropped into frontend/public (e.g. Google's google<code>.html) is served exactly as it is, by (a).

def _dist_root():
    root = config.STATIC_DIR
    try:
        return root.resolve() if root.is_dir() else None
    except OSError:
        return None


def _not_found(head: bool):
    body = b'{"detail":"Not found"}'
    if head:  # same headers as the GET, no body
        return Response(status_code=404, media_type="application/json", headers={"content-length": str(len(body))})
    return Response(body, status_code=404, media_type="application/json")


def _api_miss(request: Request, head: bool):
    """An /api/ path that no endpoint serves for GET. A HEAD on a real endpoint stays 405 (with its real Allow list)."""
    if head:
        allowed = {m for r in request.app.routes if getattr(r, "endpoint", None) is not spa
                   and hasattr(r, "path_regex") and r.path_regex.match(request.scope["path"]) for m in (r.methods or ())}
        if allowed:
            return Response(status_code=405, headers={"Allow": ", ".join(sorted(allowed))})
    return _not_found(head)


def _static_headers(name: str) -> dict:
    if _HASHED_ASSET.match(name):
        return {"Cache-Control": "public, max-age=31536000, immutable"}
    if name in ("robots.txt", "sitemap.xml", "ads.txt"):
        return {"Cache-Control": "public, max-age=3600"}
    if _LONG_CACHED.search(name):
        return {"Cache-Control": "public, max-age=86400"}
    return {"Cache-Control": "no-cache"}  # anything else is revalidated (the ETag makes that cheap)


def _inside(root, f) -> bool:
    return f == root or root in f.parents


def _unchanged(request: Request, etag: str, mtime: float) -> bool:
    """A conditional GET/HEAD (RFC 9110, 13.1.2 and 13.1.3) whose copy is still current, so the answer is 304."""
    none_match = request.headers.get("if-none-match")
    if none_match is not None:  # wins over If-Modified-Since; always the weak comparison
        tags = {t.strip().removeprefix("W/") for t in none_match.split(",")}
        return "*" in tags or etag.removeprefix("W/") in tags
    since = request.headers.get("if-modified-since")
    if since:
        try:
            when = parsedate_to_datetime(since)
        except (TypeError, ValueError, IndexError, OverflowError):
            return False
        if when.tzinfo is None:
            when = when.replace(tzinfo=timezone.utc)
        return int(mtime) <= when.timestamp()
    return False


def _verification_tags() -> bytes:
    """<meta> tags proving ownership to Google Search Console / Bing Webmaster Tools (deploy/SEO.md)."""
    tags = [("google-site-verification", c) for c in config.GOOGLE_SITE_VERIFICATION]
    tags += [("msvalidate.01", c) for c in config.BING_SITE_VERIFICATION]
    return "".join(f'<meta name="{n}" content="{html.escape(c, quote=True)}">' for n, c in tags).encode()


_HEAD_TAG = re.compile(rb"<head(\s[^>]*)?>", re.I)
_STARTED = time.time()


def _page(request: Request, f, status: int, head: bool) -> Response:
    """A page of the app (prerendered, or the client-only shell): always revalidated (no-cache) against an ETag of
    exactly the bytes served, so it changes with a new build and with the verification tags."""
    body, mtime = f.read_bytes(), f.stat().st_mtime
    tags = _verification_tags()
    if tags and (m := _HEAD_TAG.search(body)):
        body = body[:m.end()] + tags + body[m.end():]
        mtime = max(mtime, _STARTED)  # the tags come from the settings, which can only change with a restart
    headers = {"Cache-Control": "no-cache", "ETag": f'"{hashlib.blake2b(body, digest_size=16).hexdigest()}"',
               "Last-Modified": formatdate(mtime, usegmt=True)}
    if status == 200 and _unchanged(request, headers["ETag"], mtime):
        return Response(status_code=304, headers=headers)
    headers["Content-Length"] = str(len(body))
    return Response(b"" if head else body, status_code=status, media_type="text/html", headers=headers)


@app.api_route("/{path:path}", methods=["GET", "HEAD"], include_in_schema=False)
def spa(request: Request, path: str):
    head = request.method == "HEAD"
    if path == "api" or path.startswith("api/"):
        return _api_miss(request, head)
    if config.INDEXNOW_KEY and path == config.INDEXNOW_KEY + ".txt":  # IndexNow: proves the key belongs to this site
        key = config.INDEXNOW_KEY.encode()
        return Response(b"" if head else key, media_type="text/plain",
                        headers={"Cache-Control": "public, max-age=3600", "Content-Length": str(len(key))})
    root = _dist_root()
    if root is None:
        return _not_found(head)

    def permanent(page: str):  # always built from a validated page name, never from raw input (no open redirect)
        query = request.scope.get("query_string", b"").decode("latin-1")
        return RedirectResponse("/" + page + ("?" + query if query else ""), status_code=301)

    page = path.rstrip("/")
    if page in MOVED:
        return permanent(MOVED[page])  # /about, /about/ -> /how-it-works
    if path and path.endswith("/") and is_app_page(page):
        return permanent(page)  # /faq/ -> /faq ("//" -> "/")
    if path == "index.html" or (path.endswith("/index.html") and is_app_page(path[:-len("/index.html")])):
        return permanent(path[:-len("index.html")].rstrip("/"))  # /index.html -> /, /faq/index.html -> /faq

    # Servers normalise "..", so a request that still has one (or a backslash / NUL byte) is hostile or broken: it is
    # simply an unknown URL. Anything else is resolved - symlinks included - and must end up inside the build folder.
    safe = "\\" not in path and "\x00" not in path and not ({".", ".."} & set(path.split("/")))
    f = None
    if safe:
        try:
            f = (root / path).resolve()
        except (ValueError, OSError):
            f = None
    inside = f is not None and _inside(root, f)
    shell = root / "index.csr.html"
    if not shell.is_file():
        shell = root / "index.html"

    if inside and path and not path.endswith("/") and f.is_file() and f.name not in ("index.html", "index.csr.html"):  # (a)
        st = f.stat()
        headers = {**_static_headers(f.name), "ETag": '"%s"' % hashlib.md5(
            f"{st.st_mtime_ns}-{st.st_size}".encode(), usedforsecurity=False).hexdigest()}
        if _unchanged(request, headers["ETag"], st.st_mtime):
            return Response(status_code=304, headers=headers)
        return FileResponse(f, headers=headers, media_type=_MEDIA_TYPES.get(f.suffix.lower()), stat_result=st)
    if inside and not path.endswith("/") and (f / "index.html").is_file() and _inside(root, (f / "index.html").resolve()):  # (b)
        return _page(request, f / "index.html", 200, head)
    known = safe and is_app_page(page) and not path.endswith("/")
    if not shell.is_file():
        return _not_found(head)
    return _page(request, shell, 200 if known else 404, head)  # (c) / (d)
