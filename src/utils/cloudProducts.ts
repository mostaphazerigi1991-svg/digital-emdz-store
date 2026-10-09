import type { Product } from '../types';

const CATALOG_API_URL = 'https://digital-emdz-0bch.hatchable.site/api/catalog';

// Kept for backwards compatibility with the old settings UI.
// The catalog is now stored in a real shared PostgreSQL database and deployed independently of browser storage.
export const getCloudCatalogToken = () => 'database';
export const setCloudCatalogToken = (_token: string) => {};

export async function loadCloudProducts(): Promise<Product[] | null> {
  try {
    const response = await fetch(CATALOG_API_URL, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data?.products) ? data.products as Product[] : null;
  } catch {
    return null;
  }
}

export async function saveCloudProducts(products: Product[]): Promise<{ ok: boolean; reason?: string }> {
  try {
    const response = await fetch(CATALOG_API_URL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return { ok: false, reason: data?.error || 'write_failed' };
    }
    const data = await response.json().catch(() => null);
    return data?.ok ? { ok: true } : { ok: false, reason: 'write_failed' };
  } catch {
    return { ok: false, reason: 'network_error' };
  }
}

export async function validateCloudCatalogToken(_token: string): Promise<boolean> {
  try {
    const response = await fetch(CATALOG_API_URL, { cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

export const CLOUD_CATALOG_FILE = 'PostgreSQL: product_catalog';
export const CLOUD_CATALOG_RAW_URL = CATALOG_API_URL;
