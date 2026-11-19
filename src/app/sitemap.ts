import type { MetadataRoute } from "next";
import { getColumns, getStories } from "@/lib/injeong/content";
import { ORIGIN } from "@/lib/injeong/site";

export const dynamic = "force-static";
export const revalidate = 3600;

// the last time the fixed pages were reworked; bump it when they change
const PAGES_UPDATED = new Date("2026-11-19");

/** Pages that may rank: the site pages, every published column and story, and the privacy page. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/about/story", "/about/stories", "/business", "/business/education", "/business/public", "/business/factory", "/business/private", "/projects", "/notes", "/contact"].map((p) => ({
    url: `${ORIGIN}${p}`,
    lastModified: PAGES_UPDATED,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const privacy = { url: `${ORIGIN}/privacy`, lastModified: PAGES_UPDATED, changeFrequency: "yearly" as const, priority: 0.2 };
  const columns = (await getColumns()).map((c) => ({
    url: `${ORIGIN}/notes/${c.slug}`,
    ...(c.date ? { lastModified: new Date(c.date.replace(/\./g, "-")) } : {}),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  const stories = (await getStories()).map((x) => ({ url: `${ORIGIN}/about/stories/${x.id}`, lastModified: new Date(x.date), changeFrequency: "yearly" as const, priority: 0.5 }));
  return [...pages, ...columns, ...stories, privacy];
}
