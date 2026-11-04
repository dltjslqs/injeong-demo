import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NowBuilding } from "@/components/sites/injeong/NowBuilding";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Works } from "@/components/sites/injeong/Works";

export const metadata: Metadata = { title: "시공 실적" };

export default function ProjectsPage() {
  return (
    <>
      <PageHead en="PROJECTS" title="시공 실적" desc="지금 시공 중인 현장과 2009년부터 준공한 실적입니다. 발주처와 공사 금액을 그대로 적었습니다." img="p12" />
      <NowBuilding />
      <Works />
      <CtaBand />
    </>
  );
}
