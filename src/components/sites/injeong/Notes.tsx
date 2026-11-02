import Link from "next/link";
import { BASE } from "./base";

const feature = {
  cat: "기초", kind: "칼럼", date: "2026.10.21", img: "steel",
  title: "공장 바닥 하중, 설비 무게부터 받아야 하는 이유",
  text: "프레스와 공작기계는 놓이는 자리마다 바닥이 받는 힘이 다릅니다. 설계 전에 설비 목록을 받아야 하는 이유를 현장 사례로 정리했습니다.",
};

const notes = [
  { cat: "원가", kind: "칼럼", date: "2026.10.14", title: "공장 견적서를 비교할 때 평당가보다 먼저 볼 다섯 줄", text: "토목, 바닥 하중, 수전, 소방, 크레인. 견적서에서 빠지기 쉬운 항목을 순서대로 짚었습니다." },
  { cat: "전기", kind: "칼럼", date: "2026.10.02", title: "수전 용량 신청은 착공과 같은 날 시작해야 합니다", text: "건물이 다 서도 전기가 들어오지 않으면 공장은 돌지 않습니다. 한전 협의 일정을 거꾸로 계산하는 법입니다." },
  { cat: "공정", kind: "영상", date: "공개 예정", title: "PHC 파일 항타, 현장 소장이 확인하는 세 가지", text: "관입 깊이, 수직도, 두부 정리. 당진 현장에서 실제 항타 기록을 펼쳐 놓고 설명합니다." },
  { cat: "물류", kind: "칼럼", date: "2026.09.10", title: "저온창고 단열 패널 이음부에 결로가 생기는 이유", text: "영하 25도 구역과 상온 구역이 만나는 곳에서 결로가 시작됩니다. 시공 단계에서 막는 방법을 정리했습니다." },
  { cat: "하자", kind: "영상", date: "공개 예정", title: "준공 1년 차 공장 지붕 점검 순서", text: "패널 이음부, 홈통, 관통부 순서로 봅니다. 장마 전에 점검해야 하는 이유도 함께 다룹니다." },
  { cat: "인허가", kind: "칼럼", date: "2026.08.27", title: "공장 등록까지 걸리는 시간, 착공 전에 정해야 할 서류", text: "건축 허가 뒤에도 공장 등록, 소방, 환경 신고가 남아 있습니다. 순서와 기간을 표로 정리했습니다." },
];

function Meta({ cat, kind, date }: { cat: string; kind: string; date: string }) {
  return (
    <span className="meta"><span className="k">{cat}</span><span className="v">{kind}</span><span className="num">{date}</span></span>
  );
}

/** Home: one feature plus three titles linking to /notes. */
export function NotesSummary() {
  return (
    <section className="sec soft">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">현장 노트</span>
            <h2 className="h2 rv">현장 엔지니어가 정리한 공장 건축 이야기</h2>
          </div>
          <Link className="link rv" href="/notes">현장 노트 전체 보기</Link>
        </div>
        <div className="nt">
          <Link className="feat rv" href="/notes">
            <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/${feature.img}.jpg)` }} />
            <div className="bd">
              <Meta {...feature} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </Link>
          <ul className="rv">
            {notes.slice(0, 4).map((n) => (
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

/** /notes: every note as a card. Article pages do not exist yet, so cards are not links. */
export function NotesList() {
  return (
    <section className="sec">
      <div className="wrap">
        <article className="nfeat rv">
          <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/${feature.img}.jpg)` }} />
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
