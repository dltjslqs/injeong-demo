import Link from "next/link";
import { BASE } from "./base";
import { categories, company, projects } from "./data";

// The record itself is the hero: the latest completed projects, newest first.
const rows = projects.filter((p) => !p.ongoing && p.img && !p.imgNote).slice(0, 5);
const label = (cat: string) => categories.find((c) => c.key === cat)?.label ?? cat;

export function HeroIndex() {
  return (
    <section className="hx">
      <div className="container">
        <div className="hx-head">
          <h1>1989년부터<br />충남을 짓습니다</h1>
          <div className="hx-side">
            <p className="lead">학교와 관공서, 군 시설과 공장을 짓는 홍성의 종합건설사입니다.</p>
            <div className="acts">
              <Link className="btn btn-seal" href="/contact">견적 문의</Link>
              <a className="btn btn-quiet num" href={`tel:${company.tel}`}>{company.tel}</a>
            </div>
          </div>
        </div>
        <ol className="hx-list" aria-label="최근 준공 실적">
          {rows.map((p) => (
            <li key={p.id}>
              <Link href="/projects">
                <img src={`${BASE}/sites/injeong/works/${p.img}.jpg`} alt="" width={160} height={106} />
                <time className="num">{p.done}</time>
                <span className="nm">{p.name}</span>
                <span className="cl">{p.client}</span>
                <span className="ct">{label(p.cat)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
