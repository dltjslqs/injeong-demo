import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { allStories, readStories } from "@/lib/injeong/content";
import { removeStory, toggleStory } from "../actions";
import { Saved, Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "회사 이야기" };

export default async function StoriesAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("columns");
  const { saved } = await searchParams;
  const [list, o] = await Promise.all([allStories(), readStories()]);
  const edited = new Set(o.items.map((x) => x.id));
  return (
    <Shell title="회사 이야기" here="/admin/stories" action={<Link className="ad-btn primary" href="/admin/stories/edit">글 등록</Link>}>
      <Saved show={saved === "1"} />
      <p className="ad-note">워크샵, 현장 활동, 행사, 수상 소식을 사진과 함께 올리면 회사소개 「회사 이야기」 탭에 최신순으로 나옵니다.</p>
      <table className="ad-table">
        <thead><tr><th scope="col"><span className="ad-sr">대표 사진</span></th><th scope="col">제목</th><th scope="col">분류</th><th scope="col">날짜</th><th scope="col">상태</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
        <tbody>
          {list.map((x) => (
            <tr key={x.id} className={x.off ? "off" : undefined}>
              <td><img className="ad-mini" src={x.cover} alt="" /></td>
              <td>
                <Link href={`/admin/stories/edit?id=${x.id}`} className="ad-title">{x.title}</Link>
                <span className="ad-muted ad-small">사진 {1 + x.photos.length}장{x.youtube ? ", 영상 1" : ""}</span>
              </td>
              <td>{x.cat}</td>
              <td className="ad-num">{x.date.replaceAll("-", ".")}</td>
              <td>
                {x.off ? <span className="ad-tag">숨김</span> : <span className="ad-tag on">게시</span>}
                {!x.builtin ? <span className="ad-tag new">신규</span> : edited.has(x.id) ? <span className="ad-tag">수정됨</span> : null}
              </td>
              <td className="ad-acts">
                <Link className="ad-btn" href={`/admin/stories/edit?id=${x.id}`}>수정</Link>
                {!x.off && <Link className="ad-btn" href={`/about/stories/${x.id}`} target="_blank">보기</Link>}
                <form action={toggleStory}><input type="hidden" name="id" value={x.id} /><input type="hidden" name="off" value={x.off ? "0" : "1"} /><button type="submit" className="ad-btn">{x.off ? "다시 게시" : "숨기기"}</button></form>
                {!x.builtin ? (
                  <form action={removeStory}><input type="hidden" name="id" value={x.id} /><ConfirmButton message="이 글을 삭제할까요? 삭제하면 복구할 수 없습니다.">삭제</ConfirmButton></form>
                ) : edited.has(x.id) ? (
                  <form action={removeStory}><input type="hidden" name="id" value={x.id} /><ConfirmButton message="수정한 내용을 취소하고 원본으로 복원할까요?" className="ad-btn">원본 복원</ConfirmButton></form>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
