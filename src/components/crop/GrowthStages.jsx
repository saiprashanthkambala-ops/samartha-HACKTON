import React from 'react';
import { ArrowRight, Sprout } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

/**
 * Horizontal growth-stage timeline. Stage names/durations come from the crop
 * catalogue (crop-specific — never reused across unrelated crops).
 * Stacks vertically on small screens.
 */
export default function GrowthStages({ crop }) {
  const { t, lang } = useLanguage();
  const stages = crop.growthStages ?? [];

  return (
    <section className="card card-pad" aria-label={t('crop.growthStages')}>
      <h3>{t('crop.growthStages')}</h3>
      <p className="small text-muted">{t('crop.growthStages.note')}</p>
      <div className="stages">
        {stages.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="stage">
              <div className="stage-icon">
                <Sprout size={22} aria-hidden />
              </div>
              <h4>{lang === 'te' ? s.nameTe : s.name}</h4>
              <p className="stage-duration">{s.duration}</p>
            </div>
            {i < stages.length - 1 && (
              <div className="stage-arrow" aria-hidden>
                <ArrowRight size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
