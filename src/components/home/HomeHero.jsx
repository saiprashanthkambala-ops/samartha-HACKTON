import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Sprout } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import Logo from '../common/Logo.jsx';
import SmartImage from '../shared/SmartImage.jsx';
import FarmerCarousel from './FarmerCarousel.jsx';

const HERO_BG = '/images/hero/farm-field.jpg';

export default function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="hero" aria-label={t('home.hero.line1')}>
      <SmartImage className="hero-bg" src={HERO_BG} alt="" fallbackLabel="" />
      <div className="hero-scrim" aria-hidden />

      <div className="hero-content">
        <div className="hero-copy">
          <div className="hero-brand-badge">
            <Logo size="xs" className="hero-badge-logo" alt="" />
            <span>{t('app.name')}</span>
          </div>
          <h1>
            {t('home.hero.line1')}
            <br />
            <span className="hero-line-green">{t('home.hero.line2')}</span>
          </h1>
          <p className="hero-desc">{t('home.hero.desc')}</p>
          <div className="hero-cta-row">
            <Link to="/crops" className="btn btn-white">
              <Sprout size={17} aria-hidden /> {t('home.hero.ctaCrops')}
            </Link>
            <Link to="/ai-assistant" className="btn btn-green">
              {t('home.hero.ctaAssistant')} <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <FarmerCarousel />

          <div className="ai-card">
            <div className="ai-icon">
              <Bot size={24} aria-hidden />
            </div>
            <h3>{t('home.aiCard.title')}</h3>
            <p>{t('home.aiCard.desc')}</p>
            <Link to="/ai-assistant" className="btn btn-primary btn-sm">
              {t('home.aiCard.button')} <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export const QUICK_LINKS = [
  {
    to: '/crops',
    icon: 'sprout',
    titleKey: 'home.quick.crop.title',
    descKey: 'home.quick.crop.desc',
    tint: 'var(--green-pale)',
    color: 'var(--green-dark)',
  },
  {
    to: '/weather',
    icon: 'cloud-sun',
    titleKey: 'home.quick.weather.title',
    descKey: 'home.quick.weather.desc',
    tint: 'var(--nav-active-bg)',
    color: 'var(--blue)',
  },
  {
    to: '/market-prices',
    icon: 'trending-up',
    titleKey: 'home.quick.market.title',
    descKey: 'home.quick.market.desc',
    tint: 'var(--warning-pale)',
    color: '#9a6512',
  },
  {
    to: '/farmer-diary',
    icon: 'notebook-pen',
    titleKey: 'home.quick.diary.title',
    descKey: 'home.quick.diary.desc',
    tint: 'var(--green-pale)',
    color: 'var(--green)',
  },
];
