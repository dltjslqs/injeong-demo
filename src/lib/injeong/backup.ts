import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { readJSON, readText, writeJSON } from "./store";

/**
 * Backups of what the admin writes (see store.ts for where it lives).
 * A snapshot is a dated folder on the server holding only the data files that changed since the snapshot
 * before it; when nothing changed, no snapshot is made. Reading a snapshot (readAt) fills in each unchanged
 * file from the newest older snapshot, so every snapshot still downloads as the full state of that day.
 * Photos are not copied, because an uploaded photo never changes. The ZIP the 총괄관리자 downloads holds both.
 */
const ROOT = path.join(process.cwd(), ".data", "injeong");
// Vercel connects a Blob store either with a token or, on newer projects, with a store id (OIDC)
const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

/** Every data file, by key. The accounts file is stored encrypted and is backed up as it is. */
export const STORE_KEYS = ["columns", "projects", "popups", "profiles", "author", "accounts"] as const;
const KEEP_SNAPSHOTS = 12;
const LABEL = /^\d{4}-\d{2}(-\d{2})?$/;

/** The stored text of one key, from a snapshot when a label is given; null when there is none. */
export async function readRaw(key: string, snapshot?: string): Promise<string | null> {
  if (!snapshot) return readText(key).catch(() => null);
  const rel = `backups/${snapshot}/${key}.json`;
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

async function writeSnapshotFile(label: string, key: string, body: string) {
  if (blobOn()) {
    const { put } = await import("@vercel/blob");
    await put(`injeong/backups/${label}/${key}.json`, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  } else {
    await mkdir(path.join(ROOT, "backups", label), { recursive: true });
    await writeFile(path.join(ROOT, "backups", label, `${key}.json`), body, "utf8");
  }
}

async function deleteSnapshot(label: string) {
  if (blobOn()) {
    const { del, list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: `injeong/backups/${label}/` });
    if (blobs.length) await del(blobs.map((b) => b.url));
  } else {
    await rm(path.join(ROOT, "backups", label), { recursive: true, force: true });
  }
}

/** A key as it stood at a snapshot: that snapshot's own file, or the newest older snapshot that has one. */
export async function readAt(key: string, label: string, labels?: string[]): Promise<string | null> {
  for (const l of (labels ?? (await listSnapshots())).filter((x) => x <= label)) {
    const body = await readRaw(key, l);
    if (body !== null) return body;
  }
  return null;
}

/**
 * Saves to backups/<label> only the keys that differ from the newest snapshot, and returns them
 * (empty: nothing changed, nothing saved). Then keeps the newest KEEP_SNAPSHOTS; before an old one
 * goes, the files the oldest kept snapshot relies on are copied into it, so it stays complete.
 */
export async function takeSnapshot(label: string): Promise<string[]> {
  if (!LABEL.test(label)) throw new Error("백업 이름이 올바르지 않습니다.");
  const before = await listSnapshots();
  const latest = before[0];
  const changed: string[] = [];
  for (const key of STORE_KEYS) {
    const now = await readRaw(key);
    if (now === null) continue;
    const prev = latest ? await readAt(key, latest, before) : null;
    if (now === prev) continue;
    await writeSnapshotFile(label, key, now);
    changed.push(key);
  }
  if (!changed.length) return changed;

  const all = await listSnapshots();
  const old = all.slice(KEEP_SNAPSHOTS);
  const keepOldest = all[KEEP_SNAPSHOTS - 1];
  if (old.length && keepOldest) {
    for (const key of STORE_KEYS) {
      if ((await readRaw(key, keepOldest)) !== null) continue;
      const carried = await readAt(key, old[0], old);
      if (carried !== null) await writeSnapshotFile(keepOldest, key, carried);
    }
  }
  for (const l of old) await deleteSnapshot(l);
  return changed;
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
  files?: number; // data files saved (0: nothing had changed, so nothing was saved)
  changed?: string[]; // the keys saved
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

/** What each key is called on the admin screens. */
export const KEY_LABEL: Record<string, string> = { columns: "기술 칼럼", projects: "시공 실적", popups: "팝업", profiles: "작성자 프로필", author: "작성자 프로필(이전 방식)", accounts: "관리자 계정" };
