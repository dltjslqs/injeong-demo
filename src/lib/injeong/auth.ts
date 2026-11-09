import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type Account, can, passwordMatches, type Perm, readAccounts, writeAccounts } from "./accounts";

/**
 * Sign-in for the admin. Accounts and their passwords are in accounts.ts; sessions are a cookie
 * signed with ADMIN_SECRET that names the account and the version of its password, so a changed
 * password or a removed account ends that account's sessions everywhere.
 */
const COOKIE = "ij_admin";
const DAYS = 7;

export function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SECRET(32자 이상)가 설정되어 있지 않습니다.");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const accounts = () => readAccounts(secret());
export const saveAccounts = (list: Account[]) => writeAccounts(list, secret());

/** The account for this id and password, or null. */
export async function checkLogin(id: string, password: string): Promise<Account | null> {
  const account = (await accounts()).find((a) => a.id === id);
  return passwordMatches(account, password, process.env.ADMIN_PASSWORD) ? account! : null;
}

export const checkPassword = (account: Account, password: string) => passwordMatches(account, password, process.env.ADMIN_PASSWORD);

export async function startSession(account: Account) {
  const exp = Date.now() + DAYS * 864e5;
  const payload = `${account.id}.${exp}.${account.ver}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 86400,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in account, read fresh so permission changes apply on the next click. */
export async function currentUser(): Promise<Account | null> {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return null;
  const i = v.lastIndexOf(".");
  const payload = v.slice(0, i);
  const [id, exp, ver] = payload.split(".");
  try {
    if (!same(v.slice(i + 1), sign(payload)) || !(Number(exp) > Date.now())) return null;
    const account = (await accounts()).find((a) => a.id === id);
    return account && account.ver === ver ? account : null;
  } catch {
    return null;
  }
}

export const isAdmin = async () => (await currentUser()) !== null;

/**
 * Call at the top of every admin page and every admin action.
 * With `need`, the account must hold that permission ("super" = the 총괄관리자 only).
 */
export async function requireAdmin(need?: Perm | "super"): Promise<Account> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (need && !(need === "super" ? user.role === "super" : can(user, need))) redirect("/admin?denied=1");
  return user;
}
