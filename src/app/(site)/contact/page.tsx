import type { Metadata } from "next";
import { Contact } from "@/components/sites/injeong/Contact";
import { Faq } from "@/components/sites/injeong/Faq";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = { title: "상담 문의" };

export default function ContactPage() {
  return (
    <>
      <PageHead en="CONTACT" title="상담 문의" desc="부지와 규모, 희망 일정을 남겨 주시면 담당 엔지니어가 연락드립니다." img="logistics" />
      <Contact />
      <Faq />
    </>
  );
}
