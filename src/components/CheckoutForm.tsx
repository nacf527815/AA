"use client";

import { useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { createOrder } from "@/actions/order-actions";
import { formatPrice } from "@/lib/utils";

type Method = "CARD" | "VIRTUAL_ACCOUNT" | "TRANSFER" | "MOBILE_PHONE";

const METHODS: { value: Method; label: string; desc: string; icon: string }[] = [
  { value: "CARD", label: "카드 · 간편결제", desc: "신용/체크카드, 카카오페이, 네이버페이, 토스페이", icon: "💳" },
  { value: "VIRTUAL_ACCOUNT", label: "무통장입금", desc: "가상계좌로 현금 입금", icon: "🏧" },
  { value: "TRANSFER", label: "실시간 계좌이체", desc: "은행 계좌에서 바로 이체", icon: "🏦" },
  { value: "MOBILE_PHONE", label: "휴대폰 결제", desc: "휴대폰 소액결제", icon: "📱" },
];

export default function CheckoutForm({ amount }: { amount: number }) {
  const [method, setMethod] = useState<Method>("CARD");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    try {
      const result = await createOrder(formData);
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        setError("결제 설정(클라이언트 키)이 없습니다.");
        setLoading(false);
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      const base = {
        amount: { currency: "KRW" as const, value: result.amount },
        orderId: result.tossOrderId,
        orderName: result.orderName,
        customerName: result.customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      // 결제수단별로 토스 결제창 호출
      if (method === "CARD") {
        await payment.requestPayment({
          ...base,
          method: "CARD",
          card: {
            useEscrow: false,
            flowMode: "DEFAULT", // 카드 + 간편결제 통합창
            useCardPoint: false,
            useAppCardOnly: false,
          },
        });
      } else if (method === "VIRTUAL_ACCOUNT") {
        await payment.requestPayment({
          ...base,
          method: "VIRTUAL_ACCOUNT",
          virtualAccount: {
            cashReceipt: { type: "미발행" },
            validHours: 72, // 입금 기한 3일
          },
        });
      } else if (method === "TRANSFER") {
        await payment.requestPayment({ ...base, method: "TRANSFER" });
      } else {
        await payment.requestPayment({ ...base, method: "MOBILE_PHONE" });
      }
      // 성공 시 토스 결제창으로 이동하므로 이 아래는 실행되지 않는다.
    } catch (e) {
      const message = e instanceof Error ? e.message : "결제를 진행할 수 없습니다.";
      setError(message);
      setLoading(false);
    }
  }

  const inputClass =
    "rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600";

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {/* 배송 정보 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="receiverName" className="text-sm font-medium text-gray-700">
            받는 분
          </label>
          <input id="receiverName" name="receiverName" required placeholder="홍길동" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="receiverPhone" className="text-sm font-medium text-gray-700">
            연락처
          </label>
          <input id="receiverPhone" name="receiverPhone" required placeholder="010-1234-5678" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            배송지 주소
          </label>
          <input id="address" name="address" required placeholder="전북특별자치도 군산시 ..." className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="memo" className="text-sm font-medium text-gray-700">
            배송 메모 (선택)
          </label>
          <input id="memo" name="memo" placeholder="문 앞에 놓아주세요" className={inputClass} />
        </div>
      </div>

      {/* 결제수단 선택 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">결제수단</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((m) => {
            const active = method === m.value;
            return (
              <button
                type="button"
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="mt-1 text-sm font-semibold text-gray-900">{m.label}</span>
                <span className="mt-0.5 text-[11px] leading-tight text-gray-500">{m.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-green-700 py-3.5 text-lg font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
      >
        {loading ? "결제창 여는 중..." : `${formatPrice(amount)} 결제하기`}
      </button>

      <p className="text-center text-xs text-gray-400">
        토스페이먼츠 테스트 결제입니다. 실제 금액은 청구되지 않습니다.
      </p>
    </form>
  );
}
