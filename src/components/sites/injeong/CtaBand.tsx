import Link from "next/link";
import { company } from "./data";

const SUB = "부지 위치나 도면만 보여주셔도 됩니다.\n인허가부터 공사비까지 현장 실무진이 직접 상담해 드립니다.";

/** Closing call to action used at the bottom of pages. A field page passes the line its readers need; "\n" breaks the line. */
export function CtaBand({ sub = SUB, href = "/contact" }: { sub?: string; href?: string }) {
  const lines = sub.split("\n");
  return (
    <section className="ctab">
      <div className="container">
        <div className="ctab-in">
          <div>
            <p className="ctab-t rv">건축 계획이 있으신가요?{" "}<br />도면 검토부터 함께 짚어드립니다.</p>
            <p className="rv">{lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</p>
          </div>
          <div className="btns rv">
            <Link className="btn cta" href={href}>지금 바로 문의하기</Link>
            <a className="btn ghost num" href={`tel:${company.tel}`}>{company.tel}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
