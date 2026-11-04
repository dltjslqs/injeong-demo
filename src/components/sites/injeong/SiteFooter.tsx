import Link from "next/link";
import { company } from "./data";
import { Logo, menu } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="top">
          <div>
            <Logo />
            <p className="info">
              {company.name} · 대표이사 {company.ceo}<br />
              사업자등록번호 {company.bizNo}<br />
              {company.licenses.map((l) => `${l.name} ${l.no}`).join(" · ")}<br />
              {company.address}
            </p>
          </div>
          <div>
            <h4>바로 가기</h4>
            <nav aria-label="바닥글 메뉴">{menu.map((m) => <Link href={m.href} key={m.href}>{m.label}</Link>)}</nav>
          </div>
          <div>
            <h4>연락처</h4>
            <p className="info" style={{ marginTop: 0 }}>
              TEL <span className="num">{company.tel}</span><br />
              FAX <span className="num">{company.fax}</span><br />
              {company.email}
            </p>
          </div>
        </div>
        <div className="bot">
          <span>© {company.name}</span>
          <span className="demo">홈페이지 시안입니다. 대표 인사말 문구는 회사 확인 전 초안입니다.</span>
        </div>
      </div>
    </footer>
  );
}
