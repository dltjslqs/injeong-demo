import Link from "next/link";
import { BASE } from "./base";
import { NavLinks } from "./NavLinks";

export const menu = [
  { href: "/about", label: "회사소개" },
  { href: "/business", label: "사업 분야" },
  { href: "/projects", label: "시공 실적" },
  { href: "/notes", label: "현장 노트" },
  { href: "/contact", label: "상담 문의" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className="logo" href="/" aria-label="인정건설 첫 화면">
      <img src={`${BASE}/sites/injeong/injeong_badge_${light ? "white" : "blue"}.svg`} alt="" width={421} height={152} />
      <span className="w"><b>인정건설(주)</b><small>INJEONG CONSTRUCTION</small></span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="hd" id="ij-hd">
      <div className="wrap bar">
        <Logo />
        <nav aria-label="주 메뉴">
          <NavLinks items={menu} />
        </nav>
        <div className="act">
          <a className="tel num" href="tel:041-633-9942">041-633-9942</a>
          <Link className="btn cta" href="/contact">견적 상담</Link>
        </div>
        <button className="mb" type="button" aria-label="메뉴 열기" aria-expanded="false"><i /><i /><i /></button>
      </div>
      <div className="mnav">
        <NavLinks items={menu} />
        <a href="tel:041-633-9942">전화 041-633-9942</a>
        <Link className="btn cta" href="/contact">견적 상담 신청</Link>
      </div>
    </header>
  );
}
