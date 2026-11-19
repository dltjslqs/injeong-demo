import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "관리자", template: "%s | 인정건설 관리자" },
  robots: { index: false, follow: false },
};

// admin pages read cookies and the store on every request
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="ad">{children}</div>;
}
