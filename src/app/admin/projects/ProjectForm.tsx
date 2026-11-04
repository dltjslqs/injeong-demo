"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { saveProject } from "../actions";
import { ActionForm, Submit } from "../ui";

export type ProjectInit = {
  id: string;
  name: string;
  cat: string;
  client: string;
  use: string;
  scale: string;
  area?: string;
  cost?: string;
  share?: string;
  period: string;
  done: string;
  ongoing: boolean;
  img?: string;
  imgUrl?: string;
  photo?: string; // what the site shows now
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const toMonth = (s: string) => (/^\d{4}\.\d{2}$/.test(s) ? s.replace(".", "-") : "");
const fromMonth = (s: string) => (s ? s.replace("-", ".") : "");
const num = (s?: string) => (s ? s.replace(/[^\d.]/g, "") : "");
const withCommas = (s: string) => {
  const [a, b] = s.split(".");
  return a ? `${Number(a).toLocaleString("ko-KR")}${b !== undefined ? `.${b}` : ""}` : "";
};

/** Project editor: grouped fields on the left, the card as the site will show it on the right. */
export function ProjectForm({ init, cats }: { init: ProjectInit | null; cats: { key: string; label: string }[] }) {
  const [period0, period1] = (init?.period ?? "").split(/\s*[–-]\s*/);
  const [f, setF] = useState({
    name: init?.name ?? "",
    cat: init?.cat ?? "",
    client: init?.client ?? "",
    use: init?.use ?? "",
    scale: init?.scale ?? "",
    area: num(init?.area),
    cost: num(init?.cost),
    share: init?.share ?? "",
    start: toMonth(period0 ?? ""),
    end: toMonth(period1 ?? ""),
    done: toMonth(init?.ongoing ? "" : init?.done ?? ""),
    ongoing: init?.ongoing ?? false,
  });
  const [preview, setPreview] = useState<string | undefined>(init?.photo);
  const [removed, setRemoved] = useState(false);
  const [picked, setPicked] = useState(false);
  const [over, setOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((x) => {
      const next = { ...x, [k]: v };
      // the completion month follows the end of the period until it is set by hand
      if (k === "end" && (!x.done || x.done === x.end)) next.done = String(v);
      return next;
    });
  };

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !IMAGE_TYPES.includes(file.type) || !fileInput.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.current.files = dt.files;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setPreview(objectUrl.current);
    setPicked(true);
    setRemoved(false);
  };

  const period = f.start || f.end ? `${fromMonth(f.start)} – ${fromMonth(f.end)}`.trim() : "";
  const catLabel = cats.find((c) => c.key === f.cat)?.label ?? "분류";
  const badge = f.ongoing ? "시공 중" : f.done ? `${fromMonth(f.done)} 준공` : "준공 연월";

  return (
    <ActionForm action={saveProject} className="pf-wrap">
      <input type="hidden" name="id" value={init?.id ?? ""} />
      <input type="hidden" name="img" value={init?.img ?? ""} />
      <input type="hidden" name="imgUrl" value={removed ? "" : init?.imgUrl ?? ""} />
      {removed && <input type="hidden" name="removePhoto" value="1" />}
      <input type="hidden" name="area" value={f.area ? `${withCommas(f.area)}㎡` : ""} />
      <input type="hidden" name="cost" value={f.cost ? `${f.cost}억` : ""} />
      <input type="hidden" name="period" value={period} />
      <input type="hidden" name="done" value={f.ongoing ? "" : fromMonth(f.done)} />

      <div className="pf-main">
        <section className="pf-sec">
          <h2>현장 사진</h2>
          <label
            className={over ? "pf-drop over" : "pf-drop"}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}
          >
            {preview && !removed ? <img src={preview} alt="" /> : <span className="pf-drop-empty"><b>사진을 끌어다 놓거나 눌러서 고르세요</b><small>가로 사진, JPG·PNG·WEBP, 10MB까지</small></span>}
            <input ref={fileInput} type="file" name="photo" accept={IMAGE_TYPES.join(",")} onChange={(e) => pick(e.target.files)} />
          </label>
          {preview && !removed && (
            <div className="ad-row">
              <button type="button" className="ad-btn" onClick={() => fileInput.current?.click()}>다른 사진으로</button>
              {(init?.imgUrl || picked) && (
                <button type="button" className="ad-btn danger" onClick={() => { setRemoved(true); if (fileInput.current) fileInput.current.value = ""; }}>사진 빼기</button>
              )}
            </div>
          )}
        </section>

        <section className="pf-sec">
          <h2>공사</h2>
          <div className="ad-grid2">
            <label className="ad-field wide"><span>공사명</span><input name="name" value={f.name} onChange={set("name")} required maxLength={120} placeholder="예: ㈜동신포리마 신원단공장 신축공사" /></label>
            <label className="ad-field"><span>분류</span>
              <select name="cat" value={f.cat} onChange={set("cat")} required>
                <option value="" disabled>고르세요</option>
                {cats.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </label>
            <label className="ad-field"><span>발주처</span><input name="client" value={f.client} onChange={set("client")} required placeholder="예: 충청남도 홍성교육지원청" /></label>
            <label className="ad-field"><span>용도</span><input name="use" value={f.use} onChange={set("use")} placeholder="예: 공장, 초등학교" /></label>
            <label className="ad-field"><span>규모</span><input name="scale" value={f.scale} onChange={set("scale")} placeholder="예: 지하 1층 · 지상 3층" /></label>
          </div>
        </section>

        <section className="pf-sec">
          <h2>면적과 금액</h2>
          <div className="ad-grid2">
            <label className="ad-field"><span>연면적</span><span className="pf-unit"><input inputMode="decimal" value={f.area} onChange={set("area")} placeholder="2072" /><i>㎡</i></span></label>
            <label className="ad-field"><span>공사비 <em>부가세 포함</em></span><span className="pf-unit"><input inputMode="decimal" value={f.cost} onChange={set("cost")} placeholder="33.5" /><i>억 원</i></span></label>
            <label className="ad-field wide"><span>공동도급 지분 <em>공동도급일 때만</em></span><input name="share" value={f.share} onChange={set("share")} placeholder="예: 공동도급 · 당사 지분 51%" /></label>
          </div>
        </section>

        <section className="pf-sec">
          <h2>일정</h2>
          <label className="pf-switch">
            <input type="checkbox" name="ongoing" checked={f.ongoing} onChange={set("ongoing")} />
            <span>지금 시공 중인 현장</span>
          </label>
          <div className="ad-grid2">
            <label className="ad-field"><span>착공</span><input type="month" value={f.start} onChange={set("start")} /></label>
            <label className="ad-field"><span>{f.ongoing ? "준공 예정" : "공사 끝"}</span><input type="month" value={f.end} onChange={set("end")} /></label>
            {!f.ongoing && <label className="ad-field"><span>준공 연월 <em>공사 끝과 다를 때만 바꾸세요</em></span><input type="month" value={f.done} onChange={set("done")} required /></label>}
          </div>
        </section>

        <div className="ad-row ad-sticky">
          <Submit>{init ? "고친 내용 저장" : "실적 게시"}</Submit>
          <Link className="ad-btn" href="/admin/projects">취소</Link>
        </div>
      </div>

      <aside className="pf-side" aria-label="홈페이지 미리보기">
        <p className="pf-side-h">홈페이지에서 이렇게 보입니다</p>
        <div className="pv-card">
          <span className="pv-pic">
            {preview && !removed ? <img src={preview} alt="" /> : <span className="pv-nopic">사진 없음</span>}
            <span className={f.ongoing ? "pv-badge now" : "pv-badge"}>{badge}</span>
          </span>
          <b className="pv-client">{f.client || "발주처"}</b>
          <span className="pv-meta">{catLabel}{f.ongoing && f.end ? `, ${fromMonth(f.end)} 준공 예정` : ""}</span>
          <span className="pv-name">{f.name || "공사명"}</span>
        </div>
        <dl className="pv-dl">
          <dt>용도</dt><dd>{f.use || "—"}</dd>
          <dt>연면적</dt><dd>{f.area ? `${withCommas(f.area)}㎡` : "—"}</dd>
          <dt>공사비</dt><dd>{f.cost ? `${f.cost}억` : "—"}</dd>
          <dt>공사 기간</dt><dd>{period || "—"}</dd>
        </dl>
      </aside>
    </ActionForm>
  );
}
