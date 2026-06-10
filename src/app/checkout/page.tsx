import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-gray-500">장바구니가 비어 있어 주문할 수 없습니다.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
        >
          상품 보러가기
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">주문/결제</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_360px]">
        {/* 배송 정보 입력 + 결제 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">배송 정보 · 결제수단</h2>
          <CheckoutForm amount={total} />
        </div>

        {/* 주문 요약 */}
        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">주문 상품</h2>
          <ul className="divide-y divide-gray-100">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2 py-3 text-sm">
                <span className="text-gray-700">
                  {i.product.name}
                  <span className="text-gray-400"> × {i.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-gray-900">
                  {formatPrice(i.product.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="font-medium text-gray-700">총 결제금액</span>
            <span className="text-xl font-bold text-green-700">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
