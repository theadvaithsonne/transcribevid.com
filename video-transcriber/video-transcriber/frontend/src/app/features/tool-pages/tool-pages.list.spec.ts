import { Route } from '@angular/router';
import robotsTxt from '../../../../public/robots.txt' with { loader: 'text' };
import sitemapXml from '../../../../public/sitemap.xml' with { loader: 'text' };
import { routes } from '../../app.routes';
import { DEFAULT_DESCRIPTION } from '../../core/title.service';
import { serverRoutes } from '../../app.routes.server';
import { TOOL_CONTENT } from './content';
import { editionText } from './tool-page';
import { TOOL_GROUPS, TOOL_PAGES, TOOL_PAGE_ENTRIES, editionPages, toolRoutePath } from './tool-pages.list';

const BRAND = 'TranscribeVid';
const routeFor = (path: string): Route | undefined => routes.find((r) => r.path === path);
/** the <loc> addresses of public/sitemap.xml, as paths ("/" for the home page) */
const sitemapPaths = () => Array.from(sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)).map((m) => new URL(m[1]).pathname);

/** both editions' lists: the server one (what this build uses) and the in-browser one (the static website) */
const EDITIONS = [
  ['server', editionPages(TOOL_PAGE_ENTRIES, false)],
  ['in-browser', editionPages(TOOL_PAGE_ENTRIES, true)],
] as const;
const BOTH = EDITIONS.flatMap(([edition, list]) => list.map((t) => [`${edition} ${t.path}`, t] as const));

describe('TOOL_PAGES (the keyword landing pages)', () => {
  it('has the twenty pages the site promises (more may be added, none may go missing)', () => {
    expect(TOOL_PAGES.map((t) => t.path)).toEqual(
      expect.arrayContaining([
        '/video-to-text',
        '/audio-to-text',
        '/mp4-to-text',
        '/mp3-to-text',
        '/wav-to-text',
        '/m4a-to-text',
        '/hindi-audio-to-text',
        '/hinglish-transcription',
        '/translate-hindi-audio-to-english',
        '/srt-subtitle-generator',
        '/subtitle-generator-for-reels',
        '/voice-recording-to-text',
        '/whatsapp-voice-note-to-text',
        '/meeting-recording-to-text',
        '/interview-transcription',
        '/lecture-to-text',
        '/podcast-to-text',
        '/private-transcription',
        '/turboscribe-alternative',
        '/otter-ai-alternative',
      ]),
    );
    expect(TOOL_PAGES.length).toBeGreaterThanOrEqual(20);
  });

  describe('the two editions', () => {
    it('this build (tests, ng serve, self-hosted) uses the server words', () => {
      expect(TOOL_PAGES).toEqual(editionPages(TOOL_PAGE_ENTRIES, false));
      expect(TOOL_PAGES.map((t) => [t.title, t.description])).toEqual(TOOL_PAGE_ENTRIES.map((t) => [t.title, t.description]));
    });

    it('the in-browser edition takes each browser title and description, and keeps the rest', () => {
      const browser = editionPages(TOOL_PAGE_ENTRIES, true);
      TOOL_PAGE_ENTRIES.forEach((t, i) => {
        expect(browser[i].path).toBe(t.path);
        expect(browser[i].label).toBe(t.label);
        expect(browser[i].title).toBe(t.browser?.title ?? t.title);
        expect(browser[i].description).toBe(t.browser?.description ?? t.description);
      });
      expect(browser.find((t) => t.path === '/private-transcription')!.title).toBe('Private Transcription: Files Never Uploaded');
    });

    it('"no upload" is promised only in the in-browser words (the server editions do upload)', () => {
      const promise = /no upload|not uploaded|nothing is uploaded|never leaves? your device|never reach|never uploaded|without uploading|runs in your browser/i;
      for (const t of editionPages(TOOL_PAGE_ENTRIES, false)) expect(`${t.title} ${t.description}`, t.path).not.toMatch(promise);
      for (const c of Object.values(TOOL_CONTENT)) {
        const server = editionText(c, false);
        const shown = [server.h1, server.lead, ...server.why, ...server.steps.map((x) => x.text), ...server.faqs.map((f) => f.answer)];
        for (const line of shown) expect(line).not.toMatch(promise);
      }
    });
  });

  describe('groups and the footer', () => {
    it('every page is in a known group, and the list is ordered by group (the flat and the grouped lists read the same)', () => {
      const order = TOOL_GROUPS.map((g) => g.id);
      const ranks = TOOL_PAGES.map((t) => order.indexOf(t.group));
      expect(ranks.every((r) => r >= 0)).toBe(true);
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
      for (const g of TOOL_GROUPS) expect(TOOL_PAGES.some((t) => t.group === g.id), g.id).toBe(true);
    });

    it('the footer links only a few pages, the most important ones (the home page links the rest)', () => {
      const footer = TOOL_PAGES.filter((t) => t.footer).map((t) => t.path);
      expect(footer.length).toBeGreaterThanOrEqual(6);
      expect(footer.length).toBeLessThanOrEqual(8);
      expect(footer).toEqual(expect.arrayContaining(['/video-to-text', '/audio-to-text', '/hindi-audio-to-text', '/hinglish-transcription']));
    });
  });

  describe('every entry is well formed and unique', () => {
    it('paths are absolute, lower-case, hyphenated, without a trailing slash, and unique', () => {
      const paths = TOOL_PAGES.map((t) => t.path);
      expect(new Set(paths).size).toBe(paths.length);
      for (const p of paths) expect(p).toMatch(/^\/[a-z0-9]+(-[a-z0-9]+)*$/);
    });

    it.each(EDITIONS)('%s edition: labels, titles and descriptions are all different from each other (no duplicate content)', (_edition, list) => {
      for (const key of ['label', 'title', 'description'] as const) {
        const values = list.map((t) => t[key]);
        expect(new Set(values).size, key).toBe(values.length);
      }
    });

    it.each(BOTH)('%s: the tab title fits a search result (at most 60 characters with the brand)', (_path, t) => {
      expect(t.title.length).toBeGreaterThan(15);
      expect(`${t.title} - ${BRAND}`.length).toBeLessThanOrEqual(60);
    });

    it.each(BOTH)('%s: the description fits a search result (120 to 160 characters)', (_path, t) => {
      expect(t.description.length).toBeGreaterThanOrEqual(120);
      expect(t.description.length).toBeLessThanOrEqual(160);
    });

    it.each(BOTH)('%s: the description is its own, not the home page one', (_path, t) => {
      expect(t.description).not.toBe(DEFAULT_DESCRIPTION);
    });

    it('toolRoutePath is the path without the leading slash', () => {
      expect(toolRoutePath(TOOL_PAGES[0])).toBe('video-to-text');
      expect(toolRoutePath({ ...TOOL_PAGES[0], path: '/x-y' })).toBe('x-y');
    });
  });

  describe('is in step with the routes (app.routes.ts)', () => {
    it.each(TOOL_PAGES.map((t) => [t.path, t] as const))('%s has a route with the same title, description, label and a lazy component', (_path, t) => {
      const route = routeFor(toolRoutePath(t));
      expect(route, `no route for ${t.path}`).toBeDefined();
      expect(route!.title).toBe(t.title);
      expect(route!.data).toMatchObject({ description: t.description, label: t.label, tool: toolRoutePath(t), app: true });
      expect(typeof route!.loadComponent).toBe('function');
    });

    it('has no tool route that is not in the list', () => {
      const listed = new Set(TOOL_PAGES.map(toolRoutePath));
      const toolRoutes = routes.filter((r) => (r.data as { tool?: string } | undefined)?.tool);
      expect(toolRoutes.length).toBe(TOOL_PAGES.length);
      for (const r of toolRoutes) expect(listed.has(r.path!)).toBe(true);
    });

    it('every tool page is also prerendered on the server routes', () => {
      const prerendered = serverRoutes.map((r) => r.path);
      for (const t of TOOL_PAGES) expect(prerendered).toContain(toolRoutePath(t));
    });

    it('the catch-all 404 route comes last, so no tool page is shadowed', () => {
      expect(routes.at(-1)!.path).toBe('**');
      const firstTool = routes.findIndex((r) => r.path === toolRoutePath(TOOL_PAGES[0]));
      expect(firstTool).toBeGreaterThan(-1);
      expect(firstTool).toBeLessThan(routes.length - 1);
    });
  });

  describe('is in step with the page text (content/*)', () => {
    it('has text for exactly the listed pages', () => {
      expect(Object.keys(TOOL_CONTENT).sort()).toEqual(TOOL_PAGES.map(toolRoutePath).sort());
    });

    it('every page has its own h1 and lead, in both editions', () => {
      const all = Object.values(TOOL_CONTENT);
      for (const inBrowser of [false, true]) {
        const text = all.map((c) => editionText(c, inBrowser));
        expect(new Set(text.map((t) => t.h1)).size).toBe(all.length);
        expect(new Set(text.map((t) => t.lead)).size).toBe(all.length);
      }
    });

    it.each(Object.entries(TOOL_CONTENT))('%s: related links are 4 to 6 other, existing pages, none twice', (slug, c) => {
      const paths = new Set(TOOL_PAGES.map((t) => t.path));
      expect(c.related.length).toBeGreaterThanOrEqual(4);
      expect(c.related.length).toBeLessThanOrEqual(6);
      expect(new Set(c.related).size).toBe(c.related.length);
      for (const p of c.related) {
        expect(paths.has(p), p).toBe(true);
        expect(p).not.toBe('/' + slug);
      }
    });

    it('every page is a related link of at least one other page (none is reached from the home page only)', () => {
      const linked = new Set(Object.values(TOOL_CONTENT).flatMap((c) => c.related));
      for (const t of TOOL_PAGES) expect(linked.has(t.path), t.path).toBe(true);
    });

    it('the comparison pages, and only they, have a dated, sourced comparison and say where the other tool is better', () => {
      for (const t of TOOL_PAGES) {
        const c = TOOL_CONTENT[toolRoutePath(t)];
        const cmp = c.comparison;
        if (t.group !== 'compare') {
          expect(cmp, t.path).toBeUndefined();
          continue;
        }
        expect(cmp, t.path).toBeDefined();
        expect(cmp!.checked).toMatch(/^\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) 20\d\d$/);
        expect(cmp!.rows.length).toBeGreaterThanOrEqual(5);
        expect(cmp!.sources.length).toBeGreaterThanOrEqual(2);
        for (const s of cmp!.sources) expect(s.url).toMatch(/^https:\/\/[a-z0-9.-]+\.[a-z]+\//);
        expect(new Set(cmp!.rows.map((r) => r.topic)).size).toBe(cmp!.rows.length);
        for (const r of cmp!.rows) for (const x of [r.topic, r.us, r.them, r.browserUs ?? 'x']) expect(x.trim()).not.toBe('');
        expect(c.tipsTitle).toBe(`When ${cmp!.them.replace(/\.ai$/, '')} is the better choice`);
      }
    });

    it('no page promises a Word file or a link input (not what the product does)', () => {
      expect(JSON.stringify(TOOL_CONTENT)).not.toMatch(/\bdocx\b|Word document/i);
      for (const c of Object.values(TOOL_CONTENT)) {
        for (const s of c.steps) expect(`${s.text} ${s.browser?.text ?? ''}`).not.toMatch(/paste (a|the|your) (link|url)/i);
      }
    });

    it.each(Object.entries(TOOL_CONTENT))('%s: four steps, a few formats, questions of its own and tips', (_slug, c) => {
      expect(c.steps.length).toBe(4);
      expect(c.accepts.length).toBeGreaterThanOrEqual(3);
      expect(c.downloads.length).toBeGreaterThanOrEqual(3);
      expect(c.faqs.length).toBeGreaterThanOrEqual(4);
      expect(c.faqs.length).toBeLessThanOrEqual(5);
      expect(c.tips.length).toBeGreaterThanOrEqual(3);
      expect(c.why.length).toBeGreaterThanOrEqual(1);
      expect(['video', 'audio']).toContain(c.dropKind);
      for (const s of [...c.steps, ...c.tips]) {
        expect(s.title.trim()).not.toBe('');
        expect(s.text.trim()).not.toBe('');
      }
      for (const f of c.faqs) {
        expect(f.question.trim().endsWith('?')).toBe(true);
        expect(f.answer.trim()).not.toBe('');
      }
    });

    it('no two pages share a question', () => {
      const qs = Object.values(TOOL_CONTENT).flatMap((c) => c.faqs.map((f) => f.question));
      expect(new Set(qs).size).toBe(qs.length);
    });

    it('the pages that take audio only are the audio ones; the video pages also accept audio', () => {
      const kind = (slug: string) => TOOL_CONTENT[slug].dropKind;
      const audio = ['mp3-to-text', 'audio-to-text', 'voice-recording-to-text', 'wav-to-text', 'm4a-to-text', 'whatsapp-voice-note-to-text'];
      expect(audio.map(kind)).toEqual(audio.map(() => 'audio'));
      expect(['video-to-text', 'mp4-to-text', 'srt-subtitle-generator'].map(kind)).toEqual(['video', 'video', 'video']);
    });

    it('the in-browser variants are complete sentences, and the browser questions are unique too', () => {
      const all = Object.values(TOOL_CONTENT);
      for (const c of all) {
        for (const x of [...c.steps, ...c.tips]) {
          if (!x.browser) continue;
          expect(x.browser.text.trim()).not.toBe('');
          if (x.browser.title !== undefined) expect(x.browser.title.trim()).not.toBe('');
        }
        for (const f of c.faqs) {
          if (!f.browser) continue;
          expect(f.browser.answer.trim()).not.toBe('');
          if (f.browser.question !== undefined) expect(f.browser.question.trim().endsWith('?')).toBe(true);
          // there are no limits in the in-browser edition, so its answers have nothing to fill in
          expect(f.browser.answer).not.toMatch(/\{[a-z]+\}/);
        }
        if (c.browserWhy) expect(c.browserWhy.length).toBe(c.why.length);
      }
      const browserQs = all.flatMap((c) => c.faqs.map((f) => f.browser?.question ?? f.question));
      expect(new Set(browserQs).size).toBe(browserQs.length);
    });

    it('only the {limits} placeholder is used in the answers, and every placeholder is filled in by the page', () => {
      const placeholders = Object.values(TOOL_CONTENT).flatMap((c) => c.faqs.flatMap((f) => f.answer.match(/\{[a-z]+\}/g) ?? []));
      for (const p of placeholders) expect(p).toBe('{limits}');
    });
  });

  describe('is in step with public/sitemap.xml and robots.txt', () => {
    it('lists every tool page, once', () => {
      const paths = sitemapPaths();
      for (const t of TOOL_PAGES) expect(paths.filter((p) => p === t.path).length, t.path).toBe(1);
    });

    it('lists the home page and the other public pages, and nothing private', () => {
      const paths = sitemapPaths();
      for (const p of ['/', '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms']) expect(paths).toContain(p);
      for (const p of paths) {
        expect(p).not.toMatch(/^\/(jobs|logs|api)(\/|$)/);
      }
      expect(new Set(paths).size).toBe(paths.length);
    });

    it('every address in the sitemap is a real page of the app (it has a route, or is the home page)', () => {
      for (const p of sitemapPaths()) {
        const known = p === '/' || routes.some((r) => r.path === p.slice(1) && !r.redirectTo);
        expect(known, p).toBe(true);
      }
    });

    it('uses the public brand address and no <lastmod> (a date nothing keeps accurate is worse than none)', () => {
      for (const m of sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) expect(m[1]).toMatch(/^https:\/\/transcribevid\.com(\/|$)/);
      expect(sitemapXml).not.toMatch(/<lastmod>[^<]*<\/lastmod>/);
    });

    it('robots.txt points to the sitemap and keeps the private paths out', () => {
      expect(robotsTxt).toContain('Sitemap: https://transcribevid.com/sitemap.xml');
      expect(robotsTxt).toMatch(/^Disallow: \/logs$/m);
      expect(robotsTxt).toMatch(/^Disallow: \/jobs\/$/m);
      expect(robotsTxt).toMatch(/^Disallow: \/api\/$/m);
      for (const t of TOOL_PAGES) expect(robotsTxt).not.toContain(`Disallow: ${t.path}`);
    });
  });
});
