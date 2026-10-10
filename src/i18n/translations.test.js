import { describe, expect, it } from 'vitest';
import {
  translations,
  LANGUAGES,
  translate,
  interpolate,
  isSupportedLanguage,
  cropNameKey,
  cropDescKey,
} from './translations.js';
import { formatQuickFact, formatDuration, formatStageDuration } from './format.js';
import { crops } from '../data/crops.js';

const LANG_CODES = ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn'];

describe('eight-language dictionaries', () => {
  it('configures exactly the eight required languages', () => {
    expect(LANGUAGES.map((l) => l.code)).toEqual(LANG_CODES);
    for (const code of LANG_CODES) {
      expect(isSupportedLanguage(code), code).toBe(true);
      expect(translations[code], code).toBeTruthy();
    }
    expect(isSupportedLanguage('xx')).toBe(false);
    expect(isSupportedLanguage('fr')).toBe(false);
  });

  it('has exact key parity across all eight languages', () => {
    const enKeys = Object.keys(translations.en).sort();
    expect(enKeys.length).toBeGreaterThan(500);
    for (const code of LANG_CODES) {
      const keys = Object.keys(translations[code]).sort();
      expect(keys, code).toEqual(enKeys);
    }
  });

  it('has no blank values', () => {
    for (const code of LANG_CODES) {
      for (const [key, value] of Object.entries(translations[code])) {
        expect(typeof value, `${code}:${key}`).toBe('string');
        expect(value.trim().length, `${code}:${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps interpolation placeholders identical across languages', () => {
    const ph = (s) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(',');
    for (const key of Object.keys(translations.en)) {
      const want = ph(translations.en[key]);
      for (const code of LANG_CODES.slice(1)) {
        expect(ph(translations[code][key]), `${code}:${key}`).toBe(want);
      }
    }
  });

  it('translates crop names and descriptions for every catalogue entry', () => {
    for (const c of crops) {
      for (const code of LANG_CODES) {
        expect(translations[code][cropNameKey(c.id)], `${code}:${c.id}`).toBeTruthy();
        expect(translations[code][cropDescKey(c.id)], `${code}:${c.id}`).toBeTruthy();
      }
    }
  });

  it('covers the full UI surface families in every language', () => {
    const families = [
      'app.', 'nav.', 'home.', 'crops.', 'crop.', 'category.', 'common.',
      'search.', 'form.', 'validation.', 'dashboard.', 'weather.', 'market.',
      'ai.', 'diary.', 'farmer.', 'carousel.', 'aria.', 'demo.', 'fact.',
      'season.', 'after.', 'unit.', 'life.', 'cond.', 'note.', 'stage.',
      'tip.', 'tipcat.', 'grow.', 'login.', 'error.', 'tooltip.',
    ];
    for (const code of LANG_CODES) {
      const keys = Object.keys(translations[code]);
      for (const fam of families) {
        // every required family must exist unless it has no strings at all in en
        const enHas = Object.keys(translations.en).some((k) => k.startsWith(fam));
        if (!enHas) continue;
        expect(keys.some((k) => k.startsWith(fam)), `${code} missing family ${fam}`).toBe(true);
      }
    }
  });
});

describe('translate/interpolate', () => {
  it('interpolates named params', () => {
    expect(interpolate('{min}–{max} {unit}', { min: 1, max: 2, unit: 'weeks' })).toBe('1–2 weeks');
    expect(interpolate('no params', { a: 1 })).toBe('no params');
  });

  it('falls back to English, then to the key itself', () => {
    expect(translate('te', 'nav.home')).toBe(translations.te['nav.home']);
    expect(translate('hi', 'nav.home')).toBe(translations.hi['nav.home']);
    expect(translate('hi', 'definitely.missing.key')).toBe('definitely.missing.key');
  });

  it('interpolates through translate() in every language', () => {
    for (const code of LANG_CODES) {
      const out = translate(code, 'carousel.slideOf', { index: 2, total: 8 });
      expect(out).toContain('2');
      expect(out).toContain('8');
    }
  });
});

describe('structured data formatters', () => {
  it('renders quick facts in all languages without artefacts', () => {
    for (const c of crops) {
      for (const code of LANG_CODES) {
        const locale = LANGUAGES.find((l) => l.code === code).locale;
        const qf = c.quickFacts ?? {};
        for (const fact of [qf.growingSeason, qf.harvestTime, qf.idealTemperature, qf.storageLife]) {
          if (!fact) continue;
          const out = formatQuickFact(fact, code, locale);
          expect(out, `${code}:${c.id}`).toBeTruthy();
          expect(out, `${code}:${c.id}`).not.toContain('undefined');
          expect(out, `${code}:${c.id}`).not.toContain('{' );
        }
        if (c.duration) {
          const out = formatDuration(c.duration, code, locale);
          expect(out, `${code}:${c.id}`).not.toContain('undefined');
        }
        for (const s of c.growthStages) {
          const out = formatStageDuration(s.dur, code, locale);
          expect(out, `${code}:${c.id}`).not.toContain('undefined');
        }
      }
    }
  });

  it('renders "Not available" for missing facts', () => {
    expect(formatQuickFact(null, 'en', 'en-IN')).toBe(translations.en['common.notAvailable']);
    expect(formatQuickFact({ kind: 'unknown' }, 'hi', 'hi-IN')).toBe(
      translations.hi['common.notAvailable'],
    );
  });
});