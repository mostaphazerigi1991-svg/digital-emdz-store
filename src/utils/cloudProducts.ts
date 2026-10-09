import type { Product } from '../types';

const OWNER = 'mostaphazerigi1991-svg';
const REPO = 'digital-emdz-store';
const BRANCH = 'main';
const PATH = 'public/data/products.json';
const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}`;
const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
const TOKEN_KEY = 'digitalemdz_github_catalog_token';

const getToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};

export const getCloudCatalogToken = getToken;

export const setCloudCatalogToken = (token: string) => {
  try {
    if (token.trim()) sessionStorage.setItem(TOKEN_KEY, token.trim());
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
};

const encodeBase64Utf8 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

export async function loadCloudProducts(): Promise<Product[] | null> {
  try {
    const response = await fetch(`${RAW_URL}?v=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return Array.isArray(data) ? data as Product[] : null;
  } catch { return null; }
}

export async function saveCloudProducts(products: Product[]): Promise<{ ok: boolean; reason?: string }> {
  const token = getToken();
  if (!token) return { ok: false, reason: 'missing_token' };

  try {
    const currentResponse = await fetch(API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2026-03-10',
      },
    });
    if (!currentResponse.ok) {
      return { ok: false, reason: currentResponse.status === 401 || currentResponse.status === 403 ? 'invalid_token' : 'read_failed' };
    }
    const current = await currentResponse.json();
    const content = JSON.stringify(products, null, 2) + '\n';
    const updateResponse = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      body: JSON.stringify({
        message: 'Update Digital Emdz product catalog',
        content: encodeBase64Utf8(content),
        sha: current.sha,
        branch: BRANCH,
      }),
    });
    if (!updateResponse.ok) return { ok: false, reason: updateResponse.status === 409 ? 'conflict' : 'write_failed' };
    return { ok: true };
  } catch { return { ok: false, reason: 'network_error' }; }
}

export async function validateCloudCatalogToken(token: string): Promise<boolean> {
  const clean = token.trim();
  if (!clean) return false;
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${clean}`,
        'X-GitHub-Api-Version': '2026-03-10',
      },
    });
    return response.ok;
  } catch { return false; }
}

export const CLOUD_CATALOG_FILE = PATH;
export const CLOUD_CATALOG_RAW_URL = RAW_URL;
