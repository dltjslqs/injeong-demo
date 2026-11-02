const steps = [
  ["상담", "부지 위치와 생산 계획, 희망 일정을 듣습니다."],
  ["사전 검토", "용도지역, 수전 용량, 진입 도로를 확인합니다."],
  ["설계 협의", "설비 배치에 맞춰 하중과 층고를 정합니다."],
  ["시공", "공정표와 현장 사진을 주 단위로 공유합니다."],
  ["사후 관리", "하자 접수 후 48시간 안에 현장을 확인합니다."],
];

export function Process() {
  return (
    <section className="sec soft" id="process">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">진행 순서</span>
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
