import { WakeLock, WakeLockDocumentLike, WakeLockSentinelLike } from './wake-lock';

class FakeSentinel implements WakeLockSentinelLike {
  released = false;
  private listeners: (() => void)[] = [];
  async release() {
    this.released = true;
  }
  addEventListener(_type: 'release', l: () => void) {
    this.listeners.push(l);
  }
  /** what the browser does when the tab is hidden */
  drop() {
    this.released = true;
    this.listeners.forEach((l) => l());
  }
}

class FakeDocument implements WakeLockDocumentLike {
  visibilityState = 'visible';
  listeners = new Set<() => void>();
  addEventListener(_t: 'visibilitychange', l: () => void) {
    this.listeners.add(l);
  }
  removeEventListener(_t: 'visibilitychange', l: () => void) {
    this.listeners.delete(l);
  }
  set(state: 'visible' | 'hidden') {
    this.visibilityState = state;
    this.listeners.forEach((l) => l());
  }
}

function setup(fail = false) {
  const sentinels: FakeSentinel[] = [];
  const doc = new FakeDocument();
  const nav = {
    wakeLock: {
      request: async (type: 'screen') => {
        expect(type).toBe('screen');
        if (fail) throw new Error('NotAllowedError');
        const s = new FakeSentinel();
        sentinels.push(s);
        return s;
      },
    },
  };
  return { lock: new WakeLock({ navigator: nav, document: doc }), sentinels, doc };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('WakeLock', () => {
  it('asks once while the browser is still answering: no second sentinel that is never released', async () => {
    const sentinels: FakeSentinel[] = [];
    let answer!: () => void;
    const nav = {
      wakeLock: {
        request: () =>
          new Promise<FakeSentinel>((resolve) => {
            answer = () => {
              const s = new FakeSentinel();
              sentinels.push(s);
              resolve(s);
            };
          }),
      },
    };
    const doc = new FakeDocument();
    const lock = new WakeLock({ navigator: nav, document: doc });
    const a = lock.start();
    const b = lock.start(); // the next job starts at once (the first one failed fast)
    doc.set('visible'); // or a tab switch fires meanwhile
    answer();
    expect(await a).toBe(true);
    expect(await b).toBe(true);
    expect(sentinels).toHaveLength(1);
    await lock.stop();
    expect(sentinels[0].released).toBe(true);
    expect(lock.stats.requests).toBe(1);
  });

  it('requests the screen lock on job start and releases it on finish', async () => {
    const { lock, sentinels, doc } = setup();
    expect(await lock.start()).toBe(true);
    expect(lock.held).toBe(true);
    expect(sentinels.length).toBe(1);
    await lock.stop();
    expect(sentinels[0].released).toBe(true);
    expect(lock.held).toBe(false);
    expect(doc.listeners.size).toBe(0);
  });

  it('re-requests after the browser drops it on hide, once the tab is visible again', async () => {
    const { lock, sentinels, doc } = setup();
    await lock.start();
    doc.set('hidden');
    sentinels[0].drop();
    await flush();
    expect(lock.held).toBe(false);
    expect(sentinels.length).toBe(1); // not while hidden
    doc.set('visible');
    await flush();
    expect(sentinels.length).toBe(2);
    expect(lock.held).toBe(true);
    await lock.stop();
  });

  it('does nothing on visibilitychange after the job finished', async () => {
    const { lock, sentinels, doc } = setup();
    await lock.start();
    await lock.stop();
    doc.set('hidden');
    doc.set('visible');
    await flush();
    expect(sentinels.length).toBe(1);
  });

  it('does not stack locks when start is called twice', async () => {
    const { lock, sentinels } = setup();
    await lock.start();
    await lock.start();
    expect(sentinels.length).toBe(1);
    await lock.stop();
  });

  it('is a no-op without the API and counts a refusal', async () => {
    expect(await new WakeLock({ navigator: {}, document: new FakeDocument() }).start()).toBe(false);
    const { lock } = setup(true);
    expect(await lock.start()).toBe(false);
    expect(lock.stats).toEqual({ requests: 1, failures: 1 });
    await lock.stop();
  });

  it('releases a lock that arrives after stop()', async () => {
    let resolve!: (s: FakeSentinel) => void;
    const s = new FakeSentinel();
    const lock = new WakeLock({
      navigator: { wakeLock: { request: () => new Promise<FakeSentinel>((r) => (resolve = r)) } },
      document: new FakeDocument(),
    });
    const started = lock.start();
    await lock.stop();
    resolve(s);
    expect(await started).toBe(false);
    expect(s.released).toBe(true);
  });
});
