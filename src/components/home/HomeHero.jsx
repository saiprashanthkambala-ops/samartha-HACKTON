import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Sprout } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import SmartImage from '../shared/SmartImage.jsx';

const HERO_BG = '/images/hero/farm-field.jpg';

const FARMER_PROFILES = [
  {
    id: 'punjab',
    region: 'Punjab',
    image: 'https://loremflickr.com/500/600/punjabi,indian,farmer,portrait?lock=501',
  },
  {
    id: 'telangana',
    region: 'Telangana',
    image: 'https://loremflickr.com/500/600/telangana,indian,farmer,portrait?lock=502',
  },
  {
    id: 'andhra-pradesh',
    region: 'Andhra Pradesh',
    image: 'https://loremflickr.com/500/600/andhra,indian,farmer,portrait?lock=503',
  },
  {
    id: 'karnataka',
    region: 'Karnataka',
    image: 'https://loremflickr.com/500/600/karnataka,indian,farmer,portrait?lock=504',
  },
  {
    id: 'tamil-nadu',
    region: 'Tamil Nadu',
    image: 'https://loremflickr.com/500/600/tamil,nadu,indian,farmer,portrait?lock=505',
  },
  {
    id: 'kerala',
    region: 'Kerala',
    image: 'https://loremflickr.com/500/600/kerala,indian,farmer,portrait?lock=506',
  },
  {
    id: 'maharashtra',
    region: 'Maharashtra',
    image: 'https://loremflickr.com/500/600/maharashtra,indian,farmer,portrait?lock=507',
  },
  {
    id: 'west-bengal',
    region: 'West Bengal',
    image: 'https://loremflickr.com/500/600/bengali,indian,farmer,portrait?lock=508',
  },
];

export default function HomeHero() {
  const { t } = useLanguage();
  const [activeFarmer, setActiveFarmer] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFarmer((current) => (current + 1) % FARMER_PROFILES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const farmer = FARMER_PROFILES[activeFarmer];

  return (
    <section className="hero" aria-label={t('home.hero.line1')}>
      <SmartImage className="hero-bg" src={HERO_BG} alt="" fallbackLabel="" />
      <div className="hero-scrim" aria-hidden />

      <div className="hero-content">
        <div className="hero-copy">
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
          <div className="farmer-carousel" aria-label="Farmers from different Indian states">
            <SmartImage
              key={farmer.id}
              className="hero-farmer"
              src={farmer.image}
              alt={`Illustrative farmer portrait representing ${farmer.region}`}
              fallbackLabel=""
              loading="eager"
            />
            <div className="farmer-carousel-dots" role="group" aria-label="Choose farmer portrait">
              {FARMER_PROFILES.map((profile, index) => (
                <button
                  key={profile.id}
                  type="button"
                  className={`farmer-carousel-dot${index === activeFarmer ? ' active' : ''}`}
                  aria-label={`Show ${profile.region} farmer portrait`}
                  aria-pressed={index === activeFarmer}
                  onClick={() => setActiveFarmer(index)}
                />
              ))}
            </div>
          </div>

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
