import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export function LoadingState({ label }) {
  const { t } = useLanguage();
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden />
      <p className="mb-0">{label || t('state.loading.title')}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const { t } = useLanguage();
  return (
    <div className="state-box error" role="alert">
      <div className="state-icon">
        <AlertCircle size={26} aria-hidden />
      </div>
      <h3>{t('state.error.title')}</h3>
      <p>{error?.message || t('state.error.body')}</p>
      {onRetry && (
        <button type="button" className="btn btn-white btn-sm" onClick={onRetry}>
          <RefreshCw size={15} aria-hidden /> {t('common.retry')}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, body }) {
  const { t } = useLanguage();
  return (
    <div className="state-box">
      <div className="state-icon">
        <Inbox size={26} aria-hidden />
      </div>
      <h3>{title || t('state.empty.title')}</h3>
      <p className="mb-0">{body || t('state.empty.body')}</p>
    </div>
  );
}

/** Small chip that truthfully labels the origin of displayed data. */
export function SourceChip({ source }) {
  const { t } = useLanguage();
  if (source === 'api') {
    return (
      <span className="source-chip live" title={t('common.liveData')}>
        ● {t('common.liveData')}
      </span>
    );
  }
  return (
    <span className="source-chip demo" title={t('common.demoData')}>
      ● {t('common.demoBadge')} · {t('common.demoData')}
    </span>
  );
}

export function StatusBadge({ tone = 'muted', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
