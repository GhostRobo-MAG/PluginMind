// Service exports for clean imports throughout the application
export { apiService, ApiError } from './api.service'
export { aiService } from './ai.service'
export { userService } from './user.service'

// Re-export commonly used types
export type {
  // API types
  ApiResponse,
  ApiClientConfig,
  HealthResponse,
  PaginatedResponse,
  // AI Service types
  AIService,
  Job,
  JobSubmission,
  JobResult,
  JobStatus,
  ServiceHealthMap,
  // User types
  UserProfile,
  UserUsage,
  UserQuota,
  UpdateUserRequest
} from '@/types/api'

export type {
  // User type (still used by user.service.ts)
  User
} from '@/types/auth'

// Re-export validation schemas and helpers
export {
  // Validation schemas
  jobSubmissionSchema,
  serviceSelectionSchema,
  updateUserProfileSchema,
  updateUserSettingsSchema,
  changePasswordSchema,
  createApiKeySchema,
  deleteAccountSchema,
  paginationSchema,
  jobListFiltersSchema,
  usageHistoryFiltersSchema,
  activityLogFiltersSchema,
  // Validation functions
  validateJobSubmission,
  validateServiceSelection,
  validateUpdateUserProfile,
  validateUpdateUserSettings,
  validateChangePassword,
  validateCreateApiKey,
  validateDeleteAccount,
  validatePagination,
  validateJobListFilters,
  validateUsageHistoryFilters,
  validateActivityLogFilters,
  // Helper functions
  getValidationErrors,
  validateOrThrow
} from '@/lib/validations/api'

export type {
  // Validation input types
  JobSubmissionInput,
  ServiceSelectionInput,
  UpdateUserProfileInput,
  UpdateUserSettingsInput,
  ChangePasswordInput,
  CreateApiKeyInput,
  DeleteAccountInput,
  PaginationInput,
  JobListFiltersInput,
  UsageHistoryFiltersInput,
  ActivityLogFiltersInput
} from '@/lib/validations/api'