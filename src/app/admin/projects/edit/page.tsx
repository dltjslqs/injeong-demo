import Link from "next/link";
import { categories, projectImg } from "@/components/sites/injeong/data";
import { requireAdmin } from "@/lib/injeong/auth";
import { allProjects } from "@/lib/injeong/content";
import { Shell } from "../../shell";
import { ProjectForm } from "../ProjectForm";

export const metadata = { title: "실적 편집" };

export default async function ProjectEdit({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin("projects");
  const { id } = await searchParams;
  const p = id ? (await allProjects()).find((x) => x.id === id) : undefined;
  return (
    <Shell title={p ? "실적 수정" : "실적 등록"} here="/admin/projects" action={<Link className="ad-btn" href="/admin/projects">목록</Link>}>
      <ProjectForm
        init={p ? { ...p, ongoing: Boolean(p.ongoing), photo: projectImg(p) } : null}
        cats={categories.map((c) => ({ key: c.key, label: c.label }))}
      />
    </Shell>
  );
}
