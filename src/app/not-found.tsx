import "@/components/sites/injeong/injeong.css";
import { Behaviors } from "@/components/sites/injeong/Behaviors";
import { archivo } from "@/components/sites/injeong/fonts";
import { NotFoundBody } from "@/components/sites/injeong/NotFoundBody";
import { SiteFooter } from "@/components/sites/injeong/SiteFooter";
import { SiteHeader } from "@/components/sites/injeong/SiteHeader";

export const metadata = { title: "페이지를 찾을 수 없습니다" };

/** An address the site does not have: outside the site layout, so it brings its own header and footer. */
export default function NotFound() {
  return (
    <div className={`ij ${archivo.variable}`} id="ij">
      <SiteHeader />
      <main><NotFoundBody /></main>
      <SiteFooter />
      <Behaviors />
    </div>
  );
}
