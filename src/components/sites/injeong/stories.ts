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
    id: "s-2026-10-cheonan-pile",
    title: "학교 하나가 지어지는 과정을 처음부터 끝까지, 빈팀장 채널 현장 인터뷰 1편",
    sub: "박재형 공무차장이 빈팀장 유튜브 채널에 출연해 파일 공사를 설명했습니다",
    cat: "미디어",
    date: "2026-10-26",
    cover: "/sites/injeong/life/cheonan-pile-1.jpg",
    // no picture that shows the site's name board: the client has not approved naming the site
    photos: [2, 3, 4, 5, 6, 7].map((k) => `/sites/injeong/life/cheonan-pile-${k}.jpg`),
    body: [
      "인정건설은 으뜸안전기술이 운영하는 유튜브 채널 「빈팀장」에 현장 인터뷰 출연을 신청했습니다. 좋은 콘텐츠를 만들어 건물을 지으려는 건축주에게도, 현장에서 일하는 건설인에게도 도움이 되고 싶었습니다.",
      "첫 촬영은 2026년 10월 26일, 인정건설이 천안에서 짓고 있는 초등학교 현장에서 했습니다. 박재형 공무차장이 인터뷰에 출연해 현장을 설명했습니다.",
      "1편의 주제는 파일 공사입니다. 건물을 받칠 파일을 어떤 공법으로 시공하는지, 시공할 때 무엇을 확인하는지, 항타 작업 구역에서 사고 없이 일하려면 무엇을 지켜야 하는지, 시공사로서 챙겨야 할 것은 무엇인지를 다뤘습니다. 현장 사무실에서 출발해 현장 입구와 가설 울타리 주변, 파일이 쌓인 야적장과 항타 작업 구역을 차례로 걸으며 촬영했습니다.",
      "빈팀장 채널은 이 학교가 준공될 때까지 공정이 바뀔 때마다 현장을 다시 찾아옵니다. 인정건설은 기초부터 골조, 마감, 준공까지 학교 하나가 어떻게 지어지는지 공정마다 출연해 설명할 예정입니다.",
      "건물 하나가 처음부터 끝까지 어떻게 지어지는지 공정마다 보여 주는 영상은 찾기 어렵습니다. 건축주는 공사가 어떤 순서로 진행되고 무엇을 확인해야 하는지 미리 알 수 있고, 건설인은 다른 현장이 일하는 방식을 볼 수 있도록, 현장에서 일하는 사람의 설명으로 기록을 남기려 합니다.",
      "영상은 빈팀장 유튜브 채널에 공개됩니다. 다음 공정 촬영도 이어서 소개하겠습니다.",
    ].join("\n\n"),
  },
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
