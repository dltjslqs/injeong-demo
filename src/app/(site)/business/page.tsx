import type { Metadata } from "next";
import { Business } from "@/components/sites/injeong/Business";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Process } from "@/components/sites/injeong/Process";
import { Trust } from "@/components/sites/injeong/Trust";

export const metadata: Metadata = { title: "사업 분야" };

export default function BusinessPage() {
  return (
    <>
      <PageHead en="BUSINESS" title="사업 분야" desc="교육·공공·군 시설과 공장, 교회·근생까지. 건축공사업과 실내건축공사업으로 시공합니다." img="p16" />
      <Business />
      <Trust />
      <Process />
      <CtaBand />
    </>
  );
}
