import { Link } from 'react-router-dom';
import SmartImage from '../shared/SmartImage.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function CropCard({ crop, large = false }) {
  const { cropName, t } = useLanguage();
  return (
    <Link
      to={`/crops/${crop.id}`}
      className={`crop-card card-hover${large ? ' crop-card-lg' : ''}`}
      aria-label={`${cropName(crop)} — ${t('common.details')}`}
    >
      <div className="crop-img-wrap">
        <SmartImage src={crop.image} alt={cropName(crop)} />
      </div>
      <div className="crop-name">{cropName(crop)}</div>
    </Link>
  );
}
