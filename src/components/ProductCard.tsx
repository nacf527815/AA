import Link from "next/link";
import { formatPrice, discountRate } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  name: string;
  category: string;
  price: number;
  listPrice?: number | null;
  imageUrl: string | null;
  stock: number;
};

function categoryEmoji(category: string): string {
  return category === "가공식품" ? "🍶" : "🥬";
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stock <= 0;
  const rate = discountRate(product.price, product.listPrice);

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
        {rate > 0 && !soldOut && (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            {rate}% 할인
          </span>
        )}
        {soldOut && (
          <span className="absolute left-2 top-2 rounded-md bg-gray-800/80 px-2 py-1 text-xs font-semibold text-white">
            품절
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium text-green-700">{product.category}</span>
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
