import { Link } from 'react-router-dom';
import { CloudSun, NotebookPen, Sprout, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const ICONS = {
  sprout: Sprout,
  'cloud-sun': CloudSun,
  'trending-up': TrendingUp,
  'notebook-pen': NotebookPen,
};

export default function QuickAccessCard({ to, icon, titleKey, descKey, tint, color }) {
  const { t } = useLanguage();
  const Icon = ICONS[icon] || Sprout;
  return (
    <Link to={to} className="quick-card">
      <span className="quick-icon" style={{ background: tint, color }} aria-hidden>
        <Icon size={22} />
      </span>
      <span>
        <h3>{t(titleKey)}</h3>
        <p>{t(descKey)}</p>
      </span>
    </Link>
  );
}
