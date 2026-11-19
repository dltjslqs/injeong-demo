"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Column } from "@/components/sites/injeong/columns";
import { STORY_CATS, type StoryCat, type StoryPost } from "@/components/sites/injeong/stories";
import { type Category, categories, type Project } from "@/components/sites/injeong/data";
import { headers } from "next/headers";
import { type Account, ID_RULE, MAX_ACCOUNTS, MIN_PASSWORD, passwordFields, PERMS } from "@/lib/injeong/accounts";
import { accounts, checkLogin, checkPassword, endSession, requireAdmin, saveAccounts, startSession } from "@/lib/injeong/auth";
import { sanitizeBlocks } from "@/lib/injeong/coldoc";
import { type Author, allProjects, isBuiltinColumn, isBuiltinProject, MAIN_AUTHOR, type Popup, profileOf, readStories, youtubeIdOf, readColumns, readPopups, readProfiles, readProjects } from "@/lib/injeong/content";
import { logBackup, takeSnapshot } from "@/lib/injeong/backup";
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
  if (t && t.until > Date.now()) return { message: `아이디 또는 비밀번호를 ${MAX_TRIES}회 잘못 입력했습니다. ${Math.ceil((t.until - Date.now()) / 60000)}분 후 다시 시도해 주세요.` };
  // a server that is not set up yet says so, instead of failing with a blank error page
  const missing = [
    (process.env.ADMIN_SECRET ?? "").length < 32 && "ADMIN_SECRET(32자 이상)",
    !process.env.ADMIN_PASSWORD && "ADMIN_PASSWORD",
    process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID && "Blob 저장소 연결(Storage)",
  ].filter(Boolean);
  if (missing.length) return { message: `서버 설정이 완료되지 않았습니다. 환경 변수 ${missing.join(", ")}를 등록하고 다시 배포해 주세요.` };
  let account: Awaited<ReturnType<typeof checkLogin>>;
  try {
    account = await checkLogin(str(fd, "id").toLowerCase(), String(fd.get("password") ?? ""));
  } catch (e) {
    console.error("[admin login]", e);
    return { message: "계정 정보를 읽지 못했습니다. ADMIN_SECRET 값이 처음 설정한 값과 같은지 확인해 주세요." };
  }
  if (!account) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    const n = (t && t.until === 0 ? t.n : 0) + 1;
    tries.set(who, n >= MAX_TRIES ? { n: 0, until: Date.now() + LOCK_MIN * 60000 } : { n, until: 0 });
    return { message: n >= MAX_TRIES ? `아이디 또는 비밀번호를 ${MAX_TRIES}회 잘못 입력했습니다. ${LOCK_MIN}분 후 다시 시도해 주세요.` : `아이디 또는 비밀번호가 일치하지 않습니다. (${n}/${MAX_TRIES})` };
  }
  tries.delete(who);
  await startSession(account);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/** Changes the signed-in account's own password; its other browsers are signed out. */
export async function savePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const now = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (!checkPassword(me, now)) {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "현재 비밀번호가 일치하지 않습니다." };
  }
  if (next.length < MIN_PASSWORD) return { message: `새 비밀번호는 ${MIN_PASSWORD}자 이상으로 입력해 주세요.` };
  if (next !== String(fd.get("again") ?? "")) return { message: "새 비밀번호가 서로 일치하지 않습니다." };
  if (next === now) return { message: "현재 비밀번호와 다른 비밀번호를 입력해 주세요." };
  try {
    const updated: Account = { ...me, ...passwordFields(next) };
    await saveAccounts((await accounts()).map((a) => (a.id === me.id ? updated : a)));
    await startSession(updated);
  } catch (e) {
    return fail(e);
  }
  redirect("/admin/password?saved=1");
}

/* ---------- accounts (총괄관리자 only) ---------- */

/** Adds a 담당자 account, or changes one's name, permissions and (when a new one is typed) password. */
export async function saveAccount(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin("super");
  const editing = str(fd, "editing");
  const id = editing || str(fd, "id").toLowerCase();
  const name = str(fd, "name");
  const password = String(fd.get("password") ?? "");
  const perms = PERMS.map((p) => p.key).filter((k) => fd.getAll("perms").includes(k));
  if (!ID_RULE.test(id)) return { message: "아이디는 영문 소문자와 숫자로 3~20자입니다. (-, _ 가능)" };
  if (!name) return { message: "이름을 입력해 주세요." };
  try {
    const list = await accounts();
    const prev = list.find((a) => a.id === id);
    if (editing && !prev) return { message: "존재하지 않는 계정입니다." };
    if (!editing && prev) return { message: "이미 사용 중인 아이디입니다." };
    if (!editing && list.length >= MAX_ACCOUNTS) return { message: `계정은 ${MAX_ACCOUNTS}개까지 등록할 수 있습니다.` };
    if ((!prev || password) && password.length < MIN_PASSWORD) return { message: `비밀번호는 ${MIN_PASSWORD}자 이상으로 입력해 주세요.` };
    const isSuper = prev?.role === "super";
    if (!isSuper && perms.length === 0) return { message: "담당 메뉴를 하나 이상 선택해 주세요." };
    const next: Account = {
      ...(prev ?? { id, role: "editor" as const, ver: "" }),
      name,
      perms: isSuper ? [] : perms,
      ...(password ? passwordFields(password) : {}),
    };
    await saveAccounts(prev ? list.map((a) => (a.id === id ? next : a)) : [...list, next]);
    await writeProfile(id, fd, name);
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/accounts?saved=1");
}

/** Saves a dated copy of the data on the server, next to the monthly ones. */
export async function snapshotNow() {
  const me = await requireAdmin("super");
  const label = today();
  let changed: string[];
  try {
    changed = await takeSnapshot(label);
    await logBackup({ kind: "manual", by: me.name, label, files: changed.length, changed, ok: true });
  } catch (e) {
    await logBackup({ kind: "manual", by: me.name, label, ok: false, error: e instanceof Error ? e.message : String(e) });
    redirect("/admin/backup?failed=1");
  }
  // redirect() throws, so it stays outside the try above
  redirect(changed.length ? "/admin/backup?saved=1" : "/admin/backup?same=1");
}

export async function removeAccount(fd: FormData) {
  await requireAdmin("super");
  const id = str(fd, "id");
  const list = await accounts();
  // the 총괄관리자 stays: there is always exactly one
  await saveAccounts(list.filter((a) => a.id !== id || a.role === "super"));
  redirect("/admin/accounts");
}

/* ---------- photos inside a column body ---------- */

export async function uploadPhoto(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin("columns");
  const f = file(fd, "photo");
  if (!f) return { message: "사진 파일을 선택해 주세요." };
  try {
    return { url: await saveImage(f) };
  } catch (e) {
    return fail(e);
  }
}

/* ---------- columns ---------- */

export async function saveColumn(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireAdmin("columns");
  const title = str(fd, "title");
  if (!title) return { message: "제목을 입력해 주세요." };
  let blocks: ReturnType<typeof sanitizeBlocks> = [];
  try {
    blocks = sanitizeBlocks(JSON.parse(str(fd, "blocks") || "[]"));
  } catch {
    return { message: "본문을 읽지 못했습니다. 다시 저장해 주세요." };
  }
  if (!blocks.some((b) => b.t === "p" || b.t === "h2")) return { message: "본문을 입력해 주세요." };
  const lede = blocks.find((b) => b.t === "p") as { x: string } | undefined;
  // 예약 발행: a time in Korea time ("2026-11-20T09:00"); a time already past means publish now
  const at = str(fd, "publishAt");
  if (at && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(at)) return { message: "예약 발행 일시를 다시 선택해 주세요." };
  const publishAt = at && at > new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16) ? at : undefined;
  try {
    const o = await readColumns();
    const slug = str(fd, "slug") || `c-${Date.now().toString(36)}`;
    const prev = o.items.find((c) => c.slug === slug);
    const cover = file(fd, "cover");
    const coverUrl = cover ? await saveImage(cover) : fd.get("removeCover") ? undefined : str(fd, "coverUrl") || undefined;
    // the 총괄관리자 picks the writer; a 담당자 keeps the column's writer, or signs a new one as themselves
    const builtinAuthor = isBuiltinColumn(slug) ? MAIN_AUTHOR : undefined;
    const author = me.role === "super" ? str(fd, "author") || MAIN_AUTHOR : prev?.author ?? builtinAuthor ?? me.id;
    const col: Column = {
      n: prev?.n ?? Date.now(),
      slug,
      author,
      cat: str(fd, "cat") || "칼럼",
      series: fd.get("series") ? Number(fd.get("series")) || undefined : undefined,
      cover: str(fd, "cover_id") || undefined,
      coverUrl,
      // a scheduled column is dated the day it goes out, unless a date was entered
      date: str(fd, "date") || (publishAt ?? today()).slice(0, 10).replaceAll("-", "."),
      title,
      sub: str(fd, "sub"),
      meta: str(fd, "meta") || undefined,
      publishAt,
      lede: (lede?.x ?? str(fd, "sub")).replace(/\*\*/g, ""),
      blocks,
    };
    o.items = [...o.items.filter((c) => c.slug !== slug), col];
    await writeJSON("columns", o);
    // a column that is out now is announced to Bing·Naver; a scheduled one is announced by the publish cron
    if (!publishAt && !o.hidden.includes(slug)) {
      const { notifyIndexNow } = await import("@/lib/injeong/indexnow");
      await notifyIndexNow([`/notes/${slug}`, "/notes"]);
    }
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/columns?saved=1");
}

/* ---------- writer profiles ---------- */

/** Saves an account's writer profile from the form's pname / prole / photo / removePhoto fields. */
async function writeProfile(id: string, fd: FormData, fallbackName: string) {
  const profiles = await readProfiles();
  const prev = await profileOf(id, profiles);
  const photo = file(fd, "photo");
  const photoUrl = photo ? await saveImage(photo) : fd.get("removePhoto") ? undefined : prev?.photoUrl;
  const history = str(fd, "phistory").split(/\r?\n/).map((x) => x.trim()).filter(Boolean).slice(0, 8);
  const next: Author = { name: str(fd, "pname") || prev?.name || fallbackName, role: str(fd, "prole"), photoUrl, ...(history.length ? { history } : {}) };
  await writeJSON("profiles", { ...profiles, [id]: next });
}

/** 내 정보: the signed-in account edits its own writer profile. */
export async function saveMyProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireAdmin();
  if (!str(fd, "pname")) return { message: "칼럼에 표시할 이름을 입력해 주세요." };
  try {
    await writeProfile(me.id, fd, me.name);
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/me?saved=1");
}

export async function toggleColumn(fd: FormData) {
  await requireAdmin("columns");
  const slug = str(fd, "slug");
  const o = await readColumns();
  o.hidden = o.hidden.includes(slug) ? o.hidden.filter((s) => s !== slug) : [...o.hidden, slug];
  await writeJSON("columns", o);
  refresh();
  redirect("/admin/columns");
}

/** A new column is removed; an edited built-in column goes back to its original text. */
export async function removeColumn(fd: FormData) {
  await requireAdmin("columns");
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
  await requireAdmin("projects");
  const name = str(fd, "name");
  const cat = str(fd, "cat") as Category;
  const ongoing = Boolean(fd.get("ongoing"));
  if (!name) return { message: "공사명을 입력해 주세요." };
  if (!categories.some((c) => c.key === cat)) return { message: "분류를 선택해 주세요." };
  if (!ongoing && !/^\d{4}\.\d{2}$/.test(str(fd, "done"))) return { message: "준공 연월을 2025.10 형식으로 입력해 주세요." };
  try {
    const o = await readProjects();
    const id = str(fd, "id") || `u-${Date.now().toString(36)}`;
    // the project as it is now, so fields the form does not show (the 조감도 note, a period like 「약 3개월」) survive an edit
    const before = (await allProjects()).find((x) => x.id === id);
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
      period: str(fd, "period") || before?.period || "",
      done: ongoing ? "시공 중" : str(fd, "done"),
      img: imgUrl ? undefined : opt("img"),
      imgUrl,
      // a new photo is a real photo; otherwise keep what the picture was labelled as
      imgNote: photo ? undefined : before?.imgNote,
      region: opt("region"),
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
  await requireAdmin("projects");
  const id = str(fd, "id");
  const o = await readProjects();
  o.hidden = o.hidden.includes(id) ? o.hidden.filter((s) => s !== id) : [...o.hidden, id];
  await writeJSON("projects", o);
  refresh();
  redirect("/admin/projects");
}

export async function removeProject(fd: FormData) {
  await requireAdmin("projects");
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
  await requireAdmin("popups");
  const title = str(fd, "title");
  if (!title) return { message: "팝업 제목을 입력해 주세요." };
  const start = str(fd, "start");
  const end = str(fd, "end");
  if (start && end && start > end) return { message: "종료일이 시작일보다 빠릅니다." };
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
  await requireAdmin("popups");
  const id = str(fd, "id");
  // the button sends the state it asks for, so a second click (or a slow page) cannot flip it back
  const active = str(fd, "active") === "1";
  const list = await readPopups();
  await writeJSON("popups", list.map((p) => (p.id === id ? { ...p, active } : p)));
  refresh();
  redirect("/admin/popups");
}

export async function removePopup(fd: FormData) {
  await requireAdmin("popups");
  const id = str(fd, "id");
  await writeJSON("popups", (await readPopups()).filter((p) => p.id !== id));
  refresh();
  redirect("/admin/popups");
}

/* ---------- 견적 문의 ---------- */

export async function removeInquiry(fd: FormData) {
  await requireAdmin("inquiries");
  const { deleteInquiry } = await import("@/lib/injeong/inquiries");
  await deleteInquiry(str(fd, "id"));
  redirect("/admin/inquiries?saved=1");
}

export async function removeStrayFiles() {
  await requireAdmin("inquiries");
  const { deleteStrayFiles } = await import("@/lib/injeong/inquiries");
  await deleteStrayFiles();
  redirect("/admin/inquiries?saved=1");
}

/* ---------- 회사 이야기 posts ---------- */

export async function saveStory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin("columns");
  const title = str(fd, "title");
  if (!title) return { message: "제목을 입력해 주세요." };
  const cat = str(fd, "cat") as StoryCat;
  if (!STORY_CATS.includes(cat)) return { message: "분류를 선택해 주세요." };
  const date = str(fd, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { message: "날짜를 선택해 주세요." };
  const body = String(fd.get("body") ?? "").replace(/\r\n/g, "\n").trim();
  if (!body) return { message: "본문을 입력해 주세요." };
  const ytRaw = str(fd, "youtube");
  const youtube = ytRaw ? youtubeIdOf(ytRaw) : null;
  if (ytRaw && !youtube) return { message: "유튜브 주소를 확인해 주세요. 예: https://youtu.be/영상번호" };
  try {
    const o = await readStories();
    const id = str(fd, "id") || `s-${Date.now().toString(36)}`;
    const coverFile = file(fd, "cover");
    const cover = coverFile ? await saveImage(coverFile) : str(fd, "coverUrl");
    if (!cover) return { message: "대표 사진을 선택해 주세요." };
    // photos already on the post stay unless unticked; new ones are added after them
    const kept = fd.getAll("keep").map(String).filter(Boolean);
    const added: string[] = [];
    for (const f of fd.getAll("photos")) if (f instanceof File && f.size > 0) added.push(await saveImage(f));
    const post: StoryPost = { id, title, sub: str(fd, "sub"), cat, date, cover, photos: [...kept, ...added].slice(0, 30), body, youtube: youtube ?? undefined };
    o.items = [...o.items.filter((x) => x.id !== id), post];
    await writeJSON("stories", o);
  } catch (e) {
    return fail(e);
  }
  refresh();
  redirect("/admin/stories?saved=1");
}

export async function toggleStory(fd: FormData) {
  await requireAdmin("columns");
  const id = str(fd, "id");
  const off = str(fd, "off") === "1";
  const o = await readStories();
  o.hidden = off ? [...new Set([...o.hidden, id])] : o.hidden.filter((x) => x !== id);
  await writeJSON("stories", o);
  refresh();
  redirect("/admin/stories");
}

/** Deletes a post the admin wrote; for a shipped post it only drops the edits (원본 복원). */
export async function removeStory(fd: FormData) {
  await requireAdmin("columns");
  const id = str(fd, "id");
  const o = await readStories();
  o.items = o.items.filter((x) => x.id !== id);
  await writeJSON("stories", o);
  refresh();
  redirect("/admin/stories");
}
