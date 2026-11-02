import { BASE } from "./base";

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="txt">
          <span className="kicker rv">충남 산업시설 전문 종합건설</span>
          <h1 className="rv">설비가 들어갈 자리부터<br /><em>계산하고</em> 짓습니다.</h1>
          <p className="rv">공장, 물류센터, 증축 공사를 부지 검토부터 하자 관리까지 한 팀이 맡습니다. 홍성·예산·아산·당진·서산 산업단지에서 23년째 현장을 운영하고 있습니다.</p>
          <div className="btns rv">
            <a className="btn cta" href="#contact">견적 상담 신청</a>
            <a className="btn line" href="#works">시공 실적 보기</a>
          </div>
        </div>
        <div className="pic" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/hero.jpg)` }} role="img" aria-label="철골 공장 신축 현장 드론 사진">
          <div className="live">
            <span className="st">지금 시공 중</span>
            <b>당진 송산 정밀부품 공장</b>
            <div className="gauge"><i /></div>
            <div className="pct"><span>공정률</span><span className="num">72%</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
