const types = ["공장 신축", "물류센터·창고", "저온·냉동창고", "증축·리모델링", "사옥·연구시설", "부지 조성", "견적서 검토", "기타"];
const sizes = ["300평 미만", "300~1,000평", "1,000~3,000평", "3,000평 이상", "아직 모름"];

export function Contact() {
  return (
    <section className="sec soft" id="contact">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="kicker rv">견적 상담</span>
            <h2 className="h2 rv">공장 계획, 어디서부터 시작할지<br />함께 정리해 드립니다</h2>
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
              <label className="full">부지 위치
                <input name="region" placeholder="예) 충남 당진시 송산면" />
              </label>
              <label>성함<em>필수</em>
                <input name="name" autoComplete="name" />
              </label>
              <label>연락처<em>필수</em>
                <input name="phone" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" />
              </label>
              <label className="full">내용
                <textarea name="msg" rows={4} placeholder="예) 2,000평 규모 생산동 신축 예정, 설비 목록은 정리 중입니다." />
              </label>
            </div>
            <label className="agree">
              <input type="checkbox" name="agree" value="1" />
              <span>견적 상담 목적의 개인정보 처리에 동의합니다. 수집 항목은 성함·연락처·문의 내용이며, 상담을 마친 날부터 1년간 보관합니다.</span>
            </label>
            <button className="btn cta" type="submit">견적 상담 신청</button>
            <div className="msg" role="status" />
          </form>
          <aside className="rv">
            <h3>전화가 더 빠릅니다</h3>
            <a className="tel num" href="tel:041-633-9942">041-633-9942</a>
            <dl>
              <div><dt>상담 시간</dt><dd>평일 08:30 – 17:30</dd></div>
              <div><dt>팩스</dt><dd className="num">041-633-9943</dd></div>
              <div><dt>이메일</dt><dd>contact@injeong.example</dd></div>
              <div><dt>사무실</dt><dd>충청남도 홍성군 (주소 입력 예정)</dd></div>
            </dl>
            <p className="note">현장을 직접 보고 상담을 원하시면 방문 일정을 잡아 드립니다.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
