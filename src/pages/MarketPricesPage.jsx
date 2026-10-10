import { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Minus,
  Search,
  Store,
} from 'lucide-react';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import PriceSparkline from '../components/market/PriceSparkline.jsx';
import SmartImage from '../components/shared/SmartImage.jsx';
import { SourceChip, LoadingState, ErrorState, EmptyState, StatusBadge } from '../components/shared/States.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import useAsync from '../hooks/useAsync.js';
import { getMarketPrices } from '../api/services.js';
import { getCrop, MARKET_CROP_IDS, CROP_CATEGORIES } from '../data/crops.js';

function PriceChange({ entry, t }) {
  const pct = entry.changePercent ?? 0;
  const cls = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
  const Icon = pct > 0 ? ArrowUpRight : pct < 0 ? ArrowDownRight : Minus;
  return (
    <span className={`price-change ${cls}`}>
      <Icon size={15} aria-hidden />
      {pct === 0 ? t('market.change.flat') : `${pct > 0 ? '+' : ''}${pct}%`} ·{' '}
      <span style={{ fontWeight: 500, color: 'var(--muted)' }}>{t('market.change.vsPrevious')}</span>
    </span>
  );
}

export default function MarketPricesPage() {
  const { t, cropName, formatDate, formatCurrency } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const market = useAsync(() => getMarketPrices(), []);

  const cards = useMemo(() => {
    let ids = MARKET_CROP_IDS.map(getCrop).filter(Boolean);
    if (category !== 'all') ids = ids.filter((c) => c.category === category);
    const q = query.trim().toLowerCase();
    if (q) ids = ids.filter((c) => c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q)));
    return ids;
  }, [query, category]);

  const selectedEntry = useMemo(() => {
    if (!market.data || !selectedId) return null;
    return market.data.entries?.find((e) => e.cropId === selectedId) ?? null;
  }, [market.data, selectedId]);

  const selectedCrop = selectedId ? getCrop(selectedId) : null;

  const categories = [
    { id: 'all', label: t('category.all') },
    { id: CROP_CATEGORIES.VEGETABLE, label: t('category.vegetable') },
    { id: CROP_CATEGORIES.FRUIT, label: t('category.fruit') },
    { id: CROP_CATEGORIES.FIELD, label: t('category.field') },
  ];

  return (
    <PageContainer>
      <PageHeading
        title={t('market.title')}
        subtitle={t('market.subtitle')}
        actions={
          market.data ? (
            <span className="small text-muted" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <Store size={15} aria-hidden /> {market.data.market} · <CalendarDays size={14} aria-hidden />{' '}
              {formatDate(market.data.reportedAt)} <SourceChip source={market.source} />
            </span>
          ) : null
        }
      />

      <div className="market-toolbar">
        <div className="filter-row" role="group" aria-label={t('market.filter.category')}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`filter-chip${category === c.id ? ' active' : ''}`}
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={16} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('market.filter.search')}
            aria-label={t('market.filter.search')}
          />
        </div>
      </div>

      {market.loading ? (
        <LoadingState />
      ) : market.error ? (
        <ErrorState error={market.error} onRetry={market.reload} />
      ) : (
        <>
          <div className="market-grid">
            {cards.map((crop) => {
              const entry = market.data.entries?.find((e) => e.cropId === crop.id) ?? null;
              return (
                <article key={crop.id} className="card market-card card-hover">
                  <div className="m-img-wrap">
                    <SmartImage src={crop.image} alt={cropName(crop)} />
                  </div>
                  <div className="m-body">
                    <div className="m-name">{cropName(crop)}</div>
                    {entry ? (
                      <>
                        <div>
                          <span className="m-price">{formatCurrency(entry.price)}</span>{' '}
                          <span className="m-unit">
                            / {t('unit.quintal')}
                          </span>
                        </div>
                        <PriceChange entry={entry} t={t} />
                        <PriceSparkline history={entry.history} />
                        <div className="m-meta">
                          {t('market.reportedOn')}: {formatDate(market.data.reportedAt)}
                          {market.data.grade ? ` · ${market.data.grade}` : ''}
                        </div>
                      </>
                    ) : (
                      <div className="small text-muted">{t('market.missing')}</div>
                    )}
                    <div className="m-actions">
                      <button
                        type="button"
                        className="btn btn-white btn-sm"
                        onClick={() => setSelectedId(crop.id)}
                        aria-label={`${t('market.viewDetails')} — ${cropName(crop)}`}
                      >
                        {t('market.viewDetails')} <ChevronRight size={14} aria-hidden />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Details panel */}
          <div className="details-panel card card-pad">
            <h2>{t('market.details.title')}</h2>
            {!selectedCrop ? (
              <EmptyState title={t('market.selectPrompt')} body={t('market.disclaimer')} />
            ) : !selectedEntry ? (
              <EmptyState title={t('market.missing')} body={t('market.disclaimer')} />
            ) : (
              <div className="grid-2">
                <div style={{ display: 'flex', gap: 16 }}>
                  <SmartImage
                    src={selectedCrop.image}
                    alt={cropName(selectedCrop)}
                    style={{ width: 140, height: 110, objectFit: 'cover', borderRadius: 12 }}
                  />
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{cropName(selectedCrop)}</h3>
                    <p className="small text-muted mb-0">{t('market.details.market')}</p>
                    <p>
                      <strong>{market.data.market}</strong>
                    </p>
                    <p className="small text-muted mb-0">{t('market.details.date')}</p>
                    <p>
                      <strong>{formatDate(market.data.reportedAt)}</strong>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="small text-muted mb-0">{t('market.details.price')}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', margin: '2px 0 8px' }}>
                    {formatCurrency(selectedEntry.price)}{' '}
                    <span className="m-unit">/ {t('unit.quintal')}</span>
                  </p>
                  <p className="small text-muted mb-0">{t('market.details.grade')}</p>
                  <p className="small">{market.data.grade || t('common.notAvailable')}</p>
                  <PriceChange entry={selectedEntry} t={t} />
                  <p className="mt-8">
                    <SourceChip source={market.source} />
                  </p>
                  <p className="small text-muted mb-0">{t('market.details.trend')}</p>
                  <PriceSparkline history={selectedEntry.history} />
                  <p className="small text-muted">{t('market.details.comparables')}:</p>
                  <p className="small">{t('market.details.noComparables')}</p>
                  <p className="small">
                    <StatusBadge tone="muted">{t('market.stale')}</StatusBadge>
                  </p>
                  <p className="small text-muted mb-0">{t('market.disclaimer')}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}
