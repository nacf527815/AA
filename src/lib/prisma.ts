import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// 개발 중 Next.js 핫 리로드로 PrismaClient가 여러 번 생성되는 것을 막기 위한 싱글톤
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma 7은 드라이버 어댑터로 DB에 연결한다 (SQLite: better-sqlite3)
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
