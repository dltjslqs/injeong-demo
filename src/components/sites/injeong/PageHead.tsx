import Link from "next/link";
import { Fragment } from "react";
import { BASE } from "./base";
import { Photo } from "./Photo";

/** Title band at the top of each menu page. */
// asH1={false}: the page has its own h1 below (회사소개 tabs share one hero line)
// trail: the steps after 홈, the same list the page gives crumbs() for its BreadcrumbList, so the screen and the schema agree
export function PageHead({ title, heading, desc, img, asH1 = true, trail }: { en?: string; title: string; heading?: string; desc: string; img: string; asH1?: boolean; trail?: [string, string][] }) {
  const steps = trail ?? [[title, ""]];
  return (
    <section className="ph">
      {/* the page's first picture: an <img> (not a CSS background) so the phone gets a small WebP and it loads first */}
      <Photo className="ph-bg" src={`${BASE}/sites/injeong/${img.includes(".") ? img : `works/${img}.jpg`}`} alt="" sizes="100vw" width={1800} height={1013} priority />
      <div className="container">
        <nav className="crumb" aria-label="현재 위치">
          <Link href="/">홈</Link>
          {steps.map(([name, href], i) => (
            <Fragment key={name}>
              <span aria-hidden="true">/</span>
              {i < steps.length - 1 ? <Link href={href}>{name}</Link> : <span aria-current="page">{name}</span>}
            </Fragment>
          ))}
        </nav>
        {asH1 ? <h1>{heading ?? title}</h1> : <p className="ph-t">{heading ?? title}</p>}
        <p>{desc}</p>
      </div>
    </section>
  );
}
