"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Column } from "@/components/sites/injeong/columns";
import { type Category, categories, type Project } from "@/components/sites/injeong/data";
import { headers } from "next/headers";
import { changePassword, endSession, passwordMatches, requireAdmin, startSession } from "@/lib/injeong/auth";
import { MIN_PASSWORD } from "@/lib/injeong/cred";
import { sanitizeBlocks } from "@/lib/injeong/coldoc";
import { isBuiltinColumn, isBuiltinProject, type Popup, readAuthor, readColumns, readPopups, readProjects } from "@/lib/injeong/content";
import { saveImage, writeJSON } from "@/lib/injeong/store";

export type FormState = { message?: string; url?: string } | null;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const file = (fd: FormData, k: string) => {
  const f = fd.get(k);
  return f && typeof f !== "string" && f.size > 0 ? f : null;
};
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const refresh = () => revalidatePath("/", "layout");
const fail = (e: unknown): FormState => ({ message: e instanceof Error ? e.message : "저장하지 못했습니다. 다시 시도해 주세요." });

/* ---------- login ---------- */

// wrong passwords per address: after MAX_TRIES in a row the address waits LOCK_MIN minutes
const MAX_TRIES = 5;
const LOCK_MIN = 15;
const tries = new Map<string, { n: number; until: number }>();
const caller = async () => (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const who = await caller();
  const t = tries.get(who);
  if (t && t.until > Date.now()) return { message: `비밀번호를 ${MAX_TRIES}번 틀렸습니다. ${Math.ceil((t.until - Date.now()) / 60000)}분 뒤에 다시 시도해 주세요.` };
  if (!(await passwordMatches(str(fd, "password")))) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    const n = (t && t.until === 0 ? t.n : 0) + 1;
    tries.set(who, n >= MAX_TRIES ? { n: 0, until: Date.now() + LOCK_MIN * 60000 } : { n, until: 0 });
    return { message: n >= MAX_TRIES ? `비밀번호를 ${MAX_TRIES}번 틀렸습니다. ${LOCK_MIN}분 뒤에 다시 시도해 주세요.` : `비밀번호가 맞지 않습니다. (${n}/${MAX_TRIES})` };
  }
  tries.delete(who);
  await startSession();
  redirect("/admin");
}

/** Changes the admin password; every other signed-in browser is signed out. */
export async function savePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const now = str(fd, "current");
  const next = String(fd.get("next") ?? "");
  if (!(await passwordMatches(now))) {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "지금 비밀번호가 맞지 않습니다." };
  }
  if (next.length < MIN_PASSWORD) return { message: `새 비밀번호는 ${MIN_PASSWORD}자 이상으로 정해 주세요.` };
  if (next !== String(fd.get("again") ?? "")) return { message: "새 비밀번호 두 칸이 서로 다릅니다." };
  if (next === now) return { message: "지금 비밀번호와 다른 것으로 정해 주세요." };
  try {
    await changePassword(next);
    await startSession();
  } catch (e) {
    return fail(e);
  }
  redirect("/admin/password?saved=1");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ---------- photos inside a column body ---------- */

export async function uploadPhoto(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const f = file(fd, "photo");
  if (!f) return { message: "사진 파일을 골라 주세요." };
  try {
    return { url: await saveImage(f) };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- columns ---------- */

export async function saveColumn(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  if (!title) return { message: "제목을 적어 주세요." };
  let blocks: ReturnType<typeof sanitizeBlocks> = [];
  try {
    blocks = sanitizeBlocks(JSON.parse(str(fd, "blocks") || "[]"));
  } catch {
    return { message: "본문을 읽지 못했습니다. 다시 저장해 주세요." };
  }
  if (!blocks.some((b) => b.t === "p" || b.t === "h2")) return { message: "본문을 적어 주세요." };
  const lede = blocks.find((b) => b.t === "p") as { x: string } | undefined;
  try {
    const o = await readColumns();
    const slug = str(fd, "slug") || `c-${Date.now().toString(36)}`;
    const prev = o.items.find((c) => c.slug === slug);
    const cover = file(fd, "cover");
    const coverUrl = cover ? await saveImage(cover) : fd.get("removeCover") ? undefined : str(fd, "coverUrl") || undefined;
    const col: Column = {
      n: prev?.n ?? Date.now(),
      slug,
      cat: str(fd, "cat") || "칼럼",
      series: fd.get("series") ? Number(fd.get("series")) || undefined : undefined,
      cover: str(fd, "cover_id") || undefined,
      coverUrl,
      date: str(fd, "date") || today().replaceAll("-", "."),
      title,
      sub: str(fd, "sub"),
      lede: (lede?.x ?? str(fd, "sub")).replace(/\*\*/g, ""),
      blocks,
    };
    o.items = [...o.items.filter((c) => c.slug !== slug), col];
    await writeJSON("columns", o);
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/columns?saved=1");
}

/** The columns' author: name, title and profile photo. */
export async function saveAuthor(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(fd, "name");
  if (!name) return { message: "이름을 적어 주세요." };
  try {
    const prev = await readAuthor();
    const photo = file(fd, "photo");
    const photoUrl = photo ? await saveImage(photo) : fd.get("removePhoto") ? undefined : prev.photoUrl;
    await writeJSON("author", { name, role: str(fd, "role"), photoUrl });
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/columns/author?saved=1");
}

export async function toggleColumn(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, "slug");
  const o = await readColumns();
  o.hidden = o.hidden.includes(slug) ? o.hidden.filter((s) => s !== slug) : [...o.hidden, slug];
  await writeJSON("columns", o);
  refresh();
  redirect("/admin/columns");
}

/** A new column is removed; an edited built-in column goes back to its original text. */
export async function removeColumn(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, "slug");
  const o = await readColumns();
  o.items = o.items.filter((c) => c.slug !== slug);
  if (!isBuiltinColumn(slug)) o.hidden = o.hidden.filter((s) => s !== slug);
  await writeJSON("columns", o);
  refresh();
  redirect("/admin/columns");
}

/* ---------- projects ---------- */

export async function saveProject(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(fd, "name");
  const cat = str(fd, "cat") as Category;
  const ongoing = Boolean(fd.get("ongoing"));
  if (!name) return { message: "공사명을 적어 주세요." };
  if (!categories.some((c) => c.key === cat)) return { message: "분류를 골라 주세요." };
  if (!ongoing && !/^\d{4}\.\d{2}$/.test(str(fd, "done"))) return { message: "준공 연월을 2025.10 형식으로 적어 주세요." };
  try {
    const o = await readProjects();
    const id = str(fd, "id") || `u-${Date.now().toString(36)}`;
    const photo = file(fd, "photo");
    const imgUrl = photo ? await saveImage(photo) : fd.get("removePhoto") ? undefined : str(fd, "imgUrl") || undefined;
    const opt = (k: string) => str(fd, k) || undefined;
    const p: Project = {
      id,
      cat,
      name,
      client: str(fd, "client"),
      use: str(fd, "use"),
      scale: str(fd, "scale"),
      area: opt("area"),
      cost: opt("cost"),
      share: opt("share"),
      period: str(fd, "period"),
      done: ongoing ? "시공 중" : str(fd, "done"),
      img: imgUrl ? undefined : opt("img"),
      imgUrl,
      ongoing: ongoing || undefined,
    };
    o.items = [...o.items.filter((x) => x.id !== id), p];
    await writeJSON("projects", o);
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/projects?saved=1");
}

export async function toggleProject(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const o = await readProjects();
  o.hidden = o.hidden.includes(id) ? o.hidden.filter((s) => s !== id) : [...o.hidden, id];
  await writeJSON("projects", o);
  refresh();
  redirect("/admin/projects");
}

export async function removeProject(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const o = await readProjects();
  o.items = o.items.filter((p) => p.id !== id);
  if (!isBuiltinProject(id)) o.hidden = o.hidden.filter((s) => s !== id);
  await writeJSON("projects", o);
  refresh();
  redirect("/admin/projects");
}

/* ---------- popups ---------- */

export async function savePopup(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  if (!title) return { message: "팝업 제목을 적어 주세요." };
  const start = str(fd, "start");
  const end = str(fd, "end");
  if (start && end && start > end) return { message: "끝나는 날이 시작하는 날보다 앞입니다." };
  const link = str(fd, "linkUrl");
  if (link && !/^(https?:\/\/|\/)/.test(link)) return { message: "링크는 https:// 또는 /로 시작해야 합니다." };
  try {
    const list = await readPopups();
    const id = str(fd, "id") || `pop-${Date.now().toString(36)}`;
    const image = file(fd, "image");
    const imageUrl = image ? await saveImage(image) : fd.get("removeImage") ? undefined : str(fd, "imageUrl") || undefined;
    const p: Popup = {
      id,
      title,
      body: str(fd, "body"),
      imageUrl,
      linkUrl: link || undefined,
      linkLabel: str(fd, "linkLabel") || undefined,
      start: start || undefined,
      end: end || undefined,
      active: Boolean(fd.get("active")),
      updatedAt: new Date().toISOString(),
    };
    await writeJSON("popups", [p, ...list.filter((x) => x.id !== id)]);
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/popups?saved=1");
}

export async function togglePopup(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const list = await readPopups();
  await writeJSON("popups", list.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  refresh();
  redirect("/admin/popups");
}

export async function removePopup(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await writeJSON("popups", (await readPopups()).filter((p) => p.id !== id));
  refresh();
  redirect("/admin/popups");
}
