import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { Figures } from "@/components/sites/injeong/Figures";
import { Message } from "@/components/sites/injeong/Message";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Regions } from "@/components/sites/injeong/Regions";

export const metadata: Metadata = { title: "회사소개" };

const history = [
  ["2003", "홍성에서 인정건설 설립"],
  ["2009", "종합건설업 등록, 첫 산업단지 공장 준공"],
  ["2015", "아산·당진 사무소 운영, 물류센터 시공 시작"],
  ["2021", "누적 준공 현장 150곳"],
  ["2026", "당진 송산 정밀부품 공장 시공 중"],
];

export default function AboutPage() {
  return (
    <>
      <PageHead en="ABOUT" title="회사소개" desc="2003년 홍성에서 시작해 충남 산업단지의 공장과 물류시설을 짓고 있습니다." img="plant" />
      <Message />
      <Figures />
      <section className="sec">
        <div className="wrap hist">
          <div>
            <span className="kicker rv">연혁</span>
            <h2 className="h2 rv">인정건설이 걸어온 길</h2>
          </div>
          <ol>
            {history.map(([y, t]) => (
              <li className="rv" key={y}><b className="num">{y}</b><span>{t}</span></li>
            ))}
          </ol>
        </div>
      </section>
      <Regions />
      <section className="sec soft">
        <div className="wrap visit">
          <div>
            <span className="kicker rv">오시는 길</span>
            <h2 className="h2 rv">홍성 본사</h2>
          </div>
          <dl className="rv">
            <div><dt>주소</dt><dd>충청남도 홍성군 (주소 입력 예정)</dd></div>
            <div><dt>대표전화</dt><dd className="num">041-633-9942</dd></div>
            <div><dt>팩스</dt><dd className="num">041-633-9943</dd></div>
            <div><dt>운영 시간</dt><dd>평일 08:30 – 17:30</dd></div>
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
