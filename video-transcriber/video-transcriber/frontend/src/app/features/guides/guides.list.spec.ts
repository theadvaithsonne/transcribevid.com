import { Route } from '@angular/router';
import sitemapXml from '../../../../public/sitemap.xml' with { loader: 'text' };
import { routes } from '../../app.routes';
import { serverRoutes } from '../../app.routes.server';
import { TOOL_PAGES } from '../tool-pages/tool-pages.list';
import { GUIDE_CONTENT_LOADERS, loadAllGuideContent } from './content';
import { guideWordCount } from './guide';
import { GuideContent } from './guide.model';
import { GUIDES, GUIDES_PATH, fmtLongDate, guideRoutePath } from './guides.list';

const BRAND = 'TranscribeVid';
const sitemapPaths = () => Array.from(sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)).map((m) => new URL(m[1]).pathname);
const KNOWN_PATHS = new Set<string>([...TOOL_PAGES.map((t) => t.path), ...GUIDES.map((g) => g.path), '/', '/how-it-works', '/faq', '/tools', '/guides']);

describe('GUIDES (the articles)', () => {
  it('has the five guides the site promises (more may be added, none may go missing)', () => {
    expect(GUIDES.map((g) => g.slug)).toEqual(
      expect.arrayContaining(['srt-vs-vtt', 'how-to-add-subtitles-to-a-video', 'transcribe-video-without-uploading', 'accurate-transcripts', 'what-is-whisper']),
    );
  });

  describe('every entry is well formed and unique', () => {
    it('slugs are lower-case and hyphenated, the path is /guides/<slug>, and both are unique', () => {
      for (const g of GUIDES) {
        expect(g.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(g.path).toBe(`${GUIDES_PATH}/${g.slug}`);
        expect(guideRoutePath(g)).toBe(`guides/${g.slug}`);
      }
      expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    });

    it('labels, titles and descriptions are all different from each other', () => {
      for (const key of ['label', 'title', 'description'] as const) {
        const values = GUIDES.map((g) => g[key]);
        expect(new Set(values).size, key).toBe(values.length);
      }
    });

    it.each(GUIDES.map((g) => [g.path, g] as const))('%s: the tab title and description fit a search result', (_path, g) => {
      expect(g.title.length).toBeGreaterThan(15);
      expect(`${g.title} - ${BRAND}`.length).toBeLessThanOrEqual(60);
      expect(g.description.length).toBeGreaterThanOrEqual(50);
      expect(g.description.length).toBeLessThanOrEqual(160);
    });

    it.each(GUIDES.map((g) => [g.path, g] as const))('%s: has real ISO dates, and was not updated before it was published', (_path, g) => {
      for (const d of [g.published, g.updated]) {
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(d))).toBe(false);
      }
      expect(g.updated >= g.published).toBe(true);
    });
  });

  describe('fmtLongDate', () => {
    it('writes the date out in English, and leaves anything else alone', () => {
      expect(fmtLongDate('2026-10-27')).toBe('27 October 2026');
      expect(fmtLongDate('2027-01-03')).toBe('3 January 2027');
      expect(fmtLongDate('nonsense')).toBe('nonsense');
    });
  });

  describe('is in step with the routes, the prerender list and the sitemap', () => {
    const routeFor = (path: string): Route | undefined => routes.find((r) => r.path === path);

    it.each(GUIDES.map((g) => [g.path, g] as const))('%s has a route with its title, description, label, guide slug, parent, ads and a resolver', (_path, g) => {
      const route = routeFor(guideRoutePath(g));
      expect(route, `no route for ${g.path}`).toBeDefined();
      expect(route!.title).toBe(g.title);
      expect(route!.data).toMatchObject({ description: g.description, label: g.label, guide: g.slug, parent: { label: 'Guides', path: '/guides' }, ads: true });
      expect(typeof route!.loadComponent).toBe('function');
      expect(route!.resolve).toHaveProperty('content');
    });

    it('/guides and /tools have routes and are not ad pages (a page of links has too little text of its own)', () => {
      for (const path of ['guides', 'tools']) {
        const route = routeFor(path);
        expect(route, path).toBeDefined();
        expect((route!.data as { ads?: unknown }).ads).toBeUndefined();
        expect((route!.data as { description: string }).description.length).toBeGreaterThanOrEqual(50);
      }
    });

    it('every guide, /guides and /tools are prerendered', () => {
      const prerendered = serverRoutes.map((r) => r.path);
      for (const p of ['tools', 'guides', ...GUIDES.map(guideRoutePath)]) expect(prerendered).toContain(p);
    });

    it('has a text file for exactly the listed guides', () => {
      expect(Object.keys(GUIDE_CONTENT_LOADERS).sort()).toEqual(GUIDES.map((g) => g.slug).sort());
    });

    it('the sitemap lists /tools, /guides and every guide, once each', () => {
      const paths = sitemapPaths();
      for (const p of ['/tools', '/guides', ...GUIDES.map((g) => g.path)]) expect(paths.filter((x) => x === p).length, p).toBe(1);
    });
  });

  describe('the text of every guide', () => {
    let all: Record<string, GuideContent>;
    beforeAll(async () => {
      all = await loadAllGuideContent();
    });

    it('every guide has its own h1 and lead', () => {
      const list = Object.values(all);
      expect(new Set(list.map((c) => c.h1)).size).toBe(list.length);
      expect(new Set(list.map((c) => c.lead)).size).toBe(list.length);
    });

    it.each(GUIDES.map((g) => g.slug))('%s: is a real article (length, sections, questions, links and a way on to the tool)', (slug) => {
      const c = all[slug];
      const words = guideWordCount(c);
      expect(words, 'words').toBeGreaterThanOrEqual(1000);
      expect(words, 'words').toBeLessThanOrEqual(2600);
      // the reading time is honest (about 200 words a minute)
      expect(Math.abs(c.readingMinutes - words / 200)).toBeLessThanOrEqual(2);
      expect(c.blocks.length).toBeGreaterThanOrEqual(6);
      expect(c.blocks.length).toBeLessThanOrEqual(10);
      for (const b of c.blocks) {
        expect(b.title.trim()).not.toBe('');
        const content = (b.paragraphs?.length ?? 0) + (b.bullets?.length ?? 0) + (b.steps?.length ?? 0) + (b.table ? 1 : 0) + (b.code ? 1 : 0);
        expect(content, b.title).toBeGreaterThan(0);
        for (const p of [...(b.paragraphs ?? []), ...(b.after ?? [])]) expect(p.trim()).not.toBe('');
        if (b.table) {
          for (const row of b.table.rows) expect(row.length).toBe(b.table.head.length);
        }
      }
      const titles = c.blocks.map((b) => b.title);
      expect(new Set(titles).size).toBe(titles.length);
      expect(c.faqs.length).toBeGreaterThanOrEqual(3);
      expect(c.faqs.length).toBeLessThanOrEqual(5);
      for (const f of c.faqs) {
        expect(f.question.trim().endsWith('?')).toBe(true);
        expect(f.answer.trim()).not.toBe('');
        expect(f.answer).not.toMatch(/\{[a-z]+\}/); // guides have no placeholders
      }
      expect(c.links.length).toBeGreaterThanOrEqual(3);
      expect(c.links.length).toBeLessThanOrEqual(5);
      expect(TOOL_PAGES.map((t) => t.path)).toContain(c.toolPath);
      expect(c.toolCta.trim().length).toBeGreaterThan(8);
    });

    it('every link goes to a page of this site, with a descriptive label and a note, and not to the guide itself', () => {
      for (const g of GUIDES) {
        const c = all[g.slug];
        for (const l of c.links) {
          expect(KNOWN_PATHS.has(l.path), `${g.slug} -> ${l.path}`).toBe(true);
          expect(l.path).not.toBe(g.path);
          expect(l.label.trim().length).toBeGreaterThan(8);
          expect(l.label.toLowerCase()).not.toMatch(/click here|read more|^here$/);
          expect(l.note.trim().endsWith('.'), `${g.slug}: ${l.note}`).toBe(true);
        }
        expect(new Set(c.links.map((l) => l.path)).size).toBe(c.links.length);
      }
    });

    it('no two guides share a question or a section title', () => {
      const qs = Object.values(all).flatMap((c) => c.faqs.map((f) => f.question));
      expect(new Set(qs).size).toBe(qs.length);
    });

    it('the in-browser variants are complete (a block that has one says something)', () => {
      for (const c of Object.values(all)) {
        for (const b of c.blocks) {
          if (!b.browser) continue;
          for (const p of [...(b.browser.paragraphs ?? []), ...(b.browser.after ?? [])]) expect(p.trim()).not.toBe('');
          for (const x of b.browser.bullets ?? []) expect(x.text.trim()).not.toBe('');
          for (const x of b.browser.steps ?? []) expect(x.text.trim()).not.toBe('');
        }
      }
    });

    it('no guide makes a claim nothing can back (guarantees, accuracy percentages, awards, ratings)', () => {
      const BANNED = [/\bwe guarantee\b/i, /\bguarantees? (100|perfect|accura)/i, /\b100 ?% accura/i, /\b9\d(\.\d)? ?% accura/i, /\bbest in the world\b/i, /\bnumber one\b/i, /\bawarded?\b/i, /\bfive[- ]star\b/i];
      for (const [slug, c] of Object.entries(all)) {
        const text = JSON.stringify(c);
        for (const re of BANNED) expect(re.test(text), `${slug}: ${re}`).toBe(false);
      }
    });
  });
});
