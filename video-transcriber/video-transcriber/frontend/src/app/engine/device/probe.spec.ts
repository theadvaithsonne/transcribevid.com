import { planFor } from './plan';
import { GpuAdapterLike, NavigatorLike, WindowLike, parseUserAgent, probeDevice } from './probe';

const UA = {
  chromeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
  edgeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0',
  safariIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  chromeIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/155.0.0.0 Mobile/15E148 Safari/604.1',
  ipad:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
  androidChrome:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36',
  androidTablet:
    'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
  firefoxWin: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
  safariMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
};

function adapter(features: string[], over: Partial<GpuAdapterLike> = {}): GpuAdapterLike {
  return {
    features: new Set(features),
    limits: { maxBufferSize: 4294967296 },
    info: { vendor: 'amd', architecture: 'rdna-2', isFallbackAdapter: false },
    ...over,
  };
}

const gpuWith = (a: GpuAdapterLike | null) => ({ requestAdapter: async () => a });
const storage = (quota: number, usage = 0) => ({ estimate: async () => ({ quota, usage }) });
const webCodecsWindow: WindowLike = {
  innerWidth: 1280,
  innerHeight: 800,
  VideoDecoder: function VideoDecoder() {},
  AudioDecoder: function AudioDecoder() {},
  matchMedia: (q: string) => ({ matches: q === '(pointer: fine)' }),
};
const touchWindow = (w: number, h: number, webCodecs = true): WindowLike => ({
  innerWidth: w,
  innerHeight: h,
  ...(webCodecs ? { VideoDecoder: function () {}, AudioDecoder: function () {} } : {}),
  matchMedia: (q: string) => ({ matches: q === '(pointer: coarse)' }),
});

describe('probeDevice on fake navigators', () => {
  it('Chrome desktop with WebGPU + shader-f16 (this laptop)', async () => {
    const nav: NavigatorLike = {
      userAgent: UA.chromeWin,
      userAgentData: {
        mobile: false,
        platform: 'Windows',
        brands: [
          { brand: 'Google Chrome', version: '155' },
          { brand: 'Chromium', version: '155' },
        ],
      },
      deviceMemory: 8,
      hardwareConcurrency: 16,
      gpu: gpuWith(adapter(['shader-f16', 'subgroups'])),
      storage: storage(10307e6, 12e6),
      wakeLock: {},
    };
    const info = await probeDevice({ navigator: nav, window: webCodecsWindow });
    expect(info).toMatchObject({
      platform: 'desktop',
      browser: 'chrome',
      engine: 'blink',
      webgpu: true,
      shaderF16: true,
      deviceMemory: 8,
      hardwareConcurrency: 16,
      storage: { quota: 10307e6, usage: 12e6 },
      webCodecs: true,
      decoderFallback: false,
      wakeLock: true,
      webgpuError: null,
    });
    expect(info.adapter).toEqual({ vendor: 'amd', architecture: 'rdna-2', fallback: false, maxBufferSize: 4294967296 });
    expect(planFor(info).deviceClass).toBe('desktop-webgpu-f16-8gb');
  });

  it('Chrome desktop without WebGPU (no navigator.gpu, or no adapter)', async () => {
    const base: NavigatorLike = { userAgent: UA.chromeWin, deviceMemory: 8, hardwareConcurrency: 4 };
    const noGpu = await probeDevice({ navigator: base, window: webCodecsWindow });
    expect(noGpu).toMatchObject({ webgpu: false, shaderF16: false, adapter: null, webgpuError: null });
    const nullAdapter = await probeDevice({ navigator: { ...base, gpu: gpuWith(null) }, window: webCodecsWindow });
    expect(nullAdapter).toMatchObject({ webgpu: false, webgpuError: 'requestAdapter returned null' });
    expect(planFor(nullAdapter).deviceClass).toBe('desktop-wasm');
    expect(planFor(nullAdapter).defaultModel).toBe('base');
  });

  it('Safari on iOS: phone, WebKit, no deviceMemory, WebGPU without shader-f16, decoder fallback', async () => {
    const nav: NavigatorLike = {
      userAgent: UA.safariIos,
      maxTouchPoints: 5,
      hardwareConcurrency: 6,
      gpu: gpuWith(adapter([], { info: { vendor: 'apple', architecture: 'common-3' } })),
      storage: storage(1e9),
    };
    const info = await probeDevice({ navigator: nav, window: touchWindow(390, 844, false) });
    expect(info).toMatchObject({
      platform: 'phone',
      browser: 'safari',
      engine: 'webkit',
      webgpu: true,
      shaderF16: false,
      deviceMemory: null,
      webCodecs: false,
      decoderFallback: true,
      wakeLock: false,
    });
    const plan = planFor(info);
    expect(plan.deviceClass).toBe('mobile-webgpu');
    expect(plan.defaultModel).toBe('base');
    expect(plan.offered.map((m) => m.mixName)).toEqual(['webgpuNoShaderF16', 'webgpuNoShaderF16', 'webgpuNoShaderF16']);
  });

  it('Android Chrome: phone from UA-CH, deviceMemory reported, WebCodecs present', async () => {
    const nav: NavigatorLike = {
      userAgent: UA.androidChrome,
      userAgentData: { mobile: true, platform: 'Android', brands: [{ brand: 'Google Chrome', version: '155' }] },
      deviceMemory: 4,
      hardwareConcurrency: 8,
      maxTouchPoints: 5,
      gpu: gpuWith(adapter(['shader-f16'])),
      storage: storage(5e9),
    };
    const info = await probeDevice({ navigator: nav, window: touchWindow(412, 915) });
    expect(info).toMatchObject({
      platform: 'phone',
      browser: 'chrome',
      engine: 'blink',
      webgpu: true,
      shaderF16: true,
      deviceMemory: 4,
      decoderFallback: false,
    });
    expect(planFor(info).deviceClass).toBe('mobile-webgpu');
    const weak = await probeDevice({ navigator: { ...nav, deviceMemory: 2 }, window: touchWindow(412, 915) });
    expect(planFor(weak).deviceClass).toBe('mobile-weak');
    expect(planFor(weak).defaultModel).toBe('tiny');
  });

  it('Firefox desktop: Gecko, no deviceMemory, decoder fallback, memory assumed', async () => {
    const nav: NavigatorLike = { userAgent: UA.firefoxWin, hardwareConcurrency: 12, storage: storage(2e10) };
    const info = await probeDevice({ navigator: nav, window: { ...webCodecsWindow } });
    expect(info).toMatchObject({
      platform: 'desktop',
      browser: 'firefox',
      engine: 'gecko',
      webgpu: false,
      deviceMemory: null,
      webCodecs: true,
      decoderFallback: true,
    });
    const plan = planFor(info);
    expect(plan.deviceClass).toBe('desktop-wasm');
    expect(plan.notes[0]).toContain('4 GB assumed');
  });

  it('an iPad that reports itself as a Mac is a tablet', async () => {
    const info = await probeDevice({
      navigator: { userAgent: UA.ipad, maxTouchPoints: 5 },
      window: touchWindow(820, 1180, false),
    });
    expect(info.platform).toBe('tablet');
    expect(info.engine).toBe('webkit');
  });

  it('an Android tablet (no "Mobile" in the UA, UA-CH mobile false) is a tablet', async () => {
    const info = await probeDevice({
      navigator: { userAgent: UA.androidTablet, userAgentData: { mobile: false, platform: 'Android' } },
    });
    expect(info.platform).toBe('tablet');
  });

  it('a software fallback adapter counts as no WebGPU', async () => {
    const fb = adapter(['shader-f16'], { info: { vendor: 'google', isFallbackAdapter: true } });
    const info = await probeDevice({ navigator: { userAgent: UA.chromeWin, gpu: gpuWith(fb) } });
    expect(info).toMatchObject({ webgpu: false, shaderF16: false });
    expect(info.webgpuError).toContain('fallback');
  });

  it('survives requestAdapter throwing, hanging, and a missing storage API', async () => {
    const threw = await probeDevice({
      navigator: {
        userAgent: UA.chromeWin,
        gpu: {
          requestAdapter: async () => {
            throw new Error('GPU process crashed');
          },
        },
        storage: {
          estimate: async () => {
            throw new Error('denied');
          },
        },
      },
    });
    expect(threw).toMatchObject({ webgpu: false, webgpuError: 'GPU process crashed', storage: { quota: null, usage: null } });
    const hung = await probeDevice({
      navigator: { userAgent: UA.chromeWin, gpu: { requestAdapter: () => new Promise(() => {}) } },
      adapterTimeoutMs: 10,
    });
    expect(hung.webgpu).toBe(false);
  });

  it('reports a bare desktop when there is no navigator at all (prerendering)', async () => {
    const info = await probeDevice({ navigator: {} });
    expect(info).toMatchObject({ platform: 'desktop', webgpu: false, deviceMemory: null, decoderFallback: true });
  });
});

describe('parseUserAgent', () => {
  it('tells the browsers and engines apart', () => {
    expect(parseUserAgent(UA.chromeWin)).toEqual({ browser: 'chrome', engine: 'blink', platform: 'desktop' });
    expect(parseUserAgent(UA.edgeWin)).toEqual({ browser: 'edge', engine: 'blink', platform: 'desktop' });
    expect(parseUserAgent(UA.firefoxWin)).toEqual({ browser: 'firefox', engine: 'gecko', platform: 'desktop' });
    expect(parseUserAgent(UA.safariMac)).toEqual({ browser: 'safari', engine: 'webkit', platform: 'desktop' });
    expect(parseUserAgent(UA.safariIos)).toEqual({ browser: 'safari', engine: 'webkit', platform: 'phone' });
    // Chrome on iOS is WebKit underneath: it needs the decoder fallback like Safari
    expect(parseUserAgent(UA.chromeIos)).toEqual({ browser: 'chrome', engine: 'webkit', platform: 'phone' });
    expect(parseUserAgent(UA.androidChrome)).toEqual({ browser: 'chrome', engine: 'blink', platform: 'phone' });
    expect(parseUserAgent(UA.androidTablet).platform).toBe('tablet');
  });
});
