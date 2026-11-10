import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { MIN_PASSWORD } from "@/lib/injeong/accounts";
import { savePassword } from "../actions";
import { Shell } from "../shell";
import { ActionForm, Submit } from "../ui";

export const metadata = { title: "비밀번호 변경" };

export default async function PasswordPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  return (
    <Shell title="비밀번호 변경" here="/admin/password">
      {saved === "1" && <p className="ad-ok" role="status">비밀번호를 변경했습니다. 다른 기기는 모두 로그아웃됐습니다.</p>}
      <ActionForm action={savePassword} className="ad-form ad-narrow">
        <p className="ad-muted">비밀번호를 변경하면 이 브라우저만 로그인이 유지되고, 다른 기기는 새 비밀번호로 다시 로그인해야 합니다.</p>
        <label className="ad-field">
          <span>현재 비밀번호</span>
          <input type="password" name="current" autoComplete="current-password" required />
        </label>
        <label className="ad-field">
          <span>새 비밀번호 <em>{MIN_PASSWORD}자 이상</em></span>
          <input type="password" name="next" autoComplete="new-password" required minLength={MIN_PASSWORD} />
        </label>
        <label className="ad-field">
          <span>새 비밀번호 확인</span>
          <input type="password" name="again" autoComplete="new-password" required minLength={MIN_PASSWORD} />
        </label>
        <div className="ad-row">
          <Submit>비밀번호 변경</Submit>
          <Link className="ad-btn" href="/admin">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
