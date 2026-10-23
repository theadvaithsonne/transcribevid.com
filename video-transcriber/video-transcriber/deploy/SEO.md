# Get TranscribeVid on Google: owner checklist

Plain-English steps for you, the owner. The website side is already done: every page has its own title, description and
address, there is a sitemap and a robots.txt, pages are delivered as ready-made HTML that search engines can read without
running JavaScript, and there are six pages written for what people search for (video to text, audio to text, MP4 to
text, MP3 to text, SRT subtitle generator, voice recording to text).

**Be realistic.** Nobody can promise "number 1 on Google". Google ranks pages that (1) it can open and read, (2) really
help the person searching and (3) other websites link to. The site covers (1) and (2). Number 3 takes your time and
effort, over months. Searches for the name ("TranscribeVid") usually find you within days or a few weeks. Big phrases such
as "video to text" are held by companies with years of links; aim first for longer phrases ("mp4 to text free no login").

---

## The checklist

1. **Put the site online** (`deploy/README.md`). Then check, in any browser:
   - `https://transcribevid.com` opens with the padlock, and `http://transcribevid.com` and
     `https://www.transcribevid.com` both jump to it.
   - `https://transcribevid.com/robots.txt` and `https://transcribevid.com/sitemap.xml` show text, not the website.
   - `https://transcribevid.com/video-to-text` opens the page; `https://transcribevid.com/no-such-page` shows "Page not found".

2. **Prove to Google that the site is yours** in Google Search Console (free): https://search.google.com/search-console.
   Choose ONE way:
   - **Recommended: DNS record.** Add a *Domain* property `transcribevid.com`. Google shows a line starting with
     `google-site-verification=`. Add it as a **TXT record** in the DNS settings where you bought the domain, wait a few
     minutes, press *Verify*. It covers http, https and www at once and needs no change to the website.
   - **HTML tag** (if you cannot edit DNS): add a *URL prefix* property `https://transcribevid.com/`, pick *HTML tag*,
     copy only the code between the quotes of `content="..."` and put it in `deploy/.env` as
     `VT_GOOGLE_SITE_VERIFICATION=that-code`. Restart the app (`docker compose up -d --force-recreate app`), then press
     *Verify*. Keep the setting afterwards: Google checks again from time to time.
   - **HTML file**: download Google's `google....html` file, copy it into `frontend/public/` and deploy again. The site
     serves it exactly as it is. Keep the file.

3. **Submit the sitemap.** In Search Console open *Sitemaps*, type `sitemap.xml`, press *Submit*. Within a day or two it
   should say *Success* with 11 pages discovered.

4. **Ask Google to look now.** In Search Console use the search bar at the top (*URL inspection*) for each address below,
   then press *Request indexing* (about 10 a day are allowed):
   `https://transcribevid.com/`, `/video-to-text`, `/audio-to-text`, `/mp4-to-text`, `/mp3-to-text`,
   `/srt-subtitle-generator`, `/voice-recording-to-text`, then `/how-it-works` and `/faq` the next day.
   *Test live URL* then *View tested page* shows the page the way Google sees it: the text and headings should all be there.

5. **Bing too (10 minutes).** At https://www.bing.com/webmasters sign in and choose *Import from Google Search Console*:
   it copies the site and the sitemap with no second verification. Bing also feeds DuckDuckGo, Ecosia, Yahoo and
   several AI assistants. (If you prefer its own check: `VT_BING_SITE_VERIFICATION=code` works like step 2, or put
   Bing's `BingSiteAuth.xml` into `frontend/public/`.)
   Optional, after every deploy that adds or changes pages: tell Bing and Yandex at once with IndexNow. Make a key once
   (`openssl rand -hex 16`), put it in `deploy/.env` as `VT_INDEXNOW_KEY=...`, restart the app, then run
   `node scripts/indexnow.mjs --key <the key>`. Google does not use IndexNow; step 4 is its equivalent.

6. **Test the speed once.** At https://pagespeed.web.dev test `https://transcribevid.com/` and `/video-to-text` on mobile.
   Aim for green. The three numbers Google cares about: loading (LCP) under 2.5 s, reaction to taps (INP) under 200 ms,
   layout jumping (CLS) under 0.1. At https://search.google.com/test/rich-results a page should show no errors
   (WebApplication, Breadcrumb, FAQ). There are no star ratings anywhere, on purpose: never add made-up ones.

7. **Wait, then check monthly (15 minutes).** What to look at in Search Console:
   - **Pages** (page indexing): the 11 pages should move to *Indexed* over 1-4 weeks. Normal and nothing to fix:
     *Page with redirect* (http and www addresses), *Not found (404)* (mistyped addresses), *Excluded by 'noindex' tag*
     and *Blocked by robots.txt* (private transcript pages `/jobs/...`, `/logs`, `/api/...`). Worth attention:
     *Crawled - currently not indexed* or *Discovered - currently not indexed* for one of the 11 pages. On a new site
     this usually clears by itself once other sites link to you; if it stays for 2 months, tell the developer which page.
     *Duplicate, Google chose different canonical* or *Server error (5xx)*: tell the developer.
   - **Core Web Vitals**: says *Not enough usage data* until enough Chrome users have visited (often months on a new
     site). That is normal. Anything marked *Poor* goes to the developer.
   - **Performance**: which searches show the site and which pages get clicks. Write the numbers down each month.
   - Search Google for `TranscribeVid` and `site:transcribevid.com`: the home page first, the main pages listed.

---

## How long it takes

| When | Realistic result |
|---|---|
| Day 1 | Site verified, sitemap submitted. |
| Days 2-14 | Home page indexed; searching `TranscribeVid` starts to find it. |
| Weeks 2-8 | The keyword pages indexed. Few impressions; a handful of clicks on specific phrases. |
| Months 2-4 | With some real links (below), long phrases such as "mp4 to text free no login" can reach page 1-3. |
| Months 6-12+ | Competitive phrases ("video to text", "audio to text") need strong authority. Possible, not promised. |

Changes take weeks to show. Judge progress monthly, not daily.

---

## First links from other websites (free; this is what moves rankings)

Do a few each week. Fill every profile properly (name `TranscribeVid`, one word, the same everywhere; link to
`https://transcribevid.com`; short honest description: free, no login, timestamps, SRT/VTT/TXT/PDF, 50+ languages).

1. **AlternativeTo** (alternativeto.net): add TranscribeVid as a free alternative to Otter.ai, Rev, Descript, Happy Scribe,
   Sonix, Notta and TurboScribe. People really browse these pages.
2. **SaaSHub** (saashub.com): free listing, with its own "alternatives" pages.
3. **Product Hunt** (producthunt.com): one launch day. Prepare a tagline, 3 screenshots and a 30-second video, and be
   there all day to answer comments.
4. **Hacker News "Show HN"** (news.ycombinator.com/showhn.html): fits well because it is free and needs no sign-up.
   Write plainly what it does and how; answer questions; never ask friends for upvotes.
5. **Indie Hackers** (indiehackers.com): a product page plus an honest "how I built it" post.
6. **BetaList** (betalist.com): free submission (there is a waiting list; the paid "skip the line" is not needed).
7. **Reddit, with care.** r/SideProject and r/alphaandbetausers allow sharing your own project. In r/podcasting,
   r/youtubers, r/videoediting, r/Transcription, r/college or r/Journalism, only answer real "how do I transcribe ..."
   questions, say that the tool is yours, and read each community's self-promotion rules first. One helpful answer a
   week beats a link dropped in twenty places (which gets the account banned).
8. **Library and accessibility guides.** Many universities keep "free transcription tools" pages (search
   `"transcription tools" site:libguides.com`). Send the librarian a short, polite email. Such links are worth a lot.
9. **"Awesome" lists on GitHub** about Whisper speech recognition (search GitHub for `awesome whisper`): propose
   TranscribeVid in a pull request where the list accepts web apps built on Whisper.
10. **A YouTube demo** ("video to text in 60 seconds, free") with the link in the description, and the same name on
    LinkedIn and X. When these profiles exist, send their addresses to the developer for the site's Organization data.

Later: a few genuinely useful guides on the site ("SRT vs VTT: which one do I need?", "How to subtitle a lecture
video", "How to get better accuracy from speech to text"), each linking to the matching tool page. Five good guides
beat fifty thin ones.

## What NOT to do

- No bought links, link exchanges or "SEO packages", and nobody who "guarantees #1". It can get the whole site demoted.
- No invented reviews, star ratings, user numbers or awards.
- No dozens of near-identical pages ("mp4 to text for students", "... in London"): every page needs its own purpose.
- No mass-produced AI articles published untouched. Write or heavily edit each one.
- Do not claim what the tool does not do (YouTube links, speaker names, live captions).
- Do not change page titles and addresses every week: let a version run for a month before judging it.

---

## For the developer (already built; nothing for the owner to do)

- Prerendered HTML for the 11 public pages, each with its own title (60 characters or fewer), description
  (120-160 characters), canonical URL, Open Graph / Twitter tags, `max-image-preview:large` and JSON-LD: Organization +
  WebSite (site name) + WebApplication (free offer, no ratings) on the home page, BreadcrumbList on inner pages,
  WebApplication on keyword pages, FAQPage / HowTo where the page shows them. `core/title.service.spec.ts` guards the
  lengths and uniqueness.
- `sitemap.xml` lists the 11 pages without `<lastmod>` on purpose: a date helps only when it is always accurate, and nothing
  keeps it so. A new public page: add it to `app.routes.ts`, `app.routes.server.ts`, backend `APP_PAGES` and
  `sitemap.xml` (`backend/tests/test_spa.py` checks they agree).
- `robots.txt` allows everything except `/api/`, `/jobs/` and `/logs`, and names the sitemap. Those three also send
  `X-Robots-Tag: noindex`. Unknown addresses answer a real 404; `/faq/` and `/index.html` redirect (301).
- Backend: `VT_GOOGLE_SITE_VERIFICATION`, `VT_BING_SITE_VERIFICATION` (tags injected into every page),
  `VT_INDEXNOW_KEY` (`/<key>.txt`, `scripts/indexnow.mjs`), gzip (`VT_COMPRESS`), ETags with `304 Not Modified`.
  Tests: `backend/tests/test_seo.py`.
- Lighthouse for every page, mobile and desktop: `node scripts/lighthouse.mjs` (instructions at the top of the file).
- Favicons for search results: `favicon.svg`, `favicon.ico` (16/32/48 px) and `icon-192.png` (a multiple of 48 px).
