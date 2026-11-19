import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { allColumns, kstNow } from "@/lib/injeong/content";
import { readJSON, writeJSON } from "@/lib/injeong/store";

export const dynamic = "force-dynamic";

/**
 * 예약 발행. Vercel Cron calls this every 10 minutes (vercel.json) with "Authorization: Bearer <CRON_SECRET>".
 * Pages are cached, so a column whose time has come is not visible until they are rebuilt: when one or more
 * columns are due and not yet released, this rebuilds the site's pages once and remembers them as released.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== want.length || !timingSafeEqual(given, want)) return new Response("Unauthorized", { status: 401 });
  const now = kstNow();
  const key = (c: { slug: string; publishAt?: string }) => `${c.slug}@${c.publishAt}`;
  const released = await readJSON<string[]>("released", []);
  const due = (await allColumns()).filter((c) => !c.off && c.publishAt && c.publishAt <= now && !released.includes(key(c)));
  if (due.length) {
    revalidatePath("/", "layout");
    // keep the list short: only entries for columns that still carry a publish time
    await writeJSON("released", [...released, ...due.map(key)].slice(-200));
  }
  return Response.json({ ok: true, now, released: due.map((c) => c.slug) });
}
