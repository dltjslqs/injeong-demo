import { BASE } from "./base";

// The company profile (공사지명원, public edition: personal data pages blanked). Re-export it when the source PDF changes.
export const PROFILE = { href: `${BASE}/sites/injeong/docs/injeong-profile-2026.pdf`, file: "인정건설_회사소개서_2026.pdf", size: "PDF 10MB" };

const Icon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);

/** The download as a button (home close, CTA rows). */
export function ProfileButton({ className = "btn btn-quiet" }: { className?: string }) {
  return (
    <a className={className} href={PROFILE.href} download={PROFILE.file}>
      <Icon />회사소개서 내려받기
    </a>
  );
}

/** The download as a card with what is inside (about page). */
export function ProfileCard() {
  return (
    <div className="pf rv">
      <div>
        <b>인정건설 회사소개서</b>
        <p>회사 개요와 연혁, 면허·등록증, 2003년부터의 주요 공사 실적까지 36쪽에 담았습니다.</p>
      </div>
      <a className="btn btn-seal" href={PROFILE.href} download={PROFILE.file}>
        <Icon />내려받기<span className="pf-size">{PROFILE.size}</span>
      </a>
    </div>
  );
}
