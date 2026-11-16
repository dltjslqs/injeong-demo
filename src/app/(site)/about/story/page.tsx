import type { Metadata } from "next";
import { AboutTabs } from "@/components/sites/injeong/AboutTabs";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { StoryTimeline } from "@/components/sites/injeong/Story";
import { pageMeta } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  title: "걸어온 길",
  description: "1989년 홍성에서 시작해 공장과 학교, 박물관과 공공기관 사옥까지. ㈜인정건설이 지어 온 건물로 보는 37년의 연혁입니다.",
  path: "/about/story",
});

export default function StoryPage() {
  return (
    <>
      <PageHead en="ABOUT" title="회사소개" heading="30년 넘게 충남을 지켜온 종합건설사, 인정건설입니다." desc="1989년 개인 건설업으로 출발해 2003년 종합건설 법인으로 도약하기까지, 타협 없는 공공·산업시설의 엄격한 시공 기준을 모든 민간 현장에 그대로 쏟아붓고 있습니다." img="team.jpg" />
      <AboutTabs />
      <StoryTimeline />
      <CtaBand />
    </>
  );
}
