// API service for backend communication with automatic auth header injection
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import { authBridge } from './auth-bridge.service'
import { 
  ApiResponse, 
  HealthResponse, 
  ApiClientConfig 
} from '@/types/api'

class ApiService {
  private client: AxiosInstance

  constructor(config?: Partial<ApiClientConfig>) {
    // Parse timeout from environment or use defaults
    const defaultTimeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10)

    // Prefer proxy in secure mode to leverage HttpOnly session cookies
    const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true'
    const resolvedBaseURL = useProxy
      ? '/api/proxy'
      : (config?.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')

    this.client = axios.create({
      baseURL: resolvedBaseURL,
      timeout: config?.timeout || defaultTimeout,
      withCredentials: true, // ensure cookies are sent for same-origin proxy
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Configure axios-retry for resilient HTTP requests
    axiosRetry(this.client, {
      retries: config?.retries || 3,
      retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
      retryCondition: config?.retryCondition || ((error) => {
        // Retry on network errors or 5xx status codes or rate limiting
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
               error.response?.status === 429 || // Rate limiting
               error.response?.status === 503 || // Service unavailable
               error.response?.status === 502 || // Bad gateway
               error.response?.status === 504    // Gateway timeout
      }),
      onRetry: (retryCount, error) => {
        console.warn(`API request retry ${retryCount} for ${error.config?.url}:`, error.message)
      }
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Get auth headers from bridge service
        const authHeaders = await authBridge.getAuthHeaders()
        const mergedHeaders = (config.headers ?? {}) as any
        config.headers = mergedHeaders
        Object.assign(config.headers, authHeaders)
        
        // Request ID removed to fix CORS preflight issues
        // Backend provides correlation IDs automatically
        
        return config
      },
      (error) => {
        return Promise.reject(this.handleError(error))
      }
    )

    // Response interceptor to handle common errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401) {
          console.warn('Authentication token expired or invalid')
          
          // Session expired, redirect to sign in
          const { signIn } = await import("next-auth/react")
          await signIn('google')
          return Promise.reject(new ApiError('Session expired. Please sign in again.'))
        }

        // Handle network errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          console.error('Backend server is not available')
          return Promise.reject(new ApiError('Backend server is not available. Please check your connection and try again.'))
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
          console.error('Request timeout')
          return Promise.reject(new ApiError('Request timeout. The server is taking too long to respond.'))
        }

        return Promise.reject(this.handleError(error))
      }
    )
  }

  /**
   * Handle and format API errors with comprehensive context
   */
  private handleError(error: any): ApiError {
    if (error instanceof ApiError) {
      return error
    }

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 
                     error.response?.data?.detail ||
                     error.response?.data?.error ||
                     error.message ||
                     'An unexpected error occurred'
      
      const apiError = new ApiError(
        message, 
        error.code || error.response?.data?.code, 
        error.response?.status,
        {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          timestamp: new Date().toISOString(),
          responseData: error.response?.data
        }
      )

      // Add status_code for consistency with backend
      apiError.status_code = error.response?.status
      apiError.timestamp = new Date().toISOString()

      return apiError
    }

    const genericError = new ApiError(error.message || 'An unexpected error occurred')
    genericError.timestamp = new Date().toISOString()
    return genericError
  }

  /**
   * Check backend health
   */
  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await this.client.get<HealthResponse>('/health')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic GET request
   */
  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * POST request with custom timeout for AI operations
   */
  async postWithTimeout<T = any>(endpoint: string, data?: any, timeoutMs?: number): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data, {
        timeout: timeoutMs
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.patch<T>(endpoint, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await this.client.delete<T>(endpoint)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Upload file with multipart/form-data
   */
  async uploadFile<T = any>(endpoint: string, file: File, additionalData?: any): Promise<T> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key])
        })
      }

      const response = await this.client.post<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Set custom authorization header
   */
  setAuthHeader(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  /**
   * Remove authorization header
   */
  removeAuthHeader(): void {
    delete this.client.defaults.headers.common['Authorization']
  }

  /**
   * Get raw axios instance for advanced usage
   */
  getClient(): AxiosInstance {
    return this.client
  }
}

// Custom API Error class
export class ApiError extends Error {
  public code?: string
  public status?: number
  public status_code?: number
  public timestamp?: string
  public details?: any

  constructor(message: string, code?: string, status?: number, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.status_code = status
    this.timestamp = new Date().toISOString()
    this.details = details
  }
}

// Create singleton instance
export const apiService = new ApiService()
export default apiService
