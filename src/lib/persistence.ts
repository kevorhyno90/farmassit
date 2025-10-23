// client-side persistence helper. Client will prefer server API when USE_SERVER_PERSISTENCE is true.
export const USE_SERVER_PERSISTENCE = true; // flip to true to prefer API if available

export async function fetchData(resource: string) {
  try {
    const res = await fetch(`/api/data/${resource}`);
    if (!res.ok) throw new Error('fetch error');
    return res.json();
  } catch (e) {
    console.warn('fetchData failed, falling back to localStorage', e);
    return null;
  }
}

export async function saveDataRemote(resource: string, data: any) {
  try {
    const res = await fetch(`/api/data/${resource}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    return res.ok;
  } catch (e) {
    console.warn('saveDataRemote failed', e);
    return false;
  }
}
