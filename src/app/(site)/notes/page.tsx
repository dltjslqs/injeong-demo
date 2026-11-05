import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NotesList } from "@/components/sites/injeong/Notes";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "기술 칼럼" };

export default function NotesPage() {
  return (
    <>
      <PageHead en="COLUMN" title="기술 칼럼" heading="건축주를 위한 실전 인사이트" desc="설계 오류를 막고 공사비를 아끼는 건설 엔지니어링 가이드" img="p17" />
      <NotesList />
      <CtaBand />
    </>
  );
}
