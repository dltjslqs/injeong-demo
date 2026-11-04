import Link from "next/link";
import { BASE } from "./base";

// 기초자료 작성표 5번 「건축 칼럼 주제」에서 인정건설이 고른 주제
const feature = {
  cat: "관급공사", date: "연재 예정", img: "p20",
  title: "관급공사는 어떤 순서로 진행될까, 천안업성2초 현장 기록",
  text: "착공부터 준공까지 관급공사의 단계별 핵심 사항을 지금 시공 중인 천안업성2초등학교 현장으로 정리합니다.",
};

const notes = [
  { cat: "인허가", date: "준비 중", title: "착공 전 건축주가 알아야 할 인허가·공정 체크리스트", text: "설계가 끝난 뒤에도 착공까지 거쳐야 할 신고와 협의가 남아 있습니다. 순서대로 짚어 드립니다." },
  { cat: "공사관리", date: "준비 중", title: "건설사업관리 대상 현장, 시공사는 무엇을 준비하나", text: "건설사업관리(CM) 현장에서 시공사가 맞추는 서류와 검측, 보고 절차를 시공사 입장에서 정리합니다." },
  { cat: "법령", date: "준비 중", title: "건설 관련 법령·표준시방서, 이번에 달라진 것", text: "개정된 법령과 시방서 가운데 현장과 건축주에게 영향이 큰 내용만 골라 알려 드립니다." },
];

function Meta({ cat, date }: { cat: string; date: string }) {
  return <p className="meta">{cat}, {date}</p>;
}

/** Home: the planned columns as a list beside the site they start from. */
export function NotesSummary() {
  return (
    <section className="notes">
      <div className="container notes-in">
        <div className="notes-txt">
          <h2>현장 기술진이 쓰는 칼럼</h2>
          <ol className="notes-list">
            {[feature, ...notes].map((n) => (
              <li key={n.title}>
                <Link href="/notes">
                  <h3>{n.title}</h3>
                  <Meta {...n} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <figure className="notes-pic">
          <img src={`${BASE}/sites/injeong/works/${feature.img}.jpg`} alt="천안업성2초등학교 조감도" width={1600} height={1131} loading="lazy" />
          <figcaption>첫 연재의 현장, 천안업성2초등학교 조감도</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** /notes: planned columns. Articles are not written yet, so cards are not links. */
export function NotesList() {
  return (
    <section className="sec">
      <div className="container">
        <article className="nfeat">
          <img src={`${BASE}/sites/injeong/works/${feature.img}.jpg`} alt="천안업성2초등학교 조감도" width={1600} height={1131} loading="lazy" />
          <div className="nfeat-txt">
            <h2>{feature.title}</h2>
            <Meta {...feature} />
            <p>{feature.text}</p>
          </div>
        </article>
        <ul className="nrows">
          {notes.map((n) => (
            <li key={n.title}>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
              <Meta {...n} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
