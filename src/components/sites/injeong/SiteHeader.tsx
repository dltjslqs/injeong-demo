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

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="인정건설 첫 화면">
      <img src={`${BASE}/sites/injeong/symbol.png`} alt="" width={500} height={341} />
      <span className="w"><b>{company.name}</b></span>
    </Link>
  );
}

// nav: a banner over a bar; the banner retracts once the page scrolls (Behaviors adds .rt)
export function SiteHeader() {
  return (
    <header className="hd" id="ij-hd">
      <div className="bnr">
        <div className="container">
          <Link href="/projects">지금 천안업성2초등학교 교사 신축공사를 시공하고 있습니다. 2027년 11월 준공 예정</Link>
        </div>
      </div>
      <div className="container bar">
        <Logo />
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
