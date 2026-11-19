import type { Field } from "./FieldPage";

// The field pages under 사업 분야. Words come from the 사업 분야 cards and the 견적 문의 FAQ; numbers come from the project list.
const PUBLIC_FAQ = [
  "회사의 시공능력과 신용도는 어느 정도인가요?",
  "현장은 누가 책임지나요?",
  "공사가 어떻게 진행되는지 어떻게 알 수 있나요?",
  "어느 지역까지 공사하나요?",
  "회사 자료(지명원)를 받아 볼 수 있나요?",
];

export const FIELDS: Record<"education" | "public" | "private", Field> = {
  education: {
    path: "/business/education",
    label: "교육시설",
    heading: "학교 강당부터 교실 증축까지, 교육시설 공사",
    desc: "충남 교육지원청과 대학이 맡긴 강당·교실·대학 시설 공사입니다.",
    description: "충남 홍성 ㈜인정건설의 교육시설 공사. 초·중·고 다목적강당과 교실 증축·개축, 대학 시설 개선까지 교육지원청과 대학이 맡긴 실적과 공사 방식을 정리했습니다.",
    img: "p12",
    cats: ["교육"],
    contactType: "교육·공공시설",
    how: {
      title: "학기 중 공사는 학생 안전부터 나눕니다",
      lead: "초·중·고 강당과 교실, 대학 시설을 지었습니다. 학기 중 공사가 많아 학생 동선과 안전을 먼저 나누고 공사를 시작합니다.",
      points: ["다목적강당 개축·증축", "교실 증축·개축", "대학 승강기·시설 개선"],
    },
    faq: PUBLIC_FAQ,
    columns: [],
  },
  public: {
    path: "/business/public",
    label: "공공·군 시설",
    heading: "박물관·체육센터·공공기관 사옥, 공공·군 시설 공사",
    desc: "관급 공사의 서류와 검측 절차에 맞춰 짓습니다.",
    description: "충남 홍성 ㈜인정건설의 공공·군 시설 공사. 금산 역사문화박물관, 고덕국민체육센터, 한국국토정보공사 아산지사 사옥과 군 시설까지 관급 공사 실적을 정리했습니다.",
    img: "p03",
    cats: ["공공", "군"],
    contactType: "교육·공공시설",
    how: {
      title: "관급 공사의 절차에 익숙합니다",
      lead: "박물관, 체육센터, 공공기관 사옥과 군 시설을 시공했습니다. 관급 공사의 서류와 검측 절차를 따라 공정마다 기록을 남기며 짓습니다.",
      points: ["문화·체육시설 건립", "공공기관 사옥 신축", "군 창고·교회·검사장 신축"],
    },
    faq: PUBLIC_FAQ,
    columns: [],
  },
  private: {
    path: "/business/private",
    label: "민간·실내건축",
    heading: "교회·근생·주택부터 리모델링까지, 민간·실내건축",
    desc: "건축공사업과 실내건축공사업 면허로 신축부터 시설 개선까지 맡습니다.",
    description: "충남 홍성 ㈜인정건설의 민간·실내건축 공사. 교회, 근린생활시설, 다가구주택, 판매·금융 시설 신축과 증축, 실내건축공사업 면허로 하는 리모델링 실적을 정리했습니다.",
    img: "p07",
    cats: ["민간"],
    contactType: "근생·주택",
    how: {
      title: "짓는 것부터 고치는 것까지 맡습니다",
      lead: "교회, 근린생활시설, 다가구주택을 짓고, 실내건축공사업으로 리모델링과 시설 개선까지 맡습니다.",
      points: ["종교시설 신축·증축", "근생·다가구주택 신축", "실내건축·시설 개선"],
    },
    faq: ["도면 없이 평당 공사비를 알 수 있나요?", "견적을 빨리 받으려면 무엇을 보내면 되나요?", "공사 대금은 어떻게 나눠 내나요?", "준공 후에 하자가 생기면 어떻게 하나요?", "리모델링이나 실내 공사도 하나요?"],
    columns: ["officetel-yield", "building-defects", "builder-drawings", "builder-proactive", "builder-check", "builder-red-flags"],
  },
};
