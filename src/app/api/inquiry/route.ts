import { NextResponse } from "next/server";

// The source posts to its own WordPress endpoint. This clone must not send
// inquiries to the source company, so it only validates and logs locally.
// Connect this to your own mail/CRM before going live.
export async function POST(req: Request) {
  const d = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!d || !d.type || !d.name || !d.phone || !d.agree) {
    return NextResponse.json({ message: "필수 항목(공사 종류·성함·연락처)과 개인정보 동의를 확인해 주세요." }, { status: 400 });
  }
  console.log("[inquiry]", d);
  return NextResponse.json({ ok: true });
}
