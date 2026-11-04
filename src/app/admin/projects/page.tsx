import Link from "next/link";
import { categories, projectImg } from "@/components/sites/injeong/data";
import { requireAdmin } from "@/lib/injeong/auth";
import { allProjects, readProjects } from "@/lib/injeong/content";
import { removeProject, toggleProject } from "../actions";
import { Saved, Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "시공 실적" };

const label = (k: string) => categories.find((c) => c.key === k)?.label ?? k;

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const [list, o] = await Promise.all([allProjects(), readProjects()]);
  const edited = new Set(o.items.map((p) => p.id));
  return (
    <Shell title="시공 실적" here="/admin/projects" action={<Link className="ad-btn primary" href="/admin/projects/edit">실적 추가</Link>}>
      <Saved show={saved === "1"} />
      <table className="ad-table">
        <thead><tr><th scope="col"><span className="ad-sr">사진</span></th><th scope="col">공사명</th><th scope="col">분류</th><th scope="col">준공</th><th scope="col">상태</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id} className={p.off ? "off" : undefined}>
              <td>{projectImg(p) ? <img className="ad-mini" src={projectImg(p)} alt="" /> : <span className="ad-mini none" />}</td>
              <td>
                <Link href={`/admin/projects/edit?id=${p.id}`} className="ad-title">{p.name}</Link>
                <span className="ad-muted ad-small">{p.client}</span>
              </td>
              <td>{label(p.cat)}</td>
              <td className="ad-num">{p.done}</td>
              <td>
                {p.off ? <span className="ad-tag">숨김</span> : <span className="ad-tag on">게시</span>}
                {!p.builtin ? <span className="ad-tag new">추가</span> : edited.has(p.id) ? <span className="ad-tag">수정됨</span> : null}
              </td>
              <td className="ad-acts">
                <Link className="ad-btn" href={`/admin/projects/edit?id=${p.id}`}>고치기</Link>
                <form action={toggleProject}><input type="hidden" name="id" value={p.id} /><button type="submit" className="ad-btn">{p.off ? "다시 게시" : "숨기기"}</button></form>
                {!p.builtin ? (
                  <form action={removeProject}><input type="hidden" name="id" value={p.id} /><ConfirmButton message="이 실적을 지울까요? 되돌릴 수 없습니다.">삭제</ConfirmButton></form>
                ) : edited.has(p.id) ? (
                  <form action={removeProject}><input type="hidden" name="id" value={p.id} /><ConfirmButton message="고친 내용을 버리고 원래대로 되돌릴까요?" className="ad-btn">원래대로</ConfirmButton></form>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
