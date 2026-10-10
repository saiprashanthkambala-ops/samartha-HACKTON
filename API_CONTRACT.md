# FarmShield — frontend ↔ backend API contract (PROVISIONAL)

**Status: no backend API specification was available in this repository at
implementation time.** Everything below maps each frontend capability to the
operation it expects from the friend's backend. **No path is verified.** When
the real OpenAPI spec arrives, update `src/api/endpoints.js` (and only that
file) — UI components never build requests themselves.

Authentication: none assumed. When the backend defines auth, attach it in
`src/api/client.js` per the real contract (e.g. header scheme) — never in
components, never with secrets in frontend code.

All requests: `Accept: application/json`, JSON bodies, base URL from the
**public** env var `VITE_API_BASE_URL`. Errors should return
`{ "message": "..." }` (or `{ "error": "..." }`) with a meaningful HTTP status.

## Capability map

| # | Frontend capability | UI location | Expected operation | Provisional path | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Current weather | Weather page, Crop details | Get current conditions for location | `GET /weather/current` | PENDING-SPEC |
| 2 | 5-day forecast | Weather page, charts | Get daily forecast | `GET /weather/forecast` | PENDING-SPEC |
| 3 | Weather alerts | Weather page | Get active alerts | `GET /weather/alerts` | PENDING-SPEC |
| 4 | Crop suitability | Crop details | Suitability analysis for a crop | `GET /weather/forecast?crop={id}` | PENDING-SPEC (analysis semantics owned by backend) |
| 5 | Market prices | Market page, Crop details | Get reported prices | `GET /market/prices` | PENDING-SPEC |
| 6 | Diary entries (read) | Diary page | List diary entries | `GET /diary/entries` | PENDING-SPEC |
| 7 | Diary entries (write) | Diary form | Create diary entry | `POST /diary/entries` | PENDING-SPEC |
| 8 | AI assistant | AI page, Crop AI Advisory, recommendation card | Ask a question (with optional context) | `POST /ai/assistant` | PENDING-SPEC |
| 9 | Crop catalogue | All pages | Optional backend override of the frontend catalogue | `GET /crops`, `GET /crops/{id}` | PENDING-SPEC (frontend ships a static catalogue meanwhile) |
| 10 | Authentication / profile | Header profile control | Sign-in + profile | *undefined* | BACKEND-DEPENDENCY |

## Expected shapes (frontend's current consumption)

These are the fields the frontend reads today (demo adapter mirrors them).
If the backend returns different shapes, adjust `src/api/services.js` mapping —
not the components.

### `GET /weather/current`
```json
{
  "location": "string",
  "observedAt": "ISO datetime",
  "temperatureC": 29,
  "condition": "Partly cloudy",
  "humidityPercent": 64,
  "rainChancePercent": 20,
  "windKph": 12
}
```

### `GET /weather/forecast`
```json
{
  "days": [
    { "date": "YYYY-MM-DD", "tempMaxC": 31, "tempMinC": 23,
      "condition": "Sunny", "rainMm": 0, "rainChancePercent": 5 }
  ]
}
```

### `GET /weather/alerts`
```json
{
  "alerts": [
    { "id": "string", "severity": "warning|error|info",
      "title": "string", "body": "farmer-friendly explanation" }
  ]
}
```

### `GET /market/prices`
```json
{
  "market": "string",
  "reportedAt": "YYYY-MM-DD",
  "unit": "₹/quintal",
  "grade": "string",
  "source": "string",
  "entries": [
    { "cropId": "onion", "price": 1800, "previousPrice": 1650,
      "changePercent": 9.1, "history": [1700, 1750, 1750, 1775, 1800] }
  ],
  "comparableMarkets": null
}
```
Notes: `previousPrice`/`changePercent`/`history` are only rendered when present
(no invented trends). Prices are displayed with market, date, grade and unit.

### `GET /diary/entries` / `POST /diary/entries`
```json
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "activityType": "sowing|fertilizer|irrigation|pest|harvest|expense|note",
  "cropId": "onion | null",
  "description": "string",
  "quantity": 25, "unit": "kg",
  "expense": 1200,
  "notes": "string | null"
}
```
`GET` returns a JSON array (or `{ "entries": [...] }`). `POST` body is the
object without `id`; response should return the created entry.

### `POST /ai/assistant`
Request:
```json
{ "question": "string", "context": { "cropId": "onion" } }
```
Response:
```json
{
  "summary": "string",
  "observations": ["string"],
  "actions": ["string"],
  "avoid": ["string"],
  "sources": ["string"],
  "uncertainty": "string",
  "followups": ["string"]
}
```
Notes: no API keys in the frontend; the AI provider is backend-only. `sources`
must be genuine — the frontend displays them only when present.

## Frontend guarantees

- Loading / empty / validation / unauthorized / network / server-error states
  are handled on every data-driven view.
- With `VITE_API_BASE_URL` set, a failing request shows an honest error state —
  demo data is **never** silently mixed with API data.
- Without it, every demo surface is labelled with a `DEMO` badge.
- Diary form input is preserved when writes fail; success is only reported
  after the operation confirms.
- Missing values render "Not available"; missing assessments do **not** become
  "Suitable"; missing prices do **not** become made-up figures.

## Not implemented here (backend dependencies)

- Real authentication / farmer profile (header shows a neutral control).
- Real crop-suitability calculation (demo shows a labelled illustrative chip).
- Comparable-market prices, historical mandi series.
- Live AI answers (demo returns a clearly-labelled static answer).
