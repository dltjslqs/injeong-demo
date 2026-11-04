// Where the work is, read from the clients in data.ts (교육지원청, 군청, 캠퍼스).
const places: [string, string][] = [
  ["홍성", "본사. 홍성여고 다목적강당, 청운대 인의관 승강기, 월산리 다가구주택"],
  ["천안", "광덕초 다목적강당, 천안업성2초 교사 신축, 단국대병원 시설개선"],
  ["아산", "신창중 교실 개축, 한국국토정보공사 아산지사 사옥"],
  ["예산", "고덕국민체육센터"],
  ["금산", "금산 역사문화박물관"],
];

export function Where() {
  return (
    <section className="where">
      <div className="container where-in">
        <div>
          <h2>홍성 본사에서 충남 곳곳으로</h2>
          <p className="lead">태안과 계룡의 공사까지, 발주처가 있는 곳이면 현장을 엽니다.</p>
        </div>
        <ul className="rows">
          {places.map(([place, work]) => (
            <li key={place}>
              <h3>{place}</h3>
              <p>{work}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
