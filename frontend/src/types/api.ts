// API related types for backend communication

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  status: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  status_code?: number
  timestamp?: string
  details?: any
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
  has_next?: boolean
  has_prev?: boolean
}

// Backend health check response
export interface HealthResponse {
  status: string
  version: string
  timestamp: string
  uptime?: number
  services?: ServiceHealthMap
}

// AI Service Types
export interface AIService {
  id: string
  name: string
  provider: string
  model: string
  version?: string
  healthy?: boolean
  response_time_ms?: number
  capabilities: string[]
  max_tokens: number
  temperature_range: [number, number]
  pricing_tier?: 'free' | 'standard' | 'premium'
  description?: string
}

export interface ServiceHealth {
  service_id: string
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
  response_time_ms?: number
  last_check: string
  error_rate?: number
}

export interface ServiceHealthMap {
  [serviceId: string]: {
    healthy: boolean
    response_time_ms: number
    last_check: string
  }
}

// Job Management Types
export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Job {
  id: string
  user_id: string
  service_id: string
  status: JobStatus
  input: string
  result?: any
  error?: string
  created_at: string
  updated_at: string
  completed_at?: string
  processing_time_ms?: number
  tokens_used?: number
}

export interface JobSubmission {
  service_id: string
  input: string
  options?: {
    optimize_prompt?: boolean
    max_tokens?: number
    temperature?: number
    priority?: 'low' | 'normal' | 'high'
    callback_url?: string
    timeout_ms?: number
  }
}

export interface JobResult {
  id: string
  status: JobStatus
  result?: {
    analysis: string
    optimized_prompt?: string
    [key: string]: any
  }
  error?: string
  metrics: {
    processing_time_ms: number
    tokens_used: number
    service_used: string
  }
  completed_at?: string
}

// User Management Types
export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  is_active: boolean
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface UserUsage {
  user_id: string
  period: 'daily' | 'monthly' | 'yearly'
  requests_made: number
  requests_limit: number
  tokens_used: number
  tokens_limit: number
  processing_time_ms: number
  data_processed_mb: number
  cost_usd: number
  period_start: string
  period_end: string
  reset_at: string
}

export interface UserQuota {
  user_id: string
  tier: 'free' | 'pro' | 'enterprise'
  limits: {
    requests_per_day: number
    tokens_per_month: number
    concurrent_jobs: number
    priority: number
  }
  usage: {
    requests_used: number
    tokens_used: number
    current_jobs: number
  }
  reset_date: string
}

// Google OAuth endpoints
export interface GoogleOAuthUrl {
  authorization_url: string
  state: string
}

export interface GoogleCallbackRequest {
  code: string
  state: string
}

// User profile endpoints
export interface UpdateUserRequest {
  name?: string
  avatar?: string
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  retryCondition?: (error: any) => boolean
}