/**
 * Persistent state hook with serialized IndexedDB commits.
 * The v2 IndexedDB record is authoritative after the first load.
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

export function usePersistentState<T>(
  key: PersistenceKey,
  options: PersistentStateOptions<T>
): PersistentStateHandle<T> {
  const { defaults, normalize, notify, label } = options;

  const [value, setValue] = useState<T>(defaults);
  const [ready, setReady] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(0);

  const latestRef = useRef<T>(defaults);
  const loadedRef = useRef(false);
  const processingQueueRef = useRef(false);
  const commitQueueRef = useRef<Array<{
    update: T | ((prev: T) => T);
    options?: { successMessage?: string; successType?: 'success' | 'info' };
    resolve: (value: boolean) => void;
  }>>([]);

  const dataGuard = useCallback((x: unknown): x is T => {
    return normalize ? true : x !== null && x !== undefined;
  }, [normalize]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    void (async () => {
      try {
        let loaded = await loadData(key, dataGuard, defaults);

        if (normalize) {
          loaded = normalize(loaded);
        }

        if (loaded === null || loaded === undefined) {
          loaded = defaults;
        }

        latestRef.current = loaded;
        setValue(loaded);
        setUpdatedAt(Date.now());
      } catch (error) {
        console.error(`${label || key}: Failed to load initial state:`, error);
        latestRef.current = defaults;
        setValue(defaults);
      } finally {
        setReady(true);
      }
    })();
  }, [key, defaults, dataGuard, normalize, label]);

  const processQueue = useCallback(async () => {
    if (!ready || processingQueueRef.current) return;

    processingQueueRef.current = true;
    try {
      while (commitQueueRef.current.length > 0) {
        const item = commitQueueRef.current.shift();
        if (!item) continue;

        try {
          let nextValue =
            typeof item.update === 'function'
              ? (item.update as (prev: T) => T)(latestRef.current)
              : item.update;

          if (normalize) {
            nextValue = normalize(nextValue);
          }

          if (nextValue === null || nextValue === undefined) {
            console.error(`${label || key}: Refused to save null/undefined`);
            item.resolve(false);
            continue;
          }

          const saved = await saveData(key, nextValue);
          if (!saved) {
            console.error(`${label || key}: IndexedDB save failed`);
            if (notify) {
              notify(`فشل حفظ ${label || key}. لم يتم اعتماد التغيير.`, 'error');
            }
            item.resolve(false);
            continue;
          }

          // Update memory only after the durable write succeeds.
          latestRef.current = nextValue;
          setValue(nextValue);
          setUpdatedAt(Date.now());

          if (item.options?.successMessage && notify) {
            notify(item.options.successMessage, item.options.successType || 'success');
          }
          item.resolve(true);
        } catch (error) {
          console.error(`${label || key}: Commit failed:`, error);
          if (notify) {
            notify(`فشل حفظ ${label || key}. لم يتم اعتماد التغيير.`, 'error');
          }
          item.resolve(false);
        }
      }
    } finally {
      processingQueueRef.current = false;
    }
  }, [key, normalize, ready, notify, label]);

  useEffect(() => {
    if (ready && commitQueueRef.current.length > 0) {
      void processQueue();
    }
  }, [ready, processQueue]);

  const commit = useCallback(
    async (
      update: T | ((prev: T) => T),
      options?: { successMessage?: string; successType?: 'success' | 'info' }
    ): Promise<boolean> => {
      if (!ready) {
        console.warn(`${label || key}: Commit requested before storage was ready`);
        return false;
      }

      return await new Promise<boolean>((resolve) => {
        commitQueueRef.current.push({ update, options, resolve });
        void processQueue();
      });
    },
    [key, label, processQueue, ready]
  );

  const getLatest = useCallback(() => latestRef.current, []);

  return {
    value,
    ready,
    updatedAt,
    getLatest,
    commit,
  };
}
