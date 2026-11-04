import Link from "next/link";
import { BASE } from "./base";

// 기초자료 작성표 5번 「건축 칼럼 주제」에서 인정건설이 고른 주제
const feature = {
  cat: "관급공사", date: "연재 예정", img: "p20",
  title: "관급공사는 어떤 순서로 진행될까 — 천안업성2초 현장 기록",
  text: "착공부터 준공까지 관급공사의 단계별 핵심 사항을 지금 시공 중인 천안업성2초등학교 현장으로 정리합니다.",
};

const notes = [
  { cat: "인허가", date: "준비 중", title: "착공 전 건축주가 알아야 할 인허가·공정 체크리스트", text: "설계가 끝난 뒤에도 착공까지 거쳐야 할 신고와 협의가 남아 있습니다. 순서대로 짚어 드립니다." },
  { cat: "공사관리", date: "준비 중", title: "건설사업관리 대상 현장, 시공사는 무엇을 준비하나", text: "건설사업관리(CM) 현장에서 시공사가 맞추는 서류와 검측, 보고 절차를 시공사 입장에서 정리합니다." },
  { cat: "법령", date: "준비 중", title: "건설 관련 법령·표준시방서, 이번에 달라진 것", text: "개정된 법령과 시방서 가운데 현장과 건축주에게 영향이 큰 내용만 골라 알려 드립니다." },
];

function Meta({ cat, date }: { cat: string; date: string }) {
  return (
    <span className="meta"><span className="k">{cat}</span><span className="num">{date}</span></span>
  );
}

/** Home: one feature plus the topic list, linking to /notes. */
export function NotesSummary() {
  return (
    <section className="sec soft">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">기술 칼럼</span>
            <h2 className="h2 rv">현장 기술진이 직접 쓰는 건축 이야기</h2>
          </div>
          <Link className="link rv" href="/notes">칼럼 주제 모두 보기</Link>
        </div>
        <div className="nt">
          <Link className="feat rv" href="/notes">
            <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/works/${feature.img}.jpg)` }} />
            <div className="bd">
              <Meta {...feature} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </Link>
          <ul className="rv">
            {notes.map((n) => (
              <li key={n.title}>
                <Link href="/notes">
                  <Meta {...n} />
                  <h3>{n.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** /notes: planned columns. Articles are not written yet, so cards are not links. */
export function NotesList() {
  return (
    <section className="sec">
      <div className="wrap">
        <article className="nfeat rv">
          <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/works/${feature.img}.jpg)` }} />
          <div className="bd">
            <Meta {...feature} />
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </div>
        </article>
        <div className="ncards">
          {notes.map((n) => (
            <article className="rv" key={n.title}>
              <Meta {...n} />
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
