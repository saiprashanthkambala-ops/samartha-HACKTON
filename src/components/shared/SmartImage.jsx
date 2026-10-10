import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Tries a secondary image source before showing the accessible placeholder.
 */
export default function SmartImage({ src, alt, className, style, fallbackLabel, fallbackSrc, loading = 'lazy' }) {
  const [failed, setFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

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
      src={usingFallback && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => {
        if (!usingFallback && fallbackSrc) setUsingFallback(true);
        else setFailed(true);
      }}
    />
  );
}
