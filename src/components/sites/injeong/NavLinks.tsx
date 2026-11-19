"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type MenuItem = { href: string; label: string; children?: { href: string; label: string }[] };

/**
 * Menu links that mark the page the visitor is on.
 * An item with children (사업 분야) opens a small list on hover or keyboard focus on a desktop,
 * and shows the children indented under it in the phone menu (sub).
 */
export function NavLinks({ items, sub = false }: { items: MenuItem[]; sub?: boolean }) {
  const path = usePathname().replace(/\/$/, "");
  const mark = (href: string, exact = false) => path === href || (!exact && path.startsWith(`${href}/`));
  return (
    <>
      {items.map((m) => {
        // a menu stays marked on its tabs too (회사소개 → /about/story)
        const here = mark(m.href);
        const link = (
          <Link href={m.href} key={m.href} className={here ? "on" : undefined} aria-current={path === m.href ? "page" : undefined}>
            {m.label}
          </Link>
        );
        if (!m.children) return link;
        const kids = m.children.map((c) => (
          <Link href={c.href} key={c.href} className={mark(c.href, true) ? "on" : undefined} aria-current={mark(c.href, true) ? "page" : undefined}>
            {c.label}
          </Link>
        ));
        if (sub) {
          return (
            <div className="mnav-g" key={m.href}>
              {link}
              <div className="mnav-sub">{kids}</div>
            </div>
          );
        }
        return (
          <div className="nv-dd" key={m.href}>
            {link}
            <div className="nv-sub" role="group" aria-label={`${m.label} 하위 메뉴`}>{kids}</div>
          </div>
        );
      })}
    </>
  );
}
