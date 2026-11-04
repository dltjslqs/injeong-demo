import { BASE } from "./base";
import { company } from "./data";

export function Message() {
  return (
    <section className="gr" id="greeting">
      <div className="container gr-grid">
        <div className="box">
          <p className="gr-label rv">대표 인사말</p>
          <blockquote className="rv">“건물은 말로 짓지 않습니다. 현장에서 책임질 사람의 얼굴로 짓습니다.”</blockquote>
          <p className="rv">1989년 홍성에서 개인 건설업으로 시작해 2003년 법인으로 전환하기까지, 학교 군 시설, 공공청사, 산업플랜트를 지으며 단 하나의 원칙을 지켰습니다. 발주처가 요구하기 전에 오류를 먼저 잡고, 공기와 안전에서는 단 1%도 타협하지 않는 것입니다.</p>
          <p className="rv">도면 뒤로 숨지 않고, 계약부터 준공 테이프를 끊는 날까지 현장을 직접 지키겠습니다.</p>
          <div className="sig rv">{company.name} 대표이사<b>{company.ceo}</b></div>
        </div>
        <figure className="gr-pic rv">
          <img src={`${BASE}/sites/injeong/greeting.jpg`} alt="도면 위에 놓인 인정건설 안전모, 창밖으로 보이는 공사 현장" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
