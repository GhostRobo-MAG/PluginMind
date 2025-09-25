# 🧩 Workflow Development Guide

This guide shows how to build and evolve workflows on top of PluginMind’s AI service registry. Everything here reflects the current implementation—no secret features required.

---

## 🎯 Goals
- Understand how a request flows through `/process`.
- Extend the prompt templates to support new analysis styles.
- Wire custom business logic into the registry (fallbacks, metadata, job tracking).

---

## 🧠 How `/process` Works

1. **Session guard** – `get_session_user` verifies the `pm_session` cookie.
2. **User tracking** – `user_service.get_or_create_user` loads/creates the SQLModel user and enforces query limits.
3. **Analysis orchestration** – `analysis_service.analyze_generic` runs the workflow:
   ```python
   system_prompt = prompt_engine.get_system_prompt(analysis_type)
   optimizer = registry.get_preferred_service(AIServiceType.PROMPT_OPTIMIZER)
   optimized_prompt = await optimizer.process(user_input)
   analyzer = self._get_analyzer_for_type(analysis_type)
   analysis_result = await analyzer.process(optimized_prompt)
   ```
4. **Persistence** – results are written to `analysis_results` (when a database session is supplied).
5. **Response** – `GenericAnalysisResponse` serialises the outcome.

The legacy `/analyze` endpoint reuses the same building blocks but always chooses the crypto analyzer for backward compatibility.

---

## 🪄 Customising Prompt Templates

`app/ash_prompt.py` controls the 4-D methodology prompts. To add or tweak a template:

1. Extend the `AnalysisType` enum if you need a new keyword.
2. Provide a `_get_<type>_template` function that returns a multi-line string.
3. Register the template in the `PromptTemplateEngine` constructor.

Example snippet:
```python
class AnalysisType(str, Enum):
    DOCUMENT = "document"
    CODE = "code"          # new type

class PromptTemplateEngine:
    def __init__(self):
        self.templates = {
            AnalysisType.DOCUMENT: self._get_document_template(),
            AnalysisType.CODE: self._get_code_template(),
            ...
        }
```

Once deployed, clients can call `/process` with `"analysis_type": "code"` and the new template will be used automatically, provided the registry can supply an analyzer for that type (see next section).

---

## 🔌 Choosing the Right AI Service

Service routing lives in `analysis_service._get_analyzer_for_type`:

| Analysis Type | Service Type Used | Default Provider |
|---------------|------------------|------------------|
| `document`    | `DOCUMENT_PROCESSOR` | OpenAI (with Grok as fallback) |
| `chat`        | `CHAT_PROCESSOR`     | OpenAI |
| `seo`         | `SEO_GENERATOR`      | OpenAI |
| `crypto`      | `CRYPTO_ANALYZER`    | Grok |
| `custom`      | `GENERIC_ANALYZER`   | OpenAI (Grok as fallback) |

If no dedicated service exists, the code gracefully falls back to the generic analyzer. You can override this behaviour by:

1. Registering a new service and tags in `service_initialization.py`.
2. Extending the `service_mapping` dict within `_get_analyzer_for_type`.
3. Optionally adjusting the fallback logic for fine control.

---

## 🔁 Advanced Patterns

### 1. Fallback to Custom
If a specialised service fails, the workflow will automatically retry using `AnalysisType.CUSTOM`:
```python
except Exception as e:
    if use_fallback and analysis_type != AnalysisType.CUSTOM:
        return await self.analyze_generic(..., AnalysisType.CUSTOM, ...)
    raise AIServiceError("Analysis failed: ...")
```

### 2. Async Jobs
Use `/analyze-async` when you want to decouple request/response timing. The helper functions in `app/utils/background_tasks.py` handle:
- job creation (`create_analysis_job`)
- status transitions (`process_analysis_background`)
- error capture (`job.error` field)

### 3. Metadata Enrichment
`analyze_generic` returns a `metadata` dictionary. Populate it with timing, token counts, or cost tracking to surface richer insights to the caller.

---

## 🧰 Developer Checklist

- [x] Set `MAX_USER_INPUT_LENGTH` in `.env` to safeguard prompt sizes.
- [x] Add regression tests when you introduce new analysis types (see `tests/test_generic_processing.py`).
- [x] Use the health endpoints before enabling new workflows in production.
- [ ] (Optional) Store additional artefacts—structured JSON, embeddings, etc.—inside `AnalysisResult.result_data`.

---

## 🤝 Tips for Collaboration

- Keep new analysis types lowercase and hyphen-free so they fit naturally into URLs and enums.
- If you need multi-step flows (e.g., summarise → sentiment → recommendations), orchestrate them inside `analysis_service` before returning to the client.
- Document user-facing behaviour in `docs2/api/endpoints.md` whenever you adjust request/response shapes.

Happy orchestrating! ✨
