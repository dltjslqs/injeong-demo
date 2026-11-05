import { BASE } from "./base";
import { company } from "./data";

export function Message() {
  return (
    <section className="gr" id="greeting">
      <div className="container gr-grid">
        <div className="box">
          <p className="gr-label rv">대표 인사말</p>
          <blockquote className="rv">“이름 석자를 걸고 짓습니다.”</blockquote>
          <p className="rv">건축주에게 건물을 짓는 일은 평생 한 번 있을까 말까 한 일입니다. 오랜 시간 모은 재산과 가족의 내일, 사업의 다음 십 년이 그 건물 하나에 담깁니다.</p>
          <p className="rv">시공사에게는 수많은 현장 가운데 하나일 수 있습니다. 준공 테이프를 끊고 나면 다음 현장으로 떠나면 그만입니다. 하지만 건축주는 그 건물에서 평생을 살고 일하며, 그 건물이 곧 재산으로 남습니다.</p>
          <p className="rv">그래서 인정건설은 처음부터 한 가지만 묻습니다. 내 건물이라면 어떻게 짓겠는가. 보이지 않는 배관 하나, 방수층 한 겹까지 내 것을 짓는 마음으로 다룹니다.</p>
          <p className="rv">도면 뒤로 물러서거나 담당자를 바꾸며 책임을 미루지 않습니다. 설계의 빈틈은 착공 전에 먼저 잡고, 공기와 품질에서는 단 1%도 타협하지 않는 것. 30년 넘게 학교와 군부대, 제조공장을 올리며 지켜온 원칙입니다.</p>
          <p className="rv">계약서에 서명한 그 신뢰 그대로, 완공 뒤에도 건물이 제 몫을 다할 때까지 대표와 현장 기술진이 끝까지 책임지겠습니다. 진심을 다해 짓겠습니다.</p>
          <div className="sig rv">{company.name} 대표이사<b>{company.ceo}</b></div>
        </div>
        <figure className="gr-pic rv">
          <img src={`${BASE}/sites/injeong/greeting.jpg`} alt="도면 위에 놓인 인정건설 안전모, 창밖으로 보이는 공사 현장" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
