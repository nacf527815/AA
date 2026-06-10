import Link from "next/link";
import { formatPrice, discountRate, categoryEmoji } from "@/lib/utils";

export const FREE_SHIPPING_THRESHOLD = 30000;

export type ProductCardData = {
  id: string;
  name: string;
  category: string;
  price: number;
  listPrice?: number | null;
  imageUrl: string | null;
  stock: number;
};

export default function ProductCard({
  product,
  rank,
}: {
  product: ProductCardData;
  rank?: number;
}) {
  const soldOut = product.stock <= 0;
  const rate = discountRate(product.price, product.listPrice);
  const freeShipping = product.price >= FREE_SHIPPING_THRESHOLD;
  const lowStock = !soldOut && product.stock <= 5;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-green-600 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-6xl">
            {categoryEmoji(product.category)}
          </div>
        )}

        {/* 랭킹 번호 */}
        {rank !== undefined && (
          <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-gray-900/80 text-sm font-bold text-white">
            {rank}
          </span>
        )}

        {/* 할인 배지 (랭킹이 없을 때 좌상단) */}
        {rate > 0 && !soldOut && rank === undefined && (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            {rate}% 할인
          </span>
        )}

        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-white/60 text-sm font-bold text-gray-700">
            품절
          </span>
        )}
        {lowStock && (
          <span className="absolute bottom-2 left-2 rounded-md bg-orange-500 px-2 py-1 text-[11px] font-bold text-white">
            품절임박 {product.stock}개
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-green-700">{product.category}</span>
          {freeShipping && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
              무료배송
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto pt-2">
          {rate > 0 && product.listPrice && (
            <p className="text-xs text-gray-400 line-through">
              {formatPrice(product.listPrice)}
            </p>
          )}
          <div className="flex items-baseline gap-1.5">
            {rate > 0 && <span className="text-sm font-bold text-red-500">{rate}%</span>}
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
