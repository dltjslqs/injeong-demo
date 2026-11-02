import { BASE } from "./base";

const fields = [
  {
    img: "plant",
    title: "공장 신축",
    desc: "생산 설비가 놓일 자리에서 시작해 건물 크기를 정합니다.",
    points: ["설비 배치에 맞춘 기초·바닥 하중 설계", "크레인·수전·배관 동선 사전 협의", "공장 등록까지 인허가 동행"],
  },
  {
    img: "logistics",
    title: "물류센터·저온창고",
    desc: "도크 배치와 차량 동선이 운영비를 좌우합니다.",
    points: ["도크 수와 차량 회전 반경 검토", "영하 25도 저온 구역 단열 시공", "바닥 동결 방지층 시공"],
  },
  {
    img: "roof",
    title: "증축·리모델링",
    desc: "가동을 멈추지 않는 것이 증축 공사의 첫 조건입니다.",
    points: ["생산 구역과 공사 구역 분리", "소음이 큰 공정은 주말·야간 배치", "위생·안전 기준 사전 합의"],
  },
];

export function Business() {
  return (
    <section className="sec" id="business">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">사업 분야</span>
            <h2 className="h2 rv">인정건설이 짓는 세 가지 시설</h2>
            <p className="lede rv">용도마다 먼저 확인할 것이 다릅니다. 시설별로 저희가 챙기는 항목입니다.</p>
          </div>
        </div>
        <div className="svc">
          {fields.map((f, i) => (
            <article className="rv" key={f.title}>
              <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/${f.img}.jpg)` }} />
              <div className="bd">
                <span className="no num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul>{f.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <a className="link" href="#works">관련 실적 보기</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
