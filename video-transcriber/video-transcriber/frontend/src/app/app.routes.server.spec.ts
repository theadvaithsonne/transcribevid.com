import { RenderMode } from '@angular/ssr';
import sitemapXml from '../../public/sitemap.xml' with { loader: 'text' };
import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';
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

  it('every public page of the sitemap has a server route (so crawlers get its real text)', () => {
    for (const p of sitemapPaths()) {
      const path = p === '/' ? '' : p.slice(1);
      expect(serverRoutes.some((r) => r.path === path), p).toBe(true);
    }
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
