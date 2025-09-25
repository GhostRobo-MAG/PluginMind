// API validation schemas using Zod for runtime validation and type inference
import { z } from 'zod'

// Job Submission Validation
export const jobSubmissionSchema = z.object({
  service_id: z.string().min(1, 'Service ID is required'),
  input: z.string().min(1, 'Input text is required'),
  options: z.object({
    optimize_prompt: z.boolean().optional().default(true),
    max_tokens: z.number().min(10).max(10000).optional().default(1000),
    temperature: z.number().min(0).max(2).optional().default(0.7),
    priority: z.enum(['low', 'normal', 'high']).optional(),
    callback_url: z.string().url().optional(),
    timeout_ms: z.number().min(1000).max(300000).optional() // 1s to 5min
  }).optional()
})

export type JobSubmissionInput = z.infer<typeof jobSubmissionSchema>

// Form-specific schema without service_id (added during submission)
export const jobFormSchema = z.object({
  input: z.string().min(1, 'Input text is required'),
  options: z.object({
    optimize_prompt: z.boolean().optional().default(true),
    max_tokens: z.number().min(10).max(10000).optional().default(1000),
    temperature: z.number().min(0).max(2).optional().default(0.7),
    priority: z.enum(['low', 'normal', 'high']).optional(),
    callback_url: z.string().url().optional(),
    timeout_ms: z.number().min(1000).max(300000).optional() // 1s to 5min
  }).optional()
})

export type JobFormInput = z.infer<typeof jobFormSchema>

// Service Selection Validation
export const serviceSelectionSchema = z.object({
  service_id: z.string().min(1, 'Service ID is required'),
  model: z.string().optional(),
  parameters: z.record(z.any()).optional()
})

export type ServiceSelectionInput = z.infer<typeof serviceSelectionSchema>

// User Profile Update Validation
export const updateUserProfileSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional()
})

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>

// User Settings Update Validation
export const updateUserSettingsSchema = z.object({
  notifications: z.object({
    email_enabled: z.boolean().optional(),
    job_completion: z.boolean().optional(),
    quota_warnings: z.boolean().optional(),
    system_updates: z.boolean().optional()
  }).optional(),
  ui_preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().min(2).max(10).optional(),
    timezone: z.string().optional()
  }).optional(),
  api_settings: z.object({
    default_timeout_ms: z.number().min(1000).max(300000).optional(),
    auto_retry_failed_jobs: z.boolean().optional(),
    preferred_services: z.array(z.string()).optional()
  }).optional()
})

export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>

// Password Change Validation
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"]
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

// API Key Creation Validation
export const createApiKeySchema = z.object({
  name: z.string()
    .min(1, 'API key name is required')
    .max(50, 'API key name is too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'API key name can only contain letters, numbers, spaces, hyphens, and underscores')
})

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>

// Account Deletion Validation
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation_text: z.literal('DELETE ACCOUNT', {
    errorMap: () => ({ message: 'You must type "DELETE ACCOUNT" to confirm' })
  })
})

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>

// Pagination Parameters Validation
export const paginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  page_size: z.number().min(1).max(100).optional().default(20)
})

export type PaginationInput = z.infer<typeof paginationSchema>

// Job List Filtering Validation
export const jobListFiltersSchema = paginationSchema.extend({
  status: z.enum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  service_id: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'completed_at']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc')
})

export type JobListFiltersInput = z.infer<typeof jobListFiltersSchema>

// Usage History Filtering Validation
export const usageHistoryFiltersSchema = paginationSchema.extend({
  period: z.enum(['daily', 'monthly', 'yearly']).optional().default('monthly'),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
})

export type UsageHistoryFiltersInput = z.infer<typeof usageHistoryFiltersSchema>

// Activity Log Filtering Validation
export const activityLogFiltersSchema = paginationSchema.extend({
  activity_type: z.enum(['auth', 'api', 'billing', 'settings']).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
})

export type ActivityLogFiltersInput = z.infer<typeof activityLogFiltersSchema>

// File Upload Validation - SSR compatible
export const fileUploadSchema = z.object({
  file: z.any()
    .refine(
      (file) => {
        // Only validate File properties in browser environment
        if (typeof window === 'undefined') return true
        return file instanceof File
      },
      'Must be a valid file'
    )
    .refine(
      (file) => {
        // Only validate File properties in browser environment
        if (typeof window === 'undefined') return true
        return file.size <= 5 * 1024 * 1024
      },
      'File size must be less than 5MB'
    )
    .refine(
      (file) => {
        // Only validate File properties in browser environment
        if (typeof window === 'undefined') return true
        return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      },
      'Only JPEG, PNG, and WebP images are allowed'
    )
})

export type FileUploadInput = z.infer<typeof fileUploadSchema>

// Generic validation helper functions
export const validateJobSubmission = (data: unknown) => {
  return jobSubmissionSchema.safeParse(data)
}

export const validateServiceSelection = (data: unknown) => {
  return serviceSelectionSchema.safeParse(data)
}

export const validateUpdateUserProfile = (data: unknown) => {
  return updateUserProfileSchema.safeParse(data)
}

export const validateUpdateUserSettings = (data: unknown) => {
  return updateUserSettingsSchema.safeParse(data)
}

export const validateChangePassword = (data: unknown) => {
  return changePasswordSchema.safeParse(data)
}

export const validateCreateApiKey = (data: unknown) => {
  return createApiKeySchema.safeParse(data)
}

export const validateDeleteAccount = (data: unknown) => {
  return deleteAccountSchema.safeParse(data)
}

export const validatePagination = (data: unknown) => {
  return paginationSchema.safeParse(data)
}

export const validateJobListFilters = (data: unknown) => {
  return jobListFiltersSchema.safeParse(data)
}

export const validateUsageHistoryFilters = (data: unknown) => {
  return usageHistoryFiltersSchema.safeParse(data)
}

export const validateActivityLogFilters = (data: unknown) => {
  return activityLogFiltersSchema.safeParse(data)
}

export const validateFileUpload = (data: unknown) => {
  return fileUploadSchema.safeParse(data)
}

// Helper function to extract validation errors
export const getValidationErrors = (error: z.ZodError) => {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.')
    acc[path] = err.message
    return acc
  }, {} as Record<string, string>)
}

// Helper function to validate and throw on error
export const validateOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T => {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors = getValidationErrors(result.error)
    const contextMsg = context ? ` in ${context}` : ''
    throw new Error(`Validation failed${contextMsg}: ${Object.entries(errors).map(([field, msg]) => `${field}: ${msg}`).join(', ')}`)
  }
  
  return result.data
}