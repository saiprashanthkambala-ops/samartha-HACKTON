/**
 * FarmShield DEMO DATA adapter.
 *
 * Everything in this file is illustrative sample data for UI testing ONLY.
 * It is deliberately isolated here so it can be replaced by real backend API
 * operations (src/api/services.js) without rewriting UI components.
 *
 * RULES:
 * - Never present these values as live/verified data (UI shows a Demo badge).
 * - Dates are generated relative to "today" at runtime — no stale hard-coded dates.
 * - Missing values stay null ("Not available"), never zero/fake.
 */

const DAY = 24 * 60 * 60 * 1000;

export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function dateDaysFromNow(days) {
  return isoDate(new Date(Date.now() + days * DAY));
}

/* ----------------------------- Weather ------------------------------ */

export function demoCurrentWeather() {
  return {
    isDemo: true,
    location: 'demo.location',
    observedAt: new Date().toISOString(),
    temperatureC: 29,
    condition: 'demo.condition.partly-cloudy',
    humidityPercent: 64,
    rainChancePercent: 20,
    windKph: 12,
  };
}

const DEMO_FORECAST_PATTERN = [
  { tempMaxC: 31, tempMinC: 23, condition: 'demo.condition.sunny', rainMm: 0, rainChancePercent: 5 },
  { tempMaxC: 30, tempMinC: 23, condition: 'demo.condition.partly-cloudy', rainMm: 1.2, rainChancePercent: 25 },
  { tempMaxC: 28, tempMinC: 22, condition: 'demo.condition.light-showers', rainMm: 4.5, rainChancePercent: 60 },
  { tempMaxC: 27, tempMinC: 22, condition: 'demo.condition.thunderstorms', rainMm: 11.8, rainChancePercent: 75 },
  { tempMaxC: 29, tempMinC: 23, condition: 'demo.condition.cloudy', rainMm: 0.4, rainChancePercent: 30 },
];

export function demoForecast() {
  return {
    isDemo: true,
    days: DEMO_FORECAST_PATTERN.map((d, i) => ({
      date: dateDaysFromNow(i + 1),
      ...d,
    })),
  };
}

export function demoWeatherAlerts() {
  return {
    isDemo: true,
    alerts: [
      {
        id: 'demo-heat-1',
        severity: 'warning',
        title: 'demo.alert.heat.title',
        body: 'demo.alert.heat.body',
      },
      {
        id: 'demo-rain-1',
        severity: 'info',
        title: 'demo.alert.rain.title',
        body: 'demo.alert.rain.body',
      },
    ],
  };
}

export function demoWeatherInsights() {
  return {
    isDemo: true,
    summary: 'demo.insight.seasonal',
    supportingData: 'demo.insight.supporting',
    uncertainty: 'demo.insight.uncertainty',
    nextSteps: 'demo.insight.nextSteps',
  };
}

/** Crop-suitability note for the demo forecast (clearly illustrative). */
export function demoCropSuitability(cropId) {
  return {
    isDemo: true,
    cropId,
    status: 'suitable', // illustrative only — labelled DEMO in the UI
    explanation: 'demo.suitability.note',
    scorePercent: 72,
  };
}

export function demoCropWeatherImpact(cropIds) {
  const notes = [
    'demo.impact.1',
    'demo.impact.2',
    'demo.impact.3',
  ];
  return {
    isDemo: true,
    items: cropIds.map((id, i) => ({
      cropId: id,
      category: i === 2 ? 'watch' : 'favourable',
      note: notes[i % notes.length],
    })),
  };
}

/* ----------------------------- Market ------------------------------- */

/** Prices are illustrative structure only — NOT current market rates. */
const DEMO_PRICES = {
  onion: { price: 1800, prev: 1650 },
  tomato: { price: 1200, prev: 1320 },
  potato: { price: 1100, prev: 1100 },
  chilli: { price: 4500, prev: 4200 },
  carrot: { price: 2100, prev: 1980 },
  brinjal: { price: 1500, prev: 1560 },
  okra: { price: 2400, prev: 2250 },
  cabbage: { price: 950, prev: 990 },
};

export function demoMarketPrices() {
  return {
    isDemo: true,
    market: 'demo.market.name',
    reportedAt: dateDaysFromNow(0),
    unit: '₹/quintal',
    grade: 'demo.grade',
    source: 'demo.market.source',
    entries: Object.entries(DEMO_PRICES).map(([cropId, v]) => {
      // Deterministic tiny "history" for the demo sparkline.
      const history = [v.prev * 0.97, v.prev * 0.99, v.prev, (v.prev + v.price) / 2, v.price].map(
        (x) => Math.round(x)
      );
      return {
        cropId,
        price: v.price,
        previousPrice: v.prev,
        changePercent: v.prev ? Math.round(((v.price - v.prev) / v.prev) * 1000) / 10 : 0,
        history,
      };
    }),
    comparableMarkets: null, // not supported in demo mode
  };
}

/* ------------------------------ Diary ------------------------------- */

export const DEMO_ACTIVITY_TYPES = [
  'sowing',
  'fertilizer',
  'irrigation',
  'pest',
  'harvest',
  'expense',
  'note',
];

export function demoDiaryEntries() {
  return [
    {
      id: 'demo-1',
      date: dateDaysFromNow(-1),
      activityType: 'sowing',
      cropId: 'onion',
      description: 'demo.diary.1.desc',
      quantity: null,
      unit: null,
      expense: null,
      notes: null,
      isDemo: true,
    },
    {
      id: 'demo-2',
      date: dateDaysFromNow(-3),
      activityType: 'irrigation',
      cropId: 'tomato',
      description: 'demo.diary.2.desc',
      quantity: 2,
      unit: 'hours',
      expense: null,
      notes: null,
      isDemo: true,
    },
    {
      id: 'demo-3',
      date: dateDaysFromNow(-5),
      activityType: 'pest',
      cropId: 'okra',
      description: 'demo.diary.3.desc',
      quantity: null,
      unit: null,
      expense: null,
      notes: 'demo.diary.3.notes',
      isDemo: true,
    },
    {
      id: 'demo-4',
      date: dateDaysFromNow(-8),
      activityType: 'fertilizer',
      cropId: 'paddy',
      description: 'demo.diary.4.desc',
      quantity: 25,
      unit: 'kg',
      expense: 1200,
      notes: null,
      isDemo: true,
    },
    {
      id: 'demo-5',
      date: dateDaysFromNow(-12),
      activityType: 'harvest',
      cropId: 'banana',
      description: 'demo.diary.5.desc',
      quantity: 2,
      unit: 'bunches',
      expense: null,
      notes: null,
      isDemo: true,
    },
    {
      id: 'demo-6',
      date: dateDaysFromNow(-15),
      activityType: 'expense',
      cropId: 'tomato',
      description: 'demo.diary.6.desc',
      quantity: null,
      unit: null,
      expense: 850,
      notes: 'demo.diary.6.notes',
      isDemo: true,
    },
    {
      id: 'demo-7',
      date: dateDaysFromNow(-18),
      activityType: 'note',
      cropId: null,
      description: 'demo.diary.7.desc',
      quantity: null,
      unit: null,
      expense: null,
      notes: 'demo.diary.7.notes',
      isDemo: true,
    },
  ];
}

/* ------------------------------ AI ---------------------------------- */

/**
 * Static demonstration answer. NEVER presented as live AI output —
 * the UI shows a "Demo response" header on it.
 */
export function demoAIAnswer() {
  return {
    isDemo: true,
    summary: 'demo.ai.summary',
    observations: [
      'demo.ai.observation',
    ],
    actions: [
      'demo.ai.action1',
      'demo.ai.action2',
    ],
    avoid: ['demo.ai.caution'],
    sources: [],
    uncertainty: 'demo.ai.uncertainty',
    followups: ['demo.ai.followup1', 'demo.ai.followup2'],
  };
}