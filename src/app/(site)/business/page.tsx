import type { Metadata } from "next";
import { Business } from "@/components/sites/injeong/Business";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { PageHead } from "@/components/sites/injeong/PageHead";
import { Process } from "@/components/sites/injeong/Process";

export const metadata: Metadata = { title: "사업 분야" };

export default function BusinessPage() {
  return (
    <>
      <PageHead en="BUSINESS" title="사업 분야" desc="공장 신축, 물류센터·저온창고, 가동 중인 공장의 증축까지 맡습니다." img="pile" />
      <Business />
      <Process />
      <CtaBand />
    </>
  );
}
