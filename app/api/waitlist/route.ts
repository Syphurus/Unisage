import { NextResponse } from "next/server";

import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
  } | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const res = await pool.query(
    'INSERT INTO "WaitlistEntry" (name, email) VALUES ($1, $2) RETURNING id',
    [name, email]
  );

  const id = res.rows[0]?.id;
  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  const result = await pool.query(
    'SELECT id, name, email, "createdAt" FROM "WaitlistEntry" ORDER BY "createdAt" DESC LIMIT 200'
  );

  return NextResponse.json(result.rows);
}
