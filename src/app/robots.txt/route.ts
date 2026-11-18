import { LIVE, ORIGIN } from "@/lib/injeong/site";

export const dynamic = "force-static";

// Daum webmaster tool proves ownership with this line at the bottom of robots.txt
const DAUM = "#DaumWebMasterTool:6e84a5a0f4a14d6f3980bc75c167f8827368152fd5aeea9ddccebd62a921b1a7:LSr9wi71I6+MYd9iMzmuXg==";

/**
 * Open to search engines only once the real domain is set (see lib/injeong/site.ts); the admin and API stay closed.
 * A route instead of app/robots.ts because the metadata version cannot carry the Daum line.
 */
export function GET() {
  const body = LIVE
    ? ["User-Agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "", `Host: ${ORIGIN}`, `Sitemap: ${ORIGIN}/sitemap.xml`, "", DAUM, ""].join("\n")
    : ["User-Agent: *", "Disallow: /", ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
