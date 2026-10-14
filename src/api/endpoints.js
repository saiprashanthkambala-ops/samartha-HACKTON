/**
 * FarmShield backend endpoint map — VERIFIED CONTRACT.
 *
 * Mapped to the actual FastAPI backend service in backend/app/api/v1/router.py.
 * All paths are prefixed under /api/v1 by the backend router.
 */

export const ENDPOINTS = {
  health: {
    status: { method: 'GET', path: '/health', status: 'VERIFIED' },
    ready: { method: 'GET', path: '/ready', status: 'VERIFIED' },
  },
  auth: {
    register: { method: 'POST', path: '/auth/register', status: 'VERIFIED' },
    login: { method: 'POST', path: '/auth/login', status: 'VERIFIED' },
    me: { method: 'GET', path: '/auth/me', status: 'VERIFIED' },
    updateMe: { method: 'PATCH', path: '/auth/me', status: 'VERIFIED' },
    logout: { method: 'POST', path: '/auth/logout', status: 'VERIFIED' },
  },
  weather: {
    current: { method: 'GET', path: '/weather', status: 'VERIFIED' },
    batchWeather: { method: 'GET', path: '/batches/:batchId/weather', status: 'VERIFIED' },
  },
  market: {
    prices: { method: 'GET', path: '/market/prices', status: 'VERIFIED' },
    batchPrices: { method: 'GET', path: '/batches/:batchId/market', status: 'VERIFIED' },
  },
  crops: {
    catalogue: { method: 'GET', path: '/crops', status: 'VERIFIED' },
    details: { method: 'GET', path: '/crops/:id', status: 'VERIFIED' },
    match: { method: 'POST', path: '/crops/match', status: 'VERIFIED' },
  },
  batches: {
    list: { method: 'GET', path: '/batches', status: 'VERIFIED' },
    create: { method: 'POST', path: '/batches', status: 'VERIFIED' },
    get: { method: 'GET', path: '/batches/:id', status: 'VERIFIED' },
    update: { method: 'PATCH', path: '/batches/:id', status: 'VERIFIED' },
    close: { method: 'POST', path: '/batches/:id/close', status: 'VERIFIED' },
    readings: { method: 'GET', path: '/batches/:id/readings', status: 'VERIFIED' },
    ingestReading: { method: 'POST', path: '/batches/:id/readings', status: 'VERIFIED' },
    monitoring: { method: 'GET', path: '/batches/:id/monitoring', status: 'VERIFIED' },
  },
  alerts: {
    list: { method: 'GET', path: '/alerts', status: 'VERIFIED' },
    updateStatus: { method: 'PATCH', path: '/alerts/:id', status: 'VERIFIED' },
    preferences: { method: 'GET', path: '/alerts/preferences', status: 'VERIFIED' },
    updatePreferences: { method: 'PUT', path: '/alerts/preferences', status: 'VERIFIED' },
    dispatchWhatsapp: { method: 'POST', path: '/alerts/:id/dispatch-whatsapp', status: 'VERIFIED' },
  },
  diary: {
    batchList: { method: 'GET', path: '/batches/:batchId/diary', status: 'VERIFIED' },
    batchCreate: { method: 'POST', path: '/batches/:batchId/diary', status: 'VERIFIED' },
    get: { method: 'GET', path: '/diary/:id', status: 'VERIFIED' },
    update: { method: 'PATCH', path: '/diary/:id', status: 'VERIFIED' },
    delete: { method: 'DELETE', path: '/diary/:id', status: 'VERIFIED' },
  },
  ai: {
    conversations: { method: 'POST', path: '/chat/conversations', status: 'VERIFIED' },
    listConversations: { method: 'GET', path: '/chat/conversations', status: 'VERIFIED' },
    getConversation: { method: 'GET', path: '/chat/conversations/:id', status: 'VERIFIED' },
    messages: { method: 'GET', path: '/chat/conversations/:id/messages', status: 'VERIFIED' },
    sendMessage: { method: 'POST', path: '/chat/conversations/:id/messages', status: 'VERIFIED' },
  },
  uploads: {
    upload: { method: 'POST', path: '/uploads', status: 'VERIFIED' },
    status: { method: 'GET', path: '/uploads/status', status: 'VERIFIED' },
  },
  speech: {
    transcribe: { method: 'POST', path: '/speech/transcribe', status: 'VERIFIED' },
  },
  translation: {
    translate: { method: 'POST', path: '/translation', status: 'VERIFIED' },
  },
  admin: {
    dashboard: { method: 'GET', path: '/admin/dashboard', status: 'VERIFIED' },
    users: { method: 'GET', path: '/admin/users', status: 'VERIFIED' },
  },
};
