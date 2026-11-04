"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Popup } from "@/lib/injeong/content";

const key = (id: string) => `ij-pop-${id}`;
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);

/** The admin's notice, once per visit; "오늘 하루 보지 않기" hides it until tomorrow in this browser. */
export function PopupModal({ popup }: { popup: Popup }) {
  // hidden on the server and until the browser says otherwise, so the page never flashes it
  const hiddenToday = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return window.localStorage.getItem(key(popup.id)) === today();
      } catch {
        return false;
      }
    },
    () => true,
  );
  const [closed, setClosed] = useState(false);
  const open = !hiddenToday && !closed;
  const setOpen = (v: boolean) => setClosed(!v);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  if (!open) return null;
  const hideToday = () => {
    try {
      window.localStorage.setItem(key(popup.id), today());
    } catch {}
    setOpen(false);
  };
  const external = popup.linkUrl?.startsWith("http");
  return (
    <div className="pop-bg" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="pop" role="dialog" aria-modal="true" aria-labelledby="pop-t">
        {popup.imageUrl && <img className="pop-img" src={popup.imageUrl} alt="" />}
        <div className="pop-bd">
          <h2 id="pop-t">{popup.title}</h2>
          {popup.body && <p>{popup.body}</p>}
          {popup.linkUrl && (external ? (
            <a className="btn btn-seal" href={popup.linkUrl} target="_blank" rel="noopener noreferrer">{popup.linkLabel ?? "자세히 보기"}</a>
          ) : (
            <Link className="btn btn-seal" href={popup.linkUrl} onClick={() => setOpen(false)}>{popup.linkLabel ?? "자세히 보기"}</Link>
          ))}
        </div>
        <div className="pop-ft">
          <button type="button" onClick={hideToday}>오늘 하루 보지 않기</button>
          <button type="button" ref={closeBtn} onClick={() => setOpen(false)}>닫기</button>
        </div>
      </div>
    </div>
  );
}
