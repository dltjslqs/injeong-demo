import Link from "next/link";
import { BASE } from "./base";
import { categories, projects } from "./data";

// Home picks one recent completed project from different client types.
const homePicks = ["p18", "p17", "p12"];

export function Works({ summary = false }: { summary?: boolean }) {
  const list = summary
    ? homePicks.map((id) => projects.find((p) => p.id === id)!)
    : projects.filter((p) => !p.ongoing);
  return (
    <section className="sec" id="works">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">{summary ? "최근 준공한 현장" : `주요 준공 실적 ${list.length}건`}</h2>
            {!summary && <p className="lede rv">공사 금액은 부가세를 포함한 계약 금액입니다. 민간 공사 일부는 계약 방식상 금액을 적지 않았습니다.</p>}
          </div>
          {summary ? (
            <Link className="link rv" href="/projects">시공 실적 전체 보기</Link>
          ) : (
            <div className="tabs rv" role="group" aria-label="실적 분류">
              {["전체", ...categories.map((c) => c.key)].map((f, i) => (
                <button type="button" className={i === 0 ? "on" : undefined} aria-pressed={i === 0} data-f={f} key={f}>
                  {f === "전체" ? "전체" : categories.find((c) => c.key === f)!.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pf">
          {list.map((w) => (
            <article className="rv" data-cat={w.cat} key={w.id}>
              <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/works/${w.img}.jpg)` }}>
              </div>
              <div className="bd">
                <h3>{w.name}</h3>
                <dl>
                  <dt>분류</dt><dd>{categories.find((c) => c.key === w.cat)!.label}</dd>
                  <dt>발주처</dt><dd>{w.client}</dd>
                  <dt>용도</dt><dd>{w.use}</dd>
                  {w.area && <><dt>연면적</dt><dd className="num">{w.area}</dd></>}
                  {w.cost && <><dt>공사비</dt><dd className="num">{w.cost}</dd></>}
                  <dt>준공</dt><dd className="num">{w.done}</dd>
                  {w.imgNote && <><dt>사진</dt><dd>{w.imgNote}</dd></>}
                </dl>
              </div>
            </article>
          ))}
        </div>
        {!summary && <div className="more"><Link className="btn line" href="/contact">실적 자료(지명원) 요청</Link></div>}
      </div>
    </section>
  );
}
