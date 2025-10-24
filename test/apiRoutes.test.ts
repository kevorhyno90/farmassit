import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock 'next/server' so NextResponse.json returns a plain object we can inspect
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, opts?: any) => ({ body, status: opts?.status ?? 200 }),
  },
}));

// In-memory fake for fs.promises
const files: Record<string, string> = {};

vi.mock('fs', () => ({
  promises: {
    mkdir: vi.fn(async (_p: string, _opts?: any) => {
      // noop - simulate success
      return;
    }),
    readFile: vi.fn(async (p: string) => {
      if (!Object.prototype.hasOwnProperty.call(files, p)) {
        const err: any = new Error('ENOENT');
        err.code = 'ENOENT';
        throw err;
      }
      return files[p];
    }),
    writeFile: vi.fn(async (p: string, content: string) => {
      files[p] = content;
    }),
  },
}));

// Helper to import a route module after mocks are set up
async function loadRoute(resourcePath: string) {
  return await import(resourcePath);
}

describe('file-backed API routes', () => {
  beforeEach(() => {
    // reset in-memory files
    for (const k of Object.keys(files)) delete files[k];
    // clear mocks
    vi.clearAllMocks();
  });

  const resources = [
    '/workspaces/farmassit/src/app/api/data/plantings/route.ts',
    '/workspaces/farmassit/src/app/api/data/operations/route.ts',
    '/workspaces/farmassit/src/app/api/data/tasks/route.ts',
  ];

  for (const r of resources) {
    it(`GET and PUT for ${r.split('/').slice(-2, -1)[0]} should work`, async () => {
      const route = await loadRoute(r);

      // Call GET when no file exists -> should return an empty array body and status 200
      const getRes = await (route as any).GET();
      expect(getRes).toBeDefined();
      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual([]);

      // Call PUT with some JSON data
      const sample = [{ id: 'X1', name: 'Sample' }];
      const fakeReq = { text: async () => JSON.stringify(sample) } as unknown as Request;
      const putRes = await (route as any).PUT(fakeReq);
      expect(putRes).toBeDefined();
      expect(putRes.body?.ok).toBe(true);

      // Subsequent GET should return the stored data
      const getRes2 = await (route as any).GET();
      expect(getRes2.status).toBe(200);
      expect(getRes2.body).toEqual(sample);
    });
  }
});
