import type { Metadata } from "next";
import { ClientMix } from "@/components/sites/injeong/ClientMix";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { company } from "@/components/sites/injeong/data";
import { Message } from "@/components/sites/injeong/Message";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "회사소개" };

const history = [
  ["1989", "홍성에서 건설업 시작"],
  ["2003", "㈜인정건설 법인 설립, 건축공사업 등록"],
  ["2017", "한국국토정보공사 아산지사 사옥 준공"],
  ["2018", "금산 역사문화박물관 준공"],
  ["2021", "㈜텔콘알에프제약 공장 증축 준공, 군 탄약검사장 준공"],
  ["2023", "㈜동신포리마 자재창고 증축 준공 (이후 2025년까지 4차례 연속 시공)"],
  ["2024", "실내건축공사업 등록"],
  ["2025", "고덕국민체육센터 준공, 동신포리마 신원단공장 준공"],
  ["2026", "천안업성2초등학교 교사 신축공사 착공 (총 178억, 공동도급)"],
];

export default function AboutPage() {
  return (
    <>
      <PageHead en="ABOUT" title="회사소개" desc="1989년 홍성에서 시작해 충남의 학교와 공공시설, 산업시설을 지어 온 종합건설사입니다." img="p03" />
      <Message />
      <section className="sec">
        <div className="container hist">
          <div>
            <h2 className="h2 rv">인정건설이 걸어온 길</h2>
          </div>
          <ol>
            {history.map(([y, t]) => (
              <li className="rv" key={y}><b className="num">{y}</b><span>{t}</span></li>
            ))}
          </ol>
        </div>
      </section>
      <section className="sec soft">
        <div className="container hist">
          <div>
            <h2 className="h2 rv">공신력 자료</h2>
            <p className="lede rv">증빙 서류 원본은 요청하시면 회사 자료와 함께 보내 드립니다.</p>
          </div>
          <div>
            <dl className="creds rv">
              <div><dt>건설업 시작</dt><dd>{company.since}년, 법인 설립 {company.founded}</dd></div>
              {company.licenses.map((l) => <div key={l.name}><dt>{l.name}</dt><dd>{l.no}</dd></div>)}
              <div><dt>시공능력평가액</dt><dd>{company.capacity.year}년 {company.capacity.amount}, {company.capacity.rankRegion} ({company.capacity.regionTotal}개사 중)</dd></div>
              <div><dt>기업신용평가</dt><dd>{company.credit.grade} ({company.credit.agency}, {company.credit.until}까지)</dd></div>
              <div><dt>기술인력</dt><dd>{company.engineers}명</dd></div>
              <div><dt>최근 매출</dt><dd>{company.sales.map((s) => `${s.year}년 ${s.amount}억`).join(" → ")}</dd></div>
            </dl>
            <h3 className="awt rv">발주처에서 받은 감사패</h3>
            <ul className="awards rv">{company.awards.map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
        </div>
      </section>
      <ClientMix />
      <section className="sec soft">
        <div className="container visit">
          <div>
            <h2 className="h2 rv">홍성 본사</h2>
          </div>
          <dl className="rv">
            <div><dt>주소</dt><dd>{company.address}</dd></div>
            <div><dt>대표전화</dt><dd className="num">{company.tel}</dd></div>
            <div><dt>팩스</dt><dd className="num">{company.fax}</dd></div>
            <div><dt>이메일</dt><dd>{company.email}</dd></div>
          </dl>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
