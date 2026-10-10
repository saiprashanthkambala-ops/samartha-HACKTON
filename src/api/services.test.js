import { describe, expect, it, beforeAll, beforeEach } from 'vitest';
import {
  demoCurrentWeather,
  demoForecast,
  demoMarketPrices,
  demoDiaryEntries,
  demoAIAnswer,
  isoDate,
} from '../data/demoData.js';
import { createDiaryEntry, getDiaryEntries, getMarketPrices } from '../api/services.js';

// Minimal in-memory localStorage for the node test environment.
beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
  }
});

describe('demo data honesty', () => {
  it('marks every demo payload as demo', () => {
    expect(demoCurrentWeather().isDemo).toBe(true);
    expect(demoForecast().isDemo).toBe(true);
    expect(demoMarketPrices().isDemo).toBe(true);
    expect(demoAIAnswer().isDemo).toBe(true);
    for (const e of demoDiaryEntries()) expect(e.isDemo).toBe(true);
  });

  it('uses dates relative to today (never stale hard-coded dates)', () => {
    const today = isoDate(new Date());
    const reported = demoMarketPrices().reportedAt;
    expect(reported).toBe(today);
  });

  it('keeps missing values null, not zero', () => {
    expect(demoCurrentWeather().humidityPercent).not.toBeNull();
    const e = demoDiaryEntries().find((x) => x.expense == null);
    expect(e).toBeTruthy();
  });
});

describe('services (demo mode)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('labels market data as demo source', async () => {
    const res = await getMarketPrices();
    expect(res.source).toBe('demo');
    expect(res.data.entries.length).toBeGreaterThan(0);
  });

  it('creates diary entries and lists them', async () => {
    const before = await getDiaryEntries();
    await createDiaryEntry({
      date: '2026-10-10',
      activityType: 'note',
      cropId: 'onion',
      description: 'test entry',
    });
    const after = await getDiaryEntries();
    expect(after.data.length).toBe(before.data.length + 1);
    expect(after.data[0].description).toBe('test entry');
    expect(after.source).toBe('demo');
  });
});
