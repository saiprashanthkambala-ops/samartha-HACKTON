/**
 * FarmShield translation core.
 *
 * Eight complete language dictionaries live in src/i18n/dicts/<code>.js.
 * Every dictionary carries the SAME key set (checked by translations.test.js
 * and scripts/i18n-check.mjs). Lookup is a flat key map:
 *   t('nav.home') -> dict[lang]['nav.home']
 *
 * Crop names/descriptions are keyed by STABLE crop ids (cropName.<id>,
 * cropDesc.<id>) — ids are never translated. Guideline bullets, storage
 * tips, growth-stage names and quick-fact wording come from shared library
 * keys (grow.*, tip.*, stage.*, fact.*, season.*, cond.*, life.*, …) so a
 * language can never miss a crop-specific string. Structured numeric data
 * (dates, ranges, temperatures) is formatted at render time via
 * src/i18n/format.js with locale-aware number/date formatting.
 *
 * Farmer-entered content (diary notes, questions) is never translated here.
 */

import en from './dicts/en.js';
import te from './dicts/te.js';
import hi from './dicts/hi.js';
import ta from './dicts/ta.js';
import kn from './dicts/kn.js';
import ml from './dicts/ml.js';
import mr from './dicts/mr.js';
import bn from './dicts/bn.js';

export const LANGUAGES = [
  { code: 'en', label: 'English', htmlLang: 'en', locale: 'en-IN' },
  { code: 'hi', label: 'हिन्दी', htmlLang: 'hi', locale: 'hi-IN' },
  { code: 'te', label: 'తెలుగు', htmlLang: 'te', locale: 'te-IN' },
  { code: 'ta', label: 'தமிழ்', htmlLang: 'ta', locale: 'ta-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ', htmlLang: 'kn', locale: 'kn-IN' },
  { code: 'ml', label: 'മലയാളം', htmlLang: 'ml', locale: 'ml-IN' },
  { code: 'mr', label: 'मराठी', htmlLang: 'mr', locale: 'mr-IN' },
  { code: 'bn', label: 'বাংলা', htmlLang: 'bn', locale: 'bn-IN' },
];

export const DEFAULT_LANGUAGE = 'en';

export const translations = { en, hi, te, ta, kn, ml, mr, bn };

export function isSupportedLanguage(code) {
  return Object.prototype.hasOwnProperty.call(translations, code);
}

/** Interpolate `{name}` placeholders. Missing params render as the key token. */
export function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}

/**
 * Lookup a key in a language with English fallback. Returns the key itself
 * when it exists in no dictionary (visible signal instead of blank UI).
 */
export function translate(lang, key, params) {
  const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
  const value = dict[key] ?? translations[DEFAULT_LANGUAGE][key];
  if (value === undefined) return key;
  return interpolate(value, params);
}

/** Stable dictionary keys for locale-neutral catalogue entries. */
export const cropNameKey = (cropId) => `cropName.${cropId}`;
export const cropDescKey = (cropId) => `cropDesc.${cropId}`;

/**
 * Dev-time missing-key reporter: warns once per (lang,key). The parity test
 * makes actual gaps impossible in CI, this is the runtime safety net.
 */
const warned = new Set();
export function reportMissingKey(lang, key) {
  const id = `${lang}:${key}`;
  if (warned.has(id)) return;
  warned.add(id);
  if (typeof console !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.warn(`[i18n] missing key "${key}" for language "${lang}"`);
  }
}