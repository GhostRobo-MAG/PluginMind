# 🗄️ Database Schema

PluginMind uses [SQLModel](https://sqlmodel.tiangolo.com/) for typed models that map directly to FastAPI responses. The same schema works with SQLite (dev/test) and PostgreSQL (production).

---

## 🔑 Connection

`app/database.py` creates a shared engine using `settings.database_url`. Example values:
- `sqlite:///./pluginmind.db`
- `postgresql://pluginmind:password@postgres:5432/pluginmind`

Sessions are provided through the `get_session` dependency.

---

## 📋 Tables

### `users`
Tracks authenticated users and usage counters.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Auto-increment. |
| `email` | TEXT UNIQUE | Primary identifier for session management. |
| `google_id` | TEXT UNIQUE NULLABLE | Stored when provided by Google token. |
| `subscription_tier` | TEXT | `free` by default. |
| `queries_used` | INTEGER | Incremented per successful `/process` call. |
| `queries_limit` | INTEGER | Default 10. |
| `is_active` | BOOLEAN | Soft enable/disable. |
| `created_at` | DATETIME | Set on creation. |

### `analysis_jobs`
Persists async requests (`/analyze-async`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Internal ID. |
| `job_id` | TEXT UNIQUE | UUID exposed to clients. |
| `user_input` | TEXT | Original request body. |
| `status` | TEXT | Enum: `queued`, `processing_openai`, `processing_grok`, `completed`, `failed`. |
| `created_at` | DATETIME | Job creation time. |
| `completed_at` | DATETIME NULLABLE | Set on completion/failure. |
| `optimized_prompt` | TEXT NULLABLE | Saved result from OpenAI. |
| `analysis` | TEXT NULLABLE | Saved result from Grok. |
| `error` | TEXT NULLABLE | User-friendly error message. |
| `user_id` | TEXT NULLABLE | Reference to `users.google_id`/`email`. |
| `cost` | FLOAT NULLABLE | Reserved for future billing. |

### `query_logs`
Captures synchronous `/process` calls (success or failure).

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Auto increment. |
| `user_id` | TEXT NULLABLE | Email or Google ID. |
| `user_input` | TEXT | Truncated in responses for readability. |
| `optimized_prompt` | TEXT NULLABLE | Saved prompt optimiser output. |
| `ai_result` | TEXT NULLABLE | Serialized analysis result. |
| `created_at` | DATETIME | Timestamp. |
| `response_time_ms` | INTEGER NULLABLE | Measured latency. |
| `success` | BOOLEAN | True/False. |
| `error_message` | TEXT NULLABLE | Captured error string. |
| `openai_cost` | FLOAT NULLABLE | Placeholder for usage tracking. |
| `grok_cost` | FLOAT NULLABLE | Placeholder. |
| `total_cost` | FLOAT NULLABLE | Placeholder. |

### `analysis_results`
Flexible storage for generic analyses (used when a DB session is provided to `analyze_generic`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK |
| `analysis_id` | TEXT UNIQUE | External reference (UUID). |
| `analysis_type` | TEXT | Mirrors `AnalysisType` enum values. |
| `user_id` | TEXT NULLABLE | Owning user. |
| `user_input` | TEXT | Original content. |
| `result_data` | JSON NULLABLE | Structured result body. |
| `processing_metadata` | JSON NULLABLE | Arbitrary metadata (timings, provider info). |
| `created_at` | DATETIME | Stored automatically. |
| `updated_at` | DATETIME NULLABLE |
| `processing_time_ms` | INTEGER NULLABLE |
| `ai_service_used` | TEXT NULLABLE |
| `cost` | FLOAT NULLABLE |
| `status` | TEXT | Enum: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`. |
| `error_details` | TEXT NULLABLE |

---

## 🧬 Enums

Located in `app/models/enums.py`:
- `JobStatus` → `QUEUED`, `PROCESSING_OPENAI`, `PROCESSING_GROK`, `COMPLETED`, `FAILED`.
- `AnalysisResultStatus` (inside `database.py`) → `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`.

---

## 🛠️ Migrations

- Alembic is configured (`alembic.ini`, `alembic/`).
- Generate migrations with `alembic revision --autogenerate -m "message"`.
- Apply migrations using `alembic upgrade head`.

---

## 💡 Notes & Tips

- SQLite stores the database in the repository root (`pluginmind_backend/test.db`) during tests—`tests/conftest.py` cleans it up automatically.
- When using Postgres, set `DATABASE_URL` and ensure the role has rights to create tables (FastAPI calls `SQLModel.metadata.create_all()` on startup).
- Want audit history? Add triggers or extend SQLModel models to include `updated_at` alongside `created_at`.

Happy modelling! 🧮
