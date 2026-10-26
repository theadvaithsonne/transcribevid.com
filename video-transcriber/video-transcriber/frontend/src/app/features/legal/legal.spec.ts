import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Provider, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ADS_CONFIG, ADS_EDITION } from '../../core/ads.service';
import { JobsStore } from '../../core/jobs.store';
import { Health } from '../../core/models';
import { FFMPEG_NOTICE, QWEN_NOTICE, THIRD_PARTY_NOTICES } from '../../engine/models/licences';
import { makeBrowserHealth, makeHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { LEGAL_UPDATED } from './legal-info';
import { PrivacyPage } from './privacy';
import { TermsPage } from './terms';

function render<T>(page: Type<T>, health: Health | null, extra: Provider[] = []): ComponentFixture<T> {
  TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([]), ...extra] });
  TestBed.inject(JobsStore).health.set(health);
  const fixture = TestBed.createComponent(page);
  fixture.detectChanges();
  return fixture;
}
const textOf = (f: ComponentFixture<unknown>) => ((f.nativeElement as HTMLElement).textContent ?? '').replace(/\s+/g, ' ');
const headings = (f: ComponentFixture<unknown>) => Array.from((f.nativeElement as HTMLElement).querySelectorAll('h2')).map((h) => h.textContent!.trim());
/** The static website with every AdSense id filled in: the "Privacy and cookie settings" control exists. */
const adsConfigured: Provider[] = [
  { provide: ADS_EDITION, useValue: true },
  {
    provide: ADS_CONFIG,
    useValue: { client: 'ca-pub-1234567890123456', slots: { rail160: '1234567890', rail300: '2345678901', inline300: '3456789012' } },
  },
];
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

describe('PrivacyPage in the browser edition', () => {
  it('has a single h1, a last-updated date and the sections the policy needs, including advertising and children', () => {
    const f = render(PrivacyPage, makeBrowserHealth());
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(textOf(f)).toContain(`Last updated: ${LEGAL_UPDATED}`);
    const h = headings(f).join(' | ');
    for (const part of [
      'Who runs this website',
      'What is processed, and where',
      'How long it is kept',
      'Downloads your browser makes',
      'Advertising',
      'Cookies and browser storage',
      'Sharing',
      'Children',
      'Your rights and choices',
    ]) {
      expect(h).toContain(part);
    }
  });

  it('leads with the promise: the file never leaves the device, ads only on information pages and beside finished transcripts', () => {
    const el = render(PrivacyPage, makeBrowserHealth()).nativeElement as HTMLElement;
    const lede = el.querySelector('.lede')!.textContent!.replace(/\s+/g, ' ');
    expect(lede).toContain('Your file never leaves your device.');
    expect(lede).toContain('Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.');
  });

  it("no longer makes the server edition's promises, and has no 'runs on your own computer' note", () => {
    const f = render(PrivacyPage, makeBrowserHealth());
    const t = textOf(f);
    for (const old of [
      'no tracking and no advertising',
      'One essential session cookie',
      'No analytics, advertising or tracking cookies',
      'no third-party scripts',
      'The recognition runs on our own server',
      'files you upload',
    ]) {
      expect(t).not.toContain(old);
    }
    expect((f.nativeElement as HTMLElement).querySelector('.callout')).toBeNull();
  });

  it('says the file is processed on the device and never uploaded, and kept in this browser until the idle time or Delete my data now', () => {
    const t = textOf(render(PrivacyPage, makeBrowserHealth({ session_idle_minutes: 30 })));
    expect(t).toContain('They are processed in your browser on your device (using WebGPU or WebAssembly).');
    expect(t).toContain('Your file is never uploaded to our servers and never sent to Google or anyone else.');
    expect(t).toContain("Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only.");
    expect(t).toContain('after 30 minutes of inactivity');
    expect(t).toContain('Delete my data now');
    expect(t).toContain('Deleted data cannot be recovered.');
  });

  it('names the downloads the browser makes: models from Hugging Face, program files from jsDelivr, never the media', () => {
    const t = textOf(render(PrivacyPage, makeBrowserHealth()));
    expect(t).toContain('your browser downloads the speech model files from Hugging Face (huggingface.co)');
    expect(t).toContain("the speech engine's program files from jsDelivr (cdn.jsdelivr.net)");
    expect(t).toContain('never your media or your transcript');
  });

  it('names Cloudflare as the host and describes the counter: one anonymous +1, only the total stored, not verified', () => {
    const t = textOf(render(PrivacyPage, makeBrowserHealth()));
    expect(t).toContain('Cloudflare (Cloudflare Pages) delivers this website.');
    expect(t).toContain('When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker).');
    expect(t).toContain('It carries no file, transcript or identifier.');
    expect(t).toContain('we store only the total');
    expect(t).toContain("reported by visitors' browsers and is not verified");
  });

  it('makes the AdSense disclosures, with the opt-out and partner-sites links', () => {
    const f = render(PrivacyPage, makeBrowserHealth());
    const t = textOf(f);
    expect(t).toContain('served by Google AdSense');
    expect(t).toContain('Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.');
    expect(t).toContain("Google's use of advertising cookies enables it and its partners to serve ads to you");
    expect(t).toContain('No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.');
    expect(t).toContain('We never send your file, your transcript or any personal information to Google.');
    expect(t).toContain("Google's certified consent message asks for your choice when ads load.");
    expect(t).toContain('with ads blocked or declined, everything works the same');
    const el = f.nativeElement as HTMLElement;
    for (const href of ['https://adssettings.google.com', 'https://www.aboutads.info', 'https://policies.google.com/technologies/partner-sites']) {
      const a = el.querySelector(`a[href="${href}"]`);
      expect(a).not.toBeNull();
      expect(a!.getAttribute('target')).toBe('_blank');
      expect(a!.getAttribute('rel')).toContain('noopener');
    }
  });

  it('says the site sets no cookies of its own, Google sets its own when ads load, and storage stays in the browser', () => {
    const t = textOf(render(PrivacyPage, makeBrowserHealth()));
    expect(t).toContain('The site itself sets no cookies.');
    expect(t).toContain('Google sets its own cookies when ads load');
    expect(t).toContain('None of this is sent to us.');
    expect(t).toContain("The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.");
  });

  it('is not directed to children', () => {
    expect(textOf(render(PrivacyPage, makeBrowserHealth()))).toContain('is not directed to children under 13 (or under 16 in the EU where applicable)');
  });

  it('lists the open-source components the browser may download, with their licence notices and source links', () => {
    const f = render(PrivacyPage, makeBrowserHealth());
    const el = f.nativeElement as HTMLElement;
    expect(headings(f)).toContain('12. Open-source components');
    expect(headings(f).at(-1)).toBe('13. Changes to this policy');
    const items = Array.from(el.querySelectorAll('ul.notices li'));
    expect(items.length).toBe(THIRD_PARTY_NOTICES.length);
    const t = textOf(f);
    for (const n of [FFMPEG_NOTICE, QWEN_NOTICE]) {
      expect(t).toContain(`${n.name} (${n.licence}).`);
      expect(t).toContain(n.notice);
      expect(el.querySelector(`ul.notices a[href="${n.sourceCode}"]`)).not.toBeNull();
      expect(el.querySelector(`ul.notices a[href="${n.licenceUrl}"]`)).not.toBeNull();
    }
    expect(t).toContain('https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10');
  });

  it('has no open-source components section in the server editions (nothing is downloaded into the browser there)', () => {
    const f = render(PrivacyPage, makePublicHealth());
    expect(headings(f).join(' | ')).not.toContain('Open-source components');
    expect((f.nativeElement as HTMLElement).querySelector('ul.notices')).toBeNull();
  });

  it("says Delete my data now cannot delete Google's cookies", () => {
    expect(textOf(render(PrivacyPage, makeBrowserHealth()))).toContain("It deletes the data in this browser only; it cannot delete Google's cookies.");
  });

  it('mentions "Privacy and cookie settings" only once every AdSense id is configured', () => {
    expect(textOf(render(PrivacyPage, makeBrowserHealth()))).not.toContain('Privacy and cookie settings');
    TestBed.resetTestingModule();
    const t = textOf(render(PrivacyPage, makeBrowserHealth(), adsConfigured));
    expect(t).toContain(
      'You can change it at any time with Privacy and cookie settings at the bottom of any page that shows ads (for example the home page).',
    );
    expect(t).toContain('use Privacy and cookie settings at the bottom of a page that shows ads,');
  });

  it('keeps the placeholders, and shows the contact e-mail when there is one', () => {
    const f = render(PrivacyPage, makeBrowserHealth());
    expect(placeholders(f)).toEqual(['[Operator / company name and address]', '[Contact e-mail address]']);
    TestBed.resetTestingModule();
    const g = render(PrivacyPage, makeBrowserHealth({ brand: { contact_email: 'privacy@transcribevid.com' } }));
    expect(placeholders(g)).toEqual(['[Operator / company name and address]']);
    expect((g.nativeElement as HTMLElement).querySelector('a[href="mailto:privacy@transcribevid.com"]')).not.toBeNull();
  });

  it('still links to the terms, How it works and the FAQ, and ends with one quiet way to start', () => {
    const el = render(PrivacyPage, makeBrowserHealth()).nativeElement as HTMLElement;
    expect(el.querySelector('a[href="/terms"]')).not.toBeNull();
    expect(el.querySelector('a[href="/how-it-works"]')).not.toBeNull();
    expect(el.querySelector('a[href="/faq"]')).not.toBeNull();
    expect(el.querySelector('.end a.btn')!.getAttribute('href')).toBe('/');
  });
});

describe('TermsPage in the browser edition', () => {
  it('has the clauses terms of use need, plus third-party downloads and ads, and children', () => {
    const f = render(TermsPage, makeBrowserHealth());
    expect((f.nativeElement as HTMLElement).querySelectorAll('h1').length).toBe(1);
    const h = headings(f).join(' | ');
    for (const part of [
      'Acceptable use',
      'Limits',
      'Accuracy: no warranty',
      'Availability',
      'Third-party downloads and ads',
      'Liability',
      'Termination',
      'Children',
      'Governing law',
    ]) {
      expect(h).toContain(part);
    }
  });

  it('says the device does the work, nothing is uploaded, and there is no file-size limit of ours', () => {
    const t = textOf(render(TermsPage, makeBrowserHealth({ session_idle_minutes: 30 })));
    expect(t).toContain('the recognition runs on your device, and your files are not uploaded to us');
    expect(t).toContain('Transcription runs on your device and uses its processor, graphics chip, memory and battery.');
    expect(t).toContain('We set no file-size or length limit');
    expect(t).toContain('may take a long time or run out of memory');
    expect(t).toContain('deleted automatically after 30 minutes of inactivity');
    expect(t).not.toContain('Up to');
  });

  it('says the service is funded by ads and names the third-party downloads', () => {
    const t = textOf(render(TermsPage, makeBrowserHealth()));
    expect(t).toContain('It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the Privacy policy).');
    expect(t).toContain(
      'your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms.',
    );
  });

  it('is not directed to children', () => {
    expect(textOf(render(TermsPage, makeBrowserHealth()))).toContain('is for a general audience and is not directed to children under 13.');
  });

  it('has no server wording: no uploads, no send-rate limits, no queue, no local-install note', () => {
    const f = render(TermsPage, makeBrowserHealth());
    const t = textOf(f);
    for (const old of [
      'the files you upload',
      'only upload content',
      'how fast and how many files you can send',
      'how many transcripts can run at the same time',
      'capacity limits',
    ]) {
      expect(t).not.toContain(old);
    }
    expect((f.nativeElement as HTMLElement).querySelector('.callout')).toBeNull();
  });

  it('keeps the warranty, liability and termination clauses and the placeholders', () => {
    const f = render(TermsPage, makeBrowserHealth());
    const t = textOf(f);
    expect(t).toContain('"as is" and "as available", without any warranty');
    expect(t).toContain('We do not promise that the service will always be available');
    expect(t).toContain('we are not liable for indirect or consequential loss');
    expect(t).toContain('We may suspend or end your access at any time');
    expect(placeholders(f)).toEqual(['[Operator / company name and address]', '[Governing law and jurisdiction]', '[Contact e-mail address]']);
  });
});
