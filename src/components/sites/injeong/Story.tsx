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
    <section className="sec vd" id="stories">
      {ld.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">영상으로 보는 인정건설</h2>
            <p className="lede rv">현장 점검부터 본사 회의까지, 인정건설이 일하는 모습을 그대로 담았습니다.<br className="br-pc" /> 사람과 현장을 보시면 어떤 회사인지 더 잘 아실 수 있습니다.</p>
          </div>
        </div>
        {videos.length === 0 ? (
          <p className="vd-empty rv">첫 영상을 준비하고 있습니다. 현장과 본사에서 일하는 모습을 곧 올리겠습니다.</p>
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

/*
 * 일하는 모습 (회사 이야기 탭): three scenes from the photos the company sent on 2026.11.10, site to office.
 * The text says only what the photo shows and what the site already promises elsewhere.
 */
const SCENES = [
  {
    key: "현장",
    title: "도면과 현장을 그 자리에서 맞춥니다",
    text: "시공 중인 현장에서 기술진이 도면을 들고 실제 위치와 치수를 확인합니다. 도면과 다른 곳은 공사가 진행되기 전에 잡습니다.",
    pics: [
      { src: "life/site-1.jpg", alt: "인정건설 기술진이 공사 현장에서 태블릿 도면을 보며 위치를 가리키는 모습" },
    ],
  },
  {
    key: "현장사무실",
    title: "큰 화면에 도면을 띄우고 함께 봅니다",
    text: "현장사무실에 도면을 띄워 놓고 소장과 기술진이 공정과 다음 작업을 함께 정합니다. 누가 무엇을 언제 하는지, 회의에서 정하고 시작합니다.",
    pics: [
      { src: "life/office-1.jpg", alt: "현장사무실에서 대형 화면에 도면을 띄우고 회의하는 인정건설 현장 직원들" },
    ],
  },
  {
    key: "본사",
    title: "현장 보고는 홍성 본사로 모입니다",
    text: "본사 회의실에서 현장별 공정과 비용을 함께 점검하고, 필요한 결정은 바로 현장에 내려보냅니다. 현장을 외부에 맡겨 두지 않고 본사가 직접 챙깁니다.",
    pics: [
      { src: "life/hq-1.jpg", alt: "홍성 본사 회의실에서 서류를 검토하는 인정건설 직원들" },
    ],
  },
];

export function WorkScenes() {
  return (
    <section className="sec ws">
      <div className="container">
        <div className="head">
          <div>
            <h2 className="h2 rv">현장에서 본사까지, 인정건설이 일하는 모습</h2>
            <p className="lede rv">꾸민 사진이 아니라 지금 짓고 있는 현장과 사무실의 하루입니다.</p>
          </div>
        </div>
        {SCENES.map((sc, i) => (
          <article className={i % 2 ? "ws-row flip" : "ws-row"} key={sc.key}>
            <div className="ws-txt rv">
              <p className="ws-key">{sc.key}</p>
              <h3>{sc.title}</h3>
              <p>{sc.text}</p>
            </div>
            <figure className="ws-pic rv">
              <img src={`${BASE}/sites/injeong/${sc.pics[0].src}`} alt={sc.pics[0].alt} width={2000} height={1500} loading="lazy" decoding="async" />
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}
