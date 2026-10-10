/**
 * FarmShield data services — the ONLY place that chooses between the real
 * backend API and the demo adapter.
 *
 * Contract rules:
 * - If VITE_API_BASE_URL is configured, the service calls the (provisional)
 *   endpoint from src/api/endpoints.js and returns { data, source: 'api' }.
 *   Failures surface as normalised ApiError objects — there is NO silent
 *   fallback to demo data that could be mistaken for live data.
 * - If no API is configured, the demo adapter supplies labelled sample data
 *   and the result carries source: 'demo' (UI renders a Demo badge).
 *
 * All endpoints are marked PENDING-SPEC until the friend's backend contract
 * (OpenAPI) is available. Do not treat any path as verified.
 */

import { request, isApiConfigured, ApiError } from './client.js';
import { ENDPOINTS } from './endpoints.js';
import {
  demoCurrentWeather,
  demoForecast,
  demoWeatherAlerts,
  demoWeatherInsights,
  demoCropSuitability,
  demoCropWeatherImpact,
  demoMarketPrices,
  demoDiaryEntries,
  demoAIAnswer,
} from '../data/demoData.js';

const wrapDemo = (data) => ({ data, source: 'demo' });
const wrapApi = (data) => ({ data, source: 'api' });

function demoOrThrow() {
  if (isApiConfigured()) {
    throw new ApiError('config', 'Backend endpoint not verified yet (PENDING-SPEC).');
  }
  return true;
}

/* ------------------------------ Weather ------------------------------ */

export async function getCurrentWeather() {
  if (!isApiConfigured()) return wrapDemo(demoCurrentWeather());
  const data = await request(ENDPOINTS.weather.current.path);
  return wrapApi(data);
}

export async function getForecast() {
  if (!isApiConfigured()) return wrapDemo(demoForecast());
  const data = await request(ENDPOINTS.weather.forecast.path);
  return wrapApi(data);
}

export async function getWeatherAlerts() {
  if (!isApiConfigured()) return wrapDemo(demoWeatherAlerts());
  const data = await request(ENDPOINTS.weather.alerts.path);
  return wrapApi(data);
}

export async function getWeatherInsights() {
  if (!isApiConfigured()) return wrapDemo(demoWeatherInsights());
  const data = await request(ENDPOINTS.weather.forecast.path);
  return wrapApi(data);
}

export async function getCropSuitability(cropId) {
  if (!isApiConfigured()) return wrapDemo(demoCropSuitability(cropId));
  const data = await request(`${ENDPOINTS.weather.forecast.path}?crop=${encodeURIComponent(cropId)}`);
  return wrapApi(data);
}

export async function getCropWeatherImpact(cropIds) {
  if (!isApiConfigured()) return wrapDemo(demoCropWeatherImpact(cropIds));
  const data = await request(
    `${ENDPOINTS.weather.forecast.path}?crops=${cropIds.map(encodeURIComponent).join(',')}`
  );
  return wrapApi(data);
}

/* ------------------------------- Market ------------------------------ */

export async function getMarketPrices() {
  if (!isApiConfigured()) return wrapDemo(demoMarketPrices());
  const data = await request(ENDPOINTS.market.prices.path);
  return wrapApi(data);
}

/* ------------------------------- Diary ------------------------------- */

const DEMO_DIARY_KEY = 'farmshield.diary.entries';

function readDemoDiary() {
  const base = demoDiaryEntries();
  let added = [];
  try {
    added = JSON.parse(localStorage.getItem(DEMO_DIARY_KEY) || '[]');
    if (!Array.isArray(added)) added = [];
  } catch {
    added = [];
  }
  return [...added, ...base].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function writeDemoDiaryEntry(entry) {
  let added = [];
  try {
    added = JSON.parse(localStorage.getItem(DEMO_DIARY_KEY) || '[]');
    if (!Array.isArray(added)) added = [];
  } catch {
    added = [];
  }
  added.unshift(entry);
  localStorage.setItem(DEMO_DIARY_KEY, JSON.stringify(added));
}

export async function getDiaryEntries() {
  if (!isApiConfigured()) return wrapDemo(readDemoDiary());
  const data = await request(ENDPOINTS.diary.list.path);
  return wrapApi(Array.isArray(data) ? data : data?.entries ?? []);
}

/**
 * Create a diary entry.
 * Demo mode persists to this browser's localStorage only (clearly labelled).
 */
export async function createDiaryEntry(input) {
  if (!isApiConfigured()) {
    const entry = {
      id: `local-${Date.now()}`,
      ...input,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    // Simulate a small async write; failure keeps user input in the form.
    await new Promise((r) => setTimeout(r, 250));
    writeDemoDiaryEntry(entry);
    return wrapDemo(entry);
  }
  const data = await request(ENDPOINTS.diary.create.path, { method: 'POST', body: input });
  return wrapApi(data);
}

/* ------------------------------ AI ----------------------------------- */

/**
 * Send a question to the FarmShield AI assistant.
 * `context` may include { cropId, language } — `language` is the selected
 * UI language code and is forwarded so the service answers in the same
 * language (API_CONTRACT.md: body { question, language, context }).
 */
export async function askAssistant(question, context = {}) {
  const { language = 'en', ...rest } = context;
  if (!isApiConfigured()) {
    await new Promise((r) => setTimeout(r, 400));
    return wrapDemo({ ...demoAIAnswer(), question, context });
  }
  const data = await request(ENDPOINTS.ai.ask.path, {
    method: 'POST',
    body: { question, language, context: rest },
  });
  return wrapApi(data);
}

export function assistantSupported() {
  // Until the backend contract is verified, AI runs in labelled demo mode
  // when no API is configured. With an API configured it is attempted live.
  return true;
}

export { demoOrThrow };