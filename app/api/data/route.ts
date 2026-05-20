import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

async function ensureFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE);
  } catch {
    await writeFile(DATA_FILE, JSON.stringify({ tasks: [], tabs: [] }, null, 2));
  }
}

export async function GET() {
  await ensureFile();
  const content = await readFile(DATA_FILE, "utf-8");
  return NextResponse.json(JSON.parse(content));
}

export async function POST(req: Request) {
  await ensureFile();
  const body = await req.json();
  await writeFile(DATA_FILE, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
