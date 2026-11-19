import Link from "next/link";
import { BASE } from "./base";
import { Photo } from "./Photo";

// each field has its own page under 사업 분야
export const FIELD_PAGE: Record<string, string> = { 교육: "/business/education", 공공: "/business/public", 군: "/business/public", 산업: "/business/factory", 민간: "/business/private" };

export const fields = [
  {
    img: "p18",
    title: "산업시설",
    cat: "산업",
    desc: "공장과 자재창고를 신축·증축합니다. 한 기업이 2008년부터 11번 공사를 맡겼습니다.",
    points: ["공장 신축·증축", "자재창고 증축", "가동 중인 사업장 내 공사"],
  },
  {
    img: "p07",
    title: "민간·실내건축",
    cat: "민간",
    desc: "교회, 근린생활시설, 다가구주택을 짓고, 실내건축공사업으로 리모델링과 시설 개선까지 맡습니다.",
    points: ["종교시설 신축·증축", "근린생활시설·다가구주택 신축", "실내건축·시설 개선"],
  },
  {
    img: "p03",
    title: "공공·군 시설",
    cat: "공공",
    desc: "박물관, 체육센터, 공공기관 사옥과 군 시설을 시공했습니다. 관급 공사의 서류와 검측 절차에 익숙합니다.",
    points: ["문화·체육시설 건립", "공공기관 사옥 신축", "군 창고·교회·검사장 신축"],
  },
  {
    img: "p12",
    title: "교육시설",
    cat: "교육",
    desc: "초·중·고 강당과 교실, 대학 시설을 지었고, 지금은 초등학교를 신축하고 있습니다. 학기 중 공사가 많아 학생 동선과 안전을 먼저 나눕니다.",
    points: ["초등학교 교사 신축", "다목적강당 개축·증축", "교실 증축·개축", "대학 승강기·시설 개선"],
  },
];

export function Business({ summary = false }: { summary?: boolean }) {
  return (
    <section className="sec" id="business">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">공장부터 학교까지, 인정건설이 짓는 건물</h2>
            <p className="lede rv">건축공사업과 실내건축공사업 면허로 공공과 민간 공사를 모두 시공합니다.</p>
          </div>
          {summary && <Link className="link rv" href="/business">사업 분야 자세히 보기</Link>}
        </div>
        <div className="svc four">
          {fields.map((f) => (
            <article className="rv" key={f.title}>
              <div className="im"><Photo src={`${BASE}/sites/injeong/works/${f.img}.jpg`} alt={`${f.title} 시공 사례`} width={1800} height={1344} loading="lazy" decoding="async" /></div>
              <div className="bd">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul>{f.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <Link className="link" href={FIELD_PAGE[f.cat]}>{f.title} 자세히 보기</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
