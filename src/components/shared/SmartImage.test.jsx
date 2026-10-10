// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import SmartImage from './SmartImage.jsx';

afterEach(cleanup);

describe('SmartImage', () => {
  it('renders the image with lazy loading and object-fit cover', () => {
    const { container } = render(
      <SmartImage src="/images/crops/onion.jpg" alt="Onion" className="thumb" />,
    );
    const img = container.querySelector('img');
    expect(img.getAttribute('src')).toBe('/images/crops/onion.jpg');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.style.objectFit).toBe('cover');
  });

  it('uses eager loading when requested', () => {
    const { container } = render(
      <SmartImage src="/images/crops/onion.jpg" alt="Onion" eager />,
    );
    expect(container.querySelector('img').getAttribute('loading')).toBe('eager');
  });

  it('shows a neutral placeholder on load failure — never another photo', () => {
    const { container } = render(
      <SmartImage src="/images/crops/missing.jpg" alt="Missing crop" fallbackLabel="Photo unavailable" />,
    );
    const img = container.querySelector('img');
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    const placeholder = container.querySelector('[role="img"]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent).toContain('Photo unavailable');
  });

  it('does not infinitely retry: stays on placeholder while src is unchanged', () => {
    const { container, rerender } = render(
      <SmartImage src="/images/crops/missing.jpg" alt="Broken" fallbackLabel="Photo unavailable" />,
    );
    fireEvent.error(container.querySelector('img'));
    rerender(<SmartImage src="/images/crops/missing.jpg" alt="Broken" fallbackLabel="Photo unavailable" />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelectorAll('[role="img"]').length).toBe(1);
  });

  it('gives a changed src one fresh attempt', () => {
    const { container, rerender } = render(
      <SmartImage src="/images/crops/missing.jpg" alt="Crop" fallbackLabel="Photo unavailable" />,
    );
    fireEvent.error(container.querySelector('img'));
    rerender(<SmartImage src="/images/crops/onion.jpg" alt="Crop" />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/images/crops/onion.jpg');
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
  });
});