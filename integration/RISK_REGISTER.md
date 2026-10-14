# FarmShield Integration: Risk Register
**Document Version:** 1.0.0  
**Status:** Active Risk Evaluation & Mitigation Matrix  
**Date:** 2026-10-11  

---

## 1. Risk Register Matrix

| Risk ID | Category | Description | Likelihood | Impact | Severity | Mitigation Strategy |
| :---: | :---: | :--- | :---: | :---: | :---: | :--- |
| **R-01** | **Database** | MongoDB connection failure when running in environments without a local MongoDB service or active Atlas connection. | High | High | **High** | The backend is configured to start in degraded mode when MongoDB is unreachable (`settings.APP_ENV != "production"`), returning clear HTTP 503 errors. The frontend maintains verified offline/demo adapters with visible indicators (`Demo Mode` badge). |
| **R-02** | **Security** | Accidental exposure of secrets (Groq API keys, Pinecone keys, JWT secret, Twilio credentials) in frontend source code, client builds, or Git commits. | Medium | Critical | **Critical** | All external provider keys remain strictly in backend server environment (`backend/.env`). Frontend `.env.example` documents only public `VITE_` variables. Add `.env` and `backend/.env` to `.gitignore`. Never commit credentials. |
| **R-03** | **Auth / CORS** | Cross-Origin Request Block (CORS) or 401 Unauthorized errors when frontend attempts to communicate with FastAPI on port 8000. | Low | High | **Medium** | FastAPI `main.py` has `CORSMiddleware` configured with `settings.CORS_ORIGINS` (`http://localhost:5173`, `http://127.0.0.1:5173`). In addition, `vite.config.js` provides development reverse-proxying of `/api` directly to `http://localhost:8000`. |
| **R-04** | **Data Integrity** | Mismatch between frontend's static 37 crop IDs and backend's scientific storage profile IDs (`crop_storage_profiles.json`). | Medium | Medium | **Medium** | Implement a flexible crop matching adapter (`src/utils/cropMatcher.js` / backend `/api/v1/crops/match`) that resolves crops by name, category, and alias, preventing broken relationships when creating storage batches. |
| **R-05** | **AI Availability** | Groq API rate limits, network outages, or unconfigured keys causing AI assistant failures. | Medium | Medium | **Medium** | Backend `ChatbotService` catches Groq exceptions and falls back gracefully to structured ICAR ITK advisory answers. The frontend displays informative messages without crashing or exposing stack traces. |
| **R-06** | **Storage Risk Rules** | False positive or duplicate alerts flooding the user during repeated telemetry ingestion. | Low | Medium | **Low** | `MonitoringService` implements rule debouncing and check-in deduplication. Thresholds conform to ICAR standard safe storage parameters. Violations are marked as potential risk alerts, not guaranteed crop spoilage. |
| **R-07** | **Regression** | Overwriting existing farmer verification modal, logo branding, or voice speech features during the merge. | Low | High | **Medium** | Existing components (`Logo.jsx`, `ProfileControl.jsx`, `AIAssistantPage.jsx`) are preserved and extended rather than replaced. Existing 68 frontend tests and 50 backend tests run continuously to prevent regressions. |

---

## 2. Monitoring & Escalation Procedures
1. **Pre-flight Checks:** Before any build or commit, execute both `npm test` and `pytest backend/tests`.
2. **Build Verification:** Run `npm run build` to verify clean static bundling and import graph resolution.
3. **Environment Audit:** Verify that no real secret strings match patterns `gsk_`, `pcsk_`, `AC...` in any frontend source file.
