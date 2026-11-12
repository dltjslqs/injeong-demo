import type { Metadata } from "next";
import { pageMeta } from "@/lib/injeong/site";
import { Contact } from "@/components/sites/injeong/Contact";
import { Faq } from "@/components/sites/injeong/Faq";
import { PageHead } from "@/components/sites/injeong/PageHead";

export const metadata: Metadata = pageMeta({
  title: "견적 문의",
  description: "공사 위치와 용도, 규모와 도면을 남겨 주시면 담당자가 직접 연락드립니다. 공사비·계약·하자 등 공사 전에 많이 묻는 질문도 정리했습니다.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHead en="CONTACT" title="견적 문의" desc="공사 위치와 용도, 규모를 남겨 주시면 담당자가 직접 연락드립니다." img="p02" />
      <Contact />
      <Faq />
    </>
  );
}
