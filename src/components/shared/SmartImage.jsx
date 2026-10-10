import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image with graceful fallback — a broken path never collapses the card.
 * Shows a neutral placeholder with descriptive alt text if loading fails.
 */
export default function SmartImage({ src, alt, className, style, fallbackLabel }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
          background: 'var(--page-bg-2)',
          color: 'var(--muted)',
          fontSize: '0.75rem',
          textAlign: 'center',
          padding: 8,
        }}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={22} aria-hidden />
        <span>{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
