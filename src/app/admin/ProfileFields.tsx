import type { Author } from "@/lib/injeong/content";
import { AvatarPicker } from "./AvatarPicker";

/** The writer profile fields (photo, name, title), shared by 내 정보 and 계정 관리. */
export function ProfileFields({ profile, fallbackName }: { profile: Author | null; fallbackName?: string }) {
  const name = profile?.name ?? fallbackName ?? "";
  return (
    <>
      <AvatarPicker current={profile?.photoUrl} initial={name.slice(0, 1) || "?"} />
      <div className="ad-grid2">
        <label className="ad-field">
          <span>칼럼에 표시할 이름</span>
          <input name="pname" defaultValue={name} maxLength={20} placeholder="예: 김병철" />
        </label>
        <label className="ad-field">
          <span>직함 <em>예: 인정건설 이사</em></span>
          <input name="prole" defaultValue={profile?.role ?? ""} maxLength={40} />
        </label>
        <label className="ad-field wide">
          <span>약력 <em>한 줄에 하나씩. 칼럼 끝 작성자 소개에 나옵니다. 예: 2016~2022 현대엔지니어링</em></span>
          <textarea name="phistory" defaultValue={(profile?.history ?? []).join("\n")} rows={4} maxLength={400} />
        </label>
      </div>
    </>
  );
}
