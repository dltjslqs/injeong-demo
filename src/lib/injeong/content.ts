import { columns as builtinColumns, type Column } from "@/components/sites/injeong/columns";
import { type Category, type Project, projects as builtinProjects } from "@/components/sites/injeong/data";
import { builtinStories, type StoryPost } from "@/components/sites/injeong/stories";
import { readJSON } from "./store";

/**
 * The site's content = what ships in the code (columns.ts, data.ts) with the admin's edits laid over it.
 * An edit to a built-in item is stored under the same slug/id; a removal of a built-in item is a "hidden" entry;
 * new items are stored whole.
 */
export type Overlay<T> = { items: T[]; hidden: string[] };
// a fresh object per read: callers change the overlay in place before writing it back
const empty = <T,>(): Overlay<T> => ({ items: [], hidden: [] });

export type Popup = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  linkUrl?: string;
  linkLabel?: string;
  start?: string; // YYYY-MM-DD, inclusive
  end?: string;
  active: boolean;
  updatedAt: string;
};

/**
 * Who signs a column: every admin account has its own writer profile (photo, name, title), kept in "profiles"
 * by account id. A column names its writer in `author`; the built-in columns name none and are signed by
 * MAIN_AUTHOR, the 총괄관리자 account, whose profile starts from the single profile the site used before.
 */
export type Author = { name: string; role: string; photoUrl?: string };
export const DEFAULT_AUTHOR: Author = { name: "김병철", role: "인정건설 이사" };
export const MAIN_AUTHOR = "admin";
const readLegacyAuthor = async (): Promise<Author> => ({ ...DEFAULT_AUTHOR, ...(await readJSON<Partial<Author>>("author", {})) });
export const readProfiles = () => readJSON<Record<string, Author>>("profiles", {});

/** The writer profile of an account; the main account falls back to the old single profile. */
export async function profileOf(id: string, profiles?: Record<string, Author>): Promise<Author | null> {
  const p = (profiles ?? (await readProfiles()))[id];
  if (p) return p;
  return id === MAIN_AUTHOR ? readLegacyAuthor() : null;
}

/** Who signs this column: its writer's profile, or the main account's when it names none (or that account is gone). */
export async function authorOf(c: Pick<Column, "author">): Promise<Author> {
  const profiles = await readProfiles();
  return (c.author && (await profileOf(c.author, profiles))) || (await profileOf(MAIN_AUTHOR, profiles)) || DEFAULT_AUTHOR;
}

export const readColumns = () => readJSON<Overlay<Column>>("columns", empty<Column>());
export const readProjects = () => readJSON<Overlay<Project>>("projects", empty<Project>());
export const readPopups = () => readJSON<Popup[]>("popups", []);

/** 회사 이야기 posts: the shipped ones with the admin's edits laid over, plus the admin's own. */
export const readStories = () => readJSON<Overlay<StoryPost>>("stories", empty<StoryPost>());
export async function allStories(): Promise<(StoryPost & { off: boolean; builtin: boolean })[]> {
  const o = await readStories();
  const edited = new Map(o.items.map((x) => [x.id, x]));
  const builtin = builtinStories.map((x) => ({ ...(edited.get(x.id) ?? x), builtin: true }));
  const added = o.items.filter((x) => !builtinStories.some((b) => b.id === x.id)).map((x) => ({ ...x, builtin: false }));
  return [...added, ...builtin].map((x) => ({ ...x, off: o.hidden.includes(x.id) })).sort((x, y) => (x.date < y.date ? 1 : -1));
}
/** Published posts, newest first. */
export const getStories = async () => (await allStories()).filter((x) => !x.off);

/** The 11-character video id from any YouTube address (watch, youtu.be, shorts, embed, live) or the id itself. */
export function youtubeIdOf(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/(?:shorts|embed|live)\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export const isBuiltinColumn = (slug: string) => builtinColumns.some((c) => c.slug === slug);
export const isBuiltinProject = (id: string) => builtinProjects.some((p) => p.id === id);

/** Every column with an `off` flag; newest admin-written columns first, then the built-in order. */
export async function allColumns(): Promise<(Column & { off: boolean; builtin: boolean })[]> {
  const o = await readColumns();
  const edited = new Map(o.items.map((c) => [c.slug, c]));
  const added = o.items.filter((c) => !isBuiltinColumn(c.slug)).sort((a, b) => b.n - a.n);
  const builtin = builtinColumns.map((c) => edited.get(c.slug) ?? c);
  // withheld: built-in columns the company asked to hold back (rev1 review, 2026.11.19); they stay hidden until the text is edited in the admin
  return [...added.map((c) => ({ ...c, builtin: false })), ...builtin.map((c) => ({ ...c, builtin: true }))].map((c) => ({ ...c, off: o.hidden.includes(c.slug) || Boolean(c.withheld) }));
}

/** Now in Korea time as "YYYY-MM-DDTHH:mm", the form publishAt is stored in. */
export const kstNow = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16);
/** A column set to go out later (예약 발행): hidden from the site until its time. */
export const isScheduled = (c: Pick<Column, "publishAt">) => Boolean(c.publishAt && c.publishAt > kstNow());

export async function getColumns(): Promise<Column[]> {
  return (await allColumns()).filter((c) => !c.off && !isScheduled(c));
}

const order = (p: Project) => (p.ongoing ? "9" : "0") + (p.ongoing ? p.period : p.done);

/** Every project with an `off` flag, ongoing first, then newest completion first. */
export async function allProjects(): Promise<(Project & { off: boolean; builtin: boolean })[]> {
  const o = await readProjects();
  const edited = new Map(o.items.map((p) => [p.id, p]));
  const added = o.items.filter((p) => !isBuiltinProject(p.id)).map((p) => ({ ...p, builtin: false }));
  const builtin = builtinProjects.map((p) => ({ ...(edited.get(p.id) ?? p), builtin: true }));
  return [...added, ...builtin].sort((a, b) => order(b).localeCompare(order(a))).map((p) => ({ ...p, off: o.hidden.includes(p.id) }));
}

export async function getProjects(): Promise<Project[]> {
  return (await allProjects()).filter((p) => !p.off);
}

/** Completed-project counts shown on the site: every listed project, counted once. */
export function doneCount(list: Project[], cat?: Category) {
  return list.filter((p) => !p.ongoing && (!cat || p.cat === cat)).length;
}

export function totalCount(list: Project[], cat?: Category) {
  return list.filter((p) => !cat || p.cat === cat).length;
}

/** The popup to show today (Korea time), if any. */
export async function activePopup(): Promise<Popup | null> {
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const list = await readPopups();
  return list.find((p) => p.active && (!p.start || p.start <= today) && (!p.end || p.end >= today)) ?? null;
}
