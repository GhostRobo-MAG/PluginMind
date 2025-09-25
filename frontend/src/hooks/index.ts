/**
 * React Hooks - Centralized exports for all React hooks
 * Phase 4B: Complete React Integration Layer
 */

// SWR Configuration
export { default as swrConfig, createSWRKey, swrCache, optimisticUpdate } from './swr-config';
export type { SWRError } from './swr-config';
export { SWRProvider } from './swr-provider';

// AI Hooks
export * from './ai';

// User Hooks  
export * from './user';

// Utility Hooks
export * from './utils';

// Form Validation Hooks
export {
  useValidatedForm,
  useAsyncForm,
  useMultiStepForm,
  useFormWithAsyncValidation,
  usePersistedForm,
  commonSchemas,
} from './use-form-validation';

// Existing hooks (preserved from original codebase)
export { toast, useToast } from './use-toast';
export { useAuth } from './useAuth';

// Re-export SWR for convenience
export { default as useSWR, mutate } from 'swr';
export type { SWRConfiguration, SWRResponse } from 'swr';

/**
 * Hook Categories for better organization:
 * 
 * AI Hooks:
 * - useAIServices, useServiceHealth, useServiceCapabilities, useServiceStats
 * - useJobs, useJob, useJobResult, useJobHistory, useJobMutations, useJobUpdates
 * 
 * User Hooks:
 * - useProfile, useProfileMutations, useUserSettings, useActivityLog
 * - useUsage, useUsageHistory, useQuota, useQuotaSummary, useBilling, useUsageOverview
 * - useApiKeys, useApiKeyMutations, useApiKeyManagement
 * - useAccountSecurity, usePasswordValidation, useAccountDeletion, useAccountManagement
 * 
 * Utility Hooks:
 * - useAPI, useAsyncMutation, useOptimisticMutation, usePolling, useInfiniteAPI
 * - useLoading, useMultiLoading, useAsyncOperation, useDebouncedLoading, useLoadingWithTimeout
 * - useDebounce, useDebouncedCallback, useDebouncedState, useAsyncDebouncedCallback
 * - useLocalStorage, useSessionStorage, useSyncedStorage, useStorageWithExpiry
 * 
 * Form Hooks:
 * - useValidatedForm, useAsyncForm, useMultiStepForm, useFormWithAsyncValidation, usePersistedForm
 * 
 * Auth Hooks (existing):
 * - useAuth, useToast
 */