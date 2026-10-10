/**
 * Locale-aware formatters for structured, language-neutral crop data.
 * Quick facts and growth-stage durations are stored as numbers/codes in
 * src/data/crops.js and rendered through translated templates + vocabulary
 * (fact.*, season.*, after.*, unit.*, life.*, cond.*, note.*).
 */
import { translate } from './translations.js';

function num(value, locale) {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format a quick-fact entry from crops.js.
 * Supported kinds: season, daysAfter/monthsAfter (aka 'after'), tempRange,
 * storageLife. Unknown/absent values render as translated "Not available".
 */
export function formatQuickFact(fact, lang, locale) {
  const t = (key, params) => translate(lang, key, params);
  const na = t('common.notAvailable');
  if (!fact || typeof fact !== 'object') return na;

  if (fact.kind === 'season') {
    const list = (fact.seasons || []).map((s) => t(`season.${s}`)).join(' · ');
    const months = fact.months
      ? `${monthName(fact.months[0], locale)}–${monthName(fact.months[1], locale)}`
      : '';
    const note = fact.note ? t(`note.${fact.note}`) : '';
    if (months && note) return t('fact.seasonInfo', { list, info: `${months}; ${note}` });
    if (months) return t('fact.seasonInfo', { list, info: months });
    if (note) return t('fact.seasonInfo', { list, info: note });
    return t('fact.season', { list });
  }

  if (fact.kind === 'after' || fact.kind === 'daysAfter' || fact.kind === 'monthsAfter') {
    const unit = fact.unit || (fact.kind === 'monthsAfter' ? 'months' : 'days');
    // Entries either anchor to a growth event ("after sowing") or carry a
    // free-text note ("from bloom") — never both awkwardly combined.
    const base = fact.after
      ? t('fact.after', {
          min: num(fact.min, locale),
          max: num(fact.max, locale),
          unit: t(`unit.${unit}`),
          after: t(`after.${fact.after}`),
        })
      : t('fact.range', {
          min: num(fact.min, locale),
          max: num(fact.max, locale),
          unit: t(`unit.${unit}`),
        });
    return fact.note ? t('fact.inParens', { value: base, note: t(`note.${fact.note}`) }) : base;
  }

  if (fact.kind === 'tempRange') {
    const base = t('fact.temp', { min: num(fact.min, locale), max: num(fact.max, locale) });
    return fact.note ? t('fact.inParens', { value: base, note: t(`note.${fact.note}`) }) : base;
  }

  if (fact.kind === 'storageLife') {
    const base = t('fact.storage', { life: t(`life.${fact.life}`), cond: t(`cond.${fact.cond}`) });
    return fact.varies ? `${base} (${t('fact.varies')})` : base;
  }

  return na;
}

/**
 * Format an overall crop-duration entry: { kind: 'rangeUnit', min, max, unit, note? }.
 */
export function formatDuration(duration, lang, locale) {
  const t = (key, params) => translate(lang, key, params);
  if (!duration || typeof duration !== 'object') return t('common.notAvailable');
  const base = t('fact.range', {
    min: num(duration.min, locale),
    max: num(duration.max, locale),
    unit: t(`unit.${duration.unit}`),
  });
  return duration.note ? t('fact.inParens', { value: base, note: t(`note.${duration.note}`) }) : base;
}

/**
 * Format a growth-stage duration: numeric { min, max, unit } or
 * free-text { kind: 'free', key } resolved through note.* vocabulary.
 */
export function formatStageDuration(dur, lang, locale) {
  const t = (key, params) => translate(lang, key, params);
  if (!dur) return t('common.notAvailable');
  if (dur.kind === 'free') return t(`note.${dur.key}`);
  return t('fact.range', {
    min: num(dur.min, locale),
    max: num(dur.max, locale),
    unit: t(`unit.${dur.unit}`),
  });
}

function monthName(monthIndex, locale) {
  try {
    return new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, monthIndex - 1, 1));
  } catch {
    return String(monthIndex);
  }
}