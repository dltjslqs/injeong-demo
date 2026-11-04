import { BASE } from "./base";
import { company } from "./data";

export function Message() {
  return (
    <section className="gr" id="greeting">
      <div className="container gr-grid">
        <div className="box">
          <p className="gr-label rv">대표 인사말</p>
          <blockquote className="rv">“건물은 말로 짓지 않습니다. 얼굴과 이름을 걸고 현장을 지키는 사람이 짓습니다.”</blockquote>
          <p className="rv">건물을 짓는 일은 발주처와 건축주에게 일생일대의 중요한 결정입니다. 그렇기에 인정건설은 도면 뒤로 물러서거나 담당자를 바꾸며 책임을 미루지 않습니다.</p>
          <p className="rv">30년 넘게 학교와 군부대, 제조공장을 올리며 지켜온 원칙은 단순합니다. ‘설계의 빈틈은 착공 전에 먼저 잡고, 공기와 품질에서는 단 1%도 타협하지 않는 것.’</p>
          <p className="rv">계약서에 서명한 그 신뢰 그대로, 완공의 순간까지 대표와 현장 기술진이 끝까지 책임지겠습니다.</p>
          <div className="sig rv">{company.name} 대표이사<b>{company.ceo}</b></div>
        </div>
        <figure className="gr-pic rv">
          <img src={`${BASE}/sites/injeong/greeting.jpg`} alt="도면 위에 놓인 인정건설 안전모, 창밖으로 보이는 공사 현장" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
