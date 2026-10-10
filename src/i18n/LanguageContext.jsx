import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, LANGUAGES } from './translations.js';

const STORAGE_KEY = 'farmshield.lang';
const LanguageContext = createContext(null);

function detectInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {
    /* storage unavailable — fall through */
  }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitial);
  const localeByLanguage = {
    en: 'en-IN', te: 'te-IN', hi: 'hi-IN', ta: 'ta-IN',
    kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', bn: 'bn-IN',
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((code) => {
    if (translations[code]) setLangState(code);
  }, []);

  /**
   * Translate a key. `vars` supports simple {name} interpolation.
   * Falls back to English, then to the key itself (never blank UI).
   */
  const t = useCallback(
    (key, vars) => {
      let text = translations[lang]?.[key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
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
      return new Intl.DateTimeFormat(localeByLanguage[lang] || 'en-IN', opts).format(date);
    },
    [lang]
  );

  const formatCurrency = useCallback(
    (amount) => {
      if (amount == null || Number.isNaN(Number(amount))) return '—';
      return new Intl.NumberFormat(lang === 'te' ? 'te-IN' : 'en-IN', {
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
      return new Intl.NumberFormat(lang === 'te' ? 'te-IN' : 'en-IN').format(Number(n));
    },
    [lang]
  );

  const cropName = useCallback(
    (crop) => {
      if (!crop) return '';
      return lang === 'te' ? crop.nameTe || crop.name : crop.name;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, languages: LANGUAGES, t, formatDate, formatCurrency, formatNumber, cropName }),
    [lang, setLang, t, formatDate, formatCurrency, formatNumber, cropName]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
