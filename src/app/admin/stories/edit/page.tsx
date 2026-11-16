import Link from "next/link";
import { STORY_CATS } from "@/components/sites/injeong/stories";
import { requireAdmin } from "@/lib/injeong/auth";
import { allStories } from "@/lib/injeong/content";
import { saveStory } from "../../actions";
import { Shell } from "../../shell";
import { ActionForm, Submit } from "../../ui";

export const metadata = { title: "회사 이야기 글" };

/** Today in Korea time, YYYY-MM-DD: the default date for a new post. */
function todayKst() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}

const BODY_HINT = "워크샵에서 무엇을 했는지, 어떤 이야기가 오갔는지 적어 주세요.\n\n다음 문단은 한 줄을 띄우고 시작합니다.";

export default async function StoryEdit({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin("columns");
  const { id } = await searchParams;
  const x = id ? (await allStories()).find((s) => s.id === id) : undefined;
  return (
    <Shell title={x ? "글 수정" : "글 등록"} here="/admin/stories" action={<Link className="ad-btn" href="/admin/stories">목록</Link>}>
      <ActionForm action={saveStory} className="ad-form">
        <input type="hidden" name="id" value={x?.id ?? ""} />
        <input type="hidden" name="coverUrl" value={x?.cover ?? ""} />
        <div className="ad-grid2">
          <label className="ad-field wide">
            <span>제목</span>
            <input name="title" defaultValue={x?.title} required maxLength={80} placeholder="예: 2026년 상반기 워크샵, 한 해를 돌아보다" />
          </label>
          <label className="ad-field wide">
            <span>한 줄 소개 <em>목록 카드에 제목 아래로 나옵니다</em></span>
            <input name="sub" defaultValue={x?.sub} maxLength={80} placeholder="예: 전 직원이 모여 올해 현장을 돌아본 하루" />
          </label>
          <label className="ad-field">
            <span>분류</span>
            <select name="cat" defaultValue={x?.cat ?? "회사 소식"} required>
              {STORY_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="ad-field">
            <span>날짜</span>
            <input type="date" name="date" defaultValue={x?.date ?? todayKst()} required />
          </label>
        </div>

        <fieldset className="ad-field">
          <legend>대표 사진 <em>목록 카드와 글 맨 위에 나옵니다</em></legend>
          {x && <img className="ad-thumb" src={x.cover} alt="현재 대표 사진" />}
          <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" required={!x} />
        </fieldset>

        <label className="ad-field">
          <span>본문 <em>문단 사이는 한 줄을 띄워 주세요</em></span>
          <textarea name="body" defaultValue={x?.body} rows={10} required placeholder={BODY_HINT} />
        </label>

        <fieldset className="ad-field">
          <legend>사진 추가 <em>여러 장을 한 번에 고를 수 있습니다. 본문 아래에 모아 보여 줍니다</em></legend>
          {x && x.photos.length > 0 && (
            <ul className="ad-photos">
              {x.photos.map((p) => (
                <li key={p}>
                  <img src={p} alt="" />
                  <label className="ad-check"><input type="checkbox" name="keep" value={p} defaultChecked /> 유지</label>
                </li>
              ))}
            </ul>
          )}
          <input type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple />
          <p className="ad-muted ad-small">한 번에 10장 정도까지 올릴 수 있습니다. 더 많으면 저장한 뒤 다시 열어 이어서 추가해 주세요.</p>
        </fieldset>

        <label className="ad-field">
          <span>유튜브 영상 <em>선택. 본문 아래에 영상이 나옵니다</em></span>
          <input name="youtube" defaultValue={x?.youtube ? `https://youtu.be/${x.youtube}` : ""} placeholder="https://youtu.be/…" inputMode="url" />
        </label>

        <div className="ad-row ad-sticky">
          <Submit>{x ? "저장" : "등록"}</Submit>
          <Link className="ad-btn" href="/admin/stories">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
