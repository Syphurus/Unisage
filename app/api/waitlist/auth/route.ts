import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ADMIN_PASSWORD =
  process.env.WAITLIST_ADMIN_PASSWORD ?? "Escapethematrix101";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
