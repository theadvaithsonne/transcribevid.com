import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IS_BROWSER } from '../../core/platform';
import { VideoDownload, VideoDownloader } from './downloader';

const job = (patch: Partial<VideoDownload> = {}): VideoDownload => ({ id: 'a'.repeat(32), url: 'https://youtu.be/BaW_jenozKc',
  platform: 'YouTube', quality: 720, status: 'running', phase: 'downloading', title: 'A video',
  filename: null, size_bytes: null, cancel_requested: false, error: null, file_url: null, ...patch });

describe('VideoDownloader', () => {
  let fixture: ComponentFixture<VideoDownloader>, page: VideoDownloader, http: HttpTestingController;
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: IS_BROWSER, useValue: true }] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(VideoDownloader);
    page = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne('/api/downloads').flush([]);
  });
  afterEach(() => { fixture.destroy(); http.verify(); vi.useRealTimers(); });
  function start() {
    page.url = '  https://youtu.be/BaW_jenozKc  ';
    page.start();
    const request = http.expectOne('/api/downloads');
    expect(request.request.body).toEqual({ url: 'https://youtu.be/BaW_jenozKc', quality: 720 });
    request.flush(job());
  }

  it('starts one download, polls and automatically saves once with a visible fallback link', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    start(); page.start(); http.expectNone('/api/downloads');
    vi.advanceTimersByTime(1200);
    http.expectOne(`/api/downloads/${job().id}`).flush(job({ status: 'done', phase: 'done', filename: 'video.mp4', size_bytes: 200 }));
    fixture.detectChanges();
    expect(click).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe(`/api/downloads/${job().id}/file`);
    vi.advanceTimersByTime(5000); http.expectNone(`/api/downloads/${job().id}`);
    click.mockRestore();
  });

  it('waits for backend cancellation and never autosaves a late completion after Cancel', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    start(); page.cancel();
    expect(page.cancelling()).toBe(true);
    http.expectOne(`/api/downloads/${job().id}/cancel`).flush(job({ cancel_requested: true }));
    vi.advanceTimersByTime(1200);
    http.expectOne(`/api/downloads/${job().id}`).flush(job({ status: 'done', phase: 'done' }));
    expect(click).not.toHaveBeenCalled();
    expect(page.cancelling()).toBe(false);
    click.mockRestore();
  });

  it('shows platform errors and enables another attempt', () => {
    start(); vi.advanceTimersByTime(1200);
    http.expectOne(`/api/downloads/${job().id}`).flush(job({ status: 'error', phase: 'error', error: 'This video needs login.' }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('This video needs login.');
    expect(page.busy()).toBe(false);
  });

  it('clears expired session state instead of polling forever', () => {
    start(); vi.advanceTimersByTime(1200);
    http.expectOne(`/api/downloads/${job().id}`).flush({}, { status: 404, statusText: 'Not Found' });
    expect(page.job()).toBeNull();
    expect(page.error()).toContain('session has ended');
  });

  it('stops polling when the tool is closed', () => {
    start(); fixture.destroy(); vi.advanceTimersByTime(5000);
    http.expectNone(`/api/downloads/${job().id}`);
  });
});
