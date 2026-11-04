import Link from "next/link";
import { BASE } from "./base";
import { company } from "./data";
import { NavLinks } from "./NavLinks";

export const menu = [
  { href: "/about", label: "회사소개" },
  { href: "/business", label: "사업 분야" },
  { href: "/projects", label: "시공 실적" },
  { href: "/notes", label: "기술 칼럼" },
  { href: "/contact", label: "견적 문의" },
];

// the company's own horizontal lockup (mark and name), transparent; the dark-background cut sits on the navy footer
// swap: carry both cuts so the header can show the light one over the home video
export function Logo({ dark = false, swap = false }: { dark?: boolean; swap?: boolean }) {
  return (
    <Link className="logo" href="/" aria-label={`${company.name} 첫 화면`}>
      <img className="lg-l" src={`${BASE}/sites/injeong/${dark ? "logo-h-dark" : "logo-h"}.png`} alt={company.name} width={746} height={160} />
      {swap && <img className="lg-d" src={`${BASE}/sites/injeong/logo-h-dark.png`} alt="" width={746} height={160} />}
    </Link>
  );
}

// nav: one bar, menu first (the notice banner above it was removed)
export function SiteHeader() {
  return (
    <header className="hd" id="ij-hd">
      <div className="container bar">
        <Logo swap />
        <nav aria-label="주 메뉴">
          <NavLinks items={menu} />
        </nav>
        <a className="tel num" href={`tel:${company.tel}`}>{company.tel}</a>
        <button className="mb" type="button" aria-label="메뉴 열기" aria-expanded="false"><i /><i /><i /></button>
      </div>
      <div className="mnav">
        <NavLinks items={menu} />
        <a href={`tel:${company.tel}`}>전화 {company.tel}</a>
      </div>
    </header>
  );
}
