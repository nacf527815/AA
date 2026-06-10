import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

// 상품 목록 상단의 카테고리 탭 (전체 / 농산물 / 가공식품)
export default function CategoryTabs({ active }: { active?: string }) {
  const tabs = [{ label: "전체", value: undefined }, ...CATEGORIES.map((c) => ({ label: c, value: c }))];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab.value || (!active && tab.value === undefined);
        const href = tab.value ? `/products?category=${encodeURIComponent(tab.value)}` : "/products";
        return (
          <Link
            key={tab.label}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-green-700 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
