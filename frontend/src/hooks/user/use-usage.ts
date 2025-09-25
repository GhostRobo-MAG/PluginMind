/**
 * User Usage Hook - Manage user usage, quota, and billing
 */

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { userService } from '@/services';
import { UserUsage, UserQuota, PaginatedResponse } from '@/types/api';
import { createSWRKey } from '../swr-config';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch user API usage statistics
 */
export function useUsage(period: 'daily' | 'monthly' | 'yearly' = 'monthly') {
  const {
    data: usage,
    error,
    isLoading,
    isValidating,
    mutate: mutateUsage
  } = useSWR(
    createSWRKey.user.usage(),
    () => userService.getUsage(period),
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    usage,
    error,
    isLoading,
    isValidating,
    refetch: mutateUsage,
  };
}

/**
 * Hook to fetch detailed usage history with pagination
 */
export function useUsageHistory(params?: {
  period?: 'daily' | 'monthly' | 'yearly';
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: mutateHistory
  } = useSWR(
    ['user', 'usage', 'history', params],
    () => userService.getUsageHistory(params),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
    }
  );

  return {
    history: data?.items || [],
    totalEntries: data?.total || 0,
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
 * Hook to fetch user quota and limits
 */
export function useQuota() {
  const {
    data: quota,
    error,
    isLoading,
    isValidating,
    mutate: mutateQuota
  } = useSWR(
    createSWRKey.user.subscription(), // Using subscription key for quota
    () => userService.getQuota(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  );

  return {
    quota,
    error,
    isLoading,
    isValidating,
    refetch: mutateQuota,
  };
}

/**
 * Hook to fetch quota usage summary with percentage utilization
 */
export function useQuotaSummary() {
  const {
    data: summary,
    error,
    isLoading,
    isValidating,
    mutate: mutateSummary
  } = useSWR(
    ['user', 'quota', 'summary'],
    () => userService.getQuotaSummary(),
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  // Helper functions to get utilization percentages
  const getUtilization = useCallback((type: keyof NonNullable<typeof summary>['utilization']) => {
    return summary?.utilization?.[type] || 0;
  }, [summary]);

  const isOverLimit = summary?.is_over_limit || false;
  const warnings = summary?.warnings || [];
  const daysUntilReset = summary?.days_until_reset || 0;

  return {
    summary,
    quota: summary?.quota,
    utilization: summary?.utilization,
    getUtilization,
    isOverLimit,
    warnings,
    daysUntilReset,
    error,
    isLoading,
    isValidating,
    refetch: mutateSummary,
  };
}

/**
 * Hook to fetch billing information
 */
export function useBilling() {
  const {
    data: billing,
    error,
    isLoading,
    isValidating,
    mutate: mutateBilling
  } = useSWR(
    ['user', 'billing'],
    () => userService.getBilling(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
    }
  );

  return {
    billing,
    plan: billing?.plan,
    billingCycle: billing?.billing_cycle,
    amount: billing?.amount_usd,
    nextBillingDate: billing?.next_billing_date,
    paymentMethod: billing?.payment_method,
    billingHistory: billing?.billing_history || [],
    error,
    isLoading,
    isValidating,
    refetch: mutateBilling,
  };
}

/**
 * Combined hook for usage overview
 */
export function useUsageOverview(period: 'daily' | 'monthly' | 'yearly' = 'monthly') {
  const usage = useUsage(period);
  const quota = useQuota();
  const summary = useQuotaSummary();
  const billing = useBilling();

  const isLoading = usage.isLoading || quota.isLoading || summary.isLoading || billing.isLoading;
  const error = usage.error || quota.error || summary.error || billing.error;

  const refetchAll = useCallback(() => {
    usage.refetch();
    quota.refetch();
    summary.refetch();
    billing.refetch();
  }, [usage, quota, summary, billing]);

  // Calculate usage percentages
  const usagePercentages = {
    apiCalls: summary.getUtilization('api_calls_percent'),
    processingTime: summary.getUtilization('processing_time_percent'),
    data: summary.getUtilization('data_percent'),
    jobs: summary.getUtilization('jobs_percent'),
  };

  // Get warning levels
  const getWarningLevel = (percentage: number) => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'moderate';
    return 'normal';
  };

  return {
    usage: usage.usage,
    quota: quota.quota,
    summary: summary.summary,
    billing: billing.billing,
    usagePercentages,
    getWarningLevel,
    isOverLimit: summary.isOverLimit,
    warnings: summary.warnings,
    daysUntilReset: summary.daysUntilReset,
    isLoading,
    error,
    refetchAll,
  };
}

/**
 * Hook for data export functionality
 */
export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    export_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    download_url?: string;
    created_at: string;
    expires_at: string;
    error?: string;
  } | null>(null);

  /**
   * Initiate data export
   */
  const exportData = useCallback(async () => {
    setIsExporting(true);
    try {
      const result = await userService.exportData();
      setExportStatus(result);

      toast({
        title: 'Data Export Initiated',
        description: 'Your data export has been started. You will be notified when it\'s ready.',
      });

      return result;
    } catch (error: any) {
      toast({
        title: 'Failed to Export Data',
        description: error?.message || 'An error occurred while initiating data export.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  /**
   * Check export status
   */
  const checkExportStatus = useCallback(async (exportId: string) => {
    try {
      const status = await userService.getExportStatus(exportId);
      setExportStatus(status);
      return status;
    } catch (error: any) {
      toast({
        title: 'Failed to Check Export Status',
        description: error?.message || 'An error occurred while checking export status.',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  return {
    exportData,
    checkExportStatus,
    exportStatus,
    isExporting,
    isReady: exportStatus?.status === 'completed',
    downloadUrl: exportStatus?.download_url,
  };
}