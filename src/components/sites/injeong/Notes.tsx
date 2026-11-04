import Link from "next/link";
import { BASE } from "./base";
import { COLUMN_DATE, coverOf } from "./ColumnArticle";
import { columns } from "./columns";

const feature = columns[0];

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

/** Home: the four newest columns beside the photo of the first. */
export function NotesSummary() {
  return (
    <section className="notes">
      <div className="container notes-in">
        <div className="notes-txt">
          <h2>현장 기술진이 쓰는 칼럼</h2>
          <ol className="notes-list">
            {columns.slice(0, 4).map((n) => (
              <li key={n.slug}>
                <Link href={`/notes/${n.slug}`}>
                  <h3>{n.title}</h3>
                  <Meta cat={n.cat} date={COLUMN_DATE} />
                </Link>
              </li>
            ))}
          </ol>
          <Link className="link notes-all" href="/notes">칼럼 {columns.length}편 모두 보기</Link>
        </div>
        <figure className="notes-pic">
          <img src={`${BASE}/sites/injeong/works/${coverOf(feature)}.jpg`} alt="㈜동신포리마 신원단공장" width={1800} height={1018} loading="lazy" />
          <figcaption>공장 신축과 증축, 사무용 건물까지 현장에서 받은 질문으로 씁니다</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** /notes: the first column as the feature, every other column as a row, then the planned topics. */
export function NotesList() {
  const href = `/notes/${feature.slug}`;
  return (
    <section className="sec">
      <div className="container">
        <article className="nfeat">
          <Link href={href} className="nfeat-pic">
            <img src={`${BASE}/sites/injeong/works/${coverOf(feature)}.jpg`} alt="㈜동신포리마 신원단공장" width={1800} height={1018} loading="lazy" />
          </Link>
          <div className="nfeat-txt">
            <h2><Link href={href}>{feature.title}</Link></h2>
            <Meta cat={feature.cat} date={COLUMN_DATE} />
            <p>{feature.lede}</p>
            <p><Link className="link" href={href}>칼럼 읽기</Link></p>
          </div>
        </article>
        <ul className="nrows">
          {columns.slice(1).map((n) => (
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
