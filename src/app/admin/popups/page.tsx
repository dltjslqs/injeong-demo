import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { activePopup, readPopups } from "@/lib/injeong/content";
import { removePopup, togglePopup } from "../actions";
import { Saved, Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "팝업" };

export default async function PopupsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("popups");
  const { saved } = await searchParams;
  const [list, now] = await Promise.all([readPopups(), activePopup()]);
  return (
    <Shell title="팝업" here="/admin/popups" action={<Link className="ad-btn primary" href="/admin/popups/edit">팝업 등록</Link>}>
      <Saved show={saved === "1"} />
      <p className="ad-muted">홈 첫 화면에는 팝업이 하나만 표시됩니다. 사용 중이고 기간에 해당하는 팝업 가운데 맨 위의 것이 표시됩니다.</p>
      {list.length === 0 ? (
        <div className="ad-empty">
          <p>등록된 팝업이 없습니다.</p>
          <Link className="ad-btn primary" href="/admin/popups/edit">팝업 등록</Link>
        </div>
      ) : (
        <table className="ad-table">
          <thead><tr><th scope="col">제목</th><th scope="col">기간</th><th scope="col">상태</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className={p.active ? undefined : "off"}>
                <td><Link href={`/admin/popups/edit?id=${p.id}`} className="ad-title">{p.title}</Link></td>
                <td className="ad-num">{p.start ?? "제한 없음"} ~ {p.end ?? "제한 없음"}</td>
                <td>
                  {now?.id === p.id ? <span className="ad-tag on">현재 표시 중</span> : p.active ? <span className="ad-tag">대기</span> : <span className="ad-tag">중지</span>}
                </td>
                <td className="ad-acts">
                  <Link className="ad-btn" href={`/admin/popups/edit?id=${p.id}`}>수정</Link>
                  <form action={togglePopup}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="active" value={p.active ? "0" : "1"} /><button type="submit" className="ad-btn">{p.active ? "중지" : "사용"}</button></form>
                  <form action={removePopup}><input type="hidden" name="id" value={p.id} /><ConfirmButton message="이 팝업을 삭제할까요?">삭제</ConfirmButton></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
}
