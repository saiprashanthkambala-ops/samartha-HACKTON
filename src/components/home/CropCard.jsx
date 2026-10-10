import { Link } from 'react-router-dom';
import SmartImage from '../shared/SmartImage.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function getImageLock(id = '') {
  return [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
}

export default function CropCard({ crop, large = false }) {
  const { cropName, t } = useLanguage();
  const fallbackTags = crop.category === 'fruit'
    ? `${encodeURIComponent(crop.name)},fruit`
    : crop.category === 'vegetable'
      ? `${encodeURIComponent(crop.name)},vegetable`
      : `${encodeURIComponent(crop.name)},crop,field`;
  const fallbackSrc = `https://loremflickr.com/800/600/${fallbackTags}?lock=${getImageLock(crop.id)}`;

  return (
    <Link
      to={`/crops/${crop.id}`}
      className={`crop-card card-hover${large ? ' crop-card-lg' : ''}`}
      aria-label={`${cropName(crop)} — ${t('common.details')}`}
    >
      <div className="crop-img-wrap">
        <SmartImage
          src={crop.image}
          fallbackSrc={fallbackSrc}
          alt={cropName(crop)}
          loading="lazy"
        />
      </div>
      <div className="crop-name">{cropName(crop)}</div>
    </Link>
  );
}
