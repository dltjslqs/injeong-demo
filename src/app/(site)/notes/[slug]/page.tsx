import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColumnArticle } from "@/components/sites/injeong/ColumnArticle";
import { columns } from "@/components/sites/injeong/columns";
import { CtaBand } from "@/components/sites/injeong/CtaBand";

export const dynamicParams = false;

export function generateStaticParams() {
  return columns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = columns.find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.lede } : {};
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = columns.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <ColumnArticle c={c} />
      <CtaBand />
    </>
  );
}
