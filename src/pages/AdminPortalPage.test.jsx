// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext.jsx';
import AdminPortalPage from './AdminPortalPage.jsx';

function renderAdminPage() {
  return render(
    <MemoryRouter>
      <LanguageProvider initialLanguage="en">
        <AdminPortalPage />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('AdminPortalPage component', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders heading and main diagnostic sections', () => {
    renderAdminPage();
    expect(screen.getByRole('heading', { name: /system health & administration/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /external service integrations/i })).toBeTruthy();
  });

  it('renders database and system status indicators', () => {
    renderAdminPage();
    expect(screen.getAllByText(/mongodb database/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/total farmers/i)).toBeTruthy();
    expect(screen.getByText(/active batches/i)).toBeTruthy();
  });

  it('displays external integrations', () => {
    renderAdminPage();
    expect(screen.getByText(/groq llm reasoning/i)).toBeTruthy();
    expect(screen.getByText(/open-meteo/i)).toBeTruthy();
    expect(screen.getByText(/agricultural market prices/i)).toBeTruthy();
  });
});
