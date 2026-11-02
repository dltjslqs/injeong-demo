import Link from "next/link";

/** Closing call to action used at the bottom of pages. */
export function CtaBand() {
  return (
    <section className="ctab">
      <div className="wrap">
        <div>
          <h2 className="rv">공장 계획이 있으신가요?</h2>
          <p className="rv">부지 위치와 대략적인 규모만 알려 주시면 공사 범위와 일정부터 정리해 드립니다.</p>
        </div>
        <div className="btns rv">
          <Link className="btn cta" href="/contact">견적 상담 신청</Link>
          <a className="btn ghost num" href="tel:041-633-9942">041-633-9942</a>
        </div>
      </div>
    </section>
  );
}
