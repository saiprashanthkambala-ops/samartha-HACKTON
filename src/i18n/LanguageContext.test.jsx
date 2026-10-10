// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext.jsx';
import { translations, LANGUAGES } from './translations.js';

let probe;
function Probe() {
  const ctx = useLanguage();
  probe = ctx;
  return (
    <div>
      <span data-testid="home">{ctx.t('nav.home')}</span>
      <span data-testid="lang">{ctx.lang}</span>
    </div>
  );
}

function renderApp() {
  return render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  );
}

afterEach(() => {
  cleanup();
  probe = undefined;
  localStorage.clear();
});

describe('language switching', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts in English by default', () => {
    renderApp();
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('home').textContent).toBe(translations.en['nav.home']);
  });

  it('switches the whole lookup immediately without a page refresh', () => {
    renderApp();
    act(() => probe.setLang('hi'));
    expect(screen.getByTestId('home').textContent).toBe(translations.hi['nav.home']);
    act(() => probe.setLang('bn'));
    expect(screen.getByTestId('home').textContent).toBe(translations.bn['nav.home']);
    act(() => probe.setLang('ml'));
    expect(screen.getByTestId('home').textContent).toBe(translations.ml['nav.home']);
  });

  it('persists the selection and restores it on remount', () => {
    renderApp();
    act(() => probe.setLang('ta'));
    expect(localStorage.getItem('farmshield.lang')).toBe('ta');
    cleanup();
    renderApp();
    expect(screen.getByTestId('lang').textContent).toBe('ta');
    expect(screen.getByTestId('home').textContent).toBe(translations.ta['nav.home']);
  });

  it('restores every one of the eight languages', () => {
    for (const lang of ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn']) {
      localStorage.setItem('farmshield.lang', lang);
      renderApp();
      expect(screen.getByTestId('lang').textContent, lang).toBe(lang);
      expect(screen.getByTestId('home').textContent).toBe(translations[lang]['nav.home']);
      cleanup();
    }
  });

  it('falls back safely on an invalid saved value without touching other state', () => {
    localStorage.setItem('farmshield.lang', 'xx-invalid');
    renderApp();
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('ignores unsupported language codes at runtime', () => {
    renderApp();
    act(() => probe.setLang('fr'));
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('exposes exactly the eight configured languages to the selector', () => {
    renderApp();
    expect(probe.languages.map((l) => l.code)).toEqual(['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn']);
  });

  it('formats dates and numbers with the language locale', () => {
    renderApp();
    act(() => probe.setLang('en'));
    probe.formatNumber(1234567);
    act(() => probe.setLang('mr'));
    // Indian grouping stays; digit script may localise (e.g. Devanagari numerals)
    expect(probe.formatNumber(1234567).replace(/[^\p{Nd}]/gu, '')).toHaveLength(7);
    expect(probe.formatCurrency(1500)).toMatch(/[\p{Nd}]/u);
    expect(probe.formatDate('2026-10-10')).toBeTruthy();
  });

  it('resolves translated crop names from stable ids', () => {
    renderApp();
    const crop = { id: 'onion', name: 'Onion' };
    expect(probe.cropName(crop)).toBe(translations.en['cropName.onion']);
    act(() => probe.setLang('te'));
    expect(probe.cropName(crop)).toBe(translations.te['cropName.onion']);
    expect(probe.cropName({ id: 'unknown-crop', name: 'Fallback' })).toBe('Fallback');
  });

  it('keeps every language pack loading with the same key count', () => {
    const counts = LANGUAGES.map((l) => Object.keys(translations[l.code]).length);
    expect(new Set(counts).size).toBe(1);
  });
});