"use client";

import { useTransition } from "react";
import { updateCartItem, removeCartItem } from "@/actions/cart-actions";
import { formatPrice, categoryEmoji } from "@/lib/utils";

export default function CartItemRow({
  id,
  name,
  category,
  price,
  quantity,
  stock,
}: {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
}) {
  const [pending, startTransition] = useTransition();

  function changeQty(next: number) {
    if (next > stock) return;
    startTransition(() => updateCartItem(id, next));
  }

  function remove() {
    startTransition(() => removeCartItem(id));
  }

  return (
    <div
      className={`flex items-center gap-4 py-4 ${pending ? "opacity-50" : ""}`}
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-green-50 text-3xl">
        {categoryEmoji(category)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{formatPrice(price)}</p>
      </div>

      <div className="flex items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={() => changeQty(quantity - 1)}
          disabled={pending}
          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="수량 감소"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => changeQty(quantity + 1)}
          disabled={pending || quantity >= stock}
          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          aria-label="수량 증가"
        >
          +
        </button>
      </div>

      <p className="w-24 text-right font-bold text-gray-900">
        {formatPrice(price * quantity)}
      </p>

      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-sm text-gray-400 hover:text-red-600"
      >
        삭제
      </button>
    </div>
  );
}
