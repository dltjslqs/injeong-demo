import { timingSafeEqual } from "node:crypto";
import { logBackup, takeSnapshot } from "@/lib/injeong/backup";

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
  // the day in Korea time, so it sorts with the ones taken by hand
  const label = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  try {
    const changed = await takeSnapshot(label);
    await logBackup({ kind: "auto", by: "자동", label, files: changed.length, changed, ok: true });
    return Response.json({ ok: true, label, changed });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    await logBackup({ kind: "auto", by: "자동", label, ok: false, error });
    return Response.json({ ok: false, label, error }, { status: 500 });
  }
}
