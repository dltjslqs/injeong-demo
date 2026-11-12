import type { Metadata } from "next";
import "./globals.css";
import { LIVE, ORIGIN, SITE_NAME } from "@/lib/injeong/site";

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: { default: "㈜인정건설 | 충남 홍성 종합건설", template: "%s | ㈜인정건설" },
  description: "1989년부터 충남의 학교·공공시설·군 시설·공장을 시공해 온 홍성 종합건설사",
  applicationName: SITE_NAME,
  // hidden from search engines until the real domain is set (lib/injeong/site.ts)
  robots: LIVE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: SITE_NAME, locale: "ko_KR", type: "website", images: [{ url: "/sites/injeong/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
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
