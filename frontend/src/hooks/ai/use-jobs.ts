/**
 * AI Jobs Hook - Manage AI job processing
 */

import useSWR, { mutate } from 'swr';
import { useState, useCallback } from 'react';
import { aiService } from '@/services';
import { Job, JobSubmission, JobResult, JobStatus, PaginatedResponse } from '@/types/api';
import { createSWRKey, optimisticUpdate } from '../swr-config';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch paginated jobs list
 */
export function useJobs(params?: {
  page?: number;
  page_size?: number;
  status?: JobStatus;
  service_id?: string;
  sort_by?: 'created_at' | 'updated_at' | 'completed_at';
  sort_order?: 'asc' | 'desc';
}) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: mutateJobs
  } = useSWR(
    ['ai', 'jobs', params],
    () => aiService.listJobs(params),
    {
      refreshInterval: 5000, // Refresh every 5 seconds for active jobs
      revalidateOnFocus: true,
    }
  );

  return {
    jobs: data?.items || [],
    totalJobs: data?.total || 0,
    totalPages: data?.pages || 0,
    currentPage: data?.page || 1,
    hasNext: data?.has_next || false,
    hasPrev: data?.has_prev || false,
    error,
    isLoading,
    isValidating,
    refetch: mutateJobs,
  };
}

/**
 * Hook to fetch a specific job
 */
export function useJob(jobId: string | null) {
  const {
    data: job,
    error,
    isLoading,
    isValidating,
    mutate: mutateJob
  } = useSWR(
    jobId ? ['ai', 'jobs', jobId] : null,
    () => jobId ? aiService.getJob(jobId) : null,
    {
      refreshInterval: (data) => {
        // Refresh active jobs every 2 seconds, completed jobs every 30 seconds
        if (!data) return 2000;
        return ['pending', 'processing'].includes(data.status) ? 2000 : 30000;
      },
      revalidateOnFocus: true,
    }
  );

  return {
    job,
    error,
    isLoading,
    isValidating,
    refetch: mutateJob,
  };
}

/**
 * Hook to fetch job result
 */
export function useJobResult(jobId: string | null) {
  const {
    data: result,
    error,
    isLoading,
    isValidating,
    mutate: mutateResult
  } = useSWR(
    jobId ? ['ai', 'jobs', jobId, 'result'] : null,
    () => jobId ? aiService.getJobResult(jobId) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // Only fetch once for completed jobs
      revalidateIfStale: false,
    }
  );

  return {
    result,
    error,
    isLoading,
    isValidating,
    refetch: mutateResult,
  };
}

/**
 * Hook to fetch job history for a specific service
 */
export function useJobHistory(serviceId: string | null, params?: {
  page?: number;
  page_size?: number;
  status?: JobStatus;
}) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: mutateHistory
  } = useSWR(
    serviceId ? ['ai', 'services', serviceId, 'jobs', params] : null,
    () => serviceId ? aiService.getJobHistory(serviceId, params) : null,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    jobs: data?.items || [],
    totalJobs: data?.total || 0,
    totalPages: data?.pages || 0,
    currentPage: data?.page || 1,
    hasNext: data?.has_next || false,
    hasPrev: data?.has_prev || false,
    error,
    isLoading,
    isValidating,
    refetch: mutateHistory,
  };
}

/**
 * Hook for job mutations (submit, cancel, retry, delete)
 */
export function useJobMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Submit a new job
   */
  const submitJob = useCallback(async (submission: JobSubmission): Promise<Job> => {
    setIsSubmitting(true);
    try {
      const job = await aiService.submitJob(submission);
      
      // Optimistically add to jobs list
      await optimisticUpdate.addToList(
        ['ai', 'jobs'],
        job,
        Promise.resolve(job)
      );

      toast({
        title: 'Job Submitted',
        description: `Job ${job.id} has been submitted successfully.`,
      });

      return job;
    } catch (error: any) {
      toast({
        title: 'Failed to Submit Job',
        description: error?.message || 'An error occurred while submitting the job.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  /**
   * Submit a synchronous job
   */
  const submitJobSync = useCallback(async (submission: JobSubmission): Promise<JobResult> => {
    setIsSubmitting(true);
    try {
      const result = await aiService.submitJobSync(submission);
      
      toast({
        title: 'Job Completed',
        description: 'Your job has been processed successfully.',
      });

      return result;
    } catch (error: any) {
      toast({
        title: 'Job Failed',
        description: error?.message || 'An error occurred while processing the job.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  /**
   * Cancel a job
   */
  const cancelJob = useCallback(async (jobId: string): Promise<void> => {
    setIsCanceling(true);
    try {
      await optimisticUpdate.updateInList(
        ['ai', 'jobs'],
        jobId,
        { status: 'cancelled' as JobStatus },
        aiService.cancelJob(jobId).then(() => ({
          id: jobId,
          status: 'cancelled' as JobStatus
        } as Job))
      );

      toast({
        title: 'Job Cancelled',
        description: `Job ${jobId} has been cancelled.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Cancel Job',
        description: error?.message || 'An error occurred while cancelling the job.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsCanceling(false);
    }
  }, []);

  /**
   * Retry a failed job
   */
  const retryJob = useCallback(async (jobId: string): Promise<Job> => {
    setIsRetrying(true);
    try {
      const newJob = await aiService.retryJob(jobId);
      
      // Add the new job to the list
      await optimisticUpdate.addToList(
        ['ai', 'jobs'],
        newJob,
        Promise.resolve(newJob)
      );

      toast({
        title: 'Job Retried',
        description: `Job has been resubmitted with ID ${newJob.id}.`,
      });

      return newJob;
    } catch (error: any) {
      toast({
        title: 'Failed to Retry Job',
        description: error?.message || 'An error occurred while retrying the job.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, []);

  /**
   * Delete a job
   */
  const deleteJob = useCallback(async (jobId: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await optimisticUpdate.removeFromList(
        ['ai', 'jobs'],
        jobId,
        aiService.deleteJob(jobId).then(() => void 0)
      );

      toast({
        title: 'Job Deleted',
        description: `Job ${jobId} has been deleted.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Delete Job',
        description: error?.message || 'An error occurred while deleting the job.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    submitJob,
    submitJobSync,
    cancelJob,
    retryJob,
    deleteJob,
    isSubmitting,
    isCanceling,
    isRetrying,
    isDeleting,
    isLoading: isSubmitting || isCanceling || isRetrying || isDeleting,
  };
}

/**
 * Hook for Server-Sent Events job updates
 */
export function useJobUpdates(jobId: string | null) {
  const [updates, setUpdates] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const connect = useCallback(() => {
    if (!jobId || typeof window === 'undefined') return;

    const eventSource = new EventSource(aiService.getJobUpdatesUrl(jobId));
    
    setConnectionStatus('connecting');

    eventSource.onopen = () => {
      setConnectionStatus('connected');
    };

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setUpdates(prev => [...prev, update]);
      
      // Update the job cache with new status
      mutate(['ai', 'jobs', jobId], (currentJob: Job | undefined) => {
        if (currentJob && update.status) {
          return { ...currentJob, status: update.status, updated_at: update.timestamp };
        }
        return currentJob;
      }, false);
    };

    eventSource.onerror = () => {
      setConnectionStatus('disconnected');
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setConnectionStatus('disconnected');
    };
  }, [jobId]);

  const disconnect = useCallback(() => {
    setConnectionStatus('disconnected');
    setUpdates([]);
  }, []);

  return {
    updates,
    connectionStatus,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
  };
}