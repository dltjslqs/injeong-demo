import { ORIGIN } from "@/lib/injeong/site";

/** The company node lives on the home page; every other page points to it by this id. */
export const COMPANY_ID = `${ORIGIN}/#company`;
export const company = { "@id": COMPANY_ID };

/** 홈 > … trail for search results. Pass the steps after 홈 as [name, path]. */
export function crumbs(steps: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["홈", "/"] as [string, string], ...steps].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${ORIGIN}${path}` })),
  };
}

/** The page itself, tied to the company. */
export function webPage(type: string, path: string, name: string, description: string, extra: Record<string, unknown> = {}) {
  return { "@type": type, "@id": `${ORIGIN}${path}#page`, url: `${ORIGIN}${path}`, name, description, inLanguage: "ko-KR", about: company, publisher: company, ...extra };
}

/** A list of links (columns, stories, projects) as an ItemList. */
export function itemList(items: { name: string; path?: string }[]) {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, ...(x.path ? { url: `${ORIGIN}${x.path}` } : {}) })),
  };
}

/** One script tag holding a @graph of the nodes. */
export function JsonLd({ nodes }: { nodes: object[] }) {
  const data = { "@context": "https://schema.org", "@graph": nodes };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
