"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { type FormState, uploadPhoto } from "./actions";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/** A form wired to a server action; shows the action's error message above the buttons. */
export function ActionForm({ action, children, className }: { action: Action; children: React.ReactNode; className?: string }) {
  const [state, run] = useActionState(action, null);
  return (
    <form action={run} className={className}>
      {children}
      {state?.message && <p className="ad-err" role="alert">{state.message}</p>}
    </form>
  );
}

export function Submit({ children = "저장" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ad-btn primary" disabled={pending}>
      {pending ? "저장하고 있습니다" : children}
    </button>
  );
}

/** Asks before a destructive submit. */
export function ConfirmButton({ children, message, className = "ad-btn danger" }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}

/** The column body: a plain-text editor with a photo button that drops a [사진: …] line at the cursor. */
export function BodyEditor({ defaultValue }: { defaultValue: string }) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [state, upload, busy] = useActionState(uploadPhoto, null);
  const picker = useRef<HTMLInputElement>(null);
  const last = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!state?.url || state.url === last.current || !area.current) return;
    last.current = state.url;
    const t = area.current;
    const at = t.selectionStart ?? t.value.length;
    const tag = `\n\n[사진: ${state.url} | 사진 설명]\n\n`;
    t.value = t.value.slice(0, at) + tag + t.value.slice(at);
    t.focus();
    t.selectionStart = t.selectionEnd = at + tag.length;
  }, [state]);

  return (
    <div className="ad-body">
      <div className="ad-body-bar">
        <span>본문</span>
        <button type="button" className="ad-btn" onClick={() => picker.current?.click()} disabled={busy}>
          {busy ? "사진 올리는 중" : "본문에 사진 넣기"}
        </button>
        <input
          ref={picker}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const fd = new FormData();
            fd.set("photo", f);
            startTransition(() => upload(fd));
            e.target.value = "";
          }}
        />
      </div>
      {state?.message && <p className="ad-err" role="alert">{state.message}</p>}
      <textarea ref={area} name="md" defaultValue={defaultValue} rows={28} spellCheck={false} />
      <details className="ad-help">
        <summary>본문 쓰는 법</summary>
        <ul>
          <li><code>## 소제목</code> 큰 소제목, <code>### 작은 제목</code> 작은 소제목</li>
          <li><code>&gt; &quot;건축주의 질문&quot;</code> 강조되는 질문 한 줄</li>
          <li><code>- 항목</code> 점 목록, <code>1) 항목</code> 번호 목록</li>
          <li><code>| 구분 | 내용 |</code> 표 (첫 줄이 머리글, 줄마다 한 행)</li>
          <li><code>[사진: 주소 | 설명]</code> 사진 (위의 「본문에 사진 넣기」로 자동 입력)</li>
          <li><code>[상담: 공장 신축 견적이 필요하다면,]</code> 견적 문의 버튼 상자</li>
          <li>빈 줄로 문단을 나눕니다.</li>
        </ul>
      </details>
    </div>
  );
}
