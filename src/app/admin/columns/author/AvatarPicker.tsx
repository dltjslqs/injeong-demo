"use client";

import { useEffect, useRef, useState } from "react";

const TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * The profile photo as the round picture the columns show: click it or drop a photo on it,
 * see the new photo at once, or delete it to fall back to the name's first letter.
 */
export function AvatarPicker({ current, initial }: { current?: string; initial: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const take = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!TYPES.includes(f.type)) {
      setError("JPG, PNG, WEBP 사진만 등록할 수 있습니다.");
      return;
    }
    setError(null);
    setRemoved(false);
    setPreview(URL.createObjectURL(f));
  };

  const shown = preview ?? (removed ? null : current ?? null);

  const clear = () => {
    if (input.current) input.current.value = "";
    setPreview(null);
    setRemoved(Boolean(current));
  };

  return (
    <div className="av-pick">
      <label
        className={`av-circle${over ? " over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (input.current && e.dataTransfer.files.length) {
            input.current.files = e.dataTransfer.files;
            take(e.dataTransfer.files);
          }
        }}
      >
        {shown ? <img src={shown} alt="프로필 사진 미리보기" /> : <span className="av-initial" aria-hidden="true">{initial}</span>}
        <span className="av-cam">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </span>
        <input ref={input} type="file" name="photo" accept={TYPES.join(",")} onChange={(e) => take(e.target.files)} aria-label="프로필 사진 선택" />
      </label>

      <div className="av-side">
        <p className="av-title">프로필 사진</p>
        <p className="ad-muted">
          {shown ? (preview ? "새 사진을 선택했습니다. 저장하면 적용됩니다." : "현재 등록된 사진입니다.") : "등록된 사진이 없어 이름 첫 글자가 표시됩니다."}
        </p>
        <p className="ad-muted">얼굴이 가운데 오는 정사각형 사진이 좋습니다. 원 모양으로 잘려 보입니다.</p>
        <div className="ad-row">
          <button type="button" className="ad-btn primary" onClick={() => input.current?.click()}>{shown ? "사진 변경" : "사진 선택"}</button>
          {shown && <button type="button" className="ad-btn" onClick={clear}>사진 삭제</button>}
        </div>
        {error && <p className="ad-err" role="alert">{error}</p>}
      </div>
      {removed && !preview && <input type="hidden" name="removePhoto" value="1" />}
    </div>
  );
}
