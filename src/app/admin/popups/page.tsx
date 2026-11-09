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
    <Shell title="팝업" here="/admin/popups" action={<Link className="ad-btn primary" href="/admin/popups/edit">새 팝업</Link>}>
      <Saved show={saved === "1"} />
      <p className="ad-muted">홈 첫 화면에 한 번에 하나만 뜹니다. 켜져 있고 기간 안에 든 팝업 가운데 가장 위의 것이 보입니다.</p>
      {list.length === 0 ? (
        <div className="ad-empty">
          <p>아직 만든 팝업이 없습니다.</p>
          <Link className="ad-btn primary" href="/admin/popups/edit">첫 팝업 만들기</Link>
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
                  {now?.id === p.id ? <span className="ad-tag on">지금 표시 중</span> : p.active ? <span className="ad-tag">켜짐 (기간 밖)</span> : <span className="ad-tag">꺼짐</span>}
                </td>
                <td className="ad-acts">
                  <Link className="ad-btn" href={`/admin/popups/edit?id=${p.id}`}>고치기</Link>
                  <form action={togglePopup}><input type="hidden" name="id" value={p.id} /><button type="submit" className="ad-btn">{p.active ? "끄기" : "켜기"}</button></form>
                  <form action={removePopup}><input type="hidden" name="id" value={p.id} /><ConfirmButton message="이 팝업을 지울까요?">삭제</ConfirmButton></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
}
