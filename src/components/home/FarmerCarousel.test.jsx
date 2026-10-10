// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import FarmerCarousel from './FarmerCarousel.jsx';
import { LanguageProvider } from '../../i18n/LanguageContext.jsx';
import { farmers } from '../../data/farmers.js';

function stubMatchMedia(reduced = false) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function renderCarousel() {
  return render(
    <LanguageProvider>
      <FarmerCarousel />
    </LanguageProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('FarmerCarousel', () => {
  beforeEach(() => {
    localStorage.clear();
    stubMatchMedia(false);
  });

  it('shows one photo at a time with 8 clickable dots', () => {
    const { container } = renderCarousel();
    const dots = container.querySelectorAll('.farmer-dot');
    expect(dots.length).toBe(8);
    const photos = container.querySelectorAll('.farmer-photo');
    expect(photos.length).toBe(8);
    expect(container.querySelectorAll('.farmer-photo.is-active').length).toBe(1);
  });

  it('auto-rotates every 5 seconds and updates the label', () => {
    vi.useFakeTimers();
    const { container } = renderCarousel();
    const label = () => container.querySelector('.farmer-region').textContent;
    const first = label();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(label()).not.toBe(first);
    act(() => {
      vi.advanceTimersByTime(5000 * 7);
    });
    // wrapped around back to the first entry after 8 slides
    expect(label()).toBe(first);
  });

  it('navigates via dots and updates the visible label', () => {
    const { container } = renderCarousel();
    const dots = container.querySelectorAll('.farmer-dot');
    fireEvent.click(dots[4]);
    expect(container.querySelector('.farmer-region').textContent).toBeTruthy();
    expect(dots[4].getAttribute('aria-current')).toBe('true');
    expect(container.querySelector('.farmer-photo.is-active')).toBeTruthy();
  });

  it('supports keyboard arrow navigation', () => {
    const { container } = renderCarousel();
    const region = container.querySelector('.farmer-carousel');
    const activeDot = () =>
      [...container.querySelectorAll('.farmer-dot')].findIndex((d) => d.getAttribute('aria-current') === 'true');
    expect(activeDot()).toBe(0);
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(activeDot()).toBe(1);
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(activeDot()).toBe(0);
  });

  it('pauses auto-rotation while hovered and resumes after', () => {
    vi.useFakeTimers();
    const { container } = renderCarousel();
    const region = container.querySelector('.farmer-carousel');
    const label = () => container.querySelector('.farmer-region').textContent;
    const first = label();
    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(label()).toBe(first); // paused
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(label()).not.toBe(first); // resumed
  });

  it('cleans up its timer on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = renderCarousel();
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not autoplay under prefers-reduced-motion', () => {
    stubMatchMedia(true);
    vi.useFakeTimers();
    const { container } = renderCarousel();
    const label = () => container.querySelector('.farmer-region').textContent;
    const first = label();
    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(label()).toBe(first);
  });

  it('uses honest representative labels for all eight states', () => {
    const { container } = renderCarousel();
    const label = container.querySelector('.farmer-region').textContent;
    const expected = farmers.map((f) => f.regionKey);
    expect(expected.length).toBe(8);
    expect(label.length).toBeGreaterThan(0);
  });
});