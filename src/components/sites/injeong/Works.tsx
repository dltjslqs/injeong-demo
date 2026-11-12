import Link from "next/link";
import { getProjects } from "@/lib/injeong/content";
import { categories, projectAlt, projectImg } from "./data";

// Home picks one recent completed project from different client types.
const homePicks = ["p18", "p17", "p12"];

export async function Works({ summary = false }: { summary?: boolean }) {
  const projects = await getProjects();
  const done = projects.filter((p) => !p.ongoing);
  // photo cards for the projects that have a picture; every completed project is in the full list below them
  const list = summary
    ? homePicks.map((id) => projects.find((p) => p.id === id)).filter((p) => p !== undefined)
    : done.filter((p) => projectImg(p));
  const dongsin = done.filter((p) => p.client === "㈜동신포리마");
  const since = done.reduce((y, p) => Math.min(y, Number(p.done.slice(0, 4)) || y), 9999);
  return (
    <section className="sec" id="works">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">{summary ? "최근 준공한 현장" : `준공 실적 ${done.length}건`}</h2>
            {!summary && <p className="lede rv">{since}년부터 금산 역사문화박물관과 한국국토정보공사 아산지사 사옥, 고덕국민체육센터,<br className="br-pc" /> 홍성여고 다목적강당, {dongsin.length}번 맡겨 주신 ㈜동신포리마 공장까지 직접 지었습니다.</p>}
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
              <div className="im">
                {projectImg(w) && <img src={projectImg(w)} alt={projectAlt(w)} width={1800} height={1344} loading="lazy" decoding="async" />}
              </div>
              <div className="bd">
                <h3>{w.name}</h3>
                {/* every card carries the same six rows, so the cards line up */}
                <dl>
                  <dt>분류</dt><dd>{categories.find((c) => c.key === w.cat)!.label}</dd>
                  <dt>발주처</dt><dd title={w.client}>{w.client}</dd>
                  <dt>용도</dt><dd title={w.use}>{w.use || "—"}</dd>
                  <dt>연면적</dt><dd className="num">{w.area ?? "—"}</dd>
                  <dt>공사비</dt><dd className="num">{w.cost ?? "—"}</dd>
                  <dt>준공</dt><dd className="num">{w.done}</dd>
                </dl>
              </div>
            </article>
          ))}
        </div>
        {!summary && (
          <div className="rl">
            <h3 className="rl-h">전체 준공 실적</h3>
            <p className="rl-sub">{since}년부터 준공한 {done.length}건 전부입니다. 위의 분류를 누르면 이 목록도 함께 걸러집니다.</p>
            <div className="rl-wrap">
              <table>
                <thead>
                  <tr><th scope="col">준공</th><th scope="col">공사명</th><th scope="col">발주처</th><th scope="col">규모</th><th scope="col">연면적</th></tr>
                </thead>
                <tbody>
                  {done.map((p) => (
                    <tr key={p.id} data-cat={p.cat}>
                      <td className="num">{p.done}</td>
                      <th scope="row">{p.name}</th>
                      <td>{p.client}</td>
                      <td>{p.scale}</td>
                      <td className="num">{p.area ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!summary && <div className="more"><Link className="btn line" href="/contact">실적 자료(지명원) 요청</Link></div>}
      </div>
    </section>
  );
}
