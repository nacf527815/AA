import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "군산원예농협 쇼핑몰",
  description: "군산원예농협의 신선한 농산물과 가공식품을 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 sm:grid-cols-3">
              {/* 고객센터 */}
              <div>
                <p className="text-sm font-semibold text-gray-700">고객센터</p>
                <p className="mt-2 text-2xl font-extrabold text-green-700">063-000-0000</p>
                <p className="mt-1 text-xs text-gray-500">평일 09:00 ~ 18:00 (주말·공휴일 휴무)</p>
                <p className="mt-1 text-xs text-gray-500">점심시간 12:00 ~ 13:00</p>
              </div>

              {/* 쇼핑몰 안내 */}
              <div>
                <p className="text-sm font-semibold text-gray-700">쇼핑몰 안내</p>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-500">
                  <li><a href="/products" className="hover:text-green-700">전체상품</a></li>
                  <li><a href="/products?sale=1" className="hover:text-green-700">이번주 특가</a></li>
                  <li><a href="/mypage/orders" className="hover:text-green-700">주문배송조회</a></li>
                  <li><a href="/cart" className="hover:text-green-700">장바구니</a></li>
                </ul>
              </div>

              {/* 이용 안내 */}
              <div>
                <p className="text-sm font-semibold text-gray-700">이용 안내</p>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-500">
                  <li>배송: 주문 후 평일 기준 2~3일 소요</li>
                  <li>교환·반품: 수령 후 7일 이내</li>
                  <li>결제: 카드·간편결제·무통장입금·계좌이체·휴대폰</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-400">
              <p className="font-semibold text-gray-500">군산원예농협 하나로 직거래장터</p>
              <p className="mt-1">
                전북특별자치도 군산시 · 대표 OOO · 사업자등록번호 000-00-00000 · 통신판매업신고 제0000호
              </p>
              <p className="mt-2">
                © {new Date().getFullYear()} Gunsan Horticulture Agricultural Cooperative. 데모 쇼핑몰입니다.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
