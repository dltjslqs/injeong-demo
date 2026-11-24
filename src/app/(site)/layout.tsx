import { Analytics } from "@vercel/analytics/next";
import "@/components/sites/injeong/injeong.css";
import { Behaviors } from "@/components/sites/injeong/Behaviors";
import { archivo } from "@/components/sites/injeong/fonts";
import { SiteFooter } from "@/components/sites/injeong/SiteFooter";
import { SiteHeader } from "@/components/sites/injeong/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`ij ${archivo.variable}`} id="ij">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <Behaviors />
      {/* Vercel Web Analytics: visitor counts on the public pages only (not /admin) */}
      <Analytics />
    </div>
  );
}
