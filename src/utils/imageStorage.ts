/**
 * Persistent Image Storage using IndexedDB with Canvas Compression
 * Enables permanent storage of high-resolution product photos without hitting
 * localStorage size limitations or relying on external image hosts.
 */

const DB_NAME = 'DigitalEmdzStorage';
const DB_VERSION = 1;
const STORE_NAME = 'product_images';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export interface StoredImageRecord {
  id: string;
  dataUrl: string;
  fileName: string;
  fileSize: number;
  originalSize: number;
  width: number;
  height: number;
  mimeType: string;
  createdAt: string;
}

/**
 * Compresses an image file from user device and converts to optimized Data URL
 * @param file File object from input[type="file"]
 * @param maxDimension Maximum width or height (default 1200px)
 * @param quality Compression quality between 0.1 and 1.0 (default 0.85)
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<{ dataUrl: string; width: number; height: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context not available');
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Support WebP if available, fallback to JPEG
          let mimeType = 'image/webp';
          let dataUrl = canvas.toDataURL(mimeType, quality);

          // If browser doesn't support webp encoding, it returns image/png
          if (!dataUrl.startsWith('data:image/webp')) {
            mimeType = 'image/jpeg';
            dataUrl = canvas.toDataURL(mimeType, quality);
          }

          // Approximate size in bytes from dataUrl length
          const compressedSize = Math.round((dataUrl.length * 3) / 4);

          resolve({ dataUrl, width, height, compressedSize });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('فشل تحميل الصورة'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('فشل قراءة الملف من الجهاز'));
    reader.readAsDataURL(file);
  });
}

/**
 * Saves compressed image to IndexedDB for permanent storage
 */
export async function saveImageToStorage(
  id: string,
  dataUrl: string,
  fileName: string,
  originalSize: number,
  width: number,
  height: number
): Promise<StoredImageRecord> {
  const record: StoredImageRecord = {
    id,
    dataUrl,
    fileName,
    fileSize: Math.round((dataUrl.length * 3) / 4),
    originalSize,
    width,
    height,
    mimeType: dataUrl.split(';')[0].replace('data:', ''),
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // If IndexedDB fails, we still return the record with dataUrl so app continues working
    console.warn('IndexedDB write warning:', err);
  }

  return record;
}

/**
 * Retrieves image by ID from IndexedDB
 */
export async function getImageFromStorage(id: string): Promise<StoredImageRecord | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}
