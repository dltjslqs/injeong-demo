import { BASE } from "./base";
import { company } from "./data";

export function Message() {
  return (
    <section className="gr" id="greeting" style={{ backgroundImage: `url(${BASE}/sites/injeong/works/p03-2.jpg)` }}>
      <div className="wrap">
        <div className="box">
          <span className="kicker rv">대표 인사</span>
          <blockquote className="rv">약속한 날, 약속한 품질로 건물을 넘겨 드리는 것. 그것이 인정건설이 지켜 온 일입니다.</blockquote>
          <p className="rv">1989년 홍성에서 건설업을 시작해 2003년 ㈜인정건설로 법인을 세웠습니다. 학교와 공공청사, 군 시설, 공장을 지으며 안전과 공기 준수, 발주처의 요구, 좋은 품질을 타협하지 않는 기준으로 지켜 왔습니다. 맡겨 주신 건물을 끝까지 책임지는 시공사가 되겠습니다.</p>
          <div className="sig rv">{company.name} 대표이사<b>{company.ceo}</b></div>
        </div>
      </div>
    </section>
  );
}
