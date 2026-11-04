import Link from "next/link";
import { company } from "./data";

/** Closing call to action used at the bottom of pages. */
export function CtaBand() {
  return (
    <section className="ctab">
      <div className="container">
        <div>
          <h2 className="rv">건축 계획이 있으신가요?</h2>
          <p className="rv">공사 위치와 대략적인 규모만 알려 주시면 공사 범위와 일정부터 함께 정리해 드립니다.</p>
        </div>
        <div className="btns rv">
          <Link className="btn cta" href="/contact">견적 문의하기</Link>
          <a className="btn ghost num" href={`tel:${company.tel}`}>{company.tel}</a>
        </div>
      </div>
    </section>
  );
}
