import path from "node:path";
import { PrismaClient } from "@prisma/client";

// Use SQLite (better-sqlite3 + Prisma adapter) for local dev when DATABASE_URL is not provided
// Use the normal Prisma client (Postgres, MySQL, etc.) when DATABASE_URL is present.

const databaseUrl = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (
  !databaseUrl ||
  databaseUrl.startsWith("file:") ||
  databaseUrl.endsWith(".db")
) {
  // Local SQLite adapter path
  // Lazy-import adapter & better-sqlite3 to avoid requiring them in production.
  // Lazy-require runtime-only native deps. Use CommonJS require to avoid ESM interop issues.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require("better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

  const databasePath = path.join(process.cwd(), "prisma", "dev.db");
  const sqliteDatabase = new Database(databasePath);

  sqliteDatabase.exec(`
    CREATE TABLE IF NOT EXISTS WaitlistEntry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const adapter = new PrismaBetterSqlite3({ url: databasePath });

  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} else {
  // Production DB (Postgres, etc.) — Prisma reads connection from DATABASE_URL
  const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
