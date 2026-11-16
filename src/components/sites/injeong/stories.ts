/**
 * 회사 이야기: posts about what happens at 인정건설 (워크샵, 현장 활동, 행사, 수상, 언론).
 * Written in the admin; the posts here ship with the site and can be edited or hidden there like the columns.
 */
export const STORY_CATS = ["회사 소식", "현장 활동", "교육·행사", "수상·인증", "미디어"] as const;
export type StoryCat = (typeof STORY_CATS)[number];

export type StoryPost = {
  id: string;
  title: string;
  sub: string; // one line under the title, on the card
  cat: StoryCat;
  date: string; // YYYY-MM-DD
  cover: string; // picture address
  photos: string[]; // more pictures, shown under the text
  body: string; // paragraphs separated by a blank line
  youtube?: string; // video id, shown above the photos
};

export const builtinStories: StoryPost[] = [
  {
    id: "s-2026-11-work",
    title: "도면과 현장을 맞추는 하루, 2026년 11월의 인정건설",
    sub: "현장 점검부터 현장사무실 공정 회의, 홍성 본사 회의까지",
    cat: "현장 활동",
    date: "2026-11-10",
    cover: "/sites/injeong/life/site-1.jpg",
    photos: ["/sites/injeong/life/office-1.jpg", "/sites/injeong/life/hq-1.jpg"],
    body: [
      "11월, 시공 중인 현장에서 기술진이 태블릿 도면을 들고 실제 위치와 치수를 하나씩 확인했습니다. 도면과 다른 곳은 공사가 진행되기 전에 잡는 것이 원칙입니다.",
      "현장사무실에서는 큰 화면에 도면을 띄워 놓고 소장과 기술진이 공정과 다음 작업을 함께 정했습니다. 누가 무엇을 언제 하는지, 회의에서 정하고 시작합니다.",
      "현장 보고는 홍성 본사로 모입니다. 본사 회의실에서 현장별 공정과 비용을 함께 점검하고, 필요한 결정은 바로 현장에 내려보냅니다.",
    ].join("\n\n"),
  },
];
