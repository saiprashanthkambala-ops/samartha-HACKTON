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
    location: 'Demo Farm, Guntur District',
    observedAt: new Date().toISOString(),
    temperatureC: 29,
    condition: 'Partly cloudy',
    humidityPercent: 64,
    rainChancePercent: 20,
    windKph: 12,
  };
}

const DEMO_FORECAST_PATTERN = [
  { tempMaxC: 31, tempMinC: 23, condition: 'Sunny', rainMm: 0, rainChancePercent: 5 },
  { tempMaxC: 30, tempMinC: 23, condition: 'Partly cloudy', rainMm: 1.2, rainChancePercent: 25 },
  { tempMaxC: 28, tempMinC: 22, condition: 'Light showers', rainMm: 4.5, rainChancePercent: 60 },
  { tempMaxC: 27, tempMinC: 22, condition: 'Thunderstorms', rainMm: 11.8, rainChancePercent: 75 },
  { tempMaxC: 29, tempMinC: 23, condition: 'Cloudy', rainMm: 0.4, rainChancePercent: 30 },
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
        title: 'Heat advisory (demo)',
        body: 'Daytime temperatures may feel stressful for newly transplanted seedlings over the next two days. Consider light evening irrigation.',
      },
      {
        id: 'demo-rain-1',
        severity: 'info',
        title: 'Rain expected mid-week (demo)',
        body: 'The demo forecast shows showers on days 3–4. Delay fertilizer application if heavy rain is confirmed by your local provider.',
      },
    ],
  };
}

export function demoWeatherInsights() {
  return {
    isDemo: true,
    summary:
      'Demo interpretation: the sample forecast shows a warm week with a mid-week wet spell. Transplanted crops may benefit from the moisture, but waterlogging risk should be watched in heavy soils.',
    supportingData: 'Based on the demo forecast only — no live provider is connected.',
    uncertainty:
      'Forecast skill decreases after day 3; treat later days as indicative only.',
    nextSteps: 'Check the live forecast from your provider before irrigation scheduling.',
  };
}

/** Crop-suitability note for the demo forecast (clearly illustrative). */
export function demoCropSuitability(cropId) {
  return {
    isDemo: true,
    cropId,
    status: 'suitable', // illustrative only — labelled DEMO in the UI
    explanation:
      'Illustrative demo assessment: the sample forecast temperatures fall within a commonly suitable range for this crop. This is NOT a verified agronomic analysis.',
    scorePercent: 72,
  };
}

export function demoCropWeatherImpact(cropIds) {
  const notes = [
    'Demo note: warm days support vegetative growth; watch moisture.',
    'Demo note: mid-week showers may reduce irrigation need.',
    'Demo note: humid spells increase foliar disease risk.',
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
    market: 'Demo Mandi, Guntur',
    reportedAt: dateDaysFromNow(0),
    unit: '₹/quintal',
    grade: 'FAQ (demo)',
    source: 'Demo dataset (not a live mandi feed)',
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
      description: 'Transplanted onion seedlings in the north plot (demo entry).',
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
      description: 'Drip irrigation run for 2 hours in the tomato bed (demo entry).',
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
      description: 'Observed a few aphids on young okra plants — scouting again in 3 days (demo entry).',
      quantity: null,
      unit: null,
      expense: null,
      notes: 'No spray applied yet.',
      isDemo: true,
    },
    {
      id: 'demo-4',
      date: dateDaysFromNow(-8),
      activityType: 'fertilizer',
      cropId: 'paddy',
      description: 'Top-dressed nitrogen fertilizer in the main paddy field (demo entry).',
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
      description: 'Harvested two banana bunches for the local market (demo entry).',
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
      description: 'Purchased seed and nursery trays (demo entry).',
      quantity: null,
      unit: null,
      expense: 850,
      notes: 'Receipt kept in the file.',
      isDemo: true,
    },
    {
      id: 'demo-7',
      date: dateDaysFromNow(-18),
      activityType: 'note',
      cropId: null,
      description: 'Soil test sample sent to the district lab (demo entry).',
      quantity: null,
      unit: null,
      expense: null,
      notes: 'Expect results in two weeks.',
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
    summary:
      'This is a static demonstration answer because the FarmShield AI backend is not connected.',
    observations: [
      'Demo observation: post-harvest losses are often caused by moisture and poor ventilation rather than storage duration alone.',
    ],
    actions: [
      'Demo action: cure and dry harvested bulbs/tubers before long storage.',
      'Demo action: inspect stored produce weekly and remove damaged pieces.',
    ],
    avoid: ['Demo caution: do not seal fresh produce in airtight plastic.'],
    sources: [],
    uncertainty:
      'No live model or agronomic database was consulted. Connect the backend AI endpoint for real answers.',
    followups: [
      'What ventilation is needed for my storage room?',
      'How do I know if my produce has started to rot?',
    ],
    followupsTe: [
      'నా నిల్వ గదికి ఎంత గాలి ప్రసరణ అవసరం?',
      'నా ఉత్పత్తి కుళ్ళడం మొదలైందో ఎలా తెలుసుకోవాలి?',
    ],
  };
}
