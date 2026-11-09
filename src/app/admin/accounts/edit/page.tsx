import Link from "next/link";
import { MIN_PASSWORD, PERMS } from "@/lib/injeong/accounts";
import { accounts, requireAdmin } from "@/lib/injeong/auth";
import { saveAccount } from "../../actions";
import { Shell } from "../../shell";
import { ActionForm, Submit } from "../../ui";

export const metadata = { title: "계정 편집" };

export default async function AccountEdit({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin("super");
  const { id } = await searchParams;
  const a = id ? (await accounts()).find((x) => x.id === id) : undefined;
  const isSuper = a?.role === "super";
  return (
    <Shell title={a ? "계정 수정" : "계정 등록"} here="/admin/accounts" action={<Link className="ad-btn" href="/admin/accounts">목록</Link>}>
      <ActionForm action={saveAccount} className="ad-form ad-narrow">
        <input type="hidden" name="editing" value={a?.id ?? ""} />
        <label className="ad-field">
          <span>이름 <em>관리자 화면 상단에 표시</em></span>
          <input name="name" defaultValue={a?.name} required maxLength={20} placeholder="예: 김병철 이사" />
        </label>
        <label className="ad-field">
          <span>아이디 <em>{a ? "변경 불가" : "영문 소문자와 숫자, 3~20자"}</em></span>
          <input name="id" defaultValue={a?.id} disabled={Boolean(a)} required={!a} pattern="[a-z0-9][a-z0-9_\-]{2,19}" autoCapitalize="none" spellCheck={false} autoComplete="off" />
        </label>
        <label className="ad-field">
          <span>{a ? "새 비밀번호" : "비밀번호"} <em>{a ? `변경할 때만 입력. ${MIN_PASSWORD}자 이상` : `${MIN_PASSWORD}자 이상`}</em></span>
          <input type="password" name="password" autoComplete="new-password" required={!a} minLength={MIN_PASSWORD} />
        </label>
        {isSuper ? (
          <p className="ad-muted">총괄관리자는 모든 메뉴와 계정 관리를 사용할 수 있습니다.</p>
        ) : (
          <fieldset className="ad-field">
            <legend>담당 메뉴 <em>하나 이상</em></legend>
            {PERMS.map((p) => (
              <label key={p.key} className="ad-check"><input type="checkbox" name="perms" value={p.key} defaultChecked={a?.perms.includes(p.key)} /> {p.label}</label>
            ))}
          </fieldset>
        )}
        {a && <p className="ad-muted">비밀번호를 변경하면 이 계정은 모든 기기에서 로그아웃됩니다. 새 비밀번호는 본인에게 직접 전달해 주세요.</p>}
        <div className="ad-row">
          <Submit>{a ? "저장" : "등록"}</Submit>
          <Link className="ad-btn" href="/admin/accounts">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
