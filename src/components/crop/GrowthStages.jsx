import React from 'react';
import { ArrowRight, Sprout } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { formatStageDuration } from '../../i18n/format.js';

/**
 * Horizontal growth-stage timeline. Stage names and durations come from the
 * shared stage.* / unit.* / note.* vocabulary so every language renders the
 * full timeline (structured durations — never baked English strings).
 * Stacks vertically on small screens.
 */
export default function GrowthStages({ crop }) {
  const { t, lang, locale } = useLanguage();
  const stages = crop.growthStages ?? [];

  return (
    <section className="card card-pad" aria-label={t('crop.growthStages')}>
      <h3>{t('crop.growthStages')}</h3>
      <p className="small text-muted">{t('crop.growthStages.note')}</p>
      <div className="stages">
        {stages.map((s, i) => (
          <React.Fragment key={s.stage}>
            <div className="stage">
              <div className="stage-icon">
                <Sprout size={22} aria-hidden />
              </div>
              <h4>{t(`stage.${s.stage}`)}</h4>
              <p className="stage-duration">{formatStageDuration(s.dur, lang, locale)}</p>
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