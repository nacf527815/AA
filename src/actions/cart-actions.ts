"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

// 장바구니 담기 (이미 있으면 수량 증가)
export async function addToCart(productId: string, quantity = 1) {
  const userId = await requireUserId();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "상품을 찾을 수 없습니다" };

  const qty = Math.max(1, Math.floor(quantity));

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity: qty },
    update: { quantity: { increment: qty } },
  });

  revalidatePath("/cart");
  revalidatePath("/");
  return { ok: true };
}

// 장바구니 수량 변경 (1 미만이면 삭제)
export async function updateCartItem(cartItemId: string, quantity: number) {
  const userId = await requireUserId();
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.userId !== userId) return;

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: Math.floor(quantity) },
    });
  }
  revalidatePath("/cart");
}

// 장바구니 항목 삭제
export async function removeCartItem(cartItemId: string) {
  const userId = await requireUserId();
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.userId !== userId) return;

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath("/cart");
}
