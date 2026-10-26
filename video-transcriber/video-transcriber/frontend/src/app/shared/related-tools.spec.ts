import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TOOL_GROUPS, TOOL_PAGES } from '../features/tool-pages/tool-pages.list';
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

  function setup(current = '', heading?: string, paths: string[] = []) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    host.current = current;
    host.paths = paths;
    if (heading) host.heading = heading;
    fixture.detectChanges();
  }

  it('lists every keyword page, in the order of the list, as plain links', () => {
    setup();
    expect(hrefs()).toEqual(TOOL_PAGES.map((t) => t.path));
    expect(labels()).toEqual(TOOL_PAGES.map((t) => t.label));
  });

  it('is a labelled section with a heading and a list (a landmark for assistive technology)', () => {
    setup();
    const section = fixture.nativeElement.querySelector('section.related') as HTMLElement;
    const h2 = section.querySelector('h2')!;
    expect(section.getAttribute('aria-labelledby')).toBe(h2.id);
    expect(h2.textContent).toBe('More free tools');
    expect(section.querySelectorAll('ul > li').length).toBe(TOOL_PAGES.length);
  });

  it('leaves out the page the visitor is on', () => {
    setup('/mp3-to-text');
    expect(hrefs()).not.toContain('/mp3-to-text');
    expect(hrefs()).toEqual(TOOL_PAGES.map((t) => t.path).filter((p) => p !== '/mp3-to-text'));
    expect(links().length).toBe(TOOL_PAGES.length - 1);
  });

  it('also understands the current page without its leading slash', () => {
    setup('video-to-text');
    expect(hrefs()).not.toContain('/video-to-text');
    expect(links().length).toBe(TOOL_PAGES.length - 1);
  });

  it('excludes whichever page is current, for every page', () => {
    for (const t of TOOL_PAGES) {
      TestBed.resetTestingModule();
      setup(t.path);
      expect(hrefs()).not.toContain(t.path);
      expect(links().length).toBe(TOOL_PAGES.length - 1);
    }
  });

  it('shows all of them on a page that is not a tool page, and ignores an unknown "current"', () => {
    setup('/faq');
    expect(links().length).toBe(TOOL_PAGES.length);
    TestBed.resetTestingModule();
    setup('/nope');
    expect(links().length).toBe(TOOL_PAGES.length);
  });

  it('follows the page when the current address changes', () => {
    setup('/mp3-to-text');
    host.current = '/mp4-to-text';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(hrefs()).toContain('/mp3-to-text');
    expect(hrefs()).not.toContain('/mp4-to-text');
  });

  it('the full list is grouped under small headings (file types, Hindi and Hinglish, uses, alternatives)', () => {
    setup();
    const section = fixture.nativeElement.querySelector('section.related') as HTMLElement;
    expect(Array.from(section.querySelectorAll('h3')).map((h) => h.textContent!.trim())).toEqual(TOOL_GROUPS.map((g) => g.heading));
    const lists = Array.from(section.querySelectorAll('ul'));
    expect(lists.length).toBe(TOOL_GROUPS.length);
    TOOL_GROUPS.forEach((g, i) => {
      const inList = Array.from(lists[i].querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(inList).toEqual(TOOL_PAGES.filter((t) => t.group === g.id).map((t) => t.path));
    });
  });

  it('with paths: only those pages, in that order, as one list without group headings (unknown and current ones left out)', () => {
    setup('/mp3-to-text', undefined, ['/wav-to-text', '/mp3-to-text', '/nope', '/podcast-to-text']);
    expect(hrefs()).toEqual(['/wav-to-text', '/podcast-to-text']);
    expect(labels()).toEqual(['WAV to text', 'Podcast to text']);
    expect(fixture.nativeElement.querySelectorAll('h3').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('ul').length).toBe(1);
  });

  it('has an own heading when asked', () => {
    setup('', 'Other free tools');
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Other free tools');
  });
});
