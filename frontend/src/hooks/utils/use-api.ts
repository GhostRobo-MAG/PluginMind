/**
 * Generic API Hook - Reusable hook for any API operation
 */

import useSWR, { SWRConfiguration } from 'swr';
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Generic hook for fetching data with SWR
 */
export function useAPI<T>(
  key: any,
  fetcher: () => Promise<T>,
  config?: SWRConfiguration<T>
) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR<T>(key, fetcher, config);

  return {
    data,
    error,
    isLoading,
    isValidating,
    refetch: mutate,
  };
}

/**
 * Generic hook for async mutations
 */
export function useAsyncMutation<TData = any, TVariables = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(async (
    asyncFunction: (variables: TVariables) => Promise<TData>,
    variables: TVariables,
    options?: {
      onSuccess?: (data: TData) => void;
      onError?: (error: Error) => void;
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<TData | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(variables);
      setData(result);

      if (options?.showSuccessToast !== false) {
        toast({
          title: 'Success',
          description: options?.successMessage || 'Operation completed successfully.',
        });
      }

      options?.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
      setError(error);

      if (options?.showErrorToast !== false) {
        toast({
          title: 'Error',
          description: options?.errorMessage || error.message,
          variant: 'destructive',
        });
      }

      options?.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    reset,
    data,
    error,
    isLoading,
  };
}

/**
 * Hook for optimistic updates with rollback
 */
export function useOptimisticMutation<TData = any, TVariables = any>(
  cacheKey: any,
  mutationFn: (variables: TVariables) => Promise<TData>,
  optimisticUpdateFn?: (variables: TVariables, currentData?: TData) => TData
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setIsLoading(true);
    setError(null);

    // Import SWR mutate function
    const { mutate: swrMutate } = await import('swr');

    let originalData: TData | undefined;

    try {
      // Store original data for rollback
      originalData = await swrMutate(cacheKey, undefined, { revalidate: false }) as TData;

      // Apply optimistic update if function provided
      if (optimisticUpdateFn) {
        const optimisticData = optimisticUpdateFn(variables, originalData);
        swrMutate(cacheKey, optimisticData as any, false);
      }

      // Execute the actual mutation
      const result = await mutationFn(variables);

      // Update cache with real result
      swrMutate(cacheKey, result, false);

      return result;
    } catch (err: any) {
      // Rollback optimistic update
      if (originalData !== undefined) {
        swrMutate(cacheKey, originalData as any, false);
      }

      const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, mutationFn, optimisticUpdateFn]);

  return {
    mutate,
    isLoading,
    error,
  };
}

/**
 * Hook for polling data with configurable intervals
 */
export function usePolling<T>(
  key: any,
  fetcher: () => Promise<T>,
  options?: {
    interval?: number;
    enabled?: boolean;
    onData?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const { interval = 5000, enabled = true, onData, onError } = options || {};

  const result = useSWR<T>(
    enabled ? key : null,
    fetcher,
    {
      refreshInterval: enabled ? interval : 0,
      revalidateOnFocus: false,
      onSuccess: onData,
      onError,
    }
  );

  const startPolling = useCallback(() => {
    result.mutate();
  }, [result]);

  const stopPolling = useCallback(() => {
    // Polling is controlled by the enabled flag and refreshInterval
    // To stop polling, the parent should set enabled to false
  }, []);

  return {
    ...result,
    startPolling,
    stopPolling,
    isPolling: enabled,
  };
}

/**
 * Hook for infinite scroll / pagination
 * Note: This is a placeholder implementation. For full infinite scroll,
 * implement using useSWRInfinite from swr/infinite
 */
export function useInfiniteAPI<T>(
  getKey: (pageIndex: number, previousPageData: T | null) => any,
  fetcher: (...args: any[]) => Promise<T>,
  config?: SWRConfiguration<T>
) {
  const [size, setSize] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(() => {
    setSize(prev => prev + 1);
  }, []);

  const refresh = useCallback(() => {
    setSize(1);
    setData([]);
  }, []);

  return {
    data,
    error,
    isLoading,
    isValidating: isLoading,
    loadMore,
    refresh,
    isEmpty: data.length === 0,
    isReachingEnd: false,
    size,
  };
}