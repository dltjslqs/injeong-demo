import type { Metadata } from "next";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { NotesList } from "@/components/sites/injeong/Notes";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "현장 노트" };

export default function NotesPage() {
  return (
    <>
      <PageHead en="FIELD NOTES" title="현장 노트" desc="공장을 짓기 전에 알아 두면 좋은 내용을 현장 엔지니어가 칼럼과 영상으로 정리합니다." img="steel" />
      <NotesList />
      <CtaBand />
    </>
  );
}
