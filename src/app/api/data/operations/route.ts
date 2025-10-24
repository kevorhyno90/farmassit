import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const FILE = path.join(DATA_DIR, 'operations.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function GET() {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(FILE, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(req: Request) {
  await ensureDataDir();
  const body = await req.text();
  try {
    await fs.writeFile(FILE, body, 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
