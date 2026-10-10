import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  translations,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  interpolate,
  reportMissingKey,
  cropNameKey,
} from './translations.js';

const STORAGE_KEY = 'farmshield.lang';
const LanguageContext = createContext(null);

function localeFor(code) {
  return LANGUAGES.find((l) => l.code === code)?.locale || 'en-IN';
}

function htmlLangFor(code) {
  return LANGUAGES.find((l) => l.code === code)?.htmlLang || 'en';
}

function detectInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Invalid/legacy saved values fall back safely to the default language.
    if (saved && isSupportedLanguage(saved)) return saved;
  } catch {
    /* storage unavailable — fall through */
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitial);

  useEffect(() => {
    document.documentElement.lang = htmlLangFor(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((code) => {
    if (isSupportedLanguage(code)) setLangState(code);
    else reportMissingKey(code, '(language)');
  }, []);

  /**
   * Translate a key. `vars` supports {name} interpolation.
   * Falls back to English, then to the key itself (never blank UI).
   */
  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
      let text = dict[key];
      if (text === undefined) {
        reportMissingKey(lang, key);
        text = translations[DEFAULT_LANGUAGE][key];
      }
      if (text === undefined) return key;
      return interpolate(text, vars);
    },
    [lang]
  );

  const formatDate = useCallback(
    (value, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => {
      if (!value) return '—';
      let date;
      if (value instanceof Date) {
        date = value;
      } else {
        const s = String(value);
        // Preserve time-of-day for full ISO timestamps; date-only values at midnight.
        date = new Date(s.includes('T') ? s : `${s.slice(0, 10)}T00:00:00`);
      }
      if (Number.isNaN(date.getTime())) return String(value);
      return new Intl.DateTimeFormat(localeFor(lang), opts).format(date);
    },
    [lang]
  );

  const formatCurrency = useCallback(
    (amount) => {
      if (amount == null || Number.isNaN(Number(amount))) return '—';
      return new Intl.NumberFormat(localeFor(lang), {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(Number(amount));
    },
    [lang]
  );

  const formatNumber = useCallback(
    (n) => {
      if (n == null || Number.isNaN(Number(n))) return '—';
      return new Intl.NumberFormat(localeFor(lang)).format(Number(n));
    },
    [lang]
  );

  /** Crop names come from the translated dictionary (cropName.<id>). */
  const cropName = useCallback(
    (crop) => {
      if (!crop) return '';
      return t(cropNameKey(crop.id), undefined) !== cropNameKey(crop.id)
        ? t(cropNameKey(crop.id))
        : crop.name;
    },
    [t]
  );

  const value = useMemo(
    () => ({
      lang,
      locale: localeFor(lang),
      setLang,
      languages: LANGUAGES,
      t,
      formatDate,
      formatCurrency,
      formatNumber,
      cropName,
    }),
    [lang, setLang, t, formatDate, formatCurrency, formatNumber, cropName]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}