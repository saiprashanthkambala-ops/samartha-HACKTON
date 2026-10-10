import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import CropCard from '../components/home/CropCard.jsx';
import { EmptyState } from '../components/shared/States.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { CROP_CATEGORIES, searchCrops } from '../data/crops.js';

export default function CropsPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => {
    let list = searchCrops(query);
    if (category !== 'all') list = list.filter((c) => c.category === category);
    return list;
  }, [query, category]);

  const categories = [
    { id: 'all', label: t('category.all') },
    ...CROP_CATEGORIES.map((c) => ({ id: c.id, label: t(c.labelKey) })),
  ];

  return (
    <PageContainer>
      <PageHeading title={t('crops.title')} subtitle={t('crops.subtitle')} />

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
            placeholder={t('crops.search.placeholder')}
            aria-label={t('common.search')}
          />
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
    </PageContainer>
  );
}