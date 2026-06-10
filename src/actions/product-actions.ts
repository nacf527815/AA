"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidCategory } from "@/lib/utils";

export type ProductFormState = { error?: string } | undefined;

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");
}

// 관리자: 상품 등록
export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const listPriceRaw = String(formData.get("listPrice") ?? "").trim();
  const listPrice = listPriceRaw ? Number(listPriceRaw) : null;

  if (!name) return { error: "상품명을 입력하세요." };
  if (!isValidCategory(category)) return { error: "카테고리를 선택하세요." };
  if (!Number.isFinite(price) || price < 0) return { error: "올바른 가격을 입력하세요." };
  if (!Number.isFinite(stock) || stock < 0) return { error: "올바른 재고 수량을 입력하세요." };
  if (listPrice !== null && (!Number.isFinite(listPrice) || listPrice < price)) {
    return { error: "정상가는 판매가보다 크거나 비워두세요." };
  }
  if (!description) return { error: "상품 설명을 입력하세요." };

  await prisma.product.create({
    data: {
      name,
      category,
      price: Math.floor(price),
      listPrice: listPrice !== null ? Math.floor(listPrice) : null,
      stock: Math.floor(stock),
      description,
      imageUrl,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/products");
  redirect("/admin");
}

// 관리자: 상품 삭제
export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/products");
}
