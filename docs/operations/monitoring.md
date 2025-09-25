# 🔭 Monitoring & Observability

PluginMind includes lightweight observability hooks out of the box. This guide shows how to use them and where to extend.

---

## 📈 Health Endpoints

| Endpoint | Description | Typical Response |
|----------|-------------|------------------|
| `/health` | L7 health probe + legacy job cleanup. | `{ "status": "ok", "active_jobs": 0 }` |
| `/live` | Process liveness. | `{ "status": "live" }` |
| `/ready` | Readiness (DB + env checks). | `200` or `503` with diagnostic payload. |
| `/services` | Combined registry + health snapshot. | `{ "registry_info": ..., "health_status": ... }` |
| `/services/health` | Raw registry health map. | `{ "timestamp": "...", "overall_healthy": true, "service_details": { ... } }` |
| `/version` | Deployment metadata. | `{ "name": "PluginMind Backend API", "version": "2.0.0", "git_sha": "..." }` |

Use these endpoints with your load balancer, Kubernetes probes, or uptime monitors.

---

## 🪵 Structured Logging

- Configured in `app/core/logging.py`.
- Automatically injects `request_id` and `route` (via `CorrelationIdMiddleware`).
- Sample log format: `2025-09-18T16:18:03Z app.api.routes.analysis INFO ... request_id=<uuid> route=/process`.

**Tips**
- Forward `X-Request-ID` from upstream clients to stitch logs end-to-end.
- Set `LOG_LEVEL=DEBUG` temporarily when debugging request pipelines.

---

## 🚦 Rate Limit Insights

Every response carries:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
```
When limits are exceeded, the backend adds `Retry-After` (seconds) and returns `429`. Watch your access logs for repeated 429s—they often signal abusive clients or misconfigured frontends.

---

## 🧮 Metrics (Roadmap)

Prometheus metrics are not yet exposed, but the planned counters include:
- `http_requests_total`
- `ai_requests_total`
- `ai_request_duration_seconds`

Track the roadmap in [`docs2/README.md`](../README.md#️-roadmap-next-up) for progress.

---

## 🛠️ Integrations

| Tool | Recommended Setup |
|------|-------------------|
| **Grafana/Loki** | Ship container logs and filter by `request_id`. |
| **Prometheus** | Scrape health endpoints now; upgrade to metrics endpoint when available. |
| **PagerDuty** | Alert on `/ready` returning 503 or repeated 429 responses. |

---

## 🧭 Observability Checklist

- [ ] Health endpoints wired into your orchestrator.
- [ ] Logs aggregated with correlation IDs preserved.
- [ ] Rate-limit spikes tracked (watch for 429 storms).
- [ ] `/services` polled periodically to detect AI provider outages.
- [ ] Roadmap items (metrics, tracing) reviewed as they ship.

Stay observant! 👀
