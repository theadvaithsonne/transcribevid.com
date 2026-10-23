import { effect } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PendingFileService } from './pending-file.service';

const mp3 = () => new File(['x'], 'talk.mp3', { type: 'audio/mpeg' });

describe('PendingFileService', () => {
  it('hands a file over once and then forgets it', () => {
    const pending = TestBed.inject(PendingFileService);
    const file = new File(['x'], 'talk.mp3', { type: 'audio/mpeg' });
    expect(pending.take()).toBeNull();
    pending.set(file);
    expect(pending.file()).toBe(file);
    expect(pending.take()).toBe(file);
    expect(pending.file()).toBeNull();
    expect(pending.take()).toBeNull();
  });

  it('starts empty', () => {
    const pending = TestBed.inject(PendingFileService);
    expect(pending.file()).toBeNull();
  });

  it('is one shared instance for the whole app (the keyword page and the uploader see the same file)', () => {
    const a = TestBed.inject(PendingFileService);
    const b = TestBed.inject(PendingFileService);
    expect(a).toBe(b);
    const f = mp3();
    a.set(f);
    expect(b.take()).toBe(f);
  });

  it('keeps only the newest file when a second one is chosen before the first was taken', () => {
    const pending = TestBed.inject(PendingFileService);
    const first = mp3();
    const second = new File(['y'], 'other.mp4', { type: 'video/mp4' });
    pending.set(first);
    pending.set(second);
    expect(pending.take()).toBe(second);
    expect(pending.take()).toBeNull();
  });

  it('can be emptied without taking the file (set null)', () => {
    const pending = TestBed.inject(PendingFileService);
    pending.set(mp3());
    pending.set(null);
    expect(pending.file()).toBeNull();
    expect(pending.take()).toBeNull();
  });

  it('exposes the waiting file read-only: only set() and take() change it', () => {
    const pending = TestBed.inject(PendingFileService);
    expect('set' in pending.file).toBe(false);
    expect('update' in pending.file).toBe(false);
  });

  it('holds the file in memory only: nothing is written to storage', () => {
    sessionStorage.clear();
    localStorage.clear();
    TestBed.inject(PendingFileService).set(mp3());
    expect(sessionStorage.length).toBe(0);
    expect(localStorage.length).toBe(0);
  });

  it('may be called from an effect without making the effect depend on it (take() does not subscribe)', () => {
    const pending = TestBed.inject(PendingFileService);
    let runs = 0;
    let got: File | null = null;
    TestBed.runInInjectionContext(() =>
      effect(() => {
        runs++;
        got = pending.take();
      }),
    );
    TestBed.tick();
    expect(runs).toBe(1);
    expect(got).toBeNull();
    pending.set(mp3());
    TestBed.tick();
    expect(runs).toBe(1); // setting the file did not re-run it, and the file is still waiting
    expect(pending.file()).not.toBeNull();
  });

  it('a reader that watches file() does see changes (for a page that wants to react)', () => {
    const pending = TestBed.inject(PendingFileService);
    const seen: (string | null)[] = [];
    TestBed.runInInjectionContext(() => effect(() => seen.push(pending.file()?.name ?? null)));
    TestBed.tick();
    pending.set(mp3());
    TestBed.tick();
    pending.take();
    TestBed.tick();
    expect(seen).toEqual([null, 'talk.mp3', null]);
  });
});
