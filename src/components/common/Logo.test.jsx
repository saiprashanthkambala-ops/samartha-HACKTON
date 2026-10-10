import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Logo, { LOGO_ASSET_PATH, LOGO_PUBLIC_URL } from './Logo.jsx';
import { LanguageProvider } from '../../i18n/LanguageContext.jsx';
import AppHeader from '../layout/AppHeader.jsx';
import { PageContainer } from '../layout/Page.jsx';

describe('Logo Component', () => {
  it('underlying asset exists on disk inside public/images/', () => {
    const fullDiskPath = path.resolve(process.cwd(), LOGO_ASSET_PATH);
    expect(fs.existsSync(fullDiskPath)).toBe(true);
    const stats = fs.statSync(fullDiskPath);
    expect(stats.size).toBeGreaterThan(100000); // 1.35MB PNG
  });

  it('renders with default props and accessibility attributes', () => {
    const html = renderToString(<Logo />);
    expect(html).toContain('src="/images/application.logo/Glossy%20Sun%20and%20Leaf%20Eco%20Emblem.png"');
    expect(html).toContain('alt="FarmShield logo"');
    expect(html).toContain('width="54"');
    expect(html).toContain('height="36"');
    expect(html).toContain('class="app-logo app-logo-md"');
    expect(html).toContain('aspect-ratio:3 / 2');
  });

  it('supports size presets (xs, sm, md, lg, xl)', () => {
    const xs = renderToString(<Logo size="xs" />);
    expect(xs).toContain('width="27"');
    expect(xs).toContain('height="18"');

    const sm = renderToString(<Logo size="sm" />);
    expect(sm).toContain('width="36"');
    expect(sm).toContain('height="24"');

    const lg = renderToString(<Logo size="lg" />);
    expect(lg).toContain('width="72"');
    expect(lg).toContain('height="48"');

    const xl = renderToString(<Logo size="xl" />);
    expect(xl).toContain('width="96"');
    expect(xl).toContain('height="64"');
  });

  it('supports custom numeric size and custom className', () => {
    const html = renderToString(<Logo size={50} className="custom-test-class" alt="Custom Alt" />);
    expect(html).toContain('height="50"');
    expect(html).toContain('width="75"');
    expect(html).toContain('custom-test-class');
    expect(html).toContain('alt="Custom Alt"');
  });

  it('is integrated into AppHeader', () => {
    const html = renderToString(
      <MemoryRouter>
        <LanguageProvider>
          <AppHeader />
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(html).toContain(LOGO_PUBLIC_URL);
    expect(html).toContain('brand-logo');
    expect(html).toContain('FarmShield');
  });

  it('is integrated into PageContainer footer', () => {
    const html = renderToString(
      <MemoryRouter>
        <LanguageProvider>
          <PageContainer>
            <div>Test Content</div>
          </PageContainer>
        </LanguageProvider>
      </MemoryRouter>
    );
    expect(html).toContain(LOGO_PUBLIC_URL);
    expect(html).toContain('footer-logo');
    expect(html).toContain('footer-brand');
  });
});
