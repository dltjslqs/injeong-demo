import Link from "next/link";
import { company } from "./data";

/** Closing call to action used at the bottom of pages. */
export function CtaBand() {
  return (
    <section className="ctab">
      <div className="container">
        <div className="ctab-in">
          <div>
            <h2 className="rv">도면 검토부터 예산 절감 공법까지, 먼저 짚어드립니다.</h2>
            <p className="rv">공사 위치와 대략적인 규모만 알려주시면, 도면의 오류 검토와 합리적인 공기·예산안을 현장 전문가가 함께 정리해 드립니다.</p>
          </div>
          <div className="btns rv">
            <Link className="btn cta" href="/contact">견적 문의하기</Link>
            <a className="btn ghost num" href={`tel:${company.tel}`}>{company.tel}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
