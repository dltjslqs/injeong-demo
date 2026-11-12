import type { MetadataRoute } from "next";
import { LIVE, ORIGIN } from "@/lib/injeong/site";

export const dynamic = "force-static";

/** Open to search engines only once the real domain is set (see lib/injeong/site.ts); the admin and API stay closed. */
export default function robots(): MetadataRoute.Robots {
  if (!LIVE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${ORIGIN}/sitemap.xml`,
    host: ORIGIN,
  };
}
