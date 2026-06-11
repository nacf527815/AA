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
      // ===== 과일 =====
      { name: "부사 사과 5kg", category: "과일", price: 24900, listPrice: 29900, description: "아삭하고 새콤달콤한 제철 부사 사과입니다.", stock: 40 },
      { name: "신고 배 5kg", category: "과일", price: 27900, description: "시원하고 달콤한 국산 신고 배입니다.", stock: 30 },
      { name: "제주 감귤 3kg", category: "과일", price: 13900, listPrice: 16900, description: "새콤달콤 제주 노지 감귤입니다.", stock: 55 },
      { name: "샤인머스캣 2송이", category: "과일", price: 19900, description: "씨 없이 아삭한 고당도 샤인머스캣입니다.", stock: 25 },

      // ===== 채소 =====
      { name: "흙대파 1단", category: "채소", price: 3500, description: "아침에 수확한 신선한 흙대파입니다.", stock: 80 },
      { name: "알배추 2포기", category: "채소", price: 6900, listPrice: 8500, description: "고소하고 아삭한 알배추입니다.", stock: 40 },
      { name: "친환경 애호박 2개", category: "채소", price: 3900, description: "부드러운 식감의 친환경 애호박입니다.", stock: 90 },
      { name: "깐마늘 1kg", category: "채소", price: 14900, listPrice: 17900, description: "손질된 국산 깐마늘. 바로 요리에 사용하기 편합니다.", stock: 40 },
      { name: "방울토마토 1kg", category: "채소", price: 12000, description: "당도 높은 방울토마토입니다.", stock: 35 },

      // ===== 쌀·잡곡 =====
      { name: "친환경 쌀 10kg", category: "쌀·잡곡", price: 39000, listPrice: 45000, description: "군산 평야의 당해년도 친환경 햅쌀입니다.", stock: 60 },
      { name: "찰현미 2kg", category: "쌀·잡곡", price: 9900, description: "구수하고 쫀득한 국산 찰현미입니다.", stock: 50 },
      { name: "서리태 800g", category: "쌀·잡곡", price: 11900, listPrice: 13900, description: "밥에 넣어 먹기 좋은 국산 서리태입니다.", stock: 45 },

      // ===== 정육·계란 =====
      { name: "한돈 삼겹살 500g", category: "정육·계란", price: 13900, description: "국내산 한돈 생삼겹살입니다. 냉장 배송됩니다.", stock: 30 },
      { name: "무항생제 계란 30구", category: "정육·계란", price: 8900, listPrice: 10900, description: "신선한 무항생제 계란 30구입니다.", stock: 50 },
      { name: "국내산 닭볶음탕용 1kg", category: "정육·계란", price: 9900, description: "손질된 국내산 닭볶음탕용 토막입니다.", stock: 35 },

      // ===== 수산물 =====
      { name: "손질 갈치 3마리", category: "수산물", price: 19900, listPrice: 23900, description: "손질된 국내산 갈치입니다. 구이용으로 좋습니다.", stock: 20 },
      { name: "국내산 오징어 1kg", category: "수산물", price: 12900, description: "탱탱한 국내산 오징어입니다.", stock: 28 },
      { name: "마른 멸치 500g", category: "수산물", price: 14900, description: "국물용 마른 멸치입니다.", stock: 40 },

      // ===== 김치·반찬 =====
      { name: "포기김치 2kg", category: "김치·반찬", price: 22000, listPrice: 26000, description: "농협 농산물로 담근 시원한 포기김치입니다.", stock: 25 },
      { name: "묵은지 1kg", category: "김치·반찬", price: 12900, description: "깊게 숙성된 묵은지입니다. 찌개에 좋습니다.", stock: 30 },
      { name: "멸치볶음 200g", category: "김치·반찬", price: 6900, description: "고소한 잔멸치볶음 반찬입니다.", stock: 45 },

      // ===== 유제품 =====
      { name: "1A 신선우유 900ml", category: "유제품", price: 3200, description: "국내산 원유로 만든 1A 신선우유입니다.", stock: 70 },
      { name: "플레인 요거트 450g", category: "유제품", price: 5900, listPrice: 6900, description: "꾸덕한 무가당 플레인 요거트입니다.", stock: 40 },
      { name: "자연치즈 슬라이스 200g", category: "유제품", price: 7900, description: "고소한 자연치즈 슬라이스입니다.", stock: 35 },

      // ===== 가공식품 =====
      { name: "군산 쌀과자", category: "가공식품", price: 4500, description: "군산 쌀로 만든 바삭한 전통 쌀과자입니다.", stock: 100 },
      { name: "전통 고추장 1kg", category: "가공식품", price: 16900, listPrice: 19900, description: "국산 고춧가루로 담근 전통 고추장입니다.", stock: 35 },
      { name: "국산 들기름 250ml", category: "가공식품", price: 18000, description: "국내산 들깨를 저온 압착한 고소한 들기름입니다.", stock: 30 },

      // ===== 음료·간식 =====
      { name: "100% 사과주스 1L", category: "음료·간식", price: 6900, description: "국산 사과로 만든 착즙 사과주스입니다.", stock: 60 },
      { name: "현미 누룽지 1kg", category: "음료·간식", price: 9900, description: "구수한 현미 누룽지. 간식으로 좋습니다.", stock: 60 },
      { name: "혼합 견과류 400g", category: "음료·간식", price: 12900, listPrice: 15900, description: "하루 한 봉 건강한 혼합 견과류입니다.", stock: 50 },

      // ===== 건강식품 =====
      { name: "유기농 매실청 500ml", category: "건강식품", price: 15000, listPrice: 18000, description: "100% 국내산 매실로 담근 매실청입니다.", stock: 45 },
      { name: "국산 아카시아 꿀 1.2kg", category: "건강식품", price: 32000, listPrice: 38000, description: "진하고 향이 좋은 국내산 아카시아 벌꿀입니다.", stock: 20 },
      { name: "홍삼정과 200g", category: "건강식품", price: 18900, description: "국내산 홍삼으로 만든 달콤한 홍삼정과입니다.", stock: 30 },
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
