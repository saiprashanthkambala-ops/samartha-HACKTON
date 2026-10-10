import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/Page.jsx';
import Logo from '../components/common/Logo.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <PageContainer>
      <div className="not-found">
        <Logo size="lg" className="not-found-logo" />
        <h1>404</h1>
        <p>{t('state.empty.title')}</p>
        <Link to="/" className="btn btn-primary">
          {t('nav.home')}
        </Link>
      </div>
    </PageContainer>
  );
}
