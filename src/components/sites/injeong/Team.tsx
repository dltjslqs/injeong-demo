import { BASE } from "./base";

// The people. The photograph is a generated stand-in until the company's own group photo is taken (see the caption).
export function Team() {
  return (
    <section className="team">
      <div className="container">
        <div className="team-head">
          <h2>도면부터 준공까지, 한 팀이 끝까지 책임집니다</h2>
          <p className="lede">현장을 오래 지켜 온 베테랑과 젊은 기술진이 한 팀으로 움직입니다.</p>
        </div>
        <figure className="team-pic">
          <img src={`${BASE}/sites/injeong/team.jpg`} alt="안전모를 쓴 인정건설 임직원 단체 사진" width={1344} height={752} loading="lazy" />
          <figcaption>예시 이미지입니다. 실제 임직원 단체 사진으로 바꿀 예정입니다.</figcaption>
        </figure>
      </div>
    </section>
  );
}
