import type { Metadata } from "next";
import { AboutTabs } from "@/components/sites/injeong/AboutTabs";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { VideoList } from "@/components/sites/injeong/Story";
import { pageMeta } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  title: "현장 영상",
  description: "㈜인정건설 현장소장과 기술진이 직접 공사 과정을 설명하는 현장 인터뷰 영상입니다.",
  path: "/about/videos",
});

export default function VideosPage() {
  return (
    <>
      <PageHead en="ABOUT" title="회사소개" heading="30년 넘게 충남을 지켜온 종합건설사, 인정건설입니다." desc="1989년 개인 건설업으로 출발해 2003년 종합건설 법인으로 도약하기까지, 타협 없는 공공·산업시설의 엄격한 시공 기준을 모든 민간 현장에 그대로 쏟아붓고 있습니다." img="team.jpg" />
      <AboutTabs />
      <VideoList />
      <CtaBand />
    </>
  );
}
