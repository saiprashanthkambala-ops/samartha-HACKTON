import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, Leaf, Menu, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import ProfileControl from './ProfileControl.jsx';

const LOGO_CANDIDATES = [
  '/images/logo.png',
  '/images/logo.svg',
  '/images/logo.webp',
  '/images/logo.jpg',
  '/images/Logo.png',
  '/images/Logo.svg',
  '/images/farmshield-logo.png',
  '/images/farmshield-logo.svg',
  '/images/farmshield-logo.webp',
  '/images/farmshield-logo.jpg',
  '/images/farmshield_logo.png',
  '/images/farmshield_logo.svg',
  '/images/FarmShield.png',
  '/images/FarmShield.svg',
  '/images/FarmShieldLogo.png',
  '/images/FarmShield-Logo.png',
  '/images/logo-farmshield.png',
  '/images/logo-farmshield.svg',
  '/images/brand-logo.png',
  '/images/brand.png',
  '/images/farmshield.png',
  '/images/farmshield-icon.png',
  '/images/farmshield-icon.svg',
];

function BrandMark() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <span className="brand-leaf" aria-hidden>
        <Leaf size={20} />
      </span>
    );
  }

  return (
    <img
      className="brand-logo"
      src={LOGO_CANDIDATES[candidateIndex]}
      alt="FarmShield"
      onError={() => {
        if (candidateIndex < LOGO_CANDIDATES.length - 1) setCandidateIndex((index) => index + 1);
        else setShowFallback(true);
      }}
    />
  );
}

export default function AppHeader() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/crops', label: t('nav.crops') },
    { to: '/weather', label: t('nav.weather') },
    { to: '/market-prices', label: t('nav.market') },
    { to: '/farmer-diary', label: t('nav.diary') },
    { to: '/ai-assistant', label: t('nav.assistant'), icon: Bot },
  ];

  return (
    <div className="app-header-wrap">
      <header className={`app-header${open ? ' actions-visible' : ''}`}>
        <NavLink className="brand" to="/" onClick={() => setOpen(false)} aria-label={t('app.name')}>
          <BrandMark />
          <span>{t('app.name')}</span>
        </NavLink>

        <nav className={`main-nav${open ? ' open' : ''}`} aria-label={t('nav.menu')}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}${item.icon ? ' nav-link-with-icon' : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.icon && <item.icon size={16} aria-hidden />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSelector />
          <ProfileControl />
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={t('nav.menu')}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </header>
    </div>
  );
}
