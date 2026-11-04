import Link from "next/link";
import { BASE } from "./base";

/** Title band at the top of each menu page. */
export function PageHead({ title, heading, desc, img }: { en?: string; title: string; heading?: string; desc: string; img: string }) {
  return (
    <section className="ph" style={{ backgroundImage: `url(${BASE}/sites/injeong/${img.includes(".") ? img : `works/${img}.jpg`})` }}>
      <div className="container">
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
        <h1>{heading ?? title}</h1>
        <p>{desc}</p>
      </div>
    </section>
  );
}
