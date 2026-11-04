import Link from "next/link";
import { BASE } from "./base";
import { projects } from "./data";

// One client opened as a case: ㈜동신포리마, four projects in a row (data.ts).
const runs = projects.filter((p) => p.client === "㈜동신포리마").reverse();

export function Case() {
  return (
    <section className="case">
      <div className="container">
        <div className="case-head">
          <h2>건축주가 4번 연속 인정건설을 찾은 이유</h2>
        </div>
        <div className="case-in">
        <figure className="case-pic">
          <img src={`${BASE}/sites/injeong/works/p18.jpg`} alt="㈜동신포리마 신원단공장 전경" width={1800} height={1344} loading="lazy" />
          <figcaption>㈜동신포리마 신원단공장, 2025년 10월 준공</figcaption>
        </figure>
        <div className="case-txt">
          <p className="lead">㈜동신포리마의 성장을 가장 가까이서 함께 지었습니다. 도면 속 설계 오류를 착공 전에 먼저 찾아내고, 건축주 입장에서 예산을 줄일 수 있는 시공법을 먼저 제안했습니다. 지으라는 대로만 짓지 않고 먼저 움직였기에, 공사가 끝날 때마다 다음 현장을 맡겨 주셨습니다.</p>
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
      </div>
    </section>
  );
}
