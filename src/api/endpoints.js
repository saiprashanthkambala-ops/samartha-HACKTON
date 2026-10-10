/**
 * FarmShield backend endpoint map — PROVISIONAL.
 *
 * The backend is developed separately (friend's responsibility) and NO API
 * specification was available in this repository at implementation time.
 * Every path below is therefore an INTEGRATION EXPECTATION, not a verified
 * contract. Update this file (only) once the real OpenAPI spec is available —
 * components must never hard-code URLs.
 *
 * Status legend: [PENDING-SPEC] = waiting for the friend's backend contract.
 */

export const ENDPOINTS = {
  weather: {
    current: { method: 'GET', path: '/weather/current', status: 'PENDING-SPEC' },
    forecast: { method: 'GET', path: '/weather/forecast', status: 'PENDING-SPEC' },
    alerts: { method: 'GET', path: '/weather/alerts', status: 'PENDING-SPEC' },
  },
  market: {
    prices: { method: 'GET', path: '/market/prices', status: 'PENDING-SPEC' },
  },
  diary: {
    list: { method: 'GET', path: '/diary/entries', status: 'PENDING-SPEC' },
    create: { method: 'POST', path: '/diary/entries', status: 'PENDING-SPEC' },
  },
  ai: {
    ask: { method: 'POST', path: '/ai/assistant', status: 'PENDING-SPEC' },
  },
  crops: {
    // The crop catalogue ships with the frontend (static verified IDs & images).
    // A backend catalogue can override/extend it through this endpoint later.
    catalogue: { method: 'GET', path: '/crops', status: 'PENDING-SPEC' },
    details: { method: 'GET', path: '/crops/:id', status: 'PENDING-SPEC' },
  },
};
