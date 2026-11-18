import Link from "next/link";
import { company } from "./data";

/** The 404 message and the ways back in; the page around it supplies the header and footer. */
export function NotFoundBody() {
  return (
    <section className="sec nf404">
      <div className="container">
        <p className="nf404-code num" aria-hidden="true">404</p>
        <h1>찾으시는 페이지가 없습니다</h1>
        <p className="lede">주소가 바뀌었거나 삭제된 페이지입니다. 아래에서 원하시는 내용을 찾아보세요.</p>
        <div className="btns">
          <Link className="btn cta" href="/">홈으로</Link>
          <Link className="btn line" href="/projects">시공 실적</Link>
          <Link className="btn line" href="/contact">견적 문의</Link>
        </div>
        <p className="nf404-tel">급하신 일은 대표전화 <a className="num" href={`tel:${company.tel}`}>{company.tel}</a>로 연락 주세요.</p>
      </div>
    </section>
  );
}
