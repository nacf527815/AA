import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import CartItemRow from "@/components/CartItemRow";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">장바구니</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">장바구니가 비어 있습니다.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
          >
            상품 보러가기
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-5">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                id={item.id}
                name={item.product.name}
                category={item.product.category}
                price={item.product.price}
                quantity={item.quantity}
                stock={item.product.stock}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">총 결제금액</span>
              <span className="text-2xl font-bold text-green-700">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-5 block rounded-lg bg-green-700 py-3.5 text-center text-lg font-semibold text-white transition hover:bg-green-800"
            >
              주문하기
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
