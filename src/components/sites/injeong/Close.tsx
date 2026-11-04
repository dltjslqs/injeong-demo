import Link from "next/link";
import { company } from "./data";

// The close for a "hire" page: the contact details, then the one action.
export function Close() {
  return (
    <section className="close">
      <div className="container close-in">
        <div>
          <h2>착공 전 단계부터 건축주의 불필요한 예산 낭비를 덜어드립니다</h2>
          <p className="lead">도면이 없거나 대략적인 부지 계획만 있어도 괜찮습니다. 현장 조건에 맞춘 인허가 검토와 가장 현실적인 견적 가이드를 함께 풀어드립니다.</p>
          <Link className="btn btn-seal" href="/contact">견적 문의</Link>
        </div>
        <dl className="close-dl">
          <div><dt>대표전화</dt><dd><a className="num big" href={`tel:${company.tel}`}>{company.tel}</a></dd></div>
          <div><dt>팩스</dt><dd className="num">{company.fax}</dd></div>
          <div><dt>이메일</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
          <div><dt>본사</dt><dd>{company.address}</dd></div>
        </dl>
      </div>
    </section>
  );
}
