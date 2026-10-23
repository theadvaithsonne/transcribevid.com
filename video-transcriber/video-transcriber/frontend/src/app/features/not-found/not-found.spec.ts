import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundPage } from './not-found';

describe('NotFoundPage', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(NotFoundPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('says the page was not found, in one h1 and one sentence', () => {
    const el = render();
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')!.textContent!.trim()).toBe('Page not found');
    expect(el.querySelector('.lede')!.textContent!.trim()).toBe('The page you are looking for does not exist or has moved.');
  });

  it('has exactly one way on: the main button to the home page', () => {
    const el = render();
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.length).toBe(1);
    expect(links[0].classList.contains('primary')).toBe(true);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[0].textContent!.trim()).toBe('Go to the home page');
  });
});
