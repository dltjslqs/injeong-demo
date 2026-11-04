import Link from "next/link";
import { BASE } from "./base";
import type { Block, Column } from "./columns";
import { company, type Project, projectImg } from "./data";

export const COLUMN_DATE = "2026.11";
export const COLUMN_AUTHOR = "인정건설 김병철 이사";

/** The photo a column opens with: its first picture. */
export const coverOf = (c: Column) => {
  if (c.coverUrl) return c.coverUrl;
  if (c.cover) return `${BASE}/sites/injeong/cols/${c.cover}.jpg`;
  const pic = c.blocks.find((b) => b.t === "pic") as { src: string } | undefined;
  if (pic) return pic.src;
  const id = (c.blocks.find((b) => b.t === "img") as { id: string } | undefined)?.id ?? "p18";
  return `${BASE}/sites/injeong/works/${id}.jpg`;
};

function Pic({ id, projects }: { id: string; projects: Project[] }) {
  const p = projects.find((x) => x.id === id);
  if (!p || !projectImg(p)) return null;
  return (
    <figure className="art-pic">
      <img src={projectImg(p)} alt={p.name} width={1800} height={1018} loading="lazy" />
      <figcaption>{p.name}, {p.done.slice(0, 4)}년 준공</figcaption>
    </figure>
  );
}

function Ask({ lead }: { lead: string }) {
  return (
    <aside className="art-ask">
      <p>{lead}<br />인정건설에 연락 주세요.</p>
      <div className="btns">
        <Link className="btn btn-seal" href="/contact">견적 문의</Link>
        <a className="btn line num" href={`tel:${company.tel}`}>{company.tel}</a>
      </div>
    </aside>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="art-tbl" role="region" aria-label={head.join(", ")} tabIndex={0}>
      <table>
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Part({ b, last, projects }: { b: Block; last: boolean; projects: Project[] }) {
  switch (b.t) {
    case "p": return <p className={last ? "art-end" : undefined}>{b.x}</p>;
    case "q": return <p className="art-q">{b.x}</p>;
    case "h2": return <h2>{b.x}</h2>;
    case "ask": return <Ask lead={b.x} />;
    case "img": return <Pic id={b.id} projects={projects} />;
    case "pic": return <figure className="art-pic"><img src={b.src} alt={b.cap ?? ""} loading="lazy" />{b.cap && <figcaption>{b.cap}</figcaption>}</figure>;
    case "cover": return <figure className="art-pic"><img src={`${BASE}/sites/injeong/cols/${b.src}.jpg`} alt="" width={1536} height={864} /></figure>;
    case "h3": return <h3>{b.x}</h3>;
    case "ul": return <ul className="art-list">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case "ol": return <ol className="art-list num-list">{b.items.map((x) => <li key={x}>{x}</li>)}</ol>;
    case "table": return <Table head={b.head} rows={b.rows} />;
  }
}

export function ColumnArticle({ c, columns, projects }: { c: Column; columns: Column[]; projects: Project[] }) {
  const i = columns.findIndex((x) => x.slug === c.slug);
  const prev = columns[i - 1];
  const next = columns[i + 1];
  // the closing line is the last paragraph before the final call-to-action
  const lastP = c.blocks.map((b) => b.t).lastIndexOf("p");
  return (
    <article className="art">
      <header className="art-hd">
        <div className="container">
          <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><Link href="/notes">기술 칼럼</Link></nav>
          <h1>{c.title}</h1>
          <p className="art-sub">{c.sub}</p>
          <p className="meta">{c.series ? `${c.cat} ${c.series}편` : c.cat}, {c.date ?? COLUMN_DATE}, {COLUMN_AUTHOR}</p>
        </div>
      </header>
      <div className="container art-body">
        {c.blocks.map((b, k) => <Part key={k} b={b} last={k === lastP} projects={projects} />)}
        <nav className="art-nav" aria-label="다른 칼럼">
          {prev ? <Link href={`/notes/${prev.slug}`}><span>이전 칼럼</span><b>{prev.title}</b></Link> : <span />}
          {next ? <Link href={`/notes/${next.slug}`} className="nx"><span>다음 칼럼</span><b>{next.title}</b></Link> : <span />}
        </nav>
        <p className="art-back"><Link className="link" href="/notes">기술 칼럼 목록으로</Link></p>
      </div>
    </article>
  );
}
