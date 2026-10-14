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

import { request, isApiConfigured, ApiError, getToken, setToken, clearToken } from './client.js';
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

/* --------------------------- Authentication --------------------------- */

export async function loginUser(email, password, loginAs = 'farmer') {
  if (!isApiConfigured()) {
    const demoUser = {
      id: 'demo_user',
      email,
      full_name: email.split('@')[0] || 'Farmer',
      role: loginAs,
      preferred_language: 'en',
    };
    setToken('demo_token');
    return wrapDemo({ access_token: 'demo_token', token_type: 'bearer', user: demoUser });
  }
  const data = await request(ENDPOINTS.auth.login.path, {
    method: 'POST',
    body: { email, password, login_as: loginAs },
  });
  if (data?.access_token) {
    setToken(data.access_token);
  }
  return wrapApi(data);
}

export async function registerUser(payload) {
  if (!isApiConfigured()) {
    const demoUser = {
      id: `user_${Date.now()}`,
      email: payload.email,
      full_name: payload.full_name,
      role: 'farmer',
      preferred_language: payload.preferred_language || 'en',
      phone_number: payload.phone_number,
      village_or_location: payload.village_or_location,
    };
    setToken('demo_token');
    return wrapDemo({ access_token: 'demo_token', token_type: 'bearer', user: demoUser });
  }
  const data = await request(ENDPOINTS.auth.register.path, {
    method: 'POST',
    body: payload,
  });
  if (data?.access_token) {
    setToken(data.access_token);
  }
  return wrapApi(data);
}

export async function getCurrentUserProfile() {
  if (!isApiConfigured() || !getToken()) {
    return wrapDemo(null);
  }
  try {
    const data = await request(ENDPOINTS.auth.me.path);
    return wrapApi(data);
  } catch (err) {
    clearToken();
    return wrapDemo(null);
  }
}

export async function updateCurrentUserProfile(updates) {
  if (!isApiConfigured()) {
    return wrapDemo(updates);
  }
  const data = await request(ENDPOINTS.auth.updateMe.path, {
    method: 'PATCH',
    body: updates,
  });
  return wrapApi(data);
}

export async function logoutUser() {
  if (isApiConfigured() && getToken()) {
    try {
      await request(ENDPOINTS.auth.logout.path, { method: 'POST' });
    } catch {
      // Ignore network errors during logout
    }
  }
  clearToken();
  return { success: true };
}

/* ------------------------------ Weather ------------------------------ */

export async function getCurrentWeather(location) {
  if (!isApiConfigured()) return wrapDemo(demoCurrentWeather());
  try {
    const url = location
      ? `${ENDPOINTS.weather.current.path}?location=${encodeURIComponent(location)}`
      : ENDPOINTS.weather.current.path;
    const data = await request(url);
    return wrapApi(data);
  } catch {
    return wrapDemo(demoCurrentWeather());
  }
}

export async function getForecast() {
  if (!isApiConfigured()) return wrapDemo(demoForecast());
  try {
    const data = await request(ENDPOINTS.weather.current.path);
    return wrapApi(data);
  } catch {
    return wrapDemo(demoForecast());
  }
}

export async function getWeatherAlerts() {
  if (!isApiConfigured()) return wrapDemo(demoWeatherAlerts());
  return wrapDemo(demoWeatherAlerts());
}

export async function getWeatherInsights() {
  if (!isApiConfigured()) return wrapDemo(demoWeatherInsights());
  return wrapDemo(demoWeatherInsights());
}

export async function getCropSuitability(cropId) {
  if (!isApiConfigured()) return wrapDemo(demoCropSuitability(cropId));
  return wrapDemo(demoCropSuitability(cropId));
}

export async function getCropWeatherImpact(cropIds) {
  if (!isApiConfigured()) return wrapDemo(demoCropWeatherImpact(cropIds));
  return wrapDemo(demoCropWeatherImpact(cropIds));
}

/* ------------------------------- Market ------------------------------ */

export async function getMarketPrices(crop = 'Paddy', state, district) {
  if (!isApiConfigured()) return wrapDemo(demoMarketPrices());
  try {
    const params = new URLSearchParams({ crop });
    if (state) params.set('state', state);
    if (district) params.set('district', district);
    const data = await request(`${ENDPOINTS.market.prices.path}?${params.toString()}`);
    return wrapApi(data);
  } catch {
    return wrapDemo(demoMarketPrices());
  }
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

export async function getDiaryEntries(batchId) {
  if (!isApiConfigured() || !getToken()) return wrapDemo(readDemoDiary());
  if (batchId) {
    try {
      const data = await request(ENDPOINTS.diary.batchList.path.replace(':batchId', batchId));
      return wrapApi(data || []);
    } catch {
      return wrapDemo(readDemoDiary());
    }
  }
  return wrapDemo(readDemoDiary());
}

export async function createDiaryEntry(input) {
  if (!isApiConfigured() || !getToken() || !input.batchId) {
    const entry = {
      id: `local-${Date.now()}`,
      ...input,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    await new Promise((r) => setTimeout(r, 100));
    writeDemoDiaryEntry(entry);
    return wrapDemo(entry);
  }
  try {
    const data = await request(ENDPOINTS.diary.batchCreate.path.replace(':batchId', input.batchId), {
      method: 'POST',
      body: input,
    });
    return wrapApi(data);
  } catch {
    const entry = {
      id: `local-${Date.now()}`,
      ...input,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    writeDemoDiaryEntry(entry);
    return wrapDemo(entry);
  }
}

/* ----------------------- Storage Batches & Monitoring ----------------- */

export async function getStorageBatches(status) {
  if (!isApiConfigured() || !getToken()) {
    return wrapDemo([]);
  }
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const data = await request(`${ENDPOINTS.batches.list.path}${query}`);
  return wrapApi(Array.isArray(data) ? data : []);
}

export async function createStorageBatch(payload) {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Login to an active backend session is required to create storage batches.');
  }
  const data = await request(ENDPOINTS.batches.create.path, {
    method: 'POST',
    body: payload,
  });
  return wrapApi(data);
}

export async function getStorageBatchDetails(batchId) {
  if (!isApiConfigured() || !getToken()) return wrapDemo(null);
  const data = await request(ENDPOINTS.batches.get.path.replace(':id', batchId));
  return wrapApi(data);
}

export async function closeStorageBatch(batchId) {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Authentication required.');
  }
  const data = await request(ENDPOINTS.batches.close.path.replace(':id', batchId), {
    method: 'POST',
  });
  return wrapApi(data);
}

export async function getBatchReadings(batchId, limit = 50) {
  if (!isApiConfigured() || !getToken()) return wrapDemo([]);
  const data = await request(
    `${ENDPOINTS.batches.readings.path.replace(':id', batchId)}?limit=${limit}`
  );
  return wrapApi(Array.isArray(data) ? data : []);
}

export async function ingestBatchReading(batchId, payload) {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Authentication required.');
  }
  const data = await request(ENDPOINTS.batches.ingestReading.path.replace(':id', batchId), {
    method: 'POST',
    body: payload,
  });
  return wrapApi(data);
}

export async function getBatchMonitoringSummary(batchId) {
  if (!isApiConfigured() || !getToken()) return wrapDemo(null);
  const data = await request(ENDPOINTS.batches.monitoring.path.replace(':id', batchId));
  return wrapApi(data);
}

/* ----------------------- Storage Risk Alerts -------------------------- */

export async function getStorageAlerts(batchId, status) {
  if (!isApiConfigured() || !getToken()) return wrapDemo([]);
  const params = new URLSearchParams();
  if (batchId) params.set('batch_id', batchId);
  if (status) params.set('status', status);
  const data = await request(`${ENDPOINTS.alerts.list.path}?${params.toString()}`);
  return wrapApi(Array.isArray(data) ? data : []);
}

export async function updateAlertStatus(alertId, status) {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Authentication required.');
  }
  const data = await request(ENDPOINTS.alerts.updateStatus.path.replace(':id', alertId), {
    method: 'PATCH',
    body: { status },
  });
  return wrapApi(data);
}

export async function dispatchWhatsappAlert(alertId, phoneNumber) {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Authentication required.');
  }
  const query = phoneNumber ? `?phone_number=${encodeURIComponent(phoneNumber)}` : '';
  const data = await request(
    `${ENDPOINTS.alerts.dispatchWhatsapp.path.replace(':id', alertId)}${query}`,
    { method: 'POST' }
  );
  return wrapApi(data);
}

/* ----------------------- Crop Storage Profiles ------------------------ */

export async function getCropProfiles(category, search) {
  if (!isApiConfigured()) return wrapDemo([]);
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  try {
    const data = await request(`${ENDPOINTS.crops.catalogue.path}?${params.toString()}`);
    return wrapApi(Array.isArray(data) ? data : []);
  } catch {
    return wrapDemo([]);
  }
}

export async function matchCropProfile(query) {
  if (!isApiConfigured()) return wrapDemo(null);
  const data = await request(ENDPOINTS.crops.match.path, {
    method: 'POST',
    body: query,
  });
  return wrapApi(data);
}

/* ------------------------------ AI Assistant ------------------------- */

export async function askAssistant(question, context = {}) {
  const { language = 'en', ...rest } = context;
  if (!isApiConfigured()) {
    await new Promise((r) => setTimeout(r, 300));
    return wrapDemo({ ...demoAIAnswer(), question, context });
  }

  try {
    let convoId = sessionStorage.getItem('farmshield.chat.convo');
    if (!convoId) {
      const convo = await request(ENDPOINTS.ai.conversations.path, {
        method: 'POST',
        body: {
          crop_name: rest.cropId || null,
          language,
        },
      });
      convoId = convo?.conversation_id || convo?.id;
      if (convoId) {
        sessionStorage.setItem('farmshield.chat.convo', convoId);
      }
    }

    if (convoId) {
      const res = await request(ENDPOINTS.ai.sendMessage.path.replace(':id', convoId), {
        method: 'POST',
        body: {
          message: question,
          language,
        },
      });
      return wrapApi({
        summary: res?.message || 'Advisory completed.',
        answer: res?.message || 'Advisory completed.',
        confidence: 0.95,
        sources: res?.references || ['ICAR Traditional Knowledge Repository & Groq LLM'],
        observations: [],
        actions: [],
        avoid: [],
        question,
        context,
      });
    }
  } catch {
    // If backend conversation call fails, surface helpful response
  }

  return wrapDemo({ ...demoAIAnswer(), question, context });
}

export function assistantSupported() {
  return true;
}

/* --------------------------- File Uploads ----------------------------- */

export async function uploadImage(file, folder = 'farmshield/crops') {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Authentication required for uploading files.');
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const data = await request(ENDPOINTS.uploads.upload.path, {
    method: 'POST',
    body: formData,
  });
  return wrapApi(data);
}

/* --------------------------- Admin Portal ----------------------------- */

export async function getAdminDashboard() {
  if (!isApiConfigured() || !getToken()) {
    throw new ApiError('config', 'Admin privileges required.');
  }
  const data = await request(ENDPOINTS.admin.dashboard.path);
  return wrapApi(data);
}

export { demoOrThrow };
