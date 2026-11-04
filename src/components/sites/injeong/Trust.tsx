import { BASE } from "./base";

// One card per plaque: who gave it, the project it was for (from data.ts), a line from it, a photograph.
// Photographs and quoted lines are samples until the real plaques are photographed and their wording is sent.
// The two 농협 plaques have no matching project in the submitted list yet, so their project and year stay empty.
const plaques: { org: string; year?: string; project?: string; quote: string }[] = [
  { org: "한국국토정보공사", year: "2017", project: "아산지사 사옥 신축공사", quote: "정밀한 시공과 성실한 공정 관리로 신뢰를 주셨습니다." },
  { org: "금산군청", year: "2018", project: "금산 역사문화박물관 건립공사", quote: "까다로운 전시 시설을 높은 품질로 완공해 주셨습니다." },
  { org: "㈜동신포리마", year: "2025", project: "공장·자재창고 4회 연속 시공", quote: "공장이 커질 때마다 믿고 다시 맡길 수 있었습니다." },
  { org: "홍성농업협동조합", quote: "지역 농업 시설을 책임감 있게 지어 주셨습니다." },
  { org: "홍동농협", quote: "약속한 품질과 공기를 끝까지 지켜 주셨습니다." },
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
        </div>
        <ul className="pq-row" role="region" aria-label="발주처에서 받은 감사패" tabIndex={0}>
          {plaques.map((p, i) => (
            <li key={p.org} className="pq">
              <p className="pq-top"><b>{p.org}</b>{p.year && <span className="num">{p.year}</span>}</p>
              <span className="pq-pic"><img src={`${BASE}/sites/injeong/awards/m${i + 1}.jpg`} alt="" width={1024} height={768} loading="lazy" /></span>
              <blockquote className="pq-q">{p.quote}</blockquote>
              <p className="pq-pj">{p.project ?? "공사 내용 확인 중"}</p>
            </li>
          ))}
        </ul>
        <p className="plaques-note">감사패 사진과 인용 문구는 예시입니다. 실물 사진과 감사패 문구로 바꿀 예정입니다.</p>
      </div>
    </section>
  );
}
