import { Link } from 'react-router-dom';
import SmartImage from '../shared/SmartImage.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function getImageLock(id = '') {
  return [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
}

export default function CropCard({ crop, large = false }) {
  const { cropName, t } = useLanguage();
  const category = crop.category === 'fruit' ? 'fruit' : crop.category === 'vegetable' ? 'vegetable' : 'crop,field';
  const fallbackSrc = `https://loremflickr.com/800/600/${encodeURIComponent(crop.name)},${category}?lock=${getImageLock(crop.id)}`;
  return (
    <Link
      to={`/crops/${crop.id}`}
      className={`crop-card card-hover${large ? ' crop-card-lg' : ''}`}
      aria-label={`${cropName(crop)} — ${t('common.details')}`}
    >
      <div className="crop-img-wrap">
        <SmartImage src={crop.image} fallbackSrc={fallbackSrc} alt={cropName(crop)} loading="lazy" />
      </div>
      <div className="crop-name">{cropName(crop)}</div>
    </Link>
  );
}
