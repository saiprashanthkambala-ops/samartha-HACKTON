import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import ProfileControl from './ProfileControl.jsx';

export default function AppHeader() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/crops', label: t('nav.crops') },
    { to: '/weather', label: t('nav.weather') },
    { to: '/market-prices', label: t('nav.market') },
    { to: '/farmer-diary', label: t('nav.diary') },
  ];

  return (
    <div className="app-header-wrap">
      <header className={`app-header${open ? ' actions-visible' : ''}`}>
        <a className="brand" href="/" onClick={() => setOpen(false)}>
          <span className="brand-leaf">
            <Leaf size={20} aria-hidden />
          </span>
          {t('app.name')}
        </a>

        <nav className={`main-nav${open ? ' open' : ''}`} aria-label={t('nav.menu')}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
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
