import { prisma } from "@/lib/prisma";

export type ConfirmResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

// 토스 결제 승인 응답에서 우리가 쓰는 필드
type TossPaymentResponse = {
  method?: string; // "카드" | "가상계좌" | "계좌이체" | "휴대폰" | "간편결제" 등
  status?: string; // "DONE" | "WAITING_FOR_DEPOSIT" 등
  message?: string;
  virtualAccount?: {
    accountNumber?: string;
    bankCode?: string;
    bank?: string;
    dueDate?: string;
    customerName?: string;
  } | null;
};

// 가상계좌(무통장입금) 안내 문구 만들기
function buildVbankInfo(va: TossPaymentResponse["virtualAccount"]): string | null {
  if (!va?.accountNumber) return null;
  const bank = va.bank ?? va.bankCode ?? "은행";
  const due = va.dueDate
    ? ` (입금기한 ${new Date(va.dueDate).toLocaleString("ko-KR")})`
    : "";
  return `${bank} ${va.accountNumber}${due}`;
}

// 토스페이먼츠 결제 승인 + 주문 확정.
// 반드시 서버에서 실행하며, 저장된 주문 금액과 실제 결제 금액을 대조해 위변조를 막는다.
export async function confirmPayment(params: {
  paymentKey: string;
  tossOrderId: string;
  amount: number;
}): Promise<ConfirmResult> {
  const { paymentKey, tossOrderId, amount } = params;

  const order = await prisma.order.findUnique({
    where: { tossOrderId },
    include: { items: true },
  });
  if (!order) return { ok: false, error: "주문을 찾을 수 없습니다." };

  // 이미 처리된 주문이면 그대로 성공 처리 (새로고침 등 중복 호출 방지)
  if (order.status !== "결제대기") return { ok: true, orderId: order.id };

  if (order.totalAmount !== amount) {
    return { ok: false, error: "결제 금액이 주문 금액과 일치하지 않습니다." };
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) return { ok: false, error: "결제 설정(시크릿 키)이 없습니다." };

  // 토스에 결제 승인 요청
  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${secretKey}:`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId: tossOrderId, amount }),
  });

  const data = (await res.json()) as TossPaymentResponse;
  if (!res.ok) {
    return { ok: false, error: data.message ?? "결제 승인에 실패했습니다." };
  }

  // 가상계좌는 입금 전까지 "입금대기", 나머지는 "결제완료"
  const isWaiting = data.status === "WAITING_FOR_DEPOSIT";
  const newStatus = isWaiting ? "입금대기" : "결제완료";
  const vbankInfo = isWaiting ? buildVbankInfo(data.virtualAccount) : null;

  // 주문 확정: 재고 차감 + 상태 변경 + 장바구니 비우기 (원자적으로)
  await prisma.$transaction(async (tx) => {
    const fresh = await tx.order.findUnique({ where: { id: order.id } });
    if (!fresh || fresh.status !== "결제대기") return;

    for (const it of order.items) {
      await tx.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        paymentKey,
        paymentMethod: data.method ?? null,
        vbankInfo,
        paidAt: isWaiting ? null : new Date(),
      },
    });
    await tx.cartItem.deleteMany({ where: { userId: order.userId } });
  });

  return { ok: true, orderId: order.id };
}
