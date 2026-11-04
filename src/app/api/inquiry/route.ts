import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { extOf, MB, UPLOAD } from "@/components/sites/injeong/upload";

// Inquiries are only validated and stored on this machine (.uploads/inquiries).
// Connect this to the company's mail/CRM and file storage before going live.
const STORE = path.join(process.cwd(), ".uploads", "inquiries");

const bad = (message: string, status = 400) => NextResponse.json({ message }, { status });

export async function POST(req: Request) {
  // the reference clone still posts JSON; the 인정건설 form posts multipart with attachments
  if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    const d = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!d || !d.type || !d.name || !d.phone || !d.agree) return bad("필수 항목(공사 종류·성함·연락처)과 개인정보 동의를 확인해 주세요.");
    console.log("[inquiry]", d);
    return NextResponse.json({ ok: true });
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return bad("전송된 내용을 읽지 못했습니다. 다시 보내 주세요.");
  const fields: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") fields[k] = v;
  if (!fields.type || !fields.name || !fields.phone || fields.agree !== "1") {
    return bad("필수 항목(공사 종류·성함·연락처)과 개인정보 동의를 확인해 주세요.");
  }

  const files = fd.getAll("files").filter((v): v is File => typeof v !== "string" && v.size > 0);
  if (files.length > UPLOAD.maxFiles) return bad(`첨부는 최대 ${UPLOAD.maxFiles}개까지 받을 수 있습니다.`);
  let total = 0;
  for (const f of files) {
    if (!UPLOAD.exts.includes(extOf(f.name))) return bad(`${f.name}: 받을 수 없는 파일 형식입니다.`);
    if (f.size > UPLOAD.maxFileMB * MB) return bad(`${f.name}: 파일당 ${UPLOAD.maxFileMB}MB까지 받을 수 있습니다.`, 413);
    total += f.size;
  }
  if (total > UPLOAD.maxTotalMB * MB) return bad(`첨부 합계는 ${UPLOAD.maxTotalMB}MB까지입니다.`, 413);

  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 7)}`;
  const dir = path.join(STORE, id);
  await mkdir(dir, { recursive: true });
  const saved: string[] = [];
  for (const [i, f] of files.entries()) {
    // keep the original name readable but strip path separators and control characters
    const safe = `${String(i + 1).padStart(2, "0")}-${f.name.replace(/[\\/:*?"<>|\x00-\x1f]/g, "_").slice(-120)}`;
    await writeFile(path.join(dir, safe), Buffer.from(await f.arrayBuffer()));
    saved.push(safe);
  }
  await writeFile(path.join(dir, "inquiry.json"), JSON.stringify({ ...fields, files: saved, receivedAt: new Date().toISOString() }, null, 2));
  console.log("[inquiry]", id, fields.type, fields.name, `${saved.length} file(s)`);
  return NextResponse.json({ ok: true, files: saved.length });
}
