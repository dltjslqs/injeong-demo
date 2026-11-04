import { company } from "./data";
import { UPLOAD } from "./upload";

const types = ["교육·공공시설", "공장·창고", "교회·종교시설", "근생·주택", "리모델링·실내건축", "회사 자료(지명원) 요청", "기타"];
const sizes = ["300㎡ 미만", "300~1,000㎡", "1,000~3,000㎡", "3,000㎡ 이상", "아직 모름"];

export function Contact() {
  return (
    <section className="sec soft" id="contact">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">견적 문의</span>
            <h2 className="h2 rv">건축 계획을 남겨 주시면<br />담당자가 직접 연락드립니다</h2>
          </div>
        </div>
        <div className="ct">
          <form id="ij-form" className="rv" noValidate>
            <div className="grid">
              <label>공사 종류<em>필수</em>
                <select name="type" defaultValue="">
                  <option value="" disabled>선택해 주세요</option>
                  {types.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label>대략적인 규모
                <select name="size" defaultValue="">
                  <option value="">선택</option>
                  {sizes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="full">공사 위치
                <input name="region" placeholder="예) 충남 홍성군 홍성읍" />
              </label>
              <label>성함·회사명<em>필수</em>
                <input name="name" autoComplete="name" />
              </label>
              <label>연락처<em>필수</em>
                <input name="phone" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" />
              </label>
              <label className="full">내용
                <textarea name="msg" rows={4} placeholder="예) 연면적 1,500㎡ 규모 공장 증축을 검토 중입니다. 착공 희망 시기는 내년 봄입니다." />
              </label>
            </div>
            <div className="attach">
              <span className="al">도면·자료 첨부<small>선택</small><span className="fsum num" /></span>
              <div className="drop">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p><b>파일을 여기로 끌어다 놓거나</b>{" "}<label className="pick">파일 선택<input type="file" name="files" multiple accept={UPLOAD.exts.map((e) => `.${e}`).join(",")} /></label></p>
                <span className="hint">도면(PDF·DWG·DXF), 현장 사진, 견적서·내역서(한글·엑셀) 등 · 파일당 {UPLOAD.maxFileMB}MB, 최대 {UPLOAD.maxFiles}개 (합계 {UPLOAD.maxTotalMB}MB)</span>
              </div>
              <ul className="files" aria-live="polite" />
            </div>
            <label className="agree">
              <input type="checkbox" name="agree" value="1" />
              <span>견적 상담 목적의 개인정보 처리에 동의합니다. 수집 항목은 성함·연락처·문의 내용이며, 상담을 마친 날부터 1년간 보관합니다.</span>
            </label>
            <button className="btn cta" type="submit">견적 문의 보내기</button>
            <div className="msg" role="status" />
          </form>
          <aside className="rv">
            <h3>전화로 바로 문의하세요</h3>
            <a className="tel num" href={`tel:${company.tel}`}>{company.tel}</a>
            <dl>
              <div><dt>팩스</dt><dd className="num">{company.fax}</dd></div>
              <div><dt>이메일</dt><dd>{company.email}</dd></div>
              <div><dt>본사</dt><dd>{company.address}</dd></div>
            </dl>
            <p className="note">관급 공사 관련 회사 자료(면허·신용평가·시공능력평가·실적)도 요청하시면 보내 드립니다.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
