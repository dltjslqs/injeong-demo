import { BASE } from "./base";

export function Message() {
  return (
    <section className="gr" id="about" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/office.jpg)` }}>
      <div className="wrap">
        <div className="box">
          <span className="kicker rv">대표 인사</span>
          <blockquote className="rv">도면 위의 숫자를 현장에서 그대로 지키는 것, 저희가 받는 신뢰는 거기서 나옵니다.</blockquote>
          <p className="rv">인정건설은 2003년 홍성의 작은 현장 사무실에서 시작했습니다. 지금도 공정 회의는 현장에서 열고, 하자 접수에는 48시간 안에 답합니다. 공장을 맡기시는 분의 다음 생산 계획까지 함께 보는 시공사가 되겠습니다.</p>
          <div className="sig rv">인정건설(주) 대표이사<b>○○○</b></div>
        </div>
      </div>
    </section>
  );
}
