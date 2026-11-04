import { BASE } from "./base";
import { projects } from "./data";

export function NowBuilding() {
  const ongoing = projects.filter((p) => p.ongoing);
  return (
    <section className="sec soft" id="now">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">지금 시공하고 있는 공사</h2>
            <p className="lede rv">두 현장 모두 공동도급으로 인정건설이 지분 51%를 맡아 공사를 이끌고 있습니다.</p>
          </div>
        </div>
        <div className="og">
          {ongoing.map((p) => (
            <article className="rv" key={p.id}>
              <div className={p.img ? "im" : "im none"} style={p.img ? { backgroundImage: `url(${BASE}/sites/injeong/works/${p.img}.jpg)` } : undefined}>
                {!p.img && <span className="ph-note">현장 사진 준비 중</span>}
              </div>
              <div className="bd">
                <p className="st">시공 중, <span className="num">{p.period}</span></p>
                <h3>{p.name}</h3>
                <dl>
                  <dt>발주처</dt><dd>{p.client}</dd>
                  <dt>규모</dt><dd>{p.scale}{p.area ? ` · ${p.area}` : ""}</dd>
                  <dt>공사비</dt><dd className="num">{p.cost} <small>({p.share})</small></dd>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
