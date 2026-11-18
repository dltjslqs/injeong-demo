import { LIVE, ORIGIN } from "@/lib/injeong/site";

export const dynamic = "force-static";

// Daum webmaster tool proves ownership with this line at the bottom of robots.txt
const DAUM = "#DaumWebMasterTool:1374b54687b8e149ea34b32d58b7976c683bcc6747a5aaad2c2240ee02627668:LSr9wi71I6+MYd9iMzmuXg==";

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
