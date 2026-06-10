"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { addToCart } from "@/actions/cart-actions";

export default function AddToCartButton({
  productId,
  soldOut,
}: {
  productId: string;
  soldOut: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (soldOut) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 font-semibold text-white"
      >
        품절
      </button>
    );
  }

  function handleAdd() {
    startTransition(async () => {
      await addToCart(productId, qty);
      setDone(true);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">수량</span>
        <div className="flex items-center rounded-lg border border-gray-300">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100"
            aria-label="수량 감소"
          >
            −
          </button>
          <span className="w-10 text-center font-medium">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100"
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={pending}
        className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
      >
        {pending ? "담는 중..." : "장바구니 담기"}
      </button>

      {done && (
        <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>장바구니에 담았습니다.</span>
          <Link href="/cart" className="font-semibold underline">
            장바구니 보기
          </Link>
        </div>
      )}
    </div>
  );
}
