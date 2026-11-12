"use client";

import { useState } from "react";

/** Copies the page address so a reader can pass the column on (카톡, 문자, 메일). */
export function CopyLink() {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.prompt("이 주소를 복사해 주세요.", window.location.href);
    }
  };
  return (
    <button type="button" className="art-copy" onClick={copy} aria-live="polite">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </svg>
      {done ? "주소를 복사했습니다" : "링크 복사"}
    </button>
  );
}
