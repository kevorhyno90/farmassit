import { fetchData, saveDataRemote, USE_SERVER_PERSISTENCE } from './persistence';

export async function loadDataRemote<T>(resource: string, fallback: T): Promise<T> {
  if (!USE_SERVER_PERSISTENCE) return fallback;
  const remote = await fetchData(resource);
  return (remote ?? fallback) as T;
}

export function loadData<T>(key: string, fallback: T): T {
  try {
  const storage = (globalThis as unknown as { localStorage?: Storage }).localStorage;
    if (!storage) return fallback;
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    // parse/localStorage access failure
    // keep deterministic fallback to avoid hydration differences
    // eslint-disable-next-line no-console
    console.error('loadData parse error', err);
    return fallback;
  }
}

export async function saveData<T>(key: string, data: T, resource?: string): Promise<void> {
  try {
  const storage = (globalThis as unknown as { localStorage?: Storage }).localStorage;
    if (storage) {
      storage.setItem(key, JSON.stringify(data));
    }
  } catch (err) {
    // ignore write failures (quota/permission) but log during development
    // eslint-disable-next-line no-console
    console.error('saveData error', err);
  }
  if (USE_SERVER_PERSISTENCE && resource) {
    await saveDataRemote(resource, data);
  }
}
