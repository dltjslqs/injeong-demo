import { randomBytes } from "node:crypto";
import { company } from "@/components/sites/injeong/data";

/**
 * Where a quote request goes once the form is sent:
 * 1. a copy is kept in the Blob store (injeong/inquiries/…), so nothing is lost if mail fails;
 * 2. a mail goes to INQUIRY_TO through Resend (RESEND_API_KEY), with download links for the attachments.
 * Mail settings live in the server's environment: RESEND_API_KEY, INQUIRY_TO (comma-separated), MAIL_FROM.
 * Without MAIL_FROM it sends from Resend's test sender, which only delivers to the Resend account's own address.
 */
export type InquiryFile = { name: string; url?: string; size: number };
export type InquiryFields = Record<string, string>;

const LABELS: [string, string][] = [
  ["type", "공사 종류"],
  ["size", "규모"],
  ["region", "공사 위치"],
  ["name", "성함"],
  ["phone", "연락처"],
  ["msg", "문의 내용"],
];

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const kb = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`);
const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

// files up to this total are attached to the mail itself (Resend allows 40MB a mail after encoding)
const ATTACH_MAX = 25 * 1024 * 1024;

function mailBody(f: InquiryFields, files: InquiryFile[], at: string, attached: boolean) {
  const rows = LABELS.filter(([k]) => f[k]).map(([k, label]) => [label, f[k]]);
  if (f.profile === "1") rows.push(["회사 자료(지명원)", "받아 보기 원함"]);
  const html = `<div style="font-family:Pretendard,'Malgun Gothic',sans-serif;font-size:15px;color:#1a1a1a;line-height:1.6">
<h2 style="margin:0 0 4px;font-size:20px">홈페이지 견적 문의</h2>
<p style="margin:0 0 16px;color:#666">${esc(at)} 접수, ${esc(company.name)} 홈페이지</p>
<table style="border-collapse:collapse;width:100%;max-width:640px">${rows
    .map(([l, v]) => `<tr><th style="text-align:left;vertical-align:top;padding:8px 12px;background:#f4f6f9;border:1px solid #e3e6eb;width:110px;font-weight:600">${esc(l)}</th><td style="padding:8px 12px;border:1px solid #e3e6eb;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>
${files.length ? `<h3 style="margin:20px 0 6px;font-size:16px">첨부 ${files.length}개</h3><ul style="margin:0;padding-left:18px">${files
    .map((x) => `<li>${x.url ? `<a href="${esc(x.url)}">${esc(x.name)}</a>` : esc(x.name)} (${kb(x.size)})</li>`)
    .join("")}</ul><p style="color:#666;font-size:13px">${attached ? "파일은 이 메일에 함께 첨부되어 있고, 위 링크로도 내려받을 수 있습니다." : "파일이 커서 메일에는 붙이지 않았습니다. 위 링크를 눌러 내려받아 주세요."} 링크는 이 메일을 받은 분만 알고 있습니다.</p>` : ""}
</div>`;
  const text = [
    `홈페이지 견적 문의 (${at})`,
    ...rows.map(([l, v]) => `${l}: ${v}`),
    ...(files.length ? ["", `첨부 ${files.length}개`, ...files.map((x) => `- ${x.name} (${kb(x.size)})${x.url ? ` ${x.url}` : ""}`)] : []),
  ].join("\n");
  return { html, text };
}

/** Keeps the inquiry and mails it. Returns what happened; a mail failure does not lose the inquiry. */
export async function deliverInquiry(f: InquiryFields, files: InquiryFile[]) {
  const at = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16).replace("T", " ");
  let kept = false;
  if (blobOn()) {
    try {
      const { put } = await import("@vercel/blob");
      const id = `${at.replace(/[: ]/g, "-")}-${randomBytes(6).toString("hex")}`;
      await put(`injeong/inquiries/${id}.json`, JSON.stringify({ ...f, files, receivedAt: at }, null, 2), { access: "public", addRandomSuffix: true, contentType: "application/json" });
      kept = true;
    } catch (e) {
      console.error("[inquiry] keep failed", e);
    }
  }

  const key = process.env.RESEND_API_KEY;
  const to = (process.env.INQUIRY_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !to.length) {
    console.warn("[inquiry] mail not configured", { key: Boolean(key), to: to.length }, f.type, f.name);
    return { kept, mailed: false, why: !key ? "no key" : "no recipient" };
  }
  const attachable = files.some((x) => x.url) && files.reduce((a, x) => a + x.size, 0) <= ATTACH_MAX;
  const { html, text } = mailBody(f, files, at, attachable);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || `${company.name} 홈페이지 <onboarding@resend.dev>`,
      to,
      subject: `[견적 문의] ${f.type || "문의"} · ${f.name}${f.region ? ` · ${f.region}` : ""}`,
      html,
      text,
      // the files themselves ride along when they fit in one mail (Resend fetches them from the store);
      // bigger sets come as download links only, which the mail always lists
      ...(attachable ? { attachments: files.filter((x) => x.url).map((x) => ({ filename: x.name, path: x.url })) } : {}),
    }),
  }).catch((e) => {
    console.error("[inquiry] mail request failed", e);
    return null;
  });
  if (!res || !res.ok) {
    const detail = res ? `${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}` : "no response";
    console.error("[inquiry] mail rejected", detail);
    return { kept, mailed: false, why: detail };
  }
  return { kept, mailed: true };
}
