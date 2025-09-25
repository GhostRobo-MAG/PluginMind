# 🚀 Advanced Deployment Guide

Deploy PluginMind with confidence using the existing Docker assets, environment validation tooling, and health checks.

---

## 🏗️ Deployment Building Blocks

- **Dockerfile** (`pluginmind_backend/Dockerfile`) – Multi-stage build with `development`, `production`, and `testing` targets.
- **docker-compose.yml** – Orchestrates FastAPI, Postgres, Redis (optional), and Nginx reverse proxy.
- **scripts/validate_env.py** – Fail-fast validation for critical environment variables.
- **scripts/smoke_backend.sh** / `smoke_errors.sh` – Quick smoke tests post-deploy.

---

## 🐳 Production Image

```bash
cd pluginmind_backend
# Build minimal production image
docker build -t pluginmind-backend:prod --target production .

# Run with external env file
docker run -d \
  --name pluginmind-backend \
  --env-file .env.production \
  -p 8000:8000 \
  pluginmind-backend:prod
```

**Key environment variables**
```bash
APP_NAME=PluginMind Backend API
APP_VERSION=2.0.0
DATABASE_URL=postgresql://user:pass@db:5432/pluginmind
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
BACKEND_SESSION_SECRET=super-secret
CORS_ORIGINS=https://app.pluginmind.ai
LOG_LEVEL=INFO
```

---

## 🧪 Validate Before You Deploy

Run the environment validator locally or in CI:
```bash
cd pluginmind_backend
python scripts/validate_env.py
```
It checks for:
- Required API keys and secrets.
- Proper Google Client ID format.
- Numeric config ranges (timeouts, rate limits).
- Production-only requirements (no wildcard CORS, etc.).

---

## 📦 docker-compose (Staging / Dev)

```bash
DOCKER_TARGET=production docker compose up -d
```

Services launched:
- `backend` – FastAPI app (gunicorn in production target).
- `postgres` – Data store.
- `redis` – Optional cache/rate-limit backend (not yet used but provisioned).
- `nginx` – Reverse proxy (under the `production` profile).

Tune with environment overrides (see `docker-compose.yml`).

---

## 🧭 Health Checks & Observability

| Endpoint | Use Case |
|----------|----------|
| `/health` | L7 health probe and legacy job cleanup. |
| `/ready` | Kubernetes/Load balancer readiness; checks DB + env vars. |
| `/live` | Simple process liveness. |
| `/services` | Registry snapshot (registered services + health). |
| `/services/health` | Raw health map from the analysis service. |

Configure your orchestrator (Kubernetes, ECS, Nomad) to poll these endpoints.

---

## 📚 Database Migrations

1. Copy `alembic.ini` and `alembic/` to your deployment context.
2. Run migrations after provisioning the database:
   ```bash
   cd pluginmind_backend
   alembic upgrade head
   ```
3. To create new migrations:
   ```bash
   alembic revision --autogenerate -m "add claude service tables"
   ```

---

## 🔒 Security Considerations

- Set `ENVIRONMENT=production` so `/auth/google` issues secure cookies.
- Provide `SESSION_COOKIE_DOMAIN` if using subdomains.
- Terminate TLS at Nginx or your ingress controller; forward `X-Forwarded-Proto` so FastAPI knows it’s secure.
- Rate limiting is enforced per IP/user via Redis-like token bucket (`app/utils/rate_limit.py`). Ensure latency between app and store is low.

---

## 🧾 Logging & Metrics

- Logs are structured through `app/core/logging.py`; configure `LOG_FORMAT` and `LOG_LEVEL` via env.
- Correlation IDs flow from the `X-Request-ID` header. Upstream proxies should preserve it.
- Metrics endpoints (`/metrics`) are not yet implemented—see the roadmap for planned Prometheus integration.

---

## 🧯 Disaster Recovery Tips

- **Database** – Back up the `analysis_jobs`, `analysis_results`, and `query_logs` tables regularly.
- **Secrets** – Rotate `BACKEND_SESSION_SECRET` after suspected compromise. Active sessions will immediately become invalid.
- **Failover** – Use `/services/health` to decide when to route traffic away if either OpenAI or Grok goes down.

---

## ✅ Deployment Checklist

- [ ] Run `scripts/validate_env.py`.
- [ ] Build the production image.
- [ ] Run alembic migrations.
- [ ] Smoke test with `scripts/smoke_backend.sh`.
- [ ] Confirm `/ready` and `/services` return healthy response.
- [ ] Enable monitoring for error rates and rate-limit spikes.

Happy shipping! 🌟
