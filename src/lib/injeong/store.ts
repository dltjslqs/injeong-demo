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

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    if (blobOn()) {
      const { head } = await import("@vercel/blob");
      const meta = await head(`injeong/${key}.json`);
      const res = await fetch(`${meta.url}?v=${Date.parse(String(meta.uploadedAt)) || Date.now()}`, { cache: "no-store" });
      return res.ok ? ((await res.json()) as T) : fallback;
    }
    return JSON.parse(await readFile(path.join(ROOT, `${key}.json`), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (blobOn()) {
    const { put } = await import("@vercel/blob");
    await put(`injeong/${key}.json`, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 });
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
