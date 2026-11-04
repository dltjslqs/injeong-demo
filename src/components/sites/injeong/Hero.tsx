import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { BASE } from "./base";

export function Hero() {
  return (
    <div className="hero2">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={`${BASE}/sites/injeong/works/p12.jpg`}
        bgImageSrc={`${BASE}/sites/injeong/works/p16.jpg`}
        title="1989년부터 | 충남을 짓습니다"
        date="학교 · 관공서 · 군 시설 · 공장"
        scrollToExpand="스크롤하면 현장이 펼쳐집니다"
      >
        <div className="intro">
          <span className="kicker">발주처가 인정한 시공</span>
          <h2 className="h2">교육청과 지자체, 군이 맡긴 품질 그대로 짓습니다</h2>
          <p>홍성에 본사를 둔 종합건설사입니다. 학교와 공공청사, 군 시설을 지어 온 관급 공사 경험으로 공장과 교회, 근린생활시설까지 시공합니다.</p>
          <div className="btns">
            <Link className="btn cta" href="/contact">견적 문의하기</Link>
            <Link className="btn line" href="/projects">시공 실적 보기</Link>
          </div>
          <Link className="live" href="/projects">
            <span className="st">지금 시공 중</span>
            <b>(가칭)천안업성2초등학교 교사 신축공사</b>
            <div className="pct"><span>총 공사비 178.4억 · 공동도급 지분 51%</span><span className="num">2027.11 준공 예정</span></div>
          </Link>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
