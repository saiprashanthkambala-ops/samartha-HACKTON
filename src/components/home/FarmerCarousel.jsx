import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { farmers } from '../../data/farmers.js';
import SmartImage from '../shared/SmartImage.jsx';

const INTERVAL_MS = 5000;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Home farmer carousel — eight verified photographs of Indian farmers,
 * one representative entry per state (see src/data/farmers.js for the
 * provenance policy behind the regional labels).
 *
 * Behavior: auto-rotates every 5s, pauses on hover/focus/interaction,
 * 8 clickable dots, ← → keyboard navigation, aria-live label updates,
 * reduced-motion respected, timer cleaned up on unmount.
 */
export default function FarmerCarousel() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const regionWrapRef = useRef(null);
  const total = farmers.length;

  const goTo = useCallback(
    (next) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  // Track prefers-reduced-motion live so a system change stops autoplay.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Auto-rotate every 5s unless paused (hover/focus/interaction) or reduced motion.
  useEffect(() => {
    if (paused || reduced) return undefined;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduced, total]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPaused(true);
      goTo(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPaused(true);
      goTo(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPaused(true);
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPaused(true);
      goTo(total - 1);
    }
  };

  const entry = farmers[index];

  return (
    <section
      className={`farmer-carousel${reduced ? ' farmer-carousel-reduced' : ''}`}
      aria-roledescription="carousel"
      aria-label={t('carousel.label')}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
    >
      <div className="farmer-frame" ref={regionWrapRef}>
        {farmers.map((f, i) => (
          <SmartImage
            key={f.id}
            className={`farmer-photo${i === index ? ' is-active' : ''}`}
            src={f.image}
            alt={i === index ? t(`farmer.${f.regionKey}.alt`) : ''}
            aria-hidden={i !== index}
            eager={i === 0}
            fallbackLabel=""
          />
        ))}
        <div className="farmer-caption" aria-live="polite">
          <span className="farmer-region">{t(`farmer.${entry.regionKey}.label`)}</span>
          <span className="farmer-caption-note">{t('carousel.caption', { region: t(`farmer.${entry.regionKey}.label`) })}</span>
        </div>
      </div>

      <div className="farmer-dots" role="group" aria-label={t('carousel.label')}>
        <button
          type="button"
          className="carousel-arrow"
          aria-label={t('aria.carouselPrev')}
          onClick={() => {
            setPaused(true);
            goTo(index - 1);
          }}
        >
          ‹
        </button>
        {farmers.map((f, i) => (
          <button
            key={f.id}
            type="button"
            className={`farmer-dot${i === index ? ' is-active' : ''}`}
            aria-label={t('aria.carouselDot', { index: i + 1 })}
            aria-current={i === index}
            onClick={() => {
              setPaused(true);
              goTo(i);
            }}
          />
        ))}
        <button
          type="button"
          className="carousel-arrow"
          aria-label={t('aria.carouselNext')}
          onClick={() => {
            setPaused(true);
            goTo(index + 1);
          }}
        >
          ›
        </button>
      </div>
      <p className="farmer-counter" aria-hidden>
        {t('carousel.slideOf', { index: index + 1, total })}
      </p>
    </section>
  );
}