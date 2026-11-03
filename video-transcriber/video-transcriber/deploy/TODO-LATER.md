# To do later (owner)

Tick the boxes as you go. Each item is something only you can do (accounts, posts, messages). The words to paste are in
`deploy/LISTINGS.md`. Added 29 October 2026. The whole list is about 4 hours, spread over weeks; do one item at a time.

---

## Independent mentions: get other websites to talk about TranscribeVid

Why: when ChatGPT was asked about the site it said "not fully verified" because no independent site mentions it yet.
Each real listing, article or comment is the independent information it is missing. It is also the main thing that
lifts the site in Google. Say that you made it, every time.

### Prepare once (30 minutes)
- [ ] Choose one handle (for example `transcribevid`) and check it is free on YouTube, Instagram, X, GitHub, Reddit,
      LinkedIn and Product Hunt. If it is taken, add the same suffix everywhere.
- [ ] Use one logo (`favicon.svg`), one tagline and one contact e-mail on every profile.
- [ ] Take 3 to 4 screenshots, 1280 x 800, with no personal data: a file dropped in, a finished transcript, the
      download menu, the Hindi page.
- [ ] Record one 30-second screen clip: drop a file, the text appears, download the SRT.
- [ ] Open `deploy/LISTINGS.md`, section 2 (name, one sentence, short description, feature list, tags) and keep it beside you.

### Week 1: three listing sites (about 2 hours)
- [ ] **AlternativeTo**: make an account, choose *Add application*, paste the name, address, short description and 5 to
      8 features, licence *Free*, platform *Web* (LISTINGS.md section 3).
- [ ] AlternativeTo: add TranscribeVid as an alternative on the pages of Otter, TurboScribe, Notta, Rev and Sonix, with
      the reason text from section 3. New entries are checked by hand and can take days: do not submit twice.
- [ ] **SaaSHub**: *Submit a product*, category Transcription, same text, same alternatives (section 4).
- [ ] **Product Hunt**: make your account now with a real photo and name, and prepare the page (section 5). Launch in
      week 4, not now.
- [ ] **GitHub**: a public profile with your real name, and (if you decide to share the code) a repository whose README
      links the site (section 9).

### Week 2 to 3: write to the people who publish lists (about 1 hour a week)
- [ ] Search for recent articles titled like "best free transcription tools", "transcribe video to text free" and
      "Otter alternatives". Write down 10 authors and their contact pages in a sheet.
- [ ] Send the message in LISTINGS.md section 10b (it leads with the sourced comparison table,
      `/guides/free-video-to-text-tools-compared`). One message per person, no follow-up pestering.
- [ ] Send 10 more the next week.
- [ ] **Show HN** in week 3 (section 6): a weekday, stay online all day, answer every comment.

### Week 4 to 6: launches and your own story
- [ ] **Product Hunt launch** (a Tuesday to Thursday morning, Pacific time). First comment text is in section 5. Do
      not ask friends for upvotes in bulk: it is against their rules.
- [ ] **Reddit**: one post, one fitting community, as the maker, with the honest limits, only where self-posts are
      allowed (section 7). Read that community's rules first.
- [ ] **Your own story** on dev.to, Hashnode or Medium (section 8): "I built a transcription site that never uploads
      your video", with real numbers and what went wrong.

### Keep track
- [ ] Make a sheet with the columns: where, date, link, live or not, answer. Send it to me and I will check that every
      link resolves to the right page.

### After 2 to 4 weeks: ask the assistants again
- [ ] In Cloudflare, check the AI crawler setting (Security, then Bots). Right now GPTBot, ClaudeBot and PerplexityBot
      are blocked and Perplexity cannot cite the site. Decide whether to allow them.
- [ ] Ask ChatGPT, Perplexity and Claude: "Is transcribevid.com safe and good for transcribing videos?" Write down who
      names the site and what they say. Send me what they answer.

Rules for all of it: only real mentions by real people; no fake reviews or accounts; say you are the maker; one post
per place. If a form or rule on these sites has changed since I wrote this, follow the on-screen labels and use the same text.

---

## Renew the security contact file (once a year)
- [ ] By 30 September 2027: open `frontend/public/.well-known/security.txt`, move `Expires:` about a year ahead (it must be under a year from today) and ask for a deploy.
      Researchers' tools treat an expired file as no file.
