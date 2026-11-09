import Link from "next/link";
import { BASE } from "./base";
import { COLUMN_DATE, coverOf } from "./ColumnArticle";
import { getColumns } from "@/lib/injeong/content";
import { NotesFeed, type FeedItem } from "./NotesFeed";
import type { Column } from "./columns";


// 기초자료 작성표 5번 「건축 칼럼 주제」에서 인정건설이 고른 주제, 아직 쓰지 않은 글
const planned = [
  { cat: "관급공사", title: "관급공사는 어떤 순서로 진행될까, 천안업성2초 현장 기록" },
  { cat: "인허가", title: "착공 전 건축주가 알아야 할 인허가·공정 체크리스트" },
  { cat: "공사관리", title: "건설사업관리 대상 현장, 시공사는 무엇을 준비하나" },
  { cat: "법령", title: "건설 관련 법령·표준시방서, 이번에 달라진 것" },
];

/** The series as photo cards: the first one large, the other four beside it. */
function SeriesCards({ items }: { items: Column[] }) {
  return (
    <ol className="sc-grid">
      {items.map((c, i) => (
        <li key={c.slug} className={i === 0 ? "sc-lead" : undefined}>
          <Link href={`/notes/${c.slug}`} className="sc">
            <span className="sc-pic"><img src={coverOf(c)} alt="" width={1536} height={864} loading="lazy" /></span>
            <span className="sc-no num">{String(c.series).padStart(2, "0")}</span>
            <span className="sc-t">{c.title}</span>
            {i === 0 && <span className="sc-sub">{c.sub}</span>}
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Home: the five-part series on how to tell a good builder. */
export async function NotesSummary() {
  const columns = await getColumns();
  const series = columns.filter((c) => c.series);
  return (
    <section className="notes">
      <div className="container">
        <div className="notes-head">
          <div>
            <h2>공사비를 절약하는 실무 인사이트</h2>
            <p className="lede">“평당 얼마인가요?”라는 질문 뒤에 숨겨진 추가 비용의 덫,<br className="br-pc" /> 건축주가 절대 손해 보지 않도록 현장 실무진이 솔직하게 짚어드립니다.</p>
          </div>
          <Link className="link" href="/notes">칼럼 {columns.length}편 모두 보기</Link>
        </div>
        <p className="sc-series">연재, 잘하는 시공사의 진짜 실력 {series.length}편</p>
        <SeriesCards items={series} />
      </div>
    </section>
  );
}

/** /notes: the series first, then every other column as a row, then the planned topics. */
// the article the feed leads with: the factory-estimate piece, the one most readers come for
const FEATURED = "factory-cost";
// feed covers for columns whose first picture repeats another's (mostly the same 동신 plant); the article itself is unchanged
const FEED_COVER: Record<string, string> = {
  "factory-cost": "works/area-industry.jpg",
  "factory-site": "hero-poster.jpg",
  "factory-layout": "works/case-3.jpg",
  "factory-handover": "works/why-3.jpg",
  "extension-permit": "works/why-1.jpg",
};

export async function NotesList() {
  const columns = await getColumns();
  const toItem = (c: Column): FeedItem => ({ slug: c.slug, title: c.title, sub: c.sub, cat: c.cat, date: c.date ?? COLUMN_DATE, cover: FEED_COVER[c.slug] ? `${BASE}/sites/injeong/${FEED_COVER[c.slug]}` : coverOf(c) });
  const lead = columns.find((c) => c.slug === FEATURED) ?? columns[0];
  const rest = columns.filter((c) => c.slug !== lead.slug);
  const cats = [...new Set(columns.map((c) => c.cat))];
  return (
    <section className="sec nf">
      <div className="container nf-in">
        <NotesFeed featured={toItem(lead)} items={rest.map(toItem)} cats={cats} />
        <div className="nf-plan">
          <h2>준비 중인 글</h2>
          <ul>
            {planned.map((n) => <li key={n.title}><span className="nf-plan-cat">{n.cat}</span><span>{n.title}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
