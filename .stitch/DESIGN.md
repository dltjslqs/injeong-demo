---
name: 인정건설 Injeong Construction
colors:
  background: '#ffffff'
  on-background: '#1c2233'
  surface: '#ffffff'
  surface-container-low: '#f3f6fa'
  surface-container: '#eef5fa'
  surface-container-high: '#d0e3f1'
  surface-variant: '#f3f6fa'
  on-surface: '#1c2233'
  on-surface-variant: '#5a6275'
  outline: '#cfd4df'
  outline-variant: '#e2e6ee'
  primary: '#0067a0'
  on-primary: '#ffffff'
  primary-container: '#d0e3f1'
  on-primary-container: '#1c2a53'
  inverse-primary: '#87b2e0'
  secondary: '#1c2a53'
  on-secondary: '#ffffff'
  secondary-container: '#133b8c'
  on-secondary-container: '#ffffff'
  tertiary: '#8e0e15'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f0a10'
  on-tertiary-container: '#ffffff'
  inverse-surface: '#141d38'
  inverse-on-surface: '#b9bdc7'
  error: '#c62828'
  on-error: '#ffffff'
  brand-blue: '#0067a0'
  brand-navy: '#1c2a53'
  brand-royal: '#133b8c'
  brand-sky: '#87b2e0'
  brand-red: '#8e0e15'
  brand-red-pressed: '#6f0a10'
  footer-night: '#141d38'
typography:
  hero-display:
    fontFamily: Pretendard
    fontSize: 60px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.025em
  page-title:
    fontFamily: Pretendard
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 58px
    letterSpacing: -0.03em
  section-title:
    fontFamily: Pretendard
    fontSize: 42px
    fontWeight: '800'
    lineHeight: 55px
    letterSpacing: -0.025em
  quote:
    fontFamily: Pretendard
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 51px
    letterSpacing: -0.02em
  card-title:
    fontFamily: Pretendard
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 31px
    letterSpacing: '0'
  body-base:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: '0'
  lede:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 29px
    letterSpacing: '0'
  kicker:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: '0'
  label-en:
    fontFamily: Archivo
    fontSize: 13px
    fontWeight: '800'
    lineHeight: 20px
    letterSpacing: 0.2em
  stat-lg:
    fontFamily: Archivo
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: '0'
rounded:
  sm: 4px
  DEFAULT: 6px
  md: 8px
  lg: 10px
  xl: 16px
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 56px
  xl: 120px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 24px
  max-width: 1200px
---

# Design System: 인정건설 Injeong Construction

소스: `website-cloner/src/components/sites/injeong/injeong.css`(모든 토큰이 `.ij` 루트의 CSS 변수로 정의됨), `src/app/(site)/*`, `src/components/ui/scroll-expansion-hero.tsx`. 색은 회사 로고 `인정건설_피앤지.png`에서 픽셀 단위로 뽑았다.

## 1. Visual Theme & Atmosphere

1989년부터 충남의 학교, 관공서, 군 시설, 공장을 지어 온 지역 종합건설사의 얼굴답게, 화면은 **차분하고 단단한 공공건축의 인상**을 따른다. 흰 바탕과 아주 옅은 푸른 회색 면이 번갈아 나오고, 그 사이에 로고에서 그대로 가져온 남색 띠가 한 페이지에 한두 번 무게를 잡아 준다. 화려한 장식 대신 실제 준공 사진이 주인공이며, 글은 그 사진을 설명하는 데이터 시트처럼 정돈되어 있다. 위아래 120px의 넉넉한 구역 여백, 1200px로 묶은 본문 폭, 굵은 한글 제목과 가는 회색 본문의 대비가 「믿을 만한 시공사」라는 인상을 만든다.

색 온도는 **차가운 쪽**이다. 중성색은 모두 푸른 기가 도는 회색(#F3F6FA, #E2E6EE, #5A6275)이고, 따뜻한 색은 로고의 짙은 적색 하나뿐이다. 그 적색은 상담 버튼과 작은 표식(구역 이름 앞 네모 점, 「시공 중」 점)에만 써서, 화면 전체에서 차지하는 비율이 아주 작다. 움직임도 절제되어 있다. 첫 화면의 스크롤 확장 사진을 빼면, 요소가 24px 아래에서 천천히 떠오르는 정도와 카드가 4px 들리는 호버가 전부다.

**핵심 특징**
- 정보 밀도: 중간. 카드 안에 발주처·용도·연면적·공사비·준공을 표처럼 담는다
- 바탕: 흰색과 옅은 푸른 회색(#F3F6FA)을 구역마다 번갈아
- 무게 중심: 남색 띠(숫자 띠, 페이지 머리, 상담 띠, 연락처 카드)
- 형태: 모서리는 작게(6–10px). 공공건축처럼 반듯하고 과하지 않게
- 사진: 실제 준공 사진을 보정해 쓰고, 렌더링 이미지는 「조감도」·「투시도」 꼬리표로 구분

## 2. Color Palette & Roles

### Primary Foundation
- **순백 (#FFFFFF)** — 기본 페이지 바탕, 카드와 폼 바탕
- **새벽 콘크리트 (#F3F6FA)** — 번갈아 쓰는 구역 바탕(`.soft`), FAQ 안내 상자, 첫 화면 확장 뒤 바탕
- **얼음 파랑 (#EEF5FA)** — 막대 그래프 바탕 트랙, 사진이 없는 자리의 바탕
- **옅은 하늘 (#D0E3F1)** — 타임라인 선, 진행 막대 바탕, 강조 꼬리표 테두리

### Accent & Interactive
- **인정 파랑 (#0067A0)** — 로고 주색. 링크, 구역 이름(kicker), 선택된 탭, 활성 메뉴 밑줄, 포커스 테두리, 숫자 강조. 흰 바탕 위 대비 약 5.9:1
- **로고 남색 (#1C2A53)** — 로고 글자색. 숫자 띠·페이지 머리·상담 띠·연락처 카드의 넓은 면, 로고 옆 회사명, 대표전화
- **로열 블루 (#133B8C)** — 사진이 없는 카드의 남색→로열 그라데이션에만 쓰는 보조 파랑
- **로고 하늘색 (#87B2E0)** — 로고의 밝은 파랑. 어두운 면 위 보조 강조가 필요할 때만
- **로고 적색 (#8E0E15)** — 상담 버튼(「견적 문의」) 전용. 그 밖에는 구역 이름 앞 6px 네모, 「시공 중」 점처럼 아주 작게만. 눌림·호버는 **짙은 적색 (#6F0A10)**

### Typography & Text Hierarchy
- **먹 남색 (#1C2233)** — 제목과 본문 기본 글자색. 순수 검정 대신 남색 기가 있는 먹색
- **안개 회색 (#5A6275)** — 리드 문장, 설명, 표의 항목명(dt), 날짜
- **선 회색 (#E2E6EE)** — 카드 테두리, 표 줄 구분선, 머리글 아래 선
- **입력 테두리 (#CFD4DF)** — 폼 입력칸 기본 테두리
- **밤 남색 (#141D38)** — 바닥글 바탕. 위의 글자는 **흐린 은회색 (#B9BDC7)**

### Functional States
- **오류 적색 (#C62828)** — 폼 검증 메시지
- **성공** — 별도 색 없이 인정 파랑 제목(「신청이 정상적으로 전달되었습니다」)으로 표시
- 흰 글자 위 반투명 흰색(72–85%)으로 어두운 면의 보조 글을 만든다

## 3. Typography Rules

### 글꼴
- **Pretendard (1.3.9, jsDelivr)** — 모든 한글과 본문. 반듯한 네오 그로테스크로, 굵게 쓰면 공문서처럼 단단하고 가늘게 쓰면 차분하다. 대체 글꼴은 맑은 고딕
- **Archivo (600·800, Google Fonts)** — 숫자와 영문 라벨 전용(`.num`). 로고 영문과 같은 계열의 각진 산세리프로, 연도·공사비·면적·전화번호를 고정폭 숫자(tabular-nums)로 정렬한다
- 모든 한글은 `word-break: keep-all`로 단어 단위 줄바꿈

### Hierarchy & Weights
| 역할 | 크기 | 굵기 | 줄간격 | 자간 |
|---|---|---|---|---|
| 첫 화면 대제목 | 36 → 48 → 60px (모바일→태블릿→데스크톱) | 800 | 1.2 | -0.025em |
| 페이지 제목 (H1) | 32–48px (clamp) | 800 | 1.2 | -0.03em |
| 구역 제목 (H2) | 28–42px (clamp) | 800 | 1.3 | -0.025em |
| 인용문 | 25–36px (clamp) | 800 | 1.42 | -0.02em |
| 카드 제목 (H3) | 19–23px | 800 | 1.4 | 0 |
| 리드 문장 | 16–18px (clamp) | 400 | 1.6 | 0 |
| 본문 | 16px | 400 | 1.6 (FAQ 답변 1.75) | 0 |
| 구역 이름 (kicker) | 14px | 700 | — | 0 |
| 영문 라벨 (ABOUT 등) | 13px | 800 | — | 0.2em |
| 큰 숫자 | 34–48px Archivo | 800 | 1.0 | 0 |
| 메뉴 | 15.5px | 600 | — | 0 |

### Spacing Principles
- 제목은 모두 800으로 굵게, 자간은 살짝 좁혀(-0.02 ~ -0.03em) 한 덩어리로 읽히게 한다
- 본문은 400에 줄간격 1.6–1.75로 숨 쉴 틈을 준다. 제목과 본문의 굵기 차이가 위계를 만든다
- 숫자 뒤 단위(억·년·명·곳)는 Pretendard 0.42em로 작게 붙여 숫자를 돋보이게 한다
- 영문 라벨만 자간을 넓힌다(0.14–0.2em). 한글에는 넓은 자간을 쓰지 않는다

## 4. Component Stylings

### Buttons
- **모양**: 높이 54px(머리글 44px, 폼 제출 58px), 좌우 26px, 모서리 6px. 반듯하지만 날카롭지 않은 관공서 서식 같은 형태
- **상담 버튼 (cta)**: 로고 적색 바탕 + 흰 글자, 굵기 700. 호버 시 짙은 적색. 한 화면에 1–2개만
- **보조 버튼 (line)**: 흰 바탕 + 인정 파랑 1.5px 테두리·글자. 호버 시 파랑으로 채워지고 글자가 흰색
- **어두운 면 버튼 (ghost)**: 반투명 흰 테두리 + 흰 글자. 호버 시 흰 바탕 + 파랑 글자
- **텍스트 링크**: 파랑 700 + 「→」. 호버 시 화살표가 3px 오른쪽으로
- 전환은 0.2초 배경·글자·테두리 색만

### Cards & 실적 카드
- 흰 바탕, 1px 선 회색 테두리, 모서리 10px, 그림자 없음
- 사진은 카드 위쪽에 꽉 차게(4:3 또는 16:10), 사진 위 왼쪽 위에 흰 꼬리표(분류: 교육시설·산업시설 등, 모서리 4px, 12.5px 800). 렌더링 이미지는 오른쪽 위에 남색 반투명 꼬리표(「조감도」·「투시도」)
- 본문 22–28px 안쪽 여백. 제목 아래 2열 정의 목록(발주처·용도·연면적·공사비·준공), 항목명은 안개 회색, 값은 600
- 사업 분야 카드만 호버 시 4px 들리고 파랑 기 그림자(`0 18px 40px rgba(0,103,160,.1)`)

### Navigation
- 76px 높이(모바일 64px)의 흰 반투명 머리글, 위에 고정. 스크롤하면 아래 1px 선과 아주 옅은 그림자가 생긴다
- 왼쪽 로고(건물 심벌 40px + 「㈜인정건설」 남색 19px 800 + 영문 10px 자간 0.14em), 가운데-오른쪽 메뉴 5개, 오른쪽 대표전화(남색 Archivo)와 상담 버튼
- 현재 페이지 메뉴는 파랑 글자 + 아래 2px 파랑 선
- 1000px 이하에서는 햄버거(세 줄 → X)로 접히고, 펼치면 메뉴가 세로 목록 + 맨 아래 상담 버튼

### Inputs & Forms
- 높이 50px, 1px #CFD4DF 테두리, 모서리 6px(버튼과 같은 계열), 글자 15.5px
- 포커스 시 인정 파랑 2px 테두리(안쪽으로)
- 라벨은 칸 위 14px 700, 필수 표시는 파랑 작은 글자
- 개인정보 동의 체크박스는 파랑 accent-color
- 폼 오른쪽에 남색 연락처 카드(대표전화 30–40px Archivo, 팩스·이메일·본사 주소)

### 첫 화면 스크롤 확장 히어로
- 처음에는 남색(#1C2A53 60%)을 덮은 공장 사진이 전체 배경, 가운데에 300×400px 세로 사진 카드(모서리 16px)
- 대제목은 두 줄로 나뉘어(「1989년부터」 / 「충남을 짓습니다」) 흰 글자로 사진 위에 얹힌다
- 휠·터치·키보드로 스크롤하면 사진 카드가 화면 가득 커지고, 두 줄 제목은 양옆으로 갈라져 사라진다
- 다 펼쳐지면 아래에 소개 문구, 상담·실적 버튼, 「지금 시공 중」 카드가 나타난다

### 공정·연혁·막대
- **5단계 진행 순서**: 56px 원 안에 Archivo 번호(01–05), 원끼리 2px 옅은 하늘 선으로 연결
- **연혁·면허 표**: 위 2px 먹색 선 + 줄마다 1px 선 회색. 연도는 파랑 Archivo 20px
- **발주처 구성 막대**: 12px 높이 둥근 막대, 얼음 파랑 트랙 위 인정 파랑 채움. 화면에 들어오면 1.2초에 걸쳐 왼쪽부터 자란다

## 5. Layout Principles

### Grid & Structure
- 본문 최대 폭 **1200px**, 좌우 여백 24px(640px 이하 16px)
- 구역 머리는 왼쪽에 「구역 이름 + 제목 + 리드」, 오른쪽 끝에 「전체 보기」 링크나 분류 탭을 두는 양끝 정렬
- 카드 격자: 실적 3열 → 2열(1000px) → 1열(640px), 사업 분야 2열 → 1열, 진행 현장 2열 → 1열
- 2단 구성: 왼쪽 360–380px 안내 + 오른쪽 내용(FAQ, 연혁, 면허, 진행 현장 타임라인). 1000px 이하에서 한 줄로

### Whitespace Strategy
- 기본 단위 4px, 실제로는 8의 배수 위주(8·16·24·32·56)
- 구역 위아래 **120px**(1000px 이하 84px). 구역 머리와 내용 사이 56px(모바일 36px)
- 남색 띠는 64–72px로 일반 구역보다 얇게, 페이지 머리는 88/76px
- 카드 사이 24–28px, 카드 안 22–40px

### Alignment & Visual Balance
- 기본은 왼쪽 정렬. 가운데 정렬은 첫 화면 소개 블록과 「전체 실적 자료 요청」 버튼뿐
- 사진과 글의 비율은 카드에서 대략 6:4(사진이 위)
- 남색 면은 한 페이지에 2–3번(숫자 띠, 상담 띠, 페이지 머리)만 써서 흰 구역 사이의 무게 추 역할

### Responsive Behavior & Touch
- 데스크톱 기준으로 짜고 1000px·640px 두 지점에서 접는다(첫 화면 컴포넌트만 768px 기준)
- 버튼 높이 44–58px, 탭 42px, 입력 50px로 손가락 터치 영역 확보
- 640px 이하에서 버튼은 가로로 꽉 차게(`flex:1`), 표의 항목명 열은 84px로 줄인다
- `prefers-reduced-motion`이면 등장 애니메이션과 첫 화면 확장을 끄고 바로 펼친 상태로 보여 준다

## 6. Design System Notes for Stitch Generation

### Language to Use
- 「차분하고 신뢰감 있는 지역 종합건설사」, 「공공건축처럼 반듯한」, 「흰 바탕과 옅은 푸른 회색이 번갈아 나오는」, 「로고 남색 띠로 무게를 잡는」
- 「실제 준공 사진이 주인공인 포트폴리오」, 「데이터 시트처럼 정돈된 카드」
- 피할 말: 화려한, 네온, 유리 질감, 큰 그림자, 둥근 알약 버튼(탭·꼬리표 외)

### Color References
- 강조·링크: **인정 파랑 #0067A0**
- 넓은 어두운 면: **로고 남색 #1C2A53**, 바닥글 **밤 남색 #141D38**
- 상담 버튼만: **로고 적색 #8E0E15** (호버 #6F0A10)
- 바탕: 순백 #FFFFFF / 새벽 콘크리트 #F3F6FA
- 글자: 먹 남색 #1C2233 / 안개 회색 #5A6275, 선 #E2E6EE

### Component Prompts
1. 「흰 바탕의 시공 실적 카드 3열. 각 카드는 1px 연회색 테두리와 10px 모서리, 위쪽에 4:3 준공 사진, 사진 왼쪽 위에 흰 바탕 파랑 글자의 작은 분류 꼬리표. 아래에 굵은 한글 제목(19px, 800)과 발주처·용도·연면적·공사비·준공을 2열 표로. 항목명은 회색, 값은 진하게, 숫자는 Archivo.」
2. 「로고 남색(#1C2A53) 가로 띠에 왼쪽 굵은 흰 제목 '숫자로 보는 인정건설', 오른쪽에 큰 Archivo 숫자 네 개(1989년, 89.5억, 104위, 16명)를 가는 반투명 흰 세로선으로 나눠 배치. 숫자 아래에 80% 흰색 설명.」
3. 「흰 반투명 고정 머리글: 왼쪽 파란 건물 심벌 로고와 남색 '㈜인정건설', 오른쪽에 메뉴 다섯 개(회사소개·사업 분야·시공 실적·기술 칼럼·견적 문의), 남색 대표전화, 짙은 적색(#8E0E15) 6px 모서리 '견적 문의' 버튼. 현재 메뉴는 파랑 글자와 아래 2px 파랑 선.」

### Incremental Iteration
- 먼저 바탕 리듬(흰 ↔ #F3F6FA ↔ 남색 띠)을 맞춘 뒤 카드와 버튼을 얹는다
- 적색은 마지막에, 상담 버튼에만 넣는다. 화면에 적색이 두 군데를 넘으면 줄인다
- 새 구역은 「구역 이름(14px 파랑 + 적색 네모 점) → 제목(H2 800) → 리드(회색)」 순서를 지킨다
- 사진이 바뀌면 카드 비율(4:3, 16:10)은 그대로 두고 사진만 교체한다
