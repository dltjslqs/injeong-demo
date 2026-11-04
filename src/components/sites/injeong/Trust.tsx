import { BASE } from "./base";
import { company } from "./data";

export function Trust() {
  return (
    <section className="trust">
      <div className="container">
        <div className="trust-head">
          <h2>감사패로 증명하는 시공 역량</h2>
          <p className="lede">공사를 마친 건축주와 발주처가 직접 전해준 감사패가 인정건설의 실력을 말해줍니다.</p>
        </div>
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
