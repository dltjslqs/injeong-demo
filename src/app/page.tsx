import "@/components/sites/injeong/injeong.css";
import { Behaviors } from "@/components/sites/injeong/Behaviors";
import { Business } from "@/components/sites/injeong/Business";
import { Contact } from "@/components/sites/injeong/Contact";
import { Faq } from "@/components/sites/injeong/Faq";
import { Figures } from "@/components/sites/injeong/Figures";
import { Hero } from "@/components/sites/injeong/Hero";
import { Message } from "@/components/sites/injeong/Message";
import { Notes } from "@/components/sites/injeong/Notes";
import { NowBuilding } from "@/components/sites/injeong/NowBuilding";
import { Process } from "@/components/sites/injeong/Process";
import { Regions } from "@/components/sites/injeong/Regions";
import { SiteFooter } from "@/components/sites/injeong/SiteFooter";
import { SiteHeader } from "@/components/sites/injeong/SiteHeader";
import { Works } from "@/components/sites/injeong/Works";

export default function Home() {
  return (
    <div className="ij" id="ij">
      <SiteHeader />
      <main>
        <Hero />
        <Business />
        <Figures />
        <NowBuilding />
        <Works />
        <Process />
        <Regions />
        <Message />
        <Notes />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <Behaviors />
    </div>
  );
}
