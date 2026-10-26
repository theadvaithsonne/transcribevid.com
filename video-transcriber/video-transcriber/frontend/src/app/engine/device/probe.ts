/**
 * Capability probe: what this browser and device can do, read once at start-up and whenever the user opens the
 * model picker. Pure parsing on top of a small `ProbeEnvironment` so that specs can hand in fake navigators.
 */

export type PlatformClass = 'desktop' | 'tablet' | 'phone';
export type BrowserFamily = 'chrome' | 'edge' | 'safari' | 'firefox' | 'other';
export type RenderingEngine = 'blink' | 'webkit' | 'gecko' | 'other';

export interface GpuAdapterLike {
  features?: { has(name: string): boolean };
  limits?: { maxBufferSize?: number; maxStorageBufferBindingSize?: number };
  info?: { vendor?: string; architecture?: string; isFallbackAdapter?: boolean };
  /** older Chrome had it on the adapter itself */
  isFallbackAdapter?: boolean;
}

export interface NavigatorLike {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
  /** GB, Chrome rounds it to a power of two and caps it at 8; Safari and Firefox do not report it */
  deviceMemory?: number;
  hardwareConcurrency?: number;
  userAgentData?: { mobile?: boolean; platform?: string; brands?: { brand: string; version: string }[] };
  gpu?: { requestAdapter(): Promise<GpuAdapterLike | null> };
  storage?: { estimate?(): Promise<{ quota?: number; usage?: number }> };
  wakeLock?: unknown;
}

export interface WindowLike {
  innerWidth?: number;
  innerHeight?: number;
  matchMedia?(query: string): { matches: boolean };
  VideoDecoder?: unknown;
  AudioDecoder?: unknown;
}

export interface ProbeEnvironment {
  navigator: NavigatorLike;
  window?: WindowLike;
  /** how long to wait for requestAdapter before treating WebGPU as absent (a hung driver must not block the UI) */
  adapterTimeoutMs?: number;
}

export interface AdapterInfo {
  vendor: string | null;
  architecture: string | null;
  fallback: boolean;
  maxBufferSize: number | null;
}

export interface DeviceInfo {
  platform: PlatformClass;
  browser: BrowserFamily;
  engine: RenderingEngine;
  /** a real (non-fallback) WebGPU adapter answered */
  webgpu: boolean;
  shaderF16: boolean;
  adapter: AdapterInfo | null;
  webgpuError: string | null;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  storage: { quota: number | null; usage: number | null };
  /** VideoDecoder + AudioDecoder exist */
  webCodecs: boolean;
  /** use the non-WebCodecs decode path: Safari (WebKit), Firefox (Gecko), or no WebCodecs at all */
  decoderFallback: boolean;
  wakeLock: boolean;
  userAgent: string;
}

export interface UserAgentFacts {
  browser: BrowserFamily;
  engine: RenderingEngine;
  /** what the UA string alone says about the platform; the probe refines it with touch / pointer / viewport */
  platform: PlatformClass;
}

/** Browser family and rendering engine from the UA string (UA-CH brands win when present, see classify()). */
export function parseUserAgent(ua: string): UserAgentFacts {
  const ios = /iPhone|iPad|iPod/.test(ua);
  let browser: BrowserFamily = 'other';
  let engine: RenderingEngine = 'other';
  if (/Edg(e|A|iOS)?\//.test(ua)) browser = 'edge';
  else if (/FxiOS\//.test(ua) || /Firefox\//.test(ua)) browser = 'firefox';
  else if (/CriOS\//.test(ua) || (/Chrome\//.test(ua) && !/OPR\/|Opera/.test(ua))) browser = 'chrome';
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = 'safari';

  if (ios || (/AppleWebKit\//.test(ua) && !/Chrome\/|Chromium\/|Firefox\//.test(ua))) engine = 'webkit';
  else if (/Gecko\/\d/.test(ua) && /Firefox\//.test(ua)) engine = 'gecko';
  else if (/Chrome\/|Chromium\//.test(ua)) engine = 'blink';
  // every browser on iOS is WebKit underneath
  if (ios) engine = 'webkit';

  let platform: PlatformClass = 'desktop';
  if (/iPhone|iPod/.test(ua)) platform = 'phone';
  else if (/iPad/.test(ua)) platform = 'tablet';
  else if (/Android/.test(ua)) platform = /Mobile/.test(ua) ? 'phone' : 'tablet';
  else if (/Windows Phone|IEMobile|BlackBerry|webOS/.test(ua)) platform = 'phone';
  return { browser, engine, platform };
}

/** Browser, engine and platform class from everything the navigator / window expose; no async work. */
export function classify(env: ProbeEnvironment): UserAgentFacts {
  const nav = env.navigator;
  const ua = nav.userAgent ?? '';
  const facts = parseUserAgent(ua);
  const ch = nav.userAgentData;
  if (ch?.brands?.length) {
    const brands = ch.brands.map((b) => b.brand);
    if (brands.some((b) => /Microsoft Edge/i.test(b))) facts.browser = 'edge';
    else if (brands.some((b) => /Google Chrome/i.test(b))) facts.browser = 'chrome';
    else if (brands.some((b) => /Chromium/i.test(b)) && facts.browser === 'other') facts.browser = 'chrome';
    facts.engine = 'blink';
  }

  let platform = facts.platform;
  if (ch && typeof ch.mobile === 'boolean') {
    if (ch.mobile) platform = 'phone';
    else if (ch.platform === 'Android') platform = 'tablet';
    else if (ch.platform && ch.platform !== 'Android') platform = 'desktop';
  }
  // iPadOS 13+ presents itself as a Mac; the touch points give it away
  const touch = nav.maxTouchPoints ?? 0;
  if (platform === 'desktop' && /Macintosh/.test(ua) && touch > 1) platform = 'tablet';
  // last resort: a coarse pointer on a small viewport is a phone, on a big one a tablet
  const win = env.window;
  if (platform === 'desktop' && win?.matchMedia) {
    let coarse = false;
    try {
      coarse = win.matchMedia('(pointer: coarse)').matches && !win.matchMedia('(pointer: fine)').matches;
    } catch {
      coarse = false;
    }
    if (coarse && touch > 0) {
      const shortSide = Math.min(win.innerWidth ?? Infinity, win.innerHeight ?? Infinity);
      platform = shortSide < 600 ? 'phone' : 'tablet';
    }
  }
  return { ...facts, platform };
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

async function probeGpu(
  nav: NavigatorLike,
  timeoutMs: number,
): Promise<Pick<DeviceInfo, 'webgpu' | 'shaderF16' | 'adapter' | 'webgpuError'>> {
  const none = { webgpu: false, shaderF16: false, adapter: null, webgpuError: null as string | null };
  if (!nav.gpu || typeof nav.gpu.requestAdapter !== 'function') return none;
  let adapter: GpuAdapterLike | null;
  try {
    adapter = await withTimeout(nav.gpu.requestAdapter(), timeoutMs, null);
  } catch (e) {
    return { ...none, webgpuError: String((e as Error)?.message ?? e) };
  }
  if (!adapter) return { ...none, webgpuError: 'requestAdapter returned null' };
  const fallback = !!(adapter.info?.isFallbackAdapter ?? adapter.isFallbackAdapter);
  const info: AdapterInfo = {
    vendor: adapter.info?.vendor ?? null,
    architecture: adapter.info?.architecture ?? null,
    fallback,
    maxBufferSize: adapter.limits?.maxBufferSize ?? null,
  };
  let shaderF16 = false;
  try {
    shaderF16 = !!adapter.features?.has('shader-f16');
  } catch {
    shaderF16 = false;
  }
  // a software (SwiftShader) adapter is slower than WASM and is reported as "no WebGPU"
  return {
    webgpu: !fallback,
    shaderF16: !fallback && shaderF16,
    adapter: info,
    webgpuError: fallback ? 'only a software fallback adapter is available' : null,
  };
}

async function probeStorage(nav: NavigatorLike): Promise<DeviceInfo['storage']> {
  try {
    const est = await nav.storage?.estimate?.();
    return { quota: est?.quota ?? null, usage: est?.usage ?? null };
  } catch {
    return { quota: null, usage: null };
  }
}

function positiveOrNull(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null;
}

/** The browser's own navigator / window; absent during prerendering, where the probe reports a bare desktop. */
export function defaultEnvironment(): ProbeEnvironment {
  const g = globalThis as unknown as { navigator?: NavigatorLike; window?: WindowLike };
  return { navigator: g.navigator ?? {}, window: g.window };
}

export async function probeDevice(env: ProbeEnvironment = defaultEnvironment()): Promise<DeviceInfo> {
  const nav = env.navigator;
  const facts = classify(env);
  const [gpu, storage] = await Promise.all([probeGpu(nav, env.adapterTimeoutMs ?? 3000), probeStorage(nav)]);
  const win = env.window;
  const webCodecs = !!win && typeof win.VideoDecoder === 'function' && typeof win.AudioDecoder === 'function';
  return {
    platform: facts.platform,
    browser: facts.browser,
    engine: facts.engine,
    ...gpu,
    deviceMemory: positiveOrNull(nav.deviceMemory),
    hardwareConcurrency: positiveOrNull(nav.hardwareConcurrency),
    storage,
    webCodecs,
    decoderFallback: facts.engine !== 'blink' || !webCodecs,
    wakeLock: !!nav.wakeLock,
    userAgent: nav.userAgent ?? '',
  };
}
