import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { allColumns, readColumns } from "@/lib/injeong/content";
import { removeColumn, toggleColumn } from "../actions";
import { Saved, Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "기술 칼럼" };

export default async function ColumnsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const [list, o] = await Promise.all([allColumns(), readColumns()]);
  const edited = new Set(o.items.map((c) => c.slug));
  return (
    <Shell title="기술 칼럼" here="/admin/columns" action={<div className="ad-row"><Link className="ad-btn" href="/admin/columns/author">작성자 프로필</Link><Link className="ad-btn primary" href="/admin/columns/edit">새 칼럼 쓰기</Link></div>}>
      <Saved show={saved === "1"} />
      <table className="ad-table">
        <thead><tr><th scope="col">제목</th><th scope="col">분류</th><th scope="col">상태</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.slug} className={c.off ? "off" : undefined}>
              <td>
                <Link href={`/admin/columns/edit?slug=${c.slug}`} className="ad-title">{c.title}</Link>
                <span className="ad-muted ad-small">{c.date ?? "2026.11"}{c.series ? `, 시리즈 ${c.series}편` : ""}</span>
              </td>
              <td>{c.cat}</td>
              <td>
                {c.off ? <span className="ad-tag">숨김</span> : <span className="ad-tag on">게시</span>}
                {!c.builtin ? <span className="ad-tag new">새 글</span> : edited.has(c.slug) ? <span className="ad-tag">수정됨</span> : null}
              </td>
              <td className="ad-acts">
                <Link className="ad-btn" href={`/admin/columns/edit?slug=${c.slug}`}>고치기</Link>
                {!c.off && <Link className="ad-btn" href={`/notes/${c.slug}`} target="_blank">보기</Link>}
                <form action={toggleColumn}><input type="hidden" name="slug" value={c.slug} /><button type="submit" className="ad-btn">{c.off ? "다시 게시" : "숨기기"}</button></form>
                {!c.builtin ? (
                  <form action={removeColumn}><input type="hidden" name="slug" value={c.slug} /><ConfirmButton message="이 칼럼을 지울까요? 되돌릴 수 없습니다.">삭제</ConfirmButton></form>
                ) : edited.has(c.slug) ? (
                  <form action={removeColumn}><input type="hidden" name="slug" value={c.slug} /><ConfirmButton message="고친 내용을 버리고 원래 글로 되돌릴까요?" className="ad-btn">원래대로</ConfirmButton></form>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
