import { Info, ListChecks } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

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
  const { t } = useLanguage();
  const f = crop.quickFacts ?? {};
  return (
    <div className="card card-pad quick-facts">
      <h3>
        <ListChecks size={19} aria-hidden /> {t('crop.quickFacts')}
      </h3>
      <FactRow label={t('crop.growingSeason')} value={f.growingSeason} />
      <FactRow label={t('crop.harvestTime')} value={f.harvestTime} />
      <FactRow label={t('crop.idealTemperature')} value={f.idealTemperature} />
      <FactRow label={t('crop.idealHumidity')} value={f.idealHumidity} />
      <FactRow label={t('crop.storageLife')} value={f.storageLife} />
      <p className="small text-muted" style={{ marginTop: 10, marginBottom: 0, display: 'flex', gap: 6 }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
        {t('crop.sourceNote')}
      </p>
    </div>
  );
}
