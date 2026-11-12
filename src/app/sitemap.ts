import type { MetadataRoute } from "next";
import { getColumns } from "@/lib/injeong/content";
import { ORIGIN } from "@/lib/injeong/site";

export const dynamic = "force-static";
export const revalidate = 3600;

/** Only pages that may rank: the six site pages and every published column. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/business", "/projects", "/notes", "/contact"].map((p) => ({
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
  return [...pages, ...columns];
}
