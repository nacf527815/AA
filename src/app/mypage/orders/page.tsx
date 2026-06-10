import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">주문내역</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">주문내역이 없습니다.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
          >
            상품 보러가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const summary =
              order.items.length > 1
                ? `${order.items[0]?.productName} 외 ${order.items.length - 1}건`
                : order.items[0]?.productName;
            const paid = order.status === "결제완료";
            return (
              <Link
                key={order.id}
                href={`/order/complete/${order.id}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      paid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{summary}</p>
                  <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
