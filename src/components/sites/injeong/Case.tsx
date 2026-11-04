import Link from "next/link";
import { BASE } from "./base";
import { projects } from "./data";

// One client opened as a case: ㈜동신포리마, four projects in a row (data.ts).
const runs = projects.filter((p) => p.client === "㈜동신포리마").reverse();

export function Case() {
  return (
    <section className="case">
      <div className="container case-in">
        <figure className="case-pic">
          <img src={`${BASE}/sites/injeong/works/p18.jpg`} alt="㈜동신포리마 신원단공장 전경" width={1800} height={1344} loading="lazy" />
          <figcaption>㈜동신포리마 신원단공장, 2025년 10월 준공</figcaption>
        </figure>
        <div className="case-txt">
          <h2>한 공장이 네 번 맡겼습니다</h2>
          <p className="lead">자재창고 증축에서 시작해 새 공장까지, ㈜동신포리마는 공사를 마칠 때마다 다음 공사를 인정건설에 맡겼고 감사패도 보냈습니다.</p>
          <ol className="case-runs">
            {runs.map((p) => (
              <li key={p.id}>
                <time className="num">{p.done}</time>
                <span>{p.name.replace("㈜동신포리마 ", "")}</span>
                <span className="num">{p.area}</span>
              </li>
            ))}
          </ol>
          <Link className="link" href="/projects">산업시설 실적 보기</Link>
        </div>
      </div>
    </section>
  );
}
