import Link from "next/link";
import { BASE } from "./base";
import { projectImg } from "./data";
import { getProjects } from "@/lib/injeong/content";

// ㈜동신포리마, eleven projects since 2008: on the left the projects themselves (photo with its caption and a
// year line read from data.ts), on the right the four reasons as an accordion, one open at a time (Behaviors).
// Without scripting the latest project shows and all four reasons are open.
const reasons = [
  {
    label: "사전 원가 절감",
    title: "착공 전, 낭비되는 공사비부터 잡습니다",
    desc: "착공 전에 엔지니어가 도면 전체를 검토해 오류와 간섭, 비효율적인 설계를 찾습니다. 줄일 수 있는 공사비가 보이면 대안 설계(VE)를 먼저 제안합니다.",
  },
  {
    label: "실행 엔지니어링",
    title: "대기업 현장 출신 엔지니어가 직접 관리합니다",
    desc: "현대엔지니어링, 쌍용건설 현장 출신 엔지니어가 현장을 총괄합니다. 현장소장을 외부 프리랜서에게 맡기지 않고 본사가 직접 관리합니다.",
  },
  {
    label: "투명성·공정 관리",
    title: "공정과 원가를 데이터로 투명하게 관리합니다",
    desc: "주공정(CPM) 공정표로 늦어질 수 있는 공정을 미리 챙깁니다. 공사 진척과 들어간 비용은 건축주께 정기적으로 보고합니다.",
  },
  {
    label: "품질 락인",
    title: "검증된 A급 전속 시공팀 책임제",
    desc: "기술력이 중요한 공종은 전속 협력사에게만 맡깁니다.",
  },
];

// the latest project's own photo is plain, so the dusk shot of the same plant stands in as its main image
const hero: Record<string, string> = { p18: "case-2.jpg" };
const short = (name: string) =>
  name
    .replace("㈜동신포리마 ", "")
    .replace(/\(주(\d)동·(\d)동\)/, " $1·$2동")
    .replace(/공사(\(\d{4}\))?$/, "")
    .trim();

export async function Case() {
  const runs = (await getProjects()).filter((p) => p.client === "㈜동신포리마" && !p.ongoing).reverse();
  const last = runs.length - 1;
  const since = runs[0]?.done.slice(0, 4);
  return (
    <section className="case">
      <div className="container">
        <div className="case-head">
          <div>
            <h2>건축주가 {since}년부터 {runs.length}번 인정건설을 찾은 이유</h2>
            <p className="lede">설계 오류를 찾아내고 예산은 아끼는 검증된 4가지 차별화 요소</p>
          </div>
        </div>
        <div className="case-in">
          <div className="case-pic">
            <div className="cs-stage">
              {runs.map((p, i) =>
                projectImg(p) ? (
                    <img key={p.id} className={i === last ? "cs on" : "cs"} src={p.img && hero[p.img] ? `${BASE}/sites/injeong/works/${hero[p.img]}` : projectImg(p)} alt={`㈜동신포리마 ${short(p.name)}`} width={1600} height={1200} loading="lazy" />
                ) : (
                  <div key={p.id} className={i === last ? "cs cs-none on" : "cs cs-none"} role="img" aria-label={`㈜동신포리마 ${short(p.name)}, 사진 자료 없음`}>
                    <b className="num">{p.done.slice(0, 4)}</b>
                    <span>{short(p.name)}</span>
                  </div>
                ),
              )}
              <span className="cs-badge"><b className="num">{runs.length}회</b> 의뢰</span>
            </div>
            <p className="cs-caps" aria-live="polite">
              {runs.map((p, i) => (
                <span key={p.id} className={i === last ? "cs-cap on" : "cs-cap"}>
                  <b className="num">{i + 1}차</b> <span className="num">{p.done}</span> {short(p.name)}
                </span>
              ))}
            </p>
            <ol className="cs-steps" style={{ "--n": runs.length } as React.CSSProperties}>
              {runs.map((p, i) => (
                <li key={p.id} className={i === last ? "on" : undefined}>
                  <button type="button" data-run={i} aria-label={`${i + 1}차 ${p.done} ${short(p.name)}`}>
                    <i aria-hidden="true" />
                    <span className="num">{p.done.slice(0, 4)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="case-txt">
            <ol className="case-why">
              {reasons.map((r, i) => (
                <li key={r.label} className={i === 0 ? "open" : undefined}>
                  <h3>
                    <button type="button" id={`cw-b${i}`} aria-controls={`cw-p${i}`} aria-expanded={i === 0 ? "true" : "false"}>
                      <span className="cw-k"><span className="num">{String(i + 1).padStart(2, "0")}</span>{r.label}</span>
                      <span className="cw-t">{r.title}</span>
                    </button>
                  </h3>
                  <div className="cw-body" id={`cw-p${i}`} role="region" aria-labelledby={`cw-b${i}`}>
                    <p>{r.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link className="cs-more" href="/projects">산업시설 실적 전체보기<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
