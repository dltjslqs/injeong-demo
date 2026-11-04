import Link from "next/link";
import { BASE } from "./base";

// One client opened as a case: ㈜동신포리마, four projects in a row, and the four reasons they came back.

const shots = [
  { src: "case-1.jpg", alt: "㈜동신포리마 공장 전경, 해 질 녘 하늘에서 본 모습" },
  { src: "case-2.jpg", alt: "㈜동신포리마 공장 외관, 조명이 켜진 저녁" },
  { src: "case-3.jpg", alt: "㈜동신포리마 공장 내부 생산동" },
];

// why the client came back four times: the four things the company holds itself (copy from the 11/5 brief, condensed)
const reasons = [
  {
    label: "사전 원가 절감",
    title: "착공 전, 낭비되는 공사비부터 잡습니다",
    desc: "도면 검토 전담팀이 삽을 뜨기 전 도면의 오류·간섭·비효율 설계를 전수 검토하고, 공사비 거품을 걷어내는 대안 설계(VE)를 먼저 제안합니다.",
    tags: ["사전VE검토", "설계오류차단", "추가공사비차단"],
  },
  {
    label: "실행 엔지니어링",
    title: "대기업 현장 출신 엔지니어가 직접 관리합니다",
    desc: "현대엔지니어링, 쌍용건설 등 대형 건설사 현장을 지휘해 본 엔지니어가 현장을 총괄합니다. 프리랜서 소장에게 떠넘기지 않고 본사 기준으로 밀착 관리합니다.",
    tags: ["대기업출신엔지니어", "직영현장관리"],
  },
  {
    label: "투명성·공정 관리",
    title: "공정과 원가를 데이터로 투명하게 관리합니다",
    desc: "CPM 공정표로 지연 위험을 미리 통제하고, 본사와 현장이 기성·원가 데이터를 실시간으로 공유합니다. 건축주는 언제든 공정률과 투입 원가를 확인할 수 있습니다.",
    tags: ["CPM공정표", "실시간원가연동"],
  },
  {
    label: "품질 락인",
    title: "하자 잦은 공종엔 SSS급 전속 시공팀만 투입합니다",
    desc: "골조·방수·창호·설비처럼 누수와 균열이 잦은 공종에 검증된 전속 협력사를 락인(Lock-in)해 투입하고, 직불 체계로 반장의 책임 시공을 관리합니다.",
    tags: ["SSS급전속반장", "하자원천봉쇄"],
  },
];

export function Case() {
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
            <span>㈜동신포리마 공장, 2023~2025년 네 차례 시공</span>
            <span className="cs-dots">
              {shots.map((x, k) => <button key={x.src} type="button" aria-label={`${k + 1}번째 사진`} aria-current={k === 0 ? "true" : "false"} />)}
            </span>
          </figcaption>
        </figure>
        <div className="case-txt">
          <ol className="case-why">
            {reasons.map((r, i) => (
              <li key={r.label}>
                <p className="cw-label"><span className="num">{String(i + 1).padStart(2, "0")}</span>{r.label}</p>
                <h3>{r.title}</h3>
                <p className="cw-desc">{r.desc}</p>
                <p className="cw-tags">{r.tags.map((t) => <span key={t}>#{t}</span>)}</p>
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
