# 🧪 Testing Guide

PluginMind ships with comprehensive test suites covering both backend and frontend (154 total tests: 117 backend + 37 frontend). This guide helps you run and extend them.

---

## 🚀 Quick Start

### Backend Tests (FastAPI)
```bash
cd pluginmind_backend
TESTING=1 pytest
```

### Frontend Tests (Next.js)
```bash
cd frontend
pnpm test
```

- `TESTING=1` enables safe defaults in `tests/conftest.py` (dummy API keys, SQLite DB).
- The suite runs in under 3 seconds on most machines.

Need specific tests?
```bash
pytest tests/test_generic_processing.py -k "document"
pytest tests/test_jwt_security.py::test_attack_vector_prevention
```

---

## 🧱 Test Categories

### Backend Tests (pytest)
| File | Focus |
|------|-------|
| `tests/test_generic_processing.py` | `/process`, `/analyze`, session cookies, registry mocks. |
| `tests/test_ai_service_registry.py` | Registration, metadata, health checks. |
| `tests/test_rate_limit.py` | Token bucket, overrides, concurrency. |
| `tests/test_error_handling.py` | Unified error envelopes, logging, headers. |
| `tests/test_jwt_security.py` | Sanitised error messages, attack vectors, PII-free logs. |
| `tests/test_http_client.py` | HTTP wrapper resilience (timeouts, retries). |
| `tests/test_middleware.py` | CORS, security headers, middleware order. |

### Frontend Tests (Jest)
| Component | Focus |
|-----------|-------|
| UI Components | React component rendering, props, interactions |
| Auth Components | Protected routes, session handling |
| Hook Testing | Custom hooks for API calls, state management |
| Utility Functions | Helper functions, type guards, formatters |

**Total coverage:** 117 backend + 37 frontend = **154 tests**

---

## 🔄 Session-friendly Testing

Authentication-sensitive tests now set cookies directly:
```python
from app.core.session import create_session_token, COOKIE_NAME

self.client.cookies.set(
    COOKIE_NAME,
    create_session_token(user_id="test", email="test@example.com")
)
```

This mirrors the production flow (NextAuth proxy + session cookies) and keeps tests realistic.

---

## 🧰 Helpful Flags

| Variable | Effect |
|----------|--------|
| `TESTING=1` | Enables testing shortcuts (dummy env vars, logging tweaks). |
| `LOG_LEVEL=DEBUG` | Emits verbose logs for flaky-test debugging. |
| `PYTEST_ADDOPTS="-k keyword"` | Run a focused subset. |

---

## 📦 CI Integration

Add this to GitHub Actions:
```yaml
# Backend tests
- name: Run backend tests
  working-directory: pluginmind_backend
  env:
    TESTING: "1"
  run: |
    pip install -r requirements.txt
    pytest

# Frontend tests
- name: Run frontend tests
  working-directory: frontend
  run: |
    pnpm install
    pnpm test
```

Optional: run `scripts/smoke_backend.sh` after deployment to hit `/health`, `/ready`, and `/services`.

---

## 🎯 Best Practices

- Keep external calls mocked (`httpx` + dependency overrides) so the suite remains deterministic.
- Add regression tests alongside new endpoints—use the existing fixtures as references.
- Update documentation (`docs2/operations/testing.md`, that’s this file!) whenever you expand coverage areas.

Happy testing! ✅
