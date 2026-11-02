const regions: [string, number][] = [
  ["홍성", 42],
  ["예산", 31],
  ["아산", 28],
  ["당진", 26],
  ["서산", 22],
  ["천안", 14],
  ["그 밖", 17],
];
const max = Math.max(...regions.map(([, n]) => n));

export function Regions() {
  return (
    <section className="sec">
      <div className="wrap rg">
        <div>
          <span className="kicker rv">시공 지역</span>
          <h2 className="h2 rv">충남 15개 시·군,<br />산업단지마다 현장이 있습니다</h2>
          <p className="lede rv">가까운 곳에 현장이 많을수록 자재와 인력을 빨리 움직일 수 있습니다. 지역별로 준공한 현장 수입니다.</p>
        </div>
        <ul className="bars rv">
          {regions.map(([name, n]) => (
            <li key={name}>
              <span>{name}</span>
              <span className="track"><i style={{ width: `${(n / max) * 100}%` }} /></span>
              <b className="num">{n}<small>곳</small></b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
