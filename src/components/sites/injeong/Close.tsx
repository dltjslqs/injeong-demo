import Link from "next/link";
import { company } from "./data";

// The close for a "hire" page: the contact details, then the one action.
export function Close() {
  return (
    <section className="close">
      <div className="container close-in">
        <div>
          <h2>공사 계획을 들려주세요</h2>
          <p className="lead">공사 위치와 대략적인 규모만 알려 주시면 범위와 일정부터 함께 정리합니다.</p>
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
