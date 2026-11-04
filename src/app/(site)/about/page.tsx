import type { Metadata } from "next";
import { BASE } from "@/components/sites/injeong/base";
import { ClientMix } from "@/components/sites/injeong/ClientMix";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { company } from "@/components/sites/injeong/data";
import { Message } from "@/components/sites/injeong/Message";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "회사소개" };

// 제출서류(26.11.03) 01. 증빙서류의 원본 PDF를 그대로 이미지로 옮긴 것
const certs = [
  { file: "business", name: "사업자등록증", note: "126-81-72450" },
  { file: "license-arch", name: "건설업등록증", note: "건축공사업 10-1210" },
  { file: "license-interior", name: "건설업등록증", note: "실내건축공사업 충남홍성 2024-나-03" },
  { file: "capacity-2026", name: "시공능력평가액 확인서", note: "2026년도, 대한건설협회" },
];

const history = [
  ["1989", "홍성에서 개인 건설업 시작"],
  ["2003", "㈜인정건설 법인 전환, 건축공사업 등록"],
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
      <PageHead en="ABOUT" title="회사소개" heading="1989년부터 충남의 공공 기준을 지켜온 종합건설사, 인정건설입니다." desc="1989년 개인 건설업으로 시작해 2003년 법인으로 전환한 이래, 타협 없는 관급 공사의 엄격함을 민간 건축까지 그대로 적용해 왔습니다." img="team.jpg" />
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
        <div className="container hist stack">
          <div>
            <h2 className="h2 rv">수치와 공인 평가로 투명하게 증명하는 시공 역량</h2>
            <p className="lede rv">재무 건전성부터 기술 인력 면허, 지자체 감사패까지 모든 증빙 원본을 투명하게 공개합니다.</p>
          </div>
          <div>
            <dl className="creds rv">
              <div><dt>건설업 시작</dt><dd>{company.since}년 개인 건설업, {company.founded} 법인 전환</dd></div>
              {company.licenses.map((l) => <div key={l.name}><dt>{l.name}</dt><dd>{l.no}</dd></div>)}
              <div><dt>시공능력평가액</dt><dd>{company.capacity.year}년 {company.capacity.amount}, {company.capacity.rankRegion} ({company.capacity.regionTotal}개사 중)</dd></div>
              <div><dt>기업신용평가</dt><dd>{company.credit.grade} ({company.credit.agency}, {company.credit.until}까지)</dd></div>
              <div><dt>기술인력</dt><dd>{company.engineers}명</dd></div>
              <div><dt>최근 매출</dt><dd>{company.sales.map((s) => `${s.year}년 ${s.amount}억`).join(" → ")}</dd></div>
            </dl>
            <h3 className="awt rv">등록증과 확인서 원본</h3>
            <ul className="certs rv">
              {certs.map((c) => (
                <li key={c.file}>
                  <a href={`${BASE}/sites/injeong/certs/${c.file}.jpg`} target="_blank" rel="noopener" aria-label={`${c.name} ${c.note} 크게 보기 (새 창)`}>
                    <span className="cert-pic"><img src={`${BASE}/sites/injeong/certs/${c.file}-s.jpg`} alt={`${c.name} 원본`} width={640} height={900} loading="lazy" /></span>
                    <b>{c.name}</b>
                    <span>{c.note}</span>
                  </a>
                </li>
              ))}
            </ul>
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
            <div><dt>길찾기</dt><dd><a className="link" href={`https://map.naver.com/p/search/${encodeURIComponent(company.address)}`} target="_blank" rel="noopener">네이버 지도</a> <a className="link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`} target="_blank" rel="noopener">구글 지도</a></dd></div>
          </dl>
          <div className="map rv">
            <iframe title="㈜인정건설 홍성 본사 위치" src={`https://www.google.com/maps?q=${encodeURIComponent(`${company.address} 인정건설`)}&hl=ko&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
