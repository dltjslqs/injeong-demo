import Link from "next/link";
import { BASE } from "./base";
import type { Block, Column } from "./columns";
import { company, type Project, projectImg } from "./data";
import type { Author } from "@/lib/injeong/content";
import { CopyLink } from "./CopyLink";

export const COLUMN_DATE = "2026.11";

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

/** Text with **bold** runs from the editor. */
function Rich({ x }: { x: string }) {
  const parts = x.split(/(\*\*[^*]+\*\*)/);
  return <>{parts.map((t, i) => (/^\*\*[^*]+\*\*$/.test(t) ? <strong key={i}>{t.slice(2, -2)}</strong> : t))}</>;
}

function Ask({ lead }: { lead: string }) {
  return (
    <aside className="art-ask">
      <p>{lead}<br />인정건설에 연락 주세요.</p>
      <div className="btns">
        <Link className="btn btn-seal" href="/contact">지금 바로 문의하기</Link>
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
        <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} scope="row"><Rich x={c} /></th> : <td key={i}><Rich x={c} /></td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Part({ b, k, last, projects }: { b: Block; k: number; last: boolean; projects: Project[] }) {
  switch (b.t) {
    case "p": return <p className={last ? "art-end" : undefined}><Rich x={b.x} /></p>;
    case "q": return <p className="art-q"><Rich x={b.x} /></p>;
    case "h2": return <h2 id={`s${k}`}>{b.x}</h2>;
    case "ask": return <Ask lead={b.x} />;
    case "img": return <Pic id={b.id} projects={projects} />;
    case "pic": return <figure className="art-pic"><img src={b.src} alt={b.cap ?? ""} loading="lazy" />{b.cap && <figcaption>{b.cap}</figcaption>}</figure>;
    case "cover": return <figure className="art-pic"><img src={`${BASE}/sites/injeong/cols/${b.src}.jpg`} alt="" width={1536} height={864} /></figure>;
    case "h3": return <h3>{b.x}</h3>;
    case "ul": return <ul className="art-list">{b.items.map((x) => <li key={x}><Rich x={x} /></li>)}</ul>;
    case "ol": return <ol className="art-list num-list">{b.items.map((x) => <li key={x}><Rich x={x} /></li>)}</ol>;
    case "table": return <Table head={b.head} rows={b.rows} />;
  }
}

/** Minutes to read: Korean prose at about 500 characters a minute. */
export function readMinutes(c: Column) {
  const text = c.blocks.map((b) => ("x" in b ? b.x : "items" in b ? b.items.join(" ") : "rows" in b ? b.rows.flat().join(" ") : "")).join(" ");
  return Math.max(1, Math.round(text.replace(/\s+/g, "").length / 500));
}

// which projects show under a column, by the column's category
const PROJECT_CATS: Record<string, string[]> = {
  "공장 신축": ["산업"],
  "공장 증축": ["산업"],
  "오피스텔·사무용 건물": ["공공", "민간"],
  "시공사 고르기": ["산업", "공공", "교육"],
};

export function ColumnArticle({ c, columns, projects, author }: { c: Column; columns: Column[]; projects: Project[]; author: Author }) {
  const i = columns.findIndex((x) => x.slug === c.slug);
  const prev = columns[i - 1];
  const next = columns[i + 1];
  // the closing line is the last paragraph before the final call-to-action
  const lastP = c.blocks.map((b) => b.t).lastIndexOf("p");
  const toc = c.blocks.map((b, k) => (b.t === "h2" ? { k, x: b.x } : null)).filter((x) => x !== null);
  // more to read: the same category first, then the newest of the rest
  const others = columns.filter((x) => x.slug !== c.slug);
  const related = [...others.filter((x) => x.cat === c.cat), ...others.filter((x) => x.cat !== c.cat)].slice(0, 3);
  // projects of the kind the column is about, newest first, ones with a picture
  const cats = PROJECT_CATS[c.cat] ?? ["산업", "공공"];
  const built = projects.filter((p) => !p.ongoing && cats.includes(p.cat) && projectImg(p)).slice(0, 3);
  return (
    <article className="art">
      <header className="art-hd">
        <div className="container">
          <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><Link href="/notes">기술 칼럼</Link></nav>
          <h1>{c.title}</h1>
          <p className="art-sub">{c.sub}</p>
          <div className="art-by">
            {author.photoUrl ? <img src={author.photoUrl} alt="" width={56} height={56} /> : <span className="art-by-ph" aria-hidden="true">{author.name.slice(0, 1)}</span>}
            <span>
              <b>{author.name}</b>{author.role && <span className="art-by-role">{author.role}</span>}
              <span className="art-by-meta">{c.series ? `${c.cat} ${c.series}편` : c.cat}<span className="num">{c.date ?? COLUMN_DATE}</span><span>{readMinutes(c)}분 읽기</span></span>
            </span>
            <CopyLink />
          </div>
        </div>
      </header>
      <div className="container art-body">
        {toc.length > 2 && (
          <nav className="art-toc" aria-label="이 글의 순서">
            <p>이 글의 순서</p>
            <ol>
              {toc.map((t) => <li key={t.k}><a href={`#s${t.k}`}>{t.x.replace(/^\d+\.\s*/, "")}</a></li>)}
            </ol>
          </nav>
        )}
        {c.blocks.map((b, k) => <Part key={k} b={b} k={k} last={k === lastP} projects={projects} />)}
        {built.length > 0 && (
          <section className="art-built" aria-labelledby="art-built-h">
            <h2 id="art-built-h">이런 현장을 직접 지었습니다</h2>
            <ul>
              {built.map((p) => (
                <li key={p.id}>
                  <span className="art-built-pic"><img src={projectImg(p)} alt="" width={600} height={450} loading="lazy" /></span>
                  <b>{p.name}</b>
                  <span className="num">{p.done.slice(0, 4)}년 준공{p.area ? `, 연면적 ${p.area}` : ""}</span>
                </li>
              ))}
            </ul>
            <Link className="link" href="/projects">시공 실적 전체 보기</Link>
          </section>
        )}
        <nav className="art-nav" aria-label="다른 칼럼">
          {prev ? <Link href={`/notes/${prev.slug}`}><span>이전 칼럼</span><b>{prev.title}</b></Link> : <span />}
          {next ? <Link href={`/notes/${next.slug}`} className="nx"><span>다음 칼럼</span><b>{next.title}</b></Link> : <span />}
        </nav>
        <section className="art-more" aria-labelledby="art-more-h">
          <h2 id="art-more-h">함께 읽으면 좋은 칼럼</h2>
          <ul>
            {related.map((x) => (
              <li key={x.slug}>
                <Link href={`/notes/${x.slug}`}>
                  <span className="art-more-pic"><img src={coverOf(x)} alt="" width={800} height={500} loading="lazy" /></span>
                  <span className="art-more-cat">{x.cat}</span>
                  <b>{x.title}</b>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="art-back"><Link className="link" href="/notes">기술 칼럼 목록으로</Link></p>
      </div>
    </article>
  );
}
