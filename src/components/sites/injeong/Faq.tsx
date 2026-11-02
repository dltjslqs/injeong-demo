const faqs = [
  ["평당 공사비가 중요한가요?", "참고는 되지만 비교 기준으로는 부족합니다. 공장은 바닥 하중, 크레인 유무, 수전 용량에 따라 같은 평수라도 공사비 차이가 큽니다. 항목별 내역서를 놓고 비교해 드립니다."],
  ["충남 외에도 공사를 할 수 있나요?", "네. 충남이 중심이지만 세종, 평택, 청주처럼 가까운 산업단지 공사도 맡습니다. 거리보다 공사 규모와 일정을 먼저 보고 가능 여부를 말씀드립니다."],
  ["설계가 끝나기 전에 상담해도 되나요?", "설계 전이 오히려 좋습니다. 설비 배치와 수전 여건을 먼저 정리하면 설계 변경으로 늘어나는 비용을 줄일 수 있습니다."],
  ["공장을 돌리면서 증축할 수 있나요?", "가능합니다. 생산 구역과 공사 구역을 칸막이로 나누고, 소음과 분진이 큰 작업은 주말이나 야간에 합니다. 착공 전에 생산 일정표를 받아 공정을 맞춥니다."],
  ["견적은 얼마나 걸리나요?", "도면이 있으면 보통 2주 안팎입니다. 도면이 없으면 부지와 규모를 기준으로 개략 공사비를 먼저 알려 드립니다."],
  ["준공 뒤 하자는 어떻게 처리하나요?", "접수하시면 48시간 안에 담당자가 현장을 확인합니다. 하자보수 보증 기간에는 정기 점검도 함께 합니다."],
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
            <a className="num" href="tel:041-633-9942">041-633-9942</a>
            <span>평일 08:30 – 17:30</span>
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
