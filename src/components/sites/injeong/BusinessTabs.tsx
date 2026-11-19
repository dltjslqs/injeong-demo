"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { businessFields } from "./SiteHeader";

export const BUSINESS_TABS = [{ href: "/business", label: "전체" }, ...businessFields];

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
