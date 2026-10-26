/**
 * Keeps the screen on while a job runs. The lock is requested on job start, released on finish, and requested
 * again when the tab becomes visible (the browser drops it on every hide). Everything is best effort: no API, a
 * refusal (low battery, permissions policy) or a hidden tab just means no lock.
 */

export interface WakeLockSentinelLike {
  released?: boolean;
  release(): Promise<void>;
  addEventListener?(type: 'release', listener: () => void): void;
}

export interface WakeLockNavigatorLike {
  wakeLock?: { request(type: 'screen'): Promise<WakeLockSentinelLike> };
}

export interface WakeLockDocumentLike {
  visibilityState?: string;
  addEventListener(type: 'visibilitychange', listener: () => void): void;
  removeEventListener(type: 'visibilitychange', listener: () => void): void;
}

export interface WakeLockEnvironment {
  navigator?: WakeLockNavigatorLike;
  document?: WakeLockDocumentLike;
}

function defaultEnvironment(): WakeLockEnvironment {
  const g = globalThis as unknown as WakeLockEnvironment;
  return { navigator: g.navigator, document: g.document };
}

export class WakeLock {
  private sentinel: WakeLockSentinelLike | null = null;
  private wanted = false;
  private listening = false;
  private pending: Promise<boolean> | null = null;
  /** how many requests were made and how many failed; the Logs page shows them */
  readonly stats = { requests: 0, failures: 0 };

  constructor(private readonly env: WakeLockEnvironment = defaultEnvironment()) {}

  get supported(): boolean {
    return typeof this.env.navigator?.wakeLock?.request === 'function';
  }

  /** true while a sentinel is held */
  get held(): boolean {
    return !!this.sentinel && !this.sentinel.released;
  }

  /** Call when a job starts: holds the lock until stop(), re-acquiring it after every tab switch. */
  async start(): Promise<boolean> {
    this.wanted = true;
    if (!this.listening && this.env.document) {
      this.env.document.addEventListener('visibilitychange', this.onVisibility);
      this.listening = true;
    }
    return this.request();
  }

  /** Call when the job finishes, fails or is cancelled. */
  async stop(): Promise<void> {
    this.wanted = false;
    if (this.listening && this.env.document) {
      this.env.document.removeEventListener('visibilitychange', this.onVisibility);
      this.listening = false;
    }
    const s = this.sentinel;
    this.sentinel = null;
    if (s && !s.released) {
      try {
        await s.release();
      } catch {
        // already gone
      }
    }
  }

  private readonly onVisibility = (): void => {
    if (this.wanted && this.env.document?.visibilityState === 'visible' && !this.held) void this.request();
  };

  /**
   * One request at a time: a second start() or a tab switch while the browser is still answering would otherwise get
   * a second sentinel, and the first one would never be released (the screen stays on after the job).
   */
  private request(): Promise<boolean> {
    this.pending ??= this.ask().finally(() => (this.pending = null));
    return this.pending;
  }

  private async ask(): Promise<boolean> {
    if (!this.wanted || !this.supported || this.held) return this.held;
    if (this.env.document && this.env.document.visibilityState === 'hidden') return false;
    this.stats.requests++;
    try {
      const s = await this.env.navigator!.wakeLock!.request('screen');
      if (!this.wanted) {
        await s.release().catch(() => undefined);
        return false;
      }
      this.sentinel = s;
      s.addEventListener?.('release', () => {
        if (this.sentinel === s) this.sentinel = null;
      });
      return true;
    } catch {
      this.stats.failures++;
      return false;
    }
  }
}
