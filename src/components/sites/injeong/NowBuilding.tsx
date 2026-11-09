import { getProjects } from "@/lib/injeong/content";
import { projectImg } from "./data";

export async function NowBuilding() {
  const ongoing = (await getProjects()).filter((p) => p.ongoing);
  return (
    <section className="sec soft" id="now">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">2026년 시공 현장</h2>
            <p className="lede rv">올해 인정건설이 맡아 짓고 있는 현장입니다.</p>
          </div>
        </div>
        <div className="og">
          {ongoing.map((p) => (
            <article className="rv" key={p.id}>
              <div className={projectImg(p) ? "im" : "im none"} style={projectImg(p) ? { backgroundImage: `url(${projectImg(p)})` } : undefined}>
                {!projectImg(p) && <span className="ph-note">현장 사진 준비 중</span>}
              </div>
              <div className="bd">
                <p className="st">시공 중, <span className="num">{p.period}</span></p>
                <h3>{p.name}</h3>
                <dl>
                  <dt>발주처</dt><dd>{p.client}</dd>
                  <dt>규모</dt><dd>{p.scale}{p.area ? ` · ${p.area}` : ""}</dd>
                  <dt>공사비</dt><dd className="num">{p.cost ?? "—"}{p.share && <small> ({p.share})</small>}</dd>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
