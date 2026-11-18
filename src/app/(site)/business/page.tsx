import type { Metadata } from "next";
import { company, crumbs, JsonLd, webPage } from "@/components/sites/injeong/JsonLd";
import { pageMeta } from "@/lib/injeong/site";
import { Business, fields } from "@/components/sites/injeong/Business";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Process } from "@/components/sites/injeong/Process";

export const metadata: Metadata = pageMeta({
  title: "사업 분야",
  description: "공장 신축·증축, 학교와 공공시설, 군 시설, 교회·어린이집·판매시설까지. 충남 홍성 ㈜인정건설이 직접 시공하는 분야와 대표 실적입니다.",
  path: "/business",
  image: "/sites/injeong/og/business.jpg",
});

const services = {
  "@type": "ItemList",
  numberOfItems: fields.length,
  itemListElement: fields.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Service", name: f.title, serviceType: f.title, description: f.desc, provider: company, areaServed: { "@type": "AdministrativeArea", name: "충청남도" } },
  })),
};

export default function BusinessPage() {
  return (
    <>
      <JsonLd nodes={[webPage("CollectionPage", "/business", "사업 분야", String(metadata.description), { mainEntity: services }), crumbs([["사업 분야", "/business"]])]} />
      <PageHead en="BUSINESS" title="사업 분야" desc="교육·공공·군 시설과 공장, 교회·근생까지. 건축공사업과 실내건축공사업으로 시공합니다." img="p16" />
      <Business />
      <Process />
      <CtaBand />
    </>
  );
}
