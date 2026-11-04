import { BASE } from "./base";
import { company } from "./data";

// What the company holds and what its clients said: registrations, ratings, then the plaques.
// The plaque photographs are generated samples until the real ones are shot (see the caption).
const creds = [
  { k: "건축공사업", v: "등록 10-1210호" },
  { k: "실내건축공사업", v: "등록 충남홍성 2024-나-03" },
  { k: `${company.capacity.year} 시공능력평가`, v: `${company.capacity.amount}, ${company.capacity.rankRegion}`, big: company.capacity.amount },
  { k: "기업신용평가", v: `${company.credit.grade}, ${company.credit.agency}`, big: company.credit.grade },
  { k: "보유 기술인력", v: "", big: `${company.engineers}명` },
];

export function Trust() {
  return (
    <section className="trust">
      <div className="container">
        <div className="trust-head">
          <h2>감사패로 증명하는 시공 역량</h2>
          <p className="lede">종합건설 면허, 탄탄한 기업신용등급, 그리고 완공 후 건축주가 직접 전해준 감사패가 인정건설의 실력을 말해줍니다.</p>
        </div>
        <dl className="creds-grid">
          {creds.map((c) => (
            <div key={c.k}>
              <dt>{c.k}</dt>
              <dd>{c.big ? <><b className="num">{c.big}</b>{c.v && <span>{c.v.replace(`${c.big}, `, "")}</span>}</> : <span className="lic">{c.v}</span>}</dd>
            </div>
          ))}
        </dl>
        <h3 className="awards-h">발주처에서 받은 감사패 {company.awards.length}점</h3>
        <ul className="plaques">
          {company.awards.map((a, i) => (
            <li key={a}>
              <span className="plq"><img src={`${BASE}/sites/injeong/awards/k${i + 1}.jpg`} alt="" width={640} height={800} loading="lazy" /></span>
              <p>{a.replace(" 감사패", "")}</p>
            </li>
          ))}
        </ul>
        <p className="plaques-note">감사패 사진은 예시 이미지입니다. 실물 사진으로 바꿀 예정입니다.</p>
      </div>
    </section>
  );
}
