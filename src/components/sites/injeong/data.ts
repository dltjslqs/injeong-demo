import { BASE } from "./base";

// 인정건설 제출 자료(2026.11.03): 기초자료 작성표 + 03. 시공 실적 폴더의 공사개요
// 금액은 VAT 포함, 억 원 단위로 반올림. 공동도급은 총액과 당사 지분을 함께 적는다.

export const company = {
  name: "㈜인정건설",
  nameEn: "INJEONG CONSTRUCTION CO., LTD",
  ceo: "김석구",
  bizNo: "126-81-72450",
  founded: "2003년 6월 19일",
  since: 1989, // 개인 건설업 시작 (법인 전환은 founded)
  // 홈 단체사진 배지. 인원수를 넣으면 「현장 소장 5명」처럼 숫자가 붙고, null이면 숫자 없이 나간다
  crew: [
    // 공사지명원(2026.10) 22~23쪽 기술자보유명단: 17명, 특급 4명(건축 특급 3 · 품질 특급 1)
    { label: "등록 기술자", count: 17 as number | null, fallback: "" },
    { label: "특급 기술자", count: 4 as number | null, fallback: "보유" },
    { label: "직접 시공 인력", count: null as number | null, fallback: "" },
  ],
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
  engineers: 17, // 공사지명원(2026.10) 기술자보유명단 기준
  awards: [
    "한국국토정보공사 감사패",
    "금산군청 감사패",
    "㈜동신포리마 감사패",
    "홍성농업협동조합 감사패",
    "홍동농협 감사패",
  ],
};

// 실적 숫자는 실린 실적을 그대로 센다. 2026.11.10 2차 자료로 2004~2020년 실적 23건(q01~q23)을 받아,
// 그동안 쓰던 ×4 배수(80건)를 실제 건수로 바꿨다.

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
  /** a photo uploaded in the admin (takes the place of img) */
  imgUrl?: string;
  imgNote?: string;
  /** 충남 시·군 (실적 지도). 모르면 비워 두고, 군 시설은 보안상 지도에 싣지 않는다. */
  region?: string;
  ongoing?: boolean;
};

/** The 충남 시·군 a project can sit in, for the 실적 지도 and the admin form. */
export const REGIONS = ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"] as const;

export const categories: { key: Category; label: string }[] = [
  { key: "교육", label: "교육시설" },
  { key: "공공", label: "공공·의료" },
  { key: "군", label: "군 시설" },
  { key: "산업", label: "산업시설" },
  { key: "민간", label: "민간건축" },
];

export const projects: Project[] = [
  { id: "p20", region: "천안시", cat: "교육", name: "(가칭)천안업성2초등학교 교사 신축공사", client: "충청남도교육청 천안교육지원청", use: "초등학교", scale: "지하 1층 · 지상 5층", area: "17,844㎡", cost: "178.4억", share: "공동도급 · 당사 지분 51%", period: "2026.07 – 2027.11", done: "시공 중", img: "p20", imgNote: "조감도", ongoing: true },
  { id: "p21", region: "천안시", cat: "공공", name: "[국고] 권역책임의료기관 시설개선공사", client: "단국대학교 의과대학 부속병원", use: "병원 (부서 이전 2,632㎡)", scale: "B동 1·3·4층, 암센터 4층", cost: "40.7억", period: "2026.10 – 2027.07", done: "시공 중", img: "p21", imgNote: "병원 전경", ongoing: true },
  { id: "p19", cat: "군", name: "25-충-국-7 시설공사(창고 신축)", client: "국군 제9965부대", use: "군사시설(창고)", scale: "지상 1층", area: "180㎡", cost: "4.4억", period: "2025.11 – 2026.06", done: "2026.06", img: "p19" },
  { id: "p18", region: "홍성군", cat: "산업", name: "㈜동신포리마 신원단공장 신축공사", client: "㈜동신포리마", use: "공장", scale: "2개 동 · 지상 2층", area: "2,072㎡", cost: "33.5억", period: "2024.12 – 2025.10", done: "2025.10", img: "p18" },
  { id: "p17", region: "예산군", cat: "공공", name: "고덕국민체육센터 건립공사", client: "충청남도 예산군", use: "체육관", scale: "지상 1층", area: "986㎡", cost: "17.8억", period: "2024.07 – 2025.09", done: "2025.09", img: "p17" },
  { id: "p16", region: "홍성군", cat: "산업", name: "㈜동신포리마 주6동 신축공사", client: "㈜동신포리마", use: "공장", scale: "지상 2층", area: "1,997㎡", cost: "15.2억", period: "2024.09 – 2025.02", done: "2025.02", img: "p16" },
  { id: "p15", region: "태안군", cat: "교육", name: "태안여자중학교 특별교실 증축공사", client: "충청남도 태안교육지원청", use: "중학교", scale: "지상 3층 증축", area: "384㎡", cost: "6.9억", period: "2024.07 – 2024.12", done: "2024.12", img: "p15" },
  { id: "p14", cat: "군", name: "23-지구병원 물자창고 신축 시설공사", client: "계룡대근무지원단", use: "군사시설(창고)", scale: "지상 1층", area: "271㎡", cost: "7.4억", period: "2024.04 – 2024.12", done: "2024.12", img: "p14", imgNote: "조감도 기반 이미지" },
  { id: "p13", region: "홍성군", cat: "교육", name: "청운대학교 홍성캠퍼스 인의관 엘리베이터 신축공사", client: "청운대학교", use: "대학교", scale: "지상 5층 승강로", cost: "2.8억", period: "2023.11 – 2024.03", done: "2024.02", img: "p13" },
  { id: "p12", region: "홍성군", cat: "교육", name: "홍성여자고등학교 다목적강당 개축공사", client: "충청남도 홍성교육지원청", use: "고등학교 체육시설", scale: "지상 1층", area: "875㎡", cost: "9.5억", period: "2023.04 – 2023.11", done: "2023.10", img: "p12" },
  { id: "p11", region: "홍성군", cat: "산업", name: "㈜동신포리마 자재창고(주4동·5동) 증축공사", client: "㈜동신포리마", use: "공장", scale: "지상 1층", area: "1,345㎡", period: "2023.02 – 2023.07", done: "2023.07", img: "p11" },
  { id: "p10", region: "홍성군", cat: "산업", name: "㈜동신포리마 자재창고 증축공사", client: "㈜동신포리마", use: "공장", scale: "지하 1층 · 지상 2층", area: "1,997㎡", cost: "21.0억", period: "2022.07 – 2023.02", done: "2023.02", img: "p10" },
  { id: "p09", cat: "산업", name: "텔콘알에프제약 공장 증축공사", client: "㈜텔콘알에프제약", use: "공장", scale: "지상 1층", area: "660㎡", cost: "14.2억", period: "2021.06 – 2021.12", done: "2021.12", img: "p09", imgNote: "조감도" },
  { id: "p08", region: "홍성군", cat: "민간", name: "홍성읍 월산리 다가구주택 신축공사", client: "개인 건축주", use: "근린생활시설 · 다가구주택(5가구)", scale: "지상 3층", area: "423㎡", period: "2021.05 – 2021.11", done: "2021.11", img: "p08" },
  { id: "p07", region: "홍성군", cat: "민간", name: "내포사랑의교회 증축공사", client: "내포사랑의교회", use: "종교시설", scale: "지상 4층", area: "999㎡", period: "2021.02 – 2021.09", done: "2021.09", img: "p07" },
  { id: "p06", cat: "군", name: "20-충-육-12C 시설공사(탄약검사장 신축)", client: "육군군수사령부", use: "군사시설", scale: "지상 1층", area: "430㎡", cost: "9.4억", period: "2020.12 – 2021.09", done: "2021.09", img: "p06" },
  { id: "p05", cat: "민간", name: "신곡교회 비전센터 신축공사", client: "기독교대한성결교회 신곡교회", use: "종교시설", scale: "지상 1층", area: "232㎡", cost: "5.4억", period: "2021.05 – 2021.08", done: "2021.08", img: "p05" },
  { id: "q23", region: "홍성군", cat: "산업", name: "㈜동신포리마 공장 증축공사(2020)", client: "㈜동신포리마", use: "공장", scale: "지상 2층", area: "2,573㎡", cost: "10.0억", period: "약 3개월", done: "2020.10", img: "q23", imgNote: "조감도 기반 이미지" },
  { id: "q21", cat: "산업", name: "㈜한독이엔에스 공장 신축공사", client: "㈜한독이엔에스", use: "공장", scale: "2개 동 · 지상 1층", area: "1,314㎡", cost: "6.4억", period: "약 7개월", done: "2019.12", img: "q21", imgNote: "조감도 기반 이미지" },
  { id: "q20", cat: "산업", name: "비전테크 공장 신축공사", client: "비전테크", use: "공장", scale: "지상 1층", area: "795㎡", cost: "4.3억", period: "약 5개월", done: "2019.07", img: "q20", imgNote: "조감도 기반 이미지" },
  { id: "q22", region: "홍성군", cat: "산업", name: "㈜동신포리마 주1동·주2동·부1동 증축공사", client: "㈜동신포리마", use: "공장", scale: "3개 동 · 지상 1층", area: "5,941㎡", cost: "36.2억", period: "약 7개월", done: "2019.05", img: "q22", imgNote: "조감도 기반 이미지" },
  { id: "p04", cat: "군", name: "17-충-공-00여단 기지교회 신축공사", client: "국군재정관리단", use: "군 종교시설", scale: "지상 2층", area: "598㎡", cost: "15.1억", period: "2018.01 – 2018.11", done: "2018.11", img: "p04", imgNote: "투시도" },
  { id: "q15", cat: "산업", name: "㈜부토자원 자원순환관련시설 신축공사", client: "㈜부토자원", use: "자원순환시설", scale: "지상 2층", area: "2,262㎡", cost: "20.0억", period: "약 8개월", done: "2018.08" },
  { id: "q18", region: "홍성군", cat: "민간", name: "홍성 서부새마을금고 중앙지점 신축공사", client: "홍성 서부새마을금고", use: "금융·업무시설", scale: "지상 2층", area: "574㎡", cost: "4.3억", period: "약 4개월", done: "2018.06" },
  { id: "p03", region: "금산군", cat: "공공", name: "금산 역사문화박물관 건립 건축공사", client: "충청남도 금산군", use: "문화·집회시설(박물관)", scale: "지하 1층 · 지상 2층", area: "2,362㎡", cost: "43.4억", period: "2017.03 – 2018.05", done: "2018.05", img: "p03" },
  { id: "q19", region: "홍성군", cat: "산업", name: "㈜동신포리마 주1동 증축공사", client: "㈜동신포리마", use: "공장", scale: "지상 1층", area: "1,935㎡", cost: "12.7억", period: "약 3개월", done: "2018.05", img: "q19", imgNote: "조감도 기반 이미지" },
  { id: "q17", region: "홍성군", cat: "산업", name: "㈜동신포리마 공장(주2동·주3동) 증축공사", client: "㈜동신포리마", use: "공장", scale: "2개 동 · 지상 1층", area: "2,320㎡", cost: "21.1억", period: "약 9개월", done: "2017.12", img: "q17", imgNote: "조감도 기반 이미지" },
  { id: "p02", region: "아산시", cat: "공공", name: "한국국토정보공사 아산지사 사옥 신축공사", client: "한국국토정보공사 대전충남지역본부", use: "업무시설", scale: "지하 1층 · 지상 3층", area: "1,546㎡", cost: "17.0억", period: "2016.07 – 2017.03", done: "2017.03", img: "p02" },
  { id: "q16", region: "홍성군", cat: "산업", name: "㈜동신포리마 공장 증축공사(2016)", client: "㈜동신포리마", use: "공장", scale: "5개 동 · 지상 1층", area: "1,800㎡", cost: "10.0억", period: "약 4개월", done: "2016.11", img: "q16", imgNote: "조감도 기반 이미지" },
  { id: "q14", cat: "산업", name: "비엠테크 산동리 공장 신축공사", client: "비엠테크", use: "공장", scale: "지상 2층", area: "765㎡", cost: "5.3억", period: "약 4개월", done: "2015.02", img: "q14", imgNote: "조감도 기반 이미지" },
  { id: "q13", region: "당진시", cat: "공공", name: "송산면 주민복합센터 및 창고 신축공사", client: "충청남도 당진시", use: "공공업무시설", scale: "철근콘크리트조", area: "265㎡", cost: "3.2억", period: "약 5개월", done: "2014.10", img: "q13", imgNote: "투시도 기반 이미지" },
  { id: "p01", region: "아산시", cat: "교육", name: "신창중학교 교실개축 및 기타공사", client: "충청남도 아산교육지원청", use: "중학교", scale: "지상 2층", area: "2,592㎡", cost: "17.1억", period: "2014.01 – 2014.09", done: "2014.09", img: "p01", imgNote: "투시도" },
  { id: "q10", region: "홍성군", cat: "산업", name: "㈜동신포리마 인쇄공장 및 제2공장 신축공사", client: "㈜동신포리마", use: "공장", scale: "인쇄공장 지상 1층 · 제2공장 지상 2층", area: "6,597㎡", cost: "40.1억", period: "약 7개월", done: "2013.12", img: "q10", imgNote: "조감도 기반 이미지" },
  { id: "q11", region: "홍성군", cat: "민간", name: "홍동농협 로컬푸드직매장 증축공사", client: "홍동농업협동조합", use: "판매시설", scale: "철근콘크리트조 · 철골조", area: "826㎡", cost: "4.8억", period: "약 3개월", done: "2013.12", img: "q11", imgNote: "투시도 기반 이미지" },
  { id: "q12", cat: "민간", name: "삼성마트클럽 증축공사", client: "민간 건축주", use: "판매시설", scale: "일반철골조", cost: "6.8억", period: "약 5개월", done: "2013.07" },
  { id: "q07", region: "공주시", cat: "민간", name: "공주유스호스텔 다목적강당 증축공사", client: "공주유스호스텔", use: "수련시설(강당)", scale: "지상 1층", area: "800㎡", cost: "4.5억", period: "약 3개월", done: "2012.12", img: "q07", imgNote: "조감도 기반 이미지" },
  { id: "q08", cat: "민간", name: "우듬지 어린이집 신축공사", client: "우듬지 어린이집", use: "노유자시설(어린이집)", scale: "지상 3층", area: "404㎡", cost: "4.6억", period: "약 3개월", done: "2012.12", img: "q08", imgNote: "조감도 기반 이미지" },
  { id: "q09", region: "청양군", cat: "산업", name: "애경화학㈜ 청양공장 ACRYL 공장 신축공사", client: "애경화학㈜ 청양공장", use: "공장", scale: "지상 3층", area: "2,050㎡", cost: "13.6억", period: "약 3개월", done: "2012.09", img: "q09", imgNote: "조감도 기반 이미지" },
  { id: "q06", region: "홍성군", cat: "공공", name: "순환농업센터 증축 및 리모델링공사", client: "홍성한우클러스터 사업단", use: "농업시설", scale: "목조 · 지상 1층", area: "718㎡", cost: "6.5억", period: "약 8개월", done: "2011.10" },
  { id: "q04", region: "금산군", cat: "공공", name: "진산파출소 개축공사", client: "충청남도지방경찰청 금산경찰서", use: "경찰시설", scale: "지상 2층", area: "197㎡", cost: "2.0억", period: "약 5개월", done: "2010.10", img: "q04", imgNote: "조감도 기반 이미지" },
  { id: "q05", cat: "민간", name: "명주원 식당 증축(건축·기계설비)공사", client: "장애인생활시설 명주원", use: "사회복지시설", scale: "철근콘크리트조", cost: "2.4억", period: "약 3개월", done: "2010.05" },
  { id: "p00", region: "천안시", cat: "교육", name: "광덕초등학교 다목적강당 증축공사", client: "충청남도 천안교육지원청", use: "초등학교", scale: "지상 1층", area: "623㎡", cost: "6.1억", period: "2009.05 – 2009.12", done: "2009.12", img: "p00" },
  { id: "q03", region: "홍성군", cat: "산업", name: "㈜동신포리마 P공장 신축공사", client: "㈜동신포리마", use: "공장", scale: "지상 2층", area: "1,918㎡", cost: "13.9억", period: "약 5개월", done: "2008.03" },
  { id: "q02", cat: "산업", name: "㈜두영아트 제3카렌다 공장동 증축공사", client: "㈜두영아트", use: "공장", scale: "3개 동 · 지상 2층", cost: "4.5억", period: "약 4개월", done: "2004.12" },
  { id: "q01", cat: "산업", name: "㈜장유 창고동 증축공사", client: "㈜장유", use: "창고", scale: "지상 1층", area: "9,997㎡", cost: "4.8억", period: "약 3개월", done: "2004.03" },
];


/** A project's photo: the admin's upload if there is one, else the shipped file. */
export const projectImg = (p: Project) => p.imgUrl ?? (p.img ? `${BASE}/sites/injeong/works/${p.img}.jpg` : undefined);
