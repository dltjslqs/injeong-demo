"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { removeProject, toggleProject } from "../actions";
import { ConfirmButton } from "../ui";

export type BoardItem = {
  id: string;
  name: string;
  client: string;
  cat: string;
  catLabel: string;
  done: string;
  ongoing: boolean;
  img?: string;
  off: boolean;
  builtin: boolean;
  edited: boolean;
};

/** The project list as photo cards, with search and filters that work as you type. */
export function Board({ items, cats }: { items: BoardItem[]; cats: { key: string; label: string }[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [state, setState] = useState<"" | "on" | "off" | "now">("");
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return items.filter(
      (p) =>
        (!cat || p.cat === cat) &&
        (!state || (state === "on" && !p.off) || (state === "off" && p.off) || (state === "now" && p.ongoing)) &&
        (!k || `${p.name} ${p.client}`.toLowerCase().includes(k)),
    );
  }, [items, q, cat, state]);
  const count = (c: string) => items.filter((p) => p.cat === c).length;

  return (
    <>
      <div className="pb-tools">
        <input type="search" className="pb-search" placeholder="공사명이나 발주처로 찾기" value={q} onChange={(e) => setQ(e.target.value)} aria-label="실적 검색" />
        <div className="pb-chips" role="group" aria-label="분류">
          <button type="button" className={cat === "" ? "on" : undefined} aria-pressed={cat === ""} onClick={() => setCat("")}>전체 {items.length}</button>
          {cats.map((c) => (
            <button type="button" key={c.key} className={cat === c.key ? "on" : undefined} aria-pressed={cat === c.key} onClick={() => setCat(c.key)}>
              {c.label} {count(c.key)}
            </button>
          ))}
        </div>
        <select value={state} onChange={(e) => setState(e.target.value as typeof state)} aria-label="상태">
          <option value="">모든 상태</option>
          <option value="now">시공 중</option>
          <option value="on">게시</option>
          <option value="off">숨김</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="ad-empty"><p>조건에 맞는 실적이 없습니다.</p></div>
      ) : (
        <ul className="pb-grid">
          {list.map((p) => (
            <li key={p.id} className={p.off ? "pb-card off" : "pb-card"}>
              <Link href={`/admin/projects/edit?id=${p.id}`} className="pb-pic" aria-label={`${p.name} 고치기`}>
                {p.img ? <img src={p.img} alt="" loading="lazy" /> : <span className="pb-nopic">사진 없음</span>}
                <span className={p.ongoing ? "pb-badge now" : "pb-badge"}>{p.ongoing ? "시공 중" : `${p.done} 준공`}</span>
                {p.off && <span className="pb-hidden">숨김</span>}
              </Link>
              <div className="pb-bd">
                <p className="pb-meta">
                  <span>{p.catLabel}</span>
                  {!p.builtin ? <span className="ad-tag new">추가</span> : p.edited ? <span className="ad-tag">수정됨</span> : null}
                </p>
                <Link href={`/admin/projects/edit?id=${p.id}`} className="pb-name">{p.name}</Link>
                <p className="pb-client">{p.client}</p>
              </div>
              <div className="pb-acts">
                <Link className="ad-btn" href={`/admin/projects/edit?id=${p.id}`}>고치기</Link>
                <form action={toggleProject}><input type="hidden" name="id" value={p.id} /><button type="submit" className="ad-btn">{p.off ? "다시 게시" : "숨기기"}</button></form>
                {!p.builtin ? (
                  <form action={removeProject}><input type="hidden" name="id" value={p.id} /><ConfirmButton message="이 실적을 지울까요? 되돌릴 수 없습니다.">삭제</ConfirmButton></form>
                ) : p.edited ? (
                  <form action={removeProject}><input type="hidden" name="id" value={p.id} /><ConfirmButton message="고친 내용을 버리고 원래대로 되돌릴까요?" className="ad-btn">원래대로</ConfirmButton></form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
