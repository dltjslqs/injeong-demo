import { Business } from "@/components/sites/injeong/Business";
import { CtaBand } from "@/components/sites/injeong/CtaBand";
import { Figures } from "@/components/sites/injeong/Figures";
import { Hero } from "@/components/sites/injeong/Hero";
import { NotesSummary } from "@/components/sites/injeong/Notes";
import { Works } from "@/components/sites/injeong/Works";

export default function Home() {
  return (
    <>
      <Hero />
      <Business summary />
      <Figures />
      <Works summary />
      <NotesSummary />
      <CtaBand />
    </>
  );
}
