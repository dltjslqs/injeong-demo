import type { ImgHTMLAttributes } from "react";

/*
 * A photo that ships with the site (works, life, cols, awards, team, ceo) has WebP copies 640, 1200, 1800 and 2400 (quality 88, never wider than the original)
 * px wide next to its JPG (made with PIL, see scripts note in docs). The browser takes the smallest one that
 * fills the space; the JPG stays as the fallback. Any other picture (an admin upload) is a plain <img>.
 */
const LOCAL = /^(.*\/sites\/injeong\/(?:(?:works|life|cols|awards)\/[\w-]+|team|ceo|hero-poster))\.jpg$/;

type Props = ImgHTMLAttributes<HTMLImageElement> & { src?: string; priority?: boolean };

// the default asks for more than most slots show, so on a plain (1x) screen a card still gets a file wider than itself
// and stays sharp; pass a tighter sizes where the slot is known to be small
export function Photo({ src, sizes = "(max-width: 640px) 100vw, (max-width: 1100px) 70vw, 960px", priority, loading, ...rest }: Props) {
  const m = src ? LOCAL.exec(src) : null;
  const load = priority ? "eager" : loading;
  const fetchPriority = priority ? "high" : undefined;
  if (!m) return <img src={src} loading={load} fetchPriority={fetchPriority} {...rest} />;
  const b = m[1];
  return (
    <picture>
      <source type="image/webp" srcSet={`${b}-640.webp 640w, ${b}-1200.webp 1200w, ${b}-1800.webp 1800w, ${b}-2400.webp 2400w`} sizes={sizes} />
      <img src={src} loading={load} fetchPriority={fetchPriority} {...rest} />
    </picture>
  );
}
