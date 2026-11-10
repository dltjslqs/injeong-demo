import Link from "next/link";
import { requireAdmin } from "@/lib/injeong/auth";
import { listSnapshots } from "@/lib/injeong/backup";
import { snapshotNow } from "../actions";
import { Shell } from "../shell";

export const metadata = { title: "백업" };

export default async function BackupPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin("super");
  const { saved } = await searchParams;
  const snapshots = await listSnapshots();
  return (
    <Shell title="백업" here="/admin/backup" action={<Link className="ad-btn" href="/admin">홈으로</Link>}>
      {saved === "1" && <p className="ad-ok" role="status">서버에 백업본을 저장했습니다.</p>}
      <div className="ad-cards">
        <section className="ad-card">
          <h2>전체 백업 내려받기</h2>
          <p className="ad-muted">칼럼, 시공 실적, 팝업, 작성자 프로필, 계정과 등록한 사진 전체를 ZIP 파일 하나로 받습니다. 한 달에 한 번 받아서 회사 PC나 외장 저장소에 보관해 주세요.</p>
          <div className="ad-row">
            <a className="ad-btn primary" href="/api/admin/backup" download>백업 파일 내려받기</a>
          </div>
        </section>
        <section className="ad-card">
          <h2>서버 자동 백업</h2>
          <p className="ad-muted">매월 초 서버가 그 시점의 내용을 자동으로 저장하고 최근 12개를 보관합니다. 사진은 등록 후 바뀌지 않으므로 내용만 저장합니다.</p>
          <form action={snapshotNow} className="ad-row">
            <button type="submit" className="ad-btn">지금 백업</button>
          </form>
        </section>
      </div>
      <h2 className="ad-h2">서버에 보관 중인 백업</h2>
      {snapshots.length === 0 ? (
        <div className="ad-empty"><p>보관 중인 백업이 없습니다.</p></div>
      ) : (
        <table className="ad-table">
          <thead><tr><th scope="col">백업 시점</th><th scope="col"><span className="ad-sr">관리</span></th></tr></thead>
          <tbody>
            {snapshots.map((s) => (
              <tr key={s}>
                <td className="ad-num">{s}</td>
                <td className="ad-acts"><a className="ad-btn" href={`/api/admin/backup?snapshot=${s}`} download>내려받기</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="ad-muted">백업 복원은 관리자 화면에서 할 수 없습니다. 복원이 필요하면 백업 파일을 홈페이지 제작사에 전달해 주세요.</p>
    </Shell>
  );
}
