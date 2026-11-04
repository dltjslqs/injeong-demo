import Link from "next/link";
import { company } from "./data";
import { Logo, menu } from "./SiteHeader";

// footer: a statement, one closing sentence large, the links and the legal lines beneath
export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="container">
        <p className="ft-stmt">지으라는 대로만 짓지 않습니다.<br />설계 오류는 먼저 찾고, 예산을 아끼는 시공법은 먼저 제안합니다.</p>
        <div className="ft-grid">
          <div>
            <Logo dark />
            <p className="ft-info">
              {company.name}, 대표이사 {company.ceo}<br />
              사업자등록번호 {company.bizNo}<br />
              {company.licenses.map((l) => `${l.name} ${l.no}`).join(", ")}<br />
              {company.address}
            </p>
          </div>
          <nav aria-label="바닥글 메뉴">{menu.map((m) => <Link href={m.href} key={m.href}>{m.label}</Link>)}</nav>
          <p className="ft-info">
            전화 <a className="num" href={`tel:${company.tel}`}>{company.tel}</a><br />
            팩스 <span className="num">{company.fax}</span><br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </div>
        <div className="ft-bot">
          <span>© {company.name}</span>
          <span>홈페이지 시안입니다. 대표 인사말 문구는 회사 확인 전 초안입니다.</span>
        </div>
      </div>
    </footer>
  );
}
