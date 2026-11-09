import { BASE } from "./base";

// The four reasons from the home page's 4번 연속 section, told in full on the about page:
// photograph and text in alternating rows. Copy from the 11/5 brief; absolute claims ("ZERO", "완벽히") left out.
const items = [
  {
    label: "사전 원가 절감",
    title: "착공 전, 낭비되는 공사비부터 잡습니다",
    lead: "도면 검토 전담팀이 착공 전에 숨은 비용과 설계를 바로잡습니다.",
    body: [
      "시공 중 발생하는 설계 변경과 추가 공사비 요구는 건축주를 가장 지치게 만듭니다.",
      "인정건설은 현장에 삽을 뜨기 전, 전담 엔지니어가 도면의 오류·간섭·비효율적 설계를 전수 검토합니다. 불필요한 공사비 거품은 걷어내고, 구조적 안전과 마감 품질은 끌어올리는 대안 설계(VE)를 먼저 제안합니다.",
    ],
    img: "why-1.jpg",
    alt: "빨간 펜으로 간섭 지점을 표시한 도면과 3D 모델 검토 화면",
  },
  {
    label: "실행 엔지니어링",
    title: "대기업 현장 출신 엔지니어가 직접 관리합니다",
    lead: "현대엔지니어링, 쌍용건설 출신 엔지니어가 현장을 총괄합니다.",
    body: [
      "면허만 빌려주고 현장을 프리랜서 소장에게 떠넘기는 시공사와는 근본이 다릅니다.",
      "국내 대형 건설사 현장을 직접 지휘해 본 엔지니어들이 본사의 엄격한 기술 기준과 감리 수준의 시공 디테일로 현장을 밀착 관리합니다.",
    ],
    img: "why-2.jpg",
    alt: "인정건설 안전모를 쓴 엔지니어 두 명이 타설 전 철근 간격을 검측하는 모습",
  },
  {
    label: "투명성·공정 관리",
    title: "공정과 원가를 데이터로 투명하게 관리합니다",
    lead: "CPM 공정표와 본사·현장 간 실시간 기성·원가 데이터 연동.",
    body: [
      "“공사가 언제 끝날지 모른다”는 불안을 지워드립니다.",
      "CPM(Critical Path Method) 공정표로 공정 지연 위험을 미리 통제하고, 본사와 현장이 기성과 원가 데이터를 실시간으로 공유합니다. 건축주는 언제든 내 건물의 공정률과 투입 원가를 확인할 수 있습니다.",
    ],
    img: "why-3.jpg",
    alt: "현장 사무실 화면에 띄운 공정표와 원가 그래프",
  },
  {
    label: "품질 락인",
    title: "검증된 A급 전속 시공팀 책임제",
    lead: "골조·방수·창호·설비에 검증된 A급 전문 기술진만 전속 투입합니다.",
    body: [
      "건물의 수명을 좌우하는 하자는 저가 외주 발주에서 시작됩니다.",
      "인정건설은 누수와 균열 같은 핵심 하자가 잦은 공종에 오래 손발을 맞춘 A급 전속 협력사를 락인(Lock-in)해 투입합니다. 직불 체계와 파트너십으로 현장 반장의 숙련도와 책임 시공을 직접 관리합니다.",
    ],
    img: "why-4.jpg",
    alt: "인정건설 안전모를 쓴 방수 시공팀이 옥상 방수 시트를 시공하는 모습",
  },
];

export function Strengths() {
  return (
    <section className="sec soft st-sec" id="strengths">
      <div className="container">
        <div className="st-head">
          <h2 className="h2 rv">건축주가 다시 인정건설을 찾는 이유</h2>
          <p className="lede rv">착공 전 도면 검토부터 준공까지, 본사가 직접 지키는 네 가지 원칙입니다.</p>
        </div>
        <ol className="st-list">
          {items.map((it, i) => (
            <li key={it.label} className="st-row rv">
              <figure className="st-pic">
                <img src={`${BASE}/sites/injeong/works/${it.img}`} alt={it.alt} width={1600} height={1200} loading="lazy" />
              </figure>
              <div className="st-txt">
                <p className="st-k"><span className="num">{String(i + 1).padStart(2, "0")}</span>{it.label}</p>
                <h3>{it.title}</h3>
                <p className="st-lead">{it.lead}</p>
                {it.body.map((b) => <p key={b}>{b}</p>)}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
