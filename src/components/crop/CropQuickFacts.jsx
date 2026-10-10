import { Info, ListChecks } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { formatQuickFact } from '../../i18n/format.js';

function FactRow({ label, value }) {
  const { t } = useLanguage();
  return (
    <div className="fact-row">
      <span className="fact-label">{label}</span>
      {value == null || value === '' ? (
        <span className="fact-value na">{t('common.notAvailable')}</span>
      ) : (
        <span className="fact-value">{value}</span>
      )}
    </div>
  );
}

export default function CropQuickFacts({ crop }) {
  const { t, lang, locale } = useLanguage();
  const f = crop.quickFacts ?? {};
  const fmt = (fact) => (fact ? formatQuickFact(fact, lang, locale) : null);
  return (
    <div className="card card-pad quick-facts">
      <h3>
        <ListChecks size={19} aria-hidden /> {t('crop.quickFacts')}
      </h3>
      <FactRow label={t('crop.growingSeason')} value={fmt(f.growingSeason)} />
      <FactRow label={t('crop.harvestTime')} value={fmt(f.harvestTime)} />
      <FactRow label={t('crop.idealTemperature')} value={fmt(f.idealTemperature)} />
      <FactRow label={t('crop.idealHumidity')} value={fmt(f.idealHumidity)} />
      <FactRow label={t('crop.storageLife')} value={fmt(f.storageLife)} />
      <p className="small text-muted" style={{ marginTop: 10, marginBottom: 0, display: 'flex', gap: 6 }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
        {t('crop.sourceNote')}
      </p>
    </div>
  );
}