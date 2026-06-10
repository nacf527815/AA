import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/admin" className="hover:underline">
          상품 관리
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">상품 등록</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">상품 등록</h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <ProductForm />
      </div>
    </div>
  );
}
