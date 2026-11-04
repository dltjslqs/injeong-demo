import Link from "next/link";
import { BASE } from "./base";
import { getProjects } from "@/lib/injeong/content";

// One client opened as a case: ㈜동신포리마, four projects in a row (data.ts).

const shots = [
  { src: "case-1.jpg", alt: "㈜동신포리마 공장 전경, 해 질 녘 하늘에서 본 모습" },
  { src: "case-2.jpg", alt: "㈜동신포리마 공장 외관, 조명이 켜진 저녁" },
  { src: "case-3.jpg", alt: "㈜동신포리마 공장 내부 생산동" },
];

export async function Case() {
  const runs = (await getProjects()).filter((p) => p.client === "㈜동신포리마" && !p.ongoing).reverse();
  return (
    <section className="case">
      <div className="container">
        <div className="case-head">
          <div>
            <h2>건축주가 4번 연속 인정건설을 찾은 이유</h2>
            <p className="lede">설계 오류를 찾아내고, 예산을 줄일 방법을 먼저 제안드렸습니다.</p>
          </div>
        </div>
        <div className="case-in">
        <figure className="case-pic">
          <div className="cs-stage">
            {shots.map((x, k) => (
              <img key={x.src} className={k === 0 ? "cs on" : "cs"} src={`${BASE}/sites/injeong/works/${x.src}`} alt={x.alt} width={1920} height={1080} loading="lazy" />
            ))}
          </div>
          <figcaption>
            <span>㈜동신포리마 신원단공장, 2025년 10월 준공</span>
            <span className="cs-dots">
              {shots.map((x, k) => <button key={x.src} type="button" aria-label={`${k + 1}번째 사진`} aria-current={k === 0 ? "true" : "false"} />)}
            </span>
          </figcaption>
        </figure>
        <div className="case-txt">
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
