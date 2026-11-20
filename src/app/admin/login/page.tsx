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
        <p className="ad-muted">담당자 계정으로 로그인해 주세요.</p>
        <label className="ad-field">
          <span>아이디</span>
          <input name="id" autoComplete="username" autoCapitalize="none" spellCheck={false} required autoFocus />
        </label>
        <label className="ad-field">
          <span>비밀번호</span>
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        <Submit>로그인</Submit>
        <p className="ad-login-help">
          아이디나 비밀번호를 모르시면 홈페이지 제작사 보름달컴퍼니(<a href="mailto:dltjslqs@gmail.com">dltjslqs@gmail.com</a>)로 문의해 주세요.
        </p>
        <a className="ad-login-home" href="/">홈페이지로 돌아가기</a>
      </ActionForm>
    </main>
  );
}
