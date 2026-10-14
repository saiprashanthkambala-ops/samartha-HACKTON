// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext.jsx';
import StorageMonitoringPage from './StorageMonitoringPage.jsx';

function renderPage() {
  return render(
    <MemoryRouter>
      <LanguageProvider initialLanguage="en">
        <StorageMonitoringPage />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('StorageMonitoringPage component', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders heading and main storage sections', () => {
    renderPage();
    expect(screen.getAllByRole('heading', { name: /crop storage monitoring/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /active storage batches/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /traditional storage techniques/i })).toBeTruthy();
  });

  it('renders register new batch button', () => {
    renderPage();
    const btn = screen.getByRole('button', { name: /register new batch/i });
    expect(btn).toBeTruthy();
  });

  it('displays active batches and telemetry indicators', () => {
    renderPage();
    expect(screen.getByText(/sona masoori rabi harvest/i)).toBeTruthy();
    expect(screen.getByText(/nashik red rabi store/i)).toBeTruthy();
    expect(screen.getAllByText(/live sensor telemetry/i).length).toBeGreaterThan(0);
  });

  it('renders ICAR traditional preservation techniques', () => {
    renderPage();
    expect(screen.getByText(/pusa bin hermetic earthen granary/i)).toBeTruthy();
    expect(screen.getByText(/neem leaf & kernel layering/i)).toBeTruthy();
    expect(screen.getByText(/vegetable oil smearing technique/i)).toBeTruthy();
    expect(screen.getByText(/ventilated onion chawl/i)).toBeTruthy();
  });
});
