# 🔌 AI Service Integration Guide

Want to add Anthropic Claude, Google Gemini, or your own in-house model? This guide walks through the exact steps required to plug new services into PluginMind’s registry.

---

## 🧩 Registry Recap

- All services implement `AIService` from `app/services/ai_service_interface.py`.
- Each registration provides a **service ID** (string) and an **`AIServiceType`** (prompt optimizer, document processor, etc.).
- The registry stores metadata so `/services` and `/services/health` can report capabilities.

```python
ai_service_registry.register(
    service_id="openai_document",
    service=openai_service,
    service_type=AIServiceType.DOCUMENT_PROCESSOR,
    replace_if_exists=True
)
```

---

## 🛠️ Step-by-Step Integration

### 1. Implement the Service Class
Create a file such as `app/services/claude_service.py`.

```python
from typing import Any, Dict
import httpx

from app.services.ai_service_interface import AIService, AIServiceMetadata, AIServiceCapability
from app.core.exceptions import AIServiceError
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class ClaudeService(AIService):
    def __init__(self):
        self.api_key = settings.anthropic_api_key  # add to Settings
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is required")
        self.client = httpx.AsyncClient(timeout=settings.http_timeout_seconds)

    def get_metadata(self) -> AIServiceMetadata:
        return AIServiceMetadata(
            name="Anthropic Claude",
            provider="Anthropic",
            version="1",
            model=settings.claude_model,
            capabilities=[
                AIServiceCapability.PROMPT_OPTIMIZATION,
                AIServiceCapability.DOCUMENT_SUMMARIZATION
            ],
        )

    async def process(self, input_text: str, **kwargs) -> str:
        payload = {
            "model": settings.claude_model,
            "max_tokens": kwargs.get("max_tokens", 1024),
            "temperature": kwargs.get("temperature", 0.7),
            "prompt": input_text
        }
        headers = {
            "x-api-key": self.api_key,
            "content-type": "application/json"
        }
        try:
            response = await self.client.post(
                "https://api.anthropic.com/v1/complete",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data["completion"].strip()
        except httpx.HTTPError as exc:
            logger.error(f"Claude request failed: {exc}")
            raise AIServiceError("Claude integration failed")

    async def health_check(self) -> bool:
        try:
            await self.client.get("https://api.anthropic.com/health")
            return True
        except Exception:
            return False
```

### 2. Extend Settings
Update `app/core/config.py` so new environment variables are available (and provide safe defaults in testing mode):
```python
self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
self.claude_model = os.getenv("CLAUDE_MODEL", "claude-3-opus-20240229")
```

### 3. Register the Service
Modify `initialize_ai_services()` in `app/services/service_initialization.py`:
```python
from app.services.claude_service import ClaudeService

claude_service = ClaudeService()
ai_service_registry.register(
    service_id="claude_document",
    service=claude_service,
    service_type=AIServiceType.DOCUMENT_PROCESSOR,
    replace_if_exists=False
)
```

If Claude becomes your preferred document analyzer, register it *before* Grok or OpenAI so the “first in wins” rule selects it automatically.

### 4. Wire Into Workflows (Optional)
Adjust `_get_analyzer_for_type` to prefer the new service:
```python
service_mapping = {
    AnalysisType.DOCUMENT: AIServiceType.DOCUMENT_PROCESSOR,
    AnalysisType.CHAT: AIServiceType.CHAT_PROCESSOR,
    AnalysisType.SEO: AIServiceType.SEO_GENERATOR,
    AnalysisType.CUSTOM: AIServiceType.GENERIC_ANALYZER,
}
```
If you added a brand-new `AnalysisType`, map it here and provide a prompt template in `ash_prompt.py`.

### 5. Update Docs & Tests
- Document the new service in `docs2/api/endpoints.md` and `docs2/guides/workflow-development.md`.
- Add a simple registry unit test (see `tests/test_ai_service_registry.py`) to ensure registration succeeds.
- Optionally mock the new provider inside integration tests to verify `/process` responses.

---

## 🧪 Testing Checklist

- [x] `TESTING=1 pytest` to ensure the suite still passes.
- [x] `pytest tests/test_ai_service_registry.py::TestServiceRegistration::test_dynamic_registration` to confirm metadata.
- [x] Use `/services` and `/services/health` endpoints locally to verify health reports.

---

## 🛡️ Best Practices

- Keep API keys out of source control (use `.env` or secret managers).
- Set conservative HTTP timeouts and retries—don’t block the event loop.
- Populate `AIServiceMetadata.capabilities` accurately; it powers dashboards and future workflow builders.
- Implement `health_check()` even if it just returns `True`—this keeps `/services/health` meaningful.
- For cost visibility, store usage metrics in `metadata` returned from `analyze_generic`.

---

## 💡 Example Environment Variables
```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-3-haiku-20240307

# Google Gemini
GOOGLE_AI_API_KEY=AIza...
GEMINI_MODEL=gemini-1.5-pro
```

Add them to your deployment secrets and expose a feature flag (e.g., `ENABLE_CLAUDE=true`) if you want runtime toggles.

Happy integrating! 🤝
