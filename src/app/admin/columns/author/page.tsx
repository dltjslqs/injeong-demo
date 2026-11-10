import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { readAuthor } from "@/lib/injeong/content";
import { saveAuthor } from "../../actions";
import { Saved, Shell } from "../../shell";
import { ActionForm, Submit } from "../../ui";
import { AvatarPicker } from "./AvatarPicker";

export const metadata = { title: "칼럼 작성자 프로필" };

export default async function AuthorEdit({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("columns");
  const { saved } = await searchParams;
  const a = await readAuthor();
  return (
    <Shell title="칼럼 작성자 프로필" here="/admin/columns" action={<Link className="ad-btn" href="/admin/columns">목록</Link>}>
      <Saved show={saved === "1"} />
      <ActionForm action={saveAuthor} className="ad-form">
        <p className="ad-muted">모든 칼럼 제목 아래에 사진, 이름, 직함이 함께 나옵니다.</p>
        <AvatarPicker current={a.photoUrl} initial={a.name.slice(0, 1) || "?"} />
        <div className="ad-grid2">
          <label className="ad-field">
            <span>이름</span>
            <input name="name" defaultValue={a.name} required maxLength={20} />
          </label>
          <label className="ad-field">
            <span>직함 <em>예: 인정건설 이사</em></span>
            <input name="role" defaultValue={a.role} maxLength={40} />
          </label>
        </div>
        <div className="ad-row">
          <Submit>저장</Submit>
          <Link className="ad-btn" href="/admin/columns">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
