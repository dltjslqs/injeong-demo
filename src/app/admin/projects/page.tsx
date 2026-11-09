import Link from "next/link";
import { categories, projectImg } from "@/components/sites/injeong/data";
import { requireAdmin } from "@/lib/injeong/auth";
import { allProjects, readProjects } from "@/lib/injeong/content";
import { Saved, Shell } from "../shell";
import { Board } from "./Board";

export const metadata = { title: "시공 실적" };

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("projects");
  const { saved } = await searchParams;
  const [list, o] = await Promise.all([allProjects(), readProjects()]);
  const edited = new Set(o.items.map((p) => p.id));
  const items = list.map((p) => ({
    id: p.id,
    name: p.name,
    client: p.client,
    cat: p.cat,
    catLabel: categories.find((c) => c.key === p.cat)?.label ?? p.cat,
    done: p.done,
    ongoing: Boolean(p.ongoing),
    img: projectImg(p),
    off: p.off,
    builtin: p.builtin,
    edited: edited.has(p.id),
  }));
  return (
    <Shell title="시공 실적" here="/admin/projects" action={<Link className="ad-btn primary" href="/admin/projects/edit">실적 등록</Link>}>
      <Saved show={saved === "1"} />
      <Board items={items} cats={categories.map((c) => ({ key: c.key, label: c.label }))} />
    </Shell>
  );
}
