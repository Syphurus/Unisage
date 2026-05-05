import { NextResponse } from "next/server";
import { Pool } from "pg";

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
      connectionTest: null as string | null,
    },
    messages: [] as string[],
  };

  if (!databaseUrl) {
    healthCheck.messages.push(
      "DATABASE_URL is not set. Set it in Vercel project settings."
    );
    return NextResponse.json(healthCheck, { status: 503 });
  }

  if (isProduction && databaseUrl.startsWith("file:")) {
    healthCheck.messages.push(
      "DATABASE_URL points to local SQLite. Production must use Supabase Postgres."
    );
    return NextResponse.json(healthCheck, { status: 503 });
  }

  // Try to connect to the database
  if (databaseUrl && !databaseUrl.startsWith("file:")) {
    try {
      const pool = new Pool({ connectionString: databaseUrl });
      const client = await Promise.race([
        pool.connect(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), 5000)
        ),
      ]);
      const result = await client.query("SELECT NOW()");
      client.release();
      pool.end();
      healthCheck.database.connectionTest = `Connected successfully. Server time: ${result.rows[0]?.now}`;
    } catch (error) {
      healthCheck.messages.push(
        `Database connection failed: ${error instanceof Error ? error.message : String(error)}`
      );
      healthCheck.database.connectionTest = `Error: ${error instanceof Error ? error.message : String(error)}`;
      return NextResponse.json(healthCheck, { status: 503 });
    }
  }

  return NextResponse.json(healthCheck);
}
