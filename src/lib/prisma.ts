import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 개발 중 Next.js 핫 리로드로 PrismaClient가 여러 번 생성되는 것을 막기 위한 싱글톤
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma 7은 드라이버 어댑터로 DB에 연결한다.
// 운영(앱 런타임)에서는 Supabase 커넥션 풀러(DATABASE_URL, 6543 포트)를 사용한다.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
