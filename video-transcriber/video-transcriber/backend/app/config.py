"""Runtime configuration (all overridable through environment variables)."""
import os
import re
from pathlib import Path

# Hugging Face downloads: no xet side-cache or logs under the user's home - everything stays in our data dir.
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_DIR = BACKEND_DIR.parent

DATA_DIR = Path(os.environ.get("VT_DATA_DIR", BACKEND_DIR / "data")).resolve()
os.environ.setdefault("HF_HOME", str(DATA_DIR / "hf-home"))
SESSION_ROOT = DATA_DIR / "session"  # one folder per running app instance; wiped when it stops (see jobs.py)
# Scratch for decoded audio. A running JobStore points this inside its own session folder; the value here is
# only used by the CLI. Always on the project drive, never next to the user's media.
TMP_DIR = DATA_DIR / "tmp"

HOST = os.environ.get("VT_HOST", "127.0.0.1")
PORT = int(os.environ.get("VT_PORT", "8000"))

def _env_int(name, default):
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return int(default)


# ---------------------------------------------------------------- deployment mode
# VT_PUBLIC=1: the app runs as a website for many visitors (transcribevid.com). Visitors are isolated from
# each other by a session cookie, files are deleted when a session goes idle, and the safety limits below
# switch on. Without it the app is a single-user local tool and the limits are generous or off.
PUBLIC = os.environ.get("VT_PUBLIC") == "1"
BRAND_NAME = os.environ.get("VT_BRAND_NAME", "TranscribeVid")
BRAND_DOMAIN = os.environ.get("VT_BRAND_DOMAIN", "transcribevid.com")
PUBLIC_URL = (os.environ.get("VT_PUBLIC_URL") or f"https://{BRAND_DOMAIN}").rstrip("/")
CONTACT_EMAIL = os.environ.get("VT_CONTACT_EMAIL") or None
EXTRA_ALLOWED_HOSTS = [h.strip().lower() for h in os.environ.get("VT_ALLOWED_HOSTS", "").split(",") if h.strip()]
TRUST_PROXY = os.environ.get("VT_TRUST_PROXY") == "1"      # honour X-Forwarded-* from the reverse proxy
ADMIN_TOKEN = os.environ.get("VT_ADMIN_TOKEN") or None      # protects /api/logs (required to use it when PUBLIC)

SESSION_IDLE_MINUTES = _env_int("VT_SESSION_IDLE_MINUTES", 30 if PUBLIC else 120)
MAX_SESSIONS = _env_int("VT_MAX_SESSIONS", 200 if PUBLIC else 20)
MAX_JOBS_PER_SESSION = _env_int("VT_MAX_JOBS_PER_SESSION", 0)                      # 0 = unlimited (the site is "free, unlimited")
MAX_QUEUE = _env_int("VT_MAX_QUEUE", 30 if PUBLIC else 0)                          # waiting + running, all visitors
MAX_DURATION_MIN = _env_int("VT_MAX_DURATION_MIN", 60 if PUBLIC else 0)           # per file, 0 = unlimited
RATE_UPLOADS_PER_HOUR = _env_int("VT_RATE_UPLOADS_PER_HOUR", 30 if PUBLIC else 0)  # per client IP, 0 = off
MIN_FREE_GB = _env_int("VT_MIN_FREE_GB", 5 if PUBLIC else 0)                       # refuse uploads below this
ALLOWED_MODELS = [m.strip() for m in os.environ.get("VT_ALLOWED_MODELS", "").split(",") if m.strip()] or None

MAX_UPLOAD_MB = _env_int("VT_MAX_UPLOAD_MB", 500 if PUBLIC else 4096)
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

# Public video downloads have their own bounded network queue and scratch files.
MAX_DOWNLOAD_MB = max(1, _env_int("VT_MAX_DOWNLOAD_MB", 500))
MAX_DOWNLOAD_BYTES = MAX_DOWNLOAD_MB * 1024 * 1024
MAX_DOWNLOAD_DURATION = max(1, _env_int("VT_MAX_DOWNLOAD_MINUTES", 60)) * 60
DOWNLOAD_TIMEOUT = max(1, _env_int("VT_DOWNLOAD_TIMEOUT_SECONDS", 600))

# ---------------------------------------------------------------- "videos transcribed" counter (see stats.py)
# One integer: how many uploaded files this website has transcribed. VT_COUNT_JOBS = "auto" (default) counts only
# when the server runs in public mode, so a local copy never touches the number; "1" forces counting, "0" turns it off.
_count = os.environ.get("VT_COUNT_JOBS", "auto").strip().lower()
COUNT_JOBS = PUBLIC if _count in ("", "auto") else _count in ("1", "true", "yes", "on")
# Lives directly in the data dir, NOT in session/ (that folder is wiped); in Docker it sits on its own volume.
STATS_FILE = Path(os.environ.get("VT_STATS_FILE") or DATA_DIR / "stats.json")

# ---------------------------------------------------------------- search engines (deploy/SEO.md)
# Proof of ownership for Google Search Console / Bing Webmaster Tools by the "HTML tag" method, without editing a file:
# only the code from the tag, e.g. VT_GOOGLE_SITE_VERIFICATION=abc123 for <meta name="google-site-verification"
# content="abc123">. Several codes (several owners) are separated by commas. The app puts the tags into every page it
# serves (main.py). The DNS record and HTML-file methods need no setting (deploy/SEO.md).
_VERIFICATION_CODE = re.compile(r"^[A-Za-z0-9_.:+/=-]{1,200}$")


def _codes(name):
    """The valid codes of a comma-separated setting; anything else is ignored (and reported at start-up)."""
    raw = [c.strip() for c in os.environ.get(name, "").split(",") if c.strip()]
    return tuple(c for c in raw if _VERIFICATION_CODE.match(c)), tuple(c for c in raw if not _VERIFICATION_CODE.match(c))


GOOGLE_SITE_VERIFICATION, _BAD_GOOGLE_CODES = _codes("VT_GOOGLE_SITE_VERIFICATION")
BING_SITE_VERIFICATION, _BAD_BING_CODES = _codes("VT_BING_SITE_VERIFICATION")
BAD_VERIFICATION_CODES = _BAD_GOOGLE_CODES + _BAD_BING_CODES
# IndexNow (Bing, Yandex, Seznam, Naver are told about new or changed pages at once): the key is served as /<key>.txt
# and scripts/indexnow.mjs sends the sitemap's pages after a deploy. 8-128 letters, digits or dashes.
def _indexnow_key(value):
    """The key if it is valid for IndexNow (8-128 letters, digits or dashes), else None."""
    value = (value or "").strip()
    return value if re.fullmatch(r"[A-Za-z0-9-]{8,128}", value) else None


INDEXNOW_KEY = _indexnow_key(os.environ.get("VT_INDEXNOW_KEY"))
BAD_INDEXNOW_KEY = bool(os.environ.get("VT_INDEXNOW_KEY", "").strip()) and INDEXNOW_KEY is None
# gzip for text answers (pages, scripts, styles, JSON) when the visitor's browser accepts it (main.Compress). Never for
# the live event streams, media or PDFs. 0 turns it off (a reverse proxy in front then compresses alone).
COMPRESS = os.environ.get("VT_COMPRESS", "1") != "0"

# Built Angular app. Served by the API when present (production mode).
_default_static = PROJECT_DIR / "frontend" / "dist" / "frontend" / "browser"
STATIC_DIR = Path(os.environ.get("VT_STATIC_DIR", _default_static))

# Extra origins allowed by CORS (the Angular dev server is always allowed).
CORS_ORIGINS = [o for o in os.environ.get("VT_CORS_ORIGINS", "").split(",") if o] + [
    "http://localhost:4200", "http://127.0.0.1:4200", PUBLIC_URL, PUBLIC_URL.replace("://", "://www.", 1),
]

# Whisper tuning knobs that rarely need changing.
DEVICE = os.environ.get("VT_DEVICE", "auto")            # auto | cpu | cuda
COMPUTE_TYPE = os.environ.get("VT_COMPUTE_TYPE", "auto")  # auto | int8 | float16 | ...
MODEL_DIR = os.environ.get("VT_MODEL_DIR") or str(DATA_DIR / "models")  # Whisper models (kept off the system drive)
WARMUP = os.environ.get("VT_WARMUP", "1") != "0"         # preload the default model at start (if already downloaded)
CPU_THREADS = int(os.environ.get("VT_CPU_THREADS", "0"))   # 0 = library default (4). Measured best on an 8-core laptop: 4-6; more was slower
