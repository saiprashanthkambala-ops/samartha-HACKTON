/**
 * FarmShield central API client.
 *
 * - Base URL from the PUBLIC env var VITE_API_BASE_URL (see .env.example).
 * - Normalised errors (network / timeout / http / parse).
 * - Request timeout via AbortController.
 * - NO secrets here. Components never build URLs themselves.
 */

const DEFAULT_TIMEOUT_MS = 15000;
const TOKEN_KEY = 'farmshield.token';

export class ApiError extends Error {
  constructor(kind, message, { status = 0, body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind; // 'network' | 'timeout' | 'http' | 'parse' | 'config'
    this.status = status;
    this.body = body;
  }
}

export function getBaseUrl() {
  const url = import.meta.env?.VITE_API_BASE_URL ?? '';
  return String(url).replace(/\/+$/, '');
}

/** True when a backend base URL has been configured. */
export function isApiConfigured() {
  return getBaseUrl().length > 0;
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // LocalStorage quota or access exception
  }
}

export function clearToken() {
  setToken(null);
}

/**
 * Low-level JSON request against the configured backend.
 * Automatically injects Bearer JWT authentication when available.
 * Unwraps standard FastAPI APIResponse[T] { success, message, data }.
 *
 * @param {string} path  Path from src/api/endpoints.js (must start with '/').
 */
export async function request(
  path,
  { method = 'GET', body, headers: customHeaders = {}, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = {}
) {
  const base = getBaseUrl();
  if (!base) {
    throw new ApiError('config', 'API base URL is not configured (VITE_API_BASE_URL).');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  if (signal) signal.addEventListener('abort', onAbort);

  const reqHeaders = {
    Accept: 'application/json',
    ...customHeaders,
  };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isFormData && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token && !reqHeaders['Authorization']) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: reqHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    let payload = null;
    const text = await res.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        throw new ApiError('parse', 'The server returned an unreadable response.', { status: res.status });
      }
    }

    if (!res.ok) {
      if (res.status === 401) {
        // Clear expired or invalidated session token
        clearToken();
      }
      const message =
        (payload && (payload.detail || payload.message || payload.error)) ||
        `Request failed with status ${res.status}.`;
      throw new ApiError('http', message, { status: res.status, body: payload });
    }

    if (payload && typeof payload === 'object' && payload.success === false) {
      throw new ApiError('http', payload.message || 'Request was not successful.', {
        status: res.status,
        body: payload,
      });
    }

    // Unwrap standard FastAPI APIResponse[T] envelope when present
    if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
      return payload.data;
    }

    return payload;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') {
      if (signal?.aborted) throw new ApiError('network', 'Request cancelled.');
      throw new ApiError('timeout', 'The request timed out. Please try again.');
    }
    throw new ApiError('network', 'Could not reach the server. Check your connection.');
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}
