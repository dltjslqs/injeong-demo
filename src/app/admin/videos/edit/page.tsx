import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { readVideos } from "@/lib/injeong/content";
import { saveVideo } from "../../actions";
import { Shell } from "../../shell";
import { ActionForm, Submit } from "../../ui";

export const metadata = { title: "영상 등록" };

/** Today in Korea time, YYYY-MM-DD: the default 게시일 for a new video. */
function todayKst() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}

export default async function VideoEdit({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin("columns");
  const { id } = await searchParams;
  const v = id ? (await readVideos()).find((x) => x.id === id) : undefined;
  const today = todayKst();
  return (
    <Shell title={v ? "영상 수정" : "영상 등록"} here="/admin/videos" action={<Link className="ad-btn" href="/admin/videos">목록</Link>}>
      <ActionForm action={saveVideo} className="ad-form">
        <input type="hidden" name="id" value={v?.id ?? ""} />
        <div className="ad-grid2">
          <label className="ad-field wide">
            <span>유튜브 주소 <em>유튜브에서 「공유」를 눌러 복사한 주소를 붙여 넣으세요</em></span>
            <input name="url" defaultValue={v ? `https://youtu.be/${v.youtubeId}` : ""} required placeholder="https://youtu.be/…" inputMode="url" />
          </label>
          <label className="ad-field wide">
            <span>제목</span>
            <input name="title" defaultValue={v?.title} required maxLength={80} placeholder="예: 기초를 박는 날, PHC 파일 항타 현장" />
          </label>
          <label className="ad-field">
            <span>시리즈 <em>선택</em></span>
            <input name="series" defaultValue={v?.series} maxLength={30} placeholder="예: 현장 인터뷰 1편" />
          </label>
          <label className="ad-field">
            <span>게시일</span>
            <input type="date" name="date" defaultValue={v?.date ?? today} required />
          </label>
          <label className="ad-field wide">
            <span>소개 <em>한두 문장. 영상 아래에 나오고 검색에도 쓰입니다</em></span>
            <textarea name="desc" defaultValue={v?.desc} rows={3} maxLength={300} />
          </label>
        </div>
        {v && <img className="ad-thumb" src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="현재 등록된 영상 미리보기" />}
        <div className="ad-row">
          <Submit>{v ? "저장" : "등록"}</Submit>
          <Link className="ad-btn" href="/admin/videos">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
