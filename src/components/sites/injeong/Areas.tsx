import Link from "next/link";
import { BASE } from "./base";
import { doneCount, getProjects } from "@/lib/injeong/content";
import type { Category } from "./data";


// What the company builds: five cards of one shape, photograph above and type on a plain surface below.
const areas: { cat: Category; title: string; img: string; desc: string; ex: string[] }[] = [
  { cat: "교육", title: "교육시설", img: "p15", desc: "초·중·고 강당과 교실, 대학 시설", ex: ["학교 강당 신축", "교사 증축과 개선"] },
  { cat: "공공", title: "공공·의료", img: "p02", desc: "청사와 문화·체육, 의료 시설", ex: ["금산 역사문화박물관", "한국국토정보공사 아산지사"] },
  { cat: "산업", title: "산업시설", img: "area-industry", desc: "공장 신축과 자재창고 증축", ex: ["제조공장 신축", "자재창고 증축"] },
  { cat: "군", title: "군 시설", img: "p14", desc: "부대 시설과 창고, 검사장", ex: ["탄약검사장 신축", "물자창고 신축 2곳"] },
  { cat: "민간", title: "민간·실내건축", img: "p08", desc: "교회와 근린생활시설, 다가구주택", ex: ["교회 신·증축", "실내건축 시설 개선"] },
];

export async function Areas() {
  const list = await getProjects();
  const count = (cat: Category) => doneCount(list, cat);
  return (
    <section className="areas">
      <div className="container">
        <div className="areas-head">
          <div>
            <h2>도면을 가장 정확한 현실로 만드는 시공 기술</h2>
            <p className="lede">교육청의 까다로운 감리 기준부터 제조 라인의 특수 스펙까지, 인정건설이 1989년부터 쌓은 현장 노하우로 시공합니다.</p>
          </div>
          <Link className="link" href="/business">사업 분야 자세히</Link>
        </div>
        <ul className="ar-grid">
          {areas.map((a) => (
            <li key={a.cat}>
              <Link href="/business" className="ar">
                <span className="ar-pic"><img src={`${BASE}/sites/injeong/works/${a.img}.jpg`} alt="" loading="lazy" /></span>
                <span className="ar-bd">
                  <b className="ar-t">{a.title}</b>
                  <span className="ar-d">{a.desc}</span>
                  <span className="ar-ex">{a.ex.map((x) => <span key={x}>{x}</span>)}</span>
                  <span className="ar-n num">실적 {count(a.cat)}건</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
