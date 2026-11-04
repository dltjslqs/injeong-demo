import { company } from "./data";

export function Figures() {
  return (
    <section className="band" aria-label="숫자로 보는 인정건설">
      <div className="container">
        <h2 className="rv">숫자로 보는<br />인정건설</h2>
        <div className="st rv"><b className="num">{company.since}<small>년</small></b><span>건설업 시작 (법인 2003년)</span></div>
        <div className="st rv"><b className="num">89.5<small>억</small></b><span>{company.capacity.year} 시공능력평가액</span></div>
        <div className="st rv"><b className="num">104<small>위</small></b><span>충남 건축공사업 {company.capacity.regionTotal}개사 중</span></div>
        <div className="st rv"><b className="num"><span className="cnt" data-to={company.engineers}>{company.engineers}</span><small>명</small></b><span>보유 기술인력</span></div>
      </div>
    </section>
  );
}
