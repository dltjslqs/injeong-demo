import { timingSafeEqual } from "node:crypto";
import { takeSnapshot } from "@/lib/injeong/backup";

export const dynamic = "force-dynamic";

/**
 * The monthly backup. Vercel Cron calls this on the 1st (see vercel.json) with
 * "Authorization: Bearer <CRON_SECRET>"; a request without that header is refused.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== want.length || !timingSafeEqual(given, want)) return new Response("Unauthorized", { status: 401 });
  // the month in Korea time
  const label = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 7);
  const files = await takeSnapshot(label);
  return Response.json({ ok: true, label, files });
}
