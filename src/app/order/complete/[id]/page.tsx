import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function OrderCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-4 grid h-16 w-16 place-items-center rounded-full text-3xl ${
            order.status === "입금대기" ? "bg-yellow-100" : "bg-green-100"
          }`}
        >
          {order.status === "입금대기" ? "🏧" : "✅"}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {order.status === "결제완료"
            ? "결제가 완료되었습니다"
            : order.status === "입금대기"
              ? "입금을 기다리고 있습니다"
              : "주문이 접수되었습니다"}
        </h1>
        <p className="mt-2 text-gray-500">주문해주셔서 감사합니다.</p>
      </div>

      {/* 무통장입금(가상계좌) 안내 */}
      {order.vbankInfo && (
        <div className="mt-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
          <p className="font-semibold text-yellow-900">무통장입금 안내</p>
          <p className="mt-1 text-sm text-yellow-800">아래 가상계좌로 입금해주시면 주문이 확정됩니다.</p>
          <p className="mt-2 font-mono text-lg font-bold text-gray-900">{order.vbankInfo}</p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-sm text-gray-500">주문번호</span>
          <span className="font-mono text-sm text-gray-700">{order.tossOrderId}</span>
        </div>

        {order.paymentMethod && (
          <div className="flex items-center justify-between border-b border-gray-100 py-3 text-sm">
            <span className="text-gray-500">결제수단</span>
            <span className="font-medium text-gray-700">{order.paymentMethod}</span>
          </div>
        )}

        <ul className="divide-y divide-gray-100">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between gap-2 py-3 text-sm">
              <span className="text-gray-700">
                {it.productName}
                <span className="text-gray-400"> × {it.quantity}</span>
              </span>
              <span className="shrink-0 font-medium text-gray-900">
                {formatPrice(it.price * it.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="font-medium text-gray-700">결제금액</span>
          <span className="text-xl font-bold text-green-700">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-sm">
        <h2 className="mb-3 font-semibold text-gray-900">배송 정보</h2>
        <dl className="space-y-1.5 text-gray-600">
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-gray-400">받는 분</dt>
            <dd>{order.receiverName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-gray-400">연락처</dt>
            <dd>{order.receiverPhone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-gray-400">주소</dt>
            <dd>{order.address}</dd>
          </div>
          {order.memo && (
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 text-gray-400">메모</dt>
              <dd>{order.memo}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/mypage/orders"
          className="rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
        >
          주문내역 보기
        </Link>
        <Link
          href="/products"
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
