import "@/components/sites/injeong/injeong.css";
import { Behaviors } from "@/components/sites/injeong/Behaviors";
import { SiteFooter } from "@/components/sites/injeong/SiteFooter";
import { SiteHeader } from "@/components/sites/injeong/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="ij" id="ij">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <Behaviors />
    </div>
  );
}
