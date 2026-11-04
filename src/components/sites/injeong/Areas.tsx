import Link from "next/link";
import { BASE } from "./base";
import { projects, type Category } from "./data";

const count = (cat: Category) => projects.filter((p) => p.cat === cat).length;

// What the company builds, as a bento of mixed spans: two photographs, three set in type.
export function Areas() {
  return (
    <section className="areas">
      <div className="container">
        <div className="areas-head">
          <div>
            <h2>도면을 가장 정확한 현실로 만드는 시공 기술</h2>
            <p className="lede">교육청의 까다로운 감리 기준부터 제조 라인의 특수 스펙까지, 인정건설의 37년 현장 노하우로 시공합니다.</p>
          </div>
          <Link className="link" href="/business">사업 분야 자세히</Link>
        </div>
        <div className="bento">
          <article className="tile pic span-8" style={{ backgroundImage: `url(${BASE}/sites/injeong/works/p15.jpg)` }}>
            <div className="tile-txt">
              <h3>교육시설</h3>
              <p>초·중·고 강당과 교실, 대학 시설</p>
              <p className="tally num">실적 {count("교육")}건</p>
            </div>
          </article>
          <article className="tile well span-4">
            <h3>공공·의료</h3>
            <ul>
              <li>금산 역사문화박물관</li>
              <li>고덕국민체육센터</li>
              <li>한국국토정보공사 아산지사</li>
              <li>단국대병원 시설개선</li>
            </ul>
            <p className="tally num">실적 {count("공공")}건</p>
          </article>
          <article className="tile field span-4">
            <h3>군 시설</h3>
            <ul>
              <li>탄약검사장 신축</li>
              <li>기지교회 신축</li>
              <li>물자창고 신축 2곳</li>
            </ul>
            <p className="tally num">실적 {count("군")}건</p>
          </article>
          <article className="tile pic span-8" style={{ backgroundImage: `url(${BASE}/sites/injeong/works/p11.jpg)` }}>
            <div className="tile-txt">
              <h3>산업시설</h3>
              <p>공장 신축과 자재창고 증축</p>
              <p className="tally num">실적 {count("산업")}건</p>
            </div>
          </article>
          <article className="tile line span-12">
            <h3>민간건축과 실내건축</h3>
            <p>교회와 근린생활시설, 다가구주택을 짓고 실내건축공사업으로 시설 개선까지 맡습니다.</p>
            <p className="tally num">실적 {count("민간")}건</p>
          </article>
        </div>
      </div>
    </section>
  );
}
