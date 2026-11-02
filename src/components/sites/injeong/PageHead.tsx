import Link from "next/link";
import { BASE } from "./base";

/** Title band at the top of each menu page. */
export function PageHead({ en, title, desc, img }: { en: string; title: string; desc: string; img: string }) {
  return (
    <section className="ph" style={{ backgroundImage: `url(${BASE}/sites/injeong/img/${img}.jpg)` }}>
      <div className="wrap">
        <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><span>{title}</span></nav>
        <span className="en num">{en}</span>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </section>
  );
}
