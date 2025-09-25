/**
 * Local Storage Hooks - Persistent state management
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Local storage hook with TypeScript support
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in state and localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Session storage hook with TypeScript support
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get initial value from sessionStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in state and sessionStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from sessionStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Storage hook that syncs across tabs
 */
export function useSyncedStorage<T>(
  key: string,
  initialValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const storage = storageType === 'localStorage' 
        ? window.localStorage 
        : window.sessionStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${storageType} key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        const storage = storageType === 'localStorage' 
          ? window.localStorage 
          : window.sessionStorage;
        storage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent(`storage-${key}`, { 
          detail: valueToStore 
        }));
      }
    } catch (error) {
      console.error(`Error setting ${storageType} key "${key}":`, error);
    }
  }, [key, storageType, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        const storage = storageType === 'localStorage' 
          ? window.localStorage 
          : window.sessionStorage;
        storage.removeItem(key);
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new CustomEvent(`storage-${key}`, { 
          detail: initialValue 
        }));
      }
    } catch (error) {
      console.error(`Error removing ${storageType} key "${key}":`, error);
    }
  }, [key, storageType, initialValue]);

  // Listen for storage changes across tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      setStoredValue(e.detail);
    };

    // Listen for native storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (same tab)
    window.addEventListener(`storage-${key}`, handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`storage-${key}`, handleCustomStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Storage hook with expiration
 */
export function useStorageWithExpiry<T>(
  key: string,
  initialValue: T,
  ttlMs?: number,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const storage = storageType === 'localStorage' 
        ? window.localStorage 
        : window.sessionStorage;
      const item = storage.getItem(key);
      
      if (!item) {
        return initialValue;
      }

      const parsedItem = JSON.parse(item);
      
      // Check if item has expiry
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        storage.removeItem(key);
        return initialValue;
      }

      return parsedItem.value || initialValue;
    } catch (error) {
      console.error(`Error reading ${storageType} key "${key}":`, error);
      return initialValue;
    }
  });

  const setValueWithExpiry = useCallback((
    newValue: T | ((val: T) => T),
    customTtlMs?: number
  ) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);

      if (typeof window !== 'undefined') {
        const storage = storageType === 'localStorage' 
          ? window.localStorage 
          : window.sessionStorage;
        
        const item = {
          value: valueToStore,
          expiry: (customTtlMs || ttlMs) ? Date.now() + (customTtlMs || ttlMs!) : null,
        };

        storage.setItem(key, JSON.stringify(item));
      }
    } catch (error) {
      console.error(`Error setting ${storageType} key "${key}":`, error);
    }
  }, [key, storageType, value, ttlMs]);

  const removeValue = useCallback(() => {
    try {
      setValue(initialValue);
      if (typeof window !== 'undefined') {
        const storage = storageType === 'localStorage' 
          ? window.localStorage 
          : window.sessionStorage;
        storage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing ${storageType} key "${key}":`, error);
    }
  }, [key, storageType, initialValue]);

  const checkExpiry = useCallback(() => {
    if (typeof window === 'undefined') return false;

    try {
      const storage = storageType === 'localStorage' 
        ? window.localStorage 
        : window.sessionStorage;
      const item = storage.getItem(key);
      
      if (!item) return true; // Considered expired if not found
      
      const parsedItem = JSON.parse(item);
      return parsedItem.expiry && Date.now() > parsedItem.expiry;
    } catch (error) {
      return true; // Considered expired if error
    }
  }, [key, storageType]);

  return [value, setValueWithExpiry, removeValue, checkExpiry] as const;
}