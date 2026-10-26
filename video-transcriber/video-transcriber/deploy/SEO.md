# Get TranscribeVid on Google: owner checklist

Plain-English steps for you, the owner. The website side is done: every page has its own title, description and address,
there is a sitemap and a robots.txt, every page is delivered as ready-made HTML that search engines can read without
running JavaScript, and there are 24 pages written for what people search for plus 5 guides (details in "What is on the
site" below). The site runs on Cloudflare Pages (static, in-browser transcription); the Docker / backend setup that
earlier versions of this file described is not what is online.

**Be realistic.** Nobody can promise "number 1 on Google". Google ranks pages that (1) it can open and read, (2) really
help the person searching and (3) other websites link to. The site covers (1) and (2). Number 3 takes your time and
effort, over months. Searches for the name ("TranscribeVid") usually find you within days or a few weeks. Big phrases such
as "video to text" are held by companies with years of links; aim first for longer phrases ("mp4 to text free no login",
"whatsapp voice message to text", "hindi audio to text") where the competition is smaller, and for the one thing
competitors cannot copy: **free, no limit, and your file never leaves your device** (most rivals cap the free tier at a few
minutes or need an upload).

---

## What is on the site

| Kind | Pages |
|---|---|
| Home | `/` |
| Core tools (linked from every footer) | `/video-to-text`, `/audio-to-text`, `/mp4-to-text`, `/mp3-to-text`, `/srt-subtitle-generator`, `/voice-recording-to-text` |
| By file type | `/wav-to-text`, `/m4a-to-text`, `/webm-to-text`, `/mov-to-text` |
| By use | `/whatsapp-voice-message-to-text`, `/meeting-recording-to-text`, `/lecture-to-text`, `/podcast-transcript-generator`, `/interview-transcription` |
| Subtitle files | `/vtt-subtitle-generator`, `/youtube-subtitle-generator` |
| By language | `/hindi-audio-to-text`, `/hinglish-transcription`, `/translate-audio-to-english`, `/spanish-audio-to-text`, `/portuguese-audio-to-text`, `/french-audio-to-text`, `/german-audio-to-text` |
| Lists | `/tools` (every tool, grouped), `/guides` (every guide) |
| Guides | `/guides/srt-vs-vtt`, `/guides/how-to-add-subtitles-to-a-video`, `/guides/transcribe-video-without-uploading`, `/guides/accurate-transcripts`, `/guides/what-is-whisper` |
| Information | `/how-it-works`, `/faq`, `/about`, `/contact`, `/privacy`, `/terms` |

38 addresses in all, all in `sitemap.xml`. A file dropped on a language page opens the uploader with that language already
chosen (Hindi, Hinglish, Spanish, ...), so those pages are tools, not only text.

---

## The checklist

1. **Check the live site** in any browser: `https://transcribevid.com` opens with the padlock, `http://` and
   `https://www.` both jump to it, `/robots.txt` and `/sitemap.xml` show text, `/guides/srt-vs-vtt` opens, and
   `/no-such-page` shows "Page not found".

2. **Prove to Google that the site is yours** in Google Search Console (free): https://search.google.com/search-console.
   Use a **Domain** property `transcribevid.com` and the **DNS record** method: Google shows a line starting with
   `google-site-verification=`; add it in Cloudflare (DNS > Records > Add record, type TXT, name `@`, that line as the
   content), wait a few minutes, press *Verify*. It covers http, https and www at once. (The old "HTML tag" and
   "backend setting" methods do not exist on the static site; the DNS record is the one to use.)

3. **Submit the sitemap.** In Search Console open *Sitemaps*, type `sitemap.xml`, press *Submit*. Within a day or two it
   should say *Success* with 38 pages discovered.

4. **Ask Google to look now.** *URL inspection* (search bar at the top) > *Request indexing*, about 10 a day are allowed.
   Day 1: `/`, `/video-to-text`, `/audio-to-text`, `/mp4-to-text`, `/mp3-to-text`, `/srt-subtitle-generator`,
   `/voice-recording-to-text`, `/guides`, `/tools`, `/guides/srt-vs-vtt`. Day 2 and after: the other guides, then the
   file-type, use and language pages, 10 a day. *Test live URL* then *View tested page* shows the page the way Google
   sees it: the text and headings should all be there.

5. **Bing and the others (10 minutes).** At https://www.bing.com/webmasters sign in and choose *Import from Google Search
   Console*: it copies the site and the sitemap. Bing also feeds DuckDuckGo, Ecosia, Yahoo and several AI assistants. In
   Cloudflare turn on **Crawler Hints** (Caching > Configuration): it tells Bing and others about changed pages for you
   (this replaces the IndexNow script for this setup).

6. **Three Cloudflare settings that affect search (your dashboard; the deploy login cannot change them).**
   - **Managed robots.txt** (Security > Settings > search "robots", or Bots > AI crawlers). Cloudflare adds a block to the
     live robots.txt that (a) blocks AI training bots (fine to keep) and also the bots that fetch a page when a person asks
     an AI assistant about it (ChatGPT-User, Perplexity-User, Claude-User), which stops assistants from citing the site,
     and (b) adds a `Content-Signal:` line that Lighthouse reports as an "unknown directive" (Google ignores it; harmless).
     Recommended: keep the training bots blocked if you like, but allow the three "-User" agents, or switch the managed
     block off. Google Search itself is never blocked.
   - **Email Address Obfuscation** (Scrape Shield). It rewrites your e-mail into an encoded link plus an extra script, so
     crawlers see "[email protected]". Switch it **off**: a visible contact address is a trust signal for Google and for the
     AdSense review.
   - Leave *Always Use HTTPS* on, and the www > apex redirect as it is.

7. **Test the speed once.** At https://pagespeed.web.dev test `https://transcribevid.com/` and a guide on mobile. Aim for
   green. The three numbers Google cares about: loading (LCP) under 2.5 s, reaction to taps (INP) under 200 ms, layout
   jumping (CLS) under 0.1. At https://search.google.com/test/rich-results a page should show no errors (Breadcrumb, Article,
   WebApplication, FAQ). There are no star ratings anywhere, on purpose: never add made-up ones.

8. **Wait, then check monthly (15 minutes).** In Search Console:
   - **Pages** (page indexing): the 38 pages should move to *Indexed* over 1 to 6 weeks. Normal and nothing to fix: *Page with
     redirect* (http and www addresses), *Not found (404)* (mistyped addresses), *Excluded by 'noindex' tag* and *Blocked by
     robots.txt* (private transcript pages `/jobs/...`, `/logs`, `/api/...`). Worth attention: *Crawled - currently not
     indexed* or *Discovered - currently not indexed* for a page you care about. On a new site this usually clears by itself
     once other sites link to you; if it stays for 2 months, tell the developer which page. *Duplicate, Google chose
     different canonical* or *Server error (5xx)*: tell the developer.
   - **Core Web Vitals**: says *Not enough usage data* until enough Chrome users have visited (often months). Normal.
   - **Performance**: which searches show the site and which pages get clicks. Write the numbers down each month.
   - Search Google for `TranscribeVid` and `site:transcribevid.com`: the home page first, the main pages listed.

---

## How long it takes

| When | Realistic result |
|---|---|
| Day 1 | Site verified, sitemap submitted. |
| Days 2-14 | Home page indexed; searching `TranscribeVid` starts to find it. |
| Weeks 2-8 | The tool pages and guides indexed. Few impressions; a handful of clicks on specific phrases. |
| Months 2-4 | With some real links (below), long phrases such as "mp4 to text free no login" or "hindi audio to text" can reach page 1-3. |
| Months 6-12+ | Competitive phrases ("video to text", "audio to text") need strong authority. Possible, not promised. |

Changes take weeks to show. Judge progress monthly, not daily.

---

## First links from other websites (free; this is what moves rankings)

Do a few each week. Fill every profile properly (name `TranscribeVid`, one word, the same everywhere; link to
`https://transcribevid.com`; short honest description: free, no login, timestamps, SRT/VTT/TXT/PDF, 50+ languages, your
file stays on your device).

1. **AlternativeTo** (alternativeto.net): add TranscribeVid as a free alternative to Otter.ai, Rev, Descript, Happy Scribe,
   Sonix, Notta and TurboScribe. People really browse these pages.
2. **SaaSHub** (saashub.com): free listing, with its own "alternatives" pages.
3. **Product Hunt** (producthunt.com): one launch day. Prepare a tagline, 3 screenshots and a 30-second video, and be
   there all day to answer comments.
4. **Hacker News "Show HN"** (news.ycombinator.com/showhn.html): fits well because it is free, needs no sign-up and runs in
   the browser. Write plainly what it does and how; answer questions; never ask friends for upvotes.
5. **Indie Hackers** (indiehackers.com): a product page plus an honest "how I built it" post (the in-browser Whisper story
   is genuinely interesting to that audience).
6. **BetaList** (betalist.com): free submission (there is a waiting list; the paid "skip the line" is not needed).
7. **Reddit, with care.** r/SideProject and r/alphaandbetausers allow sharing your own project. In r/podcasting,
   r/youtubers, r/videoediting, r/Transcription, r/college, r/Journalism or r/IndiaTech, only answer real "how do I
   transcribe ..." questions, say that the tool is yours, and read each community's self-promotion rules first. One helpful
   answer a week beats a link dropped in twenty places (which gets the account banned).
8. **Library and accessibility guides.** Many universities keep "free transcription tools" pages (search
   `"transcription tools" site:libguides.com`). Send the librarian a short, polite email. Such links are worth a lot, and the
   "your file never leaves your device" point matters to them.
9. **"Awesome" lists on GitHub** about Whisper speech recognition (search GitHub for `awesome whisper`): propose
   TranscribeVid in a pull request where the list accepts web apps built on Whisper.
10. **A YouTube demo** ("video to text in 60 seconds, free") with the link in the description, and the same name on
    LinkedIn and X. When these profiles exist, send their addresses to the developer for the site's Organization data
    (`sameAs`).
11. **The guides are the link bait.** `/guides/srt-vs-vtt`, `/guides/transcribe-video-without-uploading` and
    `/guides/what-is-whisper` are the pages other people can cite. When you answer a question somewhere, link the guide
    that answers it, not the home page.

## What NOT to do

- No bought links, link exchanges or "SEO packages", and nobody who "guarantees #1". It can get the whole site demoted.
- No invented reviews, star ratings, user numbers or awards.
- No dozens of near-identical pages: every page needs its own purpose and its own text. (Each page that exists was written
  to say something the others do not; a test refuses two pages that share a paragraph, a tip, a question or a section title.)
- No mass-produced AI articles published untouched. Write or heavily edit each one.
- Do not claim what the tool does not do (YouTube links, speaker names, live captions).
- Do not change page titles and addresses every week: let a version run for a month before judging it.

---

## For the developer (already built; nothing for the owner to do)

**How a page is made.** Public pages are prerendered to static HTML by the production build, each with its own title (60
characters or fewer), description (50-160), canonical URL, Open Graph / Twitter tags, `max-image-preview:large` and JSON-LD:
Organization + WebSite + WebApplication on the home page, BreadcrumbList on inner pages (three levels on a guide:
Home > Guides > the guide), WebApplication + FAQPage + HowTo on tool pages, Article + FAQPage on guides. Text lives in
lazy chunks, one per page (`tool-content.resolver.ts` / `guide-content.resolver.ts` load only the page being opened).

**Add a tool page**
1. `features/tool-pages/tool-pages.list.ts`: an entry (path, group, label, title <= 43 characters, description, optional
   `preset` = the language / option a dropped file starts the uploader with).
2. `features/tool-pages/content/<slug>.ts`: the text (`ToolPageContent`: 4 steps, 3-5 tips, 4-5 questions, page-specific
   `sections`, 3-4 `links`, `browser` variants wherever a sentence is only true for one edition).
3. One line in `content/index.ts`; the route, the prerender entry and the "All tools" page follow from the list.
4. `node scripts/gen-sitemap.mjs` (rewrites `public/sitemap.xml` from the lists), and the backend `APP_PAGES`
   (`backend/app/main.py`; `backend/tests/test_spa.py` reads the frontend list and fails when they differ).

**Add a guide**: the same with `features/guides/guides.list.ts`, `features/guides/content/<slug>.ts` (`GuideContent`) and
`features/guides/content/index.ts`. Change `updated` in the list whenever the guide's text really changes (it is the page's
visible date, the Article `dateModified` and the sitemap `<lastmod>`), never otherwise.

**Checks**
- Specs: `tool-pages.list.spec.ts`, `tool-page.spec.ts`, `guides.list.spec.ts`, `guide.spec.ts`, `all-tools.spec.ts`,
  `guides-index.spec.ts`, `title.service.spec.ts` (lengths, uniqueness, structure, real links, no invented claims).
- `node scripts/audit-prerender.mjs` (after `npm run build:pages` in `frontend/`): reads the built HTML like a crawler and
  checks titles, descriptions, canonicals, one h1, structured data, text length, placeholders, internal links and the sitemap.
- `node --test scripts/sitemap-lastmod.test.mjs`: the sitemap dates.
- `sitemap.xml` source has no `<lastmod>` on purpose; `scripts/pages-postbuild.mjs` adds an accurate one to the built copy:
  a guide's printed "updated" date, otherwise the date of the last git commit of the page's own text files (today if they
  have uncommitted changes), and none where git cannot say.
- Lighthouse for every page, mobile and desktop: `node scripts/lighthouse.mjs` (instructions at the top of the file).

**Measured, not enabled**: Angular client hydration. Built both ways and compared on the same Pages emulator (5 runs each):
performance 92 vs 91, LCP 2.42 s vs 2.45 s, no layout shift either way. The gain is inside the noise, it adds about 12 kB to
the first download, and an app with this much browser-only UI (ad rail, theme, session counters) risks DOM mismatches.
The LCP element (the page heading) is already in the prerendered HTML. Revisit only if a real-user metric says otherwise.

**robots.txt** allows everything except `/api/`, `/jobs/` and `/logs`, and names the sitemap. `/jobs/*`, `/logs`, `/index.csr`
and `/404` also send `X-Robots-Tag: noindex` (`_headers`, written by `pages-postbuild.mjs`). Unknown addresses answer a real
404; `/faq/` and `/faq.html` redirect (308) to `/faq`, `/guides/x/` to `/guides/x`. Cloudflare prepends its managed block to the
live robots.txt (see step 6).

**Favicons** for search results: `favicon.svg`, `favicon.ico` (16/32/48 px) and `icon-192.png` (a multiple of 48 px).
