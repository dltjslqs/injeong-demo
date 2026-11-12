import { getProjects } from "@/lib/injeong/content";
import { MAP_H, MAP_W, regions } from "./chungnam";

/*
 * 실적 지도: 충남 시·군마다 준공·시공 중인 실적 수를 칠하고, 고른 시·군의 실적 목록을 옆에 보여 준다.
 * 군 시설은 보안상 싣지 않고, 지역이 정해지지 않은 실적은 건수만 밝힌다.
 * Without scripting every region's list shows; Behaviors makes it one region at a time.
 */
export async function ProjectMap() {
  const all = (await getProjects()).filter((p) => p.cat !== "군");
  const placed = all.filter((p) => p.region);
  const by = new Map<string, typeof placed>();
  for (const p of placed) by.set(p.region!, [...(by.get(p.region!) ?? []), p]);
  const max = Math.max(1, ...[...by.values()].map((l) => l.length));
  const ranked = [...by.entries()].sort((a, b) => b[1].length - a[1].length);
  const first = ranked[0]?.[0];
  const military = (await getProjects()).filter((p) => p.cat === "군").length;
  const unplaced = all.length - placed.length;
  // five steps from pale to the accent, so a region with one project still reads as "built here"
  const step = (n: number) => (n === 0 ? 0 : Math.min(5, 1 + Math.floor(((n - 1) / max) * 5)));

  return (
    <section className="sec pm" id="map">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">지역별 시공 실적</h2>
            <p className="lede rv">홍성 본사를 중심으로 {by.size}개 시·군에서 {placed.length}건을 지었습니다.<br className="br-pc" /> 지역을 누르면 그곳의 실적이 나옵니다.</p>
          </div>
        </div>
        <div className="pm-in">
          <div className="pm-map">
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={`시·군별 시공 실적 지도. ${ranked.map(([r, l]) => `${r} ${l.length}건`).join(", ")}`}>
              {regions.map((r) => {
                const n = by.get(r.name)?.length ?? 0;
                return <path key={r.name} d={r.d} className={`pm-r s${step(n)}${r.name === first ? " on" : ""}`} data-region={n ? r.name : undefined} />;
              })}
              {regions.map((r) => {
                const n = by.get(r.name)?.length ?? 0;
                return (
                  <g key={r.name} className={n ? `pm-l has s${step(n)}${r.name === first ? " on" : ""}` : "pm-l"} transform={`translate(${r.x} ${r.y})`} data-region={n ? r.name : undefined}>
                    <text className="pm-name" y={n ? -10 : 6}>{r.name.replace(/[시군]$/, "")}</text>
                    {n > 0 && <text className="pm-n" y={30}>{n}</text>}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="pm-side">
            <div className="pm-tabs" role="group" aria-label="시·군 선택">
              {ranked.map(([r, l]) => (
                <button key={r} type="button" data-region={r} aria-pressed={r === first ? "true" : "false"}>
                  {r}<span className="num">{l.length}</span>
                </button>
              ))}
            </div>
            {ranked.map(([r, l]) => (
              <div key={r} className="pm-list" data-list={r} aria-live="polite">
                <p className="pm-list-h"><b>{r}</b> <span className="num">{l.length}건</span></p>
                <ul>
                  {l.map((p) => (
                    <li key={p.id}>
                      <span className="num">{p.ongoing ? "시공 중" : p.done.slice(0, 4)}</span>
                      <span>{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="pm-note">
              군 시설 {military}건은 보안상 지도에 표시하지 않습니다.{unplaced > 0 ? ` 지역을 확인 중인 실적 ${unplaced}건은 아래 전체 목록에 있습니다.` : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
