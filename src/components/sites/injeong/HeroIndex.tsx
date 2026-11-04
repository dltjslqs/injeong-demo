import Link from "next/link";
import { BASE } from "./base";
import { categories, company, projects } from "./data";

// Four finished buildings, one per kind of client, shown full screen behind the headline.
const SLIDES = ["p03", "p12", "p18", "p02"];
const slides = SLIDES.map((id) => projects.find((p) => p.id === id)!).filter(Boolean);
const done = projects.filter((p) => !p.ongoing).length;

// The record: the latest completed projects, newest first.
const rows = projects.filter((p) => !p.ongoing && p.img && !p.imgNote).slice(0, 5);
const label = (cat: string) => categories.find((c) => c.key === cat)?.label ?? cat;
const caption = (p: (typeof projects)[number]) => `${p.name}, ${p.done.slice(0, 4)}년 준공`;

export function HeroIndex() {
  return (
    <section className="hv" aria-label="인정건설 소개">
      <div className="hv-pics">
        {slides.map((p, i) => (
          <img
            key={p.id}
            className={i === 0 ? "hv-pic on" : "hv-pic"}
            src={`${BASE}/sites/injeong/works/${p.img}.jpg`}
            alt=""
            width={1800}
            height={1018}
            data-cap={caption(p)}
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}
      </div>
      <div className="container hv-in">
        <h1>1989년부터<br />충남을 짓습니다</h1>
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
          <div className="hv-ctl">
            <p className="hv-cap">{caption(slides[0])}</p>
            <div className="hv-nums">
              {slides.map((p, i) => (
                <button key={p.id} type="button" className={i === 0 ? "on" : undefined} aria-label={`${i + 1}번 사진: ${p.name}`} aria-pressed={i === 0}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
              <button type="button" className="hv-pause" aria-label="사진 넘기기 멈춤">멈춤</button>
            </div>
          </div>
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
