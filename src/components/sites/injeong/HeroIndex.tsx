import Link from "next/link";
import { BASE } from "./base";
import { categories, company, projects } from "./data";

const done = projects.filter((p) => !p.ongoing).length;

// The record: the latest completed projects, newest first.
const rows = projects.filter((p) => !p.ongoing && p.img && !p.imgNote).slice(0, 5);
const label = (cat: string) => categories.find((c) => c.key === cat)?.label ?? cat;
const caption = (p: (typeof projects)[number]) => `${p.name}, ${p.done.slice(0, 4)}년 준공`;

export function HeroIndex() {
  const v = `${BASE}/sites/injeong`;
  return (
    <section className="hv" aria-label="인정건설 소개">
      <div className="hv-pics" style={{ backgroundImage: `url(${v}/hero-poster.jpg)` }}>
        {/* decorative footage: muted, looping, paused for reduced motion by Behaviors */}
        <video className="hv-vid" autoPlay muted loop playsInline preload="auto" poster={`${v}/hero-poster.jpg`} aria-hidden="true">
          <source src={`${v}/hero-m.mp4`} type="video/mp4" media="(max-width: 48rem)" />
          <source src={`${v}/hero.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className="container hv-in">
        <h1><span>1989년부터</span><br /><span>충남을 짓습니다</span></h1>
        <p className="lead">학교와 관공서, 군 시설과 공장을 짓는 홍성의 종합건설사입니다.</p>
        <div className="acts">
          <Link className="btn btn-seal" href="/contact">견적 문의</Link>
          <a className="btn ghost num" href={`tel:${company.tel}`}>{company.tel}</a>
        </div>
        <div className="hv-foot">
          <dl className="hv-facts">
            <div><dt>건설업</dt><dd className="num">{company.since}년부터</dd></div>
            <div><dt>{company.capacity.year} 시공능력평가</dt><dd className="num">{company.capacity.amount}</dd></div>
            <div><dt>준공 실적</dt><dd className="num">{done}건</dd></div>
          </dl>
          <button type="button" className="hv-pause" aria-label="배경 영상 멈춤">멈춤</button>
        </div>
      </div>
    </section>
  );
}

export function RecentList() {
  return (
    <section className="recent">
      <div className="container">
        <div className="head">
          <h2 className="rv">최근 준공한 현장</h2>
          <Link className="link" href="/projects">시공 실적 전체 보기</Link>
        </div>
        <ol className="hx-list" aria-label="최근 준공 실적">
          {rows.map((p) => (
            <li key={p.id}>
              <Link href="/projects">
                <img src={`${BASE}/sites/injeong/works/${p.img}.jpg`} alt="" width={160} height={106} loading="lazy" />
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
