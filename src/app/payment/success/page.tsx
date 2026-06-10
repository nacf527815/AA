"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function Spinner({ label }: { label: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

function PaymentSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // 중복 실행 방지
    ran.current = true;

    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setError("결제 정보가 올바르지 않습니다.");
      return;
    }

    fetch("/api/payment/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          router.replace(`/order/complete/${data.orderId}`);
        } else {
          setError(data.error ?? "결제 승인에 실패했습니다.");
        }
      })
      .catch(() => setError("결제 승인 처리 중 오류가 발생했습니다."));
  }, [params, router]);

  if (!error) return <Spinner label="결제를 확인하고 있습니다..." />;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl">
        ⚠️
      </div>
      <h1 className="text-xl font-bold text-gray-900">결제 처리 실패</h1>
      <p className="mt-2 text-gray-600">{error}</p>
      <Link
        href="/cart"
        className="mt-6 rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
      >
        장바구니로 돌아가기
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Spinner label="결제를 확인하고 있습니다..." />}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
