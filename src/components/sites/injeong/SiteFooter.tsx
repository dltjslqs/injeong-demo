import Link from "next/link";
import { Logo, menu } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="top">
          <div>
            <Logo light />
            <p className="info">
              인정건설 주식회사 · 대표이사 ○○○<br />
              사업자등록번호 000-00-00000 · 종합건설업 등록번호 0000<br />
              충청남도 홍성군 (주소 입력 예정)
            </p>
          </div>
          <div>
            <h4>바로 가기</h4>
            <nav aria-label="바닥글 메뉴">{menu.map((m) => <Link href={m.href} key={m.href}>{m.label}</Link>)}</nav>
          </div>
          <div>
            <h4>연락처</h4>
            <p className="info" style={{ marginTop: 0 }}>
              TEL <span className="num">041-633-9942</span><br />
              FAX <span className="num">041-633-9943</span><br />
              contact@injeong.example
            </p>
          </div>
        </div>
        <div className="bot">
          <span>© 인정건설 주식회사</span>
          <span className="demo">데모 시안입니다. 사진, 현장 이름, 수치는 예시이며 실제 자료로 바꿔야 합니다.</span>
        </div>
      </div>
    </footer>
  );
}
