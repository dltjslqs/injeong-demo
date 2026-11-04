import { company } from "./data";

const faqs = [
  ["관급 공사만 하나요? 민간 공사도 맡나요?", "민간 공사도 맡습니다. 공장과 자재창고, 교회, 근린생활시설과 다가구주택을 시공했고, 한 기업에서 네 차례 연속으로 공장 공사를 맡긴 사례도 있습니다."],
  ["충남 외 지역도 공사할 수 있나요?", "홍성 본사를 중심으로 천안, 아산, 예산, 태안, 금산, 계룡 등 충남 곳곳에서 시공했습니다. 다른 지역은 위치와 규모를 알려 주시면 가능 여부를 먼저 말씀드립니다."],
  ["평당 공사비만 보고 비교해도 되나요?", "같은 면적이라도 구조, 용도, 마감, 설비에 따라 공사비가 크게 달라집니다. 평당가보다 항목별 내역서를 함께 놓고 비교하시기를 권합니다."],
  ["설계가 끝나기 전에 상담해도 되나요?", "괜찮습니다. 착공 전에 확인할 인허가와 공정을 미리 정리하면 설계 변경으로 늘어나는 비용과 기간을 줄일 수 있습니다."],
  ["리모델링이나 실내 공사도 하나요?", "실내건축공사업 면허를 보유하고 있어 시설 개선과 리모델링도 맡습니다. 현재 대학병원 시설개선공사를 시공하고 있습니다."],
  ["회사 자료(지명원)를 받아 볼 수 있나요?", `면허, 신용평가, 시공능력평가, 실적이 담긴 회사 자료를 보내 드립니다. 견적 문의에 남겨 주시거나 ${company.email}로 요청해 주세요.`],
];

export function Faq() {
  return (
    <section className="sec" id="faq">
      <div className="wrap fq">
        <div>
          <span className="kicker rv">자주 묻는 질문</span>
          <h2 className="h2 rv">공사 전에 많이<br />물어보시는 것들</h2>
          <div className="ask rv">
            <b>찾는 답이 없나요?</b>
            <a className="num" href={`tel:${company.tel}`}>{company.tel}</a>
            <span>{company.email}</span>
          </div>
        </div>
        <div>
          {faqs.map(([q, a]) => (
            <details className="rv" key={q}>
              <summary><span className="q">Q</span><span className="t">{q}</span><span className="pm" aria-hidden="true" /></summary>
              <div className="a">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
