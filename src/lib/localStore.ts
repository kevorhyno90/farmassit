import { fetchData, saveDataRemote, USE_SERVER_PERSISTENCE } from './persistence';

export async function loadDataRemote<T>(resource: string, fallback: T): Promise<T> {
  if (!USE_SERVER_PERSISTENCE) return fallback;
  const remote = await fetchData(resource);
  return (remote ?? fallback) as T;
}

export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('loadData parse error', e);
    return fallback;
  }
}

export async function saveData<T>(key: string, data: T, resource?: string) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('saveData error', e);
  }
  if (USE_SERVER_PERSISTENCE && resource) {
    await saveDataRemote(resource, data);
  }
}
