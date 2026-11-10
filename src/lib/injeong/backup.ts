import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJSON, writeJSON } from "./store";

/**
 * Backups of what the admin writes (see store.ts for where it lives).
 * A snapshot is a dated copy of the data files kept on the server; the photos are not copied,
 * because an uploaded photo never changes. The ZIP the 총괄관리자 downloads holds both.
 */
const ROOT = path.join(process.cwd(), ".data", "injeong");
// Vercel connects a Blob store either with a token or, on newer projects, with a store id (OIDC)
const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** Every data file, by key. The accounts file is stored encrypted and is backed up as it is. */
export const STORE_KEYS = ["columns", "projects", "popups", "author", "accounts"] as const;
const KEEP_SNAPSHOTS = 12;
const LABEL = /^\d{4}-\d{2}(-\d{2})?$/;

/** The stored text of one key, from a snapshot when a label is given; null when there is none. */
export async function readRaw(key: string, snapshot?: string): Promise<string | null> {
  const rel = snapshot ? `backups/${snapshot}/${key}.json` : `${key}.json`;
  try {
    if (blobOn()) {
      const { head } = await import("@vercel/blob");
      const meta = await head(`injeong/${rel}`);
      const res = await fetch(`${meta.url}?v=${Date.now()}`, { cache: "no-store" });
      return res.ok ? await res.text() : null;
    }
    return await readFile(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

/** Snapshot labels (2026-11 for the monthly ones, 2026-11-10 for one taken by hand), newest first. */
export async function listSnapshots(): Promise<string[]> {
  try {
    let labels: string[];
    if (blobOn()) {
      const { list } = await import("@vercel/blob");
      const { folders } = await list({ prefix: "injeong/backups/", mode: "folded" });
      labels = folders.map((f) => f.replace(/\/$/, "").split("/").pop() ?? "");
    } else {
      labels = await readdir(path.join(ROOT, "backups"));
    }
    return labels.filter((l) => LABEL.test(l)).sort().reverse();
  } catch {
    return [];
  }
}

/** Copies the data as it is now to backups/<label>, then drops all but the newest KEEP_SNAPSHOTS. */
export async function takeSnapshot(label: string): Promise<number> {
  if (!LABEL.test(label)) throw new Error("백업 이름이 올바르지 않습니다.");
  let n = 0;
  for (const key of STORE_KEYS) {
    const body = await readRaw(key);
    if (body === null) continue;
    if (blobOn()) {
      const { put } = await import("@vercel/blob");
      await put(`injeong/backups/${label}/${key}.json`, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
    } else {
      await mkdir(path.join(ROOT, "backups", label), { recursive: true });
      await writeFile(path.join(ROOT, "backups", label, `${key}.json`), body, "utf8");
    }
    n++;
  }
  for (const old of (await listSnapshots()).slice(KEEP_SNAPSHOTS)) {
    if (blobOn()) {
      const { del, list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: `injeong/backups/${old}/` });
      if (blobs.length) await del(blobs.map((b) => b.url));
    } else {
      await rm(path.join(ROOT, "backups", old), { recursive: true, force: true });
    }
  }
  return n;
}

/** Every uploaded photo: its file name and a way to read it. */
export async function listUploads(): Promise<{ name: string; read: () => Promise<Uint8Array> }[]> {
  try {
    if (blobOn()) {
      const { list } = await import("@vercel/blob");
      const out: { name: string; read: () => Promise<Uint8Array> }[] = [];
      let cursor: string | undefined;
      do {
        const page = await list({ prefix: "injeong/uploads/", cursor });
        for (const b of page.blobs) out.push({ name: b.pathname.split("/").pop() ?? b.pathname, read: async () => new Uint8Array(await (await fetch(b.url)).arrayBuffer()) });
        cursor = page.cursor;
      } while (cursor);
      return out;
    }
    const dir = path.join(ROOT, "uploads");
    return (await readdir(dir)).map((name) => ({ name, read: async () => new Uint8Array(await readFile(path.join(dir, name))) }));
  } catch {
    return [];
  }
}

/* ---------- history ---------- */

/** One line of the backup history: an automatic or manual copy on the server, or a download. */
export type BackupEvent = {
  at: string; // ISO time
  kind: "auto" | "manual" | "download" | "download-snapshot";
  by: string; // the account's name, or "자동" for the monthly run
  label?: string; // the snapshot it made or downloaded
  files?: number; // data files copied
  ok: boolean;
  error?: string;
};
const KEEP_EVENTS = 200;

/** The history, newest first. */
export const readBackupLog = () => readJSON<BackupEvent[]>("backup-log", []);

/** Adds a line to the history; a failure to write it never stops the backup itself. */
export async function logBackup(e: Omit<BackupEvent, "at">): Promise<void> {
  try {
    const list = await readBackupLog();
    await writeJSON("backup-log", [{ at: new Date().toISOString(), ...e }, ...list].slice(0, KEEP_EVENTS));
  } catch (err) {
    console.error("[backup-log]", err);
  }
}
