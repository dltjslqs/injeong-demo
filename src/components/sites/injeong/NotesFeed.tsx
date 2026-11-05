"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type FeedItem = { slug: string; title: string; sub: string; cat: string; date: string; cover: string };

/**
 * The column list as a feed: one featured article large, category chips that filter,
 * then a three-column grid of 16:10 cards. Hierarchy comes from image and type size, not boxes.
 */
export function NotesFeed({ featured, items, cats }: { featured: FeedItem; items: FeedItem[]; cats: string[] }) {
  const [cat, setCat] = useState("");
  const list = useMemo(() => (cat ? items.filter((i) => i.cat === cat) : items), [items, cat]);
  const count = (c: string) => items.filter((i) => i.cat === c).length;

  return (
    <>
      <Link href={`/notes/${featured.slug}`} className="nf-hero">
        <span className="nf-hero-pic"><img src={featured.cover} alt="" width={1600} height={1000} /></span>
        <span className="nf-hero-txt">
          <span className="nf-badge">필독 가이드</span>
          <b className="nf-hero-t">{featured.title}</b>
          <span className="nf-hero-s">{featured.sub}</span>
          <span className="nf-meta"><span>{featured.cat}</span><span className="num">{featured.date}</span></span>
        </span>
      </Link>

      <div className="nf-chips" role="group" aria-label="칼럼 분류">
        <button type="button" aria-pressed={cat === ""} onClick={() => setCat("")}>전체 <span className="num">{items.length}</span></button>
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} <span className="num">{count(c)}</span></button>
        ))}
      </div>

      <ul className="nf-grid">
        {list.map((n) => (
          <li key={n.slug}>
            <Link href={`/notes/${n.slug}`} className="nf-card">
              <span className="nf-pic"><img src={n.cover} alt="" width={800} height={500} loading="lazy" /></span>
              <span className="nf-meta"><span>{n.cat}</span><span className="num">{n.date}</span></span>
              <b className="nf-t">{n.title}</b>
              <span className="nf-s">{n.sub}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
