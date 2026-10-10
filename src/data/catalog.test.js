import { describe, expect, it } from 'vitest';
import {
  crops,
  getCrop,
  searchCrops,
  cropsByCategory,
  HOME_ROW_1,
  HOME_ROW_2,
  MARKET_CROP_IDS,
} from '../data/crops.js';
import { translations, LANGUAGES } from '../i18n/translations.js';

describe('crop catalogue', () => {
  it('has unique stable ids and required fields', () => {
    const ids = crops.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of crops) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.nameTe).toBeTruthy();
      expect(c.image).toMatch(/^\/images\/crops\/.*\.jpg$/);
      expect(c.category).toMatch(/vegetable|fruit|field/);
      expect(c.description).toBeTruthy();
      expect(Array.isArray(c.growthStages)).toBe(true);
      expect(c.growthStages.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('covers the specified home gallery rows', () => {
    const all = [...HOME_ROW_1, ...HOME_ROW_2];
    expect(all).toHaveLength(12);
    for (const id of all) expect(getCrop(id)).toBeTruthy();
  });

  it('covers the specified market grid crops', () => {
    expect(MARKET_CROP_IDS).toHaveLength(8);
    for (const id of MARKET_CROP_IDS) expect(getCrop(id)).toBeTruthy();
  });

  it('searches by name and keywords', () => {
    expect(searchCrops('onion').some((c) => c.id === 'onion')).toBe(true);
    expect(searchCrops('mango').some((c) => c.id === 'mango')).toBe(true);
    expect(searchCrops('zzz-no-such-crop')).toHaveLength(0);
    expect(searchCrops('')).toHaveLength(crops.length);
  });

  it('filters by category', () => {
    const veg = cropsByCategory('vegetable');
    expect(veg.length).toBe(12);
    expect(veg.every((c) => c.category === 'vegetable')).toBe(true);
  });
});

describe('translations', () => {
  it('supports en and te with full key parity', () => {
    expect(LANGUAGES.map((l) => l.code)).toEqual(['en', 'te']);
    const enKeys = Object.keys(translations.en).sort();
    const teKeys = Object.keys(translations.te).sort();
    expect(teKeys).toEqual(enKeys);
  });

  it('has no blank values', () => {
    for (const lang of ['en', 'te']) {
      for (const [key, value] of Object.entries(translations[lang])) {
        expect(typeof value, `${lang}:${key}`).toBe('string');
        expect(value.length, `${lang}:${key}`).toBeGreaterThan(0);
      }
    }
  });
});
