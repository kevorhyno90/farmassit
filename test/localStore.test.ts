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
    type LS = ReturnType<typeof createLocalStorageMock>;
    const g = globalThis as unknown as { localStorage?: LS };
    if (typeof g.localStorage === 'undefined') {
      g.localStorage = createLocalStorageMock();
    }
    (g.localStorage as LS).clear();
  });

  it('saves and loads data', async () => {
    const key = 'test.key';
    const data = { a: 1, b: 'x' };
    // saveData is async when server persistence enabled; await it in the test
    await saveData(key, data);
    const loaded = loadData(key, { a: 0, b: '' });
    expect(loaded).toEqual(data);
  });
});
