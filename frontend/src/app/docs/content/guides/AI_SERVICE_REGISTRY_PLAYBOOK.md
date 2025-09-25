# AI Service Registry Playbook
## Comprehensive Guide for PluginMind's AI Orchestration System

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Service Types & Capabilities](#service-types--capabilities)
4. [Configuration & Setup](#configuration--setup)
5. [Service Chaining Patterns](#service-chaining-patterns)
6. [Modern Use Cases](#modern-use-cases)
7. [Integration Guide](#integration-guide)
8. [Performance Optimization](#performance-optimization)
9. [Current Issues & Solutions](#current-issues--solutions)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Extension & Customization](#extension--customization)

---

## Executive Summary

The AI Service Registry is a **workflow orchestration system** designed to chain multiple AI services together for complex processing tasks. Instead of relying on a single AI service, it enables sophisticated pipelines where different services contribute their specialized capabilities.

### Key Value Propositions:
- **Service Specialization**: OpenAI for language tasks, Grok for analysis
- **Workflow Composability**: Chain services for multi-step processing
- **Fallback & Reliability**: Automatic failover between services
- **Cost Optimization**: Choose optimal service based on task requirements
- **Extensibility**: Easy integration of new AI providers

### Current State:
- **Working**: Basic service registration and selection
- **Limited**: Currently configured for legacy crypto analysis
- **Potential**: Can be adapted for modern workflows (document processing, content creation, research)

---

## Architecture Overview

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Frontend UI    │    │ Analysis Service │    │ AI Service      │
│                 │    │  (Orchestrator)  │    │   Registry      │
│ Service Selector├────┤                  ├────┤                 │
│ Analysis Form   │    │ Chain Services   │    │ Service Pool    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │   AI Service Pool    │
                    │                      │
                    │ ┌─────────────────┐  │
                    │ │   OpenAI        │  │
                    │ │ - Optimization  │  │
                    │ │ - Generation    │  │
                    │ │ - Extraction    │  │
                    │ └─────────────────┘  │
                    │                      │
                    │ ┌─────────────────┐  │
                    │ │   Grok          │  │
                    │ │ - Analysis      │  │
                    │ │ - Sentiment     │  │
                    │ │ - Prediction    │  │
                    │ └─────────────────┘  │
                    └──────────────────────┘
```

### Registry Structure

```python
class AIServiceRegistry:
    _services: Dict[str, AIService]              # service_id -> service instance
    _service_types: Dict[AIServiceType, List]    # type -> list of service_ids
    _capabilities: Dict[AIServiceCapability, List] # capability -> list of service_ids
```

### Service Selection Logic

```python
def get_preferred_service(service_type: AIServiceType) -> AIService:
    """Returns the FIRST registered service of the given type"""
    services = self._service_types.get(service_type, [])
    return self._services[services[0]] if services else None
```

**⚠️ Critical Insight**: The registry returns the **first** registered service, not the last. This affects service precedence.

---

## Service Types & Capabilities

### Available Service Types

| Service Type | Purpose | Current Assignment |
|--------------|---------|-------------------|
| `PROMPT_OPTIMIZER` | Enhance/restructure user input | OpenAI only |
| `GENERIC_ANALYZER` | General purpose analysis | OpenAI (first), Grok (second) |
| `DOCUMENT_PROCESSOR` | Handle documents/text | Grok (overrides OpenAI) |
| `CHAT_PROCESSOR` | Conversational AI | OpenAI only |
| `SEO_GENERATOR` | SEO optimization | OpenAI only |
| `CRYPTO_ANALYZER` | Legacy crypto analysis | Grok only |

### Service Capabilities Matrix

| Capability | OpenAI | Grok | Best Use Case |
|------------|--------|------|---------------|
| **PROMPT_OPTIMIZATION** | ✅ | ❌ | Restructuring unclear user requests |
| **GENERIC_ANALYSIS** | ✅ | ✅ | General purpose analysis tasks |
| **DOCUMENT_SUMMARIZATION** | ✅ | ✅ | Creating executive summaries |
| **DOCUMENT_ANALYSIS** | ✅ | ✅ | Deep content analysis |
| **KEY_EXTRACTION** | ✅ | ❌ | Pulling important points from text |
| **CONVERSATION_HANDLING** | ✅ | ❌ | Chat interfaces and dialogue |
| **CONTENT_OPTIMIZATION** | ✅ | ❌ | SEO and readability improvement |
| **CRYPTO_ANALYSIS** | ❌ | ✅ | Market and financial analysis |
| **SENTIMENT_ANALYSIS** | ❌ | ✅ | Emotion and tone detection |
| **NEWS_SUMMARIZATION** | ❌ | ✅ | Current events processing |

### Service Metadata

```python
# OpenAI Configuration
{
    "name": "OpenAI AI Service",
    "provider": "OpenAI",
    "model": "gpt-4o-mini",  # Configurable via OPENAI_MODEL
    "max_tokens": 4000,
    "temperature": 0.7,      # 1.0 for GPT-5
    "specialties": ["language", "generation", "optimization"]
}

# Grok Configuration
{
    "name": "Grok AI Service", 
    "provider": "xAI",
    "model": "grok-beta",    # Configurable via GROK_MODEL
    "max_tokens": 3000,
    "temperature": 0.8,
    "specialties": ["analysis", "sentiment", "prediction"]
}
```

---

## Configuration & Setup

### Environment Variables

#### Backend Configuration

```bash
# Core Settings
MAX_USER_INPUT_LENGTH=5000              # Input validation limit
OPENAI_API_KEY=sk-your-key-here         # Required
GROK_API_KEY=xai-your-key-here          # Required

# Model Selection
OPENAI_MODEL=gpt-4o-mini                # gpt-4o-mini, gpt-4, gpt-5-preview
GROK_MODEL=grok-beta                    # grok-beta

# Timeout Configuration
OPENAI_READ_TIMEOUT=30                  # HTTP read timeout
OPENAI_WRITE_TIMEOUT=30                 # HTTP write timeout
GROK_READ_TIMEOUT=45                    # Grok is typically slower
GROK_WRITE_TIMEOUT=45

# Retry Configuration
HTTP_MAX_RETRIES=3                      # Max retry attempts
HTTP_RETRY_DELAY=1.0                    # Delay between retries
```

#### Frontend Configuration

```bash
# API Timeouts
NEXT_PUBLIC_API_TIMEOUT=30000           # General API calls (30s)
NEXT_PUBLIC_AI_TIMEOUT=90000            # AI operations (90s)

# Backend Connection
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
```

### Service Initialization

The registry is initialized at application startup:

```python
# app/services/service_initialization.py
def initialize_ai_services():
    # OpenAI Registrations
    openai_service = OpenAIService()
    
    ai_service_registry.register("openai_optimizer", openai_service, 
                                AIServiceType.PROMPT_OPTIMIZER)
    ai_service_registry.register("openai_generic", openai_service, 
                                AIServiceType.GENERIC_ANALYZER)
    
    # Grok Registrations  
    grok_service = GrokService()
    
    ai_service_registry.register("grok_analyzer", grok_service, 
                                AIServiceType.CRYPTO_ANALYZER)
    ai_service_registry.register("grok_generic", grok_service, 
                                AIServiceType.GENERIC_ANALYZER)  # Appended, not preferred
```

**⚠️ Issue**: Grok doesn't override OpenAI for `GENERIC_ANALYZER` due to registration order.

---

## Service Chaining Patterns

### Pattern 1: Sequential Processing

**Use Case**: Document Analysis Pipeline

```python
async def document_analysis_workflow(document_text: str):
    # Step 1: Extract key information
    extractor = registry.get_preferred_service(AIServiceType.DOCUMENT_PROCESSOR)
    key_points = await extractor.process(document_text)
    
    # Step 2: Analyze sentiment
    analyzer = registry.get_services_by_capability(AIServiceCapability.SENTIMENT_ANALYSIS)[0]
    sentiment = await analyzer.process(key_points)
    
    # Step 3: Generate summary
    summarizer = registry.get_services_by_capability(AIServiceCapability.DOCUMENT_SUMMARIZATION)[0]
    summary = await summarizer.process(f"{key_points}\n\nSentiment: {sentiment}")
    
    return {
        "key_points": key_points,
        "sentiment": sentiment,
        "summary": summary
    }
```

### Pattern 2: Parallel Processing

**Use Case**: Content Quality Analysis

```python
async def content_quality_check(content: str):
    # Run multiple analyses in parallel
    tasks = [
        seo_service.process(content),           # SEO scoring
        sentiment_service.process(content),     # Sentiment analysis  
        readability_service.process(content)    # Readability check
    ]
    
    seo_score, sentiment, readability = await asyncio.gather(*tasks)
    
    return {
        "seo_score": seo_score,
        "sentiment": sentiment,
        "readability": readability,
        "overall_score": calculate_overall_score(seo_score, sentiment, readability)
    }
```

### Pattern 3: Conditional Chaining

**Use Case**: Smart Response Generation

```python
async def smart_response_workflow(user_input: str, context: dict):
    # Step 1: Optimize the prompt
    optimizer = registry.get_preferred_service(AIServiceType.PROMPT_OPTIMIZER)
    optimized_prompt = await optimizer.process(user_input)
    
    # Step 2: Determine response type needed
    if context.get("requires_analysis"):
        # Use Grok for analytical responses
        responder = registry.get_services_by_capability(AIServiceCapability.GENERIC_ANALYSIS)[0]
    elif context.get("conversational"):
        # Use OpenAI for conversational responses
        responder = registry.get_preferred_service(AIServiceType.CHAT_PROCESSOR)
    else:
        # Default to generic analyzer
        responder = registry.get_preferred_service(AIServiceType.GENERIC_ANALYZER)
    
    response = await responder.process(optimized_prompt)
    return response
```

### Pattern 4: Iterative Refinement

**Use Case**: Content Creation & Optimization

```python
async def content_creation_workflow(topic: str, target_audience: str):
    # Step 1: Generate initial content
    generator = registry.get_preferred_service(AIServiceType.CHAT_PROCESSOR)
    initial_content = await generator.process(f"Write about {topic} for {target_audience}")
    
    # Step 2: Optimize for SEO
    seo_optimizer = registry.get_services_by_capability(AIServiceCapability.CONTENT_OPTIMIZATION)[0]
    seo_content = await seo_optimizer.process(f"Optimize for SEO: {initial_content}")
    
    # Step 3: Check sentiment appropriateness
    sentiment_checker = registry.get_services_by_capability(AIServiceCapability.SENTIMENT_ANALYSIS)[0]
    sentiment_feedback = await sentiment_checker.process(seo_content)
    
    # Step 4: Final refinement if needed
    if "negative" in sentiment_feedback.lower():
        refiner = registry.get_preferred_service(AIServiceType.CHAT_PROCESSOR)
        final_content = await refiner.process(f"Make this more positive: {seo_content}")
    else:
        final_content = seo_content
    
    return final_content
```

---

## Modern Use Cases

### 1. Document Processing Platform

**Problem**: Users need to analyze, summarize, and extract insights from documents.

**Solution**: Multi-stage pipeline

```
PDF Upload → Text Extraction → OpenAI (Key Extraction) → 
Grok (Document Analysis) → OpenAI (Summary Generation) → 
Grok (Sentiment Analysis)
```

**Implementation**:
```python
@app.post("/document/analyze")
async def analyze_document(file: UploadFile):
    # Extract text from PDF/document
    text = extract_text_from_file(file)
    
    # Stage 1: Extract key points
    extractor = registry.get_services_by_capability(AIServiceCapability.KEY_EXTRACTION)[0]
    key_points = await extractor.process(text)
    
    # Stage 2: Deep analysis
    analyzer = registry.get_services_by_capability(AIServiceCapability.DOCUMENT_ANALYSIS)[0] 
    analysis = await analyzer.process(key_points)
    
    # Stage 3: Generate executive summary
    summarizer = registry.get_services_by_capability(AIServiceCapability.DOCUMENT_SUMMARIZATION)[0]
    summary = await summarizer.process(f"Summarize: {analysis}")
    
    return DocumentAnalysisResult(
        key_points=key_points,
        analysis=analysis,
        summary=summary
    )
```

### 2. Content Creation Suite

**Problem**: Businesses need SEO-optimized content that maintains appropriate tone.

**Solution**: Content pipeline with quality checks

```
Topic Input → OpenAI (Content Generation) → OpenAI (SEO Optimization) → 
Grok (Sentiment Check) → Conditional Refinement
```

### 3. Research Assistant

**Problem**: Users need comprehensive research with source analysis.

**Solution**: Research and synthesis pipeline

```
Research Query → OpenAI (Query Optimization) → Grok (News Gathering) → 
OpenAI (Source Analysis) → Grok (Trend Analysis) → OpenAI (Report Generation)
```

### 4. Customer Support Enhancement

**Problem**: Support queries need context-aware, appropriately-toned responses.

**Solution**: Smart response system

```
Customer Query → OpenAI (Intent Analysis) → Grok (Sentiment Detection) → 
Context Lookup → OpenAI (Response Generation) → Grok (Tone Verification)
```

### 5. Code Documentation Generator

**Problem**: Developers need automated, high-quality documentation.

**Solution**: Code analysis and documentation pipeline

```
Code Input → OpenAI (Code Analysis) → OpenAI (Comment Extraction) → 
OpenAI (Documentation Generation) → Grok (Technical Review) → 
OpenAI (Formatting & Polish)
```

---

## Integration Guide

### Frontend Integration Pattern

The current frontend integration has several issues that need addressing:

#### Current Implementation Issues

```typescript
// ❌ Problem: Hardcoded analysis type
async submitJob(submission: JobSubmission): Promise<Job> {
    const response = await apiService.post('/process', {
        user_input: submission.input,
        analysis_type: 'custom'  // Hardcoded!
    });
}
```

#### Recommended Frontend Pattern

```typescript
// ✅ Solution: Service-aware submission
interface EnhancedJobSubmission {
    input: string;
    service_id?: string;        // User-selected service
    analysis_type: string;      // Derived from service type
    workflow?: string;          // Optional workflow template
    options?: {
        chain_services?: boolean;
        fallback_enabled?: boolean;
        max_processing_time?: number;
    };
}

async submitJob(submission: EnhancedJobSubmission): Promise<Job> {
    const response = await apiService.postWithTimeout('/process', {
        user_input: submission.input,
        service_id: submission.service_id,
        analysis_type: submission.analysis_type,
        workflow: submission.workflow,
        options: submission.options
    }, this.getTimeoutForWorkflow(submission.workflow));
}
```

#### Service Selection UI Enhancement

```typescript
// Service selector with workflow awareness
interface ServiceOption {
    id: string;
    name: string;
    provider: string;
    capabilities: string[];
    workflow_types: string[];
    estimated_time: string;
    cost_tier: 'low' | 'medium' | 'high';
}

function ServiceSelector({ onSelect }: { onSelect: (service: ServiceOption) => void }) {
    const { services, workflows } = useAIServices();
    
    return (
        <div className="service-selector">
            <div className="workflow-tabs">
                {workflows.map(workflow => (
                    <Tab key={workflow.id} onClick={() => setActiveWorkflow(workflow)}>
                        {workflow.name}
                    </Tab>
                ))}
            </div>
            
            <div className="service-grid">
                {services
                    .filter(s => s.workflow_types.includes(activeWorkflow.id))
                    .map(service => (
                        <ServiceCard 
                            key={service.id}
                            service={service}
                            onSelect={onSelect}
                        />
                    ))}
            </div>
        </div>
    );
}
```

### Backend API Enhancement

#### Enhanced Request Model

```python
class EnhancedAnalysisRequest(BaseModel):
    user_input: str = Field(..., max_length=settings.max_user_input_length)
    analysis_type: Optional[AnalysisType] = AnalysisType.CUSTOM
    service_id: Optional[str] = None              # Specific service selection
    workflow: Optional[str] = None                # Predefined workflow
    chain_services: bool = True                   # Enable service chaining
    fallback_enabled: bool = True                 # Enable fallback services
    max_processing_time: Optional[int] = 120      # Timeout in seconds
```

#### Workflow-Aware Processing

```python
@router.post("/process", response_model=GenericAnalysisResponse)
async def process_enhanced(req: EnhancedAnalysisRequest):
    if req.workflow:
        # Use predefined workflow
        result = await workflow_engine.execute(req.workflow, req.user_input)
    elif req.service_id:
        # Use specific service
        service = ai_service_registry.get_service(req.service_id)
        result = await service.process(req.user_input)
    else:
        # Use default chaining logic
        result = await analysis_service.analyze_generic(
            req.user_input, 
            req.analysis_type,
            chain_services=req.chain_services
        )
    
    return result
```

---

## Performance Optimization

### 1. Service Selection Strategy

```python
class ServiceSelector:
    def select_optimal_service(self, task_type: str, constraints: dict) -> AIService:
        candidates = self.registry.get_services_by_type(task_type)
        
        # Filter by constraints
        candidates = self.filter_by_constraints(candidates, constraints)
        
        # Score services based on criteria
        scored = []
        for service in candidates:
            score = self.calculate_score(service, constraints)
            scored.append((service, score))
        
        # Return highest scoring service
        return max(scored, key=lambda x: x[1])[0]
    
    def calculate_score(self, service: AIService, constraints: dict) -> float:
        score = 0.0
        
        # Performance weight
        if constraints.get('priority') == 'speed':
            score += service.metadata.speed_rating * 0.4
        
        # Cost weight  
        if constraints.get('priority') == 'cost':
            score += (1 / service.metadata.cost_tier) * 0.4
            
        # Quality weight
        if constraints.get('priority') == 'quality':
            score += service.metadata.quality_rating * 0.4
            
        # Availability weight
        score += service.health_score * 0.2
        
        return score
```

### 2. Caching Strategy

```python
from functools import lru_cache
import asyncio

class CachedServiceRegistry:
    def __init__(self):
        self.response_cache = {}
        self.cache_ttl = 300  # 5 minutes
    
    @lru_cache(maxsize=100)
    async def cached_process(self, service_id: str, input_hash: str, input_text: str):
        cache_key = f"{service_id}:{input_hash}"
        
        if cache_key in self.response_cache:
            cached_response, timestamp = self.response_cache[cache_key]
            if time.time() - timestamp < self.cache_ttl:
                return cached_response
        
        # Process and cache
        service = self.registry.get_service(service_id)
        result = await service.process(input_text)
        
        self.response_cache[cache_key] = (result, time.time())
        return result
```

### 3. Parallel Processing

```python
async def parallel_workflow(input_text: str):
    # Process independent steps in parallel
    tasks = {
        'seo': seo_service.process(input_text),
        'sentiment': sentiment_service.process(input_text),
        'keywords': keyword_service.process(input_text)
    }
    
    # Wait for all to complete
    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    
    # Handle results and exceptions
    final_result = {}
    for (name, task), result in zip(tasks.items(), results):
        if isinstance(result, Exception):
            logger.warning(f"Task {name} failed: {result}")
            final_result[name] = None
        else:
            final_result[name] = result
    
    return final_result
```

### 4. Cost Optimization

```python
class CostOptimizer:
    SERVICE_COSTS = {
        'openai': {'per_token': 0.002, 'base_cost': 0.001},
        'grok': {'per_token': 0.001, 'base_cost': 0.0005}
    }
    
    def choose_cost_effective_service(self, task: str, input_length: int) -> str:
        candidates = self.registry.get_services_by_capability(task)
        
        costs = []
        for service in candidates:
            provider = service.metadata.provider.lower()
            if provider in self.SERVICE_COSTS:
                estimated_tokens = input_length * 1.3  # Account for response
                cost = (self.SERVICE_COSTS[provider]['per_token'] * estimated_tokens + 
                       self.SERVICE_COSTS[provider]['base_cost'])
                costs.append((service, cost))
        
        # Return cheapest option
        return min(costs, key=lambda x: x[1])[0]
```

---

## Current Issues & Solutions

### Issue 1: Service Registration Order

**Problem**: First registered service is always preferred, regardless of `replace_if_exists=True`.

**Current Behavior**:
```python
# Both register for GENERIC_ANALYZER
register("openai_generic", openai_service, GENERIC_ANALYZER)    # First = Preferred
register("grok_generic", grok_service, GENERIC_ANALYZER)        # Second = Ignored
```

**Solution Options**:

```python
# Option A: Change registration order
def initialize_ai_services():
    # Register Grok first for generic analysis
    ai_service_registry.register("grok_generic", grok_service, GENERIC_ANALYZER)
    # OpenAI won't register for GENERIC_ANALYZER, only specialized types
    
# Option B: Fix registry logic
def register(self, service_id: str, service: AIService, service_type: AIServiceType, 
             replace_if_exists: bool = False, prefer: bool = False):
    if replace_if_exists and service_type in self._service_types:
        # Remove existing services of this type
        self._service_types[service_type].clear()
    
    if prefer:
        # Insert at beginning of list
        self._service_types[service_type].insert(0, service_id)
    else:
        # Append to end
        self._service_types[service_type].append(service_id)
```

### Issue 2: Input Length Validation

**Problem**: Optimized prompts are validated against user input limits.

**Current Flow**:
```
User Input (50 chars) → OpenAI Optimize → Optimized Prompt (1500 chars) → 
OpenAI Analyze → FAILS (1500 > MAX_USER_INPUT_LENGTH)
```

**Solution**:
```python
class AIService:
    async def process(self, input_text: str, bypass_validation: bool = False) -> str:
        if not bypass_validation and not await self.validate_input(input_text):
            raise AIServiceError("Invalid input")
        
        # Process without validation for optimized prompts
        return await self._internal_process(input_text)

# In workflow
optimized_prompt = await optimizer.process(user_input)  # Normal validation
result = await analyzer.process(optimized_prompt, bypass_validation=True)  # Skip validation
```

### Issue 3: Frontend Service Selection

**Problem**: Frontend doesn't send selected service_id to backend.

**Current**:
```typescript
// Frontend sends
{ user_input: "test", analysis_type: "custom" }

// Backend receives no service preference
```

**Solution**:
```typescript
// Enhanced frontend
{ 
    user_input: "test", 
    analysis_type: "custom",
    service_id: "grok_analyzer",        // User selection
    workflow: "text_analysis"           // Predefined workflow
}

// Backend uses specific service
const service = registry.get_service(req.service_id) || 
               registry.get_preferred_service(req.analysis_type);
```

---

## Best Practices

### 1. Service Design Principles

#### Separation of Concerns
```python
# ✅ Good: Specialized services
class PromptOptimizer(AIService):
    """Only handles prompt optimization"""
    capabilities = [AIServiceCapability.PROMPT_OPTIMIZATION]

class DocumentAnalyzer(AIService):  
    """Only handles document analysis"""
    capabilities = [AIServiceCapability.DOCUMENT_ANALYSIS]

# ❌ Avoid: Services that do everything
class SuperAIService(AIService):
    capabilities = [ALL_CAPABILITIES]  # Jack of all trades, master of none
```

#### Idempotency
```python
class ReliableAIService(AIService):
    async def process(self, input_text: str) -> str:
        # Generate consistent results for same input
        input_hash = hashlib.md5(input_text.encode()).hexdigest()
        
        # Check cache first
        if cached_result := self.cache.get(input_hash):
            return cached_result
            
        result = await self._process_internal(input_text)
        self.cache.set(input_hash, result, ttl=3600)
        return result
```

### 2. Error Handling Patterns

#### Graceful Degradation
```python
async def robust_workflow(input_text: str):
    try:
        # Try optimal service
        optimal_service = registry.get_preferred_service(DOCUMENT_PROCESSOR)
        return await optimal_service.process(input_text)
    except ServiceUnavailableError:
        # Fallback to alternative
        fallback_service = registry.get_services_by_capability(DOCUMENT_ANALYSIS)[1]
        return await fallback_service.process(input_text)
    except AIServiceError as e:
        # Last resort: generic processing
        generic_service = registry.get_preferred_service(GENERIC_ANALYZER)
        return await generic_service.process(f"Analyze: {input_text}")
```

#### Circuit Breaker Pattern
```python
class CircuitBreakerService:
    def __init__(self, service: AIService, failure_threshold: int = 5):
        self.service = service
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.last_failure_time = None
        self.circuit_open = False
    
    async def process(self, input_text: str) -> str:
        if self.circuit_open:
            if time.time() - self.last_failure_time > 300:  # 5 min reset
                self.circuit_open = False
                self.failure_count = 0
            else:
                raise ServiceUnavailableError("Circuit breaker open")
        
        try:
            result = await self.service.process(input_text)
            self.failure_count = 0  # Reset on success
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.circuit_open = True
            
            raise e
```

### 3. Monitoring & Observability

```python
import time
from typing import Dict
import logging

class ServiceMetrics:
    def __init__(self):
        self.request_counts: Dict[str, int] = {}
        self.response_times: Dict[str, List[float]] = {}
        self.error_rates: Dict[str, float] = {}
    
    async def track_request(self, service_id: str, func, *args, **kwargs):
        start_time = time.time()
        
        try:
            result = await func(*args, **kwargs)
            self.record_success(service_id, time.time() - start_time)
            return result
        except Exception as e:
            self.record_error(service_id, time.time() - start_time)
            raise e
    
    def record_success(self, service_id: str, response_time: float):
        self.request_counts[service_id] = self.request_counts.get(service_id, 0) + 1
        if service_id not in self.response_times:
            self.response_times[service_id] = []
        self.response_times[service_id].append(response_time)
    
    def get_metrics(self, service_id: str) -> dict:
        return {
            'requests': self.request_counts.get(service_id, 0),
            'avg_response_time': sum(self.response_times.get(service_id, [0])) / 
                               len(self.response_times.get(service_id, [1])),
            'error_rate': self.error_rates.get(service_id, 0.0)
        }
```

---

## Troubleshooting

### Common Issues

#### 1. "No service available for type X"

**Symptoms**: `ServiceUnavailableError` when requesting specific service type

**Diagnosis**:
```python
# Check what services are registered
registered_services = ai_service_registry.list_services()
print("Registered services:", registered_services)

# Check specific type
services_for_type = ai_service_registry.get_services_by_type(AIServiceType.DOCUMENT_PROCESSOR)
print(f"Services for type: {services_for_type}")
```

**Solutions**:
- Ensure service is properly registered during initialization
- Check if service initialization failed due to missing API keys
- Verify service type enum values match registration

#### 2. "Request timeout" / "502 Bad Gateway"

**Symptoms**: Long processing times followed by timeout errors

**Diagnosis**:
```python
# Check service health
health_results = await ai_service_registry.health_check_all()
print("Service health:", health_results)

# Test individual service
service = ai_service_registry.get_service("openai_optimizer")
try:
    result = await service.process("test input")
    print("Service working:", result)
except Exception as e:
    print("Service error:", e)
```

**Solutions**:
- Increase timeout values in environment variables
- Check API key validity and quotas
- Verify network connectivity to AI service providers
- Monitor service logs for specific error messages

#### 3. "Invalid input for [Service] processing"

**Symptoms**: Input validation failures, often with optimized prompts

**Diagnosis**:
```python
# Check input lengths
print(f"User input length: {len(user_input)}")
print(f"Optimized prompt length: {len(optimized_prompt)}")
print(f"Max allowed length: {settings.max_user_input_length}")
```

**Solutions**:
- Increase `MAX_USER_INPUT_LENGTH` environment variable
- Implement bypass validation for optimized prompts
- Add separate validation limits for internal processing

#### 4. Wrong service being selected

**Symptoms**: Expected Grok but got OpenAI, or vice versa

**Diagnosis**:
```python
# Check service registration order
service_types = ai_service_registry._service_types
print("GENERIC_ANALYZER services:", service_types.get(AIServiceType.GENERIC_ANALYZER))

# Check preferred service
preferred = ai_service_registry.get_preferred_service(AIServiceType.GENERIC_ANALYZER)
print("Preferred service:", preferred.get_metadata())
```

**Solutions**:
- Modify service registration order
- Use specific service selection instead of preferred
- Implement service selection logic in frontend

### Debug Tools

#### Service Registry Inspector

```python
def inspect_registry():
    """Debug tool to inspect current registry state"""
    registry = ai_service_registry
    
    print("=== AI Service Registry Inspection ===")
    print(f"Total services registered: {len(registry._services)}")
    
    print("\n--- Services by Type ---")
    for service_type, service_ids in registry._service_types.items():
        print(f"{service_type.value}:")
        for sid in service_ids:
            service = registry._services[sid]
            metadata = service.get_metadata()
            print(f"  - {sid}: {metadata.name} ({metadata.provider})")
    
    print("\n--- Services by Capability ---")
    for capability, service_ids in registry._capabilities.items():
        print(f"{capability.value}: {service_ids}")

# Usage
inspect_registry()
```

#### Performance Monitor

```python
import asyncio
import time

async def benchmark_service(service_id: str, test_input: str, iterations: int = 5):
    """Benchmark service performance"""
    service = ai_service_registry.get_service(service_id)
    
    times = []
    for i in range(iterations):
        start = time.time()
        try:
            result = await service.process(test_input)
            end = time.time()
            times.append(end - start)
            print(f"Iteration {i+1}: {end - start:.2f}s")
        except Exception as e:
            print(f"Iteration {i+1}: FAILED - {e}")
    
    if times:
        avg_time = sum(times) / len(times)
        print(f"\nAverage response time: {avg_time:.2f}s")
        print(f"Min: {min(times):.2f}s, Max: {max(times):.2f}s")
    
    return times

# Usage
await benchmark_service("openai_optimizer", "Test input for benchmarking")
```

---

## Extension & Customization

### Adding New Services

#### 1. Implement Service Interface

```python
from app.services.ai_service_interface import AIService, AIServiceMetadata, AIServiceCapability

class CustomAIService(AIService):
    def __init__(self, api_key: str, model: str = "default"):
        self.api_key = api_key
        self.model = model
        
        # Define service metadata
        self._metadata = AIServiceMetadata(
            name="Custom AI Service",
            provider="CustomProvider",
            version="1.0.0",
            capabilities=[
                AIServiceCapability.GENERIC_ANALYSIS,
                # Add other capabilities
            ],
            model=model,
            max_tokens=2000,
            temperature=0.5
        )
    
    def get_metadata(self) -> AIServiceMetadata:
        return self._metadata
    
    async def health_check(self) -> bool:
        try:
            # Implement health check logic
            return True
        except:
            return False
    
    async def validate_input(self, input_text: str) -> bool:
        return len(input_text.strip()) > 0 and len(input_text) <= 10000
    
    async def process(self, input_text: str) -> str:
        # Implement core processing logic
        if not await self.validate_input(input_text):
            raise AIServiceError("Invalid input")
        
        # Your AI service API call here
        result = await self.call_custom_api(input_text)
        return result
    
    async def call_custom_api(self, input_text: str) -> str:
        # Implement API integration
        pass
```

#### 2. Register New Service

```python
# In service_initialization.py
def initialize_ai_services():
    # ... existing registrations ...
    
    # Add custom service
    custom_service = CustomAIService(api_key=settings.custom_ai_api_key)
    ai_service_registry.register(
        service_id="custom_analyzer",
        service=custom_service,
        service_type=AIServiceType.GENERIC_ANALYZER,
        replace_if_exists=False
    )
    logger.info("Registered Custom AI Service")
```

### Creating Custom Workflows

#### 1. Define Workflow Template

```python
class WorkflowTemplate:
    def __init__(self, name: str, steps: List[Dict]):
        self.name = name
        self.steps = steps
    
    async def execute(self, input_text: str, context: Dict = None) -> Dict:
        results = {"input": input_text}
        current_input = input_text
        
        for step in self.steps:
            service_type = step.get("service_type")
            capability = step.get("capability") 
            transform = step.get("transform")
            
            # Get appropriate service
            if service_type:
                service = ai_service_registry.get_preferred_service(service_type)
            elif capability:
                services = ai_service_registry.get_services_by_capability(capability)
                service = services[0] if services else None
            
            if not service:
                raise ServiceUnavailableError(f"No service available for step: {step}")
            
            # Process step
            result = await service.process(current_input)
            
            # Apply transformation if specified
            if transform:
                result = self.apply_transform(result, transform, results)
            
            # Store result and prepare for next step
            results[step["name"]] = result
            current_input = result if step.get("chain_output", True) else input_text
        
        return results

# Example workflow definitions
RESEARCH_WORKFLOW = WorkflowTemplate("research_assistant", [
    {
        "name": "optimize_query",
        "service_type": AIServiceType.PROMPT_OPTIMIZER,
        "chain_output": True
    },
    {
        "name": "analyze_content", 
        "capability": AIServiceCapability.GENERIC_ANALYSIS,
        "chain_output": True
    },
    {
        "name": "extract_insights",
        "capability": AIServiceCapability.KEY_EXTRACTION,
        "transform": "bullet_points"
    }
])
```

#### 2. Workflow Engine

```python
class WorkflowEngine:
    def __init__(self, registry: AIServiceRegistry):
        self.registry = registry
        self.workflows = {}
    
    def register_workflow(self, workflow: WorkflowTemplate):
        self.workflows[workflow.name] = workflow
    
    async def execute_workflow(self, workflow_name: str, input_text: str, context: Dict = None) -> Dict:
        if workflow_name not in self.workflows:
            raise ValueError(f"Unknown workflow: {workflow_name}")
        
        workflow = self.workflows[workflow_name]
        return await workflow.execute(input_text, context)
    
    def list_workflows(self) -> List[str]:
        return list(self.workflows.keys())

# Initialize workflow engine
workflow_engine = WorkflowEngine(ai_service_registry)
workflow_engine.register_workflow(RESEARCH_WORKFLOW)
```

### Advanced Customizations

#### 1. Dynamic Service Selection

```python
class SmartServiceSelector:
    def __init__(self, registry: AIServiceRegistry):
        self.registry = registry
        self.performance_history = {}
    
    async def select_best_service(self, task_type: str, input_characteristics: Dict) -> AIService:
        candidates = self.registry.get_services_by_type(task_type)
        
        # Score candidates based on historical performance and current context
        scores = {}
        for service in candidates:
            score = await self.calculate_service_score(service, input_characteristics)
            scores[service] = score
        
        # Return highest scoring service
        return max(scores.items(), key=lambda x: x[1])[0]
    
    async def calculate_service_score(self, service: AIService, characteristics: Dict) -> float:
        # Implement scoring logic based on:
        # - Historical performance
        # - Current load
        # - Input complexity
        # - Cost considerations
        # - Quality requirements
        pass
```

#### 2. Adaptive Workflows

```python
class AdaptiveWorkflow:
    async def execute_adaptive(self, input_text: str, quality_threshold: float = 0.8):
        results = []
        current_quality = 0.0
        iteration = 0
        max_iterations = 3
        
        while current_quality < quality_threshold and iteration < max_iterations:
            # Try different service combinations
            service_combo = self.select_service_combination(iteration, results)
            
            result = await self.process_with_combination(input_text, service_combo)
            quality_score = await self.assess_quality(result)
            
            results.append({
                'result': result,
                'quality': quality_score,
                'services_used': service_combo,
                'iteration': iteration
            })
            
            current_quality = quality_score
            iteration += 1
        
        # Return best result
        return max(results, key=lambda x: x['quality'])
```

---

## Conclusion

The AI Service Registry is a powerful orchestration system that enables sophisticated AI workflows through service chaining and specialization. While originally designed for crypto analysis, it has tremendous potential for modern AI applications including document processing, content creation, research assistance, and more.

### Key Takeaways:

1. **Service Specialization**: Use OpenAI for language tasks, Grok for analysis
2. **Workflow Orchestration**: Chain services to create complex processing pipelines  
3. **Extensibility**: Easy to add new services and capabilities
4. **Current Issues**: Registration order, validation logic, and frontend integration need fixes
5. **Optimization**: Consider cost, speed, and quality when selecting services


### Future Enhancements:

1. Dynamic service selection based on context
2. Adaptive workflows that improve over time
3. Cost optimization algorithms
4. Advanced caching strategies
5. Multi-tenant service isolation

The registry system provides a solid foundation for building sophisticated AI applications that leverage the strengths of multiple AI providers working together.

---

*This playbook is a living document. Update it as the registry evolves and new patterns emerge.*