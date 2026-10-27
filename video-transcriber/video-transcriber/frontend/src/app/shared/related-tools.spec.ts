import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CORE_TOOLS, TOOL_GROUPS, TOOL_PAGES } from '../features/tool-pages/tool-pages.list';
import { RelatedTools } from './related-tools';

@Component({
  imports: [RelatedTools],
  template: `<app-related-tools [current]="current" [heading]="heading" [paths]="paths" />`,
})
class Host {
  current = '';
  heading = 'More free tools';
  paths: string[] = [];
}

describe('RelatedTools', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const links = () => Array.from(fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>);
  const hrefs = () => links().map((a) => a.getAttribute('href'));
  const labels = () => links().map((a) => a.textContent!.trim());
  /** the tool links: every link except the closing "All free tools" */
  const toolHrefs = () => hrefs().slice(0, -1);

  function setup(current = '', heading?: string, paths: string[] = []) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    host.current = current;
    host.paths = paths;
    if (heading) host.heading = heading;
    fixture.detectChanges();
  }

  it('on a page that is not a tool page: every keyword page, in the order of the list, as plain links, then "All free tools"', () => {
    setup();
    expect(toolHrefs()).toEqual(TOOL_PAGES.map((t) => t.path));
    expect(labels().slice(0, -1)).toEqual(TOOL_PAGES.map((t) => t.label));
    expect(hrefs().at(-1)).toBe('/tools');
    expect(labels().at(-1)).toBe('All free tools');
  });

  it('is a labelled section with a heading and a list (a landmark for assistive technology)', () => {
    setup();
    const section = fixture.nativeElement.querySelector('section.related') as HTMLElement;
    const h2 = section.querySelector('h2')!;
    expect(section.getAttribute('aria-labelledby')).toBe(h2.id);
    expect(h2.textContent).toBe('More free tools');
    expect(section.querySelectorAll('ul > li').length).toBe(TOOL_PAGES.length);
  });

  it('the full list is grouped under small headings (main tools, file types, uses, subtitle files, languages, alternatives)', () => {
    setup();
    const section = fixture.nativeElement.querySelector('section.related') as HTMLElement;
    expect(Array.from(section.querySelectorAll('h3')).map((h) => h.textContent!.trim())).toEqual(TOOL_GROUPS.map((g) => g.title));
    const lists = Array.from(section.querySelectorAll('ul'));
    expect(lists.length).toBe(TOOL_GROUPS.length);
    TOOL_GROUPS.forEach((g, i) => {
      const inList = Array.from(lists[i].querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(inList).toEqual(TOOL_PAGES.filter((t) => t.group === g.id).map((t) => t.path));
    });
  });

  it('ignores an unknown "current" (it is not a tool page): the whole list', () => {
    setup('/faq');
    expect(toolHrefs().length).toBe(TOOL_PAGES.length);
    TestBed.resetTestingModule();
    setup('/nope');
    expect(toolHrefs().length).toBe(TOOL_PAGES.length);
  });

  it('leaves out the page the visitor is on, and never shows more than eight tools', () => {
    for (const t of TOOL_PAGES) {
      TestBed.resetTestingModule();
      setup(t.path);
      expect(hrefs()).not.toContain(t.path);
      expect(toolHrefs().length).toBe(Math.min(8, TOOL_PAGES.length - 1));
      expect(new Set(toolHrefs()).size).toBe(toolHrefs().length);
      expect(hrefs().at(-1)).toBe('/tools');
      expect(fixture.nativeElement.querySelectorAll('h3').length).toBe(0); // one plain list on a tool page
    }
  });

  it('shows the neighbours first (the next four pages of its group), then the main tools, so every page links to its own kind', () => {
    setup('/hindi-audio-to-text');
    const neighbours = TOOL_PAGES.filter((t) => t.group === 'language' && t.path !== '/hindi-audio-to-text').slice(0, 4).map((t) => t.path);
    expect(toolHrefs().slice(0, 4)).toEqual(neighbours);
    // the eight places are four neighbours, then the first four main tools
    expect(toolHrefs().slice(4)).toEqual(CORE_TOOLS.slice(0, 4).map((t) => t.path));
  });

  it('a main page lists the other main tools first (the four after it, wrapping round)', () => {
    setup('/mp3-to-text');
    expect(toolHrefs().slice(0, 4)).toEqual(['/srt-subtitle-generator', '/voice-recording-to-text', '/video-to-text', '/audio-to-text']);
    for (const p of CORE_TOOLS.map((t) => t.path).filter((p) => p !== '/mp3-to-text')) expect(toolHrefs()).toContain(p);
  });

  it('every page is among the neighbours of some other page (none is linked from the home page only)', () => {
    const linked = new Set<string>();
    for (const t of TOOL_PAGES) {
      TestBed.resetTestingModule();
      setup(t.path);
      toolHrefs().forEach((h) => linked.add(h!));
    }
    for (const t of TOOL_PAGES) expect(linked.has(t.path), t.path).toBe(true);
  });

  it('also understands the current page without its leading slash', () => {
    setup('video-to-text');
    expect(hrefs()).not.toContain('/video-to-text');
    expect(toolHrefs().length).toBe(Math.min(8, TOOL_PAGES.length - 1));
  });

  it('follows the page when the current address changes', () => {
    setup('/mp3-to-text');
    host.current = '/mp4-to-text';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(hrefs()).toContain('/mp3-to-text');
    expect(hrefs()).not.toContain('/mp4-to-text');
  });

  it('with paths: only those pages, in that order, as one list without group headings (unknown and current ones left out), then "All free tools"', () => {
    setup('/mp3-to-text', undefined, ['/wav-to-text', '/mp3-to-text', '/nope', '/podcast-to-text']);
    expect(toolHrefs()).toEqual(['/wav-to-text', '/podcast-to-text']);
    expect(labels().slice(0, -1)).toEqual(['WAV to text', 'Podcast to text']);
    expect(hrefs().at(-1)).toBe('/tools');
    expect(fixture.nativeElement.querySelectorAll('h3').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('ul').length).toBe(1);
  });

  it('has an own heading when asked', () => {
    setup('', 'Other free tools');
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Other free tools');
  });
});
