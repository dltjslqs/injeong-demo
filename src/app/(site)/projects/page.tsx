import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NowBuilding } from "@/components/sites/injeong/NowBuilding";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Works } from "@/components/sites/injeong/Works";

export const metadata: Metadata = { title: "시공 실적" };

export default function ProjectsPage() {
  return (
    <>
      <PageHead en="PROJECTS" title="시공 실적" desc="지금 짓고 있는 현장의 공정 기록과 지금까지 준공한 산업시설입니다." img="hero" />
      <NowBuilding />
      <Works />
      <CtaBand />
    </>
  );
}
