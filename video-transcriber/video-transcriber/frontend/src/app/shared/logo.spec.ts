import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Logo } from './logo';

@Component({ imports: [Logo], template: `<app-logo [size]="size" />` })
class Host {
  size = 40;
}

describe('Logo', () => {
  function render(size?: number) {
    const fixture = TestBed.createComponent(Host);
    if (size !== undefined) fixture.componentInstance.size = size;
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('svg') as SVGElement;
  }

  it('is a decorative picture (the wordmark next to it carries the name)', () => {
    const svg = render();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('viewBox')).toBe('0 0 32 32');
  });

  it('is 40 px by default and as big as asked', () => {
    const bare = TestBed.createComponent(Logo);
    bare.detectChanges();
    expect(bare.nativeElement.querySelector('svg').getAttribute('width')).toBe('40');
    TestBed.resetTestingModule();
    const svg = render(24);
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('draws a square with the play triangle, the waveform and two subtitle lines', () => {
    const svg = render();
    expect(svg.querySelector('rect.bg')).not.toBeNull();
    expect(svg.querySelectorAll('g.fg path').length).toBe(3);
  });
});
