# Deploying the website (Cloudflare Pages, direct upload)

Git push never deploys. A deploy happens only when the owner says "deploy" for that release. Run everything from
`video-transcriber/video-transcriber/frontend` unless a step says otherwise.

## Before

1. **Tests**: `npx ng test --watch=false` (frontend), `node --test scripts/*.test.mjs` from `video-transcriber/video-transcriber`,
   the backend tests if the backend changed, `node scripts/extract-i18n.mjs --check`.
2. **Is the live commit an ancestor?** `npx wrangler pages deployment list --project-name transcribevid` shows the live commit;
   `git merge-base --is-ancestor <live commit> HEAD` must succeed. Commit first: the deployed commit hash must be the real
   `git rev-parse HEAD`, never typed by hand.
3. **Archive the live build before you overwrite it** (only needed once: from now on step 6 does it for every build). The build
   folder `dist/frontend/browser` is the live version until you run a new build. Check that its `main-*.js` name equals the one in
   `curl -s https://transcribevid.com/ | grep -o 'main-[A-Z0-9]*\.js'`, then
   `node ../scripts/pages-keep-previous.mjs dist/frontend/browser ../.deploy-archive <live commit, 8 characters> --keep 0`.

## Build

4. `npm run build:pages` (not a plain `ng build`: it writes the flattened pages, `_headers` and `_redirects`). The first download
   must stay under 500 kB (`Initial total` in the output).
5. `node ../scripts/audit-prerender.mjs` must say every page is clean.

## Keep the earlier versions' files (so open pages do not break)

6. `node ../scripts/pages-keep-previous.mjs dist/frontend/browser ../.deploy-archive $(git rev-parse --short=8 HEAD)`

   Why: a build renames every script file, and a deploy removes the old names. A visitor who opened the site before the deploy
   asks for the OLD names when they start their first transcription, open a page or switch language, and gets a 404. This step
   uploads the newest two earlier builds' hashed files next to the new ones (`--keep 2` is the default). Their names cannot clash,
   because they are content hashes. The archive is local (`.deploy-archive/`, git-ignored); only the newest five are kept.
   The deployment stays far under Cloudflare's 20,000-file limit (about 1,100 files per build plus about 500 per kept build).

## Pick a quiet moment

7. `curl -s https://transcribevid.com/_live/count` gives the number of pages open right now. If it is more than a few, wait a
   little: with step 6 an open page still works, but a quiet moment costs nothing. Never deploy while a visitor is likely to be
   in the middle of a long transcription if it can wait (the page keeps running, but a reload would lose its progress).

## Deploy

8. `npx wrangler pages deploy dist/frontend/browser --project-name transcribevid --branch main --commit-hash "$(git rev-parse HEAD)" --commit-message "<what changed>"`

## After

9. Check: `ads.txt` (publisher id), `/.well-known/security.txt` (200, plain text, Expires still ahead), `robots.txt`, `sitemap.xml` (569 addresses), the AdSense meta tag, 15 or so pages answer 200,
   the new text is in the HTML, `curl https://transcribevid.com/api/stats` still answers, and `wrangler pages deployment list`
   shows the new commit as production.
10. `node ../scripts/indexnow.mjs --key 18e4d9821ce04f0329fceb62f7dca39c` (from `video-transcriber/video-transcriber`).

## Workers (separate from the website)

The counter (`workers/counter`) and the live count (`workers/live`) are deployed on their own with `npx wrangler deploy` from their
folder. Rules learnt: a route pattern needs a trailing `*` to match a URL with a query string; `transcribevid.com/api/*` belongs to the
counter and outranks more specific routes, so other Workers live outside `/api`; Durable Objects and cron triggers need a
workers.dev name on the account (not set). Roll a Worker back with `npx wrangler rollback`.

## Roll back the website

Cloudflare Pages keeps every deployment. In the dashboard (Workers & Pages, transcribevid, Deployments) pick the earlier one and
choose "Rollback to this deployment".

## Once a year

`frontend/public/.well-known/security.txt` expires on 2027-10-31 (RFC 9116 wants an expiry under a year ahead). Move `Expires:` forward before then and deploy;
`scripts/security-txt.test.mjs` fails once it is in the past and warns 45 days before.
