import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColumnArticle } from "@/components/sites/injeong/ColumnArticle";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { authorOf, getColumns, getProjects } from "@/lib/injeong/content";

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
  const author = await authorOf(c);
  // structured data for search engines: the article and where it sits on the site.
  // Addresses become absolute once NEXT_PUBLIC_SITE_URL is set (after the domain is connected).
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const iso = (c.date ?? "").replace(/\./g, "-");
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.sub,
      ...(iso ? { datePublished: iso } : {}),
      author: { "@type": "Person", name: author.name, ...(author.role ? { jobTitle: author.role } : {}) },
      publisher: { "@type": "Organization", name: "㈜인정건설" },
      ...(site ? { mainEntityOfPage: `${site}/notes/${c.slug}` } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", ...(site ? { item: `${site}/` } : {}) },
        { "@type": "ListItem", position: 2, name: "기술 칼럼", ...(site ? { item: `${site}/notes` } : {}) },
        { "@type": "ListItem", position: 3, name: c.title },
      ],
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <ColumnArticle c={c} columns={columns} projects={await getProjects()} author={author} />
      <CtaBand />
    </>
  );
}
