import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CORE_TOOLS, TOOL_PAGES } from '../features/tool-pages/tool-pages.list';
import { RelatedTools } from './related-tools';

@Component({
  imports: [RelatedTools],
  template: `<app-related-tools [current]="current" [heading]="heading" />`,
})
class Host {
  current = '';
  heading = 'More free tools';
}

describe('RelatedTools', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const links = () => Array.from(fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>);
  const hrefs = () => links().map((a) => a.getAttribute('href'));
  const labels = () => links().map((a) => a.textContent!.trim());
  /** the tool links: every link except the closing "All free tools" */
  const toolHrefs = () => hrefs().slice(0, -1);

  function setup(current = '', heading?: string) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    host.current = current;
    if (heading) host.heading = heading;
    fixture.detectChanges();
  }

  it('on a page that is not a tool page: the core tools in the order of the list, as plain links, then "All free tools"', () => {
    setup();
    expect(toolHrefs()).toEqual(CORE_TOOLS.map((t) => t.path));
    expect(labels().slice(0, -1)).toEqual(CORE_TOOLS.map((t) => t.label));
    expect(hrefs().at(-1)).toBe('/tools');
    expect(labels().at(-1)).toBe('All free tools');
  });

  it('is a labelled section with a heading and a list (a landmark for assistive technology)', () => {
    setup();
    const section = fixture.nativeElement.querySelector('section.related') as HTMLElement;
    const h2 = section.querySelector('h2')!;
    expect(section.getAttribute('aria-labelledby')).toBe(h2.id);
    expect(h2.textContent).toBe('More free tools');
    expect(section.querySelectorAll('ul > li').length).toBe(CORE_TOOLS.length + 1);
  });

  it('leaves out the page the visitor is on, and never shows more than eight tools', () => {
    for (const t of TOOL_PAGES) {
      TestBed.resetTestingModule();
      setup(t.path);
      expect(hrefs()).not.toContain(t.path);
      expect(toolHrefs().length).toBe(Math.min(8, TOOL_PAGES.length - 1));
      expect(new Set(toolHrefs()).size).toBe(toolHrefs().length);
      expect(hrefs().at(-1)).toBe('/tools');
    }
  });

  it('shows the neighbours first (the same group, up to four), then the core tools, so every page links to its own kind', () => {
    setup('/hindi-audio-to-text');
    const neighbours = TOOL_PAGES.filter((t) => t.group === 'language' && t.path !== '/hindi-audio-to-text').slice(0, 4).map((t) => t.path);
    expect(toolHrefs().slice(0, 4)).toEqual(neighbours);
    // the eight places are four neighbours, then the first four core tools
    expect(toolHrefs().slice(4)).toEqual(CORE_TOOLS.slice(0, 4).map((t) => t.path));
  });

  it('a core page lists the other core tools first', () => {
    setup('/mp3-to-text');
    const others = CORE_TOOLS.map((t) => t.path).filter((p) => p !== '/mp3-to-text');
    expect(toolHrefs().slice(0, 4)).toEqual(others.slice(0, 4));
    for (const p of others) expect(toolHrefs()).toContain(p);
  });

  it('also understands the current page without its leading slash', () => {
    setup('video-to-text');
    expect(hrefs()).not.toContain('/video-to-text');
    expect(toolHrefs().length).toBe(Math.min(8, TOOL_PAGES.length - 1));
  });

  it('ignores an unknown "current" (it is not a tool page)', () => {
    setup('/nope');
    expect(toolHrefs()).toEqual(CORE_TOOLS.map((t) => t.path));
  });

  it('follows the page when the current address changes', () => {
    setup('/mp3-to-text');
    host.current = '/mp4-to-text';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(hrefs()).toContain('/mp3-to-text');
    expect(hrefs()).not.toContain('/mp4-to-text');
  });

  it('has an own heading when asked', () => {
    setup('', 'Other free tools');
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Other free tools');
  });
});
