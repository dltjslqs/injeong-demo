import Link from "next/link";
import { categories, projectImg } from "@/components/sites/injeong/data";
import { requireAdmin } from "@/lib/injeong/auth";
import { allProjects } from "@/lib/injeong/content";
import { saveProject } from "../../actions";
import { Shell } from "../../shell";
import { ActionForm, Submit } from "../../ui";

export const metadata = { title: "실적 편집" };

export default async function ProjectEdit({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireAdmin();
  const { id } = await searchParams;
  const p = id ? (await allProjects()).find((x) => x.id === id) : undefined;
  const field = (name: string, label: string, value?: string, hint?: string, required = false) => (
    <label className="ad-field">
      <span>{label}{hint && <em> {hint}</em>}</span>
      <input name={name} defaultValue={value} required={required} />
    </label>
  );
  return (
    <Shell title={p ? "실적 고치기" : "실적 추가"} here="/admin/projects" action={<Link className="ad-btn" href="/admin/projects">목록으로</Link>}>
      <ActionForm action={saveProject} className="ad-form">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <input type="hidden" name="img" value={p?.img ?? ""} />
        <input type="hidden" name="imgUrl" value={p?.imgUrl ?? ""} />
        <div className="ad-grid2">
          <label className="ad-field wide">
            <span>공사명</span>
            <input name="name" defaultValue={p?.name} required maxLength={120} />
          </label>
          <label className="ad-field">
            <span>분류</span>
            <select name="cat" defaultValue={p?.cat ?? ""} required>
              <option value="" disabled>고르세요</option>
              {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </label>
          {field("client", "발주처", p?.client, undefined, true)}
          {field("use", "용도", p?.use, "예: 공장, 초등학교")}
          {field("scale", "규모", p?.scale, "예: 지하 1층 · 지상 3층")}
          {field("area", "연면적", p?.area, "예: 2,072㎡")}
          {field("cost", "공사비", p?.cost, "예: 33.5억")}
          {field("share", "공동도급 지분", p?.share, "공동도급일 때만")}
          {field("period", "공사 기간", p?.period, "예: 2024.12 – 2025.10")}
          <label className="ad-field">
            <span>준공 연월 <em>예: 2025.10</em></span>
            <input name="done" defaultValue={p?.ongoing ? "" : p?.done} pattern="\d{4}\.\d{2}" placeholder="시공 중이면 비워 두세요" />
          </label>
          <label className="ad-check ad-field">
            <input type="checkbox" name="ongoing" defaultChecked={p?.ongoing} /> 지금 시공 중인 현장
          </label>
        </div>
        <fieldset className="ad-field">
          <legend>현장 사진 <em>가로 사진, 10MB까지</em></legend>
          {p && projectImg(p) && <img className="ad-thumb" src={projectImg(p)} alt="" />}
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
          {p?.imgUrl && <label className="ad-check"><input type="checkbox" name="removePhoto" /> 올린 사진 지우기</label>}
        </fieldset>
        <div className="ad-row ad-sticky">
          <Submit>{p ? "고친 내용 저장" : "실적 게시"}</Submit>
          <Link className="ad-btn" href="/admin/projects">취소</Link>
        </div>
      </ActionForm>
    </Shell>
  );
}
