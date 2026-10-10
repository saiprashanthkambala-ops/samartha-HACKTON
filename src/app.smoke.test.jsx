/**
 * Route smoke tests — server-render every page to catch runtime errors
 * (bad imports, undefined access) without a browser.
 */
import { describe, expect, it, beforeAll } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import App from './App.jsx';

beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
  }
});

const ROUTES = [
  '/',
  '/crops',
  '/crops/onion',
  '/crops/mango',
  '/crops/paddy',
  '/crops/unknown-crop',
  '/weather',
  '/market-prices',
  '/farmer-diary',
  '/ai-assistant',
  '/no-such-page',
];

describe('app routes render', () => {
  for (const route of ROUTES) {
    it(`renders ${route}`, () => {
      const html = renderToString(
        <MemoryRouter initialEntries={[route]}>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </MemoryRouter>
      );
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(200);
    });
  }

  it('renders Telugu interface when language is te', () => {
    globalThis.localStorage.setItem('farmshield.lang', 'te');
    const html = renderToString(
      <MemoryRouter initialEntries={['/']}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(html).toContain('పంటలు'); // nav label "Crops" in Telugu
    globalThis.localStorage.removeItem('farmshield.lang');
  });
});
