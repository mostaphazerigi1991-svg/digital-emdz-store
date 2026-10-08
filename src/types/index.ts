import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePersistentStateOptions<T> {
  defaults: T;
  legacy?: () => Promise<T | null>;
  normalize?: (val: unknown) => T;
  notify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  label?: string;
}

export function usePersistentState<T>(key: string, options: UsePersistentStateOptions<T>) {
  const [value, setValue] = useState<T>(options.defaults);
  const [ready, setReady] = useState(false);
  const optionsRef = useRef(options);

  // تحديث الخيارات دائماً لضمان عدم فقدان أي بيانات
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // تحميل البيانات عند فتح الموقع
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          const normalized = optionsRef.current.normalize ? optionsRef.current.normalize(parsed) : (parsed as T);
          if (isMounted) setValue(normalized);
        } else if (optionsRef.current.legacy) {
          const legacyData = await optionsRef.current.legacy();
          if (legacyData && isMounted) {
            setValue(legacyData);
            localStorage.setItem(key, JSON.stringify(legacyData));
          }
        }
      } catch (error) {
        console.error(`Error loading state for key "${key}":`, error);
      } finally {
        if (isMounted) setReady(true);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [key]);

  // دالة الحفظ (Commit) المعدلة والقوية التي تضمن حفظ الإضافة والحذف
  const commit = useCallback(async (
    newValueOrUpdater: T | ((prev: T) => T),
    commitOptions?: { successMessage?: string; successType?: 'success' | 'error' | 'info' }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setValue((prev) => {
        // حساب القيمة الجديدة سواء كانت إضافة أو حذف
        const nextValue = typeof newValueOrUpdater === 'function'
          ? (newValueOrUpdater as (prev: T) => T)(prev)
          : newValueOrUpdater;

        try {
          // الحفظ الإجباري في المتصفح
          localStorage.setItem(key, JSON.stringify(nextValue));
          
          if (commitOptions?.successMessage && optionsRef.current.notify) {
            optionsRef.current.notify(commitOptions.successMessage, commitOptions.successType || 'success');
          }
          resolve(true);
        } catch (error) {
          console.error(`Error saving state for key "${key}":`, error);
          if (optionsRef.current.notify) {
            optionsRef.current.notify(`فشل الحفظ! الذاكرة ممتلئة بسبب حجم الصور الكبير، يرجى مسح بعض البيانات.`, 'error');
          }
          resolve(false);
        }
        
        return nextValue;
      });
    });
  }, [key]);

  const getLatest = useCallback((): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return optionsRef.current.normalize ? optionsRef.current.normalize(parsed) : (parsed as T);
      }
    } catch (error) {
      console.error(`Error in getLatest for key "${key}":`, error);
    }
    return value;
  }, [key, value]);

  return { value, ready, commit, getLatest };
}
