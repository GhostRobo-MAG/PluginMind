# 🛡️ Security Hardening Guide

PluginMind ships with a secure-by-default posture. This guide summarises what’s already enforced and how you can take it further.

---

## 🔒 Built-in Defences

| Layer | Protection |
|-------|------------|
| Authentication | Session-cookie auth with signed JWT (`pm_session`). Tokens never touch client storage. |
| Middleware | Correlation IDs, CORS whitelist, security headers, request body size limits, ambient JWT logging. |
| Rate Limiting | Dual token buckets (`user:<id>` and `ip:<addr>`) with `Retry-After` headers. |
| Error Handling | Single error envelope; sensitive details never exposed. |
| Input Validation | Pydantic models enforce length & type for all request bodies. |

---

## ✅ Recommended Settings

```bash
# Required in production
ENVIRONMENT=production
CORS_ORIGINS=https://app.yourdomain.com
BACKEND_SESSION_SECRET=your-64-char-secret
LOG_LEVEL=INFO

# Optional
SESSION_COOKIE_DOMAIN=.yourdomain.com
RATE_LIMIT_PER_MIN=60
RATE_LIMIT_IP_PER_MIN=300
```

- **HTTPS only** – terminate TLS before traffic reaches FastAPI; forward `X-Forwarded-Proto` if using a reverse proxy.
- **Strict CORS** – avoid wildcard origins; set the exact app domains.
- **Secure cookies** – `ENVIRONMENT=production` automatically flips the cookie to `Secure=True`.

---

## 🧪 Security Testing Checklist

- [x] Ensure endpoints return `401` when `pm_session` is missing.
- [x] Confirm `/auth/logout` clears the cookie and the session becomes invalid immediately.
- [x] Run `pytest tests/test_jwt_security.py` to validate sanitised error messages and attack vector coverage.
- [x] Review application logs; they should omit email addresses (PII stripping is enforced).

---

## 🔐 Harden the Frontend

- Set `NEXT_PUBLIC_SECURE_TOKENS=true` so NextAuth exposes only `session.hasToken` to the browser.
- Always call `fetch`/`axios` with `credentials: 'include'` so cookies ride along automatically.
- Use the proxy route exclusively—never call the backend directly from the browser with raw ID tokens.

---

## 🧭 Incident Response Tips

1. **Detect** – watch for spikes in 401/429 via log aggregation.
2. **Contain** – rotate `BACKEND_SESSION_SECRET` to invalidate active sessions.
3. **Investigate** – search logs by correlation ID (available in every response).
4. **Recover** – re-enable traffic once `/ready` and `/services/health` show green.

---

## 🛠️ Extend the Shield

- Integrate a WAF or API gateway for geo/IP blocking.
- Store hashed API usage metadata in `query_logs` for forensic analysis.
- Add Prometheus metrics (planned—the roadmap includes `/metrics`).
- Configure alerting on repeated rate-limit hits per user.

Stay secure and keep iterating! 🧑‍💻
