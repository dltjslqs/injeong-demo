import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColumnArticle } from "@/components/sites/injeong/ColumnArticle";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { getColumns, getProjects, readAuthor } from "@/lib/injeong/content";

// true on a server so columns written in the admin open without a rebuild;
// the GitHub Pages workflow flips it to false for the static export.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getColumns()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = (await getColumns()).find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.lede } : {};
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const columns = await getColumns();
  const c = columns.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <ColumnArticle c={c} columns={columns} projects={await getProjects()} author={await readAuthor()} />
      <CtaBand />
    </>
  );
}
