import Link from "next/link";
import { type Account, can, type Perm } from "@/lib/injeong/accounts";
import { currentUser } from "@/lib/injeong/auth";
import { logout } from "./actions";

/*
 * The frame of every signed-in admin page.
 * Left: the menu, grouped (콘텐츠, 운영) with sub-pages under their section, and the signed-in account at the bottom.
 * Right: where you are (홈 / section / page), the page title with its one-line purpose and actions,
 * the section's tabs when it has sub-pages, then the page.
 */

type Item = { href: string; label: string; icon: keyof typeof ICONS; perm?: Perm | "super"; desc: string; children?: { href: string; label: string; desc: string }[] };
type Group = { label?: string; items: Item[] };

const NAV: Group[] = [
  { items: [{ href: "/admin", label: "관리자 홈", icon: "home", desc: "담당 메뉴의 현황을 한눈에 보고 바로 등록할 수 있습니다." }] },
  {
    label: "콘텐츠",
    items: [
      {
        href: "/admin/columns",
        label: "기술 칼럼",
        icon: "doc",
        perm: "columns",
        desc: "기술 칼럼을 등록·수정하고, 홈페이지에서 숨기거나 다시 게시합니다.",
      },
      { href: "/admin/projects", label: "시공 실적", icon: "building", perm: "projects", desc: "준공·시공 중 현장을 등록하고 사진과 공사 개요를 수정합니다." },
      { href: "/admin/popups", label: "팝업", icon: "bell", perm: "popups", desc: "홈 첫 화면 오른쪽 위에 뜨는 공지입니다. 한 번에 하나만 표시됩니다." },
    ],
  },
  {
    label: "운영",
    items: [
      { href: "/admin/accounts", label: "계정 관리", icon: "users", perm: "super", desc: "담당자 계정을 등록하고 담당 메뉴와 비밀번호를 설정합니다." },
      { href: "/admin/backup", label: "백업", icon: "archive", perm: "super", desc: "등록한 내용의 백업 설정, 보관 중인 백업본, 백업 이력입니다." },
    ],
  },
];
const ACCOUNT: Item = {
  href: "/admin/me",
  label: "내 정보",
  icon: "key",
  desc: "내 계정 정보와, 내가 쓴 칼럼에 나오는 작성자 프로필입니다.",
  children: [
    { href: "/admin/me", label: "내 정보", desc: "내 계정 정보와, 내가 쓴 칼럼에 나오는 작성자 프로필입니다." },
    { href: "/admin/password", label: "비밀번호 변경", desc: "로그인한 계정의 비밀번호를 변경합니다. 변경하면 다른 기기는 모두 로그아웃됩니다." },
  ],
};

const ICONS = {
  home: "M4 11 12 4l8 7M6 9.5V20h12V9.5",
  doc: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
  building: "M5 21V5l8-2v18M13 9h6v12M9 8h1M9 12h1M9 16h1M16 13h1M16 17h1M3 21h18",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c.6-3.4 3-5 6-5s5.4 1.6 6 5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 15c1.6.6 2.7 2.2 3 5",
  archive: "M3 5h18v4H3zM5 9v11h14V9M10 13h4",
  key: "M14 10a4 4 0 1 0-3.5 4L8 16.5V19h2.5v-2h2v-2l1-1A4 4 0 0 0 14 10zM15.5 8.5h.01",
  out: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
} as const;

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const allowed = (user: Account | null, perm?: Perm | "super") => !perm || Boolean(user && (perm === "super" ? user.role === "super" : can(user, perm)));
const roleLabel = (u: Account) =>
  u.role === "super" ? "총괄관리자" : `담당: ${u.perms.map((p) => ({ columns: "기술 칼럼", projects: "시공 실적", popups: "팝업" })[p]).join(", ") || "없음"}`;

/** Finds the menu item and sub-page for `here`, for the active state, the breadcrumb and the description. */
function locate(here: string) {
  for (const g of [...NAV, { items: [ACCOUNT] }]) {
    for (const item of g.items) {
      const child = item.children?.find((c) => c.href === here);
      if (child || item.href === here) return { item, child };
    }
  }
  return { item: NAV[0].items[0], child: undefined };
}

export async function Shell({ title, here, action, desc, children }: { title: string; here: string; action?: React.ReactNode; desc?: string; children: React.ReactNode }) {
  const user = await currentUser();
  const { item, child } = locate(here);
  const groups = NAV.map((g) => ({ ...g, items: g.items.filter((i) => allowed(user, i.perm)) })).filter((g) => g.items.length);
  // 홈 / 기술 칼럼 / 작성자 프로필 / (this page, when it is a form under a list)
  const crumbs: { href?: string; label: string }[] = [];
  if (item.href !== "/admin") {
    crumbs.push({ href: "/admin", label: "관리자 홈" });
    crumbs.push({ href: item.href, label: item.label });
    if (child && child.href !== item.href) crumbs.push({ href: child.href, label: child.label });
    if (title !== (child ?? item).label && title !== item.label) crumbs.push({ label: title });
  }
  const isList = title === (child ?? item).label || title === item.label;
  const lede = desc ?? (isList ? (child ?? item).desc : undefined);

  const menu = (
    <>
      {groups.map((g, gi) => (
        <div className="sb-group" key={gi}>
          {g.label && <p className="sb-label">{g.label}</p>}
          <ul>
            {g.items.map((i) => {
              const on = i === item;
              return (
                <li key={i.href}>
                  <Link href={i.href} className={`sb-link${on ? " on" : ""}`} aria-current={on && (!i.children || child?.href === i.href) ? "page" : undefined}>
                    <Icon name={i.icon} />
                    {i.label}
                  </Link>
                  {i.children && (
                    <ul className="sb-sub">
                      {i.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className={`sb-sublink${on && child?.href === c.href ? " on" : ""}`} aria-current={on && child?.href === c.href ? "page" : undefined}>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );

  const me = user && (
      <div className="sb-me">
        <p className="sb-me-name">{user.name}</p>
        <p className="sb-me-role">{roleLabel(user)}</p>
        <div className="sb-me-acts">
          <Link href={ACCOUNT.href} className={item === ACCOUNT ? "on" : undefined}><Icon name="key" />내 정보·비밀번호</Link>
          <form action={logout}><button type="submit"><Icon name="out" />로그아웃</button></form>
        </div>
      </div>
  );

  return (
    <div className="ad-app">
      <aside className="sb" aria-label="관리 메뉴">
        <div className="sb-top">
          <Link href="/admin" className="sb-brand">인정건설 관리자</Link>
          <Link href="/" target="_blank" className="sb-site">홈페이지 보기 <Icon name="ext" /></Link>
        </div>
        <details className="sb-mobile">
          <summary>메뉴</summary>
          <nav>{menu}{me}</nav>
        </details>
        <nav className="sb-nav">{menu}</nav>
        {me}
      </aside>

      <main className="ad-main">
        <header className="pg-head">
          {crumbs.length > 0 && (
            <nav aria-label="현재 위치" className="pg-crumbs">
              <ol>
                {crumbs.map((c, i) => (
                  <li key={i}>{c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
                ))}
              </ol>
            </nav>
          )}
          <div className="pg-title">
            <div>
              <h1>{title}</h1>
              {lede && <p className="pg-desc">{lede}</p>}
            </div>
            {action && <div className="pg-acts">{action}</div>}
          </div>
          {item.children && isList && (
            <nav className="pg-tabs" aria-label={`${item.label} 메뉴`}>
              {item.children.map((c) => (
                <Link key={c.href} href={c.href} className={child?.href === c.href ? "on" : undefined} aria-current={child?.href === c.href ? "page" : undefined}>{c.label}</Link>
              ))}
            </nav>
          )}
        </header>
        <div className="pg-body">{children}</div>
      </main>
    </div>
  );
}

export function Saved({ show }: { show: boolean }) {
  return show ? <p className="ad-ok" role="status">저장했습니다. 홈페이지에 바로 반영됩니다.</p> : null;
}
