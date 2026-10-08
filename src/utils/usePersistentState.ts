/**
 * usePersistentState Hook
 * 
 * Provides atomic state management with guaranteed persistence:
 * - Loads data once on mount (never re-runs on updates)
 * - Commits changes atomically to storage
 * - Prevents race conditions with queue-based serialization
 * - Normalizes/validates data on load
 * - Handles storage failures gracefully
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { saveData, loadData, PERSIST_KEYS } from './persistence';

type PersistenceKey = keyof typeof PERSIST_KEYS;

interface PersistentStateOptions<T> {
  defaults: T;
  legacy?: () => Promise<T | null>;
  normalize?: (x: unknown) => T;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
  label?: string;
}

interface PersistentStateHandle<T> {
  value: T;
  ready: boolean;
  updatedAt: number;
  getLatest: () => T;
  commit: (
    update: T | ((prev: T) => T),
    options?: { successMessage?: string; successType?: 'success' | 'info' }
  ) => Promise<boolean>;
}

/**
 * Hook for persistent state management
 * Ensures single load on mount, atomic commits, and proper data validation
 */
export function usePersistentState<T>(
  key: PersistenceKey,
  options: PersistentStateOptions<T>
): PersistentStateHandle<T> {
  const { defaults, legacy, normalize, notify, label } = options;

  // State
  const [value, setValue] = useState<T>(defaults);
  const [ready, setReady] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(0);

  // Refs for atomic operations and preventing race conditions
  const latestRef = useRef<T>(defaults);
  const loadedRef = useRef(false);
  const commitQueueRef = useRef<Array<{ update: T | ((prev: T) => T); resolve: (v: boolean) => void }>>([]);
  const processingQueueRef = useRef(false);

  // Guard function to validate loaded data
  const dataGuard = useCallback((x: unknown): x is T => {
    // If we have a normalize function, we can accept any input
    return normalize ? true : x !== null && x !== undefined;
  }, [normalize]);

  // Initial load (once on mount, never re-runs)
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    (async () => {
      try {
        // First, load from new persistent storage system
        let loaded = await loadData(key, dataGuard, defaults);

        // Apply normalization if provided
        if (normalize) {
          loaded = normalize(loaded);
        }

        // Validate the loaded data matches type
        if (loaded === null || loaded === undefined) {
          console.warn(`${label || key}: Invalid loaded data, using defaults`);
          loaded = defaults;
        }

        // Update local state
        latestRef.current = loaded;
        setValue(loaded);
        setUpdatedAt(Date.now());
      } catch (e) {
        console.error(`${label || key}: Failed to load initial state:`, e);
        latestRef.current = defaults;
        setValue(defaults);
      } finally {
        setReady(true);
      }
    })();
  }, [key, defaults, dataGuard, normalize, label]);

  // Process commit queue (serialized saves to prevent race conditions)
  useEffect(() => {
    if (!ready || processingQueueRef.current || commitQueueRef.current.length === 0) return;

    const processQueue = async () => {
      processingQueueRef.current = true;

      while (commitQueueRef.current.length > 0) {
        const { update, resolve } = commitQueueRef.current.shift()!;

        try {
          // Calculate the new value
          let newValue: T;
          if (typeof update === 'function') {
            newValue = (update as (prev: T) => T)(latestRef.current);
          } else {
            newValue = update;
          }

          // Validate and normalize before saving
          if (normalize) {
            newValue = normalize(newValue);
          }

          // Check for null/undefined
          if (newValue === null || newValue === undefined) {
            console.error(`${label || key}: Attempted to save null/undefined value`);
            resolve(false);
            continue;
          }

          // Save to persistent storage (IndexedDB)
          const saveSuccess = await saveData(key, newValue);

          if (saveSuccess) {
            // Update local state only after successful save
            latestRef.current = newValue;
            setValue(newValue);
            setUpdatedAt(Date.now());
            resolve(true);
          } else {
            console.error(`${label || key}: Failed to save to storage`);
            resolve(false);
          }
        } catch (e) {
          console.error(`${label || key}: Error in commit queue:`, e);
          resolve(false);
        }
      }

      processingQueueRef.current = false;

      // Process any new items that were added while processing
      if (commitQueueRef.current.length > 0) {
        processQueue();
      }
    };

    processQueue();
  }, [ready, key, normalize, label]);

  // Commit function - queues changes for atomic persistence
  const commit = useCallback(
    async (
      update: T | ((prev: T) => T),
      commitOptions?: { successMessage?: string; successType?: 'success' | 'info' }
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        // Queue the commit
        commitQueueRef.current.push({ update, resolve });

        // Notify user immediately (actual save happens async)
        if (commitOptions?.successMessage && notify) {
          notify(commitOptions.successMessage, commitOptions.successType || 'success');
        }

        // Trigger processing if not already running
        if (!processingQueueRef.current && ready) {
          // Force a re-render to trigger the useEffect
          setValue((prev) => prev);
        }
      });
    },
    [notify, ready]
  );

  // Get the latest value (for operations that need current state without waiting)
  const getLatest = useCallback(() => latestRef.current, []);

  return {
    value,
    ready,
    updatedAt,
    getLatest,
    commit,
  };
}
