/**
 * User API Keys Hook - Manage user API keys for external integrations
 */

import useSWR, { mutate } from 'swr';
import { useState, useCallback } from 'react';
import { userService } from '@/services';
import { createSWRKey, optimisticUpdate } from '../swr-config';
import { toast } from '@/hooks/use-toast';

type APIKey = {
  id: string;
  name: string;
  key_preview: string;
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
};

type NewAPIKey = {
  id: string;
  name: string;
  key: string;
  created_at: string;
};

/**
 * Hook to fetch and manage user API keys
 */
export function useApiKeys() {
  const {
    data: apiKeys,
    error,
    isLoading,
    isValidating,
    mutate: mutateApiKeys
  } = useSWR(
    createSWRKey.user.apiKeys(),
    () => userService.getApiKeys(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    apiKeys: apiKeys || [],
    error,
    isLoading,
    isValidating,
    refetch: mutateApiKeys,
  };
}

/**
 * Hook for API key mutations
 */
export function useApiKeyMutations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newKeyData, setNewKeyData] = useState<NewAPIKey | null>(null);

  /**
   * Create a new API key
   */
  const createApiKey = useCallback(async (name: string): Promise<NewAPIKey> => {
    setIsCreating(true);
    try {
      const newKey = await userService.createApiKey(name);
      
      // Store the new key data for display (since key is only shown once)
      setNewKeyData(newKey);
      
      // Update the API keys list optimistically
      const optimisticKey: APIKey = {
        id: newKey.id,
        name: newKey.name,
        key_preview: `${newKey.key.slice(0, 8)}...${newKey.key.slice(-4)}`,
        created_at: newKey.created_at,
        is_active: true,
      };

      await optimisticUpdate.addToList(
        createSWRKey.user.apiKeys(),
        optimisticKey,
        Promise.resolve(optimisticKey)
      );

      toast({
        title: 'API Key Created',
        description: 'Your new API key has been created. Make sure to copy it now as it won\'t be shown again.',
      });

      return newKey;
    } catch (error: any) {
      toast({
        title: 'Failed to Create API Key',
        description: error?.message || 'An error occurred while creating the API key.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  /**
   * Delete an API key
   */
  const deleteApiKey = useCallback(async (keyId: string): Promise<void> => {
    setIsDeleting(keyId);
    try {
      await optimisticUpdate.removeFromList(
        createSWRKey.user.apiKeys(),
        keyId,
        userService.deleteApiKey(keyId).then(() => void 0)
      );

      toast({
        title: 'API Key Deleted',
        description: 'The API key has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Delete API Key',
        description: error?.message || 'An error occurred while deleting the API key.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsDeleting(null);
    }
  }, []);

  /**
   * Clear the new key data (after user has copied it)
   */
  const clearNewKeyData = useCallback(() => {
    setNewKeyData(null);
  }, []);

  return {
    createApiKey,
    deleteApiKey,
    clearNewKeyData,
    newKeyData,
    isCreating,
    isDeleting,
    isLoading: isCreating || isDeleting !== null,
  };
}

/**
 * Combined hook for API key management
 */
export function useApiKeyManagement() {
  const keys = useApiKeys();
  const mutations = useApiKeyMutations();

  // Helper functions
  const getActiveKeys = useCallback(() => {
    return keys.apiKeys.filter(key => key.is_active);
  }, [keys.apiKeys]);

  const getInactiveKeys = useCallback(() => {
    return keys.apiKeys.filter(key => !key.is_active);
  }, [keys.apiKeys]);

  const getRecentlyUsedKeys = useCallback(() => {
    return keys.apiKeys
      .filter(key => key.last_used_at)
      .sort((a, b) => 
        new Date(b.last_used_at!).getTime() - new Date(a.last_used_at!).getTime()
      );
  }, [keys.apiKeys]);

  const getKeyById = useCallback((keyId: string) => {
    return keys.apiKeys.find(key => key.id === keyId);
  }, [keys.apiKeys]);

  const getKeyUsageInfo = useCallback((key: APIKey) => {
    if (!key.last_used_at) {
      return {
        status: 'never_used',
        message: 'Never used',
        timeAgo: null,
      };
    }

    const lastUsed = new Date(key.last_used_at);
    const now = new Date();
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    let timeAgo: string;
    if (diffDays > 0) {
      timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      timeAgo = 'Just now';
    }

    let status: 'active' | 'inactive' | 'stale';
    if (diffDays <= 7) {
      status = 'active';
    } else if (diffDays <= 30) {
      status = 'inactive';
    } else {
      status = 'stale';
    }

    return {
      status,
      message: `Last used ${timeAgo}`,
      timeAgo,
    };
  }, []);

  return {
    // Data
    apiKeys: keys.apiKeys,
    activeKeys: getActiveKeys(),
    inactiveKeys: getInactiveKeys(),
    recentlyUsedKeys: getRecentlyUsedKeys(),
    newKeyData: mutations.newKeyData,
    
    // Loading states
    isLoading: keys.isLoading || mutations.isLoading,
    isCreating: mutations.isCreating,
    isDeleting: mutations.isDeleting,
    
    // Actions
    createApiKey: mutations.createApiKey,
    deleteApiKey: mutations.deleteApiKey,
    clearNewKeyData: mutations.clearNewKeyData,
    refetch: keys.refetch,
    
    // Helpers
    getKeyById,
    getKeyUsageInfo,
    
    // Errors
    error: keys.error,
  };
}