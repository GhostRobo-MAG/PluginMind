/**
 * User Hooks - Centralized exports for user-related React hooks
 */

// Profile hooks
export {
  useProfile,
  useProfileMutations,
  useUserSettings,
  useActivityLog,
} from './use-profile';

// Usage hooks
export {
  useUsage,
  useUsageHistory,
  useQuota,
  useQuotaSummary,
  useBilling,
  useUsageOverview,
  useDataExport,
} from './use-usage';

// API Keys hooks
export {
  useApiKeys,
  useApiKeyMutations,
  useApiKeyManagement,
} from './use-api-keys';

// Account hooks
export {
  useAccountSecurity,
  usePasswordValidation,
  useAccountDeletion,
  useAccountManagement,
} from './use-account';

// Re-export types for convenience
export type {
  UserProfile,
  UserUsage,
  UserQuota,
  UpdateUserRequest,
  PaginatedResponse,
} from '@/types/api';

export type { User } from '@/types/auth';