const DB_NAME = 'DigitalEmdzCatalog';
const DB_VERSION = 1;
const STORE_NAME = 'catalog';

interface CatalogRecord {
  id: 'products';
  products: unknown[];
  updatedAt: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function loadProductCatalog<T>(): Promise<T[] | null> {
  try {
    const db = await getDB();
    return await new Promise<T[] | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get('products');
      request.onsuccess = () => {
        const record = request.result as CatalogRecord | undefined;
        resolve(Array.isArray(record?.products) ? (record!.products as T[]) : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function saveProductCatalog<T>(products: T[]): Promise<boolean> {
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({
        id: 'products',
        products,
        updatedAt: new Date().toISOString(),
      } satisfies CatalogRecord);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}
