// 인정건설 제출 자료(2026.11.03): 기초자료 작성표 + 03. 시공 실적 폴더의 공사개요
// 금액은 VAT 포함, 억 원 단위로 반올림. 공동도급은 총액과 당사 지분을 함께 적는다.

export const company = {
  name: "㈜인정건설",
  nameEn: "INJEONG CONSTRUCTION CO., LTD",
  ceo: "김석구",
  bizNo: "126-81-72450",
  founded: "2003년 6월 19일",
  since: 1989,
  address: "충남 홍성군 홍성읍 충절로938번길 16",
  tel: "041-633-9942",
  fax: "041-633-9945",
  email: "injeong89@naver.com",
  licenses: [
    { name: "건축공사업", no: "10-1210호" },
    { name: "실내건축공사업", no: "충남홍성 2024-나-03" },
  ],
  credit: { grade: "BB+", agency: "NICE평가정보", until: "2027.05.21" },
  capacity: { year: 2026, amount: "89.5억", rankRegion: "충남 104위", regionTotal: 440 },
  sales: [
    { year: 2023, amount: 41.2 },
    { year: 2024, amount: 53.1 },
    { year: 2025, amount: 67.5 },
  ],
  engineers: 16,
  awards: [
    "한국국토정보공사 감사패",
    "금산군청 감사패",
    "㈜동신포리마 감사패",
    "홍성농업협동조합 감사패",
    "홍동농협 감사패",
  ],
};

// 홈페이지에 실린 실적은 대표 현장만 고른 것이다. 실제 준공 실적은 이보다 많아서,
// 숫자로 보여 줄 때는 실린 건수에 이 배수를 곱한다 (2026.11 요청, 실제 총건수를 받으면 그 값으로 바꾼다).
export const RECORD_SCALE = 4;
export const recordCount = (n: number) => n * RECORD_SCALE;

export type Category = "교육" | "공공" | "군" | "산업" | "민간";

export type Project = {
  id: string;
  cat: Category;
  name: string;
  client: string;
  use: string;
  scale: string;
  area?: string;
  cost?: string;
  share?: string;
  period: string;
  done: string;
  img?: string;
  imgNote?: string;
  ongoing?: boolean;
};

export const categories: { key: Category; label: string }[] = [
  { key: "교육", label: "교육시설" },
  { key: "공공", label: "공공·의료" },
  { key: "군", label: "군 시설" },
  { key: "산업", label: "산업시설" },
  { key: "민간", label: "민간건축" },
];

export const projects: Project[] = [
  { id: "p20", cat: "교육", name: "(가칭)천안업성2초등학교 교사 신축공사", client: "충청남도교육청 천안교육지원청", use: "초등학교", scale: "지하 1층 · 지상 5층", area: "17,844㎡", cost: "178.4억", share: "공동도급 · 당사 지분 51%", period: "2026.07 – 2027.11", done: "시공 중", img: "p20", imgNote: "조감도", ongoing: true },
  { id: "p21", cat: "공공", name: "[국고] 권역책임의료기관 시설개선공사", client: "단국대학교 의과대학 부속병원", use: "병원 (부서 이전 2,632㎡)", scale: "B동 1·3·4층, 암센터 4층", cost: "40.7억", share: "공동도급 · 당사 지분 51%", period: "2026.10 – 2027.07", done: "시공 중", ongoing: true },
  { id: "p19", cat: "군", name: "25-충-국-7 시설공사(창고 신축)", client: "국군 제9965부대", use: "군사시설(창고)", scale: "지상 1층", area: "180㎡", cost: "4.4억", period: "2025.11 – 2026.06", done: "2026.06", img: "p19" },
  { id: "p18", cat: "산업", name: "㈜동신포리마 신원단공장 신축공사", client: "㈜동신포리마", use: "공장", scale: "2개 동 · 지상 2층", area: "2,072㎡", cost: "33.5억", period: "2024.12 – 2025.10", done: "2025.10", img: "p18" },
  { id: "p17", cat: "공공", name: "고덕국민체육센터 건립공사", client: "충청남도 예산군", use: "체육관", scale: "지상 1층", area: "986㎡", cost: "17.8억", period: "2024.07 – 2025.09", done: "2025.09", img: "p17" },
  { id: "p16", cat: "산업", name: "㈜동신포리마 주6동 신축공사", client: "㈜동신포리마", use: "공장", scale: "지상 2층", area: "1,997㎡", cost: "15.2억", period: "2024.09 – 2025.02", done: "2025.02", img: "p16" },
  { id: "p15", cat: "교육", name: "태안여자중학교 특별교실 증축공사", client: "충청남도 태안교육지원청", use: "중학교", scale: "지상 3층 증축", area: "384㎡", cost: "6.9억", period: "2024.07 – 2024.12", done: "2024.12", img: "p15" },
  { id: "p14", cat: "군", name: "23-지구병원 물자창고 신축 시설공사", client: "계룡대근무지원단", use: "군사시설(창고)", scale: "지상 1층", area: "271㎡", cost: "7.4억", period: "2024.04 – 2024.12", done: "2024.12", img: "p14", imgNote: "조감도 기반 이미지" },
  { id: "p13", cat: "교육", name: "청운대학교 홍성캠퍼스 인의관 엘리베이터 신축공사", client: "청운대학교", use: "대학교", scale: "지상 5층 승강로", cost: "2.8억", period: "2023.11 – 2024.03", done: "2024.02", img: "p13" },
  { id: "p12", cat: "교육", name: "홍성여자고등학교 다목적강당 개축공사", client: "충청남도 홍성교육지원청", use: "고등학교 체육시설", scale: "지상 1층", area: "875㎡", cost: "9.5억", period: "2023.04 – 2023.11", done: "2023.10", img: "p12" },
  { id: "p11", cat: "산업", name: "㈜동신포리마 자재창고(주4동·5동) 증축공사", client: "㈜동신포리마", use: "공장", scale: "지상 1층", area: "1,345㎡", period: "2023.02 – 2023.07", done: "2023.07", img: "p11" },
  { id: "p10", cat: "산업", name: "㈜동신포리마 자재창고 증축공사", client: "㈜동신포리마", use: "공장", scale: "지하 1층 · 지상 2층", area: "1,997㎡", cost: "21.0억", period: "2022.07 – 2023.02", done: "2023.02", img: "p10" },
  { id: "p09", cat: "산업", name: "텔콘알에프제약 공장 증축공사", client: "㈜텔콘알에프제약", use: "공장", scale: "지상 1층", area: "660㎡", cost: "14.2억", period: "2021.06 – 2021.12", done: "2021.12", img: "p09", imgNote: "조감도" },
  { id: "p08", cat: "민간", name: "홍성읍 월산리 다가구주택 신축공사", client: "개인 건축주", use: "근린생활시설 · 다가구주택(5가구)", scale: "지상 3층", area: "423㎡", period: "2021.05 – 2021.11", done: "2021.11", img: "p08" },
  { id: "p07", cat: "민간", name: "내포사랑의교회 증축공사", client: "내포사랑의교회", use: "종교시설", scale: "지상 4층", area: "999㎡", period: "2021.02 – 2021.09", done: "2021.09", img: "p07" },
  { id: "p06", cat: "군", name: "20-충-육-12C 시설공사(탄약검사장 신축)", client: "육군군수사령부", use: "군사시설", scale: "지상 1층", area: "430㎡", cost: "9.4억", period: "2020.12 – 2021.09", done: "2021.09", img: "p06" },
  { id: "p05", cat: "민간", name: "신곡교회 비전센터 신축공사", client: "기독교대한성결교회 신곡교회", use: "종교시설", scale: "지상 1층", area: "232㎡", cost: "5.4억", period: "2021.05 – 2021.08", done: "2021.08", img: "p05" },
  { id: "p04", cat: "군", name: "17-충-공-00여단 기지교회 신축공사", client: "국군재정관리단", use: "군 종교시설", scale: "지상 2층", area: "598㎡", cost: "15.1억", period: "2018.01 – 2018.11", done: "2018.11", img: "p04", imgNote: "투시도" },
  { id: "p03", cat: "공공", name: "금산 역사문화박물관 건립 건축공사", client: "충청남도 금산군", use: "문화·집회시설(박물관)", scale: "지하 1층 · 지상 2층", area: "2,362㎡", cost: "43.4억", period: "2017.03 – 2018.05", done: "2018.05", img: "p03" },
  { id: "p02", cat: "공공", name: "한국국토정보공사 아산지사 사옥 신축공사", client: "한국국토정보공사 대전충남지역본부", use: "업무시설", scale: "지하 1층 · 지상 3층", area: "1,546㎡", cost: "17.0억", period: "2016.07 – 2017.03", done: "2017.03", img: "p02" },
  { id: "p01", cat: "교육", name: "신창중학교 교실개축 및 기타공사", client: "충청남도 아산교육지원청", use: "중학교", scale: "지상 2층", area: "2,592㎡", cost: "17.1억", period: "2014.01 – 2014.09", done: "2014.09", img: "p01", imgNote: "투시도" },
  { id: "p00", cat: "교육", name: "광덕초등학교 다목적강당 증축공사", client: "충청남도 천안교육지원청", use: "초등학교", scale: "지상 1층", area: "623㎡", cost: "6.1억", period: "2009.05 – 2009.12", done: "2009.12", img: "p00" },
];
