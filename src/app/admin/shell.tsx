import Link from "next/link";
import { logout } from "./actions";

const nav = [
  { href: "/admin", label: "처음" },
  { href: "/admin/columns", label: "기술 칼럼" },
  { href: "/admin/projects", label: "시공 실적" },
  { href: "/admin/popups", label: "팝업" },
];

/** Frame for every signed-in admin page: the menu on top, the page title, then the page. */
export function Shell({ title, here, action, children }: { title: string; here: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <header className="ad-top">
        <div className="ad-wrap ad-top-in">
          <Link href="/admin" className="ad-brand">인정건설 관리자</Link>
          <nav aria-label="관리 메뉴">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={here === n.href ? "on" : undefined} aria-current={here === n.href ? "page" : undefined}>{n.label}</Link>
            ))}
          </nav>
          <div className="ad-top-r">
            <Link href="/" target="_blank">홈페이지 보기</Link>
            <form action={logout}><button type="submit" className="ad-link">로그아웃</button></form>
          </div>
        </div>
      </header>
      <main className="ad-wrap ad-main">
        <div className="ad-head">
          <h1>{title}</h1>
          {action}
        </div>
        {children}
      </main>
    </>
  );
}

export function Saved({ show }: { show: boolean }) {
  return show ? <p className="ad-ok" role="status">저장했습니다. 홈페이지에 바로 반영됩니다.</p> : null;
}
