import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/injeong/auth";
import { getInquiry } from "@/lib/injeong/inquiries";
import { removeInquiry } from "../../actions";
import { Shell } from "../../shell";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "견적 문의 보기" };
export const dynamic = "force-dynamic";

const kb = (n?: number) => (!n ? "" : n >= 1048576 ? `${(n / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`);

export default async function InquiryView({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin("inquiries");
  const { id } = await searchParams;
  const x = id ? await getInquiry(id) : null;
  if (!x) notFound();
  const rows: [string, React.ReactNode][] = [
    ["접수", x.at],
    ["공사 종류", x.type || "-"],
    ["규모", x.size || "-"],
    ["공사 위치", x.region || "-"],
    ["성함", x.name],
    ["연락처", <a key="tel" href={`tel:${x.phone}`}>{x.phone}</a>],
    ["회사 자료(지명원)", x.profile ? "받아 보기 원함" : "-"],
  ];
  return (
    <Shell title="견적 문의 보기" here="/admin/inquiries" action={<Link className="ad-btn" href="/admin/inquiries">목록</Link>}>
      <dl className="ad-dl">
        {rows.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
        <div><dt>문의 내용</dt><dd style={{ whiteSpace: "pre-wrap" }}>{x.msg || "-"}</dd></div>
        <div>
          <dt>첨부</dt>
          <dd>
            {x.files.length === 0
              ? "-"
              : x.files.map((f) => (
                  <p key={f.url ?? f.name}>
                    {f.url ? <a href={f.url} target="_blank" rel="noopener" download={f.name}>{f.name}</a> : f.name} <span className="ad-muted ad-small">{kb(f.size)}</span>
                  </p>
                ))}
          </dd>
        </div>
      </dl>
      <form action={removeInquiry} style={{ marginTop: 24 }}>
        <input type="hidden" name="id" value={x.id} />
        <ConfirmButton message={`${x.name}님의 문의와 첨부 파일을 삭제할까요? 삭제하면 복구할 수 없습니다.`}>문의 삭제</ConfirmButton>
      </form>
    </Shell>
  );
}
