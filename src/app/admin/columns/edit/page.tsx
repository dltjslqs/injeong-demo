import Link from "next/link";
import { coverOf } from "@/components/sites/injeong/ColumnArticle";
import { requireAdmin } from "@/lib/injeong/auth";
import { blocksToMd } from "@/lib/injeong/colmd";
import { allColumns } from "@/lib/injeong/content";
import { saveColumn } from "../../actions";
import { Shell } from "../../shell";
import { ActionForm, BodyEditor, Submit } from "../../ui";

export const metadata = { title: "칼럼 쓰기" };

const CATS = ["시공사 고르기", "공장 신축", "공장 증축", "오피스텔·사무용 건물", "관급공사", "인허가", "공사관리", "법령"];

const TEMPLATE = `> "건축주가 자주 하시는 질문을 한 줄로 적어 주세요."

도입 문단입니다. 이 글에서 무엇을 다루는지 적습니다.

[상담: 공장 신축 견적 상담이 필요하다면,]

## 1. 첫 번째 소제목

본문 문단입니다.

| 구분 | 내용 |
| --- | --- |
| 항목 | 설명 |

## 2. 두 번째 소제목

- 확인할 것 하나
- 확인할 것 둘

마지막 정리 문장입니다.

[상담: 공사 상담이 필요하다면,]`;

export default async function ColumnEdit({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  await requireAdmin();
  const { slug } = await searchParams;
  const c = slug ? (await allColumns()).find((x) => x.slug === slug) : undefined;
  return (
    <Shell title={c ? "칼럼 고치기" : "새 칼럼 쓰기"} here="/admin/columns" action={<Link className="ad-btn" href="/admin/columns">목록으로</Link>}>
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
            <span>게시 연월 <em>예: 2026.11</em></span>
            <input name="date" defaultValue={c?.date ?? ""} placeholder="비우면 이번 달" pattern="\d{4}\.\d{2}" />
          </label>
        </div>
        <fieldset className="ad-field">
          <legend>대표 사진 <em>목록과 홈 카드에 쓰입니다. 비우면 본문 첫 사진</em></legend>
          {c && <img className="ad-thumb" src={coverOf(c)} alt="" />}
          <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" />
          {c?.coverUrl && <label className="ad-check"><input type="checkbox" name="removeCover" /> 올린 대표 사진 지우기</label>}
        </fieldset>
        <BodyEditor defaultValue={c ? blocksToMd(c.blocks) : TEMPLATE} />
        <div className="ad-row ad-sticky">
          <Submit>{c ? "고친 내용 저장" : "칼럼 게시"}</Submit>
          <Link className="ad-btn" href="/admin/columns">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
