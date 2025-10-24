import { describe, it, expect, beforeEach } from 'vitest';
import { loadData, saveData } from '../src/lib/localStore';

// simple localStorage polyfill for Node test runtime
function createLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null; },
    setItem(key: string, value: string) { store[key] = String(value); },
    removeItem(key: string) { delete store[key]; },
    clear() { store = {}; },
  };
}

describe('localStore', () => {
  beforeEach(() => {
    if (typeof (globalThis as any).localStorage === 'undefined') {
      (globalThis as any).localStorage = createLocalStorageMock();
    }
    globalThis.localStorage.clear();
  });

  it('saves and loads data', async () => {
    const key = 'test.key';
    const data = { a: 1, b: 'x' };
    // saveData may be async (saves locally and optionally remotely)
    await saveData(key, data);
    const loaded = loadData(key, { a: 0, b: '' });
    expect(loaded).toEqual(data);
  });
});
