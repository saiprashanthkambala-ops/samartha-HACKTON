import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { farmers } from './farmers.js';
import { translations } from '../i18n/translations.js';

const LANG_CODES = ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'bn'];
const PUBLIC = path.resolve(process.cwd(), 'public');

describe('farmer carousel entries', () => {
  it('has exactly eight regional entries in display order', () => {
    expect(farmers.map((f) => f.id)).toEqual([
      'punjab',
      'telangana',
      'andhra-pradesh',
      'karnataka',
      'tamil-nadu',
      'kerala',
      'maharashtra',
      'west-bengal',
    ]);
  });

  it('maps each entry to a distinct local verified image', () => {
    const images = farmers.map((f) => f.image);
    expect(new Set(images).size).toBe(images.length);
    for (const f of farmers) {
      expect(f.image, f.id).toMatch(/^\/images\/farmers\/[a-z0-9-]+\.jpg$/);
      const file = path.join(PUBLIC, f.image);
      expect(fs.existsSync(file), f.image).toBe(true);
      expect(fs.statSync(file).size, f.image).toBeGreaterThan(5000);
    }
  });

  it('has label and honest alt text keys in all eight languages', () => {
    for (const f of farmers) {
      expect(f.regionKey, f.id).toBeTruthy();
      for (const code of LANG_CODES) {
        const label = translations[code][`farmer.${f.regionKey}.label`];
        const alt = translations[code][`farmer.${f.regionKey}.alt`];
        expect(label, `${code}:${f.id}`).toBeTruthy();
        expect(alt, `${code}:${f.id}`).toBeTruthy();
      }
    }
  });
});