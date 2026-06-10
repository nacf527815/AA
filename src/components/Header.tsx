import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";

const GNB = [
  { label: "전체상품", href: "/products" },
  { label: "농산물", href: "/products?category=농산물" },
  { label: "가공식품", href: "/products?category=가공식품" },
  { label: "이번주 특가", href: "/products?sale=1" },
];

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  let cartCount = 0;
  if (user?.id) {
    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      select: { quantity: true },
    });
    cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  }

  return (
    <header className="sticky top-0 z-30 bg-white">
      {/* 혜택 띠배너 */}
      <div className="bg-green-800 text-center text-xs font-medium text-white">
        <div className="mx-auto max-w-6xl px-4 py-1.5">
          🚚 3만원 이상 무료배송 · 🎟️ 신규회원 5% 할인쿠폰 · 🥬 산지직송 신선보장
        </div>
      </div>

      {/* 상단 유틸바 */}
      <div className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4">
          <span className="hidden sm:block">고객센터 063-000-0000 · 평일 09:00~18:00</span>
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-gray-700">
                  <b className="font-semibold">{user.name ?? "회원"}</b>님
                </span>
                <Link href="/mypage/orders" className="hover:text-gray-900">주문배송조회</Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="font-semibold text-green-700 hover:underline">
                    관리자
                  </Link>
                )}
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-900">로그인</Link>
                <Link href="/signup" className="hover:text-gray-900">회원가입</Link>
                <Link href="/mypage/orders" className="hover:text-gray-900">주문배송조회</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 메인: 로고 + 검색 + 장바구니 */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-green-700 text-lg font-bold text-white">
            농
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-gray-900">군산원예농협</span>
            <span className="text-[11px] font-medium text-green-700">하나로 직거래장터</span>
          </span>
        </Link>

        {/* 검색바 */}
        <form action="/products" method="get" className="mx-auto flex w-full max-w-xl items-center rounded-full border-2 border-green-700 bg-white pl-5 pr-1.5">
          <input
            type="text"
            name="q"
            placeholder="찾으시는 상품을 검색해보세요 (예: 쌀, 김치)"
            className="h-11 flex-1 bg-transparent text-sm outline-none"
            aria-label="상품 검색"
          />
          <button
            type="submit"
            className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-white"
            aria-label="검색"
          >
            🔍
          </button>
        </form>

        {/* 장바구니 */}
        <Link href="/cart" className="relative flex shrink-0 flex-col items-center text-gray-700 hover:text-green-700">
          <span className="text-2xl">🛒</span>
          <span className="text-[11px]">장바구니</span>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* 카테고리 GNB */}
      <div className="border-y border-green-700 bg-green-700">
        <nav className="mx-auto flex max-w-6xl items-center gap-1 px-4">
          {GNB.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
