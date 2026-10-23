import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobsStore } from '../core/jobs.store';
import { Health } from '../core/models';
import { makeHealth, makePublicHealth, silentLog } from '../testing/fakes';
import { FreeChips } from './free-chips';

@Component({ imports: [FreeChips], template: `<app-free-chips [line]="line" />` })
class Host {
  line = true;
}

@Component({ imports: [FreeChips], template: `<app-free-chips />` })
class PlainHost {}

describe('FreeChips', () => {
  let fixture: ComponentFixture<Host>;

  function setup(health: Health | null, line = true) {
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    TestBed.inject(JobsStore).health.set(health);
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.line = line;
    fixture.detectChanges();
  }

  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
  const chips = () => Array.from(fixture.nativeElement.querySelectorAll('ul.chips li') as NodeListOf<HTMLElement>);
  const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

  it('shows the three promises in this order: Free, Unlimited, No login', () => {
    setup(makePublicHealth());
    expect(chips().map((c) => clean(c))).toEqual(['Free', 'Unlimited', 'No login']);
  });

  it('is a labelled list, each chip with a tick that assistive technology skips', () => {
    setup(makePublicHealth());
    expect(q('ul.chips')!.getAttribute('aria-label')).toBe('Free, unlimited, no login');
    for (const c of chips()) {
      expect(c.querySelector('.tick')!.getAttribute('aria-hidden')).toBe('true');
      expect(c.querySelector('svg')).not.toBeNull();
    }
  });

  it('is calm: the same small tick for every chip, no colour of its own per chip', () => {
    setup(makePublicHealth());
    expect(chips().map((c) => c.querySelectorAll('.tick').length)).toEqual([1, 1, 1]);
    expect(chips().every((c) => c.getAttribute('style') === null)).toBe(true);
  });

  it('public site (and before the server answers): no sign-up, no payment, no daily limit', () => {
    for (const health of [makePublicHealth(), null]) {
      TestBed.resetTestingModule();
      setup(health);
      expect(clean(q('.line'))).toBe('No sign-up, no payment, no daily limit. Just add your file.');
    }
  });

  it('local install: nothing to sign up for, nothing to pay (no talk about a daily limit)', () => {
    setup(makeHealth());
    expect(clean(q('.line'))).toBe('Nothing to sign up for and nothing to pay. Just add your file.');
  });

  it('shows only the chips unless asked for the line (the chips already say it)', () => {
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    TestBed.inject(JobsStore).health.set(makePublicHealth());
    const plain = TestBed.createComponent(PlainHost);
    plain.detectChanges();
    expect(plain.nativeElement.querySelectorAll('ul.chips li').length).toBe(3);
    expect(plain.nativeElement.querySelector('.line')).toBeNull();
  });

  it('can leave out the explanation line', () => {
    setup(makePublicHealth(), false);
    expect(q('.line')).toBeNull();
    expect(chips().length).toBe(3);
  });
});
