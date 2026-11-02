import { BASE } from "./base";

const steps = [
  { img: "pile", date: "2026.03", title: "기초 PHC 파일 항타", text: "설비 하중이 큰 생산동은 파일 간격을 좁혀 배치했습니다. 항타 기록은 한 본마다 남겨 발주처와 공유합니다." },
  { img: "steel", date: "2026.06", title: "철골 세우기", text: "10톤 크레인 주행 레일이 올라갈 기둥은 세운 뒤 수직도를 다시 측정했습니다." },
  { img: "roof", date: "2026.09", title: "지붕 패널 시공", text: "작업 구간 아래에 안전망을 먼저 설치하고, 패널 이음부는 구간마다 누수 시험을 합니다." },
  { img: "hero", date: "2026.10", title: "외벽·설비 배관 동시 진행", text: "현재 공정률 72%입니다. 12월 준공 뒤 1월에 생산 설비가 들어갑니다.", now: true },
];

export function NowBuilding() {
  return (
    <section className="sec soft" id="now">
      <div className="wrap nb">
        <div className="side">
          <span className="kicker rv">진행 현장</span>
          <h2 className="h2 rv">당진 송산 정밀부품 공장<br />공정 기록</h2>
          <p className="lede rv">공정이 바뀔 때마다 사진과 함께 기록해 발주처와 나눕니다.</p>
          <dl className="rv">
            <div><dt>업종</dt><dd>정밀부품 제조</dd></div>
            <div><dt>규모</dt><dd>생산동·창고동 2개 동</dd></div>
            <div><dt>연면적</dt><dd className="num">4,200평</dd></div>
            <div><dt>공사비</dt><dd className="num">185억 원</dd></div>
            <div><dt>공사 기간</dt><dd className="num">2025.11 – 2026.12</dd></div>
          </dl>
          <a className="link rv" href="#works">다른 현장 보기</a>
        </div>
        <ol className="tl">
          {steps.map((s) => (
            <li className={s.now ? "rv now" : "rv"} key={s.date}>
              <span className="dot" aria-hidden="true" />
              <div className="card">
                <img src={`${BASE}/sites/injeong/img/${s.img}.jpg`} alt={s.title} loading="lazy" decoding="async" />
                <div>
                  <time className="num">{s.date}{s.now ? " · 현재" : ""}</time>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
