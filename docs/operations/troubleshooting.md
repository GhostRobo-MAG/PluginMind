# 🧯 Troubleshooting Guide

Use this playbook to resolve the most common issues when running PluginMind.

---

## 🔑 Authentication Issues

### "Authentication required" (401)
- Ensure the frontend sends requests through `/api/proxy/...` with `credentials: 'include'`.
- Confirm `pm_session` cookie exists in the browser (Application → Cookies in devtools).
- Re-run the bind flow: `POST /api/proxy/auth/google` with header `x-use-id-token: true`.

### Session works locally but not in production
- Check `ENVIRONMENT=production` so cookies are `Secure`.
- Set `SESSION_COOKIE_DOMAIN=.yourdomain.com` if backend and frontend are on different subdomains.

---

## 🧠 AI Service Failures

### `/process` returns 502 or "External AI service temporarily unavailable"
- Verify `OPENAI_API_KEY` and `GROK_API_KEY` are set.
- Hit `/services` to ensure both services show up.
- Restart the backend to re-register services if environment variables changed.

### Async job stuck in `processing_openai`
- Inspect logs for errors from `background_tasks.process_analysis_background`.
- Pull job details using `GET /analyze-async/{job_id}` to see `job.error`.

---

## 🗃️ Database Problems

### "no such table"
- Run `alembic upgrade head` after configuring `DATABASE_URL`.
- For SQLite in development, delete `pluginmind_backend/test.db` and restart the server.

### Readiness probe fails with DB error
- Check connection string credentials.
- Ensure the Postgres service is reachable from the backend container.

---

## 🚦 Rate Limiting

### Frequent 429 responses
- Increase `RATE_LIMIT_PER_MIN` and `RATE_LIMIT_IP_PER_MIN` for heavy loads.
- Inspect access logs to confirm traffic pattern; bots often hammer the same endpoint.
- If testing locally, lower concurrency or add test-specific overrides.

---

## 🧪 Test Failures

### `ModuleNotFoundError: No module named 'app'`
- Make sure you are running pytest from `pluginmind_backend/`.
- Verify `tests/conftest.py` contains the path injection patch (already included in this repo).

### JWT tests hitting Google APIs
- The suite mocks `id_token.verify_oauth2_token`; if you changed imports, update the mock path.

---

## 🛡️ Security Checks

### Cookie not set
- Confirm the proxy adds `x-use-id-token: true` header on bind.
- Ensure clocks between frontend and backend are in sync (JWT expiration is strict).

### Logs contain PII
- Sanitisation is enforced, but if you add new log statements, avoid embedding emails or tokens.

---

## 🧭 Resources

- `/health`, `/ready`, `/services` – quick health indicators.
- `scripts/smoke_backend.sh` – CLI smoke test after deploy.
- `docs2/guides/security-hardening.md` – security best practices.

Stay calm and debug on! 🔍
