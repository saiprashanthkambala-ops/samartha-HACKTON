/**
 * FarmShield central API client.
 *
 * - Base URL from the PUBLIC env var VITE_API_BASE_URL (see .env.example).
 * - Normalised errors (network / timeout / http / parse).
 * - Request timeout via AbortController.
 * - NO secrets here. Components never build URLs themselves.
 */

const DEFAULT_TIMEOUT_MS = 15000;

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

/**
 * Low-level JSON request against the configured backend.
 * @param {string} path  Path from src/api/endpoints.js (must start with '/').
 */
export async function request(path, { method = 'GET', body, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = {}) {
  const base = getBaseUrl();
  if (!base) {
    throw new ApiError('config', 'API base URL is not configured (VITE_API_BASE_URL).');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  if (signal) signal.addEventListener('abort', onAbort);

  try {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
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
      const message =
        (payload && (payload.message || payload.error)) || `Request failed with status ${res.status}.`;
      throw new ApiError('http', message, { status: res.status, body: payload });
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
