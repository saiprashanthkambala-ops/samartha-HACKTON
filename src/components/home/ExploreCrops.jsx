import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { getCrop, HOME_ROW_1, HOME_ROW_2, searchCrops } from '../../data/crops.js';
import CropCard from './CropCard.jsx';
import { EmptyState } from '../shared/States.jsx';

/**
 * "Explore Crops" gallery — six cards per row, two rows on wide desktop.
 * Includes a working client-side search over the crop catalogue.
 */
export default function ExploreCrops() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const baseIds = [...HOME_ROW_1, ...HOME_ROW_2];
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return baseIds.map(getCrop).filter(Boolean);
    const matched = new Set(searchCrops(q).map((c) => c.id));
    return baseIds.map(getCrop).filter((c) => c && matched.has(c.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <section aria-label={t('home.explore.title')}>
      <div className="section-title-row">
        <h2>{t('home.explore.title')}</h2>
        <div className="row-between" style={{ gap: 14 }}>
          <div className="search-box">
            <Search size={16} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.search.placeholder')}
              aria-label={t('common.search')}
            />
          </div>
          <Link to="/crops" className="link-action">
            {t('common.viewAll')} <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card">
          <EmptyState title={t('home.search.noResults')} body={t('home.search.hint')} />
        </div>
      ) : (
        <div className="crop-grid">
          {results.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      )}
    </section>
  );
}
