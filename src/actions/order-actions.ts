"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CreateOrderResult =
  | {
      ok: true;
      orderId: string;
      tossOrderId: string;
      amount: number;
      orderName: string;
      customerName: string;
    }
  | { ok: false; error: string };

// 주문 생성: Order를 "결제대기" 상태로 만들고 결제에 필요한 정보를 반환한다.
// (재고 차감/장바구니 비우기는 결제 승인 후 confirmPayment에서 처리)
export async function createOrder(formData: FormData): Promise<CreateOrderResult> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const receiverName = String(formData.get("receiverName") ?? "").trim();
  const receiverPhone = String(formData.get("receiverPhone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim() || null;

  if (!receiverName || !receiverPhone || !address) {
    return { ok: false, error: "받는 분, 연락처, 주소를 모두 입력해주세요." };
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { ok: false, error: "장바구니가 비어 있습니다." };
  }

  // 재고 검증
  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      return {
        ok: false,
        error: `'${item.product.name}'의 재고가 부족합니다. (남은 수량 ${item.product.stock}개)`,
      };
    }
  }

  const amount = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const firstName = cartItems[0].product.name;
  const orderName =
    cartItems.length > 1 ? `${firstName} 외 ${cartItems.length - 1}건` : firstName;

  const tossOrderId = `order-${randomUUID()}`;

  const order = await prisma.order.create({
    data: {
      userId,
      status: "결제대기",
      totalAmount: amount,
      receiverName,
      receiverPhone,
      address,
      memo,
      tossOrderId,
      items: {
        create: cartItems.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      },
    },
  });

  return {
    ok: true,
    orderId: order.id,
    tossOrderId,
    amount,
    orderName,
    customerName: receiverName,
  };
}
