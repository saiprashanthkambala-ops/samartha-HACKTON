import { useState } from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

/**
 * Compact profile control.
 * No authentication backend exists yet — shows a neutral avatar and an
 * honest status popover. Uses real auth when the backend provides it
 * (see API_CONTRACT.md — auth is a backend dependency).
 */
export default function ProfileControl() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className="profile-btn"
        aria-label={t('nav.profile')}
        title={t('nav.profile')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <User size={19} aria-hidden />
      </button>
      {open && (
        <div
          className="card card-pad"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 240,
            zIndex: 60,
          }}
          role="dialog"
          aria-label={t('profile.title')}
        >
          <strong style={{ color: 'var(--heading)' }}>{t('profile.title')}</strong>
          <p className="small text-muted" style={{ marginTop: 6, marginBottom: 0 }}>
            {t('profile.signedOut')}
          </p>
          <p className="small" style={{ marginTop: 8, marginBottom: 0 }}>
            <span className="badge badge-muted">{t('profile.demoUser')}</span>
          </p>
        </div>
      )}
    </div>
  );
}
