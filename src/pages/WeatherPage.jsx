import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  MapPin,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import { TemperatureChart, RainfallChart } from '../components/weather/WeatherChart.jsx';
import SmartImage from '../components/shared/SmartImage.jsx';
import { SourceChip, LoadingState, ErrorState, EmptyState, StatusBadge } from '../components/shared/States.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import useAsync from '../hooks/useAsync.js';
import {
  getCurrentWeather,
  getForecast,
  getWeatherAlerts,
  getWeatherInsights,
  getCropWeatherImpact,
} from '../api/services.js';
import { getCrop, HOME_ROW_1 } from '../data/crops.js';

const DEMO_LOCATIONS = ['Demo Farm, Guntur District', 'Demo Farm, Kurnool District'];

/** Pick a weather icon that matches the condition label. */
function ConditionIcon({ condition, size = 28, color = 'var(--blue)' }) {
  const c = (condition || '').toLowerCase();
  if (c.includes('thunder')) return <CloudLightning size={size} color={color} aria-hidden />;
  if (c.includes('rain') || c.includes('shower')) return <CloudRain size={size} color={color} aria-hidden />;
  if (c.includes('sunny') || c.includes('clear')) return <Sun size={size} color={color} aria-hidden />;
  return <CloudSun size={size} color={color} aria-hidden />;
}

export default function WeatherPage() {
  const { t, formatDate, formatNumber, cropName } = useLanguage();
  const [locationIndex, setLocationIndex] = useState(0);

  const current = useAsync(() => getCurrentWeather(), []);
  const forecast = useAsync(() => getForecast(), []);
  const alerts = useAsync(() => getWeatherAlerts(), []);
  const insights = useAsync(() => getWeatherInsights(), []);
  const impact = useAsync(() => getCropWeatherImpact(HOME_ROW_1.slice(0, 4)), []);

  const forecastDays = useMemo(() => {
    if (!forecast.data?.days) return [];
    return forecast.data.days.map((d) => ({
      ...d,
      dayLabel: formatDate(d.date, { weekday: 'short' }),
      dateLabel: formatDate(d.date, { day: 'numeric', month: 'short' }),
    }));
  }, [forecast.data, formatDate]);

  const location =
    current.data?.location ?? DEMO_LOCATIONS[locationIndex] ?? '—';

  return (
    <PageContainer>
      <PageHeading
        title={t('weather.title')}
        subtitle={t('weather.subtitle')}
        actions={
          <>
            <span className="small text-muted" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <MapPin size={15} aria-hidden /> {location}
              {current.data?.observedAt && (
                <>
                  {' · '}
                  {t('weather.reported')}: {formatDate(current.data.observedAt, { dateStyle: 'medium', timeStyle: 'short' })}
                </>
              )}
            </span>
            <button
              type="button"
              className="btn btn-white btn-sm"
              onClick={() => {
                setLocationIndex((i) => (i + 1) % DEMO_LOCATIONS.length);
                current.reload();
              }}
            >
              <RefreshCw size={15} aria-hidden /> {t('weather.changeLocation')}
            </button>
          </>
        }
      />

      {/* Current conditions */}
      <div className="card weather-current">
        {current.loading ? (
          <LoadingState />
        ) : current.error ? (
          <ErrorState error={current.error} onRetry={current.reload} />
        ) : current.data ? (
          <>
            <div>
              <div className="row-between" style={{ marginBottom: 6 }}>
                <h2 style={{ marginBottom: 0 }}>{t('weather.current')}</h2>
                <SourceChip source={current.source} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                <CloudSun size={58} aria-hidden />
                <div>
                  <div className="weather-temp">
                    {formatNumber(current.data.temperatureC)}
                    {t('weather.unit.celsius')}
                  </div>
                  <div className="weather-desc">{t(current.data.condition)}</div>
                </div>
              </div>
            </div>
            <div className="weather-metrics">
              <div className="weather-metric">
                <div className="m-label">
                  <Droplets size={14} aria-hidden /> {t('weather.humidity')}
                </div>
                <div className="m-value">
                  {formatNumber(current.data.humidityPercent)}
                  {t('weather.unit.percent')}
                </div>
              </div>
              <div className="weather-metric">
                <div className="m-label">
                  <CloudRain size={14} aria-hidden /> {t('weather.rainChance')}
                </div>
                <div className="m-value">
                  {formatNumber(current.data.rainChancePercent)}
                  {t('weather.unit.percent')}
                </div>
              </div>
              <div className="weather-metric">
                <div className="m-label">
                  <Wind size={14} aria-hidden /> {t('weather.wind')}
                </div>
                <div className="m-value">
                  {formatNumber(current.data.windKph)} {t('weather.unit.kph')}
                </div>
              </div>
              <div className="weather-metric">
                <div className="m-label">
                  <Thermometer size={14} aria-hidden /> {t('weather.condition')}
                </div>
                <div className="m-value" style={{ fontSize: '0.95rem' }}>
                  {t(current.data.condition)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Forecast + crop impact */}
      <div className="weather-split">
        <div>
          <div className="section-title-row" style={{ marginTop: 18 }}>
            <h2>{t('weather.forecast')}</h2>
            {forecast.data && <SourceChip source={forecast.source} />}
          </div>
          {forecast.loading ? (
            <LoadingState />
          ) : forecast.error ? (
            <ErrorState error={forecast.error} onRetry={forecast.reload} />
          ) : forecastDays.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="forecast-row">
              {forecastDays.map((d) => (
                <div key={d.date} className="card forecast-card">
                  <div className="day">{d.dayLabel}</div>
                  <div className="date">{d.dateLabel}</div>
                  <ConditionIcon condition={d.condition} />
                  <div className="f-temp">
                    {d.tempMaxC}
                    {t('weather.unit.celsius')} / {d.tempMinC}
                    {t('weather.unit.celsius')}
                  </div>
                  <div className="f-cond">{t(d.condition)}</div>
                  <div className="f-rain">
                    <CloudRain size={13} aria-hidden /> {d.rainMm} {t('weather.unit.mm')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="section-title-row" style={{ marginTop: 18 }}>
            <h2>{t('weather.impact.title')}</h2>
          </div>
          <div className="card card-pad">
            <p className="small text-muted">{t('weather.impact.subtitle')}</p>
            {impact.loading ? (
              <LoadingState />
            ) : impact.error ? (
              <ErrorState error={impact.error} onRetry={impact.reload} />
            ) : (
              <>
                {(impact.data?.items ?? []).map((item) => {
                  const crop = getCrop(item.cropId);
                  if (!crop) return null;
                  return (
                    <div className="impact-row" key={item.cropId}>
                      <SmartImage src={crop.image} alt={cropName(crop)} />
                      <div className="impact-main">
                        <strong>{cropName(crop)}</strong>
                        <div className="impact-note">{t(item.note)}</div>
                      </div>
                      <StatusBadge tone={item.category === 'favourable' ? 'green' : 'warning'}>
                        {item.category === 'favourable' ? t('demo.favourable') : t('demo.watch')}
                      </StatusBadge>
                    </div>
                  );
                })}
                <div style={{ marginTop: 10 }}>
                  <SourceChip source={impact.source} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="section-title-row">
        <h2>{t('weather.charts.title')}</h2>
        {forecast.data && <SourceChip source={forecast.source} />}
      </div>
      {forecast.loading ? (
        <LoadingState />
      ) : forecast.error ? null : forecastDays.length === 0 ? (
        <div className="card">
          <EmptyState />
        </div>
      ) : (
        <div className="grid-2">
          <div className="card chart-card">
            <h3>
              <Thermometer size={18} color="var(--blue)" aria-hidden /> {t('weather.chart.temp')}
            </h3>
            <div className="chart-wrap">
              <TemperatureChart days={forecastDays} unitLabel={t('weather.unit.celsius')} />
            </div>
          </div>
          <div className="card chart-card">
            <h3>
              <CloudRain size={18} color="var(--green)" aria-hidden /> {t('weather.chart.rain')}
            </h3>
            <div className="chart-wrap">
              <RainfallChart days={forecastDays} unitLabel={t('weather.unit.mm')} />
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div className="section-title-row">
        <h2>{t('weather.alerts.title')}</h2>
        {alerts.data && <SourceChip source={alerts.source} />}
      </div>
      <div className="card card-pad">
        {alerts.loading ? (
          <LoadingState />
        ) : alerts.error ? (
          <ErrorState error={alerts.error} onRetry={alerts.reload} />
        ) : (alerts.data?.alerts ?? []).length === 0 ? (
          <EmptyState title={t('weather.alerts.none')} body="" />
        ) : (
          alerts.data.alerts.map((a) => (
            <div key={a.id} className={`alert-item ${a.severity}`} role="alert">
              <AlertTriangle size={20} aria-hidden />
              <div>
                <strong>
                  {t(a.title)} {a.severity === 'warning' && <span aria-hidden>⚠</span>}
                </strong>
                <p>{t(a.body)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI insights */}
      <div className="section-title-row">
        <h2>
          <Bot size={20} style={{ verticalAlign: -3 }} aria-hidden /> {t('weather.aiInsights.title')}
        </h2>
      </div>
      <div className="card card-pad">
        <p className="small text-muted">{t('weather.aiInsights.subtitle')}</p>
        {insights.loading ? (
          <LoadingState />
        ) : insights.error ? (
          <ErrorState error={insights.error} onRetry={insights.reload} />
        ) : insights.data ? (
          <>
            <p>
              <strong>{t('ai.summary')}:</strong> {t(insights.data.summary)}
            </p>
            <p className="small">
              <strong>{t('ai.observations')}:</strong> {t(insights.data.supportingData)}
            </p>
            <p className="small">
              <strong>{t('ai.uncertainty')}:</strong> {t(insights.data.uncertainty)}
            </p>
            <p className="small">
              <strong>{t('ai.actions')}:</strong> {t(insights.data.nextSteps)}
            </p>
            <SourceChip source={insights.source} />
            <p className="small text-muted" style={{ marginTop: 8, marginBottom: 0, display: 'flex', gap: 6 }}>
              <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} aria-hidden />
              {insights.source === 'demo' ? t('ai.demoAnswer.body') : t('weather.aiInsights.subtitle')}
            </p>
          </>
        ) : (
          <p className="small text-muted">{t('weather.ai.unavailable')}</p>
        )}
      </div>
    </PageContainer>
  );
}