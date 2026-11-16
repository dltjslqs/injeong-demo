import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { readVideos } from "@/lib/injeong/content";
import { removeVideo, toggleVideo } from "../actions";
import { Saved, Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "영상" };

export default async function VideosAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("columns");
  const { saved } = await searchParams;
  const list = (await readVideos()).sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <Shell title="영상" here="/admin/videos" action={<Link className="ad-btn primary" href="/admin/videos/edit">영상 등록</Link>}>
      <Saved show={saved === "1"} />
      <p className="ad-note">유튜브에 올린 영상의 주소만 등록하면 홈페이지 회사소개 「회사 이야기」 탭에 최신순으로 나옵니다.</p>
      {list.length === 0 ? (
        <div className="ad-empty">
          <p>등록된 영상이 없습니다. 영상이 없으면 「회사 이야기」 탭에 준비 중 안내가 나옵니다.</p>
          <Link className="ad-btn primary" href="/admin/videos/edit">영상 등록</Link>
        </div>
      ) : (
        <table className="ad-table">
          <thead><tr><th scope="col"><span className="ad-sr">미리보기</span></th><th scope="col">제목</th><th scope="col">게시일</th><th scope="col">상태</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
          <tbody>
            {list.map((v) => (
              <tr key={v.id} className={v.off ? "off" : undefined}>
                <td><img className="ad-mini" src={`https://i.ytimg.com/vi/${v.youtubeId}/mqdefault.jpg`} alt="" /></td>
                <td>
                  <Link href={`/admin/videos/edit?id=${v.id}`} className="ad-title">{v.title}</Link>
                  {v.series && <span className="ad-muted ad-small">{v.series}</span>}
                </td>
                <td className="ad-num">{v.date.replaceAll("-", ".")}</td>
                <td>{v.off ? <span className="ad-tag">숨김</span> : <span className="ad-tag on">게시</span>}</td>
                <td className="ad-acts">
                  <Link className="ad-btn" href={`/admin/videos/edit?id=${v.id}`}>수정</Link>
                  <a className="ad-btn" href={`https://youtu.be/${v.youtubeId}`} target="_blank" rel="noopener noreferrer">보기</a>
                  <form action={toggleVideo}><input type="hidden" name="id" value={v.id} /><input type="hidden" name="off" value={v.off ? "0" : "1"} /><button type="submit" className="ad-btn">{v.off ? "다시 게시" : "숨기기"}</button></form>
                  <form action={removeVideo}><input type="hidden" name="id" value={v.id} /><ConfirmButton message="이 영상을 목록에서 삭제할까요? 유튜브의 영상은 그대로 남습니다.">삭제</ConfirmButton></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
}
