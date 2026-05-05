import { NextResponse } from "next/server";

import { insertWaitlistEntry, listWaitlistEntries } from "@/lib/db";

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

  const { id } = await insertWaitlistEntry(name, email);
  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  const entries = await listWaitlistEntries();
  return NextResponse.json(entries);
}
