/**
 * AI Services Hook - Manage available AI services
 */

import useSWR from 'swr';
import { aiService } from '@/services';
import { AIService, ServiceHealthMap } from '@/types/api';
import { createSWRKey } from '../swr-config';

/**
 * Hook to fetch available AI services
 */
export function useAIServices() {
  const {
    data: services,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(
    ['ai', 'services'],
    () => aiService.listServices(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    services: services || [],
    error,
    isLoading,
    isValidating,
    refetch: mutate,
    refresh: mutate, // Alias for compatibility
  };
}

/**
 * Hook to fetch real-time health status of all AI services
 */
export function useServiceHealth() {
  const {
    data: health,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(
    ['ai', 'services', 'health'],
    () => aiService.getServiceHealth(),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    health: health || {},
    error,
    isLoading,
    isValidating,
    refetch: mutate,
  };
}

/**
 * Hook to fetch health status of a specific AI service
 */
export function useServiceHealthById(serviceId: string | null) {
  const {
    data: health,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(
    serviceId ? ['ai', 'services', serviceId, 'health'] : null,
    () => serviceId ? aiService.getServiceHealthById(serviceId) : null,
    {
      refreshInterval: 15000, // Refresh every 15 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    health,
    error,
    isLoading,
    isValidating,
    refetch: mutate,
  };
}

/**
 * Hook to fetch service capabilities
 */
export function useServiceCapabilities(serviceId: string | null) {
  const {
    data: capabilities,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(
    serviceId ? ['ai', 'services', serviceId, 'capabilities'] : null,
    () => serviceId ? aiService.getServiceCapabilities(serviceId) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  );

  return {
    capabilities,
    error,
    isLoading,
    isValidating,
    refetch: mutate,
  };
}

/**
 * Hook to fetch service statistics
 */
export function useServiceStats(
  serviceId: string | null, 
  period: 'day' | 'week' | 'month' = 'month'
) {
  const {
    data: stats,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(
    serviceId ? ['ai', 'services', serviceId, 'stats', period] : null,
    () => serviceId ? aiService.getServiceStats(serviceId, period) : null,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false,
    }
  );

  return {
    stats,
    error,
    isLoading,
    isValidating,
    refetch: mutate,
  };
}

/**
 * Combined hook for all service-related data
 */
export function useServiceOverview(serviceId: string | null) {
  const services = useAIServices();
  const health = useServiceHealthById(serviceId);
  const capabilities = useServiceCapabilities(serviceId);
  const stats = useServiceStats(serviceId);

  const currentService = services.services.find(s => s.id === serviceId);

  return {
    service: currentService,
    health: health.health,
    capabilities: capabilities.capabilities,
    stats: stats.stats,
    isLoading: services.isLoading || health.isLoading || capabilities.isLoading || stats.isLoading,
    error: services.error || health.error || capabilities.error || stats.error,
    refetch: () => {
      services.refetch();
      health.refetch();
      capabilities.refetch();
      stats.refetch();
    },
  };
}