/**
 * Utility Hooks - Centralized exports for utility React hooks
 */

// API hooks
export {
  useAPI,
  useAsyncMutation,
  useOptimisticMutation,
  usePolling,
  useInfiniteAPI,
} from './use-api';

// Loading hooks
export {
  useLoading,
  useMultiLoading,
  useAsyncOperation,
  useDebouncedLoading,
  useLoadingWithTimeout,
  useLoadingQueue,
} from './use-loading';

// Debounce hooks
export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedState,
  useAsyncDebouncedCallback,
  useDebouncedSearch,
} from './use-debounce';

// Storage hooks
export {
  useLocalStorage,
  useSessionStorage,
  useSyncedStorage,
  useStorageWithExpiry,
} from './use-local-storage';