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
          <h2>증축에서 신축까지, 건축주가 4번 연속 인정건설을 찾은 이유</h2>
          <p className="lead">㈜동신포리마의 성장을 가장 가까이서 함께 지었습니다. 공사가 끝날 때마다 다음 현장까지 주저 없이 맡겨주신 비결은 완벽한 마감과 공기 약속에 있습니다.</p>
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
