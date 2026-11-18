import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { extOf, MB, UPLOAD } from "@/components/sites/injeong/upload";
import { deliverInquiry, type InquiryFile } from "@/lib/injeong/inquiry";

/*
 * Quote requests. On the server the form sends JSON: the fields and the attachments it has already
 * uploaded to the Blob store (see ./upload). Without a store (local development) it sends multipart
 * with the files, which are kept in .uploads/inquiries. Either way deliverInquiry keeps and mails it.
 */
const STORE = path.join(process.cwd(), ".uploads", "inquiries");
const FIELDS = ["type", "size", "region", "name", "phone", "msg", "profile", "agree"];
// attachments must be in this site's own store, under inquiry/
const ownFile = (u: string) => {
  try {
    const x = new URL(u);
    return x.protocol === "https:" && x.hostname.endsWith(".blob.vercel-storage.com") && x.pathname.startsWith("/inquiry/");
  } catch {
    return false;
  }
};

const bad = (message: string, status = 400) => NextResponse.json({ message }, { status });

export async function POST(req: Request) {
  // the reference clone still posts JSON; the 인정건설 form posts multipart with attachments
  if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    const d = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!d) return bad("전송된 내용을 읽지 못했습니다. 다시 보내 주세요.");
    const fields: Record<string, string> = {};
    for (const k of FIELDS) if (typeof d[k] === "string") fields[k] = (d[k] as string).slice(0, 4000);
    if (fields.profile === "1" && !fields.type) fields.type = "회사 자료(지명원) 요청";
    if (!fields.type || !fields.name || !fields.phone || fields.agree !== "1") return bad("필수 항목(공사 종류·성함·연락처)과 개인정보 동의를 확인해 주세요.");
    const raw = Array.isArray(d.files) ? (d.files as unknown[]) : [];
    if (raw.length > UPLOAD.maxFiles) return bad(`첨부는 최대 ${UPLOAD.maxFiles}개까지 받을 수 있습니다.`);
    const files: InquiryFile[] = [];
    for (const x of raw) {
      const f = x as { name?: unknown; url?: unknown; size?: unknown };
      if (typeof f.name !== "string" || typeof f.url !== "string" || !ownFile(f.url)) return bad("첨부 파일 정보가 올바르지 않습니다. 다시 보내 주세요.");
      files.push({ name: f.name.slice(0, 200), url: f.url, size: Number(f.size) || 0 });
    }
    const r = await deliverInquiry(fields, files);
    if (!r.kept && !r.mailed) return bad("일시적인 문제로 접수하지 못했습니다. 대표전화 041-633-9942로 연락 주세요.", 503);
    // mailed: whether the notice mail went out (false while mail is not set up); the inquiry is kept either way
    return NextResponse.json({ ok: true, files: files.length, mailed: r.mailed, ...("why" in r ? { why: r.why } : {}) });
  }

  const fd = await req.formData().catch(() => null);
  if (!fd) return bad("전송된 내용을 읽지 못했습니다. 다시 보내 주세요.");
  const fields: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") fields[k] = v;
  // a request for the company profile alone needs no project type
  if (fields.profile === "1" && !fields.type) fields.type = "회사 자료(지명원) 요청";
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
  // local development: the files stay on this machine, the mail lists their names
  await deliverInquiry(fields, files.map((f) => ({ name: f.name, size: f.size })));
  return NextResponse.json({ ok: true, files: saved.length });
}
