import type { Metadata } from "next";
import { getProjects } from "@/lib/injeong/content";
import { pageMeta } from "@/lib/injeong/site";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NowBuilding } from "@/components/sites/injeong/NowBuilding";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { ProjectMap } from "@/components/sites/injeong/ProjectMap";
import { Works } from "@/components/sites/injeong/Works";

export async function generateMetadata(): Promise<Metadata> {
  const done = (await getProjects()).filter((p) => !p.ongoing).length;
  return pageMeta({
    title: "시공 실적",
    description: `2004년부터 충남에서 준공한 공장·학교·공공시설 ${done}건과 지금 시공 중인 현장. 발주처, 규모, 연면적, 공사비와 시·군별 실적 지도를 함께 보여 드립니다.`,
    path: "/projects",
  });
}

export default function ProjectsPage() {
  return (
    <>
      <PageHead en="PROJECTS" title="시공 실적" desc="지금 시공 중인 현장과 2004년부터 준공한 실적입니다. 발주처와 공사 금액을 그대로 적었습니다." img="p12" />
      <NowBuilding />
      <ProjectMap />
      <Works />
      <CtaBand />
    </>
  );
}
