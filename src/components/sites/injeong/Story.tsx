import { getProjects, getVideos } from "@/lib/injeong/content";
import { BASE } from "./base";
import { company } from "./data";
import { VideoPlayer } from "./VideoPlayer";

/*
 * 걸어온 길 (회사소개 탭): four eras, each a large year span on the left that stays in view,
 * and on the right one photograph and the dated milestones of that era.
 * Every milestone is a fact from data.ts, the 연혁 and the submitted 실적표; nothing is made up.
 */
type Era = { span: string; title: string; lead: string; img: string; alt: string; items: [string, string][] };

export async function StoryTimeline() {
  const projects = await getProjects();
  const done = projects.filter((p) => !p.ongoing);
  const dongsin = done.filter((p) => p.client === "㈜동신포리마");
  const eras: Era[] = [
    {
      span: "1989 – 2003",
      title: "홍성에서 시작",
      lead: "개인 건설업으로 출발해 종합건설 법인이 되기까지.",
      img: "greeting.jpg",
      alt: "도면 위에 놓인 인정건설 안전모",
      items: [
        ["1989", "홍성에서 개인 건설업 시작"],
        ["2003", "㈜인정건설 법인 전환, 건축공사업 등록"],
      ],
    },
    {
      span: "2004 – 2014",
      title: "공장과 학교를 짓다",
      lead: `기업의 공장과 아이들의 학교를 함께 지었습니다. ㈜동신포리마와의 ${dongsin.length}번의 인연도 이때 시작됐습니다.`,
      img: "works/q10.jpg",
      alt: "㈜동신포리마 인쇄공장과 제2공장, 2013년 준공",
      items: [
        ["2004", "㈜장유 창고동, ㈜두영아트 공장동 증축"],
        ["2008", "㈜동신포리마 P공장 신축, 첫 번째 공사"],
        ["2009", "광덕초등학교 다목적강당 증축"],
        ["2010", "진산파출소 개축"],
        ["2012", "애경화학㈜ 청양공장, 공주유스호스텔 다목적강당"],
        ["2013", "㈜동신포리마 인쇄공장·제2공장 신축 (40억 원)"],
        ["2014", "신창중학교 교실 개축, 송산면 주민복합센터"],
      ],
    },
    {
      span: "2015 – 2021",
      title: "지역을 대표하는 건물",
      lead: "공공기관 사옥과 박물관, 군 시설까지. 오래 남는 건물을 맡기 시작했습니다.",
      img: "works/p03.jpg",
      alt: "금산 역사문화박물관, 2018년 준공",
      items: [
        ["2016", "㈜동신포리마 공장 증축, 이후 2020년까지 매년 공사"],
        ["2017", "한국국토정보공사 아산지사 사옥 신축"],
        ["2018", "금산 역사문화박물관 건립, 군 기지교회 신축"],
        ["2019", "㈜한독이엔에스·비전테크 공장 신축"],
        ["2021", "군 탄약검사장, ㈜텔콘알에프제약 공장 증축"],
      ],
    },
    {
      span: "2022 – 2026",
      title: "더 큰 현장으로",
      lead: `준공 실적 ${done.length}건을 넘어, 이제 178억 원 규모의 학교를 짓고 있습니다.`,
      img: "works/p20.jpg",
      alt: "천안업성2초등학교 조감도",
      items: [
        ["2023", "홍성여자고등학교 다목적강당 개축"],
        ["2024", "실내건축공사업 등록"],
        ["2025", "고덕국민체육센터 건립, ㈜동신포리마 신원단공장 신축"],
        ["2026", `천안업성2초등학교 교사 신축 착공 (공동도급), 시공능력평가 ${company.capacity.amount}`],
      ],
    },
  ];
  const figures = [
    { n: "1989", u: "년", t: "홍성에서 시작" },
    { n: String(done.length), u: "건", t: "준공 실적" },
    { n: String(dongsin.length), u: "번", t: "㈜동신포리마 공사" },
    { n: company.capacity.amount.replace("억", ""), u: "억", t: `${company.capacity.year} 시공능력평가` },
  ];

  return (
    <section className="sec sy">
      <div className="container">
        <div className="sy-intro">
          <h2 className="h2 rv">한 지역에서 37년,<br />지은 건물이 이력이 되었습니다</h2>
          <ul className="sy-figs rv">
            {figures.map((f) => (
              <li key={f.t}><b className="num">{f.n}<small>{f.u}</small></b><span>{f.t}</span></li>
            ))}
          </ul>
        </div>
        {eras.map((e) => (
          <article className="sy-era" key={e.span}>
            <header className="sy-side">
              <p className="sy-span num">{e.span}</p>
              <h3>{e.title}</h3>
              <p className="sy-lead">{e.lead}</p>
            </header>
            <div className="sy-main">
              <figure className="sy-pic rv">
                <img src={`${BASE}/sites/injeong/${e.img}`} alt={e.alt} width={1800} height={1013} loading="lazy" decoding="async" />
                <figcaption>{e.alt}</figcaption>
              </figure>
              <ol className="sy-items">
                {e.items.map(([y, t]) => (
                  <li key={y + t} className="rv"><b className="num">{y}</b><span>{t}</span></li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export async function VideoList() {
  const videos = await getVideos();
  const ld = videos.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.desc || v.title,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    uploadDate: v.date,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
  }));
  return (
    <section className="sec vd" id="videos">
      {ld.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">현장에서 직접 들려드립니다</h2>
            <p className="lede rv">글과 사진으로 다 전하지 못하는 현장 이야기를 영상으로 담습니다.<br className="br-pc" /> 현장소장과 기술진이 직접 공사 과정을 설명합니다.</p>
          </div>
        </div>
        {videos.length === 0 ? (
          <p className="vd-empty rv">첫 영상을 준비하고 있습니다. 인정건설 현장을 찾아가는 인터뷰 시리즈가 곧 올라옵니다.</p>
        ) : (
          <ul className="vd-grid">
            {videos.map((v) => (
              <li key={v.id} className="rv">
                <div className="vd-media"><VideoPlayer id={v.youtubeId} title={v.title} /></div>
                <p className="vd-meta">{v.series && <span>{v.series}</span>}<span className="num">{v.date.replaceAll("-", ".")}</span></p>
                <h3>{v.title}</h3>
                {v.desc && <p className="vd-desc">{v.desc}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
