# FarmShield — Integrated Agricultural Intelligence & Storage Platform

FarmShield is a comprehensive, full-stack agricultural management platform that pairs a rich, multi-lingual farmer-facing React application with a high-performance Python FastAPI intelligence and post-harvest storage backend.

It provides 37-crop catalogue guidance, live meteorological analysis, AGMARKNET market prices, private farmer diaries, Groq-powered AI agricultural advisory with ICAR ITK retrieval-augmented generation (RAG), and real-time post-harvest crop storage telemetry monitoring with automated risk alerting.

---

## 1. System Architecture

```text
FarmShield React UI (Vite + React 18, 8 Languages)
         |
         v
Centralized Frontend API Client (src/api/client.js)
         |
         v
FastAPI REST API (backend/app/main.py — http://localhost:8000/api/v1)
         |
         +--> Authentication & Farmers (/api/v1/auth) [JWT]
         +--> Crop Storage Profiles (/api/v1/crops) [ICAR Standards]
         +--> Post-Harvest Batches (/api/v1/batches)
         +--> Sensor Telemetry & Risk Detection (/api/v1/monitoring)
         +--> Farmer Diary Persistence (/api/v1/diary)
         +--> Groq AI & Pinecone RAG Assistant (/api/v1/chat)
         +--> Open-Meteo Weather Service (/api/v1/weather)
         +--> AGMARKNET Market Prices (/api/v1/market)
         +--> System Diagnostics & Integrations (/api/v1/admin)
         |
         v
MongoDB Database (Local / Atlas Cloud) + Configured External Providers
```

---

## 2. Directory Structure

```text
FarmShield/
├── src/                          # React Frontend Source
│   ├── api/                      # Centralized API client & endpoint contracts
│   ├── components/               # UI components (home, crop, weather, market, diary, layout)
│   ├── data/                     # 37-crop master catalogue & fallback datasets
│   ├── hooks/                    # Custom React hooks (useAsync, etc.)
│   ├── i18n/                     # 8 complete language dictionaries (en, hi, te, ta, kn, ml, mr, bn)
│   ├── pages/                    # Application page routes (Home, Crops, Storage, Weather, Market, Diary, AI, Admin)
│   ├── utils/                    # Crop matching adapter & helper routines
│   └── index.css                 # FarmShield design system & theme tokens
├── public/                       # Static public assets, verified farmer images & logos
├── backend/                      # FastAPI Python Backend
│   ├── app/                      # Application core, routers, schemas, services, monitoring
│   │   ├── api/v1/               # Versioned REST API endpoints
│   │   ├── core/                 # App configuration, security, database connectors
│   │   ├── integrations/         # Groq, Pinecone, Open-Meteo, AGMARKNET, Twilio, Cloudinary
│   │   ├── monitoring/           # ICAR post-harvest rule engine & threshold evaluation
│   │   ├── repositories/         # MongoDB collection repositories
│   │   ├── schemas/              # Pydantic v2 data models
│   │   └── main.py               # FastAPI entry point
│   ├── tests/                    # Automated Pytest suite (50 tests)
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Backend environment template
├── integration/                  # Master Integration Documentation
│   ├── PROJECT_ANALYSIS.md       # Full stack inspection & comparison report
│   ├── FEATURE_MAPPING.md        # 15-feature matrix with auth & persistence status
│   ├── API_MAPPING.md            # Endpoint contract and schema mappings
│   ├── RISK_REGISTER.md          # Security & technical risk mitigation register
│   └── TEST_REPORT.md            # Comprehensive test execution report
├── package.json                  # Frontend dependencies and npm scripts
├── vite.config.js                # Vite build and dev server configuration
└── README.md                     # This document
```

---

## 3. Quick Start (Windows PowerShell)

### Prerequisites
- Node.js (v18 or higher) and `npm`
- Python 3.10+ (tested on Python 3.13)
- MongoDB (Optional: backend gracefully degrades to cached demo mode if MongoDB is not running)

### Step 1: Backend Setup & Execution

Open a PowerShell terminal in the project root:

```powershell
# Navigate to backend
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt

# Copy environment template
Copy-Item .env.example .env

# Start FastAPI server on port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

FastAPI Interactive Swagger Docs: **http://localhost:8000/docs**

### Step 2: Frontend Setup & Execution

Open a second PowerShell terminal in the project root:

```powershell
# Install Node.js dependencies
npm install

# Copy environment template
Copy-Item .env.example .env

# Set backend URL in .env:
# VITE_API_BASE_URL=http://localhost:8000/api/v1

# Start Vite dev server
npm run dev
```

FarmShield Web Application: **http://localhost:5173**

---

## 4. Environment Variables

### Frontend (`.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base endpoint of FastAPI backend | `http://localhost:8000/api/v1` |
| `VITE_API_PROXY_TARGET` | Optional proxy target for dev server | `http://localhost:8000` |

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DATABASE_NAME` | Database collection name | `farmshield_db` |
| `JWT_SECRET_KEY` | Secure secret key for signing auth tokens | *(Generate with openssl)* |
| `GROQ_API_KEY` | Groq LLM API Key (LLaMA 3.3) | *(Optional: returns clear fallback if unset)* |
| `PINECONE_API_KEY` | Pinecone API Key for vector RAG | *(Optional)* |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID for WhatsApp alerts | *(Optional)* |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | *(Optional)* |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp sender number | *(Optional)* |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary storage for uploaded imagery | *(Optional)* |

---

## 5. Automated Testing

### Frontend Tests (Vitest)
```powershell
npm test
```
*Result: 12 test files passed, 78 tests passed (100%).*

### Frontend Linting (ESLint)
```powershell
npm run lint
```
*Result: 0 errors, 0 warnings.*

### Frontend Production Build (Vite)
```powershell
npm run build
```
*Result: Production bundle built cleanly into `dist/`.*

### Backend Tests (Pytest)
```powershell
backend\.venv\Scripts\python.exe -m pytest backend\tests -v
```
*Result: 50 tests passed across API, security regressions, and unit tests (100%).*

---

## 6. Key Application Areas

1. **Main Dashboard (`/`):** Hero section, quick crop cards, verified farmer stories carousel, 8-language switcher, and account auth modal.
2. **Crop Catalogue (`/crops`):** 37 verified crops across Fruits, Vegetables, Grains, and Cash Crops with ICAR growth stages, watering requirements, and quick facts.
3. **Crop Storage Monitoring (`/storage`):** Post-harvest storage batch management, live sensor telemetry gauges (temperature, relative humidity, grain moisture), ICAR threshold violation alerts with WhatsApp dispatch triggers, and ICAR ITK traditional storage techniques.
4. **Weather Analysis (`/weather`):** Open-Meteo meteorological forecasts, temperature/rainfall charts, and crop-specific adverse weather impact assessments.
5. **Market Prices (`/market-prices`):** AGMARKNET mandi arrival and modal prices with 7-day price trends and historical sparklines.
6. **Farmer Diary (`/farmer-diary`):** Persistent farm activity logbook supporting task tracking, expense recording, and harvest logs.
7. **AI Assistant (`/ai-assistant`):** Multi-turn conversational agricultural advisor powered by Groq LLaMA 3.3 with Pinecone ICAR ITK retrieval and voice speech synthesis.
8. **Admin Diagnostics (`/admin`):** Full-stack system health monitor detailing active batches, alerts, MongoDB connectivity, and third-party API integration status.

---

## 7. License & Credits

Developed for the Samartha Agricultural Technology Initiative. ICAR post-harvest storage profiles and indigenous technical knowledge (ITK) guidelines curated according to Indian Council of Agricultural Research published standards.
