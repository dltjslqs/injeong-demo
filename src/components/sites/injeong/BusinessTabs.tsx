"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const BUSINESS_TABS = [
  { href: "/business", label: "전체" },
  { href: "/business/education", label: "교육시설" },
  { href: "/business/public", label: "공공·군 시설" },
  { href: "/business/factory", label: "산업시설" },
  { href: "/business/private", label: "민간·실내건축" },
];

/** 사업 분야 and its four fields, as tabs under the header; each tab is its own page and address. */
export function BusinessTabs() {
  const path = usePathname().replace(/\/$/, "");
  return (
    <nav className="tabs-bar" aria-label="사업 분야">
      <div className="container">
        {BUSINESS_TABS.map((t) => {
          const on = path === t.href;
          return (
            <Link key={t.href} href={t.href} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
