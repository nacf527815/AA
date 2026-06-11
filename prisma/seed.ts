import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 시드는 마이그레이션과 동일하게 직접 연결(DIRECT_URL)을 우선 사용한다.
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 관리자 계정
  const adminPassword = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@gunsan.coop" },
    update: { role: "admin", passwordHash: adminPassword, name: "관리자" },
    create: {
      email: "admin@gunsan.coop",
      name: "관리자",
      role: "admin",
      passwordHash: adminPassword,
    },
  });

  // 일반 회원 테스트 계정 (README 안내용)
  const testPassword = await bcrypt.hash("test1234", 10);
  await prisma.user.upsert({
    where: { email: "test2@gunsan.test" },
    update: { passwordHash: testPassword, name: "테스트회원" },
    create: {
      email: "test2@gunsan.test",
      name: "테스트회원",
      role: "user",
      passwordHash: testPassword,
    },
  });

  // 샘플 상품 (재시드 시 중복 방지를 위해 기존 상품 삭제 — 주문이 있으면 먼저 비움)
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      // ===== 농산물 =====
      { name: "군산 햇감자 5kg", category: "농산물", price: 8900, listPrice: 11000, description: "군산 황토밭에서 자란 햇감자입니다. 포슬포슬한 식감이 일품입니다.", stock: 50 },
      { name: "흙대파 1단", category: "농산물", price: 3500, description: "아침에 수확한 신선한 흙대파입니다. 국물요리에 좋습니다.", stock: 80 },
      { name: "알배추 2포기", category: "농산물", price: 6900, listPrice: 8500, description: "고소하고 아삭한 알배추. 겉절이와 쌈에 잘 어울립니다.", stock: 40 },
      { name: "방울토마토 1kg", category: "농산물", price: 12000, description: "당도 높은 방울토마토. 간식과 샐러드로 즐기기 좋습니다.", stock: 35 },
      { name: "친환경 쌀 10kg", category: "농산물", price: 39000, listPrice: 45000, description: "군산 평야에서 친환경으로 재배한 당해년도 햅쌀입니다.", stock: 60 },
      { name: "고당도 꿀고구마 3kg", category: "농산물", price: 13900, listPrice: 16900, description: "달콤한 꿀고구마. 에어프라이어에 구우면 더욱 맛있습니다.", stock: 45 },
      { name: "햇양파 3kg", category: "농산물", price: 7900, description: "단단하고 매운맛이 적은 햇양파입니다.", stock: 70 },
      { name: "제철 사과 5kg", category: "농산물", price: 24900, listPrice: 29900, description: "아삭하고 새콤달콤한 제철 사과입니다.", stock: 30 },
      { name: "친환경 애호박 2개", category: "농산물", price: 3900, description: "부드러운 식감의 친환경 애호박입니다.", stock: 90 },
      { name: "깐마늘 1kg", category: "농산물", price: 14900, listPrice: 17900, description: "손질된 국산 깐마늘. 바로 요리에 사용하기 편합니다.", stock: 40 },

      // ===== 가공식품 =====
      { name: "군산 쌀과자", category: "가공식품", price: 4500, description: "군산 쌀로 만든 바삭한 전통 쌀과자입니다.", stock: 100 },
      { name: "유기농 매실청 500ml", category: "가공식품", price: 15000, listPrice: 18000, description: "100% 국내산 매실로 정성껏 담근 매실청입니다.", stock: 45 },
      { name: "국산 들기름 250ml", category: "가공식품", price: 18000, description: "국내산 들깨를 저온 압착한 고소한 들기름입니다.", stock: 30 },
      { name: "포기김치 2kg", category: "가공식품", price: 22000, listPrice: 26000, description: "군산원예농협 농산물로 담근 시원한 포기김치입니다.", stock: 25 },
      { name: "전통 고추장 1kg", category: "가공식품", price: 16900, listPrice: 19900, description: "국산 고춧가루로 담근 깊은 맛의 전통 고추장입니다.", stock: 35 },
      { name: "현미 누룽지 1kg", category: "가공식품", price: 9900, description: "구수한 현미 누룽지. 간식과 누룽지탕에 좋습니다.", stock: 60 },
      { name: "생들깨 가루 500g", category: "가공식품", price: 12900, description: "국산 들깨를 곱게 갈아 만든 들깨가루입니다.", stock: 40 },
      { name: "꿀 1.2kg", category: "가공식품", price: 32000, listPrice: 38000, description: "국내산 아카시아 벌꿀입니다. 진하고 향이 좋습니다.", stock: 20 },
    ],
  });

  const count = await prisma.product.count();
  console.log(`✅ 시드 완료: 상품 ${count}개, 관리자 계정 admin@gunsan.coop / admin1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
