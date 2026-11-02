import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "인정건설 | 충남 공장·산업시설 시공 (데모)",
  description: "충남 산업단지 공장·물류센터 시공, 인정건설 홈페이지 데모 시안",
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
