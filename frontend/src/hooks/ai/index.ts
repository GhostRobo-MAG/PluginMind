/**
 * AI Hooks - Centralized exports for AI-related React hooks
 */

// Service hooks
export {
  useAIServices,
  useServiceHealth,
  useServiceHealthById,
  useServiceCapabilities,
  useServiceStats,
  useServiceOverview,
} from './use-ai-services';

// Job hooks
export {
  useJobs,
  useJob,
  useJobResult,
  useJobHistory,
  useJobMutations,
  useJobUpdates,
} from './use-jobs';

// Re-export types for convenience
export type {
  AIService,
  Job,
  JobSubmission,
  JobResult,
  JobStatus,
  ServiceHealthMap,
  PaginatedResponse,
} from '@/types/api';