# 📡 API Reference

Every PluginMind backend endpoint is protected by structured logging, correlation IDs, and unified error envelopes. Authentication-sensitive routes require the `pm_session` cookie issued by `/auth/google`.

> Base URL: 
> - Local development → `http://localhost:8000`
> - Docker compose → `http://backend:8000`

Errors are returned as:
```json
{
  "error": {
    "message": "User-friendly message",
    "code": "HTTP_EXCEPTION",        // or AUTHENTICATION_FAILED, etc.
    "correlation_id": "uuid"
  }
}
```

---

## 🔁 Analysis

### POST `/process` (session cookie required)
Run generic AI processing workflows.

**Request body**
```json
{
  "user_input": "Summarise this article",
  "analysis_type": "document"   // optional, defaults to "crypto"
}
```

- `analysis_type` accepts `document`, `chat`, `seo`, `crypto`, `custom`.
- Unknown values return `422`.

**Response**
```json
{
  "analysis_type": "document",
  "optimized_prompt": "Optimised prompt ...",
  "analysis_result": "{\"summary\": \"...\"}",
  "system_prompt": "Document analysis system prompt ...",
  "services_used": {
    "prompt_optimizer": {
      "name": "OpenAI AI Service",
      "provider": "OpenAI",
      "model": "gpt-4o-mini"
    },
    "analyzer": {
      "name": "Grok AI Service",
      "provider": "xAI",
      "model": "grok-beta"
    }
  },
  "metadata": {}
}
```

Typical status codes: `200`, `401`, `422`, `429`, `500`.

### POST `/analyze` (legacy, session cookie required)
Backwards-compatible crypto analysis. Request body only needs `user_input`.

### POST `/analyze-async`
Create a background job. Accepts the same body as `/process` and returns:
```json
{
  "job_id": "uuid",
  "status": "queued",
  "created_at": "2025-09-18T16:12:00.123456",
  "message": "Analysis started. Use the job_id to check status."
}
```

### GET `/analyze-async/{job_id}`
Fetch job status and stored results.
```json
{
  "job_id": "uuid",
  "status": "processing_openai",
  "created_at": "...",
  "completed_at": null,
  "optimized_prompt": null,
  "analysis": null,
  "error": null
}
```

---

## 📚 Jobs & Logs

### GET `/jobs`
Returns a summary of stored async jobs.
```json
{
  "total_jobs": 3,
  "jobs": {
    "job-uuid": {
      "status": "completed",
      "created_at": "2025-09-18T16:05:41",
      "completed_at": "2025-09-18T16:05:46",
      "user_id": "test-google-id",
      "has_error": false
    }
  }
}
```

### DELETE `/jobs/{job_id}`
Removes a job from the database. Returns `{ "message": "Job ... deleted successfully" }` or `404`.

### GET `/query-logs`
Accepts `limit` (default 50) and optional `user_id` query parameters. Response uses the `QueryLogsResponse` schema with truncated inputs for readability.

---

## 👤 User APIs

### GET `/me`
Returns the SQLModel-backed user profile (creating one if necessary).
```json
{
  "id": 1,
  "email": "user@example.com",
  "google_id": "test-google-id",
  "subscription_tier": "free",
  "is_active": true,
  "created_at": "2025-04-13T08:29:19"
}
```

### GET `/me/usage`
Tracks monthly usage counters.
```json
{
  "queries_used": 2,
  "queries_limit": 10,
  "remaining_queries": 8,
  "subscription_tier": "free",
  "can_make_query": true
}
```

### GET `/users/profile`
JSON payload tailored for the Next.js frontend:
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": null,
    "picture": null,
    "role": "USER",
    "subscription_tier": "free",
    "created_at": "2025-04-13T08:29:19",
    "is_active": true
  }
}
```

---

## ❤️‍🔥 Authentication

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/auth/google` | POST | Body `{ "id_token": "..." }`. Sets `pm_session` cookie. |
| `/auth/logout` | POST | Clears `pm_session`. |
| `/auth/validate` | GET | Legacy bearer-token helper. |
| `/auth/me` | GET | Same as `/users/profile` but exposed under `/auth`. |

Refer to [Authentication Guide](../api/authentication.md) for flow details.

---

## 🩺 Health & Meta

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Returns app name, version, feature flags, and docs URL (only in debug). |
| `/health` | GET | `{ "status": "ok", "active_jobs": 1 }` with legacy in-memory job cleanup. |
| `/live` | GET | Always `{ "status": "live" }`. Suitable for liveness probes. |
| `/ready` | GET | Checks DB connectivity and environment variables. Returns `503` with structured detail if not ready. |
| `/services` | GET | Combined registry + health snapshot. |
| `/services/health` | GET | Raw registry health map from `analysis_service.health_check()`. |
| `/version` | GET | `{ "name": ..., "version": ..., "git_sha": ... }`. |

---

## 🚦 Status Codes at a Glance

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created (not currently used) |
| `401` | Missing/invalid `pm_session` cookie |
| `404` | Resource not found (e.g., jobs) |
| `422` | Validation errors (pydantic) |
| `429` | Rate limit exceeded (`Retry-After` header supplied) |
| `500` | Unhandled error (still wrapped in unified envelope) |

---

## 🧑‍💻 Tips for Integrators

- Always send requests with cookies (`fetch(..., { credentials: 'include' })`).
- Pass `X-Request-ID` if you have a correlation ID from the frontend—otherwise middleware will generate one.
- Use `/services` during boot to verify the OpenAI and Grok registrations before accepting traffic.
- Delete stale async jobs (e.g., from tests) via `DELETE /jobs/{job_id}`.

Happy hacking! 🤖
