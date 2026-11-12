import type { Metadata } from "next";
import { pageMeta } from "@/lib/injeong/site";
import { Business } from "@/components/sites/injeong/Business";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Process } from "@/components/sites/injeong/Process";

export const metadata: Metadata = pageMeta({
  title: "사업 분야",
  description: "공장 신축·증축, 학교와 공공시설, 군 시설, 교회·어린이집·판매시설까지. 충남 홍성 ㈜인정건설이 직접 시공하는 분야와 대표 실적입니다.",
  path: "/business",
});

export default function BusinessPage() {
  return (
    <>
      <PageHead en="BUSINESS" title="사업 분야" desc="교육·공공·군 시설과 공장, 교회·근생까지. 건축공사업과 실내건축공사업으로 시공합니다." img="p16" />
      <Business />
      <Process />
      <CtaBand />
    </>
  );
}
