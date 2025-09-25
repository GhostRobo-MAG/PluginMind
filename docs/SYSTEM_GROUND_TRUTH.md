# SYSTEM GROUND TRUTH

Last generated: 2025-09-12T06:07:52Z

## 1) Overview

PluginMind is a full-stack system composed of a Next.js App Router frontend (with NextAuth) and a FastAPI backend. Users sign in with Google via NextAuth; the frontend performs a one-time bind to the backend by posting a Google ID token through a Node runtime proxy. The backend verifies the Google token and issues an HttpOnly session cookie (`pm_session`). Thereafter, the frontend makes authenticated requests through the proxy, and the backend uses session-cookie authentication, enforces rate limits, logs queries, and orchestrates AI services (OpenAI for prompt optimization and Grok for analysis) with resilient HTTP utilities and structured logging.

Key flows: Sign-in and bind (one-time), steady-state requests using session cookies, AI processing (prompt optimization + analysis), background job processing for async analyses, and observability through correlation IDs and unified error handling.

## 2) System Context (C4 Level 1)

```mermaid
---
config:
  layout: elk
  look: handDrawn
  theme: base
---
flowchart TD
  User["End User"]
  Browser["Browser / Next.js App"]
  Proxy["Next.js API Proxy (Node)"]
  NextAuth["NextAuth"]
  Backend["FastAPI Backend"]
  DB[("Database")]
  OpenAI["OpenAI API"]
  Grok["xAI Grok API"]

  User --> Browser
  Browser --> NextAuth
  Browser --> Proxy
  Proxy --> Backend
  Backend --> DB
  Backend --> OpenAI
  Backend --> Grok
```

## 3) Containers (C4 Level 2)

```mermaid
---
config:
  layout: elk
  look: handDrawn
  theme: base
---
flowchart TD
  subgraph Frontend [Next.js App Router]
    N1[Pages/Routes]
    N2[NextAuth]
    N3[Custom Proxy Route]
  end

  subgraph API [FastAPI Application]
    A1[Routes: auth, analysis, users, jobs, health]
    A2[Middleware: auth, session_auth, cors, security_headers, request_limits, correlation_id, error_handler]
    A3[Services: analysis_service, openai_service, grok_service, user_service]
    A4[Utils: http, rate_limit, background_tasks]
    A5[Core: logging, config, session]
    A6[Models: database, schemas, enums]
  end

  subgraph Data[Persistence]
    DB[(SQLModel / SQLAlchemy DB)]
  end

  LLMs[External LLM Providers]

  Frontend --> API
  API --> DB
  API --> LLMs
```

## 4) Components (C4 Level 3)

Derived from imports and call sites in the codebase.

```mermaid
---
config:
  layout: elk
  look: handDrawn
  theme: base
---
flowchart TD
    %% API Routes
    analysis[app/api/routes/analysis.py] --> logging[app/core/logging.py]
    analysis --> dependencies[app/api/dependencies.py]
    analysis --> sessionAuth[app/middleware/session_auth.py]
    analysis --> rateDep[app/api/dependencies_rate_limit.py]
    analysis --> schemas[app/models/schemas.py]
    analysis --> analysisService[app/services/analysis_service.py]
    analysis --> userService[app/services/user_service.py]
    analysis --> backgroundTasks[app/utils/background_tasks.py]
    analysis --> exceptions[app/core/exceptions.py]
    analysis --> database[app/models/database.py]

    health[app/api/routes/health.py] --> logging
    health --> config[app/core/config.py]
    health --> schemas
    health --> dependencies

    jobs[app/api/routes/jobs.py] --> logging
    jobs --> dependencies
    jobs --> database

    queryLogs[app/api/routes/query_logs.py] --> logging
    queryLogs --> dependencies
    queryLogs --> database
    queryLogs --> schemas

    users[app/api/routes/users.py] --> logging
    users --> dependencies
    users --> sessionAuth[app/middleware/session_auth.py]
    users --> userService
    users --> schemas

    authRoute[app/api/routes/auth.py] --> session[app/core/session.py]
    authRoute --> authMW
    authRoute --> database
    authRoute --> logging

    %% Middleware
    authMW --> config
    authMW --> logging
    cors[middleware/cors.py] --> config
    cors --> logging
    errorHandler[middleware/error_handler.py] --> logging
    errorHandler --> exceptions
    requestLimits[middleware/request_limits.py] --> config
    requestLimits --> logging
    securityHeaders[middleware/security_headers.py] --> config
    correlationId[middleware/correlation_id.py] --> logging

    %% Services
    analysisService --> logging
    analysisService --> database
    analysisService --> openaiService[app/services/openai_service.py]
    analysisService --> grokService[app/services/grok_service.py]
    analysisService --> exceptions

    openaiService --> config
    openaiService --> logging
    openaiService --> exceptions
    openaiService --> ashPrompt[app/ash_prompt.py]
    openaiService --> httpUtil[app/utils/http.py]

    grokService --> config
    grokService --> logging
    grokService --> exceptions
    grokService --> httpUtil

    userService --> database
    userService --> logging

    %% Utilities
    httpUtil --> config
    httpUtil --> logging

    backgroundTasks --> logging
    backgroundTasks --> dbEngine[app/database.py]
    backgroundTasks --> database
    backgroundTasks --> enums[app/models/enums.py]
    backgroundTasks --> analysisService

    rateLimitUtil[app/utils/rate_limit.py] --> config
    rateLimitUtil --> logging

    %% Core/Models
    database --> enums
    schemas --> config
    dbEngine --> config
    dbEngine --> logging
    dbEngine --> database
    logging --> config
    logging --> correlationId
```

## 5) End-to-End User Journeys (Sequence Diagrams)

### 5.1 Sign‑in and Bind Flow

```mermaid
sequenceDiagram
  autonumber
  participant B as Browser (Next.js)
  participant N as NextAuth (frontend/src/auth.ts)
  participant P as Proxy (src/app/api/proxy/[...path]/route.ts)
  participant A as FastAPI Backend (app/api/routes/auth.py)
  participant S as Session (app/core/session.py)

  B->>N: Sign in with Google (NextAuth provider)
  Note over N: jwt callback → token.googleIdToken<br/>session callback → session.hasToken
  N-->>B: Session established (secure mode: no client tokens)
  B->>P: POST /api/proxy/auth/google<br/>(x-use-id-token=true, body={})
  P->>P: getToken({ req, secret }) → googleIdToken
  P->>P: Insert id_token into JSON body<br/>(skip Authorization header)
  P->>A: POST /auth/google { id_token }
  A->>A: verify_google_id_token_claims(token)<br/>(app/middleware/auth.py)
  A->>S: create_session_token(...),<br/>set_cookie(HttpOnly, SameSite=Lax)
  A-->>B: 200 { status: ok, user }<br/>+ Set-Cookie: pm_session
```

Implementations:
- NextAuth config/provider/callbacks: frontend/src/auth.ts (jwt/session callbacks)
- Proxy bind endpoint: frontend/src/app/api/proxy/[...path]/route.ts (lines around 50–101)
- Backend bind route: pluginmind_backend/app/api/routes/auth.py::google_auth
- Token verification: pluginmind_backend/app/middleware/auth.py::verify_google_id_token_claims
- Session issuance: pluginmind_backend/app/core/session.py::create_session_token, get_cookie_settings

### 5.2 Authenticated AI Request (Steady‑state)

```mermaid
sequenceDiagram
  autonumber
  participant B as Browser (pm_session present)
  participant P as Proxy (Node runtime)
  participant A as FastAPI (analysis route)
  participant US as user_service
  participant AS as analysis_service
  participant O as OpenAI service
  participant G as Grok service
  participant DB as DB

  B->>P: POST /api/proxy/process (credentials: include)
  P->>A: POST /process (forwards cookies, body)
  A->>A: Depends(get_session_user) validates pm_session
  A->>US: get_or_create_user(session, user_id)
  A->>US: check_query_limit(user)
  A->>AS: analyze_generic(user_input, type, user_id, analysis_id, session)
  AS->>O: process(prompt optimization)
  AS->>G: process(analysis)
  AS->>DB: store AnalysisResult (optional)
  A-->>B: 200 GenericAnalysisResponse
```

Implementations:
- Route: pluginmind_backend/app/api/routes/analysis.py::process_generic
- Session auth: pluginmind_backend/app/middleware/session_auth.py::get_session_user
- User mgmt: pluginmind_backend/app/services/user_service.py
- Orchestration: pluginmind_backend/app/services/analysis_service.py
- Outbound HTTP: pluginmind_backend/app/utils/http.py
- Models: pluginmind_backend/app/models/database.py

### 5.3 Background Task Lifecycle (Async)

```mermaid
sequenceDiagram
  autonumber
  participant B as Browser
  participant A as FastAPI (/analyze-async)
  participant BT as Background Tasks
  participant AS as Analysis Service
  participant DB as Database

  B->>A: POST /analyze-async
  A->>DB: Create AnalysisJob<br/>(status=QUEUED)
  A->>BT: asyncio.create_task(process_analysis_background(job_id, input))
  A-->>B: 200 { job_id, status: queued }

  BT->>DB: Update status=PROCESSING_OPENAI
  BT->>AS: perform_analysis(user_input)
  AS->>DB: Log results (if applicable)
  BT->>DB: Update status=COMPLETED or FAILED<br/>+ store results

  B->>A: GET /analyze-async/{job_id}
  A->>DB: Fetch job
  A-->>B: 200 JobResult
```

Implementations:
- Start job: pluginmind_backend/app/api/routes/analysis.py::start_async_analysis
- Background worker: pluginmind_backend/app/utils/background_tasks.py::process_analysis_background
- Job fetch: pluginmind_backend/app/api/routes/analysis.py::get_analysis_result
- Model: pluginmind_backend/app/models/database.py::AnalysisJob

## 6) Data Model & Persistence Map

- pluginmind_backend/app/models/database.py
  - AnalysisJob: async job tracking (job_id, status, timestamps, results, user_id)
  - User: basic account (email, subscription_tier, queries_used/limit, google_id)
  - QueryLog: per-request logging (user_input, optimized_prompt, ai_result, timings, costs)
  - AnalysisResult: generic analysis storage (analysis_id, analysis_type, user_input, result_data JSON, metadata JSON, status)

Relationships: See ERD in legacy SYSTEM_MAP and components diagram above. User foreign-key style refs are by value (google_id/email), not enforced FKs at DB level in code shown.

## 7) Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    User {
        int id PK
        string email
        datetime created_at
        string subscription_tier
        int queries_used
        int queries_limit
        string google_id
        bool is_active
    }

    AnalysisJob {
        int id PK
        string job_id
        string user_input
        JobStatus status
        datetime created_at
        datetime completed_at
        string optimized_prompt
        string analysis
        string error
        string user_id FK
        float cost
    }

    QueryLog {
        int id PK
        string user_id FK
        string user_input
        string optimized_prompt
        string ai_result
        datetime created_at
        int response_time_ms
        bool success
        string error_message
        float openai_cost
        float grok_cost
        float total_cost
    }

    JobStatus {
        string QUEUED
        string PROCESSING_OPENAI
        string PROCESSING_GROK
        string COMPLETED
        string FAILED
    }

    User ||--o{ AnalysisJob : "user_id"
    User ||--o{ QueryLog : "user_id"
    AnalysisJob ||--|| JobStatus : "status"
```

### Migrations (Alembic)

- Config and scripts:
  - pluginmind_backend/alembic.ini
  - pluginmind_backend/alembic/env.py
  - pluginmind_backend/alembic/versions/001_initial_pluginmind_schema.py (example version)
  - pluginmind_backend/scripts/manage_db.py (wraps revision/upgrade/downgrade/current/history)
- Usage (per README/docs):
  - Create revision: `alembic revision --autogenerate -m "msg"`
  - Upgrade: `alembic upgrade head`
  - Downgrade: `alembic downgrade -1`

## 7) Configuration & Feature Flags

- pluginmind_backend/app/core/config.py
  - Debug/testing toggles; HTTP client timeouts and retries; rate limit caps; AI provider models and API keys; CORS origins; Google OAuth client id; backend session secret validation.
- Frontend env (frontend/.env.local)
  - BACKEND_URL (proxy target): dev uses http://127.0.0.1:8000; prod should be https://api.example.com
  - NEXTAUTH_URL, NEXTAUTH_SECRET
  - NEXT_PUBLIC_USE_API_PROXY=true, NEXT_PUBLIC_SECURE_TOKENS=true (secure mode)
- Proxy (frontend/src/app/api/proxy/[...path]/route.ts)
  - Enforces Node runtime, reads only BACKEND_URL; injects id_token for /auth/google; forwards cookies and Set-Cookie; 502 only on thrown fetch.

[UNKNOWN]: Cookie domain for cross-subdomain deployments is not set in get_cookie_settings(); currently relies on default host scoping.

## 8) Observability & Reliability

- Correlation IDs: pluginmind_backend/app/middleware/correlation_id.py stores request_id in context; logging filter injects it into logs (app/core/logging.py).
- Error handling: pluginmind_backend/app/middleware/error_handler.py centralizes exception → code mapping and JSON shape; validation errors mapped to 422 with INVALID_INPUT.
- Rate limiting: token-bucket in-memory (app/utils/rate_limit.py) with dependency wrapper (app/api/dependencies_rate_limit.py) supporting user and IP keys.
- Outbound HTTP resilience: httpx AsyncClient with retries/backoff (app/utils/http.py); configurable limits from app/core/config.py.
- Security headers and body limits: middleware/security_headers.py, middleware/request_limits.py.

## 9) Open Questions / TODOs

- [UNKNOWN] Cookie domain strategy for prod with multiple subdomains (none set).
- [UNKNOWN] Background tasks scaling: current `asyncio.create_task` suggests single-process; no external queue/worker.
- TODO: In `frontend/src/services/api.service.ts`, prefer proxy baseURL in secure mode and remove localhost fallback for prod builds.

## Changelog

- 2025-09-12: Initial ground-truth document and diagrams generated; legacy SYSTEM_MAP marked deprecated.
- 2025-09-12: Updated to document Alembic migrations (config, env, versions, manage_db.py) and removed migrations [UNKNOWN].
