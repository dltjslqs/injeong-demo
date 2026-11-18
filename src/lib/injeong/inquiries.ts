import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";

/**
 * Quote requests sent from the 견적 문의 form, for the admin.
 * - On Vercel each one is a JSON file in the Blob store under injeong/inquiries/ (see deliverInquiry),
 *   its attachments under inquiry/<date>/.
 * - On a machine without the store (local development) they are folders in .uploads/inquiries/<id>/.
 */
export type InquiryFile = { name: string; url?: string; size?: number };
export type Inquiry = {
  id: string; // the Blob pathname, or the local folder name
  at: string; // "2026-11-18 15:44" (KST)
  type: string;
  size: string;
  region: string;
  name: string;
  phone: string;
  msg: string;
  profile: boolean;
  files: InquiryFile[];
};

const PREFIX = "injeong/inquiries/";
const LOCAL = path.join(process.cwd(), ".uploads", "inquiries");
const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const s = (v: unknown) => (typeof v === "string" ? v : "");

function shape(id: string, d: Record<string, unknown>, fallbackAt: string): Inquiry {
  const raw = Array.isArray(d.files) ? d.files : [];
  const files = raw.map((f) => (typeof f === "string" ? { name: f } : { name: s((f as InquiryFile).name), url: s((f as InquiryFile).url) || undefined, size: Number((f as InquiryFile).size) || undefined }));
  // receivedAt is KST "YYYY-MM-DD HH:mm" on the server; the local copy wrote an ISO time
  const at = s(d.receivedAt);
  const kst = /^\d{4}-\d{2}-\d{2}T/.test(at) ? new Date(Date.parse(at) + 9 * 3600e3).toISOString().slice(0, 16).replace("T", " ") : at || fallbackAt;
  return { id, at: kst, type: s(d.type), size: s(d.size), region: s(d.region), name: s(d.name), phone: s(d.phone), msg: s(d.msg), profile: s(d.profile) === "1", files };
}

/** Every inquiry, newest first. */
export async function listInquiries(): Promise<Inquiry[]> {
  if (blobOn()) {
    const { list } = await import("@vercel/blob");
    const blobs: { pathname: string; url: string; uploadedAt: Date }[] = [];
    let cursor: string | undefined;
    do {
      const r = await list({ prefix: PREFIX, cursor, limit: 1000 });
      blobs.push(...r.blobs);
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
    const items = await Promise.all(
      blobs.map(async (b) => {
        try {
          const d = (await (await fetch(b.url, { cache: "no-store" })).json()) as Record<string, unknown>;
          return shape(b.pathname, d, new Date(b.uploadedAt.getTime() + 9 * 3600e3).toISOString().slice(0, 16).replace("T", " "));
        } catch {
          return null;
        }
      }),
    );
    return items.filter((x): x is Inquiry => x !== null).sort((a, b) => b.at.localeCompare(a.at));
  }
  let dirs: string[] = [];
  try {
    dirs = await readdir(LOCAL);
  } catch {
    return [];
  }
  const items = await Promise.all(
    dirs.map(async (id) => {
      try {
        return shape(id, JSON.parse(await readFile(path.join(LOCAL, id, "inquiry.json"), "utf8")), "");
      } catch {
        return null;
      }
    }),
  );
  return items.filter((x): x is Inquiry => x !== null).sort((a, b) => b.at.localeCompare(a.at));
}

export async function getInquiry(id: string) {
  return (await listInquiries()).find((x) => x.id === id) ?? null;
}

/** Deletes an inquiry and the files sent with it. */
export async function deleteInquiry(id: string) {
  if (blobOn()) {
    if (!id.startsWith(PREFIX) || id.includes("..")) throw new Error("bad id");
    const x = await getInquiry(id);
    const { del, list } = await import("@vercel/blob");
    const self = (await list({ prefix: id, limit: 1 })).blobs.find((b) => b.pathname === id);
    // only files in this site's store, under inquiry/
    const own = (x?.files ?? []).map((f) => f.url).filter((u): u is string => Boolean(u && /^https:\/\/[^/]+\.blob\.vercel-storage\.com\/inquiry\//.test(u)));
    const urls = [...(self ? [self.url] : []), ...own];
    if (urls.length) await del(urls);
    return;
  }
  if (!/^[\w.-]+$/.test(id)) throw new Error("bad id");
  await rm(path.join(LOCAL, id), { recursive: true, force: true });
}

/**
 * Attachments that reached the store but never joined an inquiry (the form failed or was left half way).
 * Only files older than a day, so an upload in progress right now is never counted.
 */
export async function strayFiles(): Promise<{ url: string; pathname: string; size: number }[]> {
  if (!blobOn()) return [];
  const { list } = await import("@vercel/blob");
  const used = new Set((await listInquiries()).flatMap((x) => x.files.map((f) => f.url).filter(Boolean)));
  const out: { url: string; pathname: string; size: number }[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix: "inquiry/", cursor, limit: 1000 });
    for (const b of r.blobs) if (!used.has(b.url) && Date.now() - b.uploadedAt.getTime() > 24 * 3600e3) out.push({ url: b.url, pathname: b.pathname, size: b.size });
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export async function deleteStrayFiles() {
  const files = await strayFiles();
  if (!files.length) return 0;
  const { del } = await import("@vercel/blob");
  await del(files.map((f) => f.url));
  return files.length;
}
