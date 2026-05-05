import path from "node:path";
import { Pool } from "pg";

type WaitlistEntryRow = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

const databaseUrl = process.env.DATABASE_URL ?? "";
const isProduction = process.env.NODE_ENV === "production";
const usesSqlite =
  !databaseUrl ||
  databaseUrl.startsWith("file:") ||
  databaseUrl.endsWith(".db");

if (isProduction && usesSqlite) {
  throw new Error(
    "DATABASE_URL is missing or is pointing to local SQLite. Set DATABASE_URL to your Supabase Postgres connection string in Vercel."
  );
}

let sqliteDb: ReturnType<typeof createSqliteDb> | null = null;
let pgPool: Pool | null = null;

function createSqliteDb() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require("better-sqlite3");

  const databasePath = path.join(process.cwd(), "prisma", "dev.db");
  const db = new Database(databasePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS WaitlistEntry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

function getSqliteDb() {
  if (!sqliteDb) {
    sqliteDb = createSqliteDb();
  }

  return sqliteDb;
}

function getPgPool() {
  if (!pgPool) {
    pgPool = new Pool({ connectionString: databaseUrl });
  }

  return pgPool;
}

export async function insertWaitlistEntry(name: string, email: string) {
  if (usesSqlite) {
    const db = getSqliteDb();
    const result = db
      .prepare("INSERT INTO WaitlistEntry (name, email) VALUES (?, ?)")
      .run(name, email);

    return { id: Number(result.lastInsertRowid) };
  }

  const pool = getPgPool();
  const result = await pool.query(
    'INSERT INTO "WaitlistEntry" (name, email) VALUES ($1, $2) RETURNING id',
    [name, email]
  );

  return { id: result.rows[0]?.id as number | undefined };
}

export async function listWaitlistEntries(): Promise<WaitlistEntryRow[]> {
  if (usesSqlite) {
    const db = getSqliteDb();
    return db
      .prepare(
        "SELECT id, name, email, createdAt FROM WaitlistEntry ORDER BY createdAt DESC LIMIT 200"
      )
      .all() as WaitlistEntryRow[];
  }

  const pool = getPgPool();
  const result = await pool.query(
    'SELECT id, name, email, "createdAt" AS "createdAt" FROM "WaitlistEntry" ORDER BY "createdAt" DESC LIMIT 200'
  );

  return result.rows as WaitlistEntryRow[];
}
