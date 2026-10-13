---
version: alpha
name: Infact Company Design System
description: 인팩트컴퍼니(병원 마케팅 대행사) 홈페이지용 디자인 토큰. spacing/typography/radius 스케일은 getdesign.md의 Vercel 분석 뼈대(4px 기반 간격, 타이트한 타입 스케일, hairline+low-alpha shadow 위주의 절제된 depth)를 참고했고, 색상은 시그니처 컬러 #3061FF 기준으로 전면 재설계함. 톤앤매너: 친근하되 과장 없이 팩트로 신뢰를 주는 느낌 — 버셀처럼 무채색으로 죽이지 않고, 블루를 본문 곳곳(CTA·강조·링크)에서 자신 있게 씀.

colors:
  primary: "#3061FF"
  primary-deep: "#2148D6"
  primary-press: "#1A3AB0"
  primary-soft: "#E8EEFF"
  on-primary: "#ffffff"
  ink: "#171717"
  body: "#4d4d4d"
  mute: "#8f8f8f"
  faint: "#a1a1a1"
  hairline: "#ebebeb"
  hairline-soft: "#f2f2f2"
  canvas: "#fafafa"
  canvas-elevated: "#ffffff"
  link: "#3061FF"
  link-deep: "#2148D6"
  link-soft: "#E8EEFF"
  success: "#12A150"
  success-soft: "#E4F7EC"
  error: "#EE3B3B"
  error-deep: "#C81E1E"
  warning: "#F5A623"
  warning-soft: "#FFEFCF"
  warning-deep: "#AB570A"

typography:
  display-xl:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -1.5px
  heading-lg:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -1px
  heading-md:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.4px
  label-sm:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.28px
  eyebrow:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1px
  body-lg:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button-lg:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  button-md:
    fontFamily: Pretendard, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0

rounded:
  none: 0px
  sm: 6px
  md: 12px
  lg: 16px
  pill-category: 64px
  pill: 100px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  3xl: 64px
  4xl: 96px
  section: 128px

components:
  nav-bar:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    borderColor: "{colors.hairline}"
    padding: "{spacing.sm} {spacing.lg}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    hover: "{colors.primary-deep}"
    active: "{colors.primary-press}"
  button-secondary:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  category-tab:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.body}"
    activeBackgroundColor: "{colors.primary}"
    activeTextColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill-category}"
    padding: "10px 20px"
  text-input:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    focusBorderColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  feature-card:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  feature-card-elevated:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
    shadow: "elevation.2"
  logo-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.body-md}"
    padding: "{spacing.xl} {spacing.lg}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section} {spacing.lg}"
  cta-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.heading-lg}"
    padding: "{spacing.4xl} {spacing.lg}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    borderColor: "{colors.hairline}"
    padding: "{spacing.3xl} {spacing.lg}"

---

## Overview

인팩트컴퍼니 홈페이지는 "친근하지만 팩트로 밀어붙이는" 톤을 시각적으로도 유지한다. 배경은 버셀처럼 근백색(`{colors.canvas}` #fafafa)에 검정에 가까운 잉크(`{colors.ink}` #171717)로 본문을 잡는 절제된 베이스를 쓰되, **시그니처 블루(`{colors.primary}` #3061FF)를 CTA·강조·링크·활성 탭에서 적극적으로 노출**시켜 버셀의 "색을 극도로 아끼는" 방식과는 다르게 간다 — 병원 실무자가 봤을 때 "전문적이면서도 딱딱하지 않다"는 인상을 컬러 자체가 뒷받침해야 하기 때문.

카드·인풋은 1px hairline(`{colors.hairline}` #ebebeb)을 기본으로 하고, 뜬 느낌이 필요할 때만 아주 옅은 레이어드 섀도우를 얹는다(무거운 그림자 금지). 타이포는 Pretendard 기준으로 큰 제목일수록 자간을 좁히고(-1.5px~-0.4px), 본문은 자간 0으로 편안하게 읽히게 한다.

**핵심 원칙**
- 배경은 근백색 캔버스, 텍스트는 잉크 → 회색 사다리(`ink → body → mute → faint`)로 위계를 준다.
- 강조는 시그니처 블루 하나로 통일 — 버셀처럼 여러 액센트 컬러(보라·시안·핑크)를 섞지 않는다. 색이 늘어날수록 "친근하지만 팩트 기반"이라는 톤이 흐려진다.
- 버튼은 두 형태: 마케팅 CTA는 완전히 둥근 pill(`{rounded.pill}` 100px), 보조 액션은 작은 사각(`{rounded.sm}` 6px) — 컨텍스트로 구분한다.
- 카드·인풋은 hairline이 기본, 섀도우는 예외적으로만.
- 섹션 간 수직 리듬은 넉넉하게(`{spacing.4xl}`~`{spacing.section}`, 96~128px), 카드 내부는 `{spacing.lg}`~`{spacing.xl}`(24~32px)로 밀도 있게.

## Colors

### Brand
- **Primary** (`{colors.primary}` — #3061FF): 시그니처 컬러. CTA 배경, 활성 탭, 링크, 강조 숫자 등 "행동을 유도하는 지점"에 집중적으로 사용.
- **Primary Deep** (`{colors.primary-deep}` — #2148D6): hover 상태.
- **Primary Press** (`{colors.primary-press}` — #1A3AB0): active/press 상태.
- **Primary Soft** (`{colors.primary-soft}` — #E8EEFF): 아주 옅은 블루 배경 — 통계 카드 배경, 강조 뱃지 등에 사용.

> ⚠️ 위 deep/press/soft 톤은 primary를 기준으로 계산한 근사치야. 실제 시안 작업 시 채도·명도를 눈으로 보면서 미세조정 추천 (임의로 고정하지 말 것).

### Surface & Text
- Canvas `{colors.canvas}` #fafafa / Elevated `{colors.canvas-elevated}` #ffffff
- Ink `{colors.ink}` #171717 → Body `{colors.body}` #4d4d4d → Mute `{colors.mute}` #8f8f8f → Faint `{colors.faint}` #a1a1a1
- Hairline `{colors.hairline}` #ebebeb (카드·인풋·구분선 기본 보더)

### Semantic
- Success `{colors.success}` #12A150 (문의 접수 완료 등 — 병원 실무자에게 "정상 처리됐다"는 신호는 블루가 아니라 명확한 그린으로)
- Error `{colors.error}` #EE3B3B / Warning `{colors.warning}` #F5A623

## Typography

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
> **2026-09-14 디벨롭 (사용자 피드백 "너무 평범하다" → 레퍼런스 2곳 실측 후 재설계):** 레퍼런스 h1 130px / h2 80~128px ExtraBold(자간 -2~-3px), 다른 쪽 h1 56px / h2 35~48px. 블루 톤에 맞춰 그 중간값으로 전면 확대. 제목은 ExtraBold(800), 제목 안 **한 구절만** 시그니처 블루 액센트(`**구절**` 마크업 → `Accent` 컴포넌트). 코드 기준은 `src/app/globals.css`의 `.t-*` 클래스.

| Token | Size (PC / 태블릿 / 모바일) | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display` | 96 / 64 / 42px | 800 | 1.08 | -3px | 히어로 헤드카피 |
| `h-xl` | 72 / 52 / 36px | 800 | 1.12 | -2.4px | 다크 밴드 대제목, 서비스 첫 화면 |
| `h-lg` | 52 / 40 / 30px | 800 | 1.18 | -1.6px | 섹션 대제목 |
| `h-md` | 24 / 24 / 20px | 700 | 1.35 | -0.5px | 카드/서브 제목 |
| `stat` | 76 / 56 / 44px (히어로 4열은 64/52/40) | 800 | 1 | -3px | 수치 + 위첨자 단위(+ % ~) |
| `lead` | 21 / 21 / 17px | 400 | 1.7 | -0.2px | 섹션 서브카피 |
| `eyebrow` | 13px | 600 | 1.4 | 2.4px, uppercase | 섹션 번호 태그 "03 · Marketing Design" |
| `label` | 15px | 600 | 1.4 | -0.2px | 강조 라벨 |
| `body-lg` / `body` / `body-sm` | 17 / 15 / 13px | 400 | 1.75 / 1.7 / 1.6 | 0 | 본문 |
| `button` | 17px, 16px 32px 패딩, 반경 100px | 700 | 1.2 | 0 | pill 버튼 (실측 12~16px × 26~36px, 반경 30~50px) |

**추가된 룩 규칙(디벨롭):** 다크 밴드(`night` #0a0a0a) — 히어로·02·05·06·푸터 / 블루 풀블리드 — 최종 CTA / 회백 라운드 패널(`panel` #f4f6fa, 반경 32px) — 03 탭 컨테이너 / 다크 밴드 안 카드는 hairline 그리드 셀 / 컨테이너 1296px, 섹션 여백 140px / 상단 3px 스크롤 진행바 / 헤더는 다크 히어로 위 투명 → 스크롤 시 흰 바.

**폰트**: Pretendard 고정 (한글 웹폰트 표준, 이미 벤치마킹한 twinh.co.kr도 동일 폰트 사용 확인함). Geist Mono 같은 별도 모노스페이스는 도입 안 함 — 코드블록이 없는 마케팅 사이트라 불필요.

## Spacing (4px 기반)

`xxs 4 · xs 8 · sm 12 · md 16 · lg 24 · xl 32 · 2xl 40 · 3xl 64 · 4xl 96 · section 128`

- 카드 내부 패딩: `lg~xl` (24~32px)
- 섹션 간 수직 여백: `4xl~section` (96~128px)
- 버튼 패딩: pill `14px 28px`, 보조 sm `8px 16px`

## Radius

`none 0 · sm 6 · md 12 · lg 16 · pill-category 64 · pill 100 · full 9999`

- 카드: `md`(12px), 큰 패널: `lg`(16px)
- 마케팅 CTA 버튼: `pill`(100px, 완전히 둥근)
- 보조/작은 버튼: `sm`(6px)
- 카테고리 탭(섹션 03의 탭 UI에 사용 가능): `pill-category`(64px)

## Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | 1px hairline만, 섀도우 없음 | 기본 카드, 인풋, 구분선 |
| 1 — Whisper | hairline + `0px 1px 2px rgba(0,0,0,0.04)` | 살짝 뜬 카드 |
| 2 — Floating | `0px 2px 4px rgba(0,0,0,0.06), 0px 8px 16px -4px rgba(0,0,0,0.08)` | 드롭다운, 모달, 툴팁 |

무거운 그림자·글로우 지양 — hairline이 기본값이고 섀도우는 예외적으로만 얹는다.

## Do's and Don'ts

### Do
- 강조는 시그니처 블루(`{colors.primary}`) 하나로 통일한다.
- 카드·인풋은 hairline을 기본값으로 하고 섀도우는 최소한으로.
- 큰 제목일수록 자간을 좁힌다(-1.5px~-0.4px), 본문은 자간 0.
- 마케팅 CTA는 pill, 보조 버튼은 6px 사각 — 컨텍스트로 형태를 구분해서 일관되게 쓴다.

### Don't
- 액센트 컬러를 여러 개 섞지 않는다(보라·시안·핑크 등 추가 금지) — 브랜드 인지가 흐려진다.
- 본문 텍스트에 순수 검정(#000000) 쓰지 않는다 — `{colors.ink}`(#171717)까지만.
- 섹션마다 다른 버튼 모양을 섞지 않는다.
- 이 파일의 컴포넌트 색상·타이포를 강제하되, 실제 벤치마킹한 애니메이션/인터랙션(design/benchmarks/ 참고)은 이 파일이 아니라 각 섹션 NOTES.md 기준을 따른다 — 이 파일은 "정적인 룩" 담당, 애니메이션은 별도.


## AI 티 방지 규칙 (2026-09-15)
- 섹션 번호 아이브로우(`01 · TITLE`) 금지. 제목만으로 시작한다. 라벨이 꼭 필요하면 페이지당 1~2개, 제목 바로 위 같은 열에.
- 장식용 큰 숫자 워터마크·코너 번호 금지. 번호는 실제 순서(프로세스 STEP)일 때만.
- SCROLL 힌트, 점 달린 상태 알약, 블러 오브 여러 개, 글로우 그림자, 이탤릭 제목·태그라인 금지.
- 아이콘은 타일 상자 없이 제목 옆 인라인. 화살표(↗)는 1차 CTA 두 곳(히어로·최종 CTA)만.
- 한글에 넓은 자간 금지(최대 1.2px). 제목 크기는 display 76 / h-xl 56 / h-lg 44 스케일을 지킨다.

### 예외 (2026-09-16 사용자 확정)
- 01 히어로 영문 태그라인 "INside the clinic, based on FACT."는 이탤릭·회색으로 둔다(사용자 지정). "이탤릭 제목 금지" 규칙의 예외이며 제목에는 여전히 이탤릭을 쓰지 않는다.
- 01 히어로 "문의하기" 버튼의 대각선 화살표(원 안)는 유지(히어로·최종 CTA 에만 화살표 허용 규칙과 일치).

### 예외 (2026-09-17 사용자 확정 — 서비스 01 고민 인용문)
- 3D 카드 공간은 사용자가 준 레퍼런스(떠 있는 Q&A 카드 광고)를 디벨롭한 것으로, 이 섹션에 한해 파란 기운의 확산 그림자(`0 40px 80px -30px rgba(20,50,160,.55)`)와 배경 벽 blur(2px)를 쓴다. "글로우 그림자 금지"의 예외이며 다른 섹션으로 번지지 않게 한다.
- 정렬된 뒤의 고민 줄은 Medium(500), 카테고리 타이틀은 박스 없이 68px 글자 — "전부 박스라 가독성이 떨어진다"는 지적에 따른 위계 규칙.
- SCROLL 힌트 금지는 그대로 적용(시안에 있던 안내 문구는 실제 페이지에서 뺌).
