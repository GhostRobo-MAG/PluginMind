/**
 * User Profile Hook - Manage user profile and settings
 */

import useSWR, { mutate } from 'swr';
import { useState, useCallback } from 'react';
import { userService } from '@/services';
import { User } from '@/types/auth';
import { UpdateUserRequest } from '@/types/api';
import { createSWRKey, optimisticUpdate } from '../swr-config';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch and manage user profile
 */
export function useProfile() {
  const {
    data: profile,
    error,
    isLoading,
    isValidating,
    mutate: mutateProfile
  } = useSWR(
    createSWRKey.user.profile(),
    () => userService.getProfile(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    profile,
    error,
    isLoading,
    isValidating,
    refetch: mutateProfile,
  };
}

/**
 * Hook for user profile mutations
 */
export function useProfileMutations() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: UpdateUserRequest): Promise<User> => {
    setIsUpdating(true);
    try {
      const updatedProfile = await optimisticUpdate.update(
        createSWRKey.user.profile(),
        data as User, // Optimistic data (partial)
        userService.updateProfile(data)
      );

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      return updatedProfile;
    } catch (error: any) {
      toast({
        title: 'Failed to Update Profile',
        description: error?.message || 'An error occurred while updating your profile.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Upload user avatar
   */
  const uploadAvatar = useCallback(async (file: File): Promise<User> => {
    setIsUploadingAvatar(true);
    try {
      const updatedProfile = await userService.uploadAvatar(file);
      
      // Update profile cache
      mutate(createSWRKey.user.profile(), updatedProfile, false);

      toast({
        title: 'Avatar Updated',
        description: 'Your avatar has been updated successfully.',
      });

      return updatedProfile;
    } catch (error: any) {
      toast({
        title: 'Failed to Upload Avatar',
        description: error?.message || 'An error occurred while uploading your avatar.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  }, []);

  /**
   * Delete user avatar
   */
  const deleteAvatar = useCallback(async (): Promise<User> => {
    try {
      const updatedProfile = await userService.deleteAvatar();
      
      // Update profile cache
      mutate(createSWRKey.user.profile(), updatedProfile, false);

      toast({
        title: 'Avatar Removed',
        description: 'Your avatar has been removed successfully.',
      });

      return updatedProfile;
    } catch (error: any) {
      toast({
        title: 'Failed to Remove Avatar',
        description: error?.message || 'An error occurred while removing your avatar.',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  return {
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    isUpdating,
    isUploadingAvatar,
    isLoading: isUpdating || isUploadingAvatar,
  };
}

/**
 * Hook to fetch and manage user settings
 */
export function useUserSettings() {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: settings,
    error,
    isLoading,
    isValidating,
    mutate: mutateSettings
  } = useSWR(
    createSWRKey.user.settings(),
    () => userService.getSettings(),
    {
      revalidateOnFocus: false,
    }
  );

  /**
   * Update user settings
   */
  const updateSettings = useCallback(async (newSettings: Parameters<typeof userService.updateSettings>[0]) => {
    setIsUpdating(true);
    try {
      // Optimistic update
      const currentSettings = settings;
      const optimisticSettings = currentSettings ? {
        ...currentSettings,
        ...newSettings,
        notifications: { ...currentSettings.notifications, ...newSettings.notifications },
        ui_preferences: { ...currentSettings.ui_preferences, ...newSettings.ui_preferences },
        api_settings: { ...currentSettings.api_settings, ...newSettings.api_settings },
      } : newSettings;

      await optimisticUpdate.update(
        createSWRKey.user.settings(),
        optimisticSettings,
        userService.updateSettings(newSettings).then(() => optimisticSettings)
      );

      toast({
        title: 'Settings Updated',
        description: 'Your settings have been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Update Settings',
        description: error?.message || 'An error occurred while updating your settings.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [settings]);

  return {
    settings,
    updateSettings,
    error,
    isLoading,
    isValidating,
    isUpdating,
    refetch: mutateSettings,
  };
}

/**
 * Hook for user activity log
 */
export function useActivityLog(params?: {
  page?: number;
  page_size?: number;
  activity_type?: 'auth' | 'api' | 'billing' | 'settings';
  start_date?: string;
  end_date?: string;
}) {
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: mutateActivity
  } = useSWR(
    ['user', 'activity', params],
    () => userService.getActivityLog(params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    activities: data?.items || [],
    totalActivities: data?.total || 0,
    totalPages: data?.pages || 0,
    currentPage: data?.page || 1,
    hasNext: data?.has_next || false,
    hasPrev: data?.has_prev || false,
    error,
    isLoading,
    isValidating,
    refetch: mutateActivity,
  };
}