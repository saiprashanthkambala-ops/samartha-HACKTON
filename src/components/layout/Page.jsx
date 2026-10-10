import AppHeader from './AppHeader.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { isApiConfigured } from '../../api/client.js';

export function PageContainer({ children }) {
  const { t } = useLanguage();
  return (
    <div className="page">
      {!isApiConfigured() && (
        <div className="demo-banner" role="note">
          {t('app.demoBanner')}
        </div>
      )}
      <AppHeader />
      <main className="page-main">{children}</main>
      <footer className="app-footer">{t('app.footer')}</footer>
    </div>
  );
}

export function PageHeading({ title, subtitle, actions }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="row-between">{actions}</div>}
    </div>
  );
}
