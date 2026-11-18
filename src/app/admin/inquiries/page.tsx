import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { listInquiries, strayFiles } from "@/lib/injeong/inquiries";
import { removeInquiry, removeStrayFiles } from "../actions";
import { Saved, Shell } from "../shell";
import { ConfirmButton } from "../ui";

export const metadata = { title: "견적 문의" };
export const dynamic = "force-dynamic";

const view = (id: string) => `/admin/inquiries/view?id=${encodeURIComponent(id)}`;

export default async function InquiriesAdmin({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("inquiries");
  const { saved } = await searchParams;
  const [list, stray] = await Promise.all([listInquiries(), strayFiles()]);
  return (
    <Shell title="견적 문의" here="/admin/inquiries">
      <Saved show={saved === "1"} />
      <p className="ad-note">홈페이지 견적 문의로 들어온 내용입니다. 같은 내용이 담당자 메일로도 갑니다. 상담을 마친 문의는 1년이 지나면 삭제해 주세요(문의 양식의 개인정보 보관 기간).</p>
      {stray.length > 0 && (
        <form action={removeStrayFiles} className="ad-note">
          문의 없이 저장소에 남은 첨부 파일이 {stray.length}개 있습니다. 문의를 보내다 중간에 실패하거나 그만둔 경우입니다.{" "}
          <ConfirmButton className="ad-btn" message={`문의와 연결되지 않은 첨부 파일 ${stray.length}개를 삭제할까요?`}>정리</ConfirmButton>
        </form>
      )}
      {list.length === 0 ? (
        <div className="ad-empty"><p>들어온 견적 문의가 없습니다.</p></div>
      ) : (
        <table className="ad-table">
          <thead><tr><th scope="col">접수</th><th scope="col">공사 종류</th><th scope="col">성함</th><th scope="col">연락처</th><th scope="col">공사 위치</th><th scope="col">첨부</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
          <tbody>
            {list.map((x) => (
              <tr key={x.id}>
                <td className="ad-num">{x.at}</td>
                <td><Link href={view(x.id)} className="ad-title">{x.type || "문의"}</Link>{x.size && <span className="ad-muted ad-small">{x.size}</span>}</td>
                <td>{x.name}</td>
                <td className="ad-num"><a href={`tel:${x.phone}`}>{x.phone}</a></td>
                <td>{x.region || "-"}</td>
                <td className="ad-num">{x.files.length ? `${x.files.length}개` : "-"}</td>
                <td className="ad-acts">
                  <Link className="ad-btn" href={view(x.id)}>보기</Link>
                  <form action={removeInquiry}><input type="hidden" name="id" value={x.id} /><ConfirmButton message={`${x.name}님의 문의와 첨부 파일을 삭제할까요? 삭제하면 복구할 수 없습니다.`}>삭제</ConfirmButton></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
}
