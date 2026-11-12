/**
 * Where the site lives and whether search engines may index it.
 * Set NEXT_PUBLIC_SITE_URL (e.g. https://injeongcon.co.kr) on the server once the domain is connected:
 * that one value turns indexing on, fills robots.txt and sitemap.xml with the real address,
 * and makes every canonical and share link absolute. Without it (the demo, the GitHub Pages copy) the site stays hidden.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || undefined;
export const LIVE = Boolean(SITE_URL);
export const ORIGIN = SITE_URL ?? "https://injeong-demo.vercel.app";
export const SITE_NAME = "㈜인정건설";

/** One page's search and share details: its own title and description, its canonical address, its share card. */
export function pageMeta({ title, description, path, image, type = "website" }: { title?: string; description: string; path: string; image?: string; type?: "website" | "article" }) {
  const images = [{ url: image ?? "/sites/injeong/og.jpg", width: 1200, height: 630 }];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: SITE_NAME, locale: "ko_KR", title: title ? `${title} | ${SITE_NAME}` : undefined, description, images },
    twitter: { card: "summary_large_image" as const, title: title ? `${title} | ${SITE_NAME}` : undefined, description, images: images.map((i) => i.url) },
  };
}
