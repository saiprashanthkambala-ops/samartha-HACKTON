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
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_Farmer_Cultivating_In_Punjab.jpg?width=900',
  },
  {
    id: 'telangana',
    region: 'Telangana',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahabubnagar_District_farmer.jpg?width=900',
  },
  {
    id: 'andhra-pradesh',
    region: 'Andhra Pradesh',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/An_Indian_farmer_spreading_fertilizer_over_a_crop.jpg?width=900',
  },
  {
    id: 'karnataka',
    region: 'Karnataka',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rice_Farmer_Near_Hampi_Village_-_India.JPG?width=900',
  },
  {
    id: 'tamil-nadu',
    region: 'Tamil Nadu',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_Farmer_in_Tamil_Nadu.JPG?width=900',
  },
  {
    id: 'kerala',
    region: 'Kerala',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_farmer_in_Kerala_04.jpg?width=900',
  },
  {
    id: 'maharashtra',
    region: 'Maharashtra',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Farmer_At_Toranmal.jpg?width=900',
  },
  {
    id: 'west-bengal',
    region: 'West Bengal',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Farmer_in_paddy_field_guma.jpg?width=900',
  },
];

export default function HomeHero() {
  const { t } = useLanguage();
  const [activeFarmer, setActiveFarmer] = useState(0);
  const [failedFarmers, setFailedFarmers] = useState([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFarmer((current) => (current + 1) % FARMER_PROFILES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const farmer = FARMER_PROFILES[activeFarmer];
  const farmerImage = failedFarmers.includes(farmer.id) ? null : farmer.image;

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
            {farmerImage ? (
              <img
                key={farmer.id}
                className="hero-farmer"
                src={farmerImage}
                alt={`Farmer working in an agricultural setting in ${farmer.region}`}
                loading="eager"
                referrerPolicy="no-referrer"
                onError={() => setFailedFarmers((current) => current.includes(farmer.id) ? current : [...current, farmer.id])}
              />
            ) : (
              <div className="hero-farmer farmer-photo-fallback" role="img" aria-label={`Farmer photo unavailable for ${farmer.region}`}>
                <Sprout size={48} aria-hidden />
                <span>{farmer.region}</span>
              </div>
            )}
            <div className="farmer-carousel-dots" role="group" aria-label="Choose farmer portrait">
              {FARMER_PROFILES.map((profile, index) => (
                <button
                  key={profile.id}
                  type="button"
                  className={`farmer-carousel-dot${index === activeFarmer ? ' active' : ''}`}
                  aria-label={`Show farmer from ${profile.region}`}
                  aria-pressed={index === activeFarmer}
                  onClick={() => setActiveFarmer(index)}
                />
              ))}
            </div>
            <p className="farmer-region-label">{farmer.region}</p>
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
  { to: '/crops', icon: 'sprout', titleKey: 'home.quick.crop.title', descKey: 'home.quick.crop.desc', tint: 'var(--green-pale)', color: 'var(--green-dark)' },
  { to: '/weather', icon: 'cloud-sun', titleKey: 'home.quick.weather.title', descKey: 'home.quick.weather.desc', tint: 'var(--nav-active-bg)', color: 'var(--blue)' },
  { to: '/market-prices', icon: 'trending-up', titleKey: 'home.quick.market.title', descKey: 'home.quick.market.desc', tint: 'var(--warning-pale)', color: '#9a6512' },
  { to: '/farmer-diary', icon: 'notebook-pen', titleKey: 'home.quick.diary.title', descKey: 'home.quick.diary.desc', tint: 'var(--green-pale)', color: 'var(--green)' },
];
