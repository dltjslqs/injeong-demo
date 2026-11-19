"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutPages } from "./SiteHeader";

const TABS = aboutPages;

/** The three parts of 회사소개, as tabs under its header; each tab is its own page and address. */
export function AboutTabs() {
  const path = usePathname().replace(/\/$/, "");
  return (
    <nav className="tabs-bar" aria-label="회사소개">
      <div className="container">
        {TABS.map((t) => {
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
