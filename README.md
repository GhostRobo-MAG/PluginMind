# PluginMind – Production-Ready AI SaaS Full Stack Boilerplate
### 🚀 Build & Launch AI SaaS Faster

PluginMind is a **production-ready backend boilerplate** for AI-powered SaaS products.  
It gives you a secure, extensible foundation with **authentication, database integration, plugin-style AI registry, CI/CD, and 100+ automated tests** – everything you need to launch an AI product fast.

## 🧠 Background 

PluginMind started as **CoinGrok**, a crypto analysis tool powered by AI.  
But during development, we realized the real value wasn’t in the crypto wrapper – it was in the **backend engine** we built.

Instead of a narrow app, we pivoted and productized the **core system**:


[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-00a5ff.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.2+-black.svg)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![SQLModel](https://img.shields.io/badge/SQLModel-latest-green.svg)](https://sqlmodel.tiangolo.com)  
- 🔌 **Plugin-Style AI Registry** → add new LLMs in just a few lines.  
- 🛡️ **Secure Auth & Rate Limiting** → Google login, JWT, CORS, request limits.  
- 🗄️ **Database Integration** → Supabase & Postgres ready.  
- 🧪 **105+ Automated Tests** → integrated into CI/CD for reliability.  
- ⚡ **Production Infrastructure** → FastAPI, modular services, env configs.

This pivot turned CoinGrok into **PluginMind: a universal AI SaaS backend boilerplate**.

## 🧩 Example Use Cases

PluginMind can power **any AI SaaS product**, such as:
- 📊 Crypto Analyzer (original CoinGrok use case)  
- 📝 Document Summarizer SaaS  
- 🤖 AI Support Chatbot Backend  
- 🔍 SEO Content Generator  

##  Current Status (v1.7 - AI Service Registry & Plugin Architecture)

- **Backend:** FastAPI with Google ID token verification (RS256) ✅
- **Frontend:** Next.js with `@react-oauth/google` integration ✅
- **Database:** PostgreSQL/SQLite with user management ✅
- **Authentication:** Native Google OAuth with secure token validation ✅
- **Security:** Protected routes, usage tracking, query limits ✅
- **API:** Centralized authentication wrapper with automatic token handling ✅
- **Error Handling:** **Production-ready unified system with comprehensive coverage** ✅
- **Testing:** **Full CI/CD integration with automated smoke tests** ✅
- **Rate Limiting:** **Enhanced with Retry-After headers and dual limits** ✅
- **HTTP Configuration:** **Configurable connection pools and granular timeouts** ✅
- **Production Environment:** **Consolidated configuration with security enhancements** ✅
- **CI/CD Pipeline:** **100% test coverage with all 105 tests passing** ✅
- **Configuration Validation:** **Fail-fast startup validation with comprehensive checks** ✅
- **Test Suite:** **Complete test reliability with enhanced error handling** ✅
- **AI Service Registry:** **Plugin-style architecture with service discovery** ✨ **NEW**
- **Service Monitoring:** **Health checks and monitoring endpoints** ✨ **NEW**

### 🆕 Latest Release Highlights (v1.7)

#### **🤖 AI Service Registry & Plugin Architecture** ✨ **NEW**
- **Plugin-Style AI Services**: Abstract interface with OpenAI and Grok implementations
- **Service Discovery System**: Type and capability-based service selection
- **Health Monitoring**: Automatic health checks with fallback mechanisms
- **Service Metadata Management**: Comprehensive service information and capabilities
- **New Monitoring Endpoints**: `/services` and `/services/health` for operational insights
- **Comprehensive Test Coverage**: 20 additional tests covering all registry functionality

#### **🧪 Enhanced Test Coverage & Reliability**
- **105 Total Tests**: All tests passing (85 original + 20 registry tests)
- **Service Registry Tests**: Complete coverage of plugin architecture
- **Integration Testing**: Service discovery, health checks, and endpoint validation
- **Mock Service Framework**: Comprehensive testing infrastructure
- **CI/CD Integration**: Registry tests included in automated pipeline

#### **⚙️ Production Configuration Validation**
- **Fail-Fast Startup**: Comprehensive validation of all environment variables at startup
- **Smart Validation Logic**: Debug vs production mode validation with appropriate defaults
- **Cross-Dependency Checks**: Validates related configuration variables together
- **Clear Error Messages**: Detailed validation errors with specific fix instructions
- **Testing Mode Support**: Relaxed validation for automated testing environments

#### **🔧 HTTP Client Configuration System**
- **Configurable Connection Pools**: Environment-driven max connections and keepalive settings
- **Granular Grok Timeouts**: Separate connect, read, write, and pool timeout configuration
- **Global OpenAI Timeouts**: Unified timeout settings for OpenAI API calls
- **Security Enhancements**: Bearer token redaction in logs with comprehensive header protection

#### ** Production Environment Consolidation**
- **Unified Configuration**: All settings moved from .env.example to production-ready .env
- **Environment Variable Organization**: Clearly structured sections for API keys, HTTP settings, and limits
- **Model Configuration**: Updated to use correct model names (gpt-5, grok-4-0709)
- **Production Security**: Sensitive information properly secured and documented

#### ** Complete CI/CD Test Integration**
- **100% Test Success**: All 105 tests passing in CI/CD pipeline (9 test suites)
- **AI Service Registry Tests**: 20 comprehensive tests for plugin architecture
- **HTTP Client Tests**: 10 comprehensive tests for configuration and security validation
- **Error Integration Tests**: 10 additional tests for complete error handling validation
- **CI Environment Fix**: Relative paths ensure tests work in both local and CI environments

#### **⚡ Enhanced Development Experience**
- **Database Integration**: Automatic test database initialization for integration tests
- **Cross-Platform Compatibility**: Tests run successfully on macOS, Linux, and Windows
- **Comprehensive Logging**: Security-focused logging with sensitive data redaction

---

## ⚙️ Tech Stack

### Backend
- **Python 3.11+** – Core application logic
- **FastAPI** – High-performance async API framework
- **SQLModel** – Type-safe database ORM with PostgreSQL/SQLite
- **AI Service Registry** – Plugin architecture for AI providers
- **OpenAI API** – GPT-5 for prompt optimization
- **Grok xAI API** – Advanced crypto market analysis
- **Pydantic v2** – Data validation and serialization
- **google-auth** – Google ID token verification (RS256)
- **Supabase** – User database and management

### Frontend  
- **Next.js 15** – React framework with App Router
- **React 19** – Latest React with concurrent features
- **TypeScript** – Type-safe JavaScript development
- **@react-oauth/google** – Official Google OAuth for React
- **Tailwind CSS** – Utility-first CSS framework
- **shadcn/ui** – Modern component library
- **Recharts** – Interactive data visualizations

### Database & Infrastructure
- **PostgreSQL** – Production database
- **SQLite** – Development database
- **Database Migrations** – Automatic schema management
- **Query Logging** – Complete usage analytics

---

## 🏗️ Project Architecture

### Repository Structure (Production-Ready)
```
PluginMind/                          # Repository root
├── .github/
│   └── workflows/                     # CI/CD automation
│       ├── ci.yml                     # Comprehensive test suite runner
│       └── post-deploy-smoke.yml      # Production smoke test validation
│
├── coingrok_backend/                  # Backend API service
│   ├── app/
│   │   ├── main.py                    # FastAPI app with AI service registry ✨
│   │   ├── database.py               # Database engine & session management  
│   │   ├── ash_prompt.py             # 4-D Prompt Engine system prompt
│   │   │
│   │   ├── core/                     # Core infrastructure
│   │   │   ├── config.py            # Environment settings & validation
│   │   │   ├── logging.py           # Centralized logging setup
│   │   │   └── exceptions.py        # Custom exception classes + RateLimitError enhancements ✨
│   │   │
│   │   ├── api/                      # API layer
│   │   │   ├── dependencies.py      # FastAPI dependencies (DB sessions)
│   │   │   ├── dependencies_rate_limit.py # Rate limiting dependencies + Retry-After headers ✨
│   │   │   └── routes/              # Endpoint handlers
│   │   │       ├── analysis.py      # /analyze, /analyze-async (auth-protected)
│   │   │       ├── users.py         # /me, /me/usage (user profiles)
│   │   │       ├── jobs.py          # /jobs management with UUID validation
│   │   │       ├── health.py        # /health, /live, /ready, /version endpoints
│   │   │       └── query_logs.py    # /query-logs analytics
│   │   │
│   │   ├── services/                 # Business logic layer ✨ ENHANCED
│   │   │   ├── ai_service_interface.py  # ✨ Plugin registry & abstract interface
│   │   │   ├── service_initialization.py # ✨ Service registration at startup
│   │   │   ├── openai_service.py    # OpenAI plugin implementation
│   │   │   ├── grok_service.py      # Grok plugin implementation
│   │   │   ├── analysis_service.py  # Orchestration with service discovery
│   │   │   └── user_service.py      # User management & usage tracking
│   │   │
│   │   ├── models/                   # Data layer
│   │   │   ├── database.py          # SQLModel tables (jobs, users, logs)
│   │   │   ├── schemas.py           # Pydantic request/response models
│   │   │   └── enums.py             # Status enums & constants
│   │   │
│   │   ├── middleware/               # Cross-cutting concerns
│   │   │   ├── auth.py              # JWT validation & auth dependencies
│   │   │   ├── cors.py              # CORS configuration
│   │   │   ├── error_handler.py     # Unified exception handling system ✨
│   │   │   │                        # → RequestValidationError handler (422)
│   │   │   │                        # → StarletteHTTPException handler (404 routing)
│   │   │   │                        # → Enhanced rate limit + retry-after headers
│   │   │   │                        # → Generic exception handler (500)
│   │   │   ├── security_headers.py  # Production HTTP security headers
│   │   │   ├── request_limits.py    # Request body size limits
│   │   │   └── correlation_id.py    # Request tracing with correlation IDs
│   │   │
│   │   └── utils/                    # Utilities
│   │       ├── background_tasks.py  # Async job processing
│   │       ├── http.py              # Resilient HTTP client with configurable pools ✨
│   │       ├── rate_limit.py        # Token-bucket rate limiting + retry calculation
│   │       └── ip.py                # IP extraction utilities
│   │
│   ├── tests/                         # Comprehensive test suite ✨
│   │   ├── test_error_handling.py    # Exception mapping & response format tests
│   │   │                            # → 422 validation error tests (malformed JSON, missing fields)
│   │   │                            # → 500 generic exception tests  
│   │   │                            # → 429 rate limit + Retry-After header tests
│   │   ├── test_error_integration.py # API endpoint integration tests (10 tests)
│   │   ├── test_http_client.py      # HTTP client configuration tests (10 tests) ✨
│   │   │                            # → Connection pool configuration validation
│   │   │                            # → Granular timeout testing (Grok-specific)
│   │   │                            # → Security header redaction validation
│   │   ├── test_ai_service_registry.py # ✨ AI service registry tests (20 tests)
│   │   │                            # → Service registration and discovery
│   │   │                            # → Health checking and monitoring
│   │   │                            # → Fallback mechanisms and edge cases
│   │   │                            # → Service metadata management
│   │   │                            # → New monitoring endpoints validation
│   │   ├── test_rate_limit.py       # Rate limiting behavior tests
│   │   ├── test_middleware.py       # Middleware functionality tests
│   │   ├── test_jwt_security.py     # JWT validation tests
│   │   ├── test_production_mode.py  # Production environment tests
│   │   └── README.md                test documentation
│   │
│   ├── scripts/                      # Operations & testing scripts ✨
│   │   ├── smoke_errors.sh          # Error handling smoke tests (7 scenarios)
│   │   │                            # → 422 validation, 404 routing, 401 auth, etc.
│   │   └── smoke_backend.sh         # Comprehensive production smoke test
│   │
│   ├── run_error_tests.py           # Test suite runner ✨
│   ├── gunicorn_conf.py             # Production WSGI server configuration
│   ├── requirements.txt             # Python dependencies (includes Gunicorn)
│   ├── .env.example                # Environment template with production vars
│   └── .gitignore                  # Security & cleanup
│
├── frontend/                         # Next.js React application
│   ├── app/                         # Next.js 15 App Router
│   ├── components/                  # React components
│   ├── lib/                         # Utility functions
│   └── package.json                # Frontend dependencies
│
├── docs/                            # Project documentation
└── README.md                       # Project overview & setup guide
```

### Frontend Structure
```
frontend/
├── app/                      # Next.js 15 App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── analyze/
│       └── page.tsx         # Analysis interface
│
├── components/               # React components
│   ├── ui/                  # shadcn/ui components
│   ├── analysis-result.tsx  # Results display
│   ├── crypto-chart.tsx     # Price charts
│   └── market-insights.tsx  # Market data
│
├── lib/
│   └── utils.ts             # Utility functions
│
├── package.json             # Dependencies
└── tailwind.config.ts       # Styling config
```

## 🔄 How It Works

### Request Flow with AI Service Registry
```mermaid
graph LR
    A[User Input] --> B[Validation]
    B --> C[AI Service Registry]
    C --> D[Service Discovery]
    D --> E[OpenAI Plugin]
    E --> F[Prompt Optimization]
    F --> G[Grok Plugin]
    G --> H[Analysis]
    H --> I[Query Logging]
    I --> J[Response]
```

### Architecture Benefits
- **Plugin Architecture**: AI services implement common interface
- **Service Discovery**: Dynamic service selection by type/capability
- **Health Monitoring**: Automatic health checks with fallback mechanisms
- **Modular Design**: Each component has single responsibility
- **Type Safety**: Full TypeScript/Python type coverage
- **Error Handling**: Centralized exception management
- **Scalability**: Service layer ready for microservices
- **Testing**: Clean architecture supports comprehensive unit testing
- **Monitoring**: Built-in logging, analytics, and service health endpoints

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key
- Grok API Key


### 🔍 AI Service Registry Endpoints

**Service Information:**
```bash
curl http://localhost:8000/services
# Response: Registry info and health status for all AI services
```

**Health Monitoring:**
```bash
curl http://localhost:8000/services/health
# Response: Individual service health with overall system status
```

### 🧪 Testing the API

**Health Check:**
```bash
curl http://localhost:8000/health
# Response: {"status": "ok", "active_jobs": 0}
```

**Complete Test Suite:** ✨ **NEW**
```bash
# Run full test suite - now 100% passing!
python -m pytest
# Expected: 105/105 tests passed ✅

# Run AI service registry tests specifically
python -m pytest tests/test_ai_service_registry.py -v
# Expected: 20/20 registry tests passed ✅
# ✅ Service registration and discovery
# ✅ Health checking and monitoring
# ✅ Fallback mechanisms and error handling
# ✅ Service metadata management
# ✅ Monitoring endpoints (/services, /services/health)

# Run comprehensive error handling tests
python run_error_tests.py
# Expected: All error handling tests passed ✅

# Run all HTTP client configuration tests
python -m pytest tests/test_http_client.py -v
# Expected: 10/10 tests passed
# ✅ Header redaction (Bearer tokens, API keys)
# ✅ Connection pool configuration validation
# ✅ Granular timeout configuration (Grok-specific)
# ✅ Security documentation validation

# Test configuration validation at startup
OPENAI_API_KEY=invalid python -c "from app.main import app"
# Expected: Configuration validation error with clear fix instructions

# Run production smoke tests (7 scenarios)
chmod +x scripts/smoke_errors.sh
./scripts/smoke_errors.sh http://localhost:8000
# Expected output: 7/7 tests passed ✅
# ✅ Job not found error (404 + JOB_NOT_FOUND)
# ✅ Authentication required (401 + AUTHENTICATION_FAILED)  
# ✅ Invalid authentication token (401)
# ✅ Non-existent endpoint (404 + HTTP_EXCEPTION)
# ✅ Validation error - empty body (422 + INVALID_INPUT)
# ✅ Field length validation (422 + INVALID_INPUT)
# ✅ Health check endpoint (200)
```

**Synchronous Analysis:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Analyze Bitcoin over 7 days with $500"}'
```

**Async Analysis:**
```bash
# Start job
curl -X POST "http://localhost:8000/analyze-async" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Deep analysis of Ethereum market trends"}'

# Check results (use job_id from above)
curl http://localhost:8000/analyze-async/{job_id}
```

**API Documentation:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 📚 API Documentation

### Core Endpoints

#### `POST /analyze`
Synchronous crypto analysis with immediate response
```json
{
  "user_input": "Analyze Bitcoin over 7 days with $500"
}
```

**Response:**
```json
{
  "optimized_prompt": "Professional crypto analysis prompt...",
  "analysis": "Comprehensive market analysis with sentiment, news, recommendations..."
}
```

#### `POST /analyze-async`
Start background analysis job
```json
{
  "user_input": "Deep analysis of Ethereum market trends"
}
```

**Response:**
```json
{
  "job_id": "uuid-string",
  "status": "queued",
  "created_at": "2024-01-01T00:00:00Z",
  "message": "Analysis started. Use the job_id to check status."
}
```

#### `GET /analyze-async/{job_id}`
Check job status and retrieve results

#### `GET /health`
Health check with active job count

#### `GET /query-logs`
View recent query history (debugging)

### Error Handling

CoinGrok implements a **production-ready unified error handling system** with consistent response format, comprehensive logging, and full CI/CD integration.

#### Error Response Format

All API errors return a standardized JSON envelope with consistent structure:

```json
{
  "error": {
    "message": "User-friendly error message",
    "code": "ERROR_CODE_CONSTANT", 
    "correlation_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```

#### Comprehensive Error Coverage

| HTTP Status | Error Code | Description | Handler |
|------------|------------|-------------|---------|
| 400 | `INVALID_INPUT` | Request validation failed | Custom exceptions |
| 401 | `AUTHENTICATION_FAILED` | Invalid or missing authentication | Custom exceptions |
| 404 | `JOB_NOT_FOUND` | Analysis job not found | Custom exceptions |
| 404 | `USER_NOT_FOUND` | User account not found | Custom exceptions |
| 404 | `HTTP_EXCEPTION` | Non-existent endpoints | **Routing-level handler** ✨ |
| 413 | `REQUEST_TOO_LARGE` | Request body exceeds 1MB limit | Middleware |
| 422 | `INVALID_INPUT` | **Validation errors (JSON/fields)** | **RequestValidationError handler** ✨ |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests | **Rate limiter + Retry-After headers** ✨ |
| 429 | `QUERY_LIMIT_EXCEEDED` | User query limit reached | Custom exceptions |
| 500 | `INTERNAL_SERVER_ERROR` | **Unexpected exceptions** | **Generic exception handler** ✨ |
| 500 | `USER_ACCESS_FAILED` | User account operation failed | Custom exceptions |
| 500 | `DATABASE_ERROR` | Database operation failed | Custom exceptions |
| 502 | `AI_SERVICE_ERROR` | External AI service unavailable | Custom exceptions |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable | Custom exceptions |

#### 🚀 Latest Enhancements (v1.4 - Error Handling Final Touches)

**✨ New Exception Handlers:**
- **RequestValidationError Handler**: Converts FastAPI validation errors (422) to unified format
- **StarletteHTTPException Handler**: Ensures routing-level 404s use unified format  
- **Enhanced Generic Handler**: Safe, consistent 500 error responses for unexpected exceptions

**✨ Rate Limiting Improvements:**
- **Retry-After Headers**: Automatic calculation and inclusion in 429 responses
- **Enhanced RateLimitError**: Support for retry-after timing information
- **Dual Rate Limiting**: User-based and IP-based limits with proper header management

**✨ Validation Error Unification:**
- **Malformed JSON**: Invalid JSON syntax → unified 422 + INVALID_INPUT
- **Missing Fields**: Required field validation → unified 422 + INVALID_INPUT  
- **Field Constraints**: Length/type validation → unified 422 + INVALID_INPUT

#### Error Correlation & Debugging

Every error response includes a `correlation_id` for efficient debugging:

```bash
# Server logs with correlation tracking
2024-01-01 12:00:00 - ERROR - Job not found: invalid-job-id [correlation_id=f47ac10b]
2024-01-01 12:00:00 - WARNING - Validation error: missing field 'user_input' [correlation_id=a1b2c3d4]
```

#### Response Headers & Rate Limiting

**Standard Headers:**
```http
Content-Type: application/json
X-Request-ID: f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Rate Limiting Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
Retry-After: 120  # ✨ New: Seconds to wait before retry
```

#### Testing & Quality Assurance

**✅ Comprehensive Test Coverage:**
- **Unit Tests**: All exception types and handlers tested
- **Integration Tests**: Real API endpoint error scenarios  
- **Smoke Tests**: Live production validation (7/7 scenarios)

**✅ CI/CD Integration:**
- **Pre-merge**: All error tests run on every PR
- **Post-deploy**: Automated smoke tests validate production health
- **Coverage**: 422, 500, 429, 404, 401 scenarios fully tested

### Database Schema

#### QueryLog Table
Tracks all user queries for analytics and billing:
- `user_id`: User identifier (nullable for anonymous usage)
- `user_input`: Original query
- `ai_result`: Final analysis result
- `response_time_ms`: Performance metrics
- `success`: Query completion status
- `openai_cost`, `grok_cost`, `total_cost`: Billing tracking

#### AnalysisJob Table  
Manages asynchronous job processing:
- `job_id`: UUID for external tracking
- `status`: queued → processing_openai → processing_grok → completed
- `optimized_prompt`: OpenAI-generated prompt
- `analysis`: Final Grok analysis
- `user_id`: Links jobs to users (Phase 2)
- `cost`: Total API cost for billing

#### User Table (Phase 2 Ready)
User management and subscription tracking:
- `email`: User email address
- `google_id`: Google OAuth identifier
- `subscription_tier`: free, pro, premium
- `queries_used`, `queries_limit`: Usage tracking
- `is_active`: Account status

---

# 🔐 Phase 2: Authentication & User Management

> **Complete Google OAuth integration with Supabase, JWT-protected routes, and usage tracking**

## 🚀 Features Implemented

### **Authentication System**
- **Native Google ID Token Verification** - Direct Google OAuth with RS256 algorithm
- **google-auth Library** - Secure token validation using Google's public keys
- **Middleware Protection** - Route-level authentication with dependency injection
- **Auto User Creation** - First-time users automatically created with default settings

### **User Management**
- **Smart User Lookup** - Finds users by `google_id` or email with fallback logic
- **Usage Tracking** - Real-time query counting for billing and limits
- **Subscription Tiers** - Built-in support for `free`, `pro`, `premium` plans
- **Query Limits** - Automatic enforcement prevents API overuse

### **Protected API Endpoints**
```http
POST   /analyze        # 🔒 Protected - Analysis with usage tracking
GET    /me             # 🔒 Protected - User profile information
GET    /me/usage       # 🔒 Protected - Query usage statistics
```

## 🏗️ Authentication Architecture

### **Auth Flow**
```
Google OAuth → Google ID Token → FastAPI Verification → Protected Route
```

1. **Client** triggers Google OAuth via `@react-oauth/google`
2. **Google** returns ID token with user claims
3. **FastAPI** validates token using `google-auth` with RS256 verification
4. **Middleware** extracts user ID and provides `UserDep`/`OptionalUserDep`
5. **Routes** get authenticated user automatically

### **Tech Stack**
- **FastAPI Dependencies** - Clean dependency injection for auth
- **google-auth** - Google ID token verification with RS256
- **@react-oauth/google** - Official React Google OAuth integration
- **SQLModel** - Type-safe database operations
- **HTTPBearer** - Secure header-based authentication

## 📊 Auth API Usage Examples

### **Protected Analysis with Auto User Creation**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Analyze BTC price trends"}'
```

### **Get User Profile**
```bash
curl -X GET "http://localhost:8000/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Check Usage Limits**
```bash
curl -X GET "http://localhost:8000/me/usage" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **`auth.py`** | JWT validation & dependencies | `app/middleware/auth.py` |
| **`user_service.py`** | User CRUD operations | `app/services/user_service.py` |
| **`users.py`** | Profile & usage endpoints | `app/api/routes/users.py` |
| **`UserProfile`** | Response schema for `/me` | `app/models/schemas.py` |
| **`UserUsage`** | Response schema for `/me/usage` | `app/models/schemas.py` |

## 🔄 User Lifecycle

```mermaid
graph LR
    A[First API Call] --> B[JWT Validation]
    B --> C{User Exists?}
    C -->|No| D[Create User]
    C -->|Yes| E[Load User]
    D --> F[Check Limits]
    E --> F
    F --> G{Under Limit?}
    G -->|Yes| H[Process Request]
    G -->|No| I[Return 429 Error]
    H --> J[Increment Usage]
```

---

## 🚀 Production Deployment

### Environment Variables

**Backend (.env)**
```bash
# Required API Keys
OPENAI_API_KEY=your-openai-api-key
GROK_API_KEY=your-grok-api-key

# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/coingrok  # Production
# DATABASE_URL=sqlite:///./coingrok.db  # Development

# Security & Performance
CORS_ORIGINS=https://coingrok.vercel.app,https://your-domain.com
LOG_LEVEL=INFO
DEBUG=false

# Phase 2 Authentication (Required)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Optional: Supabase for user management
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key

# Optional Configuration
JOB_CLEANUP_HOURS=24
MAX_USER_INPUT_LENGTH=5000
```

**Frontend (.env)**
```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend Configuration
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com

# Frontend Configuration
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options

#### Backend Deployment
**Render/Railway/Fly.io:**
```yaml
# render.yaml
services:
- type: web
  name: coingrok-api
  env: python
  plan: starter
  buildCommand: pip install -r requirements.txt
  startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  envVars:
  - key: OPENAI_API_KEY
    sync: false
  - key: GROK_API_KEY
    sync: false
```

**Docker:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Deployment
**Vercel:**
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-api-domain.com"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://your-api-domain.com"
    }
  }
}
```

### Database Setup
**Production PostgreSQL:**
```bash
# Using Supabase, Neon, or similar
DATABASE_URL=postgresql://username:password@host:5432/database
```

**Development SQLite:**
```bash
DATABASE_URL=sqlite:///./coingrok.db
```

## Production Deployment

### Process Management with Gunicorn

The backend includes production-ready Gunicorn configuration with environment-driven settings:

```bash
# Start with Gunicorn (production)
cd coingrok_backend
gunicorn app.main:app --config gunicorn_conf.py

# Key production features:
# - Environment-driven worker count and timeouts
# - Correlation ID access logging for request tracing
# - Graceful worker restarts and memory management
# - Production-optimized connection pools
```

**Environment Variables for Production:**
```bash
# Process Management
GUNICORN_WORKERS=4                    # CPU cores * 2 + 1
GUNICORN_TIMEOUT=300                  # 5min timeout (matches AI call budget)
GUNICORN_MAX_REQUESTS=1000           # Restart workers after N requests
GUNICORN_MAX_REQUESTS_JITTER=100     # Add randomness to prevent thundering herd

# HTTP Client Configuration ✨ NEW
HTTP_MAX_CONNECTIONS=100             # Maximum concurrent connections
HTTP_MAX_KEEPALIVE=10               # Maximum keepalive connections
HTTP_TIMEOUT_SECONDS=120             # Global timeout for OpenAI calls
HTTP_MAX_RETRIES=1                   # Retry failed requests once
HTTP_RETRY_BACKOFF_BASE=0.5         # Exponential backoff base

# Grok-Specific Granular Timeouts ✨ NEW
GROK_TIMEOUT_SECONDS=200            # Read timeout for Grok API
GROK_CONNECT_TIMEOUT=10.0           # Connection establishment timeout
GROK_WRITE_TIMEOUT=30.0             # Write timeout for request body
GROK_POOL_TIMEOUT=5.0               # Connection pool timeout

# Request Protection
BODY_MAX_BYTES=1000000              # Max request body size (1MB)
RATE_LIMIT_PER_MIN=60               # User rate limiting per minute
RATE_LIMIT_BURST=120                # User rate limiting burst capacity
RATE_LIMIT_IP_PER_MIN=300           # IP rate limiting per minute (authenticated users)
RATE_LIMIT_IP_BURST=600             # IP rate limiting burst capacity (authenticated users)
```

### Production Security Features

**HTTP Security Headers (Automatic):**
- Content Security Policy (CSP) with safe defaults
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff (MIME type protection)
- Strict-Transport-Security (HSTS) in production only
- X-Request-ID correlation headers for tracing

**Request Protection:**
- Body size limits (1MB default, configurable)
- Token-bucket rate limiting with IP/user-based tracking
- UUID validation for all job endpoints
- CORS configured for specific frontend domains only

**Application Security:**
- FastAPI docs/OpenAPI disabled in production (`DEBUG=false`)
- Graceful HTTP client connection management
- Structured logging with correlation IDs for request tracing
- Resilient HTTP calls with exponential backoff retry logic

### Health Monitoring

Production-ready health endpoints for container orchestration:

```bash
# Kubernetes/Docker health checks
GET /live     # Liveness probe (always returns 200)
GET /ready    # Readiness probe (checks dependencies)
GET /health   # Detailed health with active job count
GET /version  # Build info (name, version, git SHA)
```

### Quality Assurance Script

Run comprehensive smoke tests before deployment:

```bash
# Test all production features
chmod +x scripts/smoke_backend.sh

# Test against local development
BASE=http://localhost:8000 ./scripts/smoke_backend.sh

# Test against staging/production (with auth token)
BASE=https://api.coingrok.com TOKEN=jwt_token ./scripts/smoke_backend.sh

# Tests include:
# ✅ Health endpoints and JSON responses
# ✅ Security headers (CSP, HSTS, X-Frame-Options)  
# ✅ CORS configuration and preflight requests
# ✅ Authentication flows (with/without tokens)
# ✅ Request size limits (413 for >1MB requests)
# ✅ Rate limiting (429 after multiple requests)
```

### Production Readiness Checklist

- [x] **Process Management**: Gunicorn with environment-driven configuration
- [x] **Security Headers**: CSP, HSTS, X-Frame-Options, request correlation
- [x] **Request Protection**: Size limits, rate limiting, input validation
- [x] **Resilient HTTP**: Retry logic, exponential backoff, graceful timeouts
- [x] **Health Monitoring**: Liveness, readiness, and detailed health endpoints
- [x] **Observability**: Correlation ID tracing, structured logging, performance metrics
- [x] **Quality Assurance**: Comprehensive smoke test script for pre-deployment validation
- [x] **Graceful Shutdown**: Proper cleanup of HTTP clients and background tasks
- [x] **Error Handling**: **Unified exception system with comprehensive coverage**
- [x] **Validation Errors**: **422 errors use consistent envelope format**  
- [x] **Rate Limiting**: **Enhanced with Retry-After headers and dual limits**
- [x] **Testing Coverage**: **7/7 smoke tests + comprehensive CI/CD pipeline**
- [x] **Production Validation**: **Automated post-deploy error scenario testing**
- [x] **HTTP Configuration**: **Environment-driven connection pools and granular timeouts** ✨ **NEW**
- [x] **Security Enhancements**: **Bearer token redaction and comprehensive header protection** ✨ **NEW**
- [x] **CI/CD Expansion**: **100% test success rate - all 105 tests passing** ✨ **NEW**
- [x] **Configuration Validation**: **Fail-fast startup with comprehensive environment validation** ✨ **NEW**
- [x] **AI Service Registry**: **Plugin architecture with service discovery and health monitoring** ✨ **NEW**

---

## ⚙️ Startup Configuration Validation (Fail-Fast)

CoinGrok backend implements comprehensive configuration validation at startup to ensure production reliability and prevent runtime failures due to invalid configuration.

### What is Validated

**API Keys & Secrets:**
- `OPENAI_API_KEY`, `GROK_API_KEY`: Must be present and minimum 10 characters
- `GOOGLE_CLIENT_ID`: Must end with `.apps.googleusercontent.com`
- Cross-dependencies: `SUPABASE_ANON_KEY` required if `SUPABASE_URL` is set

**URLs & Endpoints:**
- `OPENAI_API_URL`, `GROK_API_URL`: Must be valid HTTP/HTTPS URLs
- `DATABASE_URL`: Must use supported schemes (postgresql, sqlite, mysql)

**CORS Security:**
- Production mode: Requires explicit `CORS_ORIGINS`, no wildcards allowed
- Debug mode: Allows wildcards, defaults to `http://localhost:3000` if omitted

**Numeric Ranges:**
- `HTTP_TIMEOUT_SECONDS`: 1-300 seconds
- `HTTP_MAX_CONNECTIONS`: 1-10,000 connections
- `RATE_LIMIT_PER_MIN`: 1-10,000 requests
- `RATE_LIMIT_BURST`: 1-20,000, must be ≥ `RATE_LIMIT_PER_MIN`
- `GROK_*_TIMEOUT`: Various ranges for connection, read, write timeouts

**Logical Consistency:**
- Model names (`OPENAI_MODEL`, `GROK_MODEL`) cannot be empty
- Rate limit burst must be greater than or equal to per-minute limit

### How to Interpret Errors

**✅ Successful startup:**
```bash
2024-01-15 10:00:00 - INFO - Starting CoinGrok Backend API v1.0.0
2024-01-15 10:00:00 - INFO - Validating configuration...
2024-01-15 10:00:00 - INFO - Configuration validation passed
2024-01-15 10:00:00 - INFO - Application startup completed successfully
```

**❌ Configuration errors (server won't start):**
```bash
2024-01-15 10:00:00 - INFO - Starting CoinGrok Backend API v1.0.0
2024-01-15 10:00:00 - INFO - Validating configuration...
2024-01-15 10:00:00 - ERROR - Configuration validation failed:
  - OPENAI_API_KEY is missing or too short (minimum 10 characters)
  - CORS_ORIGINS is required in production mode
  - HTTP_TIMEOUT_SECONDS must be 1-300, got: 500
  - RATE_LIMIT_BURST (50) must be >= RATE_LIMIT_PER_MIN (100)
```

### Common Fixes

| Error | Solution |
|-------|----------|
| **API key missing/too short** | Set valid API keys with minimum 10 characters |
| **Invalid URL format** | Ensure URLs start with `http://` or `https://` |
| **CORS required in production** | Set `CORS_ORIGINS=https://yourdomain.com` when `DEBUG=false` |
| **Numeric out of range** | Check .env.example for valid ranges |
| **Google Client ID format** | Must end with `.apps.googleusercontent.com` |
| **Database URL invalid** | Use `postgresql://`, `sqlite:///`, or `mysql://` schemes |

### Debug vs Production Mode

**Debug Mode (`DEBUG=true`):**
- CORS origins default to `http://localhost:3000` if omitted
- Wildcard (`*`) CORS origins allowed
- More lenient validation for development

**Production Mode (`DEBUG=false`):**
- Explicit CORS origins required
- No wildcard CORS origins allowed
- Strict validation for all configuration

### Testing Mode

Set `TESTING=1` to relax validation for automated tests. This provides safe defaults for missing secrets while still validating numeric ranges and formats.

---

## 🔧 Configuration Variables

The backend uses environment variables defined in `.env` for configuration. All variables are validated at startup.

### **Required Variables (Critical)**

| Variable | Description | Format | Example |
|----------|-------------|---------|---------|
| `OPENAI_API_KEY` | OpenAI API key (min 10 chars) | `sk-proj-...` | From OpenAI dashboard |
| `GROK_API_KEY` | Grok/xAI API key (min 10 chars) | `xai-...` | From x.ai dashboard |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `*.apps.googleusercontent.com` | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `GOCSPX-...` | From Google Console |
| `SUPABASE_URL` | Supabase project URL | `https://*.supabase.co` | From Supabase dashboard |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` | From Supabase dashboard |
| `JWT_SECRET` | JWT signing secret | Base64 string | Generate with `openssl rand -base64 64` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` | From Supabase or your DB |

### **CORS & Security**

| Variable | Description | Production Value | Debug Value |
|----------|-------------|------------------|-------------|
| `CORS_ORIGINS` | Allowed frontend origins | `https://yourdomain.com` | `http://localhost:3000` |
| `DEBUG` | Debug mode | `false` | `true` |

### **Application Settings**

| Variable | Default | Description | Range |
|----------|---------|-------------|-------|
| `APP_NAME` | `CoinGrok Backend API` | Application name | Any string |
| `APP_VERSION` | `1.6.0` | Version number | Semver format |
| `LOG_LEVEL` | `INFO` | Logging level | DEBUG/INFO/WARNING/ERROR |

### **AI Models & APIs**

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_MODEL` | `gpt-5` | OpenAI model name |
| `OPENAI_API_URL` | `https://api.openai.com/v1/chat/completions` | OpenAI endpoint |
| `GROK_MODEL` | `grok-4-0709` | Grok model name |
| `GROK_API_URL` | `https://api.x.ai/v1/chat/completions` | Grok endpoint |

### **Performance & Limits**

| Variable | Default | Description | Range |
|----------|---------|-------------|-------|
| `HTTP_TIMEOUT_SECONDS` | `120` | Global HTTP timeout | 1-300 |
| `HTTP_MAX_CONNECTIONS` | `100` | Max concurrent connections | 1-10,000 |
| `HTTP_MAX_KEEPALIVE` | `10` | Max keepalive connections | 1-10,000 |
| `RATE_LIMIT_PER_MIN` | `60` | Requests per minute per user | 1-10,000 |
| `RATE_LIMIT_BURST` | `120` | Burst capacity | ≥ `RATE_LIMIT_PER_MIN` |
| `MAX_USER_INPUT_LENGTH` | `500` | Max input characters | 1-50,000 |
| `BODY_MAX_BYTES` | `1000000` | Max request body size | 1MB default |

### **Grok-Specific Timeouts**

| Variable | Default | Description | Range |
|----------|---------|-------------|-------|
| `GROK_TIMEOUT_SECONDS` | `200` | Grok read timeout | 1-600 |
| `GROK_CONNECT_TIMEOUT` | `10.0` | Grok connection timeout | 0.1-60 |
| `GROK_WRITE_TIMEOUT` | `30.0` | Grok write timeout | 0.1-120 |
| `GROK_POOL_TIMEOUT` | `5.0` | Grok pool timeout | 0.1-30 |

### **Optional Variables**

| Variable | Default | Description |
|----------|---------|-------------|
| `TESTING` | `0` | Testing mode (use `1` for tests only) |
| `JOB_CLEANUP_HOURS` | `1` | Hours to keep completed jobs |
| `HTTP_MAX_RETRIES` | `1` | HTTP retry attempts |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |

---

## 📊 Monitoring & Analytics

### Built-in Logging
- Request/response timing with performance metrics
- Error tracking with categorization and stack traces
- API usage metrics and patterns
- Database query performance monitoring
- AI service health and performance tracking
- Service discovery and registry operations

### Query Analytics
Access `/query-logs` endpoint to monitor:
- User query patterns and trends
- Response times and performance bottlenecks
- Success/failure rates by endpoint
- Popular analysis types and usage insights

### Health Monitoring
- `/health` endpoint for uptime monitoring
- `/services` endpoint for AI service registry information
- `/services/health` endpoint for individual service health status
- Automatic cleanup of old jobs and data
- Database connection health checks
- Memory and resource usage tracking
- AI service availability and performance monitoring

## 🛣️ Roadmap

### ✅ Phase 1: Backend Infrastructure & DB (COMPLETE)
- [x] Replace wildcard CORS with secure configuration
- [x] Set up PostgreSQL using Supabase (infrastructure ready)
- [x] Create users and queries tables with usage tracking
- [x] Move job storage from RAM to database (SQLModel/SQLAlchemy)
- [x] Database schema optimized for Phase 2 (nullable user_id)
- [x] Authentication dependencies installed (JWT, Supabase, OAuth)
- [x] Security audit complete (secrets protected, .gitignore updated)

### ✅ Phase 2: Auth System (COMPLETE)
- [x] Native Google ID token verification with RS256 algorithm
- [x] Backend token validation using google-auth library
- [x] Frontend auth with @react-oauth/google integration
- [x] Secure /analyze route with UserDep authentication
- [x] Auto user registration and profile management (/me endpoint)
- [x] Usage tracking and query limit enforcement (/me/usage endpoint)
- [x] Token expiry detection and automatic cleanup
- [x] Protected routes with authentication middleware

### ✅ Phase 2.5: Error Handling & Testing (COMPLETE)
- [x] **Unified Error Handling System**: Single source of truth exception mapping
- [x] **RequestValidationError Handler**: 422 validation errors with unified format  
- [x] **StarletteHTTPException Handler**: 404 routing errors with unified format
- [x] **Enhanced Rate Limiting**: Retry-After headers and dual user/IP limits
- [x] **Generic Exception Handler**: Safe 500 error responses for unexpected exceptions
- [x] **Comprehensive Test Suite**: Unit, integration, and smoke tests (7/7 passing)
- [x] **CI/CD Integration**: Pre-merge testing and post-deploy validation
- [x] **Production Smoke Tests**: Live error scenario validation
- [x] **Correlation ID Tracking**: End-to-end request tracing for debugging
- [x] **Error Documentation**: Complete API error reference and troubleshooting guide

### ✅ Phase 2.7: HTTP Configuration & Production Readiness (COMPLETE)
- [x] **HTTP Client Configuration**: Environment-driven connection pools and timeout settings
- [x] **Granular Grok Timeouts**: Separate connect, read, write, and pool timeout configuration
- [x] **Security Enhancements**: Bearer token redaction and comprehensive header protection
- [x] **Production Environment**: Consolidated .env configuration with all required variables
- [x] **Model Configuration**: Updated to correct model names (gpt-5, grok-4-0709)
- [x] **CI/CD Test Expansion**: Added HTTP client tests (10 tests) and error integration tests (10 tests)
- [x] **Cross-Platform Compatibility**: Fixed CI environment issues with relative paths
- [x] **Database Integration**: Automatic test database initialization for integration tests
- [x] **Production Documentation**: Complete HTTP configuration and deployment guide

### ✅ Phase 2.8: Configuration Validation & Test Reliability (COMPLETE)
- [x] **Fail-Fast Configuration Validation**: Comprehensive startup validation with clear error messages
- [x] **Environment Variable Validation**: API keys, URLs, CORS, numeric ranges, and cross-dependencies
- [x] **Debug vs Production Mode**: Smart validation logic with appropriate defaults for each environment
- [x] **100% Test Success Rate**: All 105 tests now passing (fixed 7 originally failing tests)
- [x] **Enhanced IP Validation**: IPv6 zone ID rejection for improved rate limiting security
- [x] **Token Bucket Security**: Prevention of negative token consumption exploitation
- [x] **Error Handling Test Fixes**: Resolved authentication vs validation priority conflicts
- [x] **TestClient Improvements**: Proper exception handling for comprehensive test coverage
- [x] **Rate Limiting Enhancements**: Fixed async mock issues and invalid token handling
- [x] **Production Test Reliability**: Complete CI/CD pipeline with 100% test success rate

### ✅ Phase 2.9: AI Service Registry & Plugin Architecture (COMPLETE) ✨ **NEW**
- [x] **Plugin-Style AI Services**: Abstract AIService interface with concrete OpenAI/Grok implementations
- [x] **Service Discovery System**: Type and capability-based service selection and registration
- [x] **Health Monitoring Infrastructure**: Automatic health checks with comprehensive status reporting
- [x] **Service Metadata Management**: Complete service information tracking and validation
- [x] **Registry-Based Orchestration**: Analysis service uses registry for dynamic service discovery
- [x] **New Monitoring Endpoints**: `/services` and `/services/health` for operational insights
- [x] **Backward Compatibility**: Legacy service methods preserved for seamless migration
- [x] **Comprehensive Test Coverage**: 20 additional tests covering all registry functionality
- [x] **CI/CD Integration**: Registry tests included in automated pipeline
- [x] **GPT-5 API Compatibility**: Fixed parameter issues (max_completion_tokens, temperature handling)

### Phase 3: Business Features
- [ ] Subscription tiers (Free/Pro/Premium)
- [ ] Stripe payment integration
- [ ] Usage-based billing system
- [ ] Query limits enforcement
- [ ] User dashboard and analytics

### Phase 4: Scale & Performance
- [ ] Redis caching layer
- [ ] Rate limiting middleware
- [ ] API versioning strategy
- [ ] Microservices architecture
- [ ] Docker containerization

## 🙏 Acknowledgments

- **OpenAI** - GPT-5 for intelligent prompt optimization
- **Grok AI** - Advanced market analysis capabilities
- **FastAPI** - High-performance async API framework
- **Next.js** - React framework for production applications
- **SQLModel** - Type-safe database ORM with automatic API integration
- **Claude Anthropic** - Advanced assistant model

---

**Built with ❤️ by Alexandru G. Mihai** 

## 📬 Get Access to Full Boilerplate

For full source code and a commercial license, contact:  
📧 **[mihai.gl.alexandru@gmail.com]**
