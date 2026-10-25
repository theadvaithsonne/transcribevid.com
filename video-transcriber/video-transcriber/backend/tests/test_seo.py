"""Search engines and speed: site-verification tags for Google / Bing, files dropped in for their HTML-file methods, the
IndexNow key, "304 Not Modified" for unchanged files and pages, and gzip for text (never for the live event streams).
Like test_spa.py, every test runs against a throw-away fake build (config.STATIC_DIR points at it)."""
import asyncio
import gzip
import re
import time
import xml.etree.ElementTree as ET
from datetime import date

import pytest
from fastapi.testclient import TestClient
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse, StreamingResponse
from starlette.routing import Route

from app import config, engine, main
from app.main import Compress, accepts_gzip

PUBLIC_FILES = config.PROJECT_DIR / "frontend" / "public"
HEAD_HTML = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{}</title></head><body><app-root>{}</app-root>'
# a page as big as a real prerendered one (> 1 KB, so it is worth compressing)
FILLER = "<p>" + "Free video to text transcription with timestamps. " * 60 + "</p>"
GOOGLE_FILE = "google1234567890abcdef.html"
GOOGLE_FILE_BODY = "google-site-verification: google1234567890abcdef.html"
IDENTITY = {"accept-encoding": "identity"}
GZIP = {"accept-encoding": "gzip"}


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(text) if isinstance(text, bytes) else path.write_text(text, encoding="utf-8")


@pytest.fixture()
def site(tmp_path, monkeypatch):
    """A prerendered build: /, /faq and /video-to-text as files, everything else from index.csr.html."""
    root = tmp_path / "browser"
    write(root / "index.html", HEAD_HTML.format("Home", "HOME" + FILLER))
    write(root / "faq" / "index.html", HEAD_HTML.format("FAQ", "FAQ" + FILLER))
    write(root / "video-to-text" / "index.html", HEAD_HTML.format("Video", "VIDEO" + FILLER))
    write(root / "index.csr.html", HEAD_HTML.format("App", "SHELL" + FILLER))
    write(root / "main-ABCD1234.js", "console.log('TranscribeVid');\n" * 200)
    write(root / "small-ABCD1234.css", "a{color:red}")
    write(root / "icon-192.png", b"\x89PNG" + b"\x00" * 4000)
    write(root / "sitemap.xml", '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>')
    write(root / "notes.txt", "0123456789\n" * 300)
    monkeypatch.setattr(config, "STATIC_DIR", root)
    monkeypatch.setattr(config, "GOOGLE_SITE_VERIFICATION", ())
    monkeypatch.setattr(config, "BING_SITE_VERIFICATION", ())
    monkeypatch.setattr(config, "INDEXNOW_KEY", None)
    monkeypatch.setattr(config, "COMPRESS", True)
    return root


@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setattr(engine, "transcribe", lambda *a, **k: None)
    with TestClient(main.app, follow_redirects=False) as c:
        yield c


def raw(path, method="GET", headers=None):
    """One request straight into the ASGI app; the body exactly as sent (still compressed). (status, headers, body)."""
    out = []

    async def run():
        hdrs = [(b"host", b"testserver")] + [(k.encode(), v.encode()) for k, v in (headers or {}).items()]
        scope = {"type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1", "method": method, "scheme": "http",
                 "path": path, "raw_path": path.encode(), "root_path": "", "query_string": b"", "headers": hdrs,
                 "client": ("127.0.0.1", 1234), "server": ("testserver", 80)}
        sent = []

        async def receive():
            if not sent:
                sent.append(1)
                return {"type": "http.request", "body": b"", "more_body": False}
            await asyncio.Event().wait()

        async def send(message):
            out.append(message)
        await main.app(scope, receive, send)
    asyncio.run(run())
    start = next(m for m in out if m["type"] == "http.response.start")
    body = b"".join(m.get("body", b"") for m in out if m["type"] == "http.response.body")
    return start["status"], {k.decode().lower(): v.decode("latin-1") for k, v in start["headers"]}, body


# ================================================================ site verification tags (Search Console, Bing)

def test_no_verification_tags_unless_configured(site, client):
    for path in ("/", "/faq", "/privacy", "/nope"):
        assert "site-verification" not in client.get(path).text and "msvalidate" not in client.get(path).text, path


def test_verification_tags_go_right_after_head_in_every_page(site, client, monkeypatch):
    monkeypatch.setattr(config, "GOOGLE_SITE_VERIFICATION", ("AbC-123_xyz", "second-owner"))
    monkeypatch.setattr(config, "BING_SITE_VERIFICATION", ("0123456789ABCDEF0123456789ABCDEF",))
    tags = ('<meta name="google-site-verification" content="AbC-123_xyz">'
            '<meta name="google-site-verification" content="second-owner">'
            '<meta name="msvalidate.01" content="0123456789ABCDEF0123456789ABCDEF">')
    for path, status, marker in (("/", 200, "HOME"), ("/faq", 200, "FAQ"), ("/video-to-text", 200, "VIDEO"),
                                 ("/privacy", 200, "SHELL"), ("/jobs/" + "a" * 32, 200, "SHELL"), ("/nope", 404, "SHELL")):
        r = client.get(path)
        assert r.status_code == status and marker in r.text, path
        assert r.text.startswith('<!doctype html><html lang="en"><head>' + tags + '<meta charset="utf-8">'), path
        assert r.text.count("google-site-verification") == 2 and r.text.count("msvalidate.01") == 1, path
        assert r.headers["content-type"].startswith("text/html") and r.headers["cache-control"] == "no-cache", path
        h = client.head(path, headers=IDENTITY)
        assert h.status_code == status and h.content == b"", path
        assert int(h.headers["content-length"]) == len(client.get(path, headers=IDENTITY).content), path


def test_verification_tags_are_escaped_and_skip_a_page_without_head(site, client, monkeypatch):
    monkeypatch.setattr(config, "GOOGLE_SITE_VERIFICATION", ('x"><script>alert(1)</script>',))  # config never allows this
    r = client.get("/")
    assert "<script>alert(1)" not in r.text
    assert 'content="x&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"' in r.text
    write(site / "index.csr.html", "<!doctype html><html><body><app-root>NO-HEAD</app-root></body></html>")
    r = client.get("/privacy")
    assert r.status_code == 200 and "NO-HEAD" in r.text and "verification" not in r.text


def test_a_head_tag_with_attributes_is_found_and_headers_is_not_mistaken_for_it(site, client, monkeypatch):
    monkeypatch.setattr(config, "BING_SITE_VERIFICATION", ("CODE",))
    write(site / "index.html", '<!doctype html><html><HEAD data-x="1"><title>t</title></HEAD><body>' + FILLER)
    assert client.get("/").text.startswith('<!doctype html><html><HEAD data-x="1"><meta name="msvalidate.01" content="CODE">')
    write(site / "index.html", "<!doctype html><html><headers></headers><head><title>t</title></head><body>" + FILLER)
    assert client.get("/").text.startswith('<!doctype html><html><headers></headers><head><meta name="msvalidate.01"')


def test_the_etag_changes_with_the_verification_tags(site, client, monkeypatch):
    before = client.get("/", headers=IDENTITY).headers["etag"]
    monkeypatch.setattr(config, "GOOGLE_SITE_VERIFICATION", ("code",))
    after = client.get("/", headers=IDENTITY).headers["etag"]
    assert before != after
    assert client.get("/", headers={"if-none-match": before, **IDENTITY}).status_code == 200  # the old copy is stale
    assert client.get("/", headers={"if-none-match": after, **IDENTITY}).status_code == 304


def test_a_crawler_that_only_sends_if_modified_since_gets_the_page_with_new_tags(site, client, monkeypatch):
    since = client.get("/", headers=IDENTITY).headers["last-modified"]
    assert client.get("/", headers={"if-modified-since": since}).status_code == 304
    monkeypatch.setattr(config, "GOOGLE_SITE_VERIFICATION", ("code",))
    monkeypatch.setattr(main, "_STARTED", time.time() + 60)  # settings change only with a restart, after the build
    r = client.get("/", headers={"if-modified-since": since})
    assert r.status_code == 200 and "google-site-verification" in r.text
    assert client.get("/", headers={"if-modified-since": r.headers["last-modified"]}).status_code == 304


def test_verification_settings_accept_only_plain_codes(monkeypatch):
    monkeypatch.setenv("VT_TEST_CODES", ' good_one-1 , ,bad"code, <meta name="x">, also.good:2+/= ')
    good, bad = config._codes("VT_TEST_CODES")
    assert good == ("good_one-1", "also.good:2+/=") and bad == ('bad"code', '<meta name="x">')
    monkeypatch.delenv("VT_TEST_CODES")
    assert config._codes("VT_TEST_CODES") == ((), ())


# ================================================================ files for the "HTML file" methods, IndexNow

def test_a_google_verification_file_is_served_exactly_as_dropped_in(site, client, monkeypatch):
    write(site / GOOGLE_FILE, GOOGLE_FILE_BODY)
    write(site / "BingSiteAuth.xml", '<?xml version="1.0"?><users><user>0123ABCD</user></users>')
    monkeypatch.setattr(config, "GOOGLE_SITE_VERIFICATION", ("code",))  # the tags never go into such a file
    r = client.get("/" + GOOGLE_FILE)
    assert r.status_code == 200 and r.content == GOOGLE_FILE_BODY.encode()
    assert r.headers["content-type"].startswith("text/html") and "x-robots-tag" not in r.headers
    assert client.head("/" + GOOGLE_FILE).status_code == 200
    r = client.get("/BingSiteAuth.xml")
    assert r.status_code == 200 and r.headers["content-type"].startswith("application/xml") and b"0123ABCD" in r.content
    assert client.get("/google0000000000000000.html").status_code == 404  # no such file: not the app shell with 200


def test_the_indexnow_key_file(site, client, monkeypatch):
    key = "a1b2c3d4e5f6a7b8c9d0"
    assert client.get(f"/{key}.txt").status_code == 404
    monkeypatch.setattr(config, "INDEXNOW_KEY", key)
    r = client.get(f"/{key}.txt")
    assert r.status_code == 200 and r.text == key and r.headers["content-type"].startswith("text/plain")
    h = client.head(f"/{key}.txt")
    assert h.status_code == 200 and h.content == b"" and h.headers["content-length"] == str(len(key))
    assert client.get("/other-key-1234.txt").status_code == 404
    assert client.get(f"/{key}.txt/").status_code == 404 and client.get(f"/x/{key}.txt").status_code == 404


def test_the_indexnow_setting_rejects_bad_keys():
    for value, expected in (("abcd1234", "abcd1234"), (" abcd1234 ", "abcd1234"), ("short", None), ("", None), (None, None),
                            ("has space 12345", None), ("../../etc/x", None), ("a" * 129, None), ("a" * 128, "a" * 128),
                            ("Key-With-Dashes-42", "Key-With-Dashes-42"), ("key.with.dots", None)):
        assert config._indexnow_key(value) == expected, value


# ================================================================ 304 Not Modified

@pytest.mark.parametrize("path", ["/", "/faq", "/privacy", "/main-ABCD1234.js", "/icon-192.png", "/sitemap.xml"])
def test_an_unchanged_file_or_page_is_answered_with_304(site, client, path):
    r = client.get(path, headers=IDENTITY)
    etag = r.headers["etag"]
    for inm in (etag, "W/" + etag, f'"nope", {etag}', "*"):
        n = client.get(path, headers={"if-none-match": inm})
        assert n.status_code == 304 and n.content == b"", (path, inm)
        assert n.headers["etag"] == etag and n.headers["cache-control"] == r.headers["cache-control"], path
        assert "content-encoding" not in n.headers
    assert client.head(path, headers={"if-none-match": etag}).status_code == 304
    assert client.get(path, headers={"if-none-match": '"something-else"'}).status_code == 200
    since = r.headers["last-modified"]
    assert client.get(path, headers={"if-modified-since": since}).status_code == 304
    assert client.get(path, headers={"if-modified-since": "Mon, 01 Jan 2001 00:00:00 GMT"}).status_code == 200
    assert client.get(path, headers={"if-modified-since": "not a date"}).status_code == 200
    # If-None-Match wins over If-Modified-Since
    assert client.get(path, headers={"if-none-match": '"x"', "if-modified-since": since}).status_code == 200


def test_a_changed_file_is_sent_again(site, client):
    etag = client.get("/faq", headers=IDENTITY).headers["etag"]
    write(site / "faq" / "index.html", HEAD_HTML.format("FAQ", "NEW FAQ" + FILLER))
    r = client.get("/faq", headers={"if-none-match": etag})
    assert r.status_code == 200 and "NEW FAQ" in r.text


def test_the_404_page_and_redirects_are_never_304(site, client):
    etag = client.get("/nope", headers=IDENTITY).headers["etag"]
    assert client.get("/nope", headers={"if-none-match": etag}).status_code == 404
    assert client.get("/nope", headers={"if-none-match": "*"}).status_code == 404
    assert client.get("/faq/", headers={"if-none-match": "*"}).status_code == 301


# ================================================================ gzip

@pytest.mark.parametrize("header, ok", [
    ("gzip", True), ("gzip, deflate, br, zstd", True), ("br;q=1.0, gzip;q=0.8, *;q=0.1", True), ("GZIP", True),
    ("x-gzip", True), ("*", True), ("deflate, *;q=0.5", True), ("", False), ("identity", False), ("br, zstd", False),
    ("gzip;q=0", False), ("gzip;q=0.0, *", False), ("*;q=0", False), ("gzip;q=abc", False), ("gzip ; q=0.5", True)])
def test_accept_encoding_is_parsed_with_q_values(header, ok):
    assert accepts_gzip(header) is ok


@pytest.mark.parametrize("path", ["/", "/faq", "/privacy", "/nope", "/main-ABCD1234.js", "/notes.txt"])
def test_text_is_gzipped_for_browsers_that_accept_it(site, client, path):
    plain = client.get(path, headers=IDENTITY)
    status, headers, body = raw(path, headers={"accept-encoding": "gzip, deflate, br"})
    assert status == plain.status_code and headers["content-encoding"] == "gzip", path
    assert gzip.decompress(body) == plain.content and len(body) < len(plain.content) / 3, path
    assert int(headers["content-length"]) == len(body), path
    assert "accept-encoding" in headers["vary"].lower() and "origin" in headers["vary"].lower(), path
    assert headers["etag"] == "W/" + plain.headers["etag"], path  # same content, other bytes: a weak validator
    assert "content-encoding" not in plain.headers and "accept-encoding" in plain.headers["vary"].lower(), path
    assert headers["cache-control"] == plain.headers["cache-control"], path


def test_the_http_client_view_of_a_gzipped_page_is_unchanged(site, client):
    r = client.get("/faq", headers=GZIP)
    assert r.headers["content-encoding"] == "gzip" and "FAQ" in r.text and r.text.startswith("<!doctype html>")


def test_a_weak_etag_from_a_gzipped_answer_still_gives_304(site, client):
    _, headers, _ = raw("/faq", headers=GZIP)
    assert headers["etag"].startswith("W/")
    assert client.get("/faq", headers={"if-none-match": headers["etag"], **GZIP}).status_code == 304


def test_head_announces_the_same_encoding_as_get(site, client):
    _, g, _ = raw("/main-ABCD1234.js", headers=GZIP)
    status, h, body = raw("/main-ABCD1234.js", "HEAD", headers=GZIP)
    assert status == 200 and body == b""
    assert h["content-encoding"] == "gzip" and h["etag"] == g["etag"] and h["vary"] == g["vary"]
    assert "content-length" not in h  # only known once the body is compressed


@pytest.mark.parametrize("path", ["/small-ABCD1234.css", "/icon-192.png"])
def test_small_answers_and_images_are_sent_as_they_are(site, client, path):
    status, headers, body = raw(path, headers=GZIP)
    assert status == 200 and "content-encoding" not in headers and body == (site / path.lstrip("/")).read_bytes()


def test_a_range_request_is_never_compressed(site, client):
    status, headers, body = raw("/notes.txt", headers={"range": "bytes=0-9", **GZIP})
    assert status == 206 and body == b"0123456789" and "content-encoding" not in headers


def test_compression_can_be_turned_off(site, client, monkeypatch):
    monkeypatch.setattr(config, "COMPRESS", False)
    _, headers, body = raw("/faq", headers=GZIP)
    assert "content-encoding" not in headers and body.startswith(b"<!doctype html>")


def test_the_api_is_gzipped_too_but_never_kept_in_memory(site, client, monkeypatch):
    calls = []
    real = main._gzip
    monkeypatch.setattr(main, "_gzip", lambda data: calls.append(len(data)) or real(data))
    status, headers, body = raw("/api/languages", headers=GZIP)
    assert status == 200 and headers["content-encoding"] == "gzip" and gzip.decompress(body).startswith(b"[")
    assert headers["cache-control"] == "no-store"
    raw("/api/languages", headers=GZIP)
    assert len(calls) == 2  # compressed again: visitors' data is never cached
    # ... while the build's files are compressed once (unique content: the cache lives as long as the app)
    write(site / "once-ABCD1234.js", f"/* {time.time_ns()} */ " + "let a = 1; " * 500)
    calls.clear()
    for _ in range(3):
        status, headers, body = raw("/once-ABCD1234.js", headers=GZIP)
        assert status == 200 and headers["content-encoding"] == "gzip" and gzip.decompress(body).startswith(b"/* ")
    assert len(calls) == 1


def test_the_job_event_stream_is_never_compressed(site, client):
    job = client.post("/api/jobs", params={"filename": "x.mp4"}, content=b"abc",
                      headers={"content-type": "application/octet-stream"}).json()
    with client.stream("GET", f"/api/jobs/{job['id']}/events", headers={"accept-encoding": "gzip, deflate, br"}) as r:
        assert r.headers["content-type"].startswith("text/event-stream")
        assert "content-encoding" not in r.headers and "content-length" not in r.headers
        assert "event: end" in "".join(r.iter_text())


def _live_app(release: asyncio.Event):
    async def sse(request):
        async def gen():
            yield "event: one\ndata: {}\n\n" + ": pad\n" * 300  # big enough to be compressed if it were text/plain
            await release.wait()
            yield "event: two\ndata: {}\n\n"
        return StreamingResponse(gen(), media_type="text/event-stream")

    async def text_stream(request):
        async def gen():
            for i in range(50):
                yield f"line {i} " * 40 + "\n"
        return StreamingResponse(gen(), media_type="text/plain")
    return Compress(Starlette(routes=[Route("/sse", sse), Route("/text", text_stream)]))


def test_an_event_stream_passes_through_live_without_buffering(monkeypatch):
    """The first event must reach the browser while the stream is still open (a buffering middleware would hold it)."""
    monkeypatch.setattr(config, "COMPRESS", True)

    async def scenario():
        release, chunks, started = asyncio.Event(), asyncio.Queue(), {}
        app = _live_app(release)
        scope = {"type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1", "method": "GET", "scheme": "http",
                 "path": "/sse", "raw_path": b"/sse", "root_path": "", "query_string": b"",
                 "headers": [(b"host", b"t"), (b"accept-encoding", b"gzip")], "client": ("1.2.3.4", 1), "server": ("t", 80)}

        async def receive():
            await asyncio.Event().wait()

        async def send(message):
            if message["type"] == "http.response.start":
                started.update({k.decode(): v.decode() for k, v in message["headers"]})
            elif message.get("body"):
                chunks.put_nowait(message["body"])
        task = asyncio.create_task(app(scope, receive, send))
        first = await asyncio.wait_for(chunks.get(), 2)  # arrives although the stream has not ended
        assert first.startswith(b"event: one") and not task.done()
        assert "content-encoding" not in started and started["content-type"].startswith("text/event-stream")
        release.set()
        second = await asyncio.wait_for(chunks.get(), 2)
        assert second.startswith(b"event: two")
        await asyncio.wait_for(task, 2)
    asyncio.run(scenario())


def test_a_text_stream_larger_than_the_buffer_is_compressed_as_it_streams(monkeypatch):
    monkeypatch.setattr(config, "COMPRESS", True)
    monkeypatch.setattr(main, "_GZIP_BUFFER", 2000)
    with TestClient(_live_app(asyncio.Event())) as c:
        expected = "".join(f"line {i} " * 40 + "\n" for i in range(50))
        r = c.get("/text", headers=GZIP)
        assert r.headers["content-encoding"] == "gzip" and "content-length" not in r.headers
        assert r.text == expected
        r = c.get("/text", headers=IDENTITY)
        assert "content-encoding" not in r.headers and r.text == expected


def test_media_downloads_are_never_compressed(tmp_path, monkeypatch):
    from fastapi.responses import FileResponse
    monkeypatch.setattr(config, "COMPRESS", True)
    media = tmp_path / "clip.mp4"
    media.write_bytes(b"\x00\x00\x00\x18ftypmp42" + b"\x00" * 5000)
    app = Compress(Starlette(routes=[Route("/m", lambda r: FileResponse(media, media_type="video/mp4"))]))
    with TestClient(app) as c:
        r = c.get("/m", headers=GZIP)
        assert r.status_code == 200 and "content-encoding" not in r.headers and r.content == media.read_bytes()


def test_plain_text_answers_stay_byte_identical_after_decompression(monkeypatch):
    monkeypatch.setattr(config, "COMPRESS", True)
    text = "Ünïcödé subtitles → ok\n" * 200
    app = Compress(Starlette(routes=[Route("/t", lambda r: PlainTextResponse(text))]))
    with TestClient(app) as c:
        r = c.get("/t", headers=GZIP)
        assert r.headers["content-encoding"] == "gzip" and r.text == text


# ================================================================ sitemap / robots / manifest describe the real site

def test_sitemap_dates_are_valid_and_never_in_the_future():
    root = ET.parse(PUBLIC_FILES / "sitemap.xml").getroot()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for url in root.findall("s:url", ns):
        lastmod = url.find("s:lastmod", ns)
        if lastmod is not None:  # optional; when present it must be a real W3C date that has already happened
            assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", lastmod.text.strip())
            assert date.fromisoformat(lastmod.text.strip()) <= date.today()
        for tag in ("changefreq", "priority"):  # ignored by Google: not worth keeping in step
            assert url.find(f"s:{tag}", ns) is None


def test_robots_txt_allows_the_pages_and_their_files():
    text = (PUBLIC_FILES / "robots.txt").read_text(encoding="utf-8")
    disallowed = [ln.split(":", 1)[1].strip() for ln in text.splitlines() if ln.lower().startswith("disallow:")]
    assert sorted(disallowed) == ["/api/", "/jobs/", "/logs"]
    for allowed in ("/", "/faq", "/video-to-text", "/main-ABCD1234.js", "/styles-ABCD1234.css", "/og-image.png",
                    "/favicon.ico", "/sitemap.xml", "/" + GOOGLE_FILE):
        assert not any(allowed.startswith(d) for d in disallowed), allowed
    assert "Allow: /" in text.splitlines() and "Sitemap: https://transcribevid.com/sitemap.xml" in text.splitlines()


def test_the_manifest_matches_the_light_theme_and_lists_real_icons():
    import json
    m = json.loads((PUBLIC_FILES / "manifest.webmanifest").read_text(encoding="utf-8"))
    assert m["background_color"].lower() == "#fff7ed" and m["theme_color"].lower() == "#fff7ed"
    assert m["start_url"] == "/" and m["scope"] == "/" and m["name"] == "TranscribeVid"
    for icon in m["icons"]:
        assert (PUBLIC_FILES / icon["src"].lstrip("/")).is_file(), icon["src"]


def test_favicon_files_google_can_use_exist():
    """Google shows a square favicon whose size is a multiple of 48 px (or an SVG): icon-192.png / favicon.svg."""
    head = (config.PROJECT_DIR / "frontend" / "src" / "index.html").read_text(encoding="utf-8")
    for href in re.findall(r'<link rel="(?:icon|apple-touch-icon)" href="([^"]+)"', head):
        assert (PUBLIC_FILES / href).is_file(), href
    png = (PUBLIC_FILES / "icon-192.png").read_bytes()
    assert png[:8] == b"\x89PNG\r\n\x1a\n" and int.from_bytes(png[16:20], "big") == int.from_bytes(png[20:24], "big") == 192
    ico = (PUBLIC_FILES / "favicon.ico").read_bytes()
    assert ico[:4] == b"\x00\x00\x01\x00"
    sizes = {ico[6 + 16 * i] or 256 for i in range(int.from_bytes(ico[4:6], "little"))}
    assert 48 in sizes, sizes
    assert (PUBLIC_FILES / "og-image.png").read_bytes()[16:24] == (1200).to_bytes(4, "big") + (630).to_bytes(4, "big")


def test_adsense_meta_tag_and_ads_txt_name_the_same_publisher():
    """Google verifies site ownership from either one, so they must never drift apart. The ad script itself stays out of
    index.html: where (and whether) ads load is decided in the app, frontend/src/app/core/ads.config.ts."""
    head = (config.PROJECT_DIR / "frontend" / "src" / "index.html").read_text(encoding="utf-8")
    tags = re.findall(r'<meta name="google-adsense-account" content="ca-(pub-\d{16})">', head)
    assert len(tags) == 1, tags
    ads = (PUBLIC_FILES / "ads.txt").read_text(encoding="utf-8")
    assert re.search(rf"^google\.com,\s*{tags[0]},\s*DIRECT,\s*f08c47fec0942fa0\s*$", ads, re.M), ads
    assert "adsbygoogle" not in head and "googlesyndication" not in head


def test_startup_reports_ignored_settings_without_echoing_them(monkeypatch):
    from app.logbuffer import BUFFER
    monkeypatch.setattr(config, "BAD_VERIFICATION_CODES", ('bad"<x>',))
    monkeypatch.setattr(config, "BAD_INDEXNOW_KEY", True)
    monkeypatch.setattr(engine, "transcribe", lambda *a, **k: None)
    after = BUFFER.last_seq
    with TestClient(main.app):
        pass
    text = " | ".join(e["message"] for e in BUFFER.query(after=after, level="WARNING")[0])
    assert "ignored 1 site verification code" in text and "ignored VT_INDEXNOW_KEY" in text
    assert 'bad"<x>' not in text
