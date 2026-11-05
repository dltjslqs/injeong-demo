import Link from "next/link";
import { BASE } from "./base";

// The four reasons a client came back four times, as an accordion: one reason open at a time,
// and the photograph on the left follows the open one (Behaviors). Without scripting all four show open.
const reasons = [
  {
    label: "사전 원가 절감",
    title: "착공 전, 낭비되는 공사비부터 잡습니다",
    desc: "도면 검토 전담팀이 삽을 뜨기 전 도면의 오류·간섭·비효율 설계를 전수 검토하고, 공사비 거품을 걷어내는 대안 설계(VE)를 먼저 제안합니다.",
    img: "why-1.jpg",
    alt: "빨간 펜으로 간섭 지점을 표시한 도면과 3D 모델 검토 화면",
  },
  {
    label: "실행 엔지니어링",
    title: "대기업 현장 출신 엔지니어가 직접 관리합니다",
    desc: "현대엔지니어링, 쌍용건설 등 대형 건설사 현장을 지휘해 본 엔지니어가 현장을 총괄합니다. 프리랜서 소장에게 떠넘기지 않고 본사 기준으로 밀착 관리합니다.",
    img: "why-2.jpg",
    alt: "인정건설 안전모를 쓴 엔지니어 두 명이 타설 전 철근 간격을 검측하는 모습",
  },
  {
    label: "투명성·공정 관리",
    title: "공정과 원가를 데이터로 투명하게 관리합니다",
    desc: "CPM 공정표로 지연 위험을 미리 통제하고, 본사와 현장이 기성·원가 데이터를 실시간으로 공유합니다. 건축주는 언제든 공정률과 투입 원가를 확인할 수 있습니다.",
    img: "why-3.jpg",
    alt: "현장 사무실 화면에 띄운 공정표와 원가 그래프",
  },
  {
    label: "품질 락인",
    title: "검증된 A급 전속 시공팀 책임제",
    desc: "골조·방수·창호·설비처럼 누수와 균열이 잦은 공종에는 오래 손발을 맞춘 A급 전속 협력사만 투입하고, 직불 체계로 반장의 책임 시공을 관리합니다.",
    img: "why-4.jpg",
    alt: "인정건설 안전모를 쓴 방수 시공팀이 옥상 방수 시트를 시공하는 모습",
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
            {reasons.map((r, i) => (
              <img key={r.img} className={i === 0 ? "cs on" : "cs"} src={`${BASE}/sites/injeong/works/${r.img}`} alt={r.alt} width={1600} height={1200} loading="lazy" />
            ))}
          </div>
        </figure>
        <div className="case-txt">
          <ol className="case-why">
            {reasons.map((r, i) => (
              <li key={r.label} className={i === 0 ? "open" : undefined}>
                <h3>
                  <button type="button" id={`cw-b${i}`} aria-controls={`cw-p${i}`} aria-expanded={i === 0 ? "true" : "false"}>
                    <span className="cw-pill"><span className="num">{String(i + 1).padStart(2, "0")}</span>{r.label}</span>
                    <span className="cw-t">{r.title}</span>
                  </button>
                </h3>
                <div className="cw-body" id={`cw-p${i}`} role="region" aria-labelledby={`cw-b${i}`}>
                  <p>{r.desc}</p>
                </div>
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
