import { categories, projects, recordCount } from "./data";

/** Share of projects by client type, counted from the submitted project list. */
export function ClientMix() {
  const rows = categories.map((c) => ({ ...c, n: recordCount(projects.filter((p) => p.cat === c.key).length) }));
  const max = Math.max(...rows.map((r) => r.n));
  const publicCount = rows.filter((r) => ["교육", "공공", "군"].includes(r.key)).reduce((a, r) => a + r.n, 0);
  return (
    <section className="sec">
      <div className="container rg">
        <div>
          <h2 className="h2 rv">실적 {recordCount(projects.length)}건 중 {publicCount}건이<br />교육청·지자체·군 발주 공사</h2>
          <p className="lede rv">관급 공사에서 다져 온 시공 기준을 민간 공사에도 그대로 적용합니다. 산업시설은 한 기업이 네 차례 연속으로 공사를 맡겼습니다.</p>
        </div>
        <ul className="bars rv">
          {rows.map((r) => (
            <li key={r.key}>
              <span>{r.label}</span>
              <span className="track"><i style={{ width: `${(r.n / max) * 100}%` }} /></span>
              <b className="num">{r.n}<small>건</small></b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
