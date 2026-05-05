import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const isProduction = process.env.NODE_ENV === "production";

  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: {
      configured: !!databaseUrl,
      isProduction,
      url: isProduction ? "***hidden***" : databaseUrl.slice(0, 50) + "...",
    },
    messages: [] as string[],
  };

  if (!databaseUrl) {
    healthCheck.messages.push(
      "DATABASE_URL is not set. Set it in Vercel project settings."
    );
  }

  if (isProduction && databaseUrl.startsWith("file:")) {
    healthCheck.messages.push(
      "DATABASE_URL points to local SQLite. Production must use Supabase Postgres."
    );
  }

  if (healthCheck.messages.length > 0) {
    return NextResponse.json(healthCheck, { status: 503 });
  }

  return NextResponse.json(healthCheck);
}
