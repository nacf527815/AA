import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/payments";

// 토스 결제 성공 후, 브라우저가 호출하는 서버 승인 엔드포인트
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentKey = String(body.paymentKey ?? "");
    const tossOrderId = String(body.orderId ?? "");
    const amount = Number(body.amount ?? 0);

    if (!paymentKey || !tossOrderId || !amount) {
      return NextResponse.json(
        { ok: false, error: "결제 정보가 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const result = await confirmPayment({ paymentKey, tossOrderId, amount });
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "결제 승인 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
