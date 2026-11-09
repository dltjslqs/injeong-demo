import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { readPopups } from "@/lib/injeong/content";
import { savePopup } from "../../actions";
import { Shell } from "../../shell";
import { ActionForm, Submit } from "../../ui";

export const metadata = { title: "팝업 편집" };

export default async function PopupEdit({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin("popups");
  const { id } = await searchParams;
  const p = id ? (await readPopups()).find((x) => x.id === id) : undefined;
  return (
    <Shell title={p ? "팝업 수정" : "팝업 등록"} here="/admin/popups" action={<Link className="ad-btn" href="/admin/popups">목록</Link>}>
      <ActionForm action={savePopup} className="ad-form">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <input type="hidden" name="imageUrl" value={p?.imageUrl ?? ""} />
        <div className="ad-grid2">
          <label className="ad-field wide">
            <span>제목</span>
            <input name="title" defaultValue={p?.title} required maxLength={60} placeholder="예: 설 연휴 휴무 안내" />
          </label>
          <label className="ad-field wide">
            <span>내용 <em>두세 줄이면 충분합니다</em></span>
            <textarea name="body" defaultValue={p?.body} rows={5} maxLength={600} />
          </label>
          <label className="ad-field">
            <span>버튼 링크 <em>미입력 시 버튼 없음</em></span>
            <input name="linkUrl" defaultValue={p?.linkUrl} placeholder="/contact 또는 https://…" />
          </label>
          <label className="ad-field">
            <span>버튼 문구</span>
            <input name="linkLabel" defaultValue={p?.linkLabel ?? "자세히 보기"} maxLength={20} />
          </label>
          <label className="ad-field">
            <span>시작일 <em>미입력 시 즉시</em></span>
            <input type="date" name="start" defaultValue={p?.start} />
          </label>
          <label className="ad-field">
            <span>종료일 <em>미입력 시 중지할 때까지</em></span>
            <input type="date" name="end" defaultValue={p?.end} />
          </label>
        </div>
        <fieldset className="ad-field">
          <legend>사진 <em>선택, 10MB까지</em></legend>
          {p?.imageUrl && <img className="ad-thumb" src={p.imageUrl} alt="" />}
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" />
          {p?.imageUrl && <label className="ad-check"><input type="checkbox" name="removeImage" /> 사진 삭제</label>}
        </fieldset>
        <label className="ad-check ad-field"><input type="checkbox" name="active" defaultChecked={p ? p.active : true} /> 팝업 사용</label>
        <div className="ad-row ad-sticky">
          <Submit>{p ? "저장" : "등록"}</Submit>
          <Link className="ad-btn" href="/admin/popups">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
