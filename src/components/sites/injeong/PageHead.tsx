import Link from "next/link";
import { BASE } from "./base";

/** Title band at the top of each menu page. */
// asH1={false}: the page has its own h1 below (회사소개 tabs share one hero line)
export function PageHead({ title, heading, desc, img, asH1 = true }: { en?: string; title: string; heading?: string; desc: string; img: string; asH1?: boolean }) {
  return (
    <section className="ph" style={{ backgroundImage: `url(${BASE}/sites/injeong/${img.includes(".") ? img : `works/${img}.jpg`})` }}>
      <div className="container">
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
        {asH1 ? <h1>{heading ?? title}</h1> : <p className="ph-t">{heading ?? title}</p>}
        <p>{desc}</p>
      </div>
    </section>
  );
}
