import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { fmtBytes } from '../../core/format';
import { errorDetail } from '../../core/http-error';
import { IS_BROWSER } from '../../core/platform';

export interface VideoDownload {
  id: string;
  url: string;
  platform: string;
  quality: 360 | 720 | 1080;
  status: 'queued' | 'running' | 'done' | 'error' | 'cancelled';
  phase: string;
  title: string;
  filename: string | null;
  size_bytes: number | null;
  cancel_requested: boolean;
  error: string | null;
  file_url: string | null;
}

@Component({
  selector: 'app-video-downloader',
  imports: [FormsModule],
  templateUrl: './downloader.html',
  styleUrl: './downloader.scss',
})
export class VideoDownloader implements OnInit {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);
  private browser = inject(IS_BROWSER);
  private timer?: ReturnType<typeof setTimeout>;
  private autoSaveId: string | null = null;
  url = '';
  quality: 360 | 720 | 1080 = 720;
  job = signal<VideoDownload | null>(null);
  loading = signal(false);
  restoring = signal(false);
  cancelling = signal(false);
  error = signal('');
  active = computed(() => ['queued', 'running'].includes(this.job()?.status ?? ''));
  busy = computed(() => this.loading() || this.restoring() || this.active());
  fmtBytes = fmtBytes;
  statusText = computed(() => {
    const j = this.job();
    if (this.cancelling() || j?.cancel_requested) return 'Stopping download…';
    if (j?.status === 'error') return 'Download failed';
    const labels: Record<string, string> = { queued: 'Waiting to download…', extracting: 'Checking video…',
      downloading: 'Downloading…', processing: 'Preparing MP4…', done: 'Ready to save', cancelled: 'Download cancelled' };
    return labels[j?.phase ?? ''] ?? 'Downloading…';
  });

  constructor() { this.destroyRef.onDestroy(() => clearTimeout(this.timer)); }

  ngOnInit() {
    if (!this.browser) return;
    this.restoring.set(true);
    this.http.get<VideoDownload[]>('/api/downloads').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (jobs) => {
        this.restoring.set(false);
        const latest = jobs.find(j => ['queued', 'running'].includes(j.status)) ?? jobs[0];
        if (latest) this.apply(latest);
      },
      error: () => { this.restoring.set(false); },
    });
  }

  start() {
    if (!this.browser || this.busy()) return;
    if (!this.url.trim()) { this.error.set('Paste a video link first.'); return; }
    this.error.set('');
    this.loading.set(true);
    this.autoSaveId = null;
    this.http.post<VideoDownload>('/api/downloads', { url: this.url.trim(), quality: this.quality })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (job) => { this.loading.set(false); this.autoSaveId = job.id; this.apply(job); },
        error: (e) => { this.loading.set(false); this.error.set(errorDetail(e, 'Could not start the download.')); },
      });
  }

  cancel() {
    const j = this.job();
    if (!j || !this.active() || this.cancelling()) return;
    this.cancelling.set(true);
    this.autoSaveId = null;
    this.http.post<VideoDownload>(`/api/downloads/${j.id}/cancel`, {}).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (job) => this.apply(job),
      error: (e) => { this.cancelling.set(false); this.error.set(errorDetail(e, 'Could not cancel. Try again.')); },
    });
  }

  clear() {
    const j = this.job();
    if (!j || this.busy()) return;
    this.loading.set(true);
    this.http.delete<void>(`/api/downloads/${j.id}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.job.set(null); this.error.set(''); this.loading.set(false); },
      error: (e) => { this.loading.set(false); this.error.set(errorDetail(e, 'Could not clear the download.')); },
    });
  }

  fileUrl() { return `/api/downloads/${encodeURIComponent(this.job()!.id)}/file`; }

  private apply(job: VideoDownload) {
    clearTimeout(this.timer);
    this.job.set(job);
    if (!this.active()) this.cancelling.set(false);
    if (job.status === 'done' && this.autoSaveId === job.id) {
      this.autoSaveId = null;
      const link = this.document.createElement('a');
      link.href = this.fileUrl();
      link.download = job.filename ?? 'video.mp4';
      this.document.body.appendChild(link);
      link.click();
      link.remove();
    }
    if (this.active()) this.timer = setTimeout(() => this.poll(job.id), 1200);
  }

  private poll(id: string) {
    this.http.get<VideoDownload>(`/api/downloads/${id}`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (job) => { this.error.set(''); this.apply(job); },
      error: (e) => {
        if (e.status === 404) {
          this.job.set(null); this.cancelling.set(false);
          this.error.set('This download session has ended. Paste the link to start again.');
        } else {
          this.error.set('Connection interrupted. Reconnecting…');
          this.timer = setTimeout(() => this.poll(id), 4000);
        }
      },
    });
  }
}
