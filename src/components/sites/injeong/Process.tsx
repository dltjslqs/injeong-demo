const steps = [
  ["상담", "공사 위치와 용도, 규모, 희망 일정을 듣습니다."],
  ["사전 검토", "착공 전에 필요한 인허가와 공정을 정리합니다."],
  ["설계 협의", "용도에 맞춰 구조·마감·설비를 함께 검토합니다."],
  ["시공", "안전과 공기를 지키며 공정을 발주처와 공유합니다."],
  ["준공·사후 관리", "준공 뒤 하자 접수와 점검까지 책임집니다."],
];

export function Process() {
  return (
    <section className="sec soft" id="process">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">상담부터 사후 관리까지 다섯 단계</h2>
          </div>
        </div>
        <ol className="flow">
          {steps.map(([t, d]) => (
            <li className="rv" key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
