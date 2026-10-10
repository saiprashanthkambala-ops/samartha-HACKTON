import { useMemo, useState } from 'react';
import {
  Bug,
  ChevronRight,
  CloudRain,
  IndianRupee,
  NotebookPen,
  PlusCircle,
  Sprout,
  Wheat,
  FlaskConical,
} from 'lucide-react';
import { PageContainer, PageHeading } from '../components/layout/Page.jsx';
import DiaryEntryForm from '../components/diary/DiaryEntryForm.jsx';
import SmartImage from '../components/shared/SmartImage.jsx';
import { SourceChip, LoadingState, ErrorState, EmptyState, StatusBadge } from '../components/shared/States.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import useAsync from '../hooks/useAsync.js';
import { createDiaryEntry, getDiaryEntries } from '../api/services.js';
import { getCrop } from '../data/crops.js';

const ICONS = {
  sowing: Sprout,
  fertilizer: FlaskConical,
  irrigation: CloudRain,
  pest: Bug,
  harvest: Wheat,
  expense: IndianRupee,
  note: NotebookPen,
};

const FILTERS = [
  { id: 'all', labelKey: 'diary.filter.all' },
  { id: 'crop', labelKey: 'diary.filter.crop' },
  { id: 'expense', labelKey: 'diary.filter.expense' },
  { id: 'harvest', labelKey: 'diary.filter.harvest' },
  { id: 'notes', labelKey: 'diary.filter.notes' },
];

const CROP_ACTIVITIES = ['sowing', 'fertilizer', 'irrigation', 'pest'];

function filterEntries(entries, filter) {
  switch (filter) {
    case 'crop':
      return entries.filter((e) => CROP_ACTIVITIES.includes(e.activityType));
    case 'expense':
      return entries.filter((e) => e.activityType === 'expense' || e.expense != null);
    case 'harvest':
      return entries.filter((e) => e.activityType === 'harvest');
    case 'notes':
      return entries.filter((e) => e.activityType === 'note');
    default:
      return entries;
  }
}

export default function FarmerDiaryPage() {
  const { t, formatDate, cropName, formatNumber, formatCurrency } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const diary = useAsync(() => getDiaryEntries(), []);

  const entries = useMemo(() => {
    const list = Array.isArray(diary.data) ? diary.data : [];
    return filterEntries(list, filter);
  }, [diary.data, filter]);

  const summary = useMemo(() => {
    const list = Array.isArray(diary.data) ? diary.data : [];
    const cropsSet = new Set(list.map((e) => e.cropId).filter(Boolean));
    const completed = list.filter((e) => ['sowing', 'fertilizer', 'irrigation', 'harvest'].includes(e.activityType)).length;
    const pending = list.filter((e) => e.activityType === 'pest').length;
    return { total: list.length, crops: cropsSet.size, completed, pending };
  }, [diary.data]);

  async function handleSave(input) {
    // Throws on failure → form keeps input and shows the error.
    await createDiaryEntry(input);
    setShowForm(false);
    setSuccessMsg(t('diary.form.success'));
    diary.reload();
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  return (
    <PageContainer>
      <PageHeading
        title={t('diary.title')}
        subtitle={t('diary.subtitle')}
        actions={
          <>
            {diary.source && <SourceChip source={diary.source} />}
            <button type="button" className="btn btn-green" onClick={() => setShowForm(true)}>
              <PlusCircle size={17} aria-hidden /> {t('diary.add')}
            </button>
          </>
        }
      />

      {successMsg && (
        <div className="alert-item info" role="status" style={{ marginBottom: 14 }}>
          <div>
            <strong>{successMsg}</strong>
            <p className="small" style={{ margin: 0 }}>
              {diary.source === 'demo' ? t('diary.demoNote') : ''}
            </p>
          </div>
        </div>
      )}

      <div className="filter-row" role="group" aria-label={t('diary.filter.all')} style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-chip${filter === f.id ? ' active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="diary-layout">
        <div>
          {diary.loading ? (
            <LoadingState />
          ) : diary.error ? (
            <ErrorState error={diary.error} onRetry={diary.reload} />
          ) : entries.length === 0 ? (
            <div className="card">
              <EmptyState title={t('diary.empty')} body={t('state.empty.body')} />
            </div>
          ) : (
            entries.map((entry) => {
              const crop = entry.cropId ? getCrop(entry.cropId) : null;
              const Icon = ICONS[entry.activityType] || NotebookPen;
              return (
                <article key={entry.id} className="card diary-entry">
                  <span className={`act-icon ${entry.activityType}`} aria-hidden>
                    <Icon size={20} />
                  </span>
                  <div className="entry-main">
                    <div className="entry-title-row">
                      <h3>{t(`diary.entry.${entry.activityType}`)}</h3>
                      {crop && <StatusBadge tone="green">{cropName(crop)}</StatusBadge>}
                      {entry.isDemo && <StatusBadge tone="warning">{t('common.demoBadge')}</StatusBadge>}
                    </div>
                    {entry.description && <p className="entry-desc">{entry.description}</p>}
                    <div className="entry-meta">
                      <span>{formatDate(entry.date)}</span>
                      {entry.quantity != null && (
                        <span>
                          {t('diary.form.quantity')}: {formatNumber(entry.quantity)} {entry.unit || ''}
                        </span>
                      )}
                      {entry.expense != null && (
                        <span>
                          {t('diary.entry.expense')}: {formatCurrency(entry.expense)}
                        </span>
                      )}
                    </div>
                    {entry.notes && <p className="small text-muted" style={{ margin: '4px 0 0' }}>{entry.notes}</p>}
                  </div>
                  {crop && <SmartImage className="entry-thumb" src={crop.image} alt={cropName(crop)} />}
                  <ChevronRight size={18} color="var(--muted)" aria-label={t('diary.viewDetail')} />
                </article>
              );
            })
          )}
        </div>

        <aside>
          <div className="card card-pad">
            <h3>{t('diary.summary.total')}</h3>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="s-value">{formatNumber(summary.total)}</div>
                <div className="s-label">{t('diary.summary.total')}</div>
              </div>
              <div className="summary-card">
                <div className="s-value">{formatNumber(summary.crops)}</div>
                <div className="s-label">{t('diary.summary.crops')}</div>
              </div>
              <div className="summary-card">
                <div className="s-value">{formatNumber(summary.completed)}</div>
                <div className="s-label">{t('diary.summary.completed')}</div>
              </div>
              <div className="summary-card">
                <div className="s-value">{formatNumber(summary.pending)}</div>
                <div className="s-label">{t('diary.summary.pending')}</div>
              </div>
            </div>
            {diary.source === 'demo' && (
              <p className="small text-muted" style={{ marginTop: 12, marginBottom: 0 }}>
                {t('diary.demoNote')}
              </p>
            )}
          </div>
        </aside>
      </div>

      {showForm && <DiaryEntryForm onSave={handleSave} onCancel={() => setShowForm(false)} />}
    </PageContainer>
  );
}
