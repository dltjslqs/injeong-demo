import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { activePopup, allColumns, allProjects } from "@/lib/injeong/content";
import { Shell } from "./shell";

export default async function AdminHome() {
  await requireAdmin();
  const [cols, projs, pop] = await Promise.all([allColumns(), allProjects(), activePopup()]);
  const cards = [
    { href: "/admin/columns", title: "기술 칼럼", n: `${cols.filter((c) => !c.off).length}편 게시`, desc: "새 칼럼을 쓰거나 실린 칼럼을 고치고 숨깁니다.", add: "/admin/columns/edit" },
    { href: "/admin/projects", title: "시공 실적", n: `${projs.filter((p) => !p.off).length}건 게시`, desc: "준공·시공 중 현장을 추가하고 사진과 내용을 고칩니다.", add: "/admin/projects/edit" },
    { href: "/admin/popups", title: "팝업", n: pop ? `지금 표시 중: ${pop.title}` : "지금 표시 중인 팝업 없음", desc: "홈 첫 화면에 띄울 공지 팝업과 기간을 정합니다.", add: "/admin/popups/edit" },
  ];
  return (
    <Shell title="무엇을 관리할까요?" here="/admin">
      <div className="ad-cards">
        {cards.map((c) => (
          <section key={c.href} className="ad-card">
            <h2><Link href={c.href}>{c.title}</Link></h2>
            <p className="ad-stat">{c.n}</p>
            <p className="ad-muted">{c.desc}</p>
            <div className="ad-row">
              <Link className="ad-btn primary" href={c.add}>새로 추가</Link>
              <Link className="ad-btn" href={c.href}>목록 보기</Link>
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
