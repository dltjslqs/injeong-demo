import Link from "next/link";
import { coverOf } from "@/components/sites/injeong/ColumnArticle";
import type { Block } from "@/components/sites/injeong/columns";
import { BASE } from "@/components/sites/injeong/base";
import { projectImg } from "@/components/sites/injeong/data";
import { requireAdmin } from "@/lib/injeong/auth";
import { blocksToDoc } from "@/lib/injeong/coldoc";
import { allColumns, getProjects } from "@/lib/injeong/content";
import { saveColumn } from "../../actions";
import { Shell } from "../../shell";
import { RichEditor } from "../../RichEditor";
import { ActionForm, Submit } from "../../ui";

export const metadata = { title: "칼럼 등록" };

const CATS = ["시공사 고르기", "공장 신축", "공장 증축", "오피스텔·사무용 건물", "관급공사", "인허가", "공사관리", "법령"];

// a new column starts with the shape every column has: a question, an opening, the contact box, sections
const TEMPLATE: Block[] = [
  { t: "q", x: "“건축주가 자주 하시는 질문을 한 줄로 입력해 주세요.”" },
  { t: "p", x: "도입 문단입니다. 이 글에서 무엇을 다루는지 적습니다." },
  { t: "ask", x: "공사 상담이 필요하다면," },
  { t: "h2", x: "1. 첫 번째 소제목" },
  { t: "p", x: "본문 문단입니다." },
];

export default async function ColumnEdit({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  await requireAdmin("columns");
  const { slug } = await searchParams;
  const c = slug ? (await allColumns()).find((x) => x.slug === slug) : undefined;
  const projects = await getProjects();
  const doc = blocksToDoc(c ? c.blocks : TEMPLATE, {
    project: (id) => {
      const p = projects.find((x) => x.id === id);
      const src = p && projectImg(p);
      return p && src ? { src, cap: `${p.name}, ${p.done.slice(0, 4)}년 준공` } : null;
    },
    cover: (id) => `${BASE}/sites/injeong/cols/${id}.jpg`,
  });
  return (
    <Shell title={c ? "칼럼 수정" : "칼럼 등록"} here="/admin/columns" action={<Link className="ad-btn" href="/admin/columns">목록</Link>}>
      <ActionForm action={saveColumn} className="ad-form">
        <input type="hidden" name="slug" value={c?.slug ?? ""} />
        <input type="hidden" name="series" value={c?.series ?? ""} />
        <input type="hidden" name="cover_id" value={c?.cover ?? ""} />
        <input type="hidden" name="coverUrl" value={c?.coverUrl ?? ""} />
        <div className="ad-grid2">
          <label className="ad-field wide">
            <span>제목</span>
            <input name="title" defaultValue={c?.title} required maxLength={120} />
          </label>
          <label className="ad-field wide">
            <span>부제 <em>목록과 검색 결과에 보이는 한 줄</em></span>
            <input name="sub" defaultValue={c?.sub} maxLength={160} />
          </label>
          <label className="ad-field">
            <span>분류</span>
            <input name="cat" defaultValue={c?.cat ?? "공장 신축"} list="cats" required />
            <datalist id="cats">{CATS.map((x) => <option key={x} value={x} />)}</datalist>
          </label>
          <label className="ad-field">
            <span>게시일 <em>예: 2026.11.09</em></span>
            <input name="date" defaultValue={c?.date ?? ""} placeholder="미입력 시 오늘 날짜" pattern="\d{4}\.\d{2}(\.\d{2})?" />
          </label>
        </div>
        <fieldset className="ad-field">
          <legend>대표 사진 <em>목록과 홈 카드에 쓰입니다. 미입력 시 본문 첫 사진</em></legend>
          {c && <img className="ad-thumb" src={coverOf(c)} alt="" />}
          <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" />
          {c?.coverUrl && <label className="ad-check"><input type="checkbox" name="removeCover" /> 대표 사진 삭제</label>}
        </fieldset>
        <RichEditor initial={doc} />
        <div className="ad-row ad-sticky">
          <Submit>{c ? "저장" : "등록"}</Submit>
          <Link className="ad-btn" href="/admin/columns">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
