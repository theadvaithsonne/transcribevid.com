import { Route } from '@angular/router';
import robotsTxt from '../../../../public/robots.txt' with { loader: 'text' };
import sitemapXml from '../../../../public/sitemap.xml' with { loader: 'text' };
import { routes } from '../../app.routes';
import { DEFAULT_DESCRIPTION } from '../../core/title.service';
import { serverRoutes } from '../../app.routes.server';
import { TOOL_CONTENT } from './content';
import { TOOL_PAGES, toolRoutePath } from './tool-pages.list';

const BRAND = 'TranscribeVid';
const routeFor = (path: string): Route | undefined => routes.find((r) => r.path === path);
/** the <loc> addresses of public/sitemap.xml, as paths ("/" for the home page) */
const sitemapPaths = () => Array.from(sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)).map((m) => new URL(m[1]).pathname);

describe('TOOL_PAGES (the keyword landing pages)', () => {
  it('has the six pages the site promises (more may be added, none may go missing)', () => {
    expect(TOOL_PAGES.map((t) => t.path)).toEqual(
      expect.arrayContaining([
        '/video-to-text',
        '/audio-to-text',
        '/mp4-to-text',
        '/mp3-to-text',
        '/srt-subtitle-generator',
        '/voice-recording-to-text',
      ]),
    );
  });

  describe('every entry is well formed and unique', () => {
    it('paths are absolute, lower-case, hyphenated, without a trailing slash, and unique', () => {
      const paths = TOOL_PAGES.map((t) => t.path);
      expect(new Set(paths).size).toBe(paths.length);
      for (const p of paths) expect(p).toMatch(/^\/[a-z0-9]+(-[a-z0-9]+)*$/);
    });

    it('labels, titles and descriptions are all different from each other (no duplicate content)', () => {
      for (const key of ['label', 'title', 'description'] as const) {
        const values = TOOL_PAGES.map((t) => t[key]);
        expect(new Set(values).size, key).toBe(values.length);
      }
    });

    it.each(TOOL_PAGES.map((t) => [t.path, t] as const))('%s: the tab title fits a search result (at most 60 characters with the brand)', (_path, t) => {
      expect(t.title.length).toBeGreaterThan(15);
      expect(`${t.title} - ${BRAND}`.length).toBeLessThanOrEqual(60);
    });

    it.each(TOOL_PAGES.map((t) => [t.path, t] as const))('%s: the description fits a search result (50 to 160 characters)', (_path, t) => {
      expect(t.description.length).toBeGreaterThanOrEqual(50);
      expect(t.description.length).toBeLessThanOrEqual(160);
    });

    it.each(TOOL_PAGES.map((t) => [t.path, t] as const))('%s: the description is its own, not the home page one', (_path, t) => {
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

    it('every page has its own h1 and lead', () => {
      const all = Object.values(TOOL_CONTENT);
      expect(new Set(all.map((c) => c.h1)).size).toBe(all.length);
      expect(new Set(all.map((c) => c.lead)).size).toBe(all.length);
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
      expect(['mp3-to-text', 'audio-to-text', 'voice-recording-to-text'].map(kind)).toEqual(['audio', 'audio', 'audio']);
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
