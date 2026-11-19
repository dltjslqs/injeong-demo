import Link from "next/link";
import { BASE } from "./base";
import { company } from "./data";
import { type MenuItem, NavLinks } from "./NavLinks";

// 사업 분야 fields, most important first: 산업시설 and 민간·실내건축 come from sales, 공공·교육 from bidding
export const businessFields = [
  { href: "/business/factory", label: "산업시설" },
  { href: "/business/private", label: "민간·실내건축" },
  { href: "/business/public", label: "공공·군 시설" },
  { href: "/business/education", label: "교육시설" },
];

// 회사소개 parts, the same as the tabs under its header
export const aboutPages = [
  { href: "/about", label: "회사 개요" },
  { href: "/about/story", label: "걸어온 길" },
  { href: "/about/stories", label: "회사 이야기" },
];

export const menu: MenuItem[] = [
  { href: "/about", label: "회사소개", children: aboutPages },
  { href: "/business", label: "사업 분야", children: businessFields },
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
        <NavLinks items={menu} sub />
        <a href={`tel:${company.tel}`}>전화 {company.tel}</a>
      </div>
    </header>
  );
}
