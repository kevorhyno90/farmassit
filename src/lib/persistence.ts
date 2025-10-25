// client-side persistence helper. Client will prefer server API when USE_SERVER_PERSISTENCE is true.
export const USE_SERVER_PERSISTENCE = true; // flip to true to prefer API if available

export async function fetchData(resource: string): Promise<unknown | null> {
  try {
    const res = await fetch(`/api/data/${resource}`);
    if (!res.ok) throw new Error('fetch error');
    return res.json();
  } catch (err) {
    // network or server error — caller will fallback to local storage
    console.warn('fetchData failed, falling back to localStorage', err);
    return null;
  }
}

export async function saveDataRemote(resource: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch(`/api/data/${resource}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    return res.ok;
  } catch (err) {
    console.warn('saveDataRemote failed', err);
    return false;
  }
}
