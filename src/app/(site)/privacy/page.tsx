import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/components/sites/injeong/data";
import { pageMeta } from "@/lib/injeong/site";

export const metadata: Metadata = pageMeta({
  title: "개인정보처리방침",
  description: "㈜인정건설 홈페이지가 견적 문의로 받는 개인정보의 항목, 이용 목적, 보관 기간, 처리 위탁과 국외 이전, 정보주체의 권리와 문의처를 안내합니다.",
  path: "/privacy",
});

// 개인정보 보호법 제30조(처리방침)·제28조의8(국외 이전)에 맞춘 내용. 바꾸면 아래 시행일과 변경 이력도 함께 고친다.
const EFFECTIVE = "2026년 11월 18일";
const OFFICER = { name: "김병철", title: "이사" };

export default function PrivacyPage() {
  return (
    <article className="art pv">
      <header className="art-hd">
        <div className="container">
          <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link><span aria-hidden="true">/</span><span>개인정보처리방침</span></nav>
          <h1>개인정보처리방침</h1>
          <p className="art-sub">{company.name}(이하 「회사」)는 홈페이지(www.injeongcon.co.kr)에서 받는 개인정보를 「개인정보 보호법」에 따라 처리하고 보호합니다. 시행일 {EFFECTIVE}.</p>
        </div>
      </header>
      <div className="container art-body">
        <h2>1. 처리 목적</h2>
        <p>회사는 홈페이지 견적 문의로 받은 개인정보를 다음 목적에만 씁니다. 목적이 바뀌면 미리 동의를 받습니다.</p>
        <ul className="art-list">
          <li>견적·공사 상담: 문의 내용 확인, 연락, 견적과 일정 안내</li>
          <li>회사 자료(공사지명원) 발송: 받아 보기를 고른 경우</li>
        </ul>

        <h2>2. 처리 항목</h2>
        <div className="pv-tw">
          <table className="pv-t">
            <thead><tr><th scope="col">구분</th><th scope="col">항목</th></tr></thead>
            <tbody>
              <tr><td>필수</td><td>성함, 연락처, 공사 종류</td></tr>
              <tr><td>선택</td><td>규모, 공사 위치, 문의 내용, 첨부 파일(도면·자료), 회사 자료 수신 여부</td></tr>
              <tr><td>자동 생성</td><td>홈페이지 이용 과정에서 서버에 남는 접속 기록(접속 IP, 접속 일시, 브라우저 정보). 보안과 장애 대응에만 쓰입니다.</td></tr>
            </tbody>
          </table>
        </div>
        <p>첨부 파일에는 성함·연락처 외의 개인정보가 들어가지 않도록 해 주세요.</p>

        <h2>3. 보유 기간과 파기</h2>
        <ul className="art-list">
          <li>견적 문의 내용과 첨부 파일은 <b>상담을 마친 날부터 1년</b> 보관한 뒤 지체 없이 파기합니다.</li>
          <li>상담이 공사 계약으로 이어지면, 계약 관련 기록은 「상법」, 「국세기본법」 등 관련 법령이 정한 기간 동안 따로 보관합니다.</li>
          <li>전자 파일은 복구할 수 없는 방법으로 삭제하고, 문의 알림 메일도 함께 삭제합니다. 종이로 출력한 자료는 분쇄하거나 소각합니다.</li>
        </ul>

        <h2>4. 제3자 제공</h2>
        <p>회사는 개인정보를 제3자에게 제공하지 않습니다. 다만 정보주체가 동의했거나 법령에 특별한 규정이 있는 경우는 예외입니다.</p>

        <h2>5. 처리 위탁</h2>
        <p>회사는 홈페이지 운영을 위해 다음 업무를 맡기고 있으며, 맡긴 업무 외에는 개인정보를 쓰지 않도록 관리합니다.</p>
        <div className="pv-tw">
          <table className="pv-t">
            <thead><tr><th scope="col">수탁자</th><th scope="col">위탁 업무</th></tr></thead>
            <tbody>
              <tr><td>Vercel Inc.</td><td>홈페이지 서버 운영, 견적 문의 내용과 첨부 파일 보관</td></tr>
              <tr><td>Resend</td><td>견적 문의 알림 메일 발송</td></tr>
              <tr><td>보름달컴퍼니</td><td>홈페이지 유지보수</td></tr>
            </tbody>
          </table>
        </div>

        <h2>6. 국외 이전</h2>
        <p>위 수탁자 가운데 해외 업체에 다음과 같이 개인정보가 옮겨져 보관·처리됩니다. 국외 이전을 원하지 않으시면 홈페이지 문의 대신 대표전화로 상담해 주세요. 이 경우 홈페이지 문의 기능은 이용하실 수 없습니다.</p>
        <div className="pv-tw">
          <table className="pv-t">
            <thead><tr><th scope="col">이전받는 자</th><th scope="col">국가</th><th scope="col">이전 항목</th><th scope="col">목적·보유 기간</th><th scope="col">일시·방법</th></tr></thead>
            <tbody>
              <tr><td>Vercel Inc.<br /><span className="pv-m">privacy@vercel.com</span></td><td>미국</td><td>2번의 필수·선택 항목, 접속 기록</td><td>서버 운영과 문의 보관, 3번의 보유 기간까지</td><td>문의를 보낼 때 암호화 통신(HTTPS)으로 전송</td></tr>
              <tr><td>Resend<br /><span className="pv-m">privacy@resend.com</span></td><td>미국·일본</td><td>2번의 필수·선택 항목</td><td>알림 메일 발송, 발송 기록은 수탁자 보관 기간까지</td><td>문의를 보낼 때 암호화 통신(HTTPS)으로 전송</td></tr>
            </tbody>
          </table>
        </div>

        <h2>7. 정보주체의 권리와 행사 방법</h2>
        <p>정보주체는 회사에 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다. 아래 개인정보 보호책임자에게 전화나 이메일로 요청하시면 지체 없이 조치합니다. 대리인을 통해서도 요구할 수 있으며, 이 경우 위임장을 함께 내 주셔야 합니다.</p>

        <h2>8. 안전성 확보 조치</h2>
        <ul className="art-list">
          <li>홈페이지와 문의 전송 구간 전체를 암호화 통신(HTTPS)으로만 운영합니다.</li>
          <li>문의 내용은 관리자 계정으로만 볼 수 있고, 계정마다 담당 메뉴를 나눠 접근 권한을 제한합니다. 비밀번호를 여러 번 틀리면 로그인이 잠깁니다.</li>
          <li>첨부 파일은 추측할 수 없는 무작위 주소로 저장하고, 그 주소는 문의 알림을 받는 담당자만 압니다.</li>
          <li>보유 기간이 지난 문의는 관리자 화면에서 파기합니다.</li>
        </ul>

        <h2>9. 쿠키 등 자동 수집 장치</h2>
        <p>회사 홈페이지는 방문자를 식별하거나 광고에 쓰는 쿠키를 사용하지 않습니다. 팝업의 「일주일 동안 보지 않기」를 누르면 그 선택만 이용하시는 브라우저에 저장되며, 브라우저 설정에서 언제든 지울 수 있습니다. 관리자 로그인에만 로그인 유지용 쿠키를 씁니다.</p>

        <h2>10. 개인정보 보호책임자</h2>
        <div className="pv-tw">
          <table className="pv-t">
            <tbody>
              <tr><th scope="row">책임자</th><td>{OFFICER.title} {OFFICER.name}</td></tr>
              <tr><th scope="row">전화</th><td><a className="num" href={`tel:${company.tel}`}>{company.tel}</a></td></tr>
              <tr><th scope="row">이메일</th><td><a href={`mailto:${company.email}`}>{company.email}</a></td></tr>
            </tbody>
          </table>
        </div>

        <h2>11. 권익 침해 구제</h2>
        <p>개인정보 침해에 대한 신고나 상담은 아래 기관에도 하실 수 있습니다.</p>
        <ul className="art-list">
          <li>개인정보침해신고센터: 국번 없이 118, privacy.kisa.or.kr</li>
          <li>개인정보분쟁조정위원회: 1833-6972, www.kopico.go.kr</li>
          <li>대검찰청: 국번 없이 1301, www.spo.go.kr</li>
          <li>경찰청: 국번 없이 182, ecrm.police.go.kr</li>
        </ul>

        <h2>12. 방침의 변경</h2>
        <p>이 방침은 {EFFECTIVE}부터 시행합니다. 내용이 바뀌면 시행 7일 전부터 홈페이지에 알립니다.</p>
      </div>
    </article>
  );
}
