import { useState } from 'react';
import { ImageOff } from 'lucide-react';

const CROP_GLYPHS = [
  [/ginger|adrak|allam/i, '🫚'],
  [/turmeric|haldi|pasupu/i, '🟠'],
  [/sweet potato/i, '🍠'],
  [/pea|bean|guvar|cluster bean|french bean/i, '🫛'],
  [/garlic|lehsun|vellulli/i, '🧄'],
  [/radish|mooli/i, '🥕'],
  [/beetroot|beet/i, '🫜'],
  [/spinach|amaranth|fenugreek|coriander|leaf/i, '🥬'],
  [/gourd|cucumber|ivy/i, '🥒'],
  [/tomato/i, '🍅'],
  [/onion/i, '🧅'],
  [/potato/i, '🥔'],
  [/chilli|pepper/i, '🌶️'],
  [/carrot/i, '🥕'],
  [/cabbage/i, '🥬'],
  [/mango/i, '🥭'],
  [/banana/i, '🍌'],
  [/orange|lemon|lime|mosambi/i, '🍊'],
  [/grape/i, '🍇'],
  [/papaya/i, '🥭'],
  [/pineapple/i, '🍍'],
  [/watermelon/i, '🍉'],
  [/coconut/i, '🥥'],
  [/apple/i, '🍎'],
  [/fruit|berry|litchi|lychee|jamun/i, '🍇'],
];

function getGlyph(alt = '') {
  return CROP_GLYPHS.find(([pattern]) => pattern.test(alt))?.[1] ?? '🌱';
}

/**
 * Never substitutes an unrelated random photo. If both real image sources fail,
 * render a labelled crop-specific illustration so the card remains complete.
 */
export default function SmartImage({
  src,
  alt,
  className,
  style,
  fallbackLabel,
  fallbackSrc,
  loading = 'lazy',
}) {
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
          gap: 8,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #f4f9f4, #e5f2e9)',
          color: 'var(--heading, #102f52)',
          textAlign: 'center',
          padding: 12,
        }}
        role="img"
        aria-label={alt}
      >
        <span aria-hidden style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', lineHeight: 1.1 }}>
          {getGlyph(alt)}
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{fallbackLabel || alt}</span>
        <ImageOff size={14} aria-hidden style={{ opacity: 0.45 }} />
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
      referrerPolicy="no-referrer"
      onError={() => {
        if (!usingFallback && fallbackSrc) setUsingFallback(true);
        else setFailed(true);
      }}
    />
  );
}
