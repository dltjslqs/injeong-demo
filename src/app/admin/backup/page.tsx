import { requireAdmin } from "@/lib/injeong/auth";
import { type BackupEvent, listSnapshots, readBackupLog } from "@/lib/injeong/backup";
import { snapshotNow } from "../actions";
import { Shell } from "../shell";

export const metadata = { title: "백업" };

// vercel.json runs the monthly backup at 18:00 UTC on the 1st, which is 03:00 on the 2nd in Korea
const KST = 9 * 3600e3;
const fmt = (iso: string) => {
  const d = new Date(Date.parse(iso) + KST).toISOString();
  return `${d.slice(0, 10).replaceAll("-", ".")} ${d.slice(11, 16)}`;
};
function nextAuto(): string {
  const now = new Date();
  const run = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 18));
  if (run <= now) run.setUTCMonth(run.getUTCMonth() + 1);
  return fmt(run.toISOString());
}

const KIND: Record<BackupEvent["kind"], string> = {
  auto: "자동 백업",
  manual: "수동 백업",
  download: "전체 내려받기",
  "download-snapshot": "백업본 내려받기",
};

export default async function BackupPage({ searchParams }: { searchParams: Promise<{ saved?: string; failed?: string }> }) {
  await requireAdmin("super");
  const { saved, failed } = await searchParams;
  const [snapshots, log] = await Promise.all([listSnapshots(), readBackupLog()]);
  const lastAuto = log.find((e) => e.kind === "auto");
  const lastDownload = log.find((e) => e.kind === "download");

  return (
    <Shell title="백업" here="/admin/backup">
      {saved === "1" && <p className="ad-ok" role="status">서버에 백업본을 저장했습니다.</p>}
      {failed === "1" && <p className="ad-err" role="alert">백업에 실패했습니다. 아래 이력의 오류 내용을 확인해 주세요.</p>}

      <section className="ad-card ad-bk-setup">
        <h2>백업 설정</h2>
        <dl className="ad-dl">
          <dt>자동 백업</dt>
          <dd>매월 2일 새벽 3시(한국 시간)에 서버가 자동으로 실행합니다.</dd>
          <dt>다음 자동 백업</dt>
          <dd className="ad-num">{nextAuto()}</dd>
          <dt>최근 자동 백업</dt>
          <dd>
            {lastAuto ? (
              <><span className="ad-num">{fmt(lastAuto.at)}</span> {lastAuto.ok ? <span className="ad-tag on">성공</span> : <span className="ad-tag err">실패</span>}</>
            ) : (
              <span className="ad-muted">아직 실행된 적이 없습니다.</span>
            )}
          </dd>
          <dt>백업 대상</dt>
          <dd>기술 칼럼, 시공 실적, 팝업, 작성자 프로필, 관리자 계정(암호화된 상태)</dd>
          <dt>보관</dt>
          <dd>서버 저장소(Vercel Blob)에 최근 12개를 보관하고, 그보다 오래된 백업본은 자동으로 삭제합니다.</dd>
          <dt>사진</dt>
          <dd>등록한 사진은 한 번 올리면 바뀌지 않아 서버 백업본에는 넣지 않습니다. 사진까지 받으려면 「전체 백업 내려받기」를 이용해 주세요.</dd>
          <dt>복원</dt>
          <dd>관리자 화면에서는 할 수 없습니다. 복원이 필요하면 백업 파일을 홈페이지 제작사에 전달해 주세요.</dd>
          <dt>권장</dt>
          <dd>
            서버 백업은 같은 서버 안에 있는 사본입니다. 한 달에 한 번 전체 백업을 내려받아 회사 PC나 외장 저장소에도 보관해 주세요.
            {lastDownload ? <> 마지막 내려받기: <span className="ad-num">{fmt(lastDownload.at)}</span> ({lastDownload.by})</> : " 아직 내려받은 기록이 없습니다."}
          </dd>
        </dl>
      </section>

      <div className="ad-cards ad-bk-acts">
        <section className="ad-card">
          <h2>전체 백업 내려받기</h2>
          <p className="ad-muted">위 내용과 등록한 사진 전체를 ZIP 파일 하나로 받습니다.</p>
          <div className="ad-row">
            <a className="ad-btn primary" href="/api/admin/backup" download>백업 파일 내려받기</a>
          </div>
        </section>
        <section className="ad-card">
          <h2>지금 백업</h2>
          <p className="ad-muted">자동 백업을 기다리지 않고 지금 내용을 서버에 저장합니다. 같은 날 다시 누르면 그날 백업본을 덮어씁니다.</p>
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
                <td className="ad-num">{s.replaceAll("-", ".")}</td>
                <td className="ad-acts"><a className="ad-btn" href={`/api/admin/backup?snapshot=${s}`} download>내려받기</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="ad-h2">백업 이력</h2>
      {log.length === 0 ? (
        <div className="ad-empty"><p>기록된 이력이 없습니다. 백업하거나 내려받으면 여기에 남습니다.</p></div>
      ) : (
        <table className="ad-table">
          <thead><tr><th scope="col">일시</th><th scope="col">구분</th><th scope="col">실행</th><th scope="col">대상</th><th scope="col">결과</th></tr></thead>
          <tbody>
            {log.slice(0, 50).map((e) => (
              <tr key={e.at + e.kind}>
                <td className="ad-num">{fmt(e.at)}</td>
                <td>{KIND[e.kind]}</td>
                <td>{e.by}</td>
                <td className="ad-num">{e.kind === "download" ? "전체(사진 포함)" : e.label ? `${e.label.replaceAll("-", ".")}${e.files !== undefined ? ` (파일 ${e.files}개)` : ""}` : "-"}</td>
                <td>{e.ok ? <span className="ad-tag on">성공</span> : <><span className="ad-tag err">실패</span> <span className="ad-muted">{e.error}</span></>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {log.length > 50 && <p className="ad-muted">최근 50건만 표시합니다.</p>}
    </Shell>
  );
}
