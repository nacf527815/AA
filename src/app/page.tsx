import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import PromoBanner from "@/components/PromoBanner";

const CATEGORY_ICONS = [
  { label: "농산물", emoji: "🥬", href: "/products?category=농산물", bg: "bg-green-100" },
  { label: "가공식품", emoji: "🍶", href: "/products?category=가공식품", bg: "bg-amber-100" },
  { label: "이번주 특가", emoji: "🏷️", href: "/products?sale=1", bg: "bg-red-100" },
  { label: "쌀·잡곡", emoji: "🌾", href: "/products?q=쌀", bg: "bg-yellow-100" },
  { label: "김치·반찬", emoji: "🥬", href: "/products?q=김치", bg: "bg-orange-100" },
  { label: "전체상품", emoji: "🛒", href: "/products", bg: "bg-emerald-100" },
];

const EXHIBITIONS = [
  { title: "제철 과일 기획전", sub: "지금 가장 맛있는 과일", emoji: "🍎", href: "/products?q=사과", from: "from-red-500", to: "to-rose-400" },
  { title: "우리쌀 직거래", sub: "산지직송 햅쌀", emoji: "🌾", href: "/products?q=쌀", from: "from-amber-500", to: "to-yellow-400" },
  { title: "건강 가공식품", sub: "매실청·들기름·꿀", emoji: "🍯", href: "/products?category=가공식품", from: "from-orange-500", to: "to-amber-400" },
  { title: "알뜰 특가전", sub: "최대 20% 할인", emoji: "🏷️", href: "/products?sale=1", from: "from-green-600", to: "to-emerald-400" },
];

function SectionHeader({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
      </div>
      <Link href={href} className="shrink-0 text-sm font-medium text-green-700 hover:underline">
        더보기 →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const [saleProducts, bestProducts, newProducts] = await Promise.all([
    prisma.product.findMany({ where: { listPrice: { not: null } }, take: 5, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ take: 5, orderBy: { price: "desc" } }),
    prisma.product.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const gridClass = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <div className="pb-16">
      {/* 히어로: 메인 배너 + 사이드 프로모 카드 */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PromoBanner />
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/signup"
              className="flex flex-1 items-center justify-between rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-6 text-white transition hover:brightness-105"
            >
              <div>
                <p className="text-xs font-medium text-green-100">신규회원 혜택</p>
                <p className="mt-1 text-lg font-bold leading-snug">
                  가입하고 <br /> 5% 쿠폰 받기
                </p>
              </div>
              <span className="text-4xl">🎟️</span>
            </Link>
            <Link
              href="/products?sale=1"
              className="flex flex-1 items-center justify-between rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 p-6 text-white transition hover:brightness-105"
            >
              <div>
                <p className="text-xs font-medium text-red-100">오늘의 알뜰</p>
                <p className="mt-1 text-lg font-bold leading-snug">
                  이번주 특가 <br /> 최대 20% 할인
                </p>
              </div>
              <span className="text-4xl">🏷️</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 바로가기 아이콘 */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CATEGORY_ICONS.map((c) => (
            <Link key={c.label} href={c.href} className="group flex flex-col items-center gap-2">
              <span className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl transition group-hover:scale-105 ${c.bg}`}>
                {c.emoji}
              </span>
              <span className="text-center text-xs font-medium text-gray-700">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 기획전 배너 */}
      <section className="mx-auto max-w-6xl px-4 pb-2">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {EXHIBITIONS.map((e) => (
            <Link
              key={e.title}
              href={e.href}
              className={`flex items-center justify-between rounded-xl bg-gradient-to-br ${e.from} ${e.to} p-4 text-white transition hover:brightness-105`}
            >
              <div>
                <p className="text-sm font-bold leading-tight">{e.title}</p>
                <p className="mt-0.5 text-[11px] text-white/90">{e.sub}</p>
              </div>
              <span className="text-3xl">{e.emoji}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 이번주 특가 */}
      {saleProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <SectionHeader title="🏷️ 이번주 특가" desc="놓치면 아쉬운 할인 상품" href="/products?sale=1" />
          <div className={gridClass}>
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 베스트 랭킹 */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <SectionHeader title="🔥 베스트 랭킹" desc="고객님들이 많이 찾는 인기 상품" href="/products" />
        <div className={gridClass}>
          {bestProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* 신상품 */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <SectionHeader title="✨ 신상품" desc="새로 들어온 상품을 만나보세요" href="/products" />
        <div className={gridClass}>
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
