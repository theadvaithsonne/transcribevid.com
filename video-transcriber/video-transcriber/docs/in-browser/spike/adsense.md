# Google AdSense on TranscribeVid (Angular 21, static host) - policy and implementation brief

Track: adsense-policy-research. Research date and source access date: **2026-10-25**. Branch `feature/in-browser`.
Nothing in the repo was changed except this file. Throwaway experiments live in the scratchpad (paths in section 17).

How to read the evidence tags used below:

- **[official]** quoted or closely paraphrased from a Google page I fetched (URL in section 18). Note: my fetch tool summarises pages with a small model, so wording marked "quote" is what the tool returned, not a byte-exact copy. Re-read the live page before relying on exact wording in legal text.
- **[measured]** I ran it in Chrome 155 (playwright-core, channel `chrome`, headless) against Google's real loader with a **fake** publisher id `ca-pub-0000000000000000`. No real account was touched. The ad request returns 400 with a fake id, so **no creative was ever served**: anything about fill, revenue, real creative weight or CLS with a real creative is NOT measured.
- **[inference]** my reasoning from the above; not stated by Google.
- **[unverified]** could not confirm from an official page; treat as a to-do for the owner or a later test.

---

## 0. Verdict and the seven things that matter most

Verdict: **AdSense is feasible only with changes to the plan.** Ads can live on the public, prerendered pages. They cannot share a document with the cross-origin-isolated transcriber, and one existing feature (YouTube / Instagram link download) is a direct policy conflict that the owner must decide on before applying.

1. **YouTube / Instagram link download conflicts with the AdSense content policy [official].** Policy "Enabling dishonest behavior" lists as examples "products or services that bypass copyright protection, including circumvention of digital rights management technologies" and "pages that assist or enable users to download streaming videos if prohibited by the content provider". YouTube's terms bar downloading except where the service authorises it [official, S27]. The app has this feature today (`frontend/src/app/features/download/downloader.*`, and the `job.ts` / `video-to-text.ts` mentions). Google can reject the application or disable ad serving for the whole site. The owner's rule is "do not drop features", so this needs an explicit owner decision with the options in section 3.
2. **COOP/COEP and ads are incompatible - proven [measured].** With `Cross-Origin-Embedder-Policy: require-corp` **and** with `credentialless`, Chrome 155 loaded `adsbygoogle.js` (it is served with `Cross-Origin-Resource-Policy: cross-origin`) but blocked the ad iframe and the traffic-quality iframe with `net::ERR_BLOCKED_BY_RESPONSE` (section 12.1). Google's own guide says the same for its tags [official, S21]. Consequence: the plan's "YES ads on the finished transcript page" only works if the finished view is a **different document load without COEP**. Recommended v1: no ads on `/jobs/:id` at all.
3. **The privacy-policy page must not carry ad tags or the consent tag [official, S14].** The Angular app serves one `index.html` for every route, so the loader must **not** be in `index.html`. It must be injected by route, and `/privacy` (the page that will be registered as the privacy-policy URL in Privacy & messaging) must never load it, including after in-app navigation (use a full page load link to `/privacy`).
4. **Approval risk is "low value content" for a tool site [official + inference].** Google disallows ads on screens "without publisher-content or with low-value content" and counts "images, videos, games, article text and user-generated content created or managed by the publisher" but **not** whitespace, header/footer or links as publisher content [official, S6, S7]. A bare upload screen has almost no countable content. The prerendered pages (home, six tool pages, how-it-works, FAQ) must carry real, original, indexable text before applying.
5. **Never place ads on the transcribing screen, the transcript, logs, 404 or legal pages.** Each is covered by a named policy (section 5).
6. **Use manual ad units only, Auto ads fully off.** Anchor, vignette and side-rail overlay formats and in-page auto placement cannot be kept away from buttons or the upload / transcribe flow in an SPA (section 6).
7. **Host and header details that break consent:** do not send `Referrer-Policy: no-referrer` / `same-origin` site-wide (Google's consent messages cannot serve if the referrer is not sent cross-origin; default `strict-origin-when-cross-origin` is sufficient [official, S15]); do not ship a script-src CSP on ad pages unless it is Google's nonce + `strict-dynamic` form, which a static host cannot produce per response (section 13).

---

## 1. Approval: what Google says, and what it means for a tool site

| Item | Finding | Tag |
|---|---|---|
| Basic eligibility | Content "must be high-quality, original, and attract an audience"; comply with Program policies; applicant 18+; you must have access to the site's HTML source. | official (S1) |
| "Ready" checklist | Layout/navigation help visitors; unique content relevant to visitors; comment sections must be moderated; "Google ads may not be placed on sites with scraped or copyrighted content". | official (S2) |
| Review time | Add site, verify, "Request review"; reviews "usually take a few days but can take 2-4 weeks". Do not remove/update a site that is still "Getting ready" (can delay review). Statuses: Ready / Getting ready / Needs attention / Requires review. | official (S3, S4) |
| Low-value content | Policy "Google-served ads on screens without publisher-content": no ads on screens "without publisher-content or with low-value content", "that are under construction", or "that are used for alerts, navigation or other behavioral purposes". Examples: dead-end pages ("Thank You, Exit, Error pages"), apps where the user looks away from the screen (flashlight), "automatically generated content without manual review or curation". Enforcement: Google "may limit or disable ad serving on pages with low value content and/or still being constructed until changes are made". | official (S6) |
| What counts as content | "images, videos, games, article text and user-generated content created or managed by the publisher"; excludes "whitespace, header or footer content, or links to other content on the site". Ads must not outnumber content; no numeric ratio is given. | official (S7) |
| Word counts / traffic minimums | None published. Reject reasons appear on the Sites page. | official (S4) via search summary; treat third-party blogs as unofficial |
| Own domain | Application is per site URL. Platform subdomains such as `*.pages.dev` are probably not acceptable; secondhand reports only. Apply on `transcribevid.com` once live (the plan already says this). | unverified |
| Replicated content | No ads on screens "with embedded or copied content from others without additional commentary, curation, or otherwise adding value". Relevant to the YouTube/Instagram feature and to any FAQ text lifted from elsewhere. | official (S8) |
| Language | Policy "Unsupported languages": content must be "primarily in one of the supported languages". Hindi, English, and ~50 others are supported; Roman Hindi (Hinglish) is not named. Our page chrome is English, so the page language is supported, but a transcript displayed in an unsupported language (Whisper handles ~99) is user content we cannot pre-screen. | official (S9), inference |

Practical consequences for "TranscribeVid is a tool":

- Treat the **prerendered pages as the product Google reviews**. The home page must contain a few hundred words of original explanatory text that is in the prerendered HTML (not injected after load), not just the dropzone. The six keyword tool pages (`/video-to-text` ... `/voice-recording-to-text`) must each be distinct (no near-duplicate boilerplate - the policy lists duplicate content under low-value) and each needs its own worked example, limits, format notes, and FAQ.
- Do not apply while any page is a stub, "coming soon" or lorem text ("under construction" is a named violation).
- The Google crawler needs to read the pages: `robots.txt` must not block the AdSense crawler [official, S4]. The current `public/robots.txt` allows `/` and only disallows `/api/`, `/logs`, `/jobs/`. That is fine; after the move to the static host remove the `/api/` line only if no `/api/` path exists. Keep `/jobs/` and `/logs` disallowed (no ads there anyway).
- Review is of the **live** site on the real domain, so it is step 6 of the plan and cannot be parallelised with the static deploy.

---

## 2. Required pages

Google's official pages I could read do **not** publish a mandatory "pages checklist". What is documented:

- A privacy policy that "clearly discloses any data collection, sharing, and usage" tied to Google products, and that tells users third parties may read/place cookies, web beacons or IP addresses when ads are served [official, S10 "Privacy disclosures"].
- Easy-to-find contact information (name, contact form, email) is in Google's AdSense resource guidance [official-ish, via search summary; S11]. About and Contact being "required" is common advice but **not confirmed** by a Google page I could read [unverified].
- A consent / privacy-policy URL registered in Privacy & messaging for EEA/UK/CH [official, S14].

Existing routes already cover: `/how-it-works`, `/faq`, `/privacy`, `/terms`. **Gap: there is no contact page.** Add `/contact` (prerendered; a mailto address and, ideally, a form-less obfuscated email; owner supplies the address) and link it from the footer. Add an "About / who runs this" paragraph to `/how-it-works` (the old `/about` already redirects there).

---

## 3. The link-download feature and AdSense (owner decision required)

Facts [official]: "Enabling dishonest behavior" examples include DRM circumvention and "pages that assist or enable users to download streaming videos if prohibited by the content provider" (S5, S12). YouTube's terms: users may not "access, reproduce, download ... any part of the Service or any Content except" as expressly authorised or with written permission (S27). I could not retrieve Instagram's terms text, so Instagram is [unverified], but the same reasoning applies.

Facts [inference]: AdSense review and enforcement are per site; the feature is user-visible in the UI and in the copy, so a reviewer can see it.

Options, in order of safety for the AdSense account (the owner picks; none silently drops the feature):

| Option | Effect on the "keep every feature" rule | AdSense risk |
|---|---|---|
| A. Keep the link downloader, on a separate registrable domain that never carries AdSense (e.g. a different brand), and link to it only as a plain external link | Feature stays | Lowest; still ask: does the main site's copy "promote" it? Keep it out of FAQ/tool-page copy |
| B. Keep the downloader but accept only direct media URLs and other sources the content provider permits (drop YouTube / Instagram) | Feature narrowed - this is dropping part of it | Low |
| C. Keep it on the AdSense domain exactly as today | Feature stays | **High**: application rejection or ad serving disabled for the whole site |
| D. Do not use AdSense (donation / sponsor) | Everything stays | None |

Whichever is chosen: remove YouTube/Instagram wording from every page Google will review before applying, and do not rely on "users are responsible" language (that does not change what the page enables).
Also note: on the static host the downloader needs a server component anyway (the plan's static host has no yt-dlp); that is another track's problem, but it means option A is architecturally natural.

---

## 4. Verification, `ads.txt`, and the exact loader

### 4.1 Three ways to connect the site [official, S16]

1. **AdSense code snippet** in `<head>` "on every page where you want ads".
2. **`ads.txt` snippet** - one line in `/ads.txt`.
3. **Meta tag** - "Useful if you don't want the snippet on your homepage": `<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">`.

Recommended for this app: use **2 + 3** for connection and approval (both are static and appear in the prerendered HTML / file, so the crawler sees them without running JS), and inject the **loader** (1) only on ad-enabled routes in the browser. Google's help does not cover JS frameworks [official, S16: "doesn't cover JavaScript frameworks or tag managers"], so I do not claim Google's verifier executes JS. The meta tag lives in `index.html` (harmless on every route, including `/privacy`: it is not a script and not an ad tag).

### 4.2 Exact loader snippet [official, S16, S17]

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

Ad unit markup (fixed size, from Google's responsive/fixed examples [official, S18]):

```html
<ins class="adsbygoogle" style="display:inline-block;width:160px;height:600px"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="NNNNNNNNNN"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

Measured facts about the real loader [measured, `exp1.json`, curl headers]:

- `Content-Length: 205680` bytes uncompressed; `gzip -c` of the same bytes = 71,549 bytes. `Cache-Control: private, max-age=3600, stale-while-revalidate=3600`, `Access-Control-Allow-Origin: *`, `Cross-Origin-Resource-Policy: cross-origin`, `Link: <https://googleads.g.doubleclick.net>; rel="preconnect"`.
- The loader appends its **own hidden helper** `ins.adsbygoogle.adsbygoogle-noablate[data-ad-hi="true"]` (`display:none !important`, 0x0, status `done`, `data-ad-status="unfilled"`) as a child of `<body>`, even with no manual unit and no push (`exp3.txt`). **Never** select `ins.adsbygoogle` globally to "clean up" or push; scope your own units with a class or data attribute (e.g. `ins[data-tv-slot]`).
- Network hosts contacted from one page with one unit: `pagead2.googlesyndication.com`, `googleads.g.doubleclick.net`, `ep1.adtrafficquality.google`, `ep2.adtrafficquality.google`, `www.google.com`. With a real id and consent the set will be larger (not measured).

### 4.3 `ads.txt`

Exact AdSense line [official, S19]: `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0` (replace with the owner's publisher id; copy it from AdSense > Sites > the site > Ads.txt snippet).

Rules from the IAB spec v1.1 (read locally from the spec repo, S20) [official spec]:

- File at `/ads.txt` of the **root domain** (public suffix + 1). Served over HTTPS, `Content-Type: text/plain` (preferably `text/plain; charset=utf-8`); "all other Content-types should be treated as an error and the content ignored".
- Redirects: allowed within the same root domain (so `http` -> `https`, `www` -> apex OK); only one hop outside the root domain.
- HTTP 404 means "no declarations exist"; 401 is restricted; other errors reuse the last good copy. Default cache expiry 7 days when no cache headers.
- Record: `domain, publisher-account-id, DIRECT|RESELLER[, certification-authority-id]`. Comments with `#`. Variables such as `OWNERDOMAIN=transcribevid.com` and `CONTACT=...` are optional (1.1 recommends declaring OWNERDOMAIN).
- AdSense statuses: Not found / Unauthorized / Authorized; changes can take days, up to a month for low-traffic sites [official, S19, S4].

Cloudflare Pages specifics:

- `public/ads.txt` is copied to the site root by Angular (everything in `public/` is). Pages serves `.txt` as text; **verify with `curl -I https://transcribevid.com/ads.txt`** after deploy: expect `200` and `content-type: text/plain...`. [unverified until deployed]
- If the project has **no top-level `404.html`**, Pages "assumes that you are deploying a single-page application" and serves the root for unmatched paths [official, S22]. A missing `/ads.txt` would then return `index.html` with 200 and `text/html` = ignored by crawlers. Ship the file, and see section 5 about `404.html`.
- `_headers`: "up to 100 header rules", each line max 2,000 characters; a request matching several rules **inherits headers from all of them and joined with commas** if the same header repeats; `! Header-Name` detaches [official, S23]. Do not put COOP/COEP on `/*`. Scope them to the transcriber paths only.

---

## 5. Page-by-page policy matrix (current routes from `app.routes.ts` / `app.routes.server.ts`)

| Route | Render mode | Ads? | Policy / reason |
|---|---|---|---|
| `/` (upload) | Prerender | **Yes**, rail on desktop, one inline unit on tablet/phone | Needs real text content. Keep every ad away from the dropzone, file picker, record button and Start button (section 6.3). Home must not become "tool only". |
| `/video-to-text`, `/audio-to-text`, `/mp4-to-text`, `/mp3-to-text`, `/srt-subtitle-generator`, `/voice-recording-to-text` | Prerender | **Yes** | Same as home; each must be unique content. |
| `/how-it-works`, `/faq` | Prerender | **Yes** | Best-quality ad pages (article text). |
| `/privacy` | Prerender | **No ads, and no loader** | The registered privacy-policy URL must not host "scripts that require user consent, including ad tags" nor the consent message tag [official, S14]. |
| `/terms` | Prerender | No (recommended) | Low-value legal text; no benefit. Keep the loader off so the risk is zero. |
| `/jobs/:id` while transcribing | Client | **No** | "Out of context ads" (no ads when the user's attention is expected elsewhere, S24); dead-end / functional screen (S6); lives in the COEP document where ads are blocked anyway (section 12.1); CPU and memory contention (section 12). |
| `/jobs/:id` finished transcript | Client, noindex | **No in v1**; optional v2 in a separate non-isolated document | The content is the visitor's private, unmoderated, possibly non-English, possibly adult/dangerous/copyrighted text. It is user content not "created or managed by the publisher", Google's crawler cannot see it (noindex, local-only), and it sits beside Download / Export buttons (accidental clicks, S25). We cannot pre-screen it against content policies (adult, dangerous, copyrighted), nor guarantee a supported language (S9). |
| `/logs` | Client, noindex | No | Operator page, no publisher content. |
| `**` not found | Client | **No** | "Dead end ... Error pages" (S6). Also give it a real HTTP 404: add `404.html` (Pages then serves it with status 404 instead of SPA fallback `200`, S22). A soft-404 with an ad slot is the worst case. |
| Any in-app error / empty state / toast / modal | n/a | No | "alerts, navigation or other behavioral purposes" (S6). |

**Decision 2026-10-27 (owner instruction: always follow the AdSense rules, it is the main income):** the v1 rule above is final. The
route `jobs/:id` has no `ads` flag, so a transcript, finished or not, never shows an ad (it is user content that the publisher neither created
nor manages, machine-made, unreadable for Google's crawler, and sits beside the Download and Export buttons). `routes.spec.ts` pins it. To
reverse it later, give the route `ads: 'job-done'` and `adSlot: 'end'` again (the service and its specs still support it), and change the
six sentences of the privacy, terms, about, FAQ, how-it-works and guide texts back; do it only after Google has approved the site and
confirmed in Policy center that such pages are fine.

Implementation note [inference]: put an explicit allow-list in `app.routes.ts` (`data: { ads: 'full' }` on the nine ad pages) rather than a deny-list; anything not listed (including future routes) is ad-free by default.

---

## 6. Ad formats: which to use, which to avoid

| Format | Use? | Why |
|---|---|---|
| **Manual display units** (fixed sizes, one slot id per placement) | **Use** | You control exact position, size and route lifecycle. |
| Auto ads (in-page banner, multiplex) | **Avoid, switch off** | Placement is chosen by Google by scanning the DOM; in an SPA, Google documents no route-change behaviour (the help articles I read say only that Auto ads "detect the change, reanalyze the page, and adjust"; nothing about SPAs or dynamic content [official, S26]). You cannot guarantee distance from Upload/Export buttons. |
| **Anchor ads** | **Avoid** | Stick to the screen top/bottom, "easily dismissible", but sit next to the controls and invite accidental clicks; on phones they occupy the viewport where our Start / Cancel buttons are. Setting exists to block anchors on screens wider than 1000 px. |
| **Vignette ads** | **Avoid** | "Full-screen ads that appear between page loads". On a transcriber this lands between the file pick and the job. Violates the spirit of "no overlays on upload/transcribe screens". |
| **Side rail (auto)** | **Avoid** (we draw our own rail) | Google-drawn, sticky, left/right selectable; the width in pixels is not documented [official, S26]; you cannot guarantee the 20% layout. |
| Intent-driven formats (ad intent links, chips) | **Avoid** | Inject ads into body text. |
| Multiplex / in-feed | Avoid | Not needed. |

Dashboard setting to make this stick: AdSense > Ads > the site > **Auto ads: OFF** (master toggle), and as defense in depth also turn each overlay format off and add the privacy, jobs, logs, terms paths to "Excluded pages" [official, S26]. Important [measured]: the loader runs and creates its helper `ins` even with no Auto ads configured; whether a real account with Auto ads ON would inject units on every page that loads the script is not measured, which is why the master toggle must be OFF.

### 6.1 Placement rules from Google that apply

- "Publishers are not permitted to encourage users to click on Google ads in any way", no ads "mistaken for other site content" (navigation or download links), care with "links, play buttons, download buttons, navigation buttons" near ads; "Even if the layout unintentionally leads to accidental clicks, publishers may still receive a violation notification" [official, S25].
- Labels: only "Advertisements" or "Sponsored Links", never under misleading headings such as "resources" or "helpful links"; no disguising ads, and no formatting nearby content to look like ads [official, S25].
- No refresh of a page or page element "without the user requesting a refresh"; no more than three pop-ups; ads must not be in windows not started by an intentional user action [official, S25].
- Ads must not outnumber publisher content [official, S7].
- No numeric minimum distance from buttons is published. [inference] Team rule: ads at least 24 px (rail) / 48 px (in-flow) away from any button or link row, never between a control and its result, and `Advertisement` label at 11-12 px above the slot in a muted colour (not an arrow, no emphasis; Google bans drawing attention).

### 6.2 What Google allows for reacting to an unfilled slot

`data-ad-status` is set by Google on the `<ins>` after the request: `filled`, `unfilled`, `unfill-optimized`. Unfilled units collapse only if outside the viewport, otherwise keep their size as blank space; do not start units hidden and reveal later ("may skip the ad request for units that aren't visible"); the attribute exists only on top-window units [official, S28]. Documented fallback: put a link/image inside the `<ins>` and reveal it via `ins[data-ad-status="unfilled"]`.
[measured] Chrome 155, fake id: `data-ad-status="unfilled"` appeared within 6 s, an in-viewport 300x250 slot kept its 300x250 box.

### 6.3 Where the buttons are

The home page and tool pages contain the dropzone, "choose file", record, link-download input, model/language selects and Start. The rail (right 20%) is horizontally apart from the content column; on tablet and phone the inline unit goes **after** a full text section (e.g. between "How it works" blocks), never directly above or below the upload card, and never between the card and its Start button. Do not put a unit directly under the finished-job toolbar (v2 only).

---

## 7. Ad sizes for a right rail of exactly 20% of the viewport

Rail width = 0.20 x viewport width. With 12 px padding each side the usable width is rail - 24. Sizes available from Google: 160x600 "Best along page sidebars", 300x600 "Half page ... among the fastest-growing sizes", 300x250 "Medium rectangle", 120x600, 300x1050, 336x280 [official, S29]. Responsive units can also serve here but their height is not predictable (below).

| Viewport width | Rail (20%) | Usable (-24) | Fixed sizes that fit | Recommended |
|---|---|---|---|---|
| 1100 | 220 | 196 | 160x600, 120x600 | 160x600 |
| 1280 | 256 | 232 | 160x600 | 160x600 |
| 1366 | 273.2 | 249 | 160x600 (300 does not fit) | 160x600 |
| 1440 | 288 | 264 | 160x600 | 160x600 |
| 1536 | 307.2 | 283 | 160x600 | 160x600 |
| 1600 | 320 | 296 | 160x600 (300 needs 324) | 160x600 |
| 1680 | 336 | 312 | 300x600, 300x250 | **300x600** |
| 1920 | 384 | 360 | 300x600, 336x280 | 300x600 |
| 2560 | 512 | 488 | 300x600, 300x1050 | 300x600 (centred) |

Arithmetic: 300 + 24 = 324 -> viewport >= 1620; use **1680** as the switch to leave slack for a vertical scrollbar. Between 1100 and 1679 use 160x600. (If you want to switch at 1620 use `padding: 0 8px` => 316 => 1580; I kept 12 px.)

Rules:

1. **Decide the size once per page view** with `matchMedia('(min-width: 1680px)')`, create only that `<ins>`, and do not re-request on window resize (resize is not a user-requested refresh [inference from S25]). If the window later shrinks below 1100 hide the rail with CSS (`display:none`); do not request a new ad on re-expand. Google's own multi-size pattern is "CSS media query sets the size, `display:none` means no request is made" [official, S18], but external stylesheets for sizing are "not officially supported" - set `width`/`height` in an inline `style` or a component `<style>` that Angular emits inline, not a `.css` file. [official, S18]
2. **Reserved space = zero layout shift** if the rail is its own grid column: `grid-template-columns: minmax(0,1fr) 20vw` at `min-width:1100px`, rail wrapper `contain: layout paint`, `min-height` = ad height + label. The width is reserved by the grid even if the ad is blocked, unfilled or declined.
3. **Short windows:** a sticky 600 px unit is clipped if the viewport is shorter than the sticky offset + 600. Use `position: sticky; top: 72px` only when `window.innerHeight >= 720`; otherwise plain `position: static` (scrolls away). Google's own side-rail format is sticky, so sticky is not by itself a policy problem [official, S26], but Chrome's Better Ads rules flag "large sticky ads" on desktop; a 160x600 / 300x600 unit is small relative to a desktop screen. [inference]
4. **Empty rail**: if the slot is `unfilled` or the loader is blocked, keep the 20% column (that is the owner's requirement) and show a neutral house note inside the box (e.g. "Ads keep TranscribeVid free. Everything works without them."). That is the documented unfilled-fallback pattern (S28). Do not place anything clickable that looks like an ad, and do not add "please disable your ad blocker" pressure that blocks features.
5. Print: `@media print { .ad-rail, .ad-inline { display: none !important } }`. PDF export is browser print; without this the empty slot or an ad would be in the user's PDF. (On ad pages only; transcript has no ads in v1, but the rule is cheap.)
6. Dark theme: Google creatives do not follow the app theme. Give the slot box a neutral light card background in both themes so a dark page does not make a transparent creative unreadable. [inference]

### 7.1 Responsive units (tablet and phone, in-flow)

The owner asked for "responsive" in-flow units on tablet and phone. Facts [official, S30, S18]:

- `data-ad-format="auto"` + `data-full-width-responsive="true"` is recommended and "has the maximum potential for increased revenue"; on phones the unit often expands to full width.
- Shape (`rectangle`/`vertical`/`horizontal`) is "desktop only" so it cannot restrict phone ad height. The page gives **no maximum or typical height** on mobile.

[inference] Therefore a responsive in-flow unit cannot be fully protected against layout shift. Recommended compromise: wrap in a container with `min-height: 280px` (covers the common 300x250 / 336x280 and avoids a jump from 0), `contain: layout`, and push only when the container is within 300 px of the viewport (IntersectionObserver) and has width > 0. A creative taller than 280 (e.g. 300x600) still shifts content below it; to remove that risk use fixed 300x250 (phone >= 332 px wide, tablet any) and, if the owner accepts less fill flexibility, a fixed 728x90 at >= 768 px. I recommend **fixed 300x250 for both** in v1 and revisit responsive after measuring real CLS with a real account (not possible with the fake id).

Phones narrower than 332 px (content width = viewport - 2 x 16 px): hide the unit with CSS (no request is made). [official pattern, S18]

Breakpoints (match the owner's description):

| Viewport | Layout | Unit |
|---|---|---|
| >= 1100 px | right rail, 20vw | 160x600 (1100-1679), 300x600 (>= 1680) |
| 600-1099 px | in-flow, centred, one unit after the first full content section | 300x250 (reserve 250 + label) |
| 332-599 px | in-flow, one unit | 300x250 |
| < 332 px | none | none |

Max units per page: 1 rail OR 1 inline normally; a second inline at the end of long pages (FAQ) is acceptable if ad area stays below content area (S7).

---

## 8. SPA specifics (Angular 21, prerender + client routes)

All behaviours below are **[measured]** in Chrome 155 with the real loader and a fake id unless marked otherwise (`exp1.json`, `exp2.json`, `exp3.txt`).

| Test | Result | Meaning for the Angular code |
|---|---|---|
| Push once on a visible 300x250 `ins` | `data-adsbygoogle-status="done"`, `data-ad-status="unfilled"`, 1 iframe, box 300x250 kept | normal path |
| Push twice (same page, one `ins`) | second push throws `adsbygoogle.push() error: All 'ins' elements in the DOM with class=adsbygoogle already have ads in them.` | exactly one push per `ins`; guard with `ins.dataset.adsbygoogleStatus` |
| Remove the `ins` (container emptied), create a new `ins`, push | new `ins` gets `status=done` and its own frame | **Destroy = remove the `ins`; "refresh" = new `ins` + one push.** The old frame is gone with it. |
| Push into an `ins` whose ancestor is `display:none` | marked `done`, `unfilled`, box 0x0 (this fake-id run did make a request; Google says hidden units "may skip the ad request" [official, S28]) | never push into hidden containers; treat as unsupported |
| Responsive `ins` (`display:block`, `data-ad-format=auto`) inside a width-0 container | **throws `No slot size for availableWidth=0`; the `ins` is still marked `done` with no frame** | check `container.clientWidth > 0` before push; if it fails, create a **new** `ins` later - the consumed one is dead |
| Loader request blocked (simulated blocker) | `<script onerror>` fires, `window.adsbygoogle` stays a plain Array, `adsbygoogle.loaded` is false, `push()` does not throw, `ins` has no status attributes, reserved 250 px box stays | safe to push before the loader arrives (queue); detection signals below |

### 8.1 Lifecycle recipe

- **Server render / prerender**: render only the empty reserved container (same dimensions and `aria-hidden` label wrapper) so hydration matches and CLS is zero. No `<script>`, no `<ins>`. Gate with `isPlatformBrowser`.
- **Browser, on route activation**: `AdsService` checks route `data.ads` and the viewport, appends the loader once (singleton promise; `async`, `crossorigin="anonymous"`), then `AdSlotComponent` (see section 16) creates its `ins` and pushes once.
- **Route change**: Angular destroys the slot component when the routed component changes; remove the `ins` in `ngOnDestroy` (and `ins.remove()` only for your own element). If a route reuses the same component (the six tool pages share `ToolPage`; navigating between them keeps the instance), decide explicitly: new virtual page view = destroy + recreate the `ins` + one push, throttled to at most one request per slot per 30 s; never on timers, visibility change or resize. [inference] A link click is a user-requested navigation; Google's quoted rule is "without the user requesting a refresh" (S25). No official page I found addresses SPA route changes [official gap]; the Nuxt module author warns that reloading ads "arbitrarily (with minimal page content changes) may result in the suspension of your AdSense account" (third-party, unofficial).
- **Never** push for a route on the deny list, and never call push while `engine.busy()` is true (transcription running, recording active) - see section 12.
- **Lazy loading**: Google's guidance is to defer ads that are not immediately visible and to reserve their space [official, S31]. Implement with `IntersectionObserver` (`rootMargin: '300px'`) on the **reserved visible box** (not a hidden one) and push when it intersects and width > 0. For the rail (always in the first viewport) push after `requestIdleCallback` (timeout 2000 ms) so the loader (~71 KB gzip) does not compete with LCP.
- **Layout shift**: reserved box dimensions from the table above; `contain: layout`; no animation on reveal. Do not collapse a unit that is in the viewport when it comes back `unfilled` (that is itself a shift); collapse only below the fold or keep the box with the house note.
- **`data-ad-status` handling**: `MutationObserver` on your own `ins` (attribute filter `data-ad-status`); on `unfilled` swap in the house note (rail) or collapse (inline, below the fold); on `filled` show the "Advertisement" label (hide the label until filled so an empty box is not labelled as an ad). Stop observing after the first terminal value.
- **Error handling**: wrap `push` in try/catch (it throws for the cases above); log through the existing `log.service`; never retry in a loop.

### 8.2 Ad-blocker handling: what is allowed

- Google's supported route: **Ad blocking recovery message** in Privacy & messaging (Funding Choices). A single-screen message with the site logo, an "Allow ads" button that closes it, and an optional custom choice button; can be limited to certain pages; detection and reporting run even while the message is unpublished [official, S32]. Whether it is dismissible and whether content walls are acceptable I could not confirm from the pages I read [unverified]; do not build a wall (also contrary to the owner's no-feature-loss rule).
- Custom detection is not prohibited by any page I read, and the measured signals are reliable enough: loader `onerror`, `adsbygoogle.loaded !== true` after the loader's `load` + 3 s, `ins` without `data-adsbygoogle-status`. `onerror` also fires on plain network failure, so debounce and only show a neutral note.
- Do not: block any app feature, tamper with Google's elements, auto-click or fake impressions, offer an incentive for clicking, or hide the label. The policy bans encouraging clicks and incentives [official, S25].

---

## 9. Consent: Google certified CMP, EEA / UK / CH, re-open link

- To serve **personalised** ads in the EEA and UK (since 16 Jan 2024) and Switzerland (since 31 Jul 2024) a **Google-certified CMP integrated with IAB TCF** is required; traffic from a non-certified CMP "may be eligible for non-personalized ads or limited ads". Google "does not check CMPs for full compliance with the TCF or applicable privacy laws" [official, S33]. Google's own CMP is in AdSense > Privacy & messaging (Funding Choices); the EU user consent policy page also says publishers can use "the Google CMP, a third-party CMP, or create your own consent dialog" (S34). Use Google's CMP: free, certified, no extra script.
- Messages to create in the dashboard (owner): **European regulations** (EEA/UK/CH) and **US state regulations** (section 11). The consent UI is delivered by the AdSense tag itself, so no second script is needed; AdSense does not support more than one account per page and consent solutions "can only serve from the top-level window" [official, S15].
- **Re-open ("revoke") link**: AdSense adds the revocation link automatically on sites that show European regulations messages ("You don't need to add code for this link"); the manual form is `<a href="javascript:googlefc.callbackQueue.push(googlefc.showRevocationMessage)">Privacy and cookie settings</a>` [official, S35]. Google requires the link text "Privacy and cookie settings", at the bottom of the site or in its menu. In the SPA build it as a button, not a `javascript:` URL: `window.googlefc = window.googlefc || {}; googlefc.callbackQueue = googlefc.callbackQueue || []; googlefc.callbackQueue.push(googlefc.showRevocationMessage)`. [inference on the CSP-friendly form]. Footer on every page; on `/privacy` (no loader) the button must instead be a plain link to the home page footer with a sentence explaining where it is, because `googlefc` does not exist there.
- **Privacy-policy URL** registered in the message "Learn more" must point to a page that "doesn't host scripts that require user consent, including ad tags" and "doesn't contain the Funding Choices consent message tag" [official, S14] => `/privacy` is loader-free (section 5). Link to it with a normal `<a href="/privacy">` (full document load) from ad pages, not `routerLink`, so that the SPA never carries the loader into the privacy document.
- **Referrer**: Google consent messages "cannot serve if the site's referrer policy does not allow the referrer to be included in cross-origin requests"; `strict-origin-when-cross-origin` is enough [official, S15]. Many "security headers" snippets set `Referrer-Policy: no-referrer`: do not use that in `public/_headers`.
- **Testing the EEA flow** from India: the message only shows to EEA/UK/CH traffic. I could not confirm a documented force-show URL parameter (`fc=alwaysshow` is circulated unofficially) [unverified]; plan a VPN test or a Google preview in the dashboard.
- **Non-consenting visitors** still get ads (limited / non-personalised) - ads continue. A visitor who rejects does not lose any feature. The CMP must not be a wall.

---

## 10. What the privacy policy must disclose

Requirements [official, S10 "Privacy disclosures", S13]:

- Have and abide by a privacy policy that clearly discloses data collection, sharing and usage tied to Google products, "on any platform ... (e.g., web, app ...)", naming cookies, web beacons, IP addresses or other identifiers.
- Tell users "third parties may be placing and reading cookies on your users' browsers" (or use web beacons / IP addresses) when ads are served.
- Optional prominent link to "How Google uses information from sites or apps that use our services" (`https://policies.google.com/technologies/partner-sites`, S36) satisfies the Google-specific disclosure.
- Disclose that "Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites"; "Google's use of advertising cookies enables it and its partners to serve ads to your users"; users "may opt out of personalized advertising by visiting Ads Settings"; users can opt out of third-party vendors' cookies at **aboutads.info**; if you use other networks, list them and link their opt-outs (S13). (The Ads Settings link in S13 is `google.com/settings/ads`; `adssettings.google.com` is the current address of the same page - use it, owner confirm it resolves.)
- Publishers "must not pass any information to Google ... that Google could use or recognize as personally identifiable", must not use Google services to identify users or merge PII without opt-in, and must comply with the EU user consent policy (S37).
- Google: use of cookies, fingerprinting beyond cookies/local storage is restricted for publishers [official via search summary, S10]. The app itself must not add fingerprinting. [inference] Our own `device.ts` capability probe (`deviceMemory`, `hardwareConcurrency`) is local-only; keep it from ever being sent anywhere on ad pages.

Recommended text blocks (draft for owner/legal review - not legal advice):

> **Advertising.** TranscribeVid is free because it shows ads on its information pages (home, how-it-works, FAQ and tool pages), served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet. You may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalized advertising at https://www.aboutads.info. Learn how Google uses data: https://policies.google.com/technologies/partner-sites.
> **Your files.** Your audio and video are processed in your browser on your device and are never uploaded to our servers or sent to Google. We do not show ads on the page where your file is transcribed or on your transcript.
> **Consent and choices.** In the EEA, UK and Switzerland, and in some US states, we ask for your choice through Google's certified consent tool. You can change it at any time via "Privacy and cookie settings" in the footer. US residents of covered states: "Do Not Sell or Share My Personal Information".
> **Storage on your device.** The site stores your settings and downloaded speech models in your browser (Cache API / local storage). Google sets its own cookies when ads load.
> **Children.** The service is for a general audience and is not directed to children under 13 (or under 16 in the EU where applicable).

Text that **must change** (it currently contradicts ads), per the plan's list: `privacy.html:18` ("no tracking and no advertising") and `:71` ("No analytics, advertising or tracking cookies, and no third-party scripts, fonts or trackers"), `faq.html:104-105`, `how-it-works.html:77`, `app.ts:61`, and the tests `legal.spec.ts:76-85`, `faq.spec.ts:257`, `how-it-works.spec.ts:171`, `app.spec.ts:771`. New promise that stays true: "Your file never leaves your device. Ads appear only on information pages and are served by Google, which uses cookies." The claim "no third-party scripts" must be rewritten to "no third-party scripts on the page where your file is processed" and must then actually be true (see section 12.3). "Delete my data now" cannot delete Google's cookies; word it as local data only and point to the privacy-settings link and Ads Settings.

---

## 11. Children, COPPA, and US state laws

- **Children / COPPA** [official, S38, S39]: COPPA covers sites directed to under-13s in the US and general-audience sites "with users known to be under 13". Flagging is optional; Search Console site-level flag or ad-request tag; "including the tag in an ad request will take precedence over any applicable site-level settings"; Google "may begin treating a site as child-directed" itself and tries to notify the publisher. Google's tools "do not relieve" the publisher of legal obligations; consult counsel.
  - The new tag is **TFAT**, attribute `data-tag-for-age-treatment` on every `ins.adsbygoogle`: `1` = child, `2` = teen, `0` = unspecified (default); TFCD and TFUA are **deprecated**; if both TFAT and legacy tags are set the more conservative applies; child/teen treatment disables personalised ads and remarketing (S39).
  - TranscribeVid is a general-audience tool and has no age signal. [inference] Do not set a site-wide child flag (it would remove personalised demand and is not accurate); state "not directed to children" in Terms and Privacy. Keep `data-tag-for-age-treatment="0"` explicit so a future change is a one-line edit. If the owner or counsel wants the conservative route, set `1` on all units (revenue impact not quantified here).
- **US states** [official, S40]: Privacy & messaging "US state regulations" message lists 20 states (California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, Virginia); default link text "Do Not Sell or Share My Personal Information"; the dialog has "Dismiss" and "Opt out"; Opt out sets `SaleOptOut`, `SharingOptOut`, `TargetedAdvertisingOptOut`. Google's help notes the messages may not show when the referrer policy blocks cross-origin referrers (section 9). In Dec 2025 Google added Indiana, Kentucky, Rhode Island and an "All current and future supported US States" targeting toggle (search summary). "It is your responsibility to make sure your messages meet legal requirements" (S40). Whether Google's message auto-honours Global Privacy Control in each state: a June 2025 trade report says Google honours GPC for eight more states and triggers restricted data processing [unverified, secondary source]; confirm in the dashboard help and with counsel.
- Per-request restricted data processing exists via `data-restrict-data-processing="1"` on the ad unit (Ad Manager guidance, search summary) [unverified for AdSense]. Do not hand-roll it; use the message.
- India (the owner's market): DPDP Act and other non-US/EU regimes were **not researched** here; flag for the owner's legal review.

---

## 12. Conflicts with in-browser transcription

### 12.1 COOP / COEP and ads (proven)

Measured with Chrome 155, same page, fake id (`exp1.json`):

| Page headers | `crossOriginIsolated` | Loader script | Ad iframe (`googleads.g.doubleclick.net/pagead/ads`) | Traffic-quality frame (`ep2.adtrafficquality.google/sodar/.../runner.html`) |
|---|---|---|---|---|
| none | false | loaded | requested, response 400 for the fake id (fine) | loaded |
| `COOP: same-origin` + `COEP: require-corp` | true | loaded (CORP: cross-origin) | **`net::ERR_BLOCKED_BY_RESPONSE`** (x2) | **`net::ERR_BLOCKED_BY_RESPONSE`** |
| `COOP: same-origin` + `COEP: credentialless` | true | loaded | **`net::ERR_BLOCKED_BY_RESPONSE`** (x2) | **`net::ERR_BLOCKED_BY_RESPONSE`** |

Google says the same in prose: GPT "does not yet support pages served with COEP"; fixing it "would require extensive changes" to every resource of every ad; Chrome offers a reverse origin trial for `SharedArrayBuffer`; Google "intends to ensure GPT supports COEP pages once that support is available" (page last updated 2024-10-31) [official, S21]. That page is about GPT, not `adsbygoogle.js`; my measurement covers AdSense's loader directly. `credentialless` does **not** rescue it (iframe documents must themselves opt in).

Architecture that follows [inference]:

- **Document A (ad-enabled, no COOP/COEP)**: `/`, tool pages, how-it-works, faq. Home contains the file picker; it hands the chosen `File` / recording to document B.
- **Document B (isolated, ad-free)**: `/jobs/:id` (transcribing and the finished transcript with all current editing, search/replace, export, player sync, stats). Reached by a **full page load** (`location.assign`), not `routerLink`, because COOP/COEP are per-document response headers; a router transition keeps document A's headers. `_headers` carries the isolation headers on `/jobs/*` only. Hand-off of a large `File` across a navigation needs OPFS / IndexedDB / blob in the transcriber track (not mine).
- Optional **Document C (v2)**: a read-only result summary at a distinct URL without COEP, with ads. Not recommended for v1 (section 5).
- The loader must never be injected into B. Also strip any `ins`: B has no `AdSlotComponent` in its component tree. Add a unit test that `/jobs/:id` renders no `.adsbygoogle`.

### 12.2 CPU and memory contention

- **Measured lower bound** (fake id, no creative; `exp2.json`, three repeats each, same page with / without the loader and one 300x250 unit, 6 s after load, via CDP `Performance.getMetrics`): without ads 2 requests / 1 KB / `ScriptDuration` 0 ms / `TaskDuration` 27-44 ms / JS heap 1.0 MB; with loader + 1 unit **12 requests / 277 KB transferred / `ScriptDuration` 48-57 ms / `TaskDuration` 139-181 ms / JS heap 5.2 MB** (main frame only; the ad iframes are separate documents and are not in this heap number; real creatives and the real auction add more). Hardware: Ryzen 7 7730U laptop, so phones are slower by a factor not measured here.
- Whisper in WASM saturates the cores and wants hundreds of MB (the plan's own figures: 300 MB-1 GB usable on iPhone Safari; ~500-700 MB on Android Chrome slow mode). Ads keep running scripts and timers (ad viewability, auctions, video creatives). [inference] Running both in one tab on a phone is the highest-risk combination. **Design rules**: (1) the transcriber document has no ad frames and no ad script; (2) ad pages do not hold a model in memory (the worker dies with the document on the full navigation to B); (3) on ad pages do not preload the Whisper model, VAD or ffmpeg.wasm after the loader has been injected on mobile; preload on explicit user action only; (4) `AdsService.pause()` is called whenever the engine reports busy (e.g. recording on the home page), so no push happens during recording.
- **iOS** [unverified, not measurable here]: no iPhone/iPad available. The WebKit bugs cited in the plan (221530, 269777) describe tab kills under memory pressure; additional ad iframes make this worse. Mitigation = rule (1)-(3) above; test on a real iPhone before enabling the loader on mobile at all, and consider disabling the in-flow unit on iOS `deviceMemory`-poor devices (`navigator.deviceMemory` is not exposed in Safari; use the platform helper in `core/platform.ts`).

### 12.3 Other interactions

- **Screen Wake Lock, microphone permission, print-to-PDF, and `localStorage`** are not affected by ads. The Google loader sets its own cookies on Google domains; the site must not set or modify cookies on Google's domains [official, S10 "Cookies on Google domains" summary].
- **Cache API / `navigator.storage.persist()`** model storage is per-origin and unaffected.
- **No feature depends on ads.** With ads blocked, unfilled, or consent declined, every feature in the owner's list works the same, and the 20% rail simply shows the house note. State this in the acceptance tests (section 16).

---

## 13. Performance / Core Web Vitals

- Facts [measured]: loader 205,680 B raw / 71,549 B gzip; one unit with fake id => 12 requests, 277 KB, ~50 ms script time, +4 MB JS heap in the main frame. Real fill adds creative bytes (unmeasured). The loader's `Cache-Control` is only `private, max-age=3600`, so repeat visits within an hour reuse it.
- Google's recommendations [official, S31]: `async` script; reserve space "to prevent layout shifts"; lazy-load ads that are not immediately visible. This brief implements all three.
- LCP: the loader is not render-blocking (`async`) and is injected after `requestIdleCallback`; nothing ad-related is in the prerendered critical path. INP: avoid pushing ads during user interaction handlers; push from idle callbacks only. CLS: fixed reserved boxes (section 7).
- [inference] Expect Lighthouse to report third-party code and some main-thread time on ad pages; budget it. Keep the transcriber document (B) at a clean Lighthouse score since it has zero third parties.
- Preconnect: the loader response itself sends `Link: <https://googleads.g.doubleclick.net>; rel="preconnect"`; adding a manual `<link rel="preconnect">` to Google hosts in `index.html` would load them on `/privacy` too (a network connection, not a script, but avoid it).
- CSP: Google supports **only strict CSP** for AdSense because its domains "change over time": `object-src 'none'; script-src 'nonce-{random}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:; base-uri 'none'`; a per-response nonce, test with `Content-Security-Policy-Report-Only`; other CSPs "may break without notice" [official, S41]. A static host (Cloudflare Pages `_headers`) cannot generate a nonce per response, and the injected loader needs one. Recommendation: **no script-src CSP on ad pages** (or Report-Only), strict hash-based CSP on the isolated transcriber page (B), which has no ads.

---

## 14. Things the owner must do in the AdSense dashboard (code cannot do these)

1. Create/sign in to the AdSense account (age 18+; payment profile, tax info, PIN/address verification as prompted).
2. Add `https://transcribevid.com` as a site (after it is live on Cloudflare Pages with the custom domain), choose the verification method (meta tag and/or ads.txt line), click Verify, then **Request review**. Do not edit the site while it says "Getting ready" (can delay it).
3. Copy the **publisher id** (`pub-XXXXXXXXXXXXXXXX`; `ca-pub-...` in the tag) and give it to the team: it goes in `public/ads.txt` and in app config. Copy the exact ads.txt line from Sites > the site.
4. After approval, create the **ad units** (Ads > By ad unit > Display ads, "Fixed" size, name them): `rail-160x600`, `rail-300x600`, `inline-300x250` (optionally `inline-728x90`). Give the team each 10-digit **slot id**.
5. **Ads > Auto ads: turn OFF** for the site; also disable anchor, vignette, side rail formats, add the excluded pages (`/privacy`, `/terms`, `/jobs/`, `/logs`) [official, S26].
6. **Privacy & messaging**: create and publish the **European regulations** message (Google CMP; choose ad partners: commonly used set or custom; enter the privacy policy URL `https://transcribevid.com/privacy`), the **US state regulations** message (target "All current and future supported US States"), and optionally the **Ad blocking recovery** message. Set the consent message design/text.
7. Decide **age treatment** (section 11) with counsel; optionally flag the site in Search Console.
8. Decide the **link-download feature** question (section 3) before applying.
9. Check the **ads.txt status** goes to "Authorized"; add `OWNERDOMAIN=transcribevid.com` if desired.
10. Check **Policy center** and the **Ad Experience Report** (Search Console) after launch; Chrome filters ads on sites failing Better Ads Standards (pop-ups, prestitials, auto-play video with sound, large sticky ads) [S42].
11. Provide the **contact email** for `/contact` and the legal entity/name shown in Privacy.
12. Payment threshold/country tax forms are the owner's; not covered here.

---

## 15. Money and brand [inference, no numbers]

Revenue depends on traffic mix and countries; a new site usually earns little at first; I measured nothing about revenue. The alternative named in the plan (donation or single sponsor banner without tracking cookies) keeps the "no tracking" brand and avoids sections 3, 9, 10, 11 entirely. Even if AdSense is chosen, the architecture in section 12.1 keeps the product page third-party free.

---

## 16. Implementation checklist for the Angular team

Paths are relative to `frontend/src/app` unless noted. All of it is browser-only code behind `isPlatformBrowser`.

**A. Config and static files**
- [ ] `core/ads.config.ts`: `ADS_ENABLED` (build-time flag, default false), `PUB_ID`, `SLOTS: { rail160: '...', rail300: '...', inline300: '...' }`. Empty ids => component renders only the reserved placeholder (so dev/test/CI never contact Google).
- [ ] `public/ads.txt`: the AdSense line (+ optional `OWNERDOMAIN`). Verify content type after deploy.
- [ ] `src/index.html`: `<meta name="google-adsense-account" content="ca-pub-...">` (no `<script>`). Keep `<base href="/">`.
- [ ] `public/404.html` so Pages returns a real 404 for unknown URLs; confirm `/ads.txt` and static assets still resolve.
- [ ] `public/_headers`: security headers **without** `Referrer-Policy: no-referrer`/`same-origin` (use `strict-origin-when-cross-origin` or omit); COOP/COEP only on `/jobs/*` (and whatever path the transcriber document uses); no script-src CSP on ad pages; ads.txt `Content-Type: text/plain; charset=utf-8` rule if Pages does not already send it. Do not add `Cross-Origin-*` to `/*` (rules merge, headers repeat with commas).
- [ ] `public/robots.txt`: keep `/jobs/`, `/logs` disallowed; do not add a rule that blocks the AdSense crawler.
- [ ] `public/sitemap.xml`: add `/contact`; no `/privacy` change.

**B. Service and component**
- [ ] `core/ads.service.ts`: `ready` signal; `ensureLoader(): Promise<void>` (single `<script async crossorigin="anonymous" src=".../adsbygoogle.js?client=PUB">`, resolves on `load`, records `error` as `blocked` signal); `canShow(route)` (route `data.ads`, `ADS_ENABLED`, not busy, consent not required to *load*); `pause()/resume()` bound to the transcription engine busy flag; `openPrivacySettings()` (guards `window.googlefc`); `detectBlocked()` (onerror, `adsbygoogle.loaded`).
- [ ] `shared/ad-slot/ad-slot.ts` (+ html/scss): inputs `placement: 'rail' | 'inline'`. Template: wrapper with fixed reserved box (`contain: layout`; `min-height` = unit + label), label "Advertisement" hidden until filled, `aria-label="Advertisement"`, house note slot. `afterNextRender` => IntersectionObserver (`rootMargin: 300px`) / idle callback => check `clientWidth > 0` => create `<ins class="adsbygoogle" data-tv-slot ...>` with explicit `width`/`height` inline style, `data-ad-client`, `data-ad-slot`, `data-tag-for-age-treatment="0"` => `push({})` in try/catch exactly once => `MutationObserver` for `data-ad-status`. `ngOnDestroy`: disconnect observers and `ins.remove()` (only the own element; never `querySelectorAll('ins.adsbygoogle')`).
- [ ] Size decision once per slot instance via `matchMedia` (1680 / 1100 / 332 thresholds, section 7). No resize re-request.
- [ ] `shared/ad-rail/`: layout shell wrapping a page: `display:grid; grid-template-columns: minmax(0,1fr) 20vw` at `min-width: 1100px`; below that, one `<app-ad-slot placement="inline">` placed by the page template at a content break. Print and `prefers-reduced-data` rules: hide slots.
- [ ] Route data: `data: { ads: true }` only on `''`, the six tool routes, `how-it-works`, `faq`; absent elsewhere. A unit test lists every route in `routes` and asserts `ads` is truthy only for that allow-list (extend `routes.spec.ts`).
- [ ] Footer: "Privacy and cookie settings" button (`openPrivacySettings`) on ad pages; on `/privacy` a plain link text pointing to where it is; "Privacy policy" link as `<a href="/privacy">` (full load) on ad pages.
- [ ] `/contact` page (prerendered), added to `app.routes.ts`, `app.routes.server.ts`, sitemap, footer.

**C. Content (approval)**
- [ ] Home and each tool page: original, distinct, prerendered text (no stub). Remove or rewrite anything about downloading from YouTube / Instagram on reviewed pages per the owner's decision (section 3).
- [ ] Rewrite privacy / FAQ / how-it-works / banner strings (section 10 list) and update the four spec files that assert the old promises.
- [ ] Privacy page text from section 10 (Google, cookies, opt-outs, partner link, consent, children).

**D. Tests (vitest)**
- [ ] Prerender output for ad routes contains the reserved container and **no** `<script src*="googlesyndication">` and no `<ins class="adsbygoogle">`.
- [ ] `/privacy`, `/terms`, `/jobs/:id`, `/logs`, not-found: no loader script, no slot, `AdsService.canShow()` false.
- [ ] Slot: pushes exactly once per instance; `ngOnDestroy` removes the `ins`; no push when container width is 0 (stub `clientWidth`); no push while `busy`; second route visit creates a new `ins`; push exception does not break the page.
- [ ] Size selection table: widths 1099, 1100, 1679, 1680, 2560, 800, 600, 331, 332 => expected unit and container.
- [ ] Blocked loader (simulate `error` event) => house note visible, box height unchanged, no thrown errors; app features unaffected.
- [ ] Print stylesheet hides slots.
- [ ] Playwright (scratch, channel chrome) smoke on the built `dist` with a stub ad script: CLS for each ad page at 1366, 1920, 2560, 820, 390 widths is 0 with the stub that fills after 1 s; real-fill CLS to be measured by the owner after approval.
- [ ] Acceptance: every feature in the owner's list works with `ADS_ENABLED=false` and with the loader blocked (no ad-dependent code path in the engine).

**E. After approval, manual QA**
- [ ] `curl -I` the ads.txt; check AdSense Sites page shows Authorized.
- [ ] Browser from an EEA IP/VPN: consent message appears, "Privacy and cookie settings" re-opens it, `/privacy` shows no consent message and no `googlesyndication` request (DevTools Network).
- [ ] DevTools Network on `/jobs/:id`: zero requests to Google hosts.
- [ ] Layout: rail present and 20% wide at 1100, 1366, 1920, 2560; no ad within 24 px of a button.
- [ ] Real iPhone and Android phone test with the loader on the home page, then a full transcription in document B.

---

## 17. Evidence and reproducibility

All raw outputs are in `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/adsense/`:

- `exp-runner/run.mjs` -> `exp1.json` (push semantics, COEP matrix), `exp-runner/run2.mjs` -> `exp2.json` (blocked loader, cost), `exp-runner/run3.mjs` -> `exp3.txt` (hidden helper `ins`). Run: `node run.mjs` inside `exp-runner` (needs `npm i playwright-core@1.49.1`, Chrome installed; `channel: 'chrome'`).
- `adsbygoogle.js` (the 205,680-byte loader as fetched 2026-10-25), `ads-txt-spec/spec.md` (IAB ads.txt v1.1 text from github.com/InteractiveAdvertisingBureau/Supply-Chain-Validation, file `ads.txt v1.1.md`).
- Loader headers: `curl -sI "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"`.
- All browsers and local servers started by the scripts were closed by the scripts (`browser.close()`, `server.close()`); no repo file other than this one was touched.

Limitations to keep in mind: fake publisher id (no fill, no consent message, no Auto ads config, no real creative); desktop Chrome only; no Safari / Firefox / iOS / Android runs; cost numbers are a lower bound; my fetch tool paraphrases pages; several support pages were truncated to the tool, so unread parts may hold extra rules; SPA behaviour of Auto ads and the exact current "ad blocking recovery" restrictions are undocumented in what I could read.

---

## 18. Sources (all accessed 2026-10-25)

- S1 Eligibility requirements - https://support.google.com/adsense/answer/9724
- S2 Make sure your site's pages are ready - https://support.google.com/adsense/answer/7299563
- S3 Add and connect a site; review time - https://support.google.com/adsense/answer/7584263
- S4 Site statuses and ads.txt statuses - https://support.google.com/adsense/answer/9128461
- S5 Google Publisher Policies (index; Enabling dishonest behavior) - https://support.google.com/publisherpolicies/answer/10502938
- S6 Google-served ads on screens without publisher-content - https://support.google.com/publisherpolicies/answer/11112688
- S7 More ads or paid promotional material than publisher-content - https://support.google.com/publisherpolicies/answer/11169917
- S8 Screens with replicated content - https://support.google.com/publisherpolicies/answer/11190248
- S9 Unsupported languages - https://support.google.com/publisherpolicies/answer/10436912
- S10 Privacy disclosures (Publishers must) - https://support.google.com/publisherpolicies/answer/10437794
- S11 Monetization tips (contact info, privacy policy) - https://adsense.google.com/start/resources/monetization-tips-to-optimize-google-adsense/
- S12 Policy update overview, Feb 2025 - https://support.google.com/admanager/answer/15738900 (and mirror https://support.google.com/admob/answer/1348688)
- S13 Required content / privacy policy disclosures for AdSense - https://support.google.com/adsense/answer/1348695
- S14 Privacy policy URL for European regulations messages (no ad tags / consent tag on that page) - https://support.google.com/adsense/answer/10961370
- S15 Troubleshooting consent messages (referrer policy, top-level window, account match) - https://support.google.com/adsense/answer/14660912
- S16 Ad code / connect site (snippet, ads.txt, meta tag) - https://support.google.com/adsense/answer/7584263 (verification options) and https://support.google.com/adsense/answer/9274025 (create display unit; code goes in body)
- S17 Loader snippet shown by Google's responsive-ads page - https://support.google.com/adsense/answer/9183363
- S18 Same page: media-query sizing, `display:none` means no request, external stylesheet note - https://support.google.com/adsense/answer/9183363
- S19 ads.txt in AdSense - https://support.google.com/adsense/answer/7532444
- S20 IAB Tech Lab ads.txt v1.1 - https://github.com/InteractiveAdvertisingBureau/Supply-Chain-Validation (ads.txt v1.1.md); overview https://iabtechlab.com/ads-txt/
- S21 Cross-Origin-Embedder-Policy and Google Publisher Tag - https://developers.google.com/publisher-tag/guides/cross-origin-embedder-policy
- S22 Cloudflare Pages serving, 404.html vs SPA fallback - https://developers.cloudflare.com/pages/configuration/serving-pages/
- S23 Cloudflare Pages `_headers` - https://developers.cloudflare.com/pages/configuration/headers/
- S24 Out of context ads - https://support.google.com/publisherpolicies/answer/11190357
- S25 Ad placement policies (accidental clicks, labels, pop-ups, refresh) - https://support.google.com/adsense/answer/1346295 and https://support.google.com/publisherpolicies/answer/48182
- S26 Auto ads: about / settings / excluded pages - https://support.google.com/adsense/answer/6245305 , https://support.google.com/adsense/answer/9305577 , https://support.google.com/adsense/answer/9214966
- S27 YouTube Terms of Service - https://www.youtube.com/t/terms
- S28 `data-ad-status` - https://support.google.com/adsense/answer/10762946
- S29 Supported ad sizes - https://support.google.com/adsense/answer/6002621
- S30 Responsive ad shape / full-width - https://support.google.com/adsense/answer/9183460
- S31 Effectively loading ads without impacting page speed - https://web.dev/articles/loading-ads-page-speed
- S32 Ad blocking recovery - https://support.google.com/adsense/answer/11576589
- S33 Consent management requirements for EEA, UK, Switzerland - https://support.google.com/adsense/answer/13554116
- S34 EU user consent setup (Google CMP / third-party CMP / own dialog) - https://support.google.com/adsense/answer/7670013
- S35 Consent revocation link - https://support.google.com/adsense/answer/10959060
- S36 How Google uses information from sites that use its services - https://policies.google.com/technologies/partner-sites
- S37 Publishers must (PII, EU consent) - https://support.google.com/publisherpolicies/answer/10436913
- S38 COPPA guidance for publishers - https://support.google.com/adsense/answer/3248194
- S39 Tag for age treatment (TFAT; TFCD/TFUA deprecated) - https://support.google.com/adsense/answer/9009582
- S40 US state regulations message - https://support.google.com/adsense/answer/10961479
- S41 AdSense and Content Security Policy (strict CSP only) - https://support.google.com/adsense/answer/16283098
- S42 Chrome ad filtering / Better Ads Standards - https://blog.chromium.org/2019/01/building-better-world-wide-web.html
