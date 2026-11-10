import Link from "next/link";
import { can, type Perm } from "@/lib/injeong/accounts";
import { requireAdmin } from "@/lib/injeong/auth";
import { activePopup, allColumns, allProjects } from "@/lib/injeong/content";
import { Shell } from "./shell";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const me = await requireAdmin();
  const { denied } = await searchParams;
  const [cols, projs, pop] = await Promise.all([allColumns(), allProjects(), activePopup()]);
  const cards: { perm: Perm; href: string; title: string; n: string; desc: string; add: string }[] = [
    { perm: "columns", href: "/admin/columns", title: "기술 칼럼", n: `${cols.filter((c) => !c.off).length}편 게시`, desc: "칼럼을 등록·수정하거나 숨길 수 있습니다.", add: "/admin/columns/edit" },
    { perm: "projects", href: "/admin/projects", title: "시공 실적", n: `${projs.filter((p) => !p.off).length}건 게시`, desc: "준공·시공 중 현장을 등록하고 사진과 내용을 수정합니다.", add: "/admin/projects/edit" },
    { perm: "popups", href: "/admin/popups", title: "팝업", n: pop ? `현재 표시 중: ${pop.title}` : "현재 표시 중인 팝업 없음", desc: "홈 첫 화면에 표시할 공지 팝업과 기간을 설정합니다.", add: "/admin/popups/edit" },
  ];
  return (
    <Shell title="관리자 홈" here="/admin">
      {denied === "1" && <p className="ad-err" role="alert">해당 메뉴의 권한이 없습니다. 총괄관리자에게 문의해 주세요.</p>}
      <div className="ad-cards">
        {cards.filter((c) => can(me, c.perm)).map((c) => (
          <section key={c.href} className="ad-card">
            <h2><Link href={c.href}>{c.title}</Link></h2>
            <p className="ad-stat">{c.n}</p>
            <p className="ad-muted">{c.desc}</p>
            <div className="ad-row">
              <Link className="ad-btn primary" href={c.add}>등록</Link>
              <Link className="ad-btn" href={c.href}>목록</Link>
              {c.perm === "columns" && <Link className="ad-btn" href="/admin/columns/author">작성자 프로필</Link>}
            </div>
          </section>
        ))}
        {me.role === "super" && (
          <section className="ad-card">
            <h2><Link href="/admin/accounts">계정 관리</Link></h2>
            <p className="ad-stat">총괄관리자 전용</p>
            <p className="ad-muted">담당자 계정을 등록하고 담당 메뉴와 비밀번호를 설정합니다.</p>
            <div className="ad-row">
              <Link className="ad-btn primary" href="/admin/accounts/edit">계정 등록</Link>
              <Link className="ad-btn" href="/admin/accounts">목록</Link>
            </div>
          </section>
        )}
      </div>
    </Shell>
  );
}
