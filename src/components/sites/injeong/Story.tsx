import Link from "next/link";
import { getProjects, getVideos } from "@/lib/injeong/content";
import { BASE } from "./base";
import { company } from "./data";
import { VideoPlayer } from "./VideoPlayer";

/*
 * 이야기: the company told as chapters, oldest first, then its videos.
 * Every chapter rests on a dated fact from data.ts or the submitted papers (연혁, 실적표); nothing is made up.
 * When an interview or a 대표 이야기 is recorded, add it as a video rather than as invented prose here.
 */
type Chapter = { year: string; title: string; text: string; img?: string; alt?: string };

export async function Story() {
  const projects = await getProjects();
  const done = projects.filter((p) => !p.ongoing);
  const dongsin = done.filter((p) => p.client === "㈜동신포리마");
  const chapters: Chapter[] = [
    {
      year: "1989",
      title: "홍성에서 시작했습니다",
      text: "홍성에서 개인 건설업으로 출발했습니다. 본사는 지금도 같은 홍성에 있습니다.",
    },
    {
      year: "2003",
      title: "종합건설 법인이 되었습니다",
      text: "㈜인정건설로 법인을 세우고 건축공사업을 등록했습니다. 이듬해인 2004년에는 기업의 창고와 공장 증축을 맡았습니다.",
    },
    {
      year: "2008",
      title: `한 기업이 ${dongsin.length}번을 맡겼습니다`,
      text: `2008년 ㈜동신포리마 P공장을 지었습니다. 그 뒤 2025년 신원단공장까지, 같은 기업이 ${dongsin.length}번 공장 공사를 인정건설에 맡겼습니다.`,
      img: "works/p18.jpg",
      alt: "㈜동신포리마 신원단공장, 2025년 준공",
    },
    {
      year: "2009",
      title: "학교와 관공서를 짓기 시작했습니다",
      text: "광덕초등학교 다목적강당(2009)을 시작으로 진산파출소(2010), 신창중학교 교실(2014)까지, 아이들과 주민이 매일 드나드는 건물을 지었습니다.",
      img: "works/p00.jpg",
      alt: "광덕초등학교 다목적강당, 2009년 준공",
    },
    {
      year: "2017",
      title: "지역을 대표하는 건물을 맡았습니다",
      text: "한국국토정보공사 아산지사 사옥(2017)과 금산 역사문화박물관(2018)을 준공했습니다. 공공기관 사옥과 박물관처럼 오래 남는 건물입니다.",
      img: "works/p03.jpg",
      alt: "금산 역사문화박물관, 2018년 준공",
    },
    {
      year: "2021",
      title: "군 시설과 체육관까지 넓혔습니다",
      text: "군 탄약검사장(2021)과 고덕국민체육센터(2025)를 지었고, 2024년에는 실내건축공사업을 등록해 시설 개선 공사도 맡고 있습니다.",
      img: "works/p17.jpg",
      alt: "고덕국민체육센터, 2025년 준공",
    },
    {
      year: "2026",
      title: "178억 원 규모의 학교를 짓고 있습니다",
      text: `천안업성2초등학교 교사 신축공사를 공동도급으로 시공하고 있습니다. 2026년 시공능력평가액은 ${company.capacity.amount}이고, 지금까지 준공한 실적은 ${done.length}건입니다.`,
      img: "works/p20.jpg",
      alt: "천안업성2초등학교 조감도",
    },
  ];
  const videos = await getVideos();
  // videos for search engines (VideoObject)
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
    <>
      <section className="sec st">
        <div className="container">
          <ol className="st-list">
            {chapters.map((c) => (
              <li key={c.year} className={c.img ? "st-item has-pic rv" : "st-item rv"}>
                <p className="st-year num">{c.year}</p>
                <div className="st-txt">
                  <h2>{c.title}</h2>
                  <p>{c.text}</p>
                </div>
                {c.img && (
                  <figure className="st-pic">
                    <img src={`${BASE}/sites/injeong/${c.img}`} alt={c.alt ?? ""} width={1800} height={1344} loading="lazy" decoding="async" />
                  </figure>
                )}
              </li>
            ))}
          </ol>
          <blockquote className="st-quote rv">
            <p>“이름 석자를 걸고 짓습니다.”</p>
            <footer>{company.name} 대표이사 {company.ceo} <Link className="link" href="/about#greeting">대표 인사말 전문</Link></footer>
          </blockquote>
        </div>
      </section>

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
    </>
  );
}
