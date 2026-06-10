// 공통 유틸 & 상수

export const CATEGORIES = [
  "과일",
  "채소",
  "쌀·잡곡",
  "정육·계란",
  "수산물",
  "김치·반찬",
  "유제품",
  "가공식품",
  "음료·간식",
  "건강식품",
] as const;
export type Category = (typeof CATEGORIES)[number];

export function isValidCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

// 카테고리별 대표 이모지 (이미지 대체용)
const CATEGORY_EMOJI: Record<string, string> = {
  과일: "🍎",
  채소: "🥬",
  "쌀·잡곡": "🌾",
  "정육·계란": "🥩",
  수산물: "🐟",
  "김치·반찬": "🍲",
  유제품: "🥛",
  가공식품: "🥫",
  "음료·간식": "🥤",
  건강식품: "🌿",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🛒";
}

// 홈 카테고리 아이콘용 배경색 (순서대로 순환)
export const CATEGORY_BG = [
  "bg-red-100",
  "bg-green-100",
  "bg-amber-100",
  "bg-rose-100",
  "bg-sky-100",
  "bg-orange-100",
  "bg-blue-100",
  "bg-lime-100",
  "bg-cyan-100",
  "bg-emerald-100",
];

// 가격을 "12,000원" 형태로 표시
export function formatPrice(won: number): string {
  return `${won.toLocaleString("ko-KR")}원`;
}

// 정상가 대비 할인율(%) 계산. 할인이 없으면 0
export function discountRate(price: number, listPrice?: number | null): number {
  if (!listPrice || listPrice <= price) return 0;
  return Math.round(((listPrice - price) / listPrice) * 100);
}
