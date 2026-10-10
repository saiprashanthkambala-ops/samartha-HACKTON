import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image with graceful fallback — a broken path never collapses the card.
 *
 * Failure policy: one-shot. After a load error the component shows a neutral
 * placeholder (never a silent substitute photo) and does NOT retry. If the
 * `src` prop changes, the failure state resets so the new source gets its
 * single attempt. No emojis, illustrations or unrelated stock stand-ins.
 */
export default function SmartImage({
  src,
  alt,
  className,
  style,
  fallbackLabel,
  eager = false,
  aspect,
  ...aria
}) {
  const [failed, setFailed] = useState(false);

  // A new source deserves a fresh, single attempt.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const boxStyle = aspect
    ? { ...style, aspectRatio: aspect, objectFit: 'cover' }
    : { ...style, objectFit: 'cover' };

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
        {...aria}
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
      style={boxStyle}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...aria}
      onError={() => setFailed(true)}
    />
  );
}