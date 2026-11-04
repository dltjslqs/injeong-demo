import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "㈜인정건설 | 충남 홍성 종합건설", template: "%s | ㈜인정건설" },
  description: "1989년부터 충남의 학교·공공시설·군 시설·공장을 시공해 온 홍성 종합건설사",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body>{children}</body>
    </html>
  );
}
