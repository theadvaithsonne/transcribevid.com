import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { Health } from '../../core/models';
import { makeHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { LEGAL_UPDATED } from './legal-info';
import { PrivacyPage } from './privacy';
import { TermsPage } from './terms';

function render<T>(page: Type<T>, health: Health | null): ComponentFixture<T> {
  TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
  TestBed.inject(JobsStore).health.set(health);
  const fixture = TestBed.createComponent(page);
  fixture.detectChanges();
  return fixture;
}
const textOf = (f: ComponentFixture<unknown>) => ((f.nativeElement as HTMLElement).textContent ?? '').replace(/\s+/g, ' ');
const headings = (f: ComponentFixture<unknown>) => Array.from((f.nativeElement as HTMLElement).querySelectorAll('h2')).map((h) => h.textContent!.trim());
const placeholders = (f: ComponentFixture<unknown>) => Array.from((f.nativeElement as HTMLElement).querySelectorAll('mark.placeholder')).map((m) => m.textContent);

describe('PrivacyPage', () => {
  it('has a single h1, a last-updated date and the sections a privacy policy needs', () => {
    const f = render(PrivacyPage, makePublicHealth());
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toBe('Privacy policy');
    expect(textOf(f)).toContain(`Last updated: ${LEGAL_UPDATED}`);
    const h = headings(f).join(' | ');
    for (const part of ['Who runs this website', 'What we process', 'How long we keep it', 'Cookies and browser storage', 'Sharing', 'Your rights and choices']) {
      expect(h).toContain(part);
    }
  });

  it('says what is processed: uploaded media, generated text, and technical logs without content', () => {
    const t = textOf(render(PrivacyPage, makePublicHealth()));
    expect(t).toContain('Media you add.');
    expect(t).toContain('Text we generate.');
    expect(t).toContain('Technical logs.');
    expect(t).toContain('They never contain the content of your media or transcripts.');
    expect(t).toContain('prevent abuse');
  });

  it('says retention is the session only, with automatic deletion after the idle time the server reports', () => {
    const t = textOf(render(PrivacyPage, makePublicHealth({ session_idle_minutes: 45 })));
    expect(t).toContain('Files and transcripts exist only for your session.');
    expect(t).toContain('after 45 minutes of inactivity');
    expect(t).toContain('Delete my data now');
    expect(t).toContain('Apart from that single number, nothing is stored permanently.');
    expect(t).toContain('export what you need before you leave');
  });

  it('does not mention folders (the feature is gone)', () => {
    expect(textOf(render(PrivacyPage, makePublicHealth()))).not.toMatch(/folder/i);
  });

  it('discloses the one running total: a single anonymous number, shown in the header, not linked to anyone', () => {
    const f = render(PrivacyPage, makePublicHealth());
    const t = textOf(f);
    expect(t).toContain('One running total.');
    expect(t).toContain('We keep one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header).');
    expect(t).toContain('It is not linked to you, your files or your session.');
    // it is one of the things the policy says it processes (section 2) and the only thing kept beyond the session (section 4)
    const section2 = Array.from((f.nativeElement as HTMLElement).querySelectorAll('h2')).find((h) => h.textContent!.includes('What we process'))!;
    expect(section2.nextElementSibling?.textContent).toContain('One running total.');
  });

  it('still tells the visitor that nothing else is kept and that deleted data cannot be recovered', () => {
    const t = textOf(render(PrivacyPage, makePublicHealth()));
    expect(t).toContain('We do not keep copies or backups of your files or transcripts');
    expect(t).toContain('Deleted data cannot be recovered.');
  });

  it('describes the one essential session cookie and no analytics, advertising or tracking cookies', () => {
    const t = textOf(render(PrivacyPage, makePublicHealth()));
    expect(t).toContain('One essential session cookie.');
    expect(t).toContain('No analytics, advertising or tracking cookies');
    expect(t).toContain('no third-party scripts, fonts or trackers');
  });

  it('says nothing is sold or shared with third parties', () => {
    const t = textOf(render(PrivacyPage, makePublicHealth()));
    expect(t).toContain('We do not sell your data and we do not share your files or transcripts with third parties.');
  });

  it('leaves clearly marked placeholders for what the owner must fill in', () => {
    const f = render(PrivacyPage, makePublicHealth());
    expect(placeholders(f)).toContain('[Operator / company name and address]');
    expect(placeholders(f)).toContain('[Contact e-mail address]');
  });

  it('shows the contact e-mail from the server instead of the placeholder', () => {
    const f = render(PrivacyPage, makePublicHealth({ brand: { contact_email: 'privacy@transcribevid.com' } }));
    expect(placeholders(f)).not.toContain('[Contact e-mail address]');
    const mail = (f.nativeElement as HTMLElement).querySelector('a[href^="mailto:"]')!;
    expect(mail.getAttribute('href')).toBe('mailto:privacy@transcribevid.com');
    expect(placeholders(f)).toContain('[Operator / company name and address]'); // still the owner's job
  });

  it('copes without an idle time from the server', () => {
    const t = textOf(render(PrivacyPage, makePublicHealth({ session_idle_minutes: undefined })));
    expect(t).toContain('which happens after a period of inactivity');
  });

  it('tells someone running their own copy that nothing leaves their computer', () => {
    const f = render(PrivacyPage, makeHealth());
    const note = (f.nativeElement as HTMLElement).querySelector('.callout');
    expect(note?.textContent).toContain('Nothing you add is sent to transcribevid.com or to anyone else');
    expect(note?.textContent).toContain('describes the hosted website');
  });

  it('has no "runs on your computer" note on the public site or while the server is silent', () => {
    for (const health of [makePublicHealth(), null]) {
      TestBed.resetTestingModule();
      expect((render(PrivacyPage, health).nativeElement as HTMLElement).querySelector('.callout')).toBeNull();
    }
  });

  it('is a plain document: no label above the h1, and it ends with one quiet way to start', () => {
    const el = render(PrivacyPage, makePublicHealth()).nativeElement as HTMLElement;
    expect(el.querySelector('.eyebrow')).toBeNull();
    const end = el.querySelector('.end a.btn')!;
    expect(end.getAttribute('href')).toBe('/');
    expect(end.textContent!.trim()).toBe('Transcribe a file');
    expect(el.querySelectorAll('.btn.primary').length).toBe(0);
  });

  it('links to the terms, How it works and the FAQ (and no longer to /about)', () => {
    const el = render(PrivacyPage, makePublicHealth()).nativeElement as HTMLElement;
    expect(el.querySelector('a[href="/terms"]')).not.toBeNull();
    expect(el.querySelector('a[href="/how-it-works"]')).not.toBeNull();
    expect(el.querySelector('a[href="/faq"]')).not.toBeNull();
    expect(el.querySelector('a[href="/about"]')).toBeNull();
  });
});

describe('TermsPage', () => {
  it('has a single h1, a last-updated date and the clauses terms of use need', () => {
    const f = render(TermsPage, makePublicHealth());
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toBe('Terms of use');
    expect(textOf(f)).toContain(`Last updated: ${LEGAL_UPDATED}`);
    const h = headings(f).join(' | ');
    for (const part of ['Acceptable use', 'Limits', 'Accuracy: no warranty', 'Availability', 'Liability', 'Termination', 'Governing law']) {
      expect(h).toContain(part);
    }
  });

  it('sets the acceptable-use rules: rights to the content, nothing illegal, no automated or bulk use', () => {
    const t = textOf(render(TermsPage, makePublicHealth()));
    expect(t).toContain('only upload content you own or have the right to process');
    expect(t).toContain('upload content that is illegal');
    expect(t).toContain('use scripts, bots or other automated means, or bulk or commercial-scale automated use');
  });

  it('gives no warranty on accuracy, availability or fitness, and disclaims liability', () => {
    const t = textOf(render(TermsPage, makePublicHealth()));
    expect(t).toContain('will contain mistakes');
    expect(t).toContain('Always check a transcript before relying on it');
    expect(t).toContain('"as is" and "as available", without any warranty');
    expect(t).toContain('We do not promise that the service will always be available');
    expect(t).toContain('we are not liable for indirect or consequential loss');
  });

  it('states the limits the server reports and the session deletion', () => {
    const t = textOf(render(TermsPage, makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60, session_idle_minutes: 30 })));
    expect(t).toContain('Up to 2 GB and 60 minutes per file.');
    expect(t).toContain('deleted automatically after 30 minutes of inactivity');
  });

  it('does not state limits the server did not report', () => {
    const t = textOf(render(TermsPage, makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 })));
    expect(t).not.toContain('Up to');
  });

  it('can end access and says how to stop', () => {
    const t = textOf(render(TermsPage, makePublicHealth()));
    expect(t).toContain('We may suspend or end your access at any time');
    expect(t).toContain('Delete my data now');
  });

  it('leaves placeholders for the operator and the governing law', () => {
    const f = render(TermsPage, makePublicHealth());
    expect(placeholders(f)).toEqual(['[Operator / company name and address]', '[Governing law and jurisdiction]', '[Contact e-mail address]']);
  });

  it('shows the contact e-mail when the server has one', () => {
    const f = render(TermsPage, makePublicHealth({ brand: { contact_email: 'legal@transcribevid.com' } }));
    expect(placeholders(f)).not.toContain('[Contact e-mail address]');
    expect((f.nativeElement as HTMLElement).querySelector('a[href="mailto:legal@transcribevid.com"]')).not.toBeNull();
  });

  it('is a plain document: no label above the h1, and it ends with one quiet way to start', () => {
    const el = render(TermsPage, makePublicHealth()).nativeElement as HTMLElement;
    expect(el.querySelector('.eyebrow')).toBeNull();
    expect(el.querySelector('.end a.btn')!.getAttribute('href')).toBe('/');
    expect(el.querySelectorAll('.btn.primary').length).toBe(0);
  });

  it('notes on a local install that it describes the hosted website', () => {
    const f = render(TermsPage, makeHealth());
    expect((f.nativeElement as HTMLElement).querySelector('.callout')?.textContent).toContain('describe the hosted website');
  });
});
