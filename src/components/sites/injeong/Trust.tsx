import { BASE } from "./base";

// One card per plaque: who gave it and when, a photograph, a line from it, the project.
// The two 농협 entries were written for the demo at the client's request; replace them with the real plaques' details.
const plaques: { org: string; year: string; project: string; quote: string }[] = [
  { org: "한국국토정보공사", year: "2017", project: "아산지사 사옥 신축공사", quote: "정밀한 시공과 성실한 공정 관리로 신뢰를 주셨습니다." },
  { org: "금산군청", year: "2018", project: "금산 역사문화박물관 건립공사", quote: "까다로운 전시 시설을 높은 품질로 완공해 주셨습니다." },
  { org: "㈜동신포리마", year: "2025", project: "공장·자재창고 4회 연속 시공", quote: "공장이 커질 때마다 믿고 다시 맡길 수 있었습니다." },
  { org: "홍성농업협동조합", year: "2022", project: "농산물 저온저장고 신축공사", quote: "수확철 일정에 맞춰 약속한 날 정확히 준공해 주셨습니다." },
  { org: "홍동농협", year: "2020", project: "농기계 보관창고 증축공사", quote: "운영을 멈추지 않고 안전하게 증축을 마쳐 주셨습니다." },
];

export function Trust() {
  return (
    <section className="trust">
      <div className="container">
        <div className="trust-head">
          <div>
            <h2>감사패로 증명하는 시공 역량</h2>
            <p className="lede">공사를 마친 건축주와 발주처가 직접 전해준 감사패가 인정건설의 실력을 말해줍니다.</p>
          </div>
          <div className="pq-ctl">
            <span className="pq-count num" aria-live="polite">01 / {String(plaques.length).padStart(2, "0")}</span>
            <button type="button" className="pq-btn prev" aria-label="이전 감사패" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
            <button type="button" className="pq-btn next" aria-label="다음 감사패"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        <div className="pq-wrap">
          <ul className="pq-row" role="region" aria-label="발주처에서 받은 감사패" tabIndex={0}>
            {plaques.map((p, i) => (
              <li key={p.org} className="pq">
                <p className="pq-top"><b>{p.org}</b><span className="num">{p.year}</span></p>
                <span className="pq-pic"><img src={`${BASE}/sites/injeong/awards/m${i + 1}.jpg`} alt={`${p.org} 감사패`} width={1024} height={768} loading="lazy" /></span>
                <blockquote className="pq-q">{p.quote}</blockquote>
                <p className="pq-pj">{p.project}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
