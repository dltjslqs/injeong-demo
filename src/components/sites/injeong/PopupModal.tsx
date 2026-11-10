"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Popup } from "@/lib/injeong/content";

const key = (id: string) => `ij-pop-${id}`;
const HIDE_DAYS = 7;
// dates in Korea time, as YYYY-MM-DD
const day = (plus = 0) => new Date(Date.now() + 9 * 3600e3 + plus * 864e5).toISOString().slice(0, 10);

/**
 * The admin's notice as a card in the bottom corner; the page stays usable behind it.
 * "일주일 동안 보지 않기" keeps it closed in this browser for seven days.
 */
export function PopupModal({ popup }: { popup: Popup }) {
  // hidden on the server and until the browser says otherwise, so the page never flashes it
  const hidden = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        // the stored value is the last day the card stays hidden
        const until = window.localStorage.getItem(key(popup.id));
        return Boolean(until && until >= day());
      } catch {
        return false;
      }
    },
    () => true,
  );
  const [closed, setClosed] = useState(false);
  const [week, setWeek] = useState(false);
  const open = !hidden && !closed;

  const close = () => {
    if (week) {
      try {
        window.localStorage.setItem(key(popup.id), day(HIDE_DAYS - 1));
      } catch {}
    }
    setClosed(true);
  };

  // line the card's right edge up with the phone number in the header (the header's width changes by screen size)
  useEffect(() => {
    if (!open) return;
    const align = () => {
      const tel = document.querySelector<HTMLElement>(".hd .tel");
      const card = document.querySelector<HTMLElement>(".pop");
      if (!card) return;
      const r = tel?.getBoundingClientRect();
      card.style.right = r && r.width > 0 ? `${document.documentElement.clientWidth - r.right}px` : "";
    };
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setClosed(true); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  if (!open) return null;
  const external = popup.linkUrl?.startsWith("http");
  return (
    <aside className="pop" role="dialog" aria-modal="false" aria-labelledby="pop-t">
      {popup.imageUrl && <img className="pop-img" src={popup.imageUrl} alt="" />}
      <div className="pop-bd">
        <h2 id="pop-t">{popup.title}</h2>
        {popup.body && <p>{popup.body}</p>}
        {popup.linkUrl && (external ? (
          <a className="btn btn-seal" href={popup.linkUrl} target="_blank" rel="noopener noreferrer">{popup.linkLabel ?? "자세히 보기"}</a>
        ) : (
          <Link className="btn btn-seal" href={popup.linkUrl} onClick={() => setClosed(true)}>{popup.linkLabel ?? "자세히 보기"}</Link>
        ))}
      </div>
      <div className="pop-ft">
        <label className="pop-week">
          <input type="checkbox" checked={week} onChange={(e) => setWeek(e.target.checked)} />
          일주일 동안 보지 않기
        </label>
        <button type="button" onClick={close}>닫기</button>
      </div>
    </aside>
  );
}
