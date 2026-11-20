import Link from "next/link";
import { BusinessTabs } from "./BusinessTabs";
import { coverOf } from "./ColumnArticle";
import { CtaBand } from "./CtaBand";
import { type Category, company, projectAlt, projectImg } from "./data";
import { groups } from "./Faq";
import { company as companyRef, crumbs, itemList, JsonLd, webPage } from "./JsonLd";
import { PageHead } from "./PageHead";
import { getColumns, getProjects } from "@/lib/injeong/content";
import { ORIGIN } from "@/lib/injeong/site";
import { Photo } from "./Photo";

/** One field of 사업 분야 (교육시설, 공공·군 시설, 민간·실내건축). 산업시설 has its own page, /business/factory. */
export type Field = {
  path: string; // "/business/education"
  label: string; // tab and breadcrumb name
  seoTitle: string; // <title>, with the region people search for
  heading: string;
  desc: string; // under the heading
  description: string; // search description
  img: string; // works/<id>.jpg
  cats: Category[];
  contactType: string; // 견적 문의 공사 종류
  how: { title: string; lead: string; points: string[] };
  fig?: { n: string; unit: string; label: string }; // second figure; default: the year the first one was done
  cta: string; // closing line for this field's readers
  faq: string[]; // questions picked from the 견적 문의 FAQ, by wording
  columns: string[]; // column slugs worth reading
};

export async function FieldPage({ f }: { f: Field }) {
  const projects = (await getProjects()).filter((p) => f.cats.includes(p.cat));
  const done = projects.filter((p) => !p.ongoing);
  const ongoing = projects.filter((p) => p.ongoing);
  const since = done.reduce((y, p) => Math.min(y, Number(p.done.slice(0, 4)) || y), 9999);
  const withPic = projects.filter((p) => projectImg(p)).slice(0, 6);
  const clients = new Set(done.map((p) => p.client)).size;
  const qa = (await groups()).flatMap((g) => g.items).filter((x) => f.faq.includes(x.q));
  const all = await getColumns();
  const cols = f.columns.map((s) => all.find((c) => c.slug === s)).filter((c) => c !== undefined);
  const service = { "@type": "Service", "@id": `${ORIGIN}${f.path}#service`, name: `${f.label} 공사`, serviceType: f.label, provider: companyRef, areaServed: { "@type": "AdministrativeArea", name: "충청남도" } };
  const faqLd = qa.length ? [{ "@type": "FAQPage", mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) }] : [];
  const contact = `/contact?type=${encodeURIComponent(f.contactType)}`;
  return (
    <>
      <JsonLd nodes={[webPage("WebPage", f.path, f.label, f.description, { mainEntity: service }), itemList(projects.map((p) => ({ name: p.name }))), ...faqLd, crumbs([["사업 분야", "/business"], [f.label, f.path]])]} />
      <PageHead en="BUSINESS" title={f.label} heading={f.heading} desc={f.desc} img={f.img} />
      <BusinessTabs />

      <section className="fx-band">
        <div className="container">
          <div className="fx-panel rv">
          <ul className="fx-figs">
            <li><b className="num">{projects.length}<small>건</small></b><span>{f.label} 실적{ongoing.length ? `, 이 중 ${ongoing.length}곳 시공 중` : ""}</span></li>
            {f.fig
              ? <li><b className="num">{f.fig.n}<small>{f.fig.unit}</small></b><span>{f.fig.label}</span></li>
              : <li><b className="num">{since}<small>년</small></b><span>첫 {f.label} 준공, 발주처 {clients}곳</span></li>}
            <li><b className="num">{company.capacity.amount.replace("억", "")}<small>억</small></b><span>{company.capacity.year} 시공능력평가 ({company.capacity.rankRegion})</span></li>
          </ul>
          <div className="btns fx-act">
            <Link className="btn cta" href={contact}>{f.label} 견적 문의</Link>
            <a className="btn line num" href={`tel:${company.tel}`}>{company.tel}</a>
          </div>
            <ul className="fx-cred">
              <li>기업신용평가 <b>{company.credit.grade}</b> <span>{company.credit.agency}, {company.credit.until}까지</span></li>
              <li>등록 기술자 <b>{company.engineers}명</b></li>
              <li>특급 기술자 <b>{company.crew.find((c) => c.label === "특급 기술자")?.count}명</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sec soft" id="works">
        <div className="container">
          <div className="head">
            <div>
              <h2 className="h2 rv">이런 건물을 지었습니다</h2>
              <p className="lede rv">{f.label} {projects.length}건입니다. 발주처와 연면적을 그대로 적었습니다. 공사 금액은 확인된 것만 적었습니다.</p>
            </div>
            <Link className="link rv" href={`/projects?cat=${encodeURIComponent(f.cats[0])}#works`}>시공 실적에서 보기</Link>
          </div>
          {withPic.length > 0 && (
            <div className="pf">
              {withPic.map((w) => (
                <article className="rv" key={w.id}>
                  <div className="im"><Photo src={projectImg(w)} alt={projectAlt(w)} width={1800} height={1344} loading="lazy" decoding="async" /></div>
                  <div className="bd">
                    <h3>{w.name}</h3>
                    <dl>
                      <dt>발주처</dt><dd title={w.client}>{w.client}</dd>
                      <dt>규모</dt><dd title={w.scale}>{w.scale || "—"}</dd>
                      <dt>연면적</dt><dd className="num">{w.area ?? "—"}</dd>
                      <dt>공사비</dt><dd className="num">{w.cost ?? "—"}</dd>
                      <dt>준공</dt><dd className="num">{w.ongoing ? "시공 중" : w.done}</dd>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="rl">
            <h3 className="rl-h">{f.label} 실적 전체</h3>
            <div className="rl-wrap">
              <table>
                <thead><tr><th scope="col">준공</th><th scope="col">공사명</th><th scope="col">발주처</th><th scope="col">규모</th><th scope="col">연면적</th></tr></thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="num">{p.ongoing ? "시공 중" : p.done}</td>
                      <th scope="row">{p.name}</th>
                      <td>{p.client}</td>
                      <td>{p.scale}</td>
                      <td className="num">{p.area ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="container fx-live">
          <div>
            <h2 className="h2 rv">{f.how.title}</h2>
            <p className="lede rv">{f.how.lead}</p>
          </div>
          <ul className="fx-list fx-points rv">
            {f.how.points.map((x) => <li key={x}><b>{x}</b></li>)}
          </ul>
        </div>
      </section>

      {qa.length > 0 && (
        <section className="sec soft" id="faq">
          <div className="container fq">
            <div className="fq-side">
              <h2 className="h2 rv">상담 전에 많이<br />물어보시는 것들</h2>
              <div className="ask rv">
                <b>더 궁금하신 점은 전화로</b>
                <a className="num" href={`tel:${company.tel}`}>{company.tel}</a>
                <span>{company.hours.days} {company.hours.open}~{company.hours.close}</span>
              </div>
            </div>
            <div>
              {qa.map((x) => (
                <details className="rv" key={x.q}>
                  <summary><span className="q">Q</span><span className="t">{x.q}</span><span className="pm" aria-hidden="true" /></summary>
                  <div className="a">
                    <p>{x.a}</p>
                    {x.more && <Link className="fq-more" href={x.more.href}>{x.more.label}</Link>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {cols.length > 0 && (
        <section className="sec">
          <div className="container">
            <div className="head">
              <div><h2 className="h2 rv">짓기 전에 읽어 볼 칼럼</h2></div>
              <Link className="link rv" href="/notes">기술 칼럼 전체</Link>
            </div>
            <ul className="nf-grid nf-swipe">
              {cols.map((c) => (
                <li key={c.slug}>
                  <Link href={`/notes/${c.slug}`} className="nf-card">
                    <span className="nf-pic"><Photo src={coverOf(c)} alt={`${c.title} 대표 이미지`} width={800} height={500} loading="lazy" /></span>
                    <span className="nf-meta"><span>{c.cat}</span></span>
                    <b className="nf-t">{c.title}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand sub={f.cta} href={contact} />
    </>
  );
}
