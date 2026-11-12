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
  const [q, setQ] = useState("");
  // the featured column joins the grid while searching, so every column can be found
  const pool = useMemo(() => (q.trim() ? [featured, ...items] : items), [featured, items, q]);
  const list = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return pool.filter((i) => (!cat || i.cat === cat) && words.every((w) => `${i.title} ${i.sub} ${i.cat}`.toLowerCase().includes(w)));
  }, [pool, cat, q]);
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

      <div className="nf-bar">
      <div className="nf-chips" role="group" aria-label="칼럼 분류">
        <button type="button" aria-pressed={cat === ""} onClick={() => setCat("")}>전체 <span className="num">{items.length}</span></button>
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} <span className="num">{count(c)}</span></button>
        ))}
      </div>
      <label className="nf-search">
        <span className="visually-hidden">칼럼 검색</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="예: 공사비, 증축, 인허가" />
      </label>
      </div>
      {list.length === 0 && <p className="nf-none">「{q}」에 맞는 칼럼이 없습니다. 다른 말로 찾아보시거나 견적 문의로 직접 물어봐 주세요.</p>}

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
