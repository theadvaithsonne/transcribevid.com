import { RenderMode } from '@angular/ssr';
import sitemapXml from '../../public/sitemap.xml' with { loader: 'text' };
import { routes } from './app.routes';
import { makeServerRoutes, serverRoutes } from './app.routes.server';
import { AVAILABLE } from './i18n/generated';
import { OTHER_LOCALES } from './i18n/locales';
import { TOOL_PAGES, toolRoutePath } from './features/tool-pages/tool-pages.list';

const modeOf = (path: string) => serverRoutes.find((r) => r.path === path)?.renderMode;
const sitemapPaths = () => Array.from(sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)).map((m) => new URL(m[1]).pathname);

describe('server routes (what is prerendered at build time)', () => {
  it('prerenders the public pages that are in the sitemap (besides the home page, which has its own decision)', () => {
    for (const path of ['how-it-works', 'faq', 'about', 'contact', 'privacy', 'terms']) {
      expect(modeOf(path), path).toBe(RenderMode.Prerender);
    }
  });

  it('prerenders every keyword page', () => {
    for (const t of TOOL_PAGES) expect(modeOf(toolRoutePath(t)), t.path).toBe(RenderMode.Prerender);
  });

  it('every public page of the sitemap has a server route (so crawlers get its real text), the translated ones in the edition that has languages', () => {
    const withLanguages = makeServerRoutes(true);
    for (const p of sitemapPaths()) {
      const path = p === '/' ? '' : p.slice(1);
      expect(withLanguages.some((r) => r.path === path), p).toBe(true);
    }
  });

  describe('the translated pages (edition with languages)', () => {
    const withLanguages = makeServerRoutes(true);
    const published = OTHER_LOCALES.filter((l) => (AVAILABLE[l] ?? []).length > 0);

    it('are prerendered, one route each, and nothing translated is prerendered in the self-hosted edition', () => {
      for (const l of published) {
        const prerendered = withLanguages.filter((r) => r.renderMode === RenderMode.Prerender && (r.path === l || r.path.startsWith(`${l}/`)));
        expect(prerendered.length, l).toBe(AVAILABLE[l]!.length);
      }
      const plain = makeServerRoutes(false);
      expect(plain.some((r) => OTHER_LOCALES.some((l) => r.path === l || r.path.startsWith(`${l}/`)))).toBe(false);
    });

    it('keep their transcript pages and their 404 client rendered, and come before the global catch-all', () => {
      for (const l of published) {
        expect(withLanguages.find((r) => r.path === `${l}/jobs/:id`)?.renderMode, l).toBe(RenderMode.Client);
        expect(withLanguages.find((r) => r.path === `${l}/**`)?.renderMode, l).toBe(RenderMode.Client);
        expect(withLanguages.findIndex((r) => r.path === `${l}/**`), l).toBeLessThan(withLanguages.length - 1);
      }
      expect(withLanguages.at(-1)!.path).toBe('**');
    });

    it('have no path twice', () => {
      const paths = withLanguages.map((r) => r.path);
      expect(new Set(paths).size).toBe(paths.length);
    });
  });

  it('never prerenders a private or dynamic page: a visitor\'s transcript, the operator logs', () => {
    for (const path of ['jobs/:id', 'logs']) expect(modeOf(path), path).toBe(RenderMode.Client);
  });

  it('never prerenders a page that is marked noindex', () => {
    for (const r of routes) {
      if ((r.data as { noindex?: boolean } | undefined)?.noindex) {
        expect(modeOf(r.path!), r.path).not.toBe(RenderMode.Prerender);
      }
    }
  });

  it('every server route belongs to a page of the app (no stale entry for a page that was removed)', () => {
    const clientPaths = new Set(routes.map((r) => r.path));
    for (const r of serverRoutes) expect(clientPaths.has(r.path), r.path).toBe(true);
  });

  it('the catch-all (the "Page not found" page and anything unknown) comes last and is client rendered', () => {
    expect(serverRoutes.at(-1)!.path).toBe('**');
    expect(serverRoutes.at(-1)!.renderMode).toBe(RenderMode.Client);
  });

  it('has no path twice', () => {
    const paths = serverRoutes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
