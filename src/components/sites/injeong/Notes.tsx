import Link from "next/link";
import { COLUMN_DATE, coverOf } from "./ColumnArticle";
import { type Column, columns } from "./columns";

const series = columns.filter((c) => c.series);
const others = columns.filter((c) => !c.series);

// 기초자료 작성표 5번 「건축 칼럼 주제」에서 인정건설이 고른 주제, 아직 쓰지 않은 글
const planned = [
  { cat: "관급공사", title: "관급공사는 어떤 순서로 진행될까, 천안업성2초 현장 기록" },
  { cat: "인허가", title: "착공 전 건축주가 알아야 할 인허가·공정 체크리스트" },
  { cat: "공사관리", title: "건설사업관리 대상 현장, 시공사는 무엇을 준비하나" },
  { cat: "법령", title: "건설 관련 법령·표준시방서, 이번에 달라진 것" },
];

function Meta({ cat, date }: { cat: string; date: string }) {
  return <p className="meta">{cat}, {date}</p>;
}

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
export function NotesSummary() {
  return (
    <section className="notes">
      <div className="container">
        <div className="notes-head">
          <div>
            <h2>공사비를 절약하는 실무 인사이트</h2>
            <p className="lede">“평당 얼마인가요?”라는 질문 뒤에 숨겨진 추가 비용의 덫. 건축주가 절대 손해 보지 않도록 현장 실무진이 솔직하게 짚어드립니다.</p>
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
export function NotesList() {
  return (
    <section className="sec">
      <div className="container">
        <h2 className="nser-h">연재, 잘하는 시공사의 진짜 실력</h2>
        <SeriesCards items={series} />
        <h2 className="nser-h nser-gap">공장과 건물, 공사비 칼럼</h2>
        <ul className="nrows">
          {others.map((n) => (
            <li key={n.slug}>
              <h3><Link href={`/notes/${n.slug}`}>{n.title}</Link></h3>
              <p>{n.sub}</p>
              <Meta cat={n.cat} date={COLUMN_DATE} />
            </li>
          ))}
        </ul>
        <h2 className="nplan-h">연재 예정</h2>
        <ul className="nplan">
          {planned.map((n) => <li key={n.title}><span>{n.title}</span><Meta cat={n.cat} date="준비 중" /></li>)}
        </ul>
      </div>
    </section>
  );
}
