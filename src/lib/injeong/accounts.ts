import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readJSON, writeJSON } from "./store";

/**
 * Admin accounts: one 총괄관리자 (super) who manages the accounts and can do everything, and up to
 * four 담당자 (editor) accounts that each get some of: 기술 칼럼, 시공 실적, 팝업.
 *
 * Until anything is saved there is one account, `admin`, whose password is ADMIN_PASSWORD from the
 * environment. Passwords set in the admin are kept as salted scrypt hashes, and the whole list is
 * encrypted with ADMIN_SECRET before it is stored, because the store can be a public blob.
 * Deleting the stored "accounts" entry puts the environment account back (the way out of a lockout).
 */
export type Perm = "columns" | "projects" | "popups";
export const PERMS: { key: Perm; label: string }[] = [
  { key: "columns", label: "기술 칼럼" },
  { key: "projects", label: "시공 실적" },
  { key: "popups", label: "팝업" },
];
export type Account = {
  id: string;
  name: string;
  role: "super" | "editor";
  perms: Perm[];
  /** absent while the account still uses the environment password */
  salt?: string;
  hash?: string;
  /** changes with the password; sessions carry it, so a new password signs the account out elsewhere */
  ver: string;
};

export const MAX_ACCOUNTS = 5;
export const MIN_PASSWORD = 10;
export const ID_RULE = /^[a-z0-9][a-z0-9_-]{2,19}$/;
const FIRST: Account = { id: "admin", name: "총괄관리자", role: "super", perms: [], ver: "env" };

const key = (secret: string) => createHash("sha256").update(secret).digest();

function seal(value: unknown, secret: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(secret), iv);
  const body = Buffer.concat([c.update(JSON.stringify(value), "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString("base64");
}

function open<T>(sealed: string, secret: string): T | null {
  try {
    const raw = Buffer.from(sealed, "base64");
    const d = createDecipheriv("aes-256-gcm", key(secret), raw.subarray(0, 12));
    d.setAuthTag(raw.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString("utf8")) as T;
  } catch {
    return null;
  }
}

export async function readAccounts(secret: string): Promise<Account[]> {
  const stored = await readJSON<{ sealed?: string }>("accounts", {});
  const list = stored.sealed ? open<Account[]>(stored.sealed, secret) : null;
  return list && list.some((a) => a.role === "super") ? list : [{ ...FIRST }];
}

export async function writeAccounts(list: Account[], secret: string) {
  await writeJSON("accounts", { sealed: seal(list, secret) });
}

const digest = (password: string, salt: string) => scryptSync(password, Buffer.from(salt, "base64"), 32);

/** The fields a new password puts on an account. */
export function passwordFields(password: string): Pick<Account, "salt" | "hash" | "ver"> {
  const salt = randomBytes(16).toString("base64");
  return { salt, hash: digest(password, salt).toString("base64"), ver: `${Date.now().toString(36)}${randomBytes(2).toString("hex")}` };
}

const same = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

/** `envPassword` is what an account without its own password is checked against. */
export function passwordMatches(account: Account | undefined, password: string, envPassword: string | undefined) {
  if (account?.salt && account.hash) return same(digest(password, account.salt), Buffer.from(account.hash, "base64"));
  // unknown id, or the environment account: do the same amount of work either way
  const salt = "AAAAAAAAAAAAAAAAAAAAAA==";
  const given = digest(password, salt);
  return Boolean(account && envPassword) && same(given, digest(envPassword!, salt));
}

export const can = (account: Account, perm: Perm) => account.role === "super" || account.perms.includes(perm);
