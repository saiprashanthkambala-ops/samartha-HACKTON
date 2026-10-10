import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/Page.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <PageContainer>
      <div className="not-found">
        <h1>404</h1>
        <p>{t('state.empty.title')}</p>
        <Link to="/" className="btn btn-primary">
          {t('nav.home')}
        </Link>
      </div>
    </PageContainer>
  );
}
