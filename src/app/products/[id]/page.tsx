import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, discountRate } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const soldOut = product.stock <= 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:underline">
          전체상품
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:underline"
        >
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 이미지 */}
        <div className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-8xl">
              {product.category === "가공식품" ? "🍶" : "🥬"}
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-green-700">{product.category}</span>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>
          {(() => {
            const rate = discountRate(product.price, product.listPrice);
            return (
              <div className="mt-4">
                {rate > 0 && product.listPrice && (
                  <p className="text-base text-gray-400 line-through">
                    {formatPrice(product.listPrice)}
                  </p>
                )}
                <p className="flex items-baseline gap-2">
                  {rate > 0 && (
                    <span className="text-2xl font-bold text-red-500">{rate}%</span>
                  )}
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </p>
              </div>
            );
          })()}

          <p className="mt-2 text-sm text-gray-500">
            {soldOut ? "재고 없음" : `재고 ${product.stock}개`}
          </p>

          <div className="my-6 h-px bg-gray-200" />

          <p className="whitespace-pre-line leading-relaxed text-gray-700">
            {product.description}
          </p>

          {/* 배송·혜택 정보 */}
          <dl className="mt-6 space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-gray-400">배송</dt>
              <dd className="text-gray-700">
                택배배송 · 주문 후 평일 기준 2~3일 소요
                {product.price >= 30000 ? (
                  <span className="ml-1 font-semibold text-green-700">(무료배송)</span>
                ) : (
                  <span className="ml-1 text-gray-400">(3만원 이상 무료배송)</span>
                )}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-gray-400">신선도</dt>
              <dd className="text-gray-700">산지직송 · 군산원예농협 품질보증</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-gray-400">교환·반품</dt>
              <dd className="text-gray-700">수령 후 7일 이내 (신선식품 단순변심 제외)</dd>
            </div>
          </dl>

          <div className="mt-6">
            <AddToCartButton productId={product.id} soldOut={soldOut} />
          </div>
        </div>
      </div>
    </div>
  );
}
