import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BASE } from "@/components/sites/injeong/base";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { VideoPlayer } from "@/components/sites/injeong/VideoPlayer";
import { getStories } from "@/lib/injeong/content";
import { pageMeta, SITE_URL } from "@/lib/injeong/site";
import { Photo } from "@/components/sites/injeong/Photo";

// true on a server so posts written in the admin open without a rebuild;
// the GitHub Pages workflow flips it to false for the static export.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getStories()).map((x) => ({ id: x.id }));
}

// search description: the subtitle, then whole sentences from the text while they fit in 155 characters
function describe(sub: string, body: string) {
  let out = sub ? `${sub.replace(/[.\s]+$/, "")}. ` : "";
  for (const s of body.replace(/\s+/g, " ").match(/[^.!?。]+[.!?。]?/g) ?? []) {
    if ((out + s).trim().length > 155) break;
    out += s;
  }
  return out.trim() || body.slice(0, 150);
}

const pic = (src: string) => (src.startsWith("/sites/") ? `${BASE}${src}` : src);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const x = (await getStories()).find((s) => s.id === id);
  return x ? pageMeta({ title: x.title, description: describe(x.sub, x.body), path: `/about/stories/${x.id}`, image: x.cover, type: "article" }) : {};
}

export default async function StoryPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getStories();
  const i = all.findIndex((s) => s.id === id);
  if (i < 0) notFound();
  const x = all[i];
  const newer = all[i - 1];
  const older = all[i + 1];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: x.title,
    description: x.sub || undefined,
    datePublished: x.date,
    publisher: { "@type": "Organization", name: "㈜인정건설" },
    ...(SITE_URL ? { image: x.cover.startsWith("/") ? `${SITE_URL}${x.cover}` : x.cover, mainEntityOfPage: `${SITE_URL}/about/stories/${x.id}` } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <article className="art stp">
        <header className="art-hd">
          <div className="container">
            <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><Link href="/about">회사소개</Link><span aria-hidden="true">/</span><Link href="/about/stories">회사 이야기</Link></nav>
            <p className="stp-meta"><b>{x.cat}</b><span className="num">{x.date.replaceAll("-", ".")}</span></p>
            <h1>{x.title}</h1>
            {x.sub && <p className="art-sub">{x.sub}</p>}
          </div>
        </header>
        <div className="container art-body">
          <figure className="art-pic"><Photo sizes="(max-width: 900px) 100vw, 800px" src={pic(x.cover)} alt={x.title} width={2000} height={1250} /></figure>
          {x.body.split(/\n\s*\n/).map((para, k) => <p key={k}>{para}</p>)}
          {x.youtube && (
            <div className="stp-video">
              <div className="vd-media"><VideoPlayer id={x.youtube} title={x.title} /></div>
            </div>
          )}
          {x.photos.length > 0 && (
            <ul className="stp-photos">
              {x.photos.map((p, k) => (
                <li key={p}><Photo src={pic(p)} alt={`${x.title} 사진 ${k + 2}`} width={1600} height={1200} loading="lazy" decoding="async" /></li>
              ))}
            </ul>
          )}
          <nav className="art-nav" aria-label="다른 이야기">
            {older ? <Link href={`/about/stories/${older.id}`}><span>이전 이야기</span><b>{older.title}</b></Link> : <span />}
            {newer ? <Link href={`/about/stories/${newer.id}`} className="nx"><span>다음 이야기</span><b>{newer.title}</b></Link> : <span />}
          </nav>
          <p className="art-back"><Link className="link" href="/about/stories">회사 이야기 목록으로</Link></p>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
