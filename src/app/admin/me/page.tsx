import { requireAdmin } from "@/lib/injeong/auth";
import { profileOf } from "@/lib/injeong/content";
import { saveMyProfile } from "../actions";
import { ProfileFields } from "../ProfileFields";
import { Shell } from "../shell";
import { ActionForm, Submit } from "../ui";

export const metadata = { title: "내 정보" };

export default async function MyPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const me = await requireAdmin();
  const { saved } = await searchParams;
  const profile = await profileOf(me.id);
  return (
    <Shell title="내 정보" here="/admin/me">
      {saved === "1" && <p className="ad-ok" role="status">저장했습니다. 내가 작성자인 칼럼에 바로 반영됩니다.</p>}
      <dl className="ad-dl ad-card ad-me-info">
        <dt>이름</dt><dd>{me.name}</dd>
        <dt>아이디</dt><dd>{me.id}</dd>
        <dt>권한</dt><dd>{me.role === "super" ? "총괄관리자" : "담당자"}</dd>
      </dl>
      <h2 className="ad-h2">작성자 프로필</h2>
      <p className="ad-muted ad-h2-sub">내가 작성자로 지정된 칼럼의 제목 아래에 이 사진, 이름, 직함이 나옵니다.</p>
      <ActionForm action={saveMyProfile} className="ad-form">
        <ProfileFields profile={profile} fallbackName={me.name} />
        <div className="ad-row">
          <Submit>저장</Submit>
        </div>
      </ActionForm>
    </Shell>
  );
}
