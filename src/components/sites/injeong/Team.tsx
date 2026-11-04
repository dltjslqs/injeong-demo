import { BASE } from "./base";

// The people. The photograph is a generated stand-in until the company's own group photo is taken (see the caption).
export function Team() {
  return (
    <section className="team">
      <div className="container">
        <div className="team-head">
          <h2>도면의 빈틈을 놓치지 않습니다.</h2>
          <p className="lede">30년 관록의 현장 소장과 검증된 기술 인력이 당신의 건물을 직접 짓고, 직접 책임집니다.</p>
        </div>
        <figure className="team-pic">
          <img src={`${BASE}/sites/injeong/team.jpg`} alt="안전모를 쓴 인정건설 임직원 단체 사진" width={2400} height={1028} loading="lazy" />
          <figcaption>예시 이미지입니다. 실제 임직원 단체 사진으로 바꿀 예정입니다.</figcaption>
        </figure>
      </div>
    </section>
  );
}
