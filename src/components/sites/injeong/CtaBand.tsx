import Link from "next/link";
import { company } from "./data";

/** Closing call to action used at the bottom of pages. */
export function CtaBand() {
  return (
    <section className="ctab">
      <div className="container">
        <div className="ctab-in">
          <div>
            <h2 className="rv">건축 계획이 있으신가요?<br />도면 검토부터 함께 짚어드립니다.</h2>
            <p className="rv">부지 위치나 도면만 보여주셔도 됩니다.<br />인허가부터 공사비까지 현장 실무진이 직접 상담해 드립니다.</p>
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
