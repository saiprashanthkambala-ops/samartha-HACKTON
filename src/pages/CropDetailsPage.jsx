import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  CloudSun,
  Info,
  Send,
  Store,
} from 'lucide-react';
import { PageContainer } from '../components/layout/Page.jsx';
import CropQuickFacts from '../components/crop/CropQuickFacts.jsx';
import GrowthStages from '../components/crop/GrowthStages.jsx';
import AnalysisCards from '../components/crop/AnalysisCards.jsx';
import SmartImage from '../components/shared/SmartImage.jsx';
import { SourceChip, LoadingState, ErrorState, EmptyState, StatusBadge } from '../components/shared/States.jsx';
import { getCrop } from '../data/crops.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import useAsync from '../hooks/useAsync.js';
import {
  askAssistant,
  getCurrentWeather,
  getCropSuitability,
  getMarketPrices,
} from '../api/services.js';

function getCropFallbackSrc(crop) {
  const lock = [...crop.id].reduce((total, character) => total + character.charCodeAt(0), 0);
  const category = crop.category === 'fruit'
    ? 'fruit'
    : crop.category === 'vegetable'
      ? 'vegetable'
      : 'crop,field';
  return `https://loremflickr.com/800/600/${encodeURIComponent(crop.name)},${category}?lock=${lock}`;
}

const TABS = [
  'overview',
  'weather',
  'storage',
  'market',
  'ai',
];

function OverviewPanel({ crop }) {
  const { t, lang } = useLanguage();
  return (
    <div className="card card-pad">
      <h3>{t('crop.overview.title')}</h3>
      <p>{lang === 'te' ? crop.descriptionTe : crop.description}</p>
      <div className="grid-2 mt-16">
        <div>
          <h4>{t('crop.growingSeason')}</h4>
          <p className="small">{crop.quickFacts?.growingSeason || t('common.notAvailable')}</p>
          <h4>{t('crop.duration')}</h4>
          <p className="small">{crop.duration || t('common.notAvailable')}</p>
        </div>
        <div>
          <h4>{t('crop.growingGuidance')}</h4>
          <ul className="tip-list">
            {(crop.growingGuidance ?? []).map((g, i) => (
              <li key={i}>
                <CheckCircle2 size={16} aria-hidden />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="small text-muted" style={{ display: 'flex', gap: 6, marginTop: 12, marginBottom: 0 }}>
        <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} aria-hidden />
        {t('crop.sourceNote')}
      </p>
    </div>
  );
}

function WeatherPanel({ weather, suitability }) {
  const { t, formatNumber, formatDate } = useLanguage();
  return (
    <div className="card card-pad">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CloudSun size={19} aria-hidden /> {t('crop.tab.weather')}
      </h3>
      {weather.loading ? (
        <LoadingState />
      ) : weather.error ? (
        <ErrorState error={weather.error} onRetry={weather.reload} />
      ) : weather.data ? (
        <>
          <div className="grid-2">
            <div>
              <p className="small text-muted mb-0">{t('crop.weatherTab.location')}</p>
              <p>
                <strong>{weather.data.location}</strong>
              </p>
              <p className="small text-muted mb-0">{t('crop.weatherTab.current')}</p>
              <p>
                <strong>
                  {formatNumber(weather.data.temperatureC)} {t('weather.unit.celsius')}
                </strong>{' '}
                · {weather.data.condition} · {t('weather.humidity')}{' '}
                {formatNumber(weather.data.humidityPercent)}
                {t('weather.unit.percent')}
              </p>
              <p className="small text-muted mb-0">{t('weather.reported')}</p>
              <p className="small">{formatDate(weather.data.observedAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              <SourceChip source={weather.source} />
            </div>
            <div>
              <p className="small text-muted mb-0">{t('crop.weatherTab.assessment')}</p>
              {suitability.loading ? (
                <LoadingState />
              ) : suitability.error ? (
                <ErrorState error={suitability.error} onRetry={suitability.reload} />
              ) : suitability.data ? (
                <>
                  <p style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <StatusBadge tone={suitability.data.status === 'suitable' ? 'green' : 'muted'}>
                      {suitability.data.status === 'suitable' ? 'Suitable (demo)' : t('crop.weatherTab.pending')}
                    </StatusBadge>
                    <SourceChip source={suitability.source} />
                  </p>
                  <p className="small">{suitability.data.explanation}</p>
                  <p className="small text-muted mb-0">{t('crop.weatherTab.demoNote')}</p>
                </>
              ) : (
                <p className="small">{t('crop.weatherTab.pending')}</p>
              )}
            </div>
          </div>
          <p className="small text-muted" style={{ marginTop: 12, marginBottom: 0 }}>
            {t('crop.weatherTab.outdoorNote')}
          </p>
        </>
      ) : null}
    </div>
  );
}

function StoragePanel({ crop }) {
  const { t, lang } = useLanguage();
  const catLabel = {
    handling: t('crop.storageTab.handle'),
    ventilation: t('crop.storageTab.ventilation'),
    moisture: t('crop.storageTab.moisture'),
    inspection: t('crop.storageTab.inspection'),
    risks: t('crop.storageTab.risks'),
  };
  const tips = crop.storageTips ?? [];
  const groups = ['handling', 'ventilation', 'moisture', 'inspection', 'risks'];

  return (
    <div className="card card-pad">
      <h3>{t('crop.storageTab.title')}</h3>
      <div className="grid-2">
        {groups.map((g) => {
          const items = tips.filter((x) => x.cat === g);
          if (items.length === 0) return null;
          return (
            <div key={g}>
              <h4>{catLabel[g]}</h4>
              <ul className="tip-list">
                {items.map((item, i) => (
                  <li key={i}>
                    {g === 'risks' ? (
                      <Info size={16} style={{ color: 'var(--warning)' }} aria-hidden />
                    ) : (
                      <CheckCircle2 size={16} aria-hidden />
                    )}
                    <span>{lang === 'te' ? item.textTe : item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <h4 className="mt-16">{t('crop.storageTab.source')}</h4>
      <p className="small text-muted mb-0">{t('crop.sourceNote')}</p>
    </div>
  );
}

function MarketPanel({ crop, market }) {
  const { t, formatCurrency, formatDate, cropName } = useLanguage();
  const entry = useMemo(() => {
    if (!market.data) return null;
    return market.data.entries?.find((e) => e.cropId === crop.id) ?? null;
  }, [market.data, crop.id]);

  return (
    <div className="card card-pad">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Store size={19} aria-hidden /> {t('crop.marketTab.title')}
      </h3>
      {market.loading ? (
        <LoadingState />
      ) : market.error ? (
        <ErrorState error={market.error} onRetry={market.reload} />
      ) : !entry ? (
        <EmptyState title={t('market.missing')} body={t('market.selectPrompt')} />
      ) : (
        <div className="grid-2">
          <SmartImage
            src={crop.image}
            fallbackSrc={getCropFallbackSrc(crop)}
            alt={cropName(crop)}
            style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 14 }}
          />
          <div>
            <p className="small text-muted mb-0">{t('crop.marketTab.market')}</p>
            <p>
              <strong>{market.data.market}</strong>
            </p>
            <p className="small text-muted mb-0">{t('crop.marketTab.reported')}</p>
            <p>
              <strong>{formatDate(market.data.reportedAt)}</strong>
            </p>
            <p className="small text-muted mb-0">{t('crop.marketTab.price')}</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
              {formatCurrency(entry.price)}{' '}
              <span className="m-unit">/ {t('unit.quintal')}</span>
            </p>
            <p className="mt-8">
              <SourceChip source={market.source} />
            </p>
            <Link to="/market-prices" className="btn btn-primary btn-sm">
              {t('crop.marketTab.more')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function AIAdvisoryPanel({ crop }) {
  const { t, cropName } = useLanguage();
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuestion, setLastQuestion] = useState('');

  async function send(q) {
    const text = (q ?? question).trim();
    if (!text || sending) return;
    setLastQuestion(text);
    setQuestion('');
    setSending(true);
    setError(null);
    try {
      const res = await askAssistant(text, { cropId: crop.id });
      setThread((th) => [...th, { q: text, a: res.data, source: res.source }]);
    } catch (e) {
      setError(e);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card card-pad">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Bot size={19} aria-hidden /> {t('crop.aiTab.title')}
      </h3>
      <p>
        <StatusBadge tone="blue">{t('crop.aiTab.context', { crop: cropName(crop) })}</StatusBadge>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        style={{ display: 'flex', gap: 10 }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('crop.aiTab.placeholder', { crop: cropName(crop) })}
          aria-label={t('crop.aiTab.title')}
          style={{
            flex: 1,
            border: '1px solid var(--border)',
            borderRadius: 999,
            padding: '10px 16px',
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !question.trim()}>
          <Send size={15} aria-hidden /> {t('crop.aiTab.send')}
        </button>
      </form>

      {sending && <LoadingState label={t('ai.thinking')} />}

      {error && (
        <div className="alert-item error" role="alert" style={{ marginTop: 12 }}>
          <Info size={18} aria-hidden />
          <div>
            <strong>{t('ai.error.title')}</strong>
            <p>{t('ai.error.body')}</p>
            <button type="button" className="btn btn-white btn-sm" onClick={() => send(lastQuestion)}>
              {t('ai.retry')}
            </button>
          </div>
        </div>
      )}

      <div className="stack-16 mt-16">
        {thread.map((item, i) => (
          <div key={i}>
            <p className="small" style={{ fontWeight: 600, color: 'var(--heading)' }}>
              Q: {item.q}
            </p>
            <div className="card card-pad" style={{ background: 'var(--page-bg-2)' }}>
              {item.source === 'demo' && (
                <p className="small" style={{ marginBottom: 8 }}>
                  <StatusBadge tone="warning">{t('ai.demoAnswer.title')}</StatusBadge>
                </p>
              )}
              <p>
                <strong>{t('ai.summary')}:</strong> {item.a.summary}
              </p>
              {(item.a.actions ?? []).length > 0 && (
                <>
                  <h4>{t('ai.actions')}</h4>
                  <ul className="rec-list">
                    {item.a.actions.map((a, j) => (
                      <li key={j}>
                        <CheckCircle2 size={15} className="check" aria-hidden />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="small text-muted" style={{ marginBottom: 0 }}>
                {item.source === 'demo' ? t('ai.demoAnswer.body') : t('ai.providerNote')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CropDetailsPage() {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { t, cropName, lang } = useLanguage();
  const [tab, setTab] = useState('overview');

  const crop = getCrop(cropId);

  const weather = useAsync(() => getCurrentWeather(), []);
  const suitability = useAsync(() => getCropSuitability(cropId), [cropId]);
  const market = useAsync(() => getMarketPrices(), []);
  const aiRec = useAsync(async () => {
    const res = await askAssistant(t('ai.suggestion.storage'), { cropId, purpose: 'recommendation' });
    return res;
  }, [cropId]);

  if (!crop) {
    return (
      <PageContainer>
        <div className="card">
          <EmptyState title={t('crop.notFound.title')} body={t('crop.notFound.body')} />
          <div style={{ textAlign: 'center', paddingBottom: 24 }}>
            <Link to="/crops" className="btn btn-primary">
              {t('common.backToCrops')}
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button type="button" className="link-action" onClick={() => navigate('/crops')}>
        <ArrowLeft size={16} aria-hidden /> {t('common.backToCrops')}
      </button>

      <div className="crop-top mt-8">
        <div className="card crop-identity">
          <SmartImage
            src={crop.image}
            fallbackSrc={getCropFallbackSrc(crop)}
            alt={cropName(crop)}
          />
          <div>
            <div className="badges">
              <StatusBadge tone="blue">{t(`category.${crop.category}`)}</StatusBadge>
              {crop.popular && <StatusBadge tone="green">{t('crops.popular')}</StatusBadge>}
            </div>
            <h1>{cropName(crop)}</h1>
            <p>{lang === 'te' ? crop.descriptionTe : crop.description}</p>
          </div>
        </div>
        <CropQuickFacts crop={crop} />
      </div>

      <div className="tabs" role="tablist" aria-label={t('crop.tab.overview')}>
        {TABS.map((key) => {
          const labelKeys = {
            overview: 'crop.tab.overview',
            weather: 'crop.tab.weather',
            storage: 'crop.tab.storage',
            market: 'crop.tab.market',
            ai: 'crop.tab.ai',
          };
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={tab === key}
              aria-controls={`panel-${key}`}
              className={`tab-btn${tab === key ? ' active' : ''}`}
              onClick={() => setTab(key)}
            >
              {t(labelKeys[key])}
            </button>
          );
        })}
      </div>

      <div className="tab-panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'overview' && <OverviewPanel crop={crop} />}
        {tab === 'weather' && <WeatherPanel crop={crop} weather={weather} suitability={suitability} />}
        {tab === 'storage' && <StoragePanel crop={crop} />}
        {tab === 'market' && <MarketPanel crop={crop} market={market} />}
        {tab === 'ai' && <AIAdvisoryPanel crop={crop} />}
      </div>

      <AnalysisCards weather={weather} suitability={suitability} aiRec={aiRec} />

      <div className="mt-16">
        <GrowthStages crop={crop} />
      </div>
    </PageContainer>
  );
}
