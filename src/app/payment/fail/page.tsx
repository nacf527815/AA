import Link from "next/link";

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; code?: string }>;
}) {
  const { message, code } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl">
        ❌
      </div>
      <h1 className="text-xl font-bold text-gray-900">결제가 취소되었습니다</h1>
      <p className="mt-2 text-gray-600">
        {message ?? "결제가 완료되지 않았습니다. 다시 시도해주세요."}
      </p>
      {code && <p className="mt-1 text-xs text-gray-400">오류코드: {code}</p>}
      <div className="mt-6 flex gap-3">
        <Link
          href="/cart"
          className="rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
        >
          장바구니로 돌아가기
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
