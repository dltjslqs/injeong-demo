import Link from "next/link";
import { BASE } from "./base";
import { type Block, type Column, columns } from "./columns";
import { company, projects } from "./data";

export const COLUMN_DATE = "2026.11";
export const COLUMN_AUTHOR = "인정건설 김병철 이사";

/** The photo a column opens with: its first picture. */
export const coverOf = (c: Column) => (c.blocks.find((b) => b.t === "img") as { id: string } | undefined)?.id ?? "p18";

function Pic({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id);
  if (!p?.img) return null;
  return (
    <figure className="art-pic">
      <img src={`${BASE}/sites/injeong/works/${p.img}.jpg`} alt={p.name} width={1800} height={1018} loading="lazy" />
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

function Part({ b, last }: { b: Block; last: boolean }) {
  switch (b.t) {
    case "p": return <p className={last ? "art-end" : undefined}>{b.x}</p>;
    case "q": return <p className="art-q">{b.x}</p>;
    case "h2": return <h2>{b.x}</h2>;
    case "ask": return <Ask lead={b.x} />;
    case "img": return <Pic id={b.id} />;
    case "table": return <Table head={b.head} rows={b.rows} />;
  }
}

export function ColumnArticle({ c }: { c: Column }) {
  const i = columns.indexOf(c);
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
          <p className="meta">{c.cat}, {COLUMN_DATE}, {COLUMN_AUTHOR}</p>
        </div>
      </header>
      <div className="container art-body">
        {c.blocks.map((b, k) => <Part key={k} b={b} last={k === lastP} />)}
        <nav className="art-nav" aria-label="다른 칼럼">
          {prev ? <Link href={`/notes/${prev.slug}`}><span>이전 칼럼</span><b>{prev.title}</b></Link> : <span />}
          {next ? <Link href={`/notes/${next.slug}`} className="nx"><span>다음 칼럼</span><b>{next.title}</b></Link> : <span />}
        </nav>
        <p className="art-back"><Link className="link" href="/notes">기술 칼럼 목록으로</Link></p>
      </div>
    </article>
  );
}
