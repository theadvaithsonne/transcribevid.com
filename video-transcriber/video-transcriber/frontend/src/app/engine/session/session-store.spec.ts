import { DEFAULT_OPTIONS, Job, Segment, Stats } from '../../core/models';
import { MemoryBackend } from './backend';
import { openSessionBackend } from './indexeddb-backend';
import {
  INTERRUPTED_ERROR,
  INTERRUPTED_NO_FILE_ERROR,
  LockManagerLike,
  MAX_STUCK_RESUMES,
  STUCK_ERROR,
  STUCK_LOADING_ERROR,
  MODEL_CACHE_NAME,
  SUMMARY_FIELDS,
  SessionEnded,
  SessionStore,
  SessionStoreError,
  SessionStoreOptions,
} from './session-store';

const MIN = 60_000;
const T0 = Date.UTC(2026, 9, 25, 12, 0, 0);

/** A clock the specs move by hand (milliseconds). */
class Clock {
  t = T0;
  now = () => this.t;
  advance(ms: number) {
    this.t += ms;
  }
}

/**
 * navigator.locks with the parts the store uses; `external` = locks held by another tab, `externalPending` = locks
 * another tab asked for and is waiting for. All tabs of a spec share one FakeLocks, like one browser profile.
 */
class FakeLocks implements LockManagerLike {
  readonly held = new Map<string, number>();
  readonly external = new Set<string>();
  readonly externalPending = new Set<string>();
  async request(name: string, a: unknown, b?: unknown) {
    const opts = (typeof a === 'function' ? {} : a) as { ifAvailable?: boolean };
    const cb = (typeof a === 'function' ? a : b) as (lock: unknown) => Promise<void>;
    if (opts.ifAvailable && (this.held.has(name) || this.external.has(name))) return cb(null);
    this.held.set(name, (this.held.get(name) ?? 0) + 1);
    try {
      await cb({ name });
    } finally {
      const n = (this.held.get(name) ?? 1) - 1;
      if (n <= 0) this.held.delete(name);
      else this.held.set(name, n);
    }
  }
  async query() {
    return {
      held: [...this.held.keys(), ...this.external].map((name) => ({ name })),
      pending: [...this.externalPending].map((name) => ({ name })),
    };
  }
}

function seg(id: number, start: number, end: number, text: string): Segment {
  return {
    id,
    start,
    end,
    text,
    words: [{ start, end, word: text, probability: 0.9 }],
    confidence: 0.9,
  };
}

function job(id: string, over: Partial<Job> = {}): Job {
  const segments = over.segments ?? [seg(0, 0, 2, 'hello there'), seg(1, 2, 4, 'general kenobi')];
  return {
    id,
    title: 'clip',
    filename: 'clip.mp4',
    status: 'done',
    phase: null,
    progress: 1,
    eta_seconds: null,
    error: null,
    cancel_requested: false,
    created_at: T0 / 1000,
    started_at: T0 / 1000,
    finished_at: T0 / 1000 + 10,
    language: 'en',
    duration: 4,
    size_bytes: 1234,
    media_kind: 'video',
    options: { ...DEFAULT_OPTIONS },
    segment_count: segments.length,
    stats: null,
    language_probability: 0.98,
    ...over,
    segments,
  };
}

async function openStore(backend = new MemoryBackend(), clock = new Clock(), opts: SessionStoreOptions = {}) {
  const store = await SessionStore.open(backend, {
    now: clock.now,
    locks: null,
    caches: null,
    checkIntervalMs: 0,
    ...opts,
  });
  return { store, backend, clock };
}

describe('SessionStore: jobs', () => {
  it('round-trips a job with its segments, language fields and source Blob', async () => {
    const { store } = await openStore();
    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'video/mp4' });
    await store.put({ ...job('a'), language_candidates: [{ language: 'en', probability: 0.98 }] }, blob);
    const got = await store.get('a');
    expect(got?.segments.map((s) => s.text)).toEqual(['hello there', 'general kenobi']);
    expect(got).toMatchObject({ language: 'en', language_probability: 0.98, media_type: 'video/mp4', version: 1 });
    expect(got?.language_candidates).toEqual([{ language: 'en', probability: 0.98 }]);
    const media = await store.getMedia('a');
    expect(media?.size).toBe(3);
    expect(await store.get('missing')).toBeNull();
    expect(await store.getMedia('missing')).toBeNull();
  });

  it('lists SUMMARY_FIELDS only, newest first', async () => {
    const { store } = await openStore();
    await store.put(job('old', { created_at: 100 }));
    await store.put(job('new', { created_at: 300 }));
    await store.put(job('mid', { created_at: 200 }));
    const rows = await store.list();
    expect(rows.map((r) => r.id)).toEqual(['new', 'mid', 'old']);
    expect(Object.keys(rows[0])).toEqual([...SUMMARY_FIELDS]);
    expect(rows[0].segment_count).toBe(2);
  });

  it('stores copies: changing a returned job does not change the stored one', async () => {
    const { store } = await openStore();
    const got = (await store.put(job('a')))!;
    got.segments[0].text = 'mutated';
    got.title = 'mutated';
    const again = await store.get('a');
    expect(again?.title).toBe('clip');
    expect(again?.segments[0].text).toBe('hello there');
  });

  it('patch merges fields, keeps the Blob and bumps the version', async () => {
    const { store } = await openStore();
    await store.put(job('a', { status: 'running', progress: 0, segments: [] }), new Blob(['x']));
    await store.patch('a', { progress: 0.5, phase: 'transcribing', segments: [seg(0, 0, 1, 'hi')] });
    const got = await store.get('a');
    expect(got).toMatchObject({ progress: 0.5, phase: 'transcribing', segment_count: 1, version: 2 });
    expect(await store.getMedia('a')).not.toBeNull();
    await expect(store.patch('nope', { progress: 1 })).rejects.toBeInstanceOf(SessionStoreError);
  });

  it('keeps two quick patches from losing each other', async () => {
    const { store } = await openStore();
    await store.put(job('a'));
    await Promise.all([store.patch('a', { title: 'one' }), store.patch('a', { language: 'hi' })]);
    expect(await store.get('a')).toMatchObject({ title: 'one', language: 'hi', version: 3 });
  });

  it('a failed write leaves nothing behind', async () => {
    const { store, backend } = await openStore();
    backend.failNextWrite = new Error('QuotaExceededError');
    // (a write that fails only because of the file is retried without it: "a file the browser will not store" below)
    await expect(store.put(job('a'))).rejects.toThrow('QuotaExceededError');
    expect(await store.list()).toEqual([]);
    expect(backend.size('media')).toBe(0);
  });
});

describe('SessionStore: edits and titles (jobs.py update_segments / update_title)', () => {
  it('applies text edits, drops word timings, marks the segment edited, removes deleted ones', async () => {
    const stats: Stats = {
      word_count: 1,
      segment_count: 1,
      speech_seconds: 2,
      words_per_minute: null,
      avg_confidence: null,
      low_confidence_segments: 0,
      keywords: [],
    };
    const computeStats = vi.fn((_s: Segment[], _d: number | null) => stats);
    const { store } = await openStore(undefined, undefined, { computeStats });
    await store.put(job('a'));
    const out = await store.patchSegments('a', [
      { id: 0, text: '  Hello there!  ' },
      { id: 1, text: 'general kenobi', deleted: true },
    ]);
    expect(out.segments).toEqual([
      { ...seg(0, 0, 2, 'Hello there!'), words: null, edited: true },
    ]);
    expect(out.segment_count).toBe(1);
    expect(out.stats).toBe(stats);
    expect(computeStats).toHaveBeenCalledWith(out.segments, 4);
    expect((await store.get('a'))?.segments.length).toBe(1);
  });

  it('keeps words when the text did not change, and clamps the times', async () => {
    const { store } = await openStore();
    await store.put(job('a'));
    const out = await store.patchSegments('a', [{ id: 1, text: 'general kenobi', start: -3, end: -1 }]);
    expect(out.segments[1].words).not.toBeNull();
    expect(out.segments[1].edited).toBeUndefined();
    expect(out.segments[1].start).toBe(0);
    expect(out.segments[1].end).toBeCloseTo(0.1, 9);
    expect(out.stats).toBeNull(); // no computeStats hook: stats stay as they were
  });

  it('refuses to edit an unfinished transcript and an unknown job', async () => {
    const { store } = await openStore();
    await store.put(job('a', { status: 'running' }));
    await expect(store.patchSegments('a', [])).rejects.toMatchObject({
      code: 'invalid',
      message: 'The transcript is not finished yet.',
    });
    await expect(store.patchSegments('b', [])).rejects.toMatchObject({ code: 'not-found' });
  });

  it('renames: trimmed, at most 200 characters, empty keeps the old title', async () => {
    const { store } = await openStore();
    await store.put(job('a'));
    expect((await store.setTitle('a', '  Interview  ')).title).toBe('Interview');
    expect((await store.setTitle('a', '   ')).title).toBe('Interview');
    expect((await store.setTitle('a', 'x'.repeat(250))).title.length).toBe(200);
    expect((await store.get('a'))?.segments.length).toBe(2);
  });
});

describe('SessionStore: delete and delete-my-data', () => {
  it('deletes one job with its segments and file; a running job must be cancelled first', async () => {
    const { store, backend } = await openStore();
    await store.put(job('a'), new Blob(['x']));
    await store.put(job('r', { status: 'running' }));
    await store.delete('a');
    expect(await store.get('a')).toBeNull();
    expect(backend.size('segments')).toBe(1);
    expect(backend.size('media')).toBe(0);
    await expect(store.delete('r')).rejects.toMatchObject({ message: 'Cancel the running job first.' });
    await expect(store.delete('a')).rejects.toMatchObject({ code: 'not-found' });
  });

  it('clear() wipes everything, starts a fresh session id and is not an ended session', async () => {
    let n = 0;
    const { store, backend } = await openStore(undefined, undefined, { newSessionId: () => `sid${++n}`.padEnd(32, '0') });
    await store.put(job('a'), new Blob(['x']));
    await store.put(job('b'));
    const before = await store.info();
    expect(await store.clear()).toBe(2);
    expect(await store.list()).toEqual([]);
    expect(backend.size('media')).toBe(0);
    expect(backend.size('segments')).toBe(0);
    const after = await store.info();
    expect(after.session_id).not.toBe(before.session_id);
    expect(after.job_count).toBe(0);
    expect(store.ended).toBeNull();
  });

  it('deleteModels() deletes the transformers-cache only when asked', async () => {
    const deleted: string[] = [];
    const caches = { delete: async (name: string) => (deleted.push(name), true) };
    const { store } = await openStore(undefined, undefined, { caches });
    await store.put(job('a'));
    await store.clear();
    expect(deleted).toEqual([]);
    expect(await store.deleteModels()).toBe(true);
    expect(deleted).toEqual([MODEL_CACHE_NAME]);
    const { store: none } = await openStore(undefined, undefined, { caches: null });
    expect(await none.deleteModels()).toBe(false);
  });
});

describe('SessionStore: idle expiry (sessions.py: 30 min idle, a running job keeps it alive)', () => {
  it('ends the session after 30 idle minutes and deletes everything', async () => {
    const ended: SessionEnded[] = [];
    const { store, clock, backend } = await openStore(undefined, undefined, { onEnded: (e) => ended.push(e) });
    await store.put(job('a'), new Blob(['x']));
    clock.advance(29 * MIN);
    expect(await store.checkExpiry()).toBe(false);
    clock.advance(2 * MIN);
    expect(await store.checkExpiry()).toBe(true);
    expect(await store.list()).toEqual([]);
    expect(backend.size('media')).toBe(0);
    expect(ended).toEqual([{ reason: 'expired', idleSeconds: 31 * 60, jobCount: 1 }]);
    expect(store.ended).toEqual(ended[0]);
    store.dismissEnded();
    expect(store.ended).toBeNull();
  });

  it('the idle time is configurable', async () => {
    const { store, clock } = await openStore(undefined, undefined, { idleMinutes: 5 });
    await store.put(job('a'));
    clock.advance(6 * MIN);
    expect(await store.checkExpiry()).toBe(true);
  });

  it('touch() restarts the idle clock', async () => {
    const { store, clock } = await openStore();
    await store.put(job('a'));
    clock.advance(20 * MIN);
    await store.touch();
    clock.advance(20 * MIN);
    expect(await store.checkExpiry()).toBe(false);
    expect((await store.info()).expires_in_seconds).toBe(10 * 60);
    clock.advance(11 * MIN);
    expect(await store.checkExpiry()).toBe(true);
  });

  it('a running job of this page keeps the session alive; finishing it is activity', async () => {
    const { store, clock } = await openStore();
    await store.put(job('a', { status: 'running', segments: [] }));
    clock.advance(120 * MIN);
    expect(await store.checkExpiry()).toBe(false);
    expect((await store.info()).expires_in_seconds).toBe(30 * 60);
    await store.patch('a', { status: 'done', progress: 1 });
    clock.advance(29 * MIN);
    expect(await store.checkExpiry()).toBe(false);
    clock.advance(2 * MIN);
    expect(await store.checkExpiry()).toBe(true);
  });

  it('an empty idle session ends silently (nothing was lost)', async () => {
    const ended = vi.fn();
    const { store, clock } = await openStore(undefined, undefined, { onEnded: ended });
    clock.advance(31 * MIN);
    expect(await store.checkExpiry()).toBe(false);
    expect(ended).not.toHaveBeenCalled();
  });

  it('checks on an interval and fires the ended callback', async () => {
    vi.useFakeTimers();
    try {
      const clock = new Clock();
      const ended = vi.fn();
      const store = await SessionStore.open(new MemoryBackend(), {
        now: clock.now,
        locks: null,
        caches: null,
        checkIntervalMs: MIN,
      });
      store.onEnded(ended);
      await store.put(job('a'));
      clock.advance(31 * MIN);
      await vi.advanceTimersByTimeAsync(MIN);
      await vi.waitFor(() => expect(ended).toHaveBeenCalledTimes(1));
      store.close();
    } finally {
      vi.useRealTimers();
    }
  });

  it('unsubscribing stops the ended callback', async () => {
    const { store, clock } = await openStore();
    const cb = vi.fn();
    const off = store.onEnded(cb);
    off();
    await store.put(job('a'));
    clock.advance(31 * MIN);
    await store.checkExpiry();
    expect(cb).not.toHaveBeenCalled();
  });
});

describe('SessionStore: reload (a new store instance on the same backend)', () => {
  it('keeps the jobs, the Blob, the edits and the session id', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const { store: first } = await openStore(backend, clock);
    await first.put(job('a'), new Blob([new Uint8Array(5)], { type: 'audio/mpeg' }));
    await first.setTitle('a', 'Renamed');
    await first.patchSegments('a', [{ id: 0, text: 'edited text' }]);
    const sid = (await first.info()).session_id;
    first.close();
    clock.advance(5 * MIN);
    const { store: second } = await openStore(backend, clock);
    expect((await second.list()).map((r) => [r.id, r.title])).toEqual([['a', 'Renamed']]);
    expect((await second.get('a'))?.segments[0]).toMatchObject({ text: 'edited text', edited: true });
    expect((await second.getMedia('a'))?.size).toBe(5);
    expect((await second.info()).session_id).toBe(sid);
    expect(second.ended).toBeNull();
  });

  it('ends a session that went idle while the page was closed, at open', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const { store: first } = await openStore(backend, clock);
    await first.put(job('a'), new Blob(['x']));
    first.close();
    clock.advance(45 * MIN);
    const ended = vi.fn();
    const { store: second } = await openStore(backend, clock, { onEnded: ended });
    expect(ended).toHaveBeenCalledWith({ reason: 'expired', idleSeconds: 45 * 60, jobCount: 1 });
    expect(second.ended?.reason).toBe('expired');
    expect(await second.list()).toEqual([]);
    expect(backend.size('media')).toBe(0);
  });

  it('marks a job whose page went away as interrupted (Web Locks: the lock is gone)', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks });
    await first.put(job('a', { status: 'running', phase: 'transcribing', progress: 0.4 }));
    expect(locks.held.has('tv-job-a')).toBe(true);
    first.close(); // the page unloads: its locks are released
    await new Promise((r) => setTimeout(r, 0));
    expect(locks.held.has('tv-job-a')).toBe(false);
    const { store: second } = await openStore(backend, clock, { locks });
    expect(await second.get('a')).toMatchObject({
      status: 'error',
      error: INTERRUPTED_ERROR,
      phase: null,
      eta_seconds: null,
    });
    expect((await second.getMedia('a'))).toBeNull(); // no Blob was stored in this case
  });

  it('leaves a job alone that another tab is still running, and it keeps the session alive', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks: null });
    await first.put(job('a', { status: 'running' }));
    first.close();
    locks.external.add('tv-job-a');
    clock.advance(60 * MIN);
    const { store: second } = await openStore(backend, clock, { locks });
    expect((await second.get('a'))?.status).toBe('running');
    expect(second.ended).toBeNull();
    locks.external.clear();
    // the first background check leaves it to a page that may be reopening; the next one ends it, then the idle session
    expect(await second.checkExpiry()).toBe(false);
    expect((await second.get('a'))?.status).toBe('running');
    expect(await second.checkExpiry()).toBe(true); // interrupted, then idle for an hour
  });

  it('without Web Locks a running job counts as alive until its last write is 10 minutes old', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const { store: first } = await openStore(backend, clock);
    await first.put(job('a', { status: 'running' }));
    first.close();
    clock.advance(5 * MIN);
    const { store: second } = await openStore(backend, clock);
    expect((await second.get('a'))?.status).toBe('running');
    clock.advance(6 * MIN);
    await second.checkExpiry();
    expect((await second.get('a'))?.status).toBe('error');
  });

  it('without Web Locks the page working on a job keeps it fresh, so another tab never runs it a second time', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const { store: tab } = await openStore(backend, clock);
    await tab.put(job('a', { status: 'running', phase: 'loading_model' }), new Blob(['x']));
    // a 25-minute model download without a single write of the runner; the page's check runs every minute
    for (let m = 0; m < 25; m++) {
      clock.advance(MIN);
      await tab.checkExpiry();
    }
    const { store: other } = await openStore(backend, clock, { resumeInterrupted: true });
    expect(other.takeRecovered()).toEqual([]);
    expect(await other.get('a')).toMatchObject({ status: 'running', version: 1 }); // refreshed, not changed
  });
});

describe('SessionStore: info() as GET /api/session', () => {
  it('reports the short session id, the clock and the job count', async () => {
    const { store, clock } = await openStore(undefined, undefined, { newSessionId: () => 'ab'.repeat(16) });
    await store.put(job('a'));
    clock.advance(10 * MIN);
    expect(await store.info()).toEqual({
      session_id: 'abababababab',
      created_at: T0 / 1000,
      last_seen: T0 / 1000,
      expires_in_seconds: 20 * 60,
      job_count: 1,
    });
  });
});

describe('SessionStore: resumeInterrupted (a reload continues the job instead of failing it)', () => {
  const media = () => new Blob(['abc'], { type: 'audio/mpeg' });
  const tick = () => new Promise((r) => setTimeout(r, 0));

  /** A page puts the job, then goes away (its locks are released); the next page opens the store. */
  async function interrupted(over: Partial<Job>, withMedia = true, opts: SessionStoreOptions = {}) {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks });
    await first.put(job('a', { status: 'running', phase: 'transcribing', progress: 0.4, ...over }), withMedia ? media() : undefined);
    first.close();
    await tick();
    const { store: second } = await openStore(backend, clock, { locks, resumeInterrupted: true, ...opts });
    return { backend, clock, locks, second };
  }

  it('queues a running job again for this page, keeps its lines, and holds its lock', async () => {
    const { second, locks } = await interrupted({});
    expect(await second.get('a')).toMatchObject({
      status: 'queued',
      error: null,
      phase: null,
      progress: 0.4,
      segment_count: 2,
      resume_count: 1,
      stuck_count: 0,
      resume_mark: 2,
      low_memory: false,
    });
    expect((await second.get('a'))!.segments).toHaveLength(2);
    expect(second.takeRecovered()).toEqual(['a']);
    expect(second.takeRecovered()).toEqual([]); // taken once
    expect(locks.held.has('tv-job-a')).toBe(true); // another tab's check leaves it alone now
    expect(second.ended).toBeNull();
  });

  it('a queued job that never started is queued again without counting as a resume', async () => {
    const { second } = await interrupted({ status: 'queued', phase: null, progress: 0, segments: [] });
    expect(await second.get('a')).toMatchObject({ status: 'queued', resume_count: 0, stuck_count: 0 });
  });

  it('ends a job being cancelled as cancelled, and one without its file with a message that asks for the file', async () => {
    expect((await (await interrupted({ cancel_requested: true })).second.get('a'))!.status).toBe('cancelled');
    const { second, locks } = await interrupted({}, false);
    // "Run it again" cannot work without the file: the message says to choose it again
    expect(await second.get('a')).toMatchObject({ status: 'error', error: INTERRUPTED_NO_FILE_ERROR });
    expect(second.takeRecovered()).toEqual([]);
    expect(locks.held.has('tv-job-a')).toBe(false); // an ended job does not keep the lock it was claimed with
  });

  it('without the option a job still ends with INTERRUPTED_ERROR', async () => {
    const { second } = await interrupted({}, true, { resumeInterrupted: false });
    expect(await second.get('a')).toMatchObject({ status: 'error', error: INTERRUPTED_ERROR, checkpoint: null });
  });

  it('a reload loop without new lines ends the job (memory), switching to low-memory mode on the way', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks });
    await first.put(job('a', { status: 'running', phase: 'transcribing' }), media());
    first.close();
    let rec: Awaited<ReturnType<SessionStore['get']>> = null;
    let opens = 0;
    for (;;) {
      await tick();
      const { store } = await openStore(backend, clock, { locks, resumeInterrupted: true });
      opens++;
      rec = await store.get('a');
      if (rec!.status !== 'queued') break;
      expect(rec).toMatchObject({ stuck_count: opens - 1, low_memory: opens > 1 });
      await store.patch('a', { status: 'running', phase: 'transcribing' }); // the runner starts it again; no new line
      store.close();
    }
    expect(opens).toBe(MAX_STUCK_RESUMES + 1);
    expect(rec).toMatchObject({ status: 'error', error: STUCK_ERROR });
  });

  it('new lines between interruptions are progress: the count starts again', async () => {
    const { second, backend, clock, locks } = await interrupted({});
    await second.patch('a', { status: 'running', phase: 'transcribing' });
    second.close();
    await tick();
    let { store } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    expect(await store.get('a')).toMatchObject({ status: 'queued', stuck_count: 1 });
    await store.patch('a', {
      status: 'running',
      phase: 'transcribing',
      segments: [seg(0, 0, 2, 'a'), seg(1, 2, 4, 'b'), seg(2, 4, 6, 'c')],
    });
    store.close();
    await tick();
    ({ store } = await openStore(backend, clock, { locks, resumeInterrupted: true }));
    expect(await store.get('a')).toMatchObject({ status: 'queued', stuck_count: 0, resume_mark: 3 });
  });

  it('a reload during the model download that got further never counts; a model that crashes the tab while loading does', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks });
    await first.put(job('a', { status: 'running', phase: 'loading_model', segments: [] }), media());
    await first.patch('a', { downloaded_bytes: 10e6 });
    first.close();
    // ten reloads, each after more of the model arrived: still queued, never stuck
    for (let i = 1; i <= 10; i++) {
      await tick();
      const { store } = await openStore(backend, clock, { locks, resumeInterrupted: true });
      const rec = (await store.get('a'))!;
      expect(rec).toMatchObject({ status: 'queued', stuck_count: 0, low_memory: false });
      await store.patch('a', { status: 'running', phase: 'loading_model', downloaded_bytes: (10 + i) * 1e6 });
      store.close();
    }
    // the download is complete, but loading it into memory kills the tab every time
    let rec: Awaited<ReturnType<SessionStore['get']>> = null;
    let opens = 0;
    for (;;) {
      await tick();
      const { store } = await openStore(backend, clock, { locks, resumeInterrupted: true });
      opens++;
      rec = await store.get('a');
      if (rec!.status !== 'queued') break;
      expect(rec!.low_memory).toBe(false); // the model's size, not the audio: low-memory mode does not help here
      await store.patch('a', { status: 'running', phase: 'loading_model' });
      store.close();
    }
    expect(opens).toBe(MAX_STUCK_RESUMES + 1);
    expect(rec).toMatchObject({ status: 'error', error: STUCK_LOADING_ERROR });
    expect(STUCK_LOADING_ERROR).toContain('Fastest');
  });

  it('tells the runner when a background check took over a job of a tab that went away', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: other } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    const heard = vi.fn();
    other.onRecovered(heard);
    const { store: tab } = await openStore(backend, clock, { locks });
    await tab.put(job('b', { status: 'running', phase: 'transcribing' }), media());
    await other.checkExpiry();
    expect(heard).not.toHaveBeenCalled(); // the tab still holds it
    tab.close();
    await tick();
    // the first check after the tab went away gives a reloading page the chance to take its own job back
    expect(await other.checkExpiry()).toBe(false);
    expect(heard).not.toHaveBeenCalled();
    expect((await other.get('b'))?.status).toBe('running');
    await other.checkExpiry();
    expect(heard).toHaveBeenCalledTimes(1);
    expect(other.takeRecovered()).toEqual(['b']);
  });

  it('a page that reloads takes its job back before another tab\'s background check does', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: other } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    const { store: tab } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    await tab.put(job('b', { status: 'running', phase: 'transcribing' }), media());
    tab.close(); // the visitor presses reload
    await tick();
    await other.checkExpiry(); // the other tab's timer fires in the gap
    const { store: reloaded } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    expect(reloaded.takeRecovered()).toEqual(['b']);
    await other.checkExpiry();
    expect(other.takeRecovered()).toEqual([]); // the reloaded page holds it now
    expect((await other.get('b'))?.status).toBe('queued');
  });

  it('two tabs opening at the same moment never both continue the same job', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks });
    await first.put(job('a', { status: 'running', phase: 'transcribing' }), media());
    first.close();
    await tick();
    // a browser restoring two tabs: both checks read the job before either has claimed it
    const [one, two] = await Promise.all([
      openStore(backend, clock, { locks, resumeInterrupted: true }),
      openStore(backend, clock, { locks, resumeInterrupted: true }),
    ]);
    const taken = [...one.store.takeRecovered(), ...two.store.takeRecovered()];
    expect(taken).toEqual(['a']);
    expect(await one.store.get('a')).toMatchObject({ status: 'queued', resume_count: 1 });
  });

  it('leaves a job to the page that is waiting for its lock (alive, the lock not granted yet)', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks: null });
    await first.put(job('c', { status: 'running', phase: 'transcribing' }), media());
    first.close();
    locks.externalPending.add('tv-job-c');
    const { store: third } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    expect(third.takeRecovered()).toEqual([]);
    expect((await third.get('c'))?.status).toBe('running');
  });
});

describe('openSessionBackend: memory where IndexedDB cannot be used', () => {
  /** An IDBFactory whose open() request fails, never finishes, or throws at once. */
  const factory = (how: 'error' | 'hang' | 'throw') =>
    ({
      open() {
        if (how === 'throw') throw Object.assign(new Error('access denied'), { name: 'SecurityError' });
        const req: { error?: unknown; onerror?: () => void } = {};
        if (how === 'error') {
          setTimeout(() => {
            req.error = Object.assign(new Error('A mutation operation was attempted on a database that did not allow mutations.'), {
              name: 'InvalidStateError',
            });
            req.onerror?.();
          });
        }
        return req;
      },
    }) as unknown as IDBFactory;

  it.each([
    ['no IndexedDB at all', null, 'no IndexedDB'],
    ['open() fails (Firefox private window)', factory('error'), 'InvalidStateError'],
    ['open() throws (site data blocked)', factory('throw'), 'SecurityError'],
    ['open() never finishes', factory('hang'), 'did not open'],
  ])('%s: a working session in memory, and the reason for the Logs page', async (_name, f, why) => {
    const reasons: string[] = [];
    const backend = await openSessionBackend({ factory: f, timeoutMs: 20, onFallback: (r) => reasons.push(r) });
    expect(backend).toBeInstanceOf(MemoryBackend);
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toContain(why);
    const store = await SessionStore.open(backend, { locks: null, caches: null, checkIntervalMs: 0 });
    await store.put(job('a'), new Blob(['x']));
    expect((await store.list()).map((j) => j.id)).toEqual(['a']);
  });
});

describe('SessionStore: a file the browser will not store', () => {
  it('keeps the job and holds the file in this page only, so it can still be transcribed now', async () => {
    const { store, backend } = await openStore();
    const quota = Object.assign(new Error('The quota has been exceeded.'), { name: 'QuotaExceededError' });
    const write = backend.write.bind(backend);
    // the browser refuses every write that carries the big file (quota, Safari's Blob error), the rest succeeds
    backend.write = async (ops) => {
      if (ops.some((op) => op.store === 'media' && 'value' in op)) throw quota;
      return write(ops);
    };
    const file = new Blob([new Uint8Array(10)], { type: 'video/mp4' });
    const stored = await store.put(job('big', { status: 'queued' }), file);
    expect(stored).toMatchObject({ id: 'big', media_type: 'video/mp4' });
    expect(backend.size('media')).toBe(0);
    expect(await store.getMedia('big')).toBe(file);
    expect(store.mediaOnlyInPage('big')).toBe(true);
    await store.patch('big', { status: 'done' });
    expect(await store.getMedia('big')).toBe(file); // a patch keeps it
    await store.delete('big');
    expect(await store.getMedia('big')).toBeNull();
  });

  it('reports the original error when the job itself cannot be written either', async () => {
    const { store, backend } = await openStore();
    const quota = Object.assign(new Error('full'), { name: 'QuotaExceededError' });
    backend.write = async () => {
      throw quota;
    };
    await expect(store.put(job('x'), new Blob(['x']))).rejects.toBe(quota);
    expect(store.mediaOnlyInPage('x')).toBe(false);
  });

  it('after a reload such a job ends with the message that asks for the file again', async () => {
    const backend = new MemoryBackend();
    const clock = new Clock();
    const locks = new FakeLocks();
    const { store: first } = await openStore(backend, clock, { locks });
    const write = backend.write.bind(backend);
    backend.write = async (ops) => {
      if (ops.some((op) => op.store === 'media' && 'value' in op)) throw Object.assign(new Error('full'), { name: 'QuotaExceededError' });
      return write(ops);
    };
    await first.put(job('a', { status: 'running', phase: 'transcribing' }), new Blob(['abc']));
    first.close();
    await new Promise((r) => setTimeout(r, 0));
    const { store: second } = await openStore(backend, clock, { locks, resumeInterrupted: true });
    expect(await second.get('a')).toMatchObject({ status: 'error', error: INTERRUPTED_NO_FILE_ERROR });
    expect(await second.getMedia('a')).toBeNull();
  });
});
