import { Areas } from "@/components/sites/injeong/Areas";
import { Case } from "@/components/sites/injeong/Case";
import { Close } from "@/components/sites/injeong/Close";
import { HeroIndex, RecentList } from "@/components/sites/injeong/HeroIndex";
import { NotesSummary } from "@/components/sites/injeong/Notes";
import { Team } from "@/components/sites/injeong/Team";
import { Trust } from "@/components/sites/injeong/Trust";
import { PopupModal } from "@/components/sites/injeong/PopupModal";
import type { Metadata } from "next";
import { company } from "@/components/sites/injeong/data";
import { activePopup, getProjects } from "@/lib/injeong/content";
import { ORIGIN, pageMeta, SITE_NAME } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  description: "충남 홍성의 종합건설사 ㈜인정건설. 공장 신축·증축과 학교·공공시설을 직접 시공합니다. 1989년 창업, 2026년 시공능력평가 89.5억, ㈜동신포리마 공장 11번 시공.",
  path: "/",
});

/**
 * Who the company is, for search engines and AI answers: name, trade, address, phone, licences, area served.
 * Every value here is also on the page (footer, about), as Google requires.
 */
async function companyLd() {
  const done = (await getProjects()).filter((p) => !p.ongoing).length;
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${ORIGIN}/#company`,
    name: SITE_NAME,
    alternateName: ["인정건설", company.nameEn],
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/sites/injeong/logo-h.png`,
    image: `${ORIGIN}/sites/injeong/og.jpg`,
    description: `충남 홍성의 종합건설사. 공장 신축·증축, 학교·공공시설, 민간 건축을 시공하며 2004년부터 준공 실적 ${done}건.`,
    telephone: company.tel,
    faxNumber: company.fax,
    email: company.email,
    foundingDate: "2003-06-19",
    taxID: company.bizNo,
    address: { "@type": "PostalAddress", streetAddress: "충절로938번길 16", addressLocality: "홍성군 홍성읍", addressRegion: "충청남도", addressCountry: "KR" },
    areaServed: { "@type": "AdministrativeArea", name: "충청남도" },
    knowsAbout: ["공장 신축", "공장 증축", "학교 시설 공사", "공공시설 공사", "실내건축"],
    hasCredential: company.licenses.map((l) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "건설업 등록", name: `${l.name} ${l.no}` })),
  };
}

// 누구이고 무엇을 짓나(분야·실적) → 어떻게 증명하나(동신포리마·감사패) → 누가 짓나(사람) → 왜 다른가(칼럼) → 문의
export default async function Home() {
  const popup = await activePopup();
  const ld = await companyLd();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      {popup && <PopupModal popup={popup} />}
      <HeroIndex />
      <Areas />
      <RecentList />
      <Case />
      <Trust />
      <Team />
      <NotesSummary />
      <Close />
    </>
  );
}
