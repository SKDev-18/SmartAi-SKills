import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function getDatabaseUrl(): string {
  // If remote DATABASE_URL is configured (e.g. Postgres, Supabase, Neon, Turso)
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // On Vercel / AWS Lambda, the root filesystem is read-only.
  // Copy pre-seeded SQLite database to the writable /tmp directory.
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(__dirname, "..", "..", "..", "prisma", "dev.db"),
        path.join(__dirname, "..", "..", "prisma", "dev.db"),
        path.join(__dirname, "..", "prisma", "dev.db"),
        path.join(process.cwd(), ".next", "server", "prisma", "dev.db"),
        path.resolve("./prisma/dev.db"),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            console.log(`[NexStep DB] Copied SQLite database from ${candidate} to /tmp/dev.db`);
            break;
          } catch (err) {
            console.error("[NexStep DB] Failed copying db candidate:", candidate, err);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  const defaultDbPath = path.resolve("./prisma/dev.db");
  return `file:${defaultDbPath}`;
}

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;
