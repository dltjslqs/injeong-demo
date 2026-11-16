import type { Metadata } from "next";
import { AboutTabs } from "@/components/sites/injeong/AboutTabs";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { VideoList, WorkScenes } from "@/components/sites/injeong/Story";
import { pageMeta } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  title: "회사 이야기",
  description: "현장 점검부터 현장사무실 공정 회의, 홍성 본사까지. ㈜인정건설이 일하는 모습을 사진과 영상으로 담았습니다.",
  path: "/about/stories",
});

export default function StoriesPage() {
  return (
    <>
      <PageHead en="ABOUT" title="회사소개" heading="30년 넘게 충남을 지켜온 종합건설사, 인정건설입니다." desc="1989년 개인 건설업으로 출발해 2003년 종합건설 법인으로 도약하기까지, 타협 없는 공공·산업시설의 엄격한 시공 기준을 모든 민간 현장에 그대로 쏟아붓고 있습니다." img="team.jpg" />
      <AboutTabs />
      <WorkScenes />
      <VideoList />
      <CtaBand />
    </>
  );
}
