import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readJSON, writeJSON } from "./store";

/**
 * The admin password once it has been changed in the admin.
 * Until then the password is ADMIN_PASSWORD from the environment; after a change this record wins.
 * The record holds a salted scrypt hash, and the whole record is encrypted with ADMIN_SECRET before
 * it is stored, because the store can be a public blob. Deleting the stored "auth" entry puts the
 * environment password back in force (the way out of a forgotten password).
 */
export type Cred = { salt: string; hash: string; ver: string };
export const MIN_PASSWORD = 10;

const key = (secret: string) => createHash("sha256").update(secret).digest();

function seal(value: Cred, secret: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(secret), iv);
  const body = Buffer.concat([c.update(JSON.stringify(value), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString("base64");
}

function open(sealed: string, secret: string): Cred | null {
  try {
    const raw = Buffer.from(sealed, "base64");
    const d = createDecipheriv("aes-256-gcm", key(secret), raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString("utf8")) as Cred;
  } catch {
    return null;
  }
}

const digest = (password: string, salt: string) => scryptSync(password, Buffer.from(salt, "base64"), 32);

export async function readCred(secret: string): Promise<Cred | null> {
  const stored = await readJSON<{ sealed?: string }>("auth", {});
  return stored.sealed ? open(stored.sealed, secret) : null;
}

export async function writeCred(password: string, secret: string): Promise<Cred> {
  const salt = randomBytes(16).toString("base64");
  const cred: Cred = { salt, hash: digest(password, salt).toString("base64"), ver: Date.now().toString(36) };
  await writeJSON("auth", { sealed: seal(cred, secret) });
  return cred;
}

export function credMatches(cred: Cred, password: string) {
  const a = digest(password, cred.salt);
  const b = Buffer.from(cred.hash, "base64");
  return a.length === b.length && timingSafeEqual(a, b);
}
