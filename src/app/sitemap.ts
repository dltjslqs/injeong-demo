import type { MetadataRoute } from "next";
import { getColumns, getVideos } from "@/lib/injeong/content";
import { ORIGIN } from "@/lib/injeong/site";

export const dynamic = "force-static";
export const revalidate = 3600;

/** Only pages that may rank: the six site pages and every published column. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/about/story", "/business", "/projects", "/notes", "/contact"].map((p) => ({
    url: `${ORIGIN}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const columns = (await getColumns()).map((c) => ({
    url: `${ORIGIN}/notes/${c.slug}`,
    ...(c.date ? { lastModified: new Date(c.date.replace(/\./g, "-")) } : {}),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  // the 회사 이야기 tab only once it has a video to show
  const videos = (await getVideos()).length ? [{ url: `${ORIGIN}/about/stories`, changeFrequency: "monthly" as const, priority: 0.6 }] : [];
  return [...pages, ...videos, ...columns];
}
