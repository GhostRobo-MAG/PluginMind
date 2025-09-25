/**
 * Debounce Hooks - Debounce values and functions
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Debounce a value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function
 */
export function useDebouncedCallback<TArgs extends any[]>(
  callback: (...args: TArgs) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args: TArgs) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const flush = useCallback((...args: TArgs) => {
    cancel();
    callbackRef.current(...args);
  }, [cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(
    () => ({
      callback: debouncedCallback,
      cancel,
      flush,
    }),
    [debouncedCallback, cancel, flush]
  );
}

/**
 * Debounced state hook
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(immediateValue, delay);

  const setValue = useCallback((value: T) => {
    setImmediateValue(value);
  }, []);

  return [debouncedValue, immediateValue, setValue];
}

/**
 * Async debounced callback
 */
export function useAsyncDebouncedCallback<TArgs extends any[], TReturn>(
  callback: (...args: TArgs) => Promise<TReturn>,
  delay: number
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TReturn | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  const controllerRef = useRef<AbortController>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(async (...args: TArgs) => {
    // Cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset state
    setError(null);

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      controllerRef.current = new AbortController();

      try {
        const result = await callbackRef.current(...args);
        setData(result);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  const flush = useCallback(async (...args: TArgs) => {
    cancel();
    setIsLoading(true);
    setError(null);

    try {
      const result = await callbackRef.current(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err?.message || 'An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return {
    callback: debouncedCallback,
    cancel,
    flush,
    isLoading,
    error,
    data,
  };
}

/**
 * Debounced search hook
 */
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      setError(null);

      try {
        const searchResults = await searchFunction(debouncedQuery);
        setResults(searchResults);
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(err?.message || 'Search failed');
        setError(error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchFunction]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch,
    hasQuery: !!query.trim(),
    hasResults: results.length > 0,
  };
}