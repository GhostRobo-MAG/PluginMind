// User Service module for user profile, usage, and quota management
import { apiService } from './api.service'
import { 
  UserProfile, 
  UserUsage, 
  UserQuota, 
  UpdateUserRequest,
  PaginatedResponse
} from '@/types/api'
import { User } from '@/types/auth'

class UserServiceModule {
  private readonly baseURL = '/users'

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiService.get<User>(`${this.baseURL}/profile`)
      return response
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(data: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiService.patch<User>(`${this.baseURL}/profile`, data)
      return response
    } catch (error) {
      console.error('Failed to update user profile:', error)
      throw error
    }
  }

  /**
   * Get user API usage statistics
   */
  async getUsage(period?: 'daily' | 'monthly' | 'yearly'): Promise<UserUsage> {
    try {
      const response = await apiService.get<UserUsage>(`${this.baseURL}/usage`, {
        period: period || 'monthly'
      })
      return response
    } catch (error) {
      console.error('Failed to fetch user usage:', error)
      throw error
    }
  }

  /**
   * Get detailed usage history with pagination
   */
  async getUsageHistory(params?: {
    period?: 'daily' | 'monthly' | 'yearly'
    start_date?: string
    end_date?: string
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<UserUsage>> {
    try {
      const response = await apiService.get<PaginatedResponse<UserUsage>>(
        `${this.baseURL}/usage/history`, 
        params
      )
      return response
    } catch (error) {
      console.error('Failed to fetch usage history:', error)
      throw error
    }
  }

  /**
   * Get user quota and limits
   */
  async getQuota(): Promise<UserQuota> {
    try {
      const response = await apiService.get<UserQuota>(`${this.baseURL}/quota`)
      return response
    } catch (error) {
      console.error('Failed to fetch user quota:', error)
      throw error
    }
  }

  /**
   * Get quota usage summary with percentage utilization
   */
  async getQuotaSummary(): Promise<{
    quota: UserQuota
    utilization: {
      api_calls_percent: number
      processing_time_percent: number
      data_percent: number
      jobs_percent: number
    }
    days_until_reset: number
    is_over_limit: boolean
    warnings: string[]
  }> {
    try {
      const response = await apiService.get(`${this.baseURL}/quota/summary`)
      return response
    } catch (error) {
      console.error('Failed to fetch quota summary:', error)
      throw error
    }
  }

  /**
   * Get user's API keys for external integrations
   */
  async getApiKeys(): Promise<{
    id: string
    name: string
    key_preview: string // Only shows first/last few characters
    created_at: string
    last_used_at?: string
    is_active: boolean
  }[]> {
    try {
      const response = await apiService.get(`${this.baseURL}/api-keys`)
      return response
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      throw error
    }
  }

  /**
   * Create a new API key
   */
  async createApiKey(name: string): Promise<{
    id: string
    name: string
    key: string // Full key only returned once
    created_at: string
  }> {
    try {
      const response = await apiService.post(`${this.baseURL}/api-keys`, { name })
      return response
    } catch (error) {
      console.error('Failed to create API key:', error)
      throw error
    }
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(keyId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete(`${this.baseURL}/api-keys/${keyId}`)
      return response
    } catch (error) {
      console.error(`Failed to delete API key ${keyId}:`, error)
      throw error
    }
  }

  /**
   * Get user preferences and settings
   */
  async getSettings(): Promise<{
    user_id: string
    notifications: {
      email_enabled: boolean
      job_completion: boolean
      quota_warnings: boolean
      system_updates: boolean
    }
    ui_preferences: {
      theme: 'light' | 'dark' | 'system'
      language: string
      timezone: string
    }
    api_settings: {
      default_timeout_ms: number
      auto_retry_failed_jobs: boolean
      preferred_services: string[]
    }
  }> {
    try {
      const response = await apiService.get(`${this.baseURL}/settings`)
      return response
    } catch (error) {
      console.error('Failed to fetch user settings:', error)
      throw error
    }
  }

  /**
   * Update user settings
   */
  async updateSettings(settings: {
    notifications?: {
      email_enabled?: boolean
      job_completion?: boolean
      quota_warnings?: boolean
      system_updates?: boolean
    }
    ui_preferences?: {
      theme?: 'light' | 'dark' | 'system'
      language?: string
      timezone?: string
    }
    api_settings?: {
      default_timeout_ms?: number
      auto_retry_failed_jobs?: boolean
      preferred_services?: string[]
    }
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.patch(`${this.baseURL}/settings`, settings)
      return response
    } catch (error) {
      console.error('Failed to update user settings:', error)
      throw error
    }
  }

  /**
   * Get user billing information
   */
  async getBilling(): Promise<{
    user_id: string
    plan: 'free' | 'pro' | 'enterprise'
    billing_cycle: 'monthly' | 'yearly'
    amount_usd: number
    currency: string
    next_billing_date?: string
    payment_method?: {
      type: 'card' | 'paypal'
      last_four?: string
      expires?: string
    }
    billing_history: {
      id: string
      date: string
      amount_usd: number
      status: 'paid' | 'pending' | 'failed'
      invoice_url?: string
    }[]
  }> {
    try {
      const response = await apiService.get(`${this.baseURL}/billing`)
      return response
    } catch (error) {
      console.error('Failed to fetch billing information:', error)
      throw error
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<User> {
    try {
      const response = await apiService.uploadFile<User>(`${this.baseURL}/avatar`, file)
      return response
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      throw error
    }
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(): Promise<User> {
    try {
      const response = await apiService.delete<User>(`${this.baseURL}/avatar`)
      return response
    } catch (error) {
      console.error('Failed to delete avatar:', error)
      throw error
    }
  }

  /**
   * Export user data (GDPR compliance)
   */
  async exportData(): Promise<{
    export_id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    download_url?: string
    created_at: string
    expires_at: string
  }> {
    try {
      const response = await apiService.post(`${this.baseURL}/export`)
      return response
    } catch (error) {
      console.error('Failed to initiate data export:', error)
      throw error
    }
  }

  /**
   * Get data export status
   */
  async getExportStatus(exportId: string): Promise<{
    export_id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    download_url?: string
    created_at: string
    expires_at: string
    error?: string
  }> {
    try {
      const response = await apiService.get(`${this.baseURL}/export/${exportId}`)
      return response
    } catch (error) {
      console.error(`Failed to get export status for ${exportId}:`, error)
      throw error
    }
  }

  /**
   * Delete user account (permanent action)
   */
  async deleteAccount(confirmation: {
    password: string
    confirmation_text: string // Must be "DELETE ACCOUNT"
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post(`${this.baseURL}/account/delete`, confirmation)
      return response
    } catch (error) {
      console.error('Failed to delete account:', error)
      throw error
    }
  }

  /**
   * Change user password
   */
  async changePassword(data: {
    current_password: string
    new_password: string
    confirm_password: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post(`${this.baseURL}/change-password`, data)
      return response
    } catch (error) {
      console.error('Failed to change password:', error)
      throw error
    }
  }

  /**
   * Get user activity log
   */
  async getActivityLog(params?: {
    page?: number
    page_size?: number
    activity_type?: 'auth' | 'api' | 'billing' | 'settings'
    start_date?: string
    end_date?: string
  }): Promise<PaginatedResponse<{
    id: string
    user_id: string
    activity_type: string
    description: string
    ip_address?: string
    user_agent?: string
    metadata?: any
    created_at: string
  }>> {
    try {
      const response = await apiService.get(`${this.baseURL}/activity`, params)
      return response
    } catch (error) {
      console.error('Failed to fetch activity log:', error)
      throw error
    }
  }
}

// Create singleton instance
export const userService = new UserServiceModule()
export default userService