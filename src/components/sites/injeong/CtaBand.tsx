import Link from "next/link";
import { company } from "./data";

/** Closing call to action used at the bottom of pages. */
export function CtaBand() {
  return (
    <section className="ctab">
      <div className="container">
        <div className="ctab-in">
          <div>
            <h2 className="rv">건축 계획이 있으신가요? 도면 검토부터 함께 짚어드립니다.</h2>
            <p className="rv">대략적인 부지 위치나 도면만 보여주셔도 괜찮습니다. 인허가 체크부터 설계 오류, 현실적인 공사비 가이드까지 현장 실무진이 솔직하게 상담해 드립니다.</p>
          </div>
          <div className="btns rv">
            <Link className="btn cta" href="/contact">지금 바로 문의하기</Link>
            <a className="btn ghost num" href={`tel:${company.tel}`}>{company.tel}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
