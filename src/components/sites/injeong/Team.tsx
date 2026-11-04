import { BASE } from "./base";

// The people. The photograph is a generated stand-in until the company's own group photo is taken.
export function Team() {
  return (
    <section className="team">
      <div className="container">
        <div className="team-head">
          <div>
            <h2>30년 관록의 검증된 기술인력</h2>
            <p className="lede">30년 관록의 현장 소장과 검증된 기술 인력이 당신의 건물을 직접 짓고, 직접 책임집니다.</p>
          </div>
        </div>
        <figure className="team-pic">
          <img src={`${BASE}/sites/injeong/team.jpg`} alt="안전모를 쓴 인정건설 임직원 단체 사진" width={2400} height={1028} loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
