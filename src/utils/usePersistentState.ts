import { useState, useEffect, useCallback, useRef } from 'react';
import { loadData, saveData, PERSIST_KEYS } from './persistence';

interface UsePersistentStateOptions<T> {
  defaults: T;
  legacy?: () => Promise<T | null>;
  normalize?: (val: unknown) => T;
  notify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  label?: string;
}

const acceptAny = <T,>(_value: unknown): _value is T => true;

export function usePersistentState<T>(key: string, options: UsePersistentStateOptions<T>) {
  const [value, setValue] = useState<T>(options.defaults);
  const [ready, setReady] = useState(false);
  const latestRef = useRef<T>(options.defaults);
  const saveQueueRef = useRef<Promise<boolean>>(Promise.resolve(true));
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const loaded = await loadData<T>(key as keyof typeof PERSIST_KEYS, acceptAny<T>, optionsRef.current.defaults);
        const normalized = optionsRef.current.normalize ? optionsRef.current.normalize(loaded) : loaded;
        if (!mounted) return;
        latestRef.current = normalized;
        setValue(normalized);
      } catch (error) {
        console.error(`Error loading persistent state for "${key}":`, error);
        if (mounted) {
          latestRef.current = optionsRef.current.defaults;
          setValue(optionsRef.current.defaults);
        }
      } finally {
        if (mounted) setReady(true);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [key]);

  const commit = useCallback(async (
    newValueOrUpdater: T | ((prev: T) => T),
    commitOptions?: { successMessage?: string; successType?: 'success' | 'error' | 'info' }
  ): Promise<boolean> => {
    const previous = latestRef.current;
    const nextValue = typeof newValueOrUpdater === 'function'
      ? (newValueOrUpdater as (prev: T) => T)(previous)
      : newValueOrUpdater;

    latestRef.current = nextValue;
    setValue(nextValue);

    const queuedSave = saveQueueRef.current.then(async () => {
      let ok = await saveData(key as keyof typeof PERSIST_KEYS, nextValue);
      if (!ok && typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
          ok = true;
        } catch (error) {
          console.error(`Fallback save failed for "${key}":`, error);
        }
      }
      if (!ok) {
        optionsRef.current.notify?.(
          `فشل حفظ ${optionsRef.current.label || 'البيانات'}، يرجى المحاولة مرة أخرى.`,
          'error'
        );
      }
      return ok;
    });

    saveQueueRef.current = queuedSave.catch(() => false);
    const ok = await queuedSave;

    if (ok && commitOptions?.successMessage) {
      optionsRef.current.notify?.(commitOptions.successMessage, commitOptions.successType || 'success');
    }
    return ok;
  }, [key]);

  const getLatest = useCallback(() => latestRef.current, []);

  return { value, ready, commit, getLatest };
}
