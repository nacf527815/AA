"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SLIDES = [
  {
    badge: "이번주 특가",
    title: "제철 농산물 최대 20% 할인",
    sub: "군산 들녘에서 갓 수확한 신선함을 그대로",
    cta: "특가상품 보기",
    href: "/products?sale=1",
    from: "from-green-700",
    to: "to-green-500",
    emoji: "🥬",
  },
  {
    badge: "신선보장",
    title: "산지직송 친환경 쌀 10kg",
    sub: "군산 평야의 당해년도 햅쌀을 합리적인 가격에",
    cta: "쌀 보러가기",
    href: "/products?category=농산물",
    from: "from-amber-600",
    to: "to-amber-400",
    emoji: "🌾",
  },
  {
    badge: "농협 가공식품",
    title: "정성 담은 우리 가공식품",
    sub: "매실청, 들기름, 김치까지 믿고 드세요",
    cta: "가공식품 보기",
    href: "/products?category=가공식품",
    from: "from-emerald-700",
    to: "to-teal-500",
    emoji: "🍶",
  },
];

export default function PromoBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[idx];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${slide.from} ${slide.to} text-white transition-all`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-12 sm:py-16">
        <div className="max-w-lg">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {slide.badge}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base">{slide.sub}</p>
          <Link
            href={slide.href}
            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100"
          >
            {slide.cta} →
          </Link>
        </div>
        <span className="hidden text-8xl sm:block lg:text-9xl" aria-hidden>
          {slide.emoji}
        </span>
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`배너 ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
