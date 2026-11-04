import Link from "next/link";
import { BASE } from "./base";
import { categories, company, projects, recordCount } from "./data";

const done = recordCount(projects.filter((p) => !p.ongoing).length);

// The record: what is being built now, then the latest completed projects.
const ongoing = projects.filter((p) => p.ongoing);
const rows = [...ongoing, ...projects.filter((p) => !p.ongoing && p.img && !p.imgNote).slice(0, 6 - ongoing.length)];
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
        <h1><span>37년 무사고 책임준공,</span><br /><span className="h1-sub">1989년부터 증명해 온 건축주의 파트너</span></h1>
        <p className="lead">깐깐한 교육청 시설부터 스마트 산업공장까지. 건축주의 눈높이에서 도면 너머 현장의 디테일까지 책임집니다.</p>
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
          <div>
            <h2 className="rv">최근 실적</h2>
            <p className="lede">지금 {ongoing.length}곳을 짓고 있고, 준공한 현장은 {done}곳입니다.</p>
          </div>
          <Link className="link" href="/projects">시공 실적 전체 보기</Link>
        </div>
        <ol className="rc-grid" aria-label="최근 실적">
          {rows.map((p) => (
            <li key={p.id}>
              <Link href="/projects" className="rc">
                <span className="rc-pic">
                  {p.img ? (
                    <img src={`${BASE}/sites/injeong/works/${p.img}.jpg`} alt="" width={800} height={600} loading="lazy" />
                  ) : (
                    <span className="rc-ph" aria-hidden="true"><img src={`${BASE}/sites/injeong/logo-mark.png`} alt="" width={376} height={256} /></span>
                  )}
                  <span className={p.ongoing ? "rc-tag now" : "rc-tag"}>{p.ongoing ? "시공 중" : <span className="num">{p.done} 준공</span>}</span>
                </span>
                <span className="rc-cl">{p.client}</span>
                <span className="rc-meta">{label(p.cat)}{p.ongoing ? `, ${p.period.split(" – ")[1]} 준공 예정` : ""}</span>
                <span className="rc-nm">{p.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
