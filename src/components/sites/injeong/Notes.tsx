import Link from "next/link";
import { BASE } from "./base";
import { COLUMN_DATE, coverOf } from "./ColumnArticle";
import { getColumns, getStories } from "@/lib/injeong/content";
import { NotesFeed, type FeedItem } from "./NotesFeed";
import type { Column } from "./columns";
import { Photo } from "./Photo";


// 기초자료 작성표 5번 「건축 칼럼 주제」에서 인정건설이 고른 주제, 아직 쓰지 않은 글
const planned = [
  { cat: "관급공사", title: "관급공사는 어떤 순서로 진행될까, 초등학교 신축 현장 기록" },
  { cat: "인허가", title: "착공 전 건축주가 알아야 할 인허가·공정 체크리스트" },
  { cat: "공사관리", title: "건설사업관리 대상 현장, 시공사는 무엇을 준비하나" },
  { cat: "법령", title: "건설 관련 법령·표준시방서, 이번에 달라진 것" },
];

// home: the column most readers come for, then four that follow the order of the work (공장 first, the field the company sells)
const HOME_PICKS = ["factory-site", "extension-live", "extension-cost", "builder-check"];
const pic = (src: string) => (src.startsWith("/sites/") ? `${BASE}${src}` : src);
const dot = (d: string) => d.replaceAll("-", ".");

/** Home: 기술 칼럼 (one featured, four as a list) beside the two newest 회사 이야기. */
export async function NotesSummary() {
  const columns = await getColumns();
  const stories = (await getStories()).slice(0, 2);
  const lead = columns.find((c) => c.slug === FEATURED) ?? columns[0];
  const picks = HOME_PICKS.map((s) => columns.find((c) => c.slug === s)).filter((c): c is Column => c !== undefined && c.slug !== lead.slug);
  const leadCover = coverOf(lead);
  return (
    <section className="notes hn">
      <div className="container">
        <div className="hn-head">
          <h2 className="h2 rv">짓기 전에 읽고, 짓는 현장을 봅니다</h2>
          <p className="lede rv">건축주가 공사 전에 알아 둘 것은 기술 칼럼으로, 현장에서 있었던 일은 회사 이야기로 전합니다.</p>
        </div>
        <div className="hn-grid">
          <div className="hn-cols">
            <div className="hn-sub rv">
              <h3>기술 칼럼</h3>
              <Link className="link" href="/notes">칼럼 {columns.length}편 모두 보기</Link>
            </div>
            <Link href={`/notes/${lead.slug}`} className="hn-lead rv">
              <span className="hn-lead-pic"><Photo src={leadCover} alt={`${lead.title} 대표 이미지`} width={1800} height={1344} loading="lazy" sizes="(max-width: 900px) 100vw, 420px" /></span>
              <span className="hn-lead-bd">
                <span className="hn-cat">{lead.cat}</span>
                <b className="hn-lead-t">{lead.title}</b>
                <span className="hn-lead-s">{lead.summary ?? lead.sub}</span>
                <span className="hn-more">읽어 보기</span>
              </span>
            </Link>
            <ul className="hn-list rv">
              {picks.map((c) => (
                <li key={c.slug}>
                  <Link href={`/notes/${c.slug}`}>
                    <span className="hn-cat">{c.cat}</span>
                    <b>{c.title}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hn-stories">
            <div className="hn-sub rv">
              <h3>회사 이야기</h3>
              <Link className="link" href="/about/stories">모두 보기</Link>
            </div>
            <ul className="hn-st">
              {stories.map((x) => (
                <li key={x.id} className="rv">
                  <Link href={`/about/stories/${x.id}`}>
                    <span className="hn-st-pic"><Photo src={pic(x.cover)} alt={x.title} width={1800} height={1200} loading="lazy" sizes="(max-width: 900px) 100vw, 380px" /></span>
                    <span className="hn-st-meta"><span className="hn-cat">{x.cat}</span><span className="num">{dot(x.date)}</span></span>
                    <b>{x.title}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** /notes: the series first, then every other column as a row, then the planned topics. */
// the article the feed leads with: the factory-estimate piece, the one most readers come for
const FEATURED = "factory-cost";

export async function NotesList() {
  const columns = await getColumns();
  const toItem = (c: Column): FeedItem => ({ slug: c.slug, title: c.title, sub: c.sub, cat: c.cat, date: c.date ?? COLUMN_DATE, cover: coverOf(c) });
  const lead = columns.find((c) => c.slug === FEATURED) ?? columns[0];
  // newest first, by the date each column went up
  const rest = columns.filter((c) => c.slug !== lead.slug).sort((a, b) => (b.date ?? COLUMN_DATE).localeCompare(a.date ?? COLUMN_DATE));
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
