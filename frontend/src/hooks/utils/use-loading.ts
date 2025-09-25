/**
 * Loading State Hooks - Manage loading states across components
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Simple loading state hook
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleLoading = useCallback(() => {
    setIsLoading(prev => !prev);
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
}

/**
 * Multi-state loading hook for complex operations
 */
export function useMultiLoading<T extends string>() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: T, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const startLoading = useCallback((key: T) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key: T) => {
    setLoading(key, false);
  }, [setLoading]);

  const isLoading = useCallback((key: T) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  const reset = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    loadingStates,
    reset,
  };
}

/**
 * Async operation hook with automatic loading states
 */
export function useAsyncOperation<T = any, TArgs extends any[] = any[]>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [isExecuted, setIsExecuted] = useState(false);

  const execute = useCallback(async (
    operation: (...args: TArgs) => Promise<T>,
    ...args: TArgs
  ): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    setIsExecuted(true);

    try {
      const result = await operation(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsExecuted(false);
  }, []);

  return {
    execute,
    reset,
    data,
    error,
    isLoading,
    isExecuted,
    isSuccess: !error && isExecuted && !isLoading,
    isError: !!error,
  };
}

/**
 * Debounced loading hook
 */
export function useDebouncedLoading(delay = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncedLoading, setIsDebouncedLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isLoading) {
      // Immediately set debounced loading to true
      setIsDebouncedLoading(true);
    } else {
      // Delay setting debounced loading to false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsDebouncedLoading(false);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, delay]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    isDebouncedLoading,
    startLoading,
    stopLoading,
    setIsLoading,
  };
}

/**
 * Loading overlay hook with timeout
 */
export function useLoadingWithTimeout(timeoutMs = 30000) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setHasTimedOut(false);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      setHasTimedOut(true);
      setIsLoading(false);
    }, timeoutMs);
  }, [timeoutMs]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setHasTimedOut(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    hasTimedOut,
    startLoading,
    stopLoading,
    reset,
  };
}

/**
 * Queue-based loading hook for sequential operations
 */
export function useLoadingQueue() {
  const [queue, setQueue] = useState<Array<{ id: string; label?: string }>>([]);
  const [current, setCurrent] = useState<{ id: string; label?: string } | null>(null);

  const addToQueue = useCallback((id: string, label?: string) => {
    setQueue(prev => [...prev, { id, label }]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const processNext = useCallback(() => {
    setQueue(prev => {
      if (prev.length === 0) {
        setCurrent(null);
        return prev;
      }
      
      const [next, ...rest] = prev;
      setCurrent(next || null);
      return rest;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrent(null);
  }, []);

  const isLoading = current !== null;
  const queueLength = queue.length;
  const hasQueue = queueLength > 0;

  return {
    addToQueue,
    removeFromQueue,
    processNext,
    clearQueue,
    queue,
    current,
    isLoading,
    queueLength,
    hasQueue,
  };
}