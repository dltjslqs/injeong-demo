import Link from "next/link";
import { MAX_ACCOUNTS, PERMS } from "@/lib/injeong/accounts";
import { accounts, requireAdmin } from "@/lib/injeong/auth";
import { removeAccount } from "../actions";
import { Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "계정 관리" };

export default async function AccountsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("super");
  const { saved } = await searchParams;
  const list = await accounts();
  const full = list.length >= MAX_ACCOUNTS;
  return (
    <Shell
      title="계정 관리"
      here="/admin/accounts"
      action={full ? <span className="ad-muted">계정 {MAX_ACCOUNTS}개를 모두 만들었습니다</span> : <Link className="ad-btn primary" href="/admin/accounts/edit">계정 추가</Link>}
    >
      {saved === "1" && <p className="ad-ok" role="status">저장했습니다. 권한은 그 계정의 다음 클릭부터 적용됩니다.</p>}
      <p className="ad-muted">총괄관리자 1명과 담당자 {MAX_ACCOUNTS - 1}명까지 둘 수 있습니다. 담당자는 맡은 메뉴만 보고 고칠 수 있습니다. ({list.length}/{MAX_ACCOUNTS})</p>
      <table className="ad-table">
        <thead><tr><th scope="col">이름</th><th scope="col">아이디</th><th scope="col">맡은 메뉴</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.id}>
              <td><Link href={`/admin/accounts/edit?id=${a.id}`} className="ad-title">{a.name}</Link></td>
              <td className="ad-num">{a.id}</td>
              <td>
                {a.role === "super"
                  ? <span className="ad-tag on">총괄관리자 (전체)</span>
                  : PERMS.filter((p) => a.perms.includes(p.key)).map((p) => <span key={p.key} className="ad-tag">{p.label}</span>)}
              </td>
              <td className="ad-acts">
                <Link className="ad-btn" href={`/admin/accounts/edit?id=${a.id}`}>고치기</Link>
                {a.role !== "super" && (
                  <form action={removeAccount}><input type="hidden" name="id" value={a.id} /><ConfirmButton message={`${a.name} 계정을 지울까요? 이 계정은 바로 로그아웃됩니다.`}>삭제</ConfirmButton></form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Shell>
  );
}
