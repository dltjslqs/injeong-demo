"use client";

import { useState } from "react";

/**
 * A YouTube video that loads only when played: until then it is a thumbnail and a play button,
 * so the page stays light and no YouTube cookies are set before the visitor chooses to watch.
 */
export function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <iframe
        className="vd-frame"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button type="button" className="vd-poster" onClick={() => setOn(true)} aria-label={`${title} 재생`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={`${title} 영상 미리보기`} width={480} height={360} loading="lazy" />
      <span className="vd-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      </span>
    </button>
  );
}
