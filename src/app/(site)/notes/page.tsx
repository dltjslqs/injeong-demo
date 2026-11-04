import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NotesList } from "@/components/sites/injeong/Notes";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "기술 칼럼" };

export default function NotesPage() {
  return (
    <>
      <PageHead en="COLUMN" title="기술 칼럼" desc="관급공사 진행 과정과 착공 전 체크리스트를 현장 기술진이 직접 정리합니다." img="p17" />
      <NotesList />
      <CtaBand />
    </>
  );
}
