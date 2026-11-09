import Link from "next/link";
import { BASE } from "./base";
import { projectImg } from "./data";
import { getProjects } from "@/lib/injeong/content";

// ㈜동신포리마, four projects in a row: on the left the projects themselves (photo, thumbnails, a 1차→4차 line
// read from data.ts), on the right the four reasons as an accordion, one open at a time (Behaviors).
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
const short = (name: string) => name.replace("㈜동신포리마 ", "").replace(/\(주(\d)동·(\d)동\)/, " $1·$2동").replace(/\s*(신축|증축)공사$/, " $1");

export async function Case() {
  const runs = (await getProjects()).filter((p) => p.client === "㈜동신포리마" && !p.ongoing).reverse();
  const last = runs.length - 1;
  return (
    <section className="case">
      <div className="container">
        <div className="case-head">
          <div>
            <h2>건축주가 4번 연속 인정건설을 찾은 이유</h2>
            <p className="lede">설계 오류를 찾아내고 예산은 아끼는 검증된 4가지 차별화 요소</p>
          </div>
        </div>
        <div className="case-in">
          <div className="case-pic">
            <div className="cs-stage">
              {runs.map((p, i) => (
                <img key={p.id} className={i === last ? "cs on" : "cs"} src={p.img && hero[p.img] ? `${BASE}/sites/injeong/works/${hero[p.img]}` : projectImg(p)} alt={`㈜동신포리마 ${short(p.name)}`} width={1600} height={1200} loading="lazy" />
              ))}
              <span className="cs-badge"><b className="num">{runs.length}회</b> 연속 의뢰</span>
            </div>
            <div className="cs-thumbs" role="group" aria-label="㈜동신포리마 공사 사진 고르기">
              {runs.map((p, i) => (
                <button key={p.id} type="button" data-run={i} aria-pressed={i === last ? "true" : "false"} aria-label={`${i + 1}차 ${short(p.name)} 사진 보기`}>
                  <img src={projectImg(p)} alt="" width={400} height={300} loading="lazy" />
                </button>
              ))}
            </div>
            <ol className="cs-steps">
              {runs.map((p, i) => (
                <li key={p.id} className={i === last ? "on" : undefined}>
                  <button type="button" data-run={i} aria-label={`${i + 1}차 ${p.done} ${short(p.name)}`}>
                    <i aria-hidden="true" />
                    <b>{i + 1}차</b>
                    <span className="num">{p.done}</span>
                    <span>{short(p.name)}</span>
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
