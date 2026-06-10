import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import CategoryTabs from "@/components/CategoryTabs";
import { isValidCategory } from "@/lib/utils";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sale?: string }>;
}) {
  const { category, q, sale } = await searchParams;
  const activeCategory = category && isValidCategory(category) ? category : undefined;
  const keyword = q?.trim();
  const onlySale = sale === "1";

  const products = await prisma.product.findMany({
    where: {
      ...(activeCategory ? { category: activeCategory } : {}),
      ...(keyword ? { name: { contains: keyword } } : {}),
      ...(onlySale ? { listPrice: { not: null } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const heading = keyword
    ? `'${keyword}' 검색결과`
    : onlySale
      ? "이번주 특가"
      : (activeCategory ?? "전체상품");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{heading}</h1>
      <p className="mb-6 text-sm text-gray-500">총 {products.length}개의 상품</p>

      {!keyword && (
        <div className="mb-8">
          <CategoryTabs active={activeCategory} />
        </div>
      )}

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          {keyword ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
