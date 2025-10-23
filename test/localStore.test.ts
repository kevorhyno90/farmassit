import { describe, it, expect, beforeEach } from 'vitest';
import { loadData, saveData } from '@/lib/localStore';

describe('localStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads data', () => {
    const key = 'test.key';
    const data = { a: 1, b: 'x' };
    // saveData is async when server persistence enabled, but localStorage part is synchronous
    // we call without awaiting
    void saveData(key, data);
    const loaded = loadData(key, { a: 0, b: '' });
    expect(loaded).toEqual(data);
  });
});
