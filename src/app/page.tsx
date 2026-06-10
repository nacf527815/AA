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
      {/* 메인 롤링 배너 */}
      <PromoBanner />

      {/* 카테고리 바로가기 아이콘 */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CATEGORY_ICONS.map((c) => (
            <Link key={c.label} href={c.href} className="flex flex-col items-center gap-2 group">
              <span className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl transition group-hover:scale-105 ${c.bg}`}>
                {c.emoji}
              </span>
              <span className="text-center text-xs font-medium text-gray-700">{c.label}</span>
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

      {/* 중간 프로모 배너 */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/products?category=농산물" className="flex items-center justify-between rounded-2xl bg-green-700 p-6 text-white transition hover:bg-green-800">
            <div>
              <p className="text-sm text-green-100">신선 농산물</p>
              <p className="mt-1 text-lg font-bold">산지직송 제철 농산물</p>
            </div>
            <span className="text-5xl">🚚</span>
          </Link>
          <Link href="/products?category=가공식품" className="flex items-center justify-between rounded-2xl bg-amber-600 p-6 text-white transition hover:bg-amber-700">
            <div>
              <p className="text-sm text-amber-100">우리 가공식품</p>
              <p className="mt-1 text-lg font-bold">정성 담은 농협 가공식품</p>
            </div>
            <span className="text-5xl">🍯</span>
          </Link>
        </div>
      </section>

      {/* 베스트 상품 */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <SectionHeader title="🔥 베스트 상품" desc="고객님들이 많이 찾는 인기 상품" href="/products" />
        <div className={gridClass}>
          {bestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
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
