import { currentUser } from "@/lib/injeong/auth";
import { listSnapshots, listUploads, logBackup, readRaw, STORE_KEYS } from "@/lib/injeong/backup";
import { type ZipEntry, zipStream } from "@/lib/injeong/zip";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const README = [
  "인정건설 홈페이지 백업",
  "",
  "data/     관리자에서 등록·수정한 내용 (칼럼, 시공 실적, 팝업, 작성자 프로필, 계정)",
  "uploads/  관리자에서 올린 사진",
  "",
  "accounts.json은 암호화되어 있어 서버의 ADMIN_SECRET 없이는 읽을 수 없습니다.",
  "복원: data/의 파일을 서버 저장소의 같은 이름 파일에 덮어쓰고, uploads/의 사진을 같은 이름으로 올립니다.",
  "",
].join("\r\n");

/** The 총괄관리자 downloads everything as one ZIP; ?snapshot=2026-11 downloads that snapshot's data only. */
export async function GET(req: Request) {
  const me = await currentUser();
  if (!me || me.role !== "super") return new Response("권한이 없습니다.", { status: 403 });
  const snapshot = new URL(req.url).searchParams.get("snapshot") ?? undefined;
  if (snapshot && !(await listSnapshots()).includes(snapshot)) return new Response("없는 백업입니다.", { status: 404 });
  await logBackup(snapshot ? { kind: "download-snapshot", by: me.name, label: snapshot, ok: true } : { kind: "download", by: me.name, ok: true });

  async function* entries(): AsyncGenerator<ZipEntry> {
    yield { name: "README.txt", data: Buffer.from(README, "utf8") };
    for (const key of STORE_KEYS) {
      const body = await readRaw(key, snapshot);
      if (body !== null) yield { name: `data/${key}.json`, data: Buffer.from(body, "utf8") };
    }
    if (snapshot) return;
    for (const u of await listUploads()) yield { name: `uploads/${u.name}`, data: await u.read() };
  }

  const day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  return new Response(zipStream(entries()), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="injeong-backup-${snapshot ?? day}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
