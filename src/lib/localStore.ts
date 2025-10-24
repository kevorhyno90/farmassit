import { fetchData, saveDataRemote, USE_SERVER_PERSISTENCE } from './persistence';

export async function loadDataRemote<T>(resource: string, fallback: T): Promise<T> {
  if (!USE_SERVER_PERSISTENCE) return fallback;
  const remote = await fetchData(resource);
  return (remote ?? fallback) as T;
}

export function loadData<T>(key: string, fallback: T): T {
  try {
    // support both browser and Node test env (globalThis.localStorage)
    const storage: Storage | undefined = (typeof window !== "undefined" && window.localStorage)
      ? window.localStorage
      : (typeof globalThis !== "undefined" ? (globalThis as unknown as { localStorage?: Storage }).localStorage : undefined);
    if (!storage) return fallback;
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('loadData parse error', e);
    return fallback;
  }
}

export async function saveData<T>(key: string, data: T, resource?: string) {
  try {
    const storage: Storage | undefined = (typeof window !== "undefined" && window.localStorage)
      ? window.localStorage
      : (typeof globalThis !== "undefined" ? (globalThis as unknown as { localStorage?: Storage }).localStorage : undefined);
    if (storage) {
      storage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.error('saveData error', e);
  }
  if (USE_SERVER_PERSISTENCE && resource) {
    await saveDataRemote(resource, data);
  }
}
