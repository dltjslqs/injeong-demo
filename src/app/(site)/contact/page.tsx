import type { Metadata } from "next";
import { Contact } from "@/components/sites/injeong/Contact";
import { Faq } from "@/components/sites/injeong/Faq";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "견적 문의" };

export default function ContactPage() {
  return (
    <>
      <PageHead en="CONTACT" title="견적 문의" desc="공사 위치와 용도, 규모를 남겨 주시면 담당자가 직접 연락드립니다." img="p02" />
      <Contact />
      <Faq />
    </>
  );
}
