"""Serving the Angular app to people and crawlers: which URLs are real pages (200) and which are a true 404, one canonical
URL per page (301), HEAD, caching and crawler headers, prerendered pages, and path-traversal safety. Every test runs
against a throw-away fake `dist` folder (config.STATIC_DIR is pointed at it), so none of this depends on a frontend build."""
import asyncio
import json
import os
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

import pytest
from fastapi.testclient import TestClient

from app import config, engine, main
from app.main import APP_PAGES, is_app_page

JOB = "a" * 32
PROJECT = config.PROJECT_DIR
PUBLIC_FILES = PROJECT / "frontend" / "public"
TOOL_PAGES_TS = PROJECT / "frontend" / "src" / "app" / "features" / "tool-pages" / "tool-pages.list.ts"
TOOLS = ["video-to-text", "audio-to-text", "mp4-to-text", "mp3-to-text", "srt-subtitle-generator", "voice-recording-to-text"]
INFO_PAGES = ["how-it-works", "faq", "privacy", "terms", "logs"]
SHELL = '<!doctype html><html><body><app-root>CSR-SHELL</app-root></body></html>'
SECRET = "TOP-SECRET-DO-NOT-SERVE"


def write(path, text="x", binary=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(text) if binary else path.write_text(text, encoding="utf-8")


@pytest.fixture()
def dist(tmp_path, monkeypatch):
    """A fake build output (no prerendering): index.html is the client-only shell. Yields the folder."""
    site = tmp_path / "site"
    root = site / "browser"
    write(root / "index.html", SHELL)
    for name in ("main-ABCD1234.js", "chunk-3UYS3T4L.js", "styles-ABCD1234.css"):
        write(root / name, "/* hashed */")
    for name in ("icon-192.png", "icon-512.png", "og-image.png", "apple-touch-icon.png", "favicon.ico"):
        write(root / name, b"\x89PNG fake", binary=True)
    write(root / "favicon.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>')
    write(root / "manifest.webmanifest", '{"name": "TranscribeVid"}')
    write(root / "robots.txt", "User-agent: *\nAllow: /\nSitemap: https://transcribevid.com/sitemap.xml\n")
    write(root / "sitemap.xml", '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>')
    write(root / "3rdpartylicenses.txt", "licenses")
    write(root / "unhashed.js", "// not content-hashed")
    write(site / "secret.txt", SECRET)       # next to the served folder: must never be reachable
    write(tmp_path / "secret.txt", SECRET)
    monkeypatch.setattr(config, "STATIC_DIR", root)
    return root


@pytest.fixture()
def prerendered(dist):
    """The same build with Angular prerendering: prerendered '/', /faq and /video-to-text, plus index.csr.html."""
    write(dist / "index.csr.html", SHELL.replace("CSR-SHELL", "CSR-ONLY-SHELL"))
    write(dist / "index.html", SHELL.replace("CSR-SHELL", "PRERENDERED-HOME"))
    write(dist / "faq" / "index.html", SHELL.replace("CSR-SHELL", "PRERENDERED-FAQ"))
    write(dist / "video-to-text" / "index.html", SHELL.replace("CSR-SHELL", "PRERENDERED-VIDEO-TO-TEXT"))
    return dist


@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", lambda *a, **k: None)
    with TestClient(main.app, follow_redirects=False) as c:
        yield c


def asgi(path, method="GET", query=b"", host=b"testserver"):
    """Send one request straight to the ASGI app with an exact (already percent-decoded) `path`, as a server would,
    bypassing the HTTP client's URL normalisation. Returns (status, {header: value}, body)."""
    out = []

    async def run():
        scope = {"type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1", "method": method, "scheme": "http",
                 "path": path, "raw_path": path.encode("utf-8"), "root_path": "", "query_string": query,
                 "headers": [(b"host", host)], "client": ("127.0.0.1", 1234), "server": ("testserver", 80)}

        sent_request = []

        async def receive():
            if not sent_request:
                sent_request.append(1)
                return {"type": "http.request", "body": b"", "more_body": False}
            await asyncio.Event().wait()  # the client stays connected: no disconnect until the response is done

        async def send(message):
            out.append(message)
        await main.app(scope, receive, send)
    asyncio.run(run())
    start = next(m for m in out if m["type"] == "http.response.start")
    body = b"".join(m.get("body", b"") for m in out if m["type"] == "http.response.body")
    return start["status"], {k.decode().lower(): v.decode("latin-1") for k, v in start["headers"]}, body


# ================================================================ which URLs are pages

def test_the_list_of_pages_is_in_one_place_and_complete():
    assert set(APP_PAGES) == set(INFO_PAGES + TOOLS)
    assert is_app_page("") and is_app_page("faq") and is_app_page(f"jobs/{JOB}")
    assert not is_app_page("faq/") and not is_app_page("/faq") and not is_app_page("Faq") and not is_app_page("jobs")
    assert not is_app_page("jobs/" + "a" * 31) and not is_app_page("jobs/" + "a" * 33) and not is_app_page("jobs/" + "A" * 32)


@pytest.mark.parametrize("page", INFO_PAGES + TOOLS)
def test_every_real_page_is_200_with_the_app_shell(dist, client, page):
    r = client.get("/" + page)
    assert r.status_code == 200 and "CSR-SHELL" in r.text, page
    assert r.headers["cache-control"] == "no-cache"
    assert r.headers["content-type"].startswith("text/html")


def test_home_and_job_pages_are_200(dist, client):
    for path in ("/", f"/jobs/{JOB}"):
        r = client.get(path)
        assert r.status_code == 200 and "CSR-SHELL" in r.text, path


@pytest.mark.parametrize("path", ["/nope", "/jobs/abc", f"/jobs/{'a' * 31}", f"/jobs/{'a' * 33}", f"/jobs/{'A' * 32}", "/jobs",
                                  f"/jobs/{JOB}/x", "/privacy/x", "/.env", "/admin", "/Faq", "/FAQ", "/video-to-text.html",
                                  "/wp-login.php", "/index.csr.html", "/foo/index.html", "/mp4-to-text/extra", "/%20faq"])
def test_unknown_urls_are_a_true_404_with_the_app_shell(dist, client, path):
    r = client.get(path)
    assert r.status_code == 404, path
    assert "CSR-SHELL" in r.text  # the friendly in-app "page not found" view
    assert r.headers["cache-control"] == "no-cache"


def test_unknown_api_urls_are_json_404s_not_the_app_shell(dist, client):
    r = client.get("/api/nonexistent")
    assert r.status_code == 404 and r.json() == {"detail": "Not found"} and "CSR-SHELL" not in r.text
    assert client.get("/api").status_code == 404
    assert client.get("/api/nonexistent/").status_code == 404  # and never redirected


def test_a_missing_build_is_a_clean_404_not_a_crash(tmp_path, monkeypatch, client):
    monkeypatch.setattr(config, "STATIC_DIR", tmp_path / "does-not-exist")
    assert client.get("/faq").status_code == 404 and client.get("/").status_code == 404
    empty = tmp_path / "empty"
    empty.mkdir()
    monkeypatch.setattr(config, "STATIC_DIR", empty)  # a folder without index.html
    assert client.get("/faq").status_code == 404
    assert client.get("/api/health").status_code == 200  # the API is unaffected


# ================================================================ the sitemap and robots.txt describe real pages

def sitemap_locs():
    root = ET.parse(PUBLIC_FILES / "sitemap.xml").getroot()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [e.text.strip() for e in root.findall("s:url/s:loc", ns)]


@pytest.mark.skipif(not (PUBLIC_FILES / "sitemap.xml").is_file(), reason="frontend/public/sitemap.xml is missing")
def test_every_sitemap_url_is_a_known_app_page_that_answers_200(dist, client):
    locs = sitemap_locs()
    assert locs and len(locs) == len(set(locs))
    for loc in locs:
        u = urlsplit(loc)
        assert u.scheme == "https" and u.hostname == config.BRAND_DOMAIN and not u.query and not u.fragment, loc
        page = u.path.lstrip("/")
        assert u.path == "/" or not u.path.endswith("/"), f"{loc}: the canonical URL has no trailing slash"
        assert is_app_page(page), f"{loc} is in the sitemap but main.APP_PAGES does not know it (it would be a 404)"
        r = client.get(u.path or "/")
        assert r.status_code == 200 and "<app-root" in r.text, loc
    assert {urlsplit(loc).path.lstrip("/") for loc in locs} >= set(TOOLS)  # the six keyword pages are all submitted


@pytest.mark.skipif(not ((PUBLIC_FILES / "sitemap.xml").is_file() and (PUBLIC_FILES / "robots.txt").is_file()),
                    reason="frontend/public/robots.txt or sitemap.xml is missing")
def test_robots_txt_points_at_the_sitemap_and_both_are_served(dist, client):
    shutil.copy(PUBLIC_FILES / "robots.txt", dist / "robots.txt")
    shutil.copy(PUBLIC_FILES / "sitemap.xml", dist / "sitemap.xml")
    robots = client.get("/robots.txt")
    assert robots.status_code == 200 and robots.headers["content-type"].startswith("text/plain")
    sitemap_lines = [ln.split(":", 1)[1].strip() for ln in robots.text.splitlines() if ln.lower().startswith("sitemap:")]
    assert sitemap_lines == [f"{config.PUBLIC_URL}/sitemap.xml"]
    assert "Disallow: /api/" in robots.text and "Disallow: /jobs/" in robots.text and "Disallow: /logs" in robots.text
    sm = client.get(urlsplit(sitemap_lines[0]).path)
    assert sm.status_code == 200 and sm.headers["content-type"].startswith("application/xml")
    assert ET.fromstring(sm.content).tag.endswith("urlset")


@pytest.mark.skipif(not TOOL_PAGES_TS.is_file(), reason="the frontend sources are missing")
def test_the_backend_knows_every_tool_page_the_frontend_defines():
    paths = re.findall(r"^\s*path:\s*'/([a-z0-9-]+)'", TOOL_PAGES_TS.read_text(encoding="utf-8"), re.M)
    assert paths and set(paths) == set(TOOLS)
    assert all(p in APP_PAGES for p in paths)


def test_every_route_a_build_prerendered_is_a_known_page():
    manifest = PROJECT / "frontend" / "dist" / "frontend" / "prerendered-routes.json"
    if not manifest.is_file():
        pytest.skip("no frontend build")
    routes = json.loads(manifest.read_text(encoding="utf-8")).get("routes", {})
    for route in routes:
        assert is_app_page(route.strip("/")), f"{route} was prerendered but the backend would answer 404"


# ================================================================ one canonical URL per page

@pytest.mark.parametrize("page", INFO_PAGES + TOOLS + [f"jobs/{JOB}"])
def test_a_trailing_slash_redirects_permanently_to_the_slashless_url(dist, client, page):
    r = client.get(f"/{page}/")
    assert r.status_code == 301 and r.headers["location"] == f"/{page}", page
    assert client.head(f"/{page}/").status_code == 301


def test_a_moved_page_redirects_permanently_to_its_new_address(dist, client):
    for path in ("/about", "/about/", "/about//"):
        r = client.get(path)
        assert r.status_code == 301 and r.headers["location"] == "/how-it-works", path
        assert client.head(path).status_code == 301
    assert client.get("/about?ref=x").headers["location"] == "/how-it-works?ref=x"
    assert client.get("/About").status_code == 404 and client.get("/about/x").status_code == 404
    assert not is_app_page("about")  # not a page of its own any more


def test_the_redirect_keeps_the_query_string(dist, client):
    r = client.get("/faq/?utm_source=x&a=b%20c")
    assert r.status_code == 301 and r.headers["location"] == "/faq?utm_source=x&a=b%20c"
    assert client.get("/video-to-text/?x=1").headers["location"] == "/video-to-text?x=1"


def test_the_home_page_has_no_redirect_and_index_html_goes_to_it(dist, client):
    assert client.get("/").status_code == 200
    assert client.get("/?ref=1").status_code == 200
    r = client.get("/index.html")
    assert r.status_code == 301 and r.headers["location"] == "/"
    assert client.get("/index.html?ref=1").headers["location"] == "/?ref=1"
    assert client.head("/index.html").status_code == 301
    r = client.get("/faq/index.html")
    assert r.status_code == 301 and r.headers["location"] == "/faq"
    assert client.get("/nope/index.html").status_code == 404  # only real pages redirect


def test_slashes_are_never_redirected_for_the_api_or_unknown_urls(dist, client):
    for path in ("/api/health/", "/api/jobs/", "/nope/", "/main-ABCD1234.js/", "/robots.txt/", "/jobs/abc/"):
        assert client.get(path).status_code in (404, 405), path


@pytest.mark.parametrize("path", ["//evil.example", "//evil.example/", "///evil.example/", "//evil.example/faq/",
                                  "/\\evil.example/", "//faq/", "//faq"])
def test_no_url_can_turn_the_redirect_into_an_open_redirect(dist, path):
    status, headers, _ = asgi(path)
    assert status == 404 and "location" not in headers


def test_a_double_slash_normalises_to_the_home_page(dist):
    status, headers, _ = asgi("//")
    assert status == 301 and headers["location"] == "/"
    status, headers, _ = asgi("/faq//")
    assert status == 301 and headers["location"] == "/faq"


# ================================================================ HEAD

HEAD_URLS = ["/", "/faq", "/privacy", "/video-to-text", f"/jobs/{JOB}", "/logs", "/nope", "/jobs/abc", "/faq/", "/index.html",
             "/robots.txt", "/sitemap.xml", "/main-ABCD1234.js", "/icon-192.png", "/manifest.webmanifest", "/favicon.ico",
             "/favicon.svg", "/3rdpartylicenses.txt"]


@pytest.mark.parametrize("url", HEAD_URLS)
def test_head_answers_like_get_without_a_body(dist, client, url):
    g, h = client.get(url), client.head(url)
    assert h.status_code == g.status_code, url
    assert h.content == b""
    assert dict(h.headers) == dict(g.headers), url
    if g.status_code != 301:
        assert int(h.headers["content-length"]) == len(g.content)


def test_head_works_with_the_prerendered_layout_too(prerendered, client):
    for url in ("/", "/faq", "/privacy", "/nope"):
        g, h = client.get(url), client.head(url)
        assert (h.status_code, dict(h.headers), h.content) == (g.status_code, dict(g.headers), b""), url


def test_head_on_the_api(dist, client):
    assert client.head("/api/health").status_code == 200  # uptime monitors
    assert client.head("/api/stats").status_code == 200
    r = client.head("/api/jobs")  # a real endpoint without HEAD stays "method not allowed"
    assert r.status_code == 405 and "GET" in r.headers["allow"]
    assert client.head("/api/nonexistent").status_code == 404


# ================================================================ headers for crawlers and caches

def test_the_api_is_never_indexed_not_even_its_errors(dist, client):
    jid = client.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc",
                      headers={"content-type": "application/octet-stream"}).json()["id"]
    responses = [client.get("/api/health"), client.head("/api/health"), client.get("/api/stats"), client.get("/api/models"),
                 client.get("/api/jobs"), client.get(f"/api/jobs/{jid}"), client.get(f"/api/jobs/{'0' * 32}"),   # 404
                 client.get("/api/nonexistent"), client.get("/api"), client.head("/api/jobs"),                    # 404, 405
                 client.post("/api/health"), client.put("/api/stats"),                                           # 405
                 client.delete("/api/session", headers={"origin": "https://evil.example"}),                       # 403
                 client.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc")]                          # 415
    assert {r.status_code for r in responses} >= {200, 403, 404, 405, 415}
    for r in responses:
        assert r.headers["x-robots-tag"] == "noindex, nofollow", (r.request.method, r.request.url.path, r.status_code)


def test_private_pages_are_never_indexed_but_public_ones_are(dist, client):
    for path in ("/logs", "/logs/", f"/jobs/{JOB}", "/jobs/abc"):
        assert client.get(path).headers["x-robots-tag"] == "noindex, nofollow", path
    for path in ["/", "/faq", "/privacy", "/terms", "/nope", "/robots.txt", "/sitemap.xml", "/main-ABCD1234.js",
                 "/icon-192.png"] + [f"/{t}" for t in TOOLS]:
        assert "x-robots-tag" not in client.get(path).headers, path


def test_caching_policy_by_kind_of_file(dist, client):
    immutable = "public, max-age=31536000, immutable"
    for name in ("main-ABCD1234.js", "chunk-3UYS3T4L.js", "styles-ABCD1234.css"):
        assert client.get("/" + name).headers["cache-control"] == immutable, name
    for name in ("icon-192.png", "icon-512.png", "og-image.png", "apple-touch-icon.png", "favicon.ico", "favicon.svg",
                 "manifest.webmanifest"):
        assert client.get("/" + name).headers["cache-control"] == "public, max-age=86400", name
    for name in ("robots.txt", "sitemap.xml"):
        assert client.get("/" + name).headers["cache-control"] == "public, max-age=3600", name
    for path in ("/", "/faq", f"/jobs/{JOB}", "/logs", "/nope", "/video-to-text", "/3rdpartylicenses.txt", "/unhashed.js"):
        assert client.get(path).headers["cache-control"] == "no-cache", path  # always revalidated
    # the API keeps its own rules
    assert "no-store" in client.get("/api/health").headers["cache-control"]
    assert client.get("/api/stats").headers["cache-control"] == "public, max-age=30"
    assert "no-store" in client.get("/api/models").headers["cache-control"]


def test_files_are_conditional_and_have_the_right_media_types(dist, client):
    r = client.get("/main-ABCD1234.js")
    assert r.headers["etag"] and r.headers["last-modified"]
    assert client.get("/manifest.webmanifest").headers["content-type"].startswith("application/manifest+json")
    assert client.get("/sitemap.xml").headers["content-type"].startswith("application/xml")
    assert client.get("/robots.txt").headers["content-type"].startswith("text/plain")


def test_security_headers_are_on_pages_files_redirects_and_404s(dist, client):
    for path in ("/", "/faq", "/nope", "/faq/", "/index.html", "/robots.txt", "/main-ABCD1234.js", "/api/health", "/api/nope"):
        h = client.get(path).headers
        assert h["x-content-type-options"] == "nosniff", path
        assert h["referrer-policy"] == "strict-origin-when-cross-origin", path
        assert h["x-frame-options"] == "DENY", path
        assert "microphone=(self)" in h["permissions-policy"] and "camera=()" in h["permissions-policy"], path
        assert "content-security-policy" not in h  # deliberately none: Angular's inline styles would break


# ================================================================ prerendered builds

def test_prerendered_pages_are_served_before_the_client_shell(prerendered, client):
    assert "PRERENDERED-HOME" in client.get("/").text
    assert "PRERENDERED-FAQ" in client.get("/faq").text
    assert "PRERENDERED-VIDEO-TO-TEXT" in client.get("/video-to-text").text
    for path in ("/", "/faq", "/video-to-text"):
        r = client.get(path)
        assert r.status_code == 200 and r.headers["cache-control"] == "no-cache", path


def test_known_pages_without_a_prerendered_file_get_the_client_only_shell(prerendered, client):
    for path in ("/privacy", "/terms", "/how-it-works", "/audio-to-text", "/logs", f"/jobs/{JOB}"):
        r = client.get(path)
        assert r.status_code == 200 and "CSR-ONLY-SHELL" in r.text, path
        assert "PRERENDERED" not in r.text


def test_the_404_page_comes_from_the_client_only_shell(prerendered, client):
    for path in ("/nope", "/jobs/abc", "/faq/nope", "/nope/"):
        r = client.get(path)
        assert r.status_code == 404 and "CSR-ONLY-SHELL" in r.text and "PRERENDERED" not in r.text, path


def test_the_client_only_shell_and_prerendered_files_have_one_url_each(prerendered, client):
    r = client.get("/index.csr.html")
    assert r.status_code == 404  # not a page of its own
    r = client.get("/faq/index.html")
    assert r.status_code == 301 and r.headers["location"] == "/faq"
    r = client.get("/faq/")
    assert r.status_code == 301 and r.headers["location"] == "/faq"
    assert client.get("/video-to-text/index.html").headers["location"] == "/video-to-text"


def test_a_prerendered_page_the_list_does_not_know_is_still_served(prerendered, client):
    write(prerendered / "extra" / "index.html", SHELL.replace("CSR-SHELL", "PRERENDERED-EXTRA"))
    assert "PRERENDERED-EXTRA" in client.get("/extra").text
    assert client.get("/extra/").status_code == 404  # no second URL for it
    assert client.get("/extra/index.html").status_code == 404


def test_without_a_client_only_shell_index_html_serves_everything(dist, client):
    assert not (dist / "index.csr.html").exists()
    assert "CSR-SHELL" in client.get("/privacy").text and "CSR-SHELL" in client.get("/nope").text


def test_an_exact_static_file_wins_over_everything(prerendered, client):
    write(prerendered / "robots.txt", "robots!")
    assert client.get("/robots.txt").text == "robots!"
    write(prerendered / "static-page.html", "plain file")
    assert client.get("/static-page.html").text == "plain file"


# ================================================================ path traversal

TRAVERSAL = ["/../secret.txt", "/../../secret.txt", "/./../secret.txt", "/faq/../../secret.txt", "/assets/../../secret.txt",
             "/..\\secret.txt", "/..\\..\\secret.txt", "/%2e%2e/secret.txt", "/..%2fsecret.txt", "/%2e%2e%2fsecret.txt",
             "/....//secret.txt", "/..;/secret.txt", "/../browser/../secret.txt", "/../site/secret.txt",
             "/faq/..%2f..%2fsecret.txt", "/../", "/..", "/browser/../../secret.txt"]


@pytest.mark.parametrize("path", TRAVERSAL)
def test_path_traversal_never_leaves_the_build_folder(dist, path):
    status, _, body = asgi(path)  # exactly as given: a server decodes %2e and %2f before it reaches the app
    assert SECRET.encode() not in body, path
    assert status == 404, path


@pytest.mark.parametrize("path", ["/..%2fsecret.txt", "/%2e%2e/secret.txt", "/%2e%2e%2fsecret.txt", "/../secret.txt",
                                  "/faq/..%2f..%2fsecret.txt"])
def test_path_traversal_through_the_http_client(dist, client, path):
    r = client.get(path)  # the client may normalise the URL first; either way nothing outside the build is served
    assert SECRET not in r.text and r.status_code == 404, path


def test_an_absolute_path_cannot_replace_the_build_folder(dist, tmp_path):
    outside = "/" + str(tmp_path / "secret.txt").replace("\\", "/")  # path param becomes an absolute path
    for path in (outside, "/" + outside, "/etc/passwd", "//etc/passwd", "/C:/Windows/win.ini", "//C:/Windows/win.ini"):
        status, _, body = asgi(path)
        assert status == 404 and SECRET.encode() not in body, path


def test_an_embedded_nul_byte_is_a_clean_404(dist):
    for path in ("/faq\x00.txt", "/\x00", "/main-ABCD1234.js\x00"):
        status, _, body = asgi(path)
        assert status == 404, path


def test_a_symlink_pointing_outside_is_not_followed(dist):
    link = dist / "leak.txt"
    try:
        os.symlink(dist.parent.parent / "secret.txt", link)
    except (OSError, NotImplementedError, AttributeError):
        pytest.skip("cannot create symlinks here")
    status, _, body = asgi("/leak.txt")
    assert status == 404 and SECRET.encode() not in body


def test_a_folder_link_pointing_outside_is_not_followed(dist):
    """A symlink (or, on Windows without the privilege, a junction) to a folder outside the build."""
    link, target = dist / "linked-dir", dist.parent  # target holds secret.txt
    try:
        os.symlink(target, link, target_is_directory=True)
    except (OSError, NotImplementedError, AttributeError):
        if os.name != "nt":
            pytest.skip("cannot create symlinks here")
        made = subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(target)], capture_output=True)
        if made.returncode != 0:
            pytest.skip("cannot create a junction here")
    assert (link / "secret.txt").is_file()  # the link works: it really would expose the file
    status, _, body = asgi("/linked-dir/secret.txt")
    assert status == 404 and SECRET.encode() not in body


def test_dot_segments_never_reach_a_real_page_either(prerendered):
    """Even a path that resolves to a page INSIDE the build is refused: one URL per page."""
    for path in ("/../browser/faq", "/./faq", "/faq/.", "/faq/../faq", "/../browser/index.html", "/x/../faq"):
        status, _, body = asgi(path)
        assert status == 404 and b"PRERENDERED" not in body, path
