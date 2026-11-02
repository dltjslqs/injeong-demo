"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Menu links that mark the page the visitor is on. */
export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname().replace(/\/$/, "");
  return (
    <>
      {items.map((m) => {
        const here = path === m.href;
        return (
          <Link href={m.href} key={m.href} className={here ? "on" : undefined} aria-current={here ? "page" : undefined}>
            {m.label}
          </Link>
        );
      })}
    </>
  );
}
