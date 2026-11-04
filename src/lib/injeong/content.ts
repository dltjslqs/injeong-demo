import { columns as builtinColumns, type Column } from "@/components/sites/injeong/columns";
import { type Category, type Project, projects as builtinProjects, RECORD_SCALE } from "@/components/sites/injeong/data";
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

export const readColumns = () => readJSON<Overlay<Column>>("columns", empty<Column>());
export const readProjects = () => readJSON<Overlay<Project>>("projects", empty<Project>());
export const readPopups = () => readJSON<Popup[]>("popups", []);

export const isBuiltinColumn = (slug: string) => builtinColumns.some((c) => c.slug === slug);
export const isBuiltinProject = (id: string) => builtinProjects.some((p) => p.id === id);

/** Every column with an `off` flag; newest admin-written columns first, then the built-in order. */
export async function allColumns(): Promise<(Column & { off: boolean; builtin: boolean })[]> {
  const o = await readColumns();
  const edited = new Map(o.items.map((c) => [c.slug, c]));
  const added = o.items.filter((c) => !isBuiltinColumn(c.slug)).sort((a, b) => b.n - a.n);
  const builtin = builtinColumns.map((c) => edited.get(c.slug) ?? c);
  return [...added.map((c) => ({ ...c, builtin: false })), ...builtin.map((c) => ({ ...c, builtin: true }))].map((c) => ({ ...c, off: o.hidden.includes(c.slug) }));
}

export async function getColumns(): Promise<Column[]> {
  return (await allColumns()).filter((c) => !c.off);
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

/**
 * Completed-project counts shown on the site: the projects listed here, plus the unlisted ones the
 * company asked to reflect (RECORD_SCALE applied to the original list only, so each new entry counts once).
 */
export function doneCount(list: Project[], cat?: Category) {
  const listed = list.filter((p) => !p.ongoing && (!cat || p.cat === cat)).length;
  const base = builtinProjects.filter((p) => !p.ongoing && (!cat || p.cat === cat)).length;
  return listed + base * (RECORD_SCALE - 1);
}

export function totalCount(list: Project[], cat?: Category) {
  const listed = list.filter((p) => !cat || p.cat === cat).length;
  const base = builtinProjects.filter((p) => !p.ongoing && (!cat || p.cat === cat)).length;
  return listed + base * (RECORD_SCALE - 1);
}

/** The popup to show today (Korea time), if any. */
export async function activePopup(): Promise<Popup | null> {
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const list = await readPopups();
  return list.find((p) => p.active && (!p.start || p.start <= today) && (!p.end || p.end >= today)) ?? null;
}
