import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LogService } from '../log.service';
import { EngineDevice } from './engine-device';
import { ModelPrefetch, PREFETCH_LOCK } from './model-prefetch';
import { TRANSPORT } from './token';

/** navigator.locks as one browser profile: `otherTab` = the lock is held by another tab. */
class FakeLocks {
  otherTab = false;
  readonly asked: string[] = [];
  async request(name: string, _o: { ifAvailable: boolean }, cb: (lock: unknown) => Promise<boolean> | boolean) {
    this.asked.push(name);
    return cb(this.otherTab ? null : { name });
  }
}

describe('ModelPrefetch: the background model download', () => {
  let prefetchModel: ReturnType<typeof vi.fn>;
  let locks: FakeLocks | undefined;

  function setUp(withLocks: boolean) {
    prefetchModel = vi.fn(async () => true);
    locks = withLocks ? new FakeLocks() : undefined;
    Object.defineProperty(navigator, 'locks', { value: locks, configurable: true });
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: TRANSPORT, useValue: { kind: 'browser', prefetchModel } },
        { provide: EngineDevice, useValue: { plan: async () => ({ facts: { mobile: false } }) } },
        { provide: LogService, useValue: { info() {}, debug() {}, warn() {} } },
      ],
    });
    return TestBed.inject(ModelPrefetch);
  }

  const settle = async () => {
    for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, 0));
  };

  afterEach(() => {
    Object.defineProperty(navigator, 'locks', { value: undefined, configurable: true });
  });

  it('downloads in this tab when no other tab is downloading, holding the lock meanwhile', async () => {
    const p = setUp(true);
    p.request('small', 'user');
    await settle();
    expect(locks!.asked).toEqual([PREFETCH_LOCK]);
    expect(prefetchModel).toHaveBeenCalledTimes(1);
    expect(p.state()).toMatchObject({ model: 'small', done: true });
  });

  it('leaves the download to another tab that is already on it (no second copy of the same file)', async () => {
    const p = setUp(true);
    locks!.otherTab = true;
    p.request('small', 'user');
    await settle();
    expect(prefetchModel).not.toHaveBeenCalled();
    expect(p.state()).toBeNull();
  });

  it('downloads as before where there are no Web Locks (old Safari)', async () => {
    const p = setUp(false);
    p.request('small', 'user');
    await settle();
    expect(prefetchModel).toHaveBeenCalledTimes(1);
  });
});
