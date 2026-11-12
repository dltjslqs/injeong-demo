import Link from "next/link";
import { BASE } from "./base";

const fields = [
  {
    img: "p12",
    title: "교육시설",
    desc: "초·중·고 강당과 교실, 대학 시설을 지었습니다. 학기 중 공사가 많아 학생 동선과 안전을 먼저 나눕니다.",
    points: ["다목적강당 개축·증축", "교실 증축·개축", "대학 승강기·시설 개선"],
  },
  {
    img: "p03",
    title: "공공·군 시설",
    desc: "박물관, 체육센터, 공공기관 사옥과 군 시설을 시공했습니다. 관급 공사의 서류와 검측 절차에 익숙합니다.",
    points: ["문화·체육시설 건립", "공공기관 사옥 신축", "군 창고·교회·검사장 신축"],
  },
  {
    img: "p18",
    title: "산업시설",
    desc: "공장과 자재창고를 신축·증축합니다. 한 기업이 2008년부터 11번 공사를 맡겼습니다.",
    points: ["공장 신축·증축", "자재창고 증축", "가동 중인 사업장 내 공사"],
  },
  {
    img: "p07",
    title: "민간건축·실내건축",
    desc: "교회, 근린생활시설, 다가구주택을 짓고, 실내건축공사업으로 리모델링과 시설 개선까지 맡습니다.",
    points: ["종교시설 신축·증축", "근생·다가구주택 신축", "실내건축·시설 개선"],
  },
];

export function Business({ summary = false }: { summary?: boolean }) {
  return (
    <section className="sec" id="business">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">학교부터 공장까지, 인정건설이 짓는 건물</h2>
            <p className="lede rv">건축공사업과 실내건축공사업 면허로 공공과 민간 공사를 모두 시공합니다.</p>
          </div>
          {summary && <Link className="link rv" href="/business">사업 분야 자세히</Link>}
        </div>
        <div className="svc four">
          {fields.map((f) => (
            <article className="rv" key={f.title}>
              <div className="im"><img src={`${BASE}/sites/injeong/works/${f.img}.jpg`} alt={`${f.title} 시공 사례`} width={1800} height={1344} loading="lazy" decoding="async" /></div>
              <div className="bd">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul>{f.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <Link className="link" href="/projects">관련 실적 보기</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
