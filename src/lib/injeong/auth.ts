import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * One admin account: the password is ADMIN_PASSWORD, sessions are signed with ADMIN_SECRET.
 * Both live in the server's environment (.env.local locally), never in the code.
 */
const COOKIE = "ij_admin";
const DAYS = 7;

function secret() {
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

export function passwordMatches(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  // compare digests so the length of the real password is not leaked
  const h = (v: string) => createHmac("sha256", "pw").update(v).digest("hex");
  return same(h(input), h(pw));
}

export async function startSession() {
  const exp = Date.now() + DAYS * 864e5;
  const payload = `admin.${exp}`;
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

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const i = v.lastIndexOf(".");
  const payload = v.slice(0, i);
  const exp = Number(payload.split(".")[1]);
  try {
    return same(v.slice(i + 1), sign(payload)) && exp > Date.now();
  } catch {
    return false;
  }
}

/** Call at the top of every admin page and every admin action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
