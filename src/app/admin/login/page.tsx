import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/injeong/auth";
import { login } from "../actions";
import { ActionForm, Submit } from "../ui";

export const metadata = { title: "로그인" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="ad-login">
      <ActionForm action={login} className="ad-card ad-login-card">
        <h1>인정건설 관리자</h1>
        <p className="ad-muted">기술 칼럼, 시공 실적, 팝업을 관리합니다.</p>
        <label className="ad-field">
          <span>비밀번호</span>
          <input type="password" name="password" autoComplete="current-password" required autoFocus />
        </label>
        <Submit>로그인</Submit>
      </ActionForm>
    </main>
  );
}
