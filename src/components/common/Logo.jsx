export const LOGO_ASSET_PATH = 'public/images/application.logo/Glossy Sun and Leaf Eco Emblem.png';
export const LOGO_PUBLIC_URL = '/images/application.logo/Glossy%20Sun%20and%20Leaf%20Eco%20Emblem.png';

const SIZES = {
  xs: { height: 18, width: 27 },
  sm: { height: 24, width: 36 },
  md: { height: 36, width: 54 },
  lg: { height: 48, width: 72 },
  xl: { height: 64, width: 96 },
};

/**
 * FarmShield reusable Logo component.
 *
 * Integrates the official FarmShield emblem asset located at
 * `public/images/application.logo/Glossy Sun and Leaf Eco Emblem.png`.
 *
 * Preserves the original 3:2 aspect ratio (1536x1024), alpha transparency,
 * and semantic accessibility.
 */
export default function Logo({
  size = 'md',
  alt = 'FarmShield logo',
  className = '',
  style = {},
  ...rest
}) {
  const dimensions = typeof size === 'number'
    ? { height: size, width: Math.round(size * 1.5) }
    : (SIZES[size] || SIZES.md);

  const combinedClasses = ['app-logo', `app-logo-${typeof size === 'string' ? size : 'custom'}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <img
      src={LOGO_PUBLIC_URL}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={combinedClasses}
      style={{
        aspectRatio: '3 / 2',
        objectFit: 'contain',
        verticalAlign: 'middle',
        ...style,
      }}
      loading="eager"
      decoding="async"
      {...rest}
    />
  );
}
