import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { BASE } from "./base";

export function Hero() {
  return (
    <div className="hero2">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={`${BASE}/sites/injeong/img/hero.jpg`}
        bgImageSrc={`${BASE}/sites/injeong/img/steel.jpg`}
        title="설비 자리부터 | 계산하고 짓습니다"
        date="충남 산업시설 전문 종합건설"
        scrollToExpand="스크롤하면 현장이 펼쳐집니다"
      >
        <div className="intro">
          <span className="kicker">인정건설이 일하는 방식</span>
          <h2 className="h2">공장은 첫 생산일까지가 공사입니다</h2>
          <p>공장, 물류센터, 증축 공사를 부지 검토부터 하자 관리까지 한 팀이 맡습니다. 홍성·예산·아산·당진·서산 산업단지에서 23년째 현장을 운영하고 있습니다.</p>
          <div className="btns">
            <a className="btn cta" href="#contact">견적 상담 신청</a>
            <a className="btn line" href="#works">시공 실적 보기</a>
          </div>
          <div className="live">
            <span className="st">지금 시공 중</span>
            <b>당진 송산 정밀부품 공장</b>
            <div className="gauge"><i /></div>
            <div className="pct"><span>공정률</span><span className="num">72%</span></div>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
