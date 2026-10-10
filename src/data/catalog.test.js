import { describe, expect, it } from 'vitest';
import {
  crops,
  getCrop,
  searchCrops,
  cropsByCategory,
  CROP_CATEGORIES,
  HOME_ROW_1,
  HOME_ROW_2,
  MARKET_CROP_IDS,
} from '../data/crops.js';
import { translations } from '../i18n/translations.js';

describe('crop catalogue', () => {
  it('has unique stable ids and required structured fields', () => {
    const ids = crops.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of crops) {
      expect(c.id, c.id).toBeTruthy();
      expect(c.image, c.id).toMatch(/^\/images\/crops\/[a-z0-9-]+\.jpg$/);
      expect(c.category, c.id).toMatch(/vegetable|fruit|spice|field/);
      expect(Array.isArray(c.keywords), c.id).toBe(true);
      expect(Array.isArray(c.guidance), c.id).toBe(true);
      expect(c.guidance.length, c.id).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(c.storageTips), c.id).toBe(true);
      expect(c.storageTips.length, c.id).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(c.growthStages), c.id).toBe(true);
      expect(c.growthStages.length, c.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('has one unique image per crop (no duplicates)', () => {
    const images = crops.map((c) => c.image);
    expect(new Set(images).size).toBe(images.length);
  });

  it('covers the named problem crops with photos', () => {
    // The crops the audit named as blank/broken must exist with images.
    for (const id of [
      'ginger',
      'turmeric',
      'sweet-potato',
      'beans', // French beans
      'cluster-beans',
      'peas', // green peas
      'amaranth',
      'drumstick',
    ]) {
      const crop = getCrop(id);
      expect(crop, id).toBeTruthy();
      expect(crop.image, id).toMatch(/\.jpg$/);
    }
    expect(getCrop('beans').image).toBe('/images/crops/french-beans.jpg');
    expect(getCrop('peas').image).toBe('/images/crops/green-peas.jpg');
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
    expect(searchCrops('guar').some((c) => c.id === 'cluster-beans')).toBe(true);
    expect(searchCrops('zzz-no-such-crop')).toHaveLength(0);
    expect(searchCrops('')).toHaveLength(crops.length);
  });

  it('filters by the four categories', () => {
    expect(CROP_CATEGORIES.map((c) => c.id)).toEqual(['vegetable', 'fruit', 'spice', 'field']);
    const veg = cropsByCategory('vegetable');
    expect(veg.every((c) => c.category === 'vegetable')).toBe(true);
    expect(veg.length).toBeGreaterThan(10);
    expect(cropsByCategory('all')).toHaveLength(crops.length);
    // every category holds at least one crop
    for (const cat of CROP_CATEGORIES) {
      expect(cropsByCategory(cat.id).length, cat.id).toBeGreaterThan(0);
    }
  });

  it('references only vocabulary keys that exist in every dictionary', () => {
    const missing = [];
    const check = (key) => {
      for (const lang of Object.keys(translations)) {
        if (!(key in translations[lang])) missing.push(`${lang}:${key}`);
      }
    };
    for (const c of crops) {
      check(`cropName.${c.id}`);
      check(`cropDesc.${c.id}`);
      for (const g of c.guidance) check(`grow.${g}`);
      for (const s of c.storageTips) {
        check(`tip.${s.tip}`);
        check(`tipcat.${s.cat}`);
      }
      for (const s of c.growthStages) {
        check(`stage.${s.stage}`);
        if (s.dur?.kind === 'free') check(`note.${s.dur.key}`);
        else if (s.dur?.unit) check(`unit.${s.dur.unit}`);
      }
      const qf = c.quickFacts ?? {};
      if (qf.growingSeason) {
        for (const s of qf.growingSeason.seasons ?? []) check(`season.${s}`);
        if (qf.growingSeason.note) check(`note.${qf.growingSeason.note}`);
      }
      if (qf.harvestTime) {
        check(`unit.${qf.harvestTime.unit ?? 'days'}`);
        if (qf.harvestTime.after) check(`after.${qf.harvestTime.after}`);
        if (qf.harvestTime.note) check(`note.${qf.harvestTime.note}`);
      }
      if (qf.idealTemperature?.note) check(`note.${qf.idealTemperature.note}`);
      if (qf.storageLife) {
        check(`life.${qf.storageLife.life}`);
        check(`cond.${qf.storageLife.cond}`);
      }
      if (c.duration) {
        check(`unit.${c.duration.unit}`);
        if (c.duration.note) check(`note.${c.duration.note}`);
      }
    }
    expect(missing).toEqual([]);
  });
});