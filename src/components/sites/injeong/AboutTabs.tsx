"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/about", label: "회사 개요" },
  { href: "/about/story", label: "걸어온 길" },
  { href: "/about/videos", label: "현장 영상" },
];

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
