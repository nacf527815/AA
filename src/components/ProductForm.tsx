"use client";

import { useActionState } from "react";
import { createProduct, type ProductFormState } from "@/actions/product-actions";
import { CATEGORIES } from "@/lib/utils";

export default function ProductForm() {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    createProduct,
    undefined,
  );

  const inputClass =
    "rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          상품명
        </label>
        <input id="name" name="name" required className={inputClass} placeholder="예: 군산 햇감자 5kg" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select id="category" name="category" required className={inputClass} defaultValue="">
          <option value="" disabled>
            선택하세요
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            판매가 (원)
          </label>
          <input id="price" name="price" type="number" min={0} required className={inputClass} placeholder="8900" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="listPrice" className="text-sm font-medium text-gray-700">
            정상가 (선택)
          </label>
          <input id="listPrice" name="listPrice" type="number" min={0} className={inputClass} placeholder="할인 전 가격" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="stock" className="text-sm font-medium text-gray-700">
          재고 수량
        </label>
        <input id="stock" name="stock" type="number" min={0} required className={inputClass} placeholder="50" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
          이미지 URL (선택)
        </label>
        <input id="imageUrl" name="imageUrl" className={inputClass} placeholder="https://... (비워두면 기본 이미지)" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          상품 설명
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className={inputClass}
          placeholder="상품에 대한 설명을 입력하세요."
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
      >
        {pending ? "등록 중..." : "상품 등록"}
      </button>
    </form>
  );
}
