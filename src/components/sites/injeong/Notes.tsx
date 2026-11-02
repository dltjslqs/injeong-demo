import { BASE } from "./base";

const list = [
  { cat: "원가", kind: "칼럼", date: "2026.10.14", title: "공장 견적서를 비교할 때 평당가보다 먼저 볼 다섯 줄" },
  { cat: "전기", kind: "칼럼", date: "2026.10.02", title: "수전 용량 신청은 착공과 같은 날 시작해야 합니다" },
  { cat: "공정", kind: "영상", date: "공개 예정", title: "PHC 파일 항타, 현장 소장이 확인하는 세 가지" },
  { cat: "물류", kind: "칼럼", date: "2026.09.10", title: "저온창고 단열 패널 이음부에 결로가 생기는 이유" },
  { cat: "하자", kind: "영상", date: "공개 예정", title: "준공 1년 차 공장 지붕 점검 순서" },
];

function Meta({ cat, kind, date }: { cat: string; kind: string; date: string }) {
  return (
    <span className="meta"><span className="k">{cat}</span><span className="v">{kind}</span><span className="num">{date}</span></span>
  );
}

export function Notes() {
  return (
    <section className="sec soft" id="notes">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">현장 노트</span>
            <h2 className="h2 rv">현장 엔지니어가 정리한 공장 건축 이야기</h2>
          </div>
          <a className="link rv" href="#notes">전체 글 보기</a>
        </div>
        <div className="nt">
          <a className="feat rv" href="#notes">
            <div className="im" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/steel.jpg)` }} />
            <div className="bd">
              <Meta cat="기초" kind="칼럼" date="2026.10.21" />
              <h3>공장 바닥 하중, 설비 무게부터 받아야 하는 이유</h3>
              <p>프레스와 공작기계는 놓이는 자리마다 바닥이 받는 힘이 다릅니다. 설계 전에 설비 목록을 받아야 하는 이유를 현장 사례로 정리했습니다.</p>
            </div>
          </a>
          <ul className="rv">
            {list.map((n) => (
              <li key={n.title}>
                <a href="#notes">
                  <Meta cat={n.cat} kind={n.kind} date={n.date} />
                  <h3>{n.title}</h3>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
