import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColumnArticle, coverOf } from "@/components/sites/injeong/ColumnArticle";
import { ORIGIN, pageMeta, SITE_URL } from "@/lib/injeong/site";
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
  if (!c) return {};
  // the description is the column's one-line answer, not its greeting
  return pageMeta({ title: c.title, description: c.meta || c.sub, path: `/notes/${c.slug}`, image: coverOf(c), type: "article" });
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const columns = await getColumns();
  const c = columns.find((x) => x.slug === slug);
  if (!c) notFound();
  const author = await authorOf(c);
  // structured data for search engines: the article and where it sits on the site.
  // Addresses become absolute once NEXT_PUBLIC_SITE_URL is set (after the domain is connected).
  const site = SITE_URL;
  const iso = (c.date ?? "").replace(/\./g, "-");
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.meta || c.sub,
      ...(iso ? { datePublished: iso } : {}),
      author: {
        "@type": "Person",
        "@id": `${ORIGIN}/#author-${encodeURIComponent(author.name)}`,
        name: author.name,
        ...(author.role ? { jobTitle: author.role } : {}),
        worksFor: { "@id": `${ORIGIN}/#company` },
        // 학력 line (…대학교 …과) as alumniOf, the rest stays as text
        ...(author.history?.length ? { description: author.history.join(", ") } : {}),
        ...(author.history?.some((h) => /대학교/.test(h)) ? { alumniOf: { "@type": "CollegeOrUniversity", name: author.history.find((h) => /대학교/.test(h))!.replace(/\s.*$/, "") } } : {}),
      },
      // the company node lives on the home page
      publisher: { "@id": `${ORIGIN}/#company` },
      image: (() => { const u = coverOf(c); return u.startsWith("http") ? u : `${ORIGIN}${u}`; })(),
      ...(iso ? { dateModified: iso } : {}),
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
