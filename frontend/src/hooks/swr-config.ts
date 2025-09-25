/**
 * SWR Configuration and Error Handling Setup
 * Centralized configuration for all API data fetching
 */

import { SWRConfiguration } from 'swr';
import { ApiError } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Default SWR configuration
export const swrConfig: SWRConfiguration = {
  // Revalidation settings
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  
  // Retry configuration
  shouldRetryOnError: (error) => {
    // Don't retry on 401 (unauthorized) or 403 (forbidden)
    if (error?.status === 401 || error?.status === 403) {
      return false;
    }
    // Retry on network errors and 5xx errors
    return error?.status >= 500 || !error?.status;
  },
  
  // Error retry delay with exponential backoff
  errorRetryInterval: 3000, // 3 seconds
  
  // Maximum retry count
  errorRetryCount: 3,
  
  // Deduplication interval
  dedupingInterval: 2000,
  
  // Loading timeout
  loadingTimeout: 10000,
  
  // Global error handler
  onError: (error: ApiError) => {
    console.error('SWR Error:', error);
    
    // Handle different error types
    if (error?.status === 401 || error?.status_code === 401) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to continue.',
        variant: 'destructive',
      });
      // Could trigger logout here if needed
    } else if (error?.status === 403 || error?.status_code === 403) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this resource.',
        variant: 'destructive',
      });
    } else if (error?.status === 404 || error?.status_code === 404) {
      toast({
        title: 'Not Found',
        description: 'The requested resource was not found.',
        variant: 'destructive',
      });
    } else if ((error?.status && error.status >= 500) || (error?.status_code && error.status_code >= 500)) {
      toast({
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        variant: 'destructive',
      });
    } else if (!error?.status && !error?.status_code) {
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
    } else {
      // Generic error
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  },
  
  // Success handler for mutations
  onSuccess: (data: any, key: string) => {
    // Log successful mutations for debugging
    if (key.includes('mutation')) {
      console.log('SWR Success:', { key, data });
    }
  },
  
  // Loading timeout handler
  onLoadingSlow: (key: string) => {
    console.warn('SWR Loading Slow:', key);
    toast({
      title: 'Loading...',
      description: 'This is taking longer than expected.',
    });
  },
};

// API Error class for better error handling
export class SWRError extends Error {
  status: number;
  statusText: string;
  data?: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = 'SWRError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// Helper function to create error objects
export const createSWRError = (error: any): SWRError => {
  if (error instanceof SWRError) {
    return error;
  }

  const status = error?.response?.status || error?.status || 0;
  const statusText = error?.response?.statusText || error?.statusText || 'Unknown Error';
  const message = error?.response?.data?.message || error?.message || 'An error occurred';
  const data = error?.response?.data || error?.data;

  return new SWRError(message, status, statusText, data);
};

// Key generation utilities
export const createSWRKey = {
  // AI Service keys
  ai: {
    analyze: (params: any) => ['ai', 'analyze', params],
    chat: (conversationId: string) => ['ai', 'chat', conversationId],
    conversations: () => ['ai', 'conversations'],
    models: () => ['ai', 'models'],
    usage: (timeframe?: string) => ['ai', 'usage', timeframe],
    templates: () => ['ai', 'templates'],
    status: () => ['ai', 'status'],
  },
  
  // User Service keys
  user: {
    profile: () => ['user', 'profile'],
    settings: () => ['user', 'settings'],
    preferences: () => ['user', 'preferences'],
    usage: () => ['user', 'usage'],
    subscription: () => ['user', 'subscription'],
    apiKeys: () => ['user', 'api-keys'],
    sessions: () => ['user', 'sessions'],
  },
  
  // Auth keys
  auth: {
    me: () => ['auth', 'me'],
    status: () => ['auth', 'status'],
  },
};

// Cache management utilities
export const swrCache = {
  // Clear all cache
  clearAll: () => {
    if (typeof window !== 'undefined') {
      // Clear SWR cache
      import('swr').then(({ mutate }) => {
        mutate(() => true, undefined, { revalidate: false });
      });
    }
  },
  
  // Clear specific cache pattern
  clearPattern: (pattern: string[]) => {
    if (typeof window !== 'undefined') {
      import('swr').then(({ mutate }) => {
        mutate(
          (key) => Array.isArray(key) && key.some(k => pattern.includes(k)),
          undefined,
          { revalidate: false }
        );
      });
    }
  },
  
  // Clear user-specific cache
  clearUserCache: () => {
    swrCache.clearPattern(['user', 'auth']);
  },
  
  // Clear AI service cache
  clearAICache: () => {
    swrCache.clearPattern(['ai']);
  },
};

// Optimistic update helpers
export const optimisticUpdate = {
  // Generic optimistic update
  update: async <T>(
    key: any,
    optimisticData: T,
    promise: Promise<T>
  ): Promise<T> => {
    const { mutate } = await import('swr');
    
    // Apply optimistic update
    mutate(key, optimisticData, false);
    
    try {
      // Execute the actual request
      const result = await promise;
      
      // Update with real data
      mutate(key, result, false);
      
      return result;
    } catch (error) {
      // Revert optimistic update on error
      mutate(key);
      throw error;
    }
  },
  
  // Add item to list optimistically
  addToList: async <T extends { id: string }>(
    key: any,
    newItem: T,
    promise: Promise<T>
  ): Promise<T> => {
    const { mutate } = await import('swr');
    
    mutate(
      key,
      (current: T[] | undefined) => current ? [...current, newItem] : [newItem],
      false
    );
    
    try {
      const result = await promise;
      mutate(key); // Revalidate
      return result;
    } catch (error) {
      mutate(key); // Revert
      throw error;
    }
  },
  
  // Remove item from list optimistically
  removeFromList: async <T extends { id: string }>(
    key: any,
    itemId: string,
    promise: Promise<void>
  ): Promise<void> => {
    const { mutate } = await import('swr');
    
    mutate(
      key,
      (current: T[] | undefined) => current?.filter(item => item.id !== itemId) || [],
      false
    );
    
    try {
      await promise;
      mutate(key); // Revalidate
    } catch (error) {
      mutate(key); // Revert
      throw error;
    }
  },
  
  // Update item in list optimistically
  updateInList: async <T extends { id: string }>(
    key: any,
    itemId: string,
    updates: Partial<T>,
    promise: Promise<T>
  ): Promise<T> => {
    const { mutate } = await import('swr');
    
    mutate(
      key,
      (current: T[] | undefined) => 
        current?.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        ) || [],
      false
    );
    
    try {
      const result = await promise;
      mutate(key); // Revalidate
      return result;
    } catch (error) {
      mutate(key); // Revert
      throw error;
    }
  },
};

export default swrConfig;