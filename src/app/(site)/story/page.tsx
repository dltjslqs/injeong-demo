import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Story } from "@/components/sites/injeong/Story";
import { pageMeta } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  title: "인정건설 이야기",
  description: "1989년 홍성에서 시작해 학교와 공장, 박물관까지. ㈜인정건설이 걸어온 길과 현장에서 직접 들려드리는 영상 이야기입니다.",
  path: "/story",
});

export default function StoryPage() {
  return (
    <>
      <PageHead en="STORY" title="인정건설 이야기" heading="홍성의 개인 건설업에서, 178억 원 학교를 짓기까지" desc="1989년부터 지어 온 건물들과 함께, 인정건설이 걸어온 길을 정리했습니다." img="p12" />
      <Story />
      <CtaBand />
    </>
  );
}
