import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Where the admin's edits live.
 * - On a server with a disk (next start / standalone): .data/injeong/*.json, uploads in .data/injeong/uploads.
 * - On Vercel: connect a Blob store (BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID) and the same keys go to Vercel Blob.
 */
const ROOT = path.join(process.cwd(), ".data", "injeong");
// Vercel connects a Blob store either with a token or, on newer projects, with a store id (OIDC)
const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** The store's public address for a file, read without credentials (the store is public). */
function publicUrl(pathname: string): string | null {
  const id = (process.env.BLOB_STORE_ID ?? process.env.BLOB_READ_WRITE_TOKEN?.split("_")[3] ?? "").replace(/^store_/, "").toLowerCase();
  return id ? `https://${id}.public.blob.vercel-storage.com/${pathname}` : null;
}

/*
 * On Blob every save is a new file, injeong/data/<key>/<time>.json, and a read takes the newest one from the
 * store's list. Overwriting one file was not enough: the CDN in front of the store can hand back the old copy for
 * up to a minute, so a list read right after "중지" or "삭제" still showed the old state.
 * Each save also refreshes injeong/<key>.json, the older single-file layout, which is read only when the list
 * cannot be reached (and is where data saved before this change still lives).
 */
const VERSIONS_KEPT = 5;
const versionsPrefix = (key: string) => `injeong/data/${key}/`;

/** The newest saved text of a key, or null when nothing was saved. */
export async function readText(key: string): Promise<string | null> {
  if (!blobOn()) {
    try {
      return await readFile(path.join(ROOT, `${key}.json`), "utf8");
    } catch {
      return null;
    }
  }
  const { head, list, BlobNotFoundError } = await import("@vercel/blob");
  const legacy = `injeong/${key}.json`;
  let url: string | null = null;
  try {
    const { blobs } = await list({ prefix: versionsPrefix(key) });
    // names start with the save time, zero-padded, so the largest name is the newest save
    const newest = blobs.sort((x, y) => (x.pathname < y.pathname ? 1 : -1))[0];
    if (newest) url = newest.url; // a version is never overwritten, so any cached copy of it is current
    else {
      try {
        const meta = await head(legacy);
        url = `${meta.url}?v=${Date.parse(String(meta.uploadedAt)) || meta.etag}`;
      } catch (e) {
        if (e instanceof BlobNotFoundError) return null;
        throw e;
      }
    }
  } catch (e) {
    // no credentials while a page rebuilds in the background: read the public single-file copy
    console.error(`[store] list ${key}:`, e instanceof Error ? e.message : e);
    const pub = publicUrl(legacy);
    if (!pub) return null;
    url = `${pub}?v=${Math.floor(Date.now() / 60000)}`;
  }
  // never cache: "no-store" here: it stops the site's pages from rebuilding after a save
  const res = await fetch(url, { cache: "force-cache" });
  return res.ok ? await res.text() : null;
}

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const text = await readText(key);
    return text === null ? fallback : (JSON.parse(text) as T);
  } catch (e) {
    if (blobOn()) console.error(`[store] read ${key}:`, e instanceof Error ? e.message : e);
    return fallback;
  }
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (blobOn()) {
    const { del, list, put } = await import("@vercel/blob");
    const name = `${String(Date.now()).padStart(15, "0")}-${randomBytes(3).toString("hex")}.json`;
    await put(`${versionsPrefix(key)}${name}`, body, { access: "public", addRandomSuffix: false, contentType: "application/json" });
    await put(`injeong/${key}.json`, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 });
    try {
      const { blobs } = await list({ prefix: versionsPrefix(key) });
      const old = blobs.sort((x, y) => (x.pathname < y.pathname ? 1 : -1)).slice(VERSIONS_KEPT);
      if (old.length) await del(old.map((b) => b.url));
    } catch (e) {
      console.error(`[store] prune ${key}:`, e instanceof Error ? e.message : e);
    }
    return;
  }
  await mkdir(ROOT, { recursive: true });
  await writeFile(path.join(ROOT, `${key}.json`), body, "utf8");
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_IMAGE_MB = 10;

/** Saves an uploaded photo and returns the URL the site uses for it. */
export async function saveImage(file: File): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("사진은 JPG, PNG, WEBP 파일만 올릴 수 있습니다.");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`사진은 ${MAX_IMAGE_MB}MB까지 올릴 수 있습니다.`);
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  if (blobOn()) {
    const { put } = await import("@vercel/blob");
    const res = await put(`injeong/uploads/${name}`, bytes, { access: "public", addRandomSuffix: false, contentType: file.type });
    return res.url;
  }
  const dir = path.join(ROOT, "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/api/uploads/${name}`;
}

/** Local-disk uploads, served by /api/uploads/[name]. */
export async function readUpload(name: string): Promise<{ bytes: Buffer; type: string } | null> {
  if (!/^[a-z0-9]+-[a-f0-9]{8}\.(jpg|png|webp)$/.test(name)) return null;
  try {
    const bytes = await readFile(path.join(ROOT, "uploads", name));
    const ext = name.split(".").pop()!;
    return { bytes, type: ext === "jpg" ? "image/jpeg" : `image/${ext}` };
  } catch {
    return null;
  }
}
