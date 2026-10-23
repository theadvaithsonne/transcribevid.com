import { TestBed } from '@angular/core/testing';
import { IS_BROWSER } from './platform';
import { THEME_COLOR, ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    delete document.documentElement.dataset['theme'];
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  const make = (browser = true) => {
    TestBed.configureTestingModule({ providers: [{ provide: IS_BROWSER, useValue: browser }] });
    const theme = TestBed.inject(ThemeService);
    TestBed.tick(); // the effect that writes the choice to the page
    return theme;
  };

  it('starts light, the default', () => {
    expect(make().theme()).toBe('light');
  });

  it('puts the theme on <html> (data-theme) for the stylesheet', () => {
    make();
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it("colours the phone's browser bar like the page (theme-color), and follows a switch", () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#123456';
    document.head.appendChild(meta);
    try {
      const theme = make();
      expect(meta.content).toBe(THEME_COLOR.light);
      theme.toggle();
      TestBed.tick();
      expect(meta.content).toBe(THEME_COLOR.dark);
    } finally {
      meta.remove();
    }
  });

  it('toggles between light and dark, updating <html> each time', () => {
    const theme = make();
    theme.toggle();
    TestBed.tick();
    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    theme.toggle();
    TestBed.tick();
    expect(theme.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('remembers the choice in this browser (local storage) and restores it next time', () => {
    const first = make();
    first.toggle();
    TestBed.tick();
    expect(localStorage.getItem('vt-theme')).toBe('dark');
    TestBed.resetTestingModule();
    expect(make().theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('ignores a saved value that is neither light nor dark', () => {
    localStorage.setItem('vt-theme', 'purple');
    expect(make().theme()).toBe('light');
  });

  it('works when storage is blocked (private mode): reading and writing fail quietly', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const theme = make();
    expect(theme.theme()).toBe('light');
    expect(() => {
      theme.toggle();
      TestBed.tick();
    }).not.toThrow();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('while a page is prerendered the server does not set a theme or touch storage (light is the stylesheet default)', () => {
    const set = vi.spyOn(Storage.prototype, 'setItem');
    make(false);
    expect(document.documentElement.dataset['theme']).toBeUndefined();
    expect(set).not.toHaveBeenCalled();
  });
});
