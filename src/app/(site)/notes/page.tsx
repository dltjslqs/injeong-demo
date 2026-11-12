import type { Metadata } from "next";
import { pageMeta } from "@/lib/injeong/site";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NotesList } from "@/components/sites/injeong/Notes";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = pageMeta({
  title: "기술 칼럼",
  description: "공장 공사비, 증축 인허가, 시공사 고르는 법, 하자 예방까지. 충남에서 직접 짓는 시공사가 건축주를 위해 쓴 실전 칼럼입니다.",
  path: "/notes",
});

export default function NotesPage() {
  return (
    <>
      <PageHead en="COLUMN" title="기술 칼럼" heading="건축주를 위한 실전 인사이트" desc="설계 오류를 막고 공사비를 아끼는 건설 엔지니어링 가이드" img="p17" />
      <NotesList />
      <CtaBand />
    </>
  );
}
