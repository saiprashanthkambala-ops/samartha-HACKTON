import { Bot, CheckCircle2, CloudSun, Leaf, MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { SourceChip, LoadingState, ErrorState } from '../shared/States.jsx';

/**
 * Three analysis cards: current weather / suitability status / AI recommendation.
 * Weather values come from the configured weather service (demo-labelled when
 * no backend is connected). Suitability never claims "Suitable" without a
 * labelled assessment — in demo mode it is explicitly illustrative.
 */
export default function AnalysisCards({ weather, suitability, aiRec }) {
  const { t, formatNumber } = useLanguage();

  return (
    <div className="analysis-grid">
      {/* Card 1 — Current weather */}
      <div className="card analysis-card">
        <div className="card-head">
          <CloudSun size={20} color="var(--blue)" aria-hidden />
          <h3>{t('crop.analysis.weatherTitle')}</h3>
        </div>
        {weather.loading ? (
          <LoadingState />
        ) : weather.error ? (
          <ErrorState error={weather.error} onRetry={weather.reload} />
        ) : weather.data ? (
          <>
            <div className="kv-inline">
              <MapPin size={15} aria-hidden /> <strong>{weather.data.location}</strong>
            </div>
            <div className="kv-inline">
              <Thermometer size={15} aria-hidden /> {t('crop.analysis.temperature')}:{' '}
              <strong>
                {formatNumber(weather.data.temperatureC)} {t('weather.unit.celsius')}
              </strong>
            </div>
            <div className="kv-inline">
              <Droplets size={15} aria-hidden /> {t('crop.analysis.humidity')}:{' '}
              <strong>
                {formatNumber(weather.data.humidityPercent)}
                {t('weather.unit.percent')}
              </strong>
            </div>
            <div className="kv-inline">
              <CloudSun size={15} aria-hidden /> {t('crop.analysis.rainChance')}:{' '}
              <strong>
                {formatNumber(weather.data.rainChancePercent)}
                {t('weather.unit.percent')}
              </strong>
            </div>
            <div className="kv-inline">
              <Wind size={15} aria-hidden /> {t('crop.analysis.wind')}:{' '}
              <strong>
                {formatNumber(weather.data.windKph)} {t('weather.unit.kph')}
              </strong>
            </div>
            <SourceChip source={weather.source} />
          </>
        ) : null}
      </div>

      {/* Card 2 — Suitability status */}
      <div className="card analysis-card">
        <div className="card-head">
          <Leaf size={20} color="var(--green)" aria-hidden />
          <h3>{t('crop.analysis.suitabilityTitle')}</h3>
        </div>
        {suitability.loading ? (
          <LoadingState />
        ) : suitability.error ? (
          <ErrorState error={suitability.error} onRetry={suitability.reload} />
        ) : suitability.data ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={22} className="suitability-ok" aria-hidden />
              <strong className="suitability-ok" style={{ fontSize: '1.05rem' }}>
                {suitability.data.status === 'suitable' ? 'Suitable (demo)' : t('crop.weatherTab.pending')}
              </strong>
              <SourceChip source={suitability.source} />
            </div>
            {typeof suitability.data.scorePercent === 'number' && (
              <div className="progress-track" aria-hidden style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{ width: `${suitability.data.scorePercent}%` }} />
              </div>
            )}
            <p className="small mb-0">{suitability.data.explanation}</p>
            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 0 }}>
              {t('crop.weatherTab.demoNote')}
            </p>
          </>
        ) : null}
      </div>

      {/* Card 3 — AI recommendation */}
      <div className="card analysis-card ai-rec-card">
        <div className="card-head">
          <Bot size={20} aria-hidden />
          <h3>{t('crop.analysis.aiTitle')}</h3>
        </div>
        {aiRec.loading ? (
          <LoadingState />
        ) : aiRec.error ? (
          <ErrorState error={aiRec.error} onRetry={aiRec.reload} />
        ) : aiRec.data ? (
          <>
            <ul className="rec-list">
              {(aiRec.data.actions ?? []).slice(0, 3).map((a, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} className="check" aria-hidden />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10 }}>
              <SourceChip source={aiRec.source} />
            </div>
            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 0 }}>
              {aiRec.source === 'demo' ? t('ai.demoAnswer.body') : t('ai.providerNote')}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
