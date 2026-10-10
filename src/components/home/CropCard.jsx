import { Link } from 'react-router-dom';
import SmartImage from '../shared/SmartImage.jsx';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

const VERIFIED_FALLBACKS = {
  ginger: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ginger_rhizomes.jpg?width=900',
  'sweet-potato': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sweet_potatoes.jpg?width=900',
  'french-beans': 'https://commons.wikimedia.org/wiki/Special:FilePath/Green_bean.jpg?width=900',
  'cluster-beans': 'https://commons.wikimedia.org/wiki/Special:FilePath/Cluster_beans.jpg?width=900',
  turmeric: 'https://commons.wikimedia.org/wiki/Special:FilePath/Turmeric.jpg?width=900',
  'green-peas': 'https://commons.wikimedia.org/wiki/Special:FilePath/Green_peas.jpg?width=900',
  'amaranth-greens': 'https://commons.wikimedia.org/wiki/Special:FilePath/Amaranthus_tricolor.jpg?width=900',
  drumstick: 'https://commons.wikimedia.org/wiki/Special:FilePath/Moringa_oleifera_pods.jpg?width=900',
};

export default function CropCard({ crop, large = false }) {
  const { cropName, t } = useLanguage();
  const fallbackSrc = VERIFIED_FALLBACKS[crop.id];

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
          fallbackLabel={cropName(crop)}
          loading="lazy"
        />
      </div>
      <div className="crop-name">{cropName(crop)}</div>
    </Link>
  );
}
