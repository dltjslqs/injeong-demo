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
      </div>
    </>
  );
}
