import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function LanguageSelector() {
  const { lang, setLang, languages, t } = useLanguage();
  return (
    <div className="lang-select-wrap">
      <Globe size={16} className="globe" aria-hidden />
      <select
        className="lang-select"
        aria-label={t('lang.select')}
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="lang-chevron" aria-hidden />
    </div>
  );
}
