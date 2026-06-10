// 공통 유틸 & 상수

export const CATEGORIES = ["농산물", "가공식품"] as const;
export type Category = (typeof CATEGORIES)[number];

export function isValidCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

// 가격을 "12,000원" 형태로 표시
export function formatPrice(won: number): string {
  return `${won.toLocaleString("ko-KR")}원`;
}

// 정상가 대비 할인율(%) 계산. 할인이 없으면 0
export function discountRate(price: number, listPrice?: number | null): number {
  if (!listPrice || listPrice <= price) return 0;
  return Math.round(((listPrice - price) / listPrice) * 100);
}
