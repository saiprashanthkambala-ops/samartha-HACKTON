# FarmShield Integration: API Mapping Specification
**Document Version:** 1.0.0  
**Status:** Verified Endpoint Mapping  
**Date:** 2026-10-11  

---

## 1. Overview
All backend endpoints are rooted at `/api/v1` under FastAPI. The frontend API client communicates via Vite development proxy (`/api` -> `http://localhost:8000`) or direct base URL configuration (`VITE_API_BASE_URL=http://localhost:8000/api/v1`).

Every successful response wraps its payload in the standard `APIResponse[T]` envelope:
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... },
  "meta": { ... }
}
```

---

## 2. Comprehensive Endpoint Mapping

### 2.1 System Health & Readiness
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Check System Health | `GET` | `/api/v1/health` | None | No | `HealthStatus` (`status`, `database_connected`, `services`) |
| Check API Readiness | `GET` | `/api/v1/ready` | None | No | `{"ready": true, "app": "FarmShield API"}` |

### 2.2 Authentication & User Profiles
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Farmer Registration | `POST` | `/api/v1/auth/register` | `UserRegister` (`email`, `password`, `full_name`, `preferred_language`, `phone_number`, `village_or_location`) | No | `APIResponse[Token]` (`access_token`, `token_type`, `user`) |
| Farmer Login | `POST` | `/api/v1/auth/login` | `UserLogin` (`email`, `password`, `login_as: "farmer"|"admin"`) | No | `APIResponse[Token]` (`access_token`, `token_type`, `user`) |
| Get Current Profile | `GET` | `/api/v1/auth/me` | None | Bearer Token | `APIResponse[UserOut]` (`id`, `email`, `full_name`, `role`, `preferred_language`, etc.) |
| Update Profile | `PATCH` | `/api/v1/auth/me` | `UserUpdate` (`full_name`, `preferred_language`, `phone_number`, `village_or_location`) | Bearer Token | `APIResponse[UserOut]` |
| Farmer Logout | `POST` | `/api/v1/auth/logout` | None | Bearer Token | `APIResponse[dict]` (`user_id`) |

### 2.3 Crop Storage Reference Profiles
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| List Crop Profiles | `GET` | `/api/v1/crops` | `category?: string`, `search?: string` | No | `APIResponse[list[CropProfileOut]]` |
| Get Crop Profile | `GET` | `/api/v1/crops/{crop_id}` | Path: `crop_id` | No | `APIResponse[CropProfileOut]` |
| Match Optimal Profile | `POST` | `/api/v1/crops/match` | `CropSelectionQuery` (`crop_name`, `variety`, `crop_form`, `storage_type`, `region`) | No | `APIResponse[CropSelectionMatchResult]` |

### 2.4 Storage Batches Management
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Create Storage Batch | `POST` | `/api/v1/batches` | `StorageBatchCreate` (`crop_id`, `custom_batch_name`, `quantity_kg`, `harvest_date`, `storage_start_date`, `storage_structure_type`, `storage_location`, `initial_crop_condition`, `notes`) | Bearer Token | `APIResponse[StorageBatchOut]` |
| List Farmer Batches | `GET` | `/api/v1/batches` | Query: `status?: "active"|"closed"` | Bearer Token | `APIResponse[list[StorageBatchOut]]` |
| Get Batch Details | `GET` | `/api/v1/batches/{batch_id}` | Path: `batch_id` | Bearer Token | `APIResponse[StorageBatchOut]` |
| Update Storage Batch | `PATCH` | `/api/v1/batches/{batch_id}` | `StorageBatchUpdate` | Bearer Token | `APIResponse[StorageBatchOut]` |
| Close Storage Batch | `POST` | `/api/v1/batches/{batch_id}/close`| Path: `batch_id` | Bearer Token | `APIResponse[StorageBatchOut]` |

### 2.5 Storage Sensor Telemetry & Ingestion
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Ingest Sensor Reading | `POST` | `/api/v1/batches/{batch_id}/readings` | `SensorReadingCreate` (`temperature_c`, `relative_humidity_percent`, `grain_moisture_percent?`, `co2_ppm?`, `device_id?`) | Bearer Token | `APIResponse[SensorReadingOut]` |
| List Batch Readings | `GET` | `/api/v1/batches/{batch_id}/readings` | Query: `limit?: int` (default 50) | Bearer Token | `APIResponse[list[SensorReadingOut]]` |
| Get Monitoring Summary | `GET` | `/api/v1/batches/{batch_id}/monitoring` | Path: `batch_id` | Bearer Token | `APIResponse[MonitoringSummaryOut]` |

### 2.6 Storage Risk Alerts & Notifications
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Get Notification Prefs| `GET` | `/api/v1/alerts/preferences` | None | Bearer Token | `APIResponse[NotificationPreferencesUpdate]` |
| Update Notification Prefs| `PUT` | `/api/v1/alerts/preferences` | `NotificationPreferencesUpdate` (`enable_whatsapp_alerts`, `whatsapp_phone_number`, `alert_severity_threshold`) | Bearer Token | `APIResponse[NotificationPreferencesUpdate]` |
| List Storage Alerts | `GET` | `/api/v1/alerts` | Query: `batch_id?: string`, `status?: "active"|"acknowledged"|"resolved"` | Bearer Token | `APIResponse[list[StorageAlertOut]]` |
| Update Alert Status | `PATCH` | `/api/v1/alerts/{alert_id}` | `AlertStatusUpdate` (`status: "acknowledged"|"resolved"`) | Bearer Token | `APIResponse[StorageAlertOut]` |
| Dispatch WhatsApp Alert| `POST` | `/api/v1/alerts/{alert_id}/dispatch-whatsapp` | Query: `phone_number?: string` | Bearer Token | `APIResponse[dict]` |

### 2.7 Farmer Diary
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Record Batch Diary | `POST` | `/api/v1/batches/{batch_id}/diary` | `DiaryEntryCreate` (`observation_text`, `observation_category`, `photo_urls`, `voice_recording_url`, `voice_transcript`, `severity_assessment`, `provenance`) | Bearer Token | `APIResponse[DiaryEntryOut]` |
| List Batch Diary | `GET` | `/api/v1/batches/{batch_id}/diary` | Path: `batch_id` | Bearer Token | `APIResponse[list[DiaryEntryOut]]` |
| Get Diary Entry | `GET` | `/api/v1/diary/{entry_id}` | Path: `entry_id` | Bearer Token | `APIResponse[DiaryEntryOut]` |
| Update Diary Entry | `PATCH` | `/api/v1/diary/{entry_id}` | `DiaryEntryUpdate` | Bearer Token | `APIResponse[DiaryEntryOut]` |
| Delete Diary Entry | `DELETE`| `/api/v1/diary/{entry_id}` | Path: `entry_id` | Bearer Token | `APIResponse[dict]` |

### 2.8 AI Advisory & Storage Chatbot
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Start Conversation | `POST` | `/api/v1/chat/conversations` | `ConversationCreate` (`batch_id?: string`, `crop_name?: string`, `language?: string`) | Bearer Token | `APIResponse[ConversationOut]` |
| List Conversations | `GET` | `/api/v1/chat/conversations` | None | Bearer Token | `APIResponse[list[ConversationOut]]` |
| Get Conversation Msgs | `GET` | `/api/v1/chat/conversations/{id}/messages` | Path: `conversation_id` | Bearer Token | `APIResponse[list[ChatMessageOut]]` |
| Post Chat Message | `POST` | `/api/v1/chat/conversations/{id}/messages` | `ChatMessageCreate` (`message: string`, `batch_id?: string`, `language?: string`) | Bearer Token | `APIResponse[ChatMessageOut]` |

### 2.9 Weather Services
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Get Location Weather | `GET` | `/api/v1/weather` | Query: `location?: string` | Bearer Token | `APIResponse[WeatherReportOut]` |
| Get Batch Weather | `GET` | `/api/v1/batches/{batch_id}/weather` | Path: `batch_id` | Bearer Token | `APIResponse[WeatherReportOut]` |

### 2.10 Agricultural Market Prices
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Get Mandi Prices | `GET` | `/api/v1/market/prices` | Query: `crop: string`, `state?: string`, `district?: string`, `limit?: int`, `skip?: int` | Bearer Token | `APIResponse[MarketPriceReportOut]` |
| Get Batch Market Prices| `GET` | `/api/v1/batches/{batch_id}/market` | Path: `batch_id`, Query: `state?: string`, `district?: string` | Bearer Token | `APIResponse[MarketPriceReportOut]` |

### 2.11 Media Uploads
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Upload Image Asset | `POST` | `/api/v1/uploads` | Form Data: `file: UploadFile`, `folder?: string` | Bearer Token | `APIResponse[ImageUploadOut]` |
| Upload Storage Status | `GET` | `/api/v1/uploads/status` | None | Bearer Token | `APIResponse[dict]` |

### 2.12 Speech & Translation Services
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Transcribe Audio | `POST` | `/api/v1/speech/transcribe` | Form Data: `file: UploadFile` | Bearer Token | `APIResponse[TranscriptionResponse]` |
| Translate Dynamic Text| `POST` | `/api/v1/translation` | `TranslationRequest` (`text`, `target_language`, `source_language?`) | Bearer Token | `APIResponse[TranslationResult]` |

### 2.13 Admin Management
| Frontend Operation | HTTP Method | Backend Endpoint | Request Payload / Params | Auth Required | Response Schema |
| :--- | :---: | :--- | :--- | :---: | :--- |
| Admin Dashboard Status| `GET` | `/api/v1/admin/dashboard` | None | Bearer Token (Role: admin) | `APIResponse[AdminDashboardSummary]` |
| List Registered Users | `GET` | `/api/v1/admin/users` | None | Bearer Token (Role: admin) | `APIResponse[list[dict]]` |
