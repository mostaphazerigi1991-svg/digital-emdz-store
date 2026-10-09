/**
 * Central persistence layer for all store data.
 * IndexedDB is the single source of truth; legacy storage is used only
 * during a one-time migration when no v2 record exists.
 */

const DB_NAME = 'DigitalEmdzStore';
const DB_VERSION = 2;
const STORE_NAME = 'data';
const LEGACY_DB_NAME = 'DigitalEmdzCatalog';

export const PERSIST_KEYS = {
  products: 'digitalemdz_products_v2',
  orders: 'digitalemdz_orders_v2',
  settings: 'digitalemdz_settings_v2',
  coupons: 'digitalemdz_coupons_v2',
  cart: 'digitalemdz_cart_v2',
  paymentMethods: 'digitalemdz_payment_methods_v2',
  serviceRequests: 'digitalemdz_service_requests_v2',
  adminCredentials: 'digitalemdz_admin_credentials_v2',
} as const;

type PersistenceKey = keyof typeof PERSIST_KEYS;

interface StoredData {
  key: PersistenceKey;
  value: unknown;
  timestamp: number;
  version: number;
}

let dbInstance: IDBDatabase | null = null;
const dbInitPromise: Promise<IDBDatabase> = initializeDB();

async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onblocked = () => console.warn('DigitalEmdz persistence database is blocked');

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Never delete an existing store during an upgrade: doing so can erase
      // the owner's saved catalog/settings. Create it only when it is missing.
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      dbInstance.onversionchange = () => dbInstance?.close();
      resolve(dbInstance);
    };
  });
}

async function saveDataInternal<T>(key: PersistenceKey, value: T): Promise<boolean> {
  try {
    const db = await dbInitPromise;
    const data: StoredData = {
      key,
      value,
      timestamp: Date.now(),
      version: 1,
    };

    return await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const request = tx.objectStore(STORE_NAME).put(data);

      request.onerror = () => {
        console.error(`Failed to save ${key} to IndexedDB:`, request.error);
      };
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        console.error(`Transaction failed for ${key}:`, tx.error);
        resolve(false);
      };
      tx.onabort = () => resolve(false);
    });
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
}

async function loadDataInternal<T>(key: PersistenceKey): Promise<T | null> {
  try {
    const db = await dbInitPromise;

    return await new Promise<T | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(key);

      request.onsuccess = () => {
        const record = request.result as StoredData | undefined;
        // Important: [] is valid persisted data and must never be treated as missing.
        resolve(record ? (record.value as T) : null);
      };
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.warn(`Error loading ${key}:`, error);
    return null;
  }
}

async function removeLegacyLocalStorage(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore cleanup failures; the v2 record remains authoritative.
  }
}

function loadLegacyProductCatalog(): Promise<unknown> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(LEGACY_DB_NAME, 1);
    request.onerror = () => resolve(null);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('catalog')) {
        db.close();
        resolve(null);
        return;
      }

      const tx = db.transaction('catalog', 'readonly');
      const getRequest = tx.objectStore('catalog').get('products');

      getRequest.onsuccess = () => {
        const record = getRequest.result as { products?: unknown } | undefined;
        resolve(record && 'products' in record ? record.products : null);
      };
      getRequest.onerror = () => resolve(null);
      tx.oncomplete = () => db.close();
    };
  });
}

async function removeLegacyProductCatalog(): Promise<void> {
  try {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    const request = window.indexedDB.open(LEGACY_DB_NAME, 1);
    await new Promise<void>((resolve) => {
      request.onerror = () => resolve();
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('catalog')) {
          db.close();
          resolve();
          return;
        }

        const tx = db.transaction('catalog', 'readwrite');
        tx.objectStore('catalog').delete('products');
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          resolve();
        };
      };
    });
  } catch {
    // Cleanup is best-effort only.
  }
}

async function migrateOldData<T>(
  key: PersistenceKey,
  guard: (x: unknown) => x is T
): Promise<T | null> {
  try {
    const legacyKey = `digitalemdz_${key.replace('_v2', '')}`;

    try {
      const stored = localStorage.getItem(legacyKey);
      if (stored !== null) {
        const parsed: unknown = JSON.parse(stored);
        if (guard(parsed)) {
          const saved = await saveDataInternal(key, parsed);
          if (saved) {
            await removeLegacyLocalStorage(legacyKey);
            return parsed;
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to migrate legacy ${legacyKey}:`, error);
    }

    if (key === 'products') {
      const legacyData = await loadLegacyProductCatalog();
      if (legacyData !== null && guard(legacyData)) {
        const saved = await saveDataInternal(key, legacyData);
        if (saved) {
          await removeLegacyProductCatalog();
          return legacyData;
        }
      }
    }
  } catch (error) {
    console.warn(`Migration failed for ${key}:`, error);
  }

  return null;
}

export async function saveData<T>(key: PersistenceKey, value: T): Promise<boolean> {
  if (value === null || value === undefined) {
    console.warn(`Attempted to save null/undefined for ${key}`);
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    const sizeInMB = new Blob([serialized]).size / (1024 * 1024);
    if (sizeInMB > 5) {
      console.warn(`Data for ${key} is ${sizeInMB.toFixed(2)}MB; IndexedDB may reject it.`);
    }

    const success = await saveDataInternal(key, value);
    if (!success) {
      console.error(`Primary storage failed for ${key}`);
    }
    return success;
  } catch (error) {
    console.error(`Error in saveData for ${key}:`, error);
    return false;
  }
}

export async function loadData<T>(
  key: PersistenceKey,
  guard: (x: unknown) => x is T,
  defaults: T
): Promise<T> {
  try {
    const stored = await loadDataInternal<T>(key);

    // A v2 IndexedDB record always wins, including an intentionally empty array [].
    if (stored !== null && guard(stored)) {
      return stored;
    }

    // Migrate the current v2 localStorage cache created by older builds.
    // This is intentionally checked before the legacy (non-v2) migration so
    // recent admin edits are preserved when upgrading to IndexedDB.
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(PERSIST_KEYS[key]);
        if (cached !== null) {
          const parsed: unknown = JSON.parse(cached);
          if (guard(parsed)) {
            const saved = await saveDataInternal(key, parsed);
            if (saved) {
              await removeLegacyLocalStorage(PERSIST_KEYS[key]);
              return parsed;
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to migrate v2 localStorage for ${key}:`, error);
    }

    // Products must never be resurrected from stale legacy storage.
    // The v2 IndexedDB record is authoritative; if it is absent, use defaults
    // instead of restoring an old deleted catalog.
    if (key === 'products') {
      return defaults;
    }

    const migrated = await migrateOldData(key, guard);
    if (migrated !== null && guard(migrated)) {
      return migrated;
    }

    return defaults;
  } catch (error) {
    console.error(`Error loading ${key}, falling back to defaults:`, error);
    return defaults;
  }
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage) return false;

  try {
    const persistent = await navigator.storage.persisted();
    if (!persistent && navigator.storage.persist) {
      return await navigator.storage.persist();
    }
    return persistent;
  } catch (error) {
    console.warn('Persistent storage request failed:', error);
    return false;
  }
}

export async function clearAllData(): Promise<boolean> {
  try {
    const db = await dbInitPromise;
    return await new Promise<boolean>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const request = tx.objectStore(STORE_NAME).clear();
      request.onerror = () => resolve(false);
      tx.oncomplete = () => resolve(true);
      tx.onabort = () => resolve(false);
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}

export async function getAllData(): Promise<Record<string, unknown>> {
  try {
    const db = await dbInitPromise;
    return await new Promise<Record<string, unknown>>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => {
        const records = (request.result as StoredData[]) || [];
        const data: Record<string, unknown> = {};
        records.forEach((record) => {
          data[record.key] = record.value;
        });
        resolve(data);
      };
      request.onerror = () => resolve({});
    });
  } catch (error) {
    console.error('Error getting all data:', error);
    return {};
  }
}
