"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type StoryCard = { id: string; title: string; sub: string; cat: string; date: string; cover: string };

/**
 * 회사 이야기 board: the newest post large, category chips that filter, then a grid of cards.
 * Every post opens on its own page (/about/stories/<id>).
 */
export function StoryBoard({ items, cats }: { items: StoryCard[]; cats: readonly string[] }) {
  const [cat, setCat] = useState("");
  const used = cats.filter((c) => items.some((i) => i.cat === c));
  const list = useMemo(() => (cat ? items.filter((i) => i.cat === cat) : items), [items, cat]);
  const [lead, ...rest] = list;
  const day = (d: string) => d.replaceAll("-", ".");

  if (!items.length) return <p className="stb-empty">첫 이야기를 준비하고 있습니다.</p>;
  return (
    <>
      {used.length > 1 && (
        <div className="nf-chips stb-chips" role="group" aria-label="이야기 분류">
          <button type="button" aria-pressed={cat === ""} onClick={() => setCat("")}>전체 <span className="num">{items.length}</span></button>
          {used.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} <span className="num">{items.filter((i) => i.cat === c).length}</span></button>
          ))}
        </div>
      )}
      {lead && (
        <Link href={`/about/stories/${lead.id}`} className="stb-lead">
          <span className="stb-lead-pic"><img src={lead.cover} alt="" width={1600} height={1000} /></span>
          <span className="stb-lead-txt">
            <span className="stb-meta"><b>{lead.cat}</b><span className="stb-new">최신</span></span>
            <b className="stb-lead-t">{lead.title}</b>
            {lead.sub && <span className="stb-sub">{lead.sub}</span>}
            <span className="stb-date num">{day(lead.date)}</span>
            <span className="stb-more">자세히 보기</span>
          </span>
        </Link>
      )}
      {rest.length > 0 && (
        <ul className="stb-grid">
          {rest.map((n) => (
            <li key={n.id}>
              <Link href={`/about/stories/${n.id}`} className="stb-card">
                <span className="stb-pic"><img src={n.cover} alt="" width={800} height={500} loading="lazy" /></span>
                <span className="stb-meta"><b>{n.cat}</b></span>
                <b className="stb-t">{n.title}</b>
                {n.sub && <span className="stb-sub">{n.sub}</span>}
                <span className="stb-date num">{day(n.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
