/**
 * Central persistence layer for all store data
 * Handles localStorage, IndexedDB, and provides atomic operations
 * with proper error handling and race condition prevention
 */

const DB_NAME = 'DigitalEmdzStore';
const DB_VERSION = 2;
const STORE_NAME = 'data';
const LEGACY_DB_NAME = 'DigitalEmdzCatalog';

// Persistence keys - single source of truth
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

/**
 * Initialize IndexedDB with migration support
 */
async function initializeDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onblocked = () => console.warn('DB operation blocked');

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Remove old object store if it exists
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }

      // Create new object store with timestamp index
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      store.createIndex('timestamp', 'timestamp', { unique: false });
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };
  });
}

/**
 * Migrate legacy data from old storage systems
 */
async function migrateOldData<T>(key: PersistenceKey, guard: (x: unknown) => x is T): Promise<T | null> {
  try {
    // Try legacy localStorage first
    const legacyKey = `digitalemdz_${key.replace('_v2', '')}`;
    const stored = localStorage.getItem(legacyKey);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (guard(parsed)) {
          // Migrate to new system
          await saveDataInternal(key, parsed);
          // Keep old data for now, will be cleaned up
          return parsed;
        }
      } catch (e) {
        console.warn(`Failed to parse legacy ${legacyKey}:`, e);
      }
    }

    // Try legacy IndexedDB (products only)
    if (key === 'products') {
      const legacyData = await loadLegacyProductCatalog();
      if (legacyData) {
        await saveDataInternal(key, legacyData);
        return legacyData as unknown as T;
      }
    }
  } catch (e) {
    console.warn(`Migration failed for ${key}:`, e);
  }

  return null;
}

/**
 * Load product catalog from legacy IndexedDB
 */
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
        resolve(null);
        return;
      }

      const tx = db.transaction('catalog', 'readonly');
      const store = tx.objectStore('catalog');
      const getRequest = store.get('products');

      getRequest.onsuccess = () => {
        const record = getRequest.result as { products?: unknown };
        resolve(record?.products || null);
      };
      getRequest.onerror = () => resolve(null);
    };
  });
}

/**
 * Core internal save function - atomic operation
 */
async function saveDataInternal<T>(key: PersistenceKey, value: T): Promise<boolean> {
  try {
    const db = await dbInitPromise;
    const timestamp = Date.now();
    const data: StoredData = {
      key,
      value,
      timestamp,
      version: 1,
    };

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(data);

      request.onerror = () => {
        console.error(`Failed to save ${key} to IndexedDB:`, request.error);
        resolve(false);
      };

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        console.error(`Transaction failed for ${key}:`, tx.error);
        resolve(false);
      };
    });
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
    return false;
  }
}

/**
 * Core internal load function
 */
async function loadDataInternal<T>(key: PersistenceKey): Promise<T | null> {
  try {
    const db = await dbInitPromise;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const record = request.result as StoredData | undefined;
        resolve((record?.value as T) || null);
      };

      request.onerror = () => {
        console.warn(`Failed to load ${key} from IndexedDB`);
        resolve(null);
      };
    });
  } catch (e) {
    console.warn(`Error loading ${key}:`, e);
    return null;
  }
}

/**
 * Save data with validation and fallback
 */
export async function saveData<T>(key: PersistenceKey, value: T): Promise<boolean> {
  if (!value) {
    console.warn(`Attempted to save null/undefined value for ${key}`);
    return false;
  }

  try {
    // Try to estimate size (rough check for large payloads)
    const serialized = JSON.stringify(value);
    const sizeInMB = new Blob([serialized]).size / (1024 * 1024);

    if (sizeInMB > 5) {
      console.warn(`Data for ${key} exceeds 5MB (${sizeInMB.toFixed(2)}MB) - may fail to store`);
    }

    // Primary storage: IndexedDB
    const success = await saveDataInternal(key, value);
    if (!success) {
      console.error(`Primary storage failed for ${key}`);
      return false;
    }

    return true;
  } catch (e) {
    console.error(`Error in saveData for ${key}:`, e);
    return false;
  }
}

/**
 * Load data with fallback chain: IndexedDB → Legacy migrations → null
 */
export async function loadData<T>(
  key: PersistenceKey,
  guard: (x: unknown) => x is T,
  defaults: T
): Promise<T> {
  try {
    // First, try to load from new system
    const stored = await loadDataInternal<T>(key);
    if (stored && guard(stored)) {
      return stored;
    }

    // Second, try to migrate from old systems
    const migrated = await migrateOldData(key, guard);
    if (migrated) {
      return migrated;
    }

    // Finally, return defaults (never use INITIAL_DATA directly in context)
    return defaults;
  } catch (e) {
    console.error(`Error loading ${key}, falling back to defaults:`, e);
    return defaults;
  }
}

/**
 * Request persistent storage from browser
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage) {
    return false;
  }

  try {
    const persistent = await navigator.storage.persisted();
    if (!persistent && navigator.storage.persist) {
      return await navigator.storage.persist();
    }
    return persistent;
  } catch (e) {
    console.warn('Persistent storage request failed:', e);
    return false;
  }
}

/**
 * Clear all stored data (admin reset)
 */
export async function clearAllData(): Promise<boolean> {
  try {
    const db = await dbInitPromise;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => resolve(false);
      tx.oncomplete = () => resolve(true);
    });
  } catch (e) {
    console.error('Error clearing data:', e);
    return false;
  }
}

/**
 * Get all stored data (for debugging/export)
 */
export async function getAllData(): Promise<Record<string, unknown>> {
  try {
    const db = await dbInitPromise;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

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
  } catch (e) {
    console.error('Error getting all data:', e);
    return {};
  }
}
