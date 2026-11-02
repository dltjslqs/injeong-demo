import { BASE } from "./base";

const filters = ["전체", "공장", "물류", "증축"];

const works = [
  { cat: "공장", img: "hero", name: "당진 송산 정밀부품 공장", place: "당진 송산2산단", size: "4,200평", cost: "185억", period: "2025.11 – 2026.12", ongoing: true },
  { cat: "물류", img: "logistics", name: "아산 저온 물류센터", place: "아산 둔포", size: "3,600평", cost: "142억", period: "2025.09 – 2026.12", ongoing: true },
  { cat: "공장", img: "plant", name: "홍성 자동차부품 공장", place: "홍성 일반산단", size: "2,800평", cost: "96억", period: "2023.04 – 2024.03" },
  { cat: "증축", img: "roof", name: "예산 식품공장 2라인 증축", place: "예산 예당산단", size: "1,100평", cost: "38억", period: "2024.02 – 2024.09" },
  { cat: "공장", img: "steel", name: "서산 금속가공 공장", place: "서산 오토밸리", size: "1,900평", cost: "64억", period: "2022.05 – 2023.01" },
  { cat: "증축", img: "pile", name: "천안 전자부품 공장 증축", place: "천안 3산단", size: "900평", cost: "31억", period: "2026.03 – 2026.11", ongoing: true },
];

export function Works() {
  return (
    <section className="sec" id="works">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">시공 실적</span>
            <h2 className="h2 rv">충남 산업단지 주요 현장</h2>
          </div>
          <div className="tabs rv" role="group" aria-label="실적 분류">
            {filters.map((f, i) => (
              <button type="button" className={i === 0 ? "on" : undefined} aria-pressed={i === 0} data-f={f} key={f}>{f}</button>
            ))}
          </div>
        </div>
        <div className="pf">
          {works.map((w) => (
            <article className="rv" data-cat={w.cat} key={w.name}>
              <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/${w.img}.jpg)` }}>
                <span className={w.ongoing ? "tag on" : "tag"}>{w.ongoing ? "시공 중" : "준공"}</span>
              </div>
              <div className="bd">
                <h3>{w.name}</h3>
                <dl>
                  <dt>위치</dt><dd>{w.place}</dd>
                  <dt>연면적</dt><dd className="num">{w.size}</dd>
                  <dt>공사비</dt><dd className="num">{w.cost}</dd>
                  <dt>기간</dt><dd className="num">{w.period}</dd>
                </dl>
              </div>
            </article>
          ))}
        </div>
        <div className="more"><a className="btn line" href="#contact">전체 실적 자료 요청</a></div>
      </div>
    </section>
  );
}
