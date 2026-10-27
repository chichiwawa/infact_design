/**
 * sections.ts — page_sections.kind 카탈로그와 data(JSONB) 필드 명세
 * (supabase/02_site_pages.sql 주석과 1:1. 관리자 편집기·시드·렌더러가 모두 이 타입을 기준으로 한다)
 */

export type IconName =
  | "chat" | "search" | "blueprint" | "gear" | "chart"
  | "instagram" | "camera" | "sparkles" | "youtube"
  | "video" | "blog" | "viral" | "group" | "ad" | "design";

export interface Stat {
  value: number;      // 36.5
  decimals?: number;  // 1
  suffix?: string;    // "개월+"
  label: string;      // "평균 계약 유지"
  label_m?: string;   // 모바일 축약 라벨(없으면 label 그대로)
}

export interface HeroData {
  eyebrow: string;
  headline: string[];          // 줄 단위
  accent_line?: number;        // 액센트(블루) 줄 인덱스
  tagline: string;
  cta_label: string;
  cta_href: string;
  cta2_label?: string;         // 보조 버튼(유리형) — 2026-09-16 히어로 재설계
  cta2_href?: string;
  poster_url?: string;         // 배경 포스터(없으면 그라디언트)
  poster_alt?: string;
  video_webm?: string;         // 있으면 지연 로드 후 0.5s 페이드인
  video_mp4?: string;
  stats: Stat[];
  years?: [string, string];    // 오른쪽 아래 "2018 ——— 2027" (2026-10-13)
  chips?: { label: string; tone?: "dark" | "light" | "plus" | "white" | "glass" }[];  // 히어로에 떠다니는 알약 칩 (2026-10-13)
}

export interface NumbersItem { value: string; value_short?: string; label: string; body: string[]; body_mobile?: string[] }  // body_mobile: 있으면 모바일에서만 이 줄바꿈으로 표시(글자도 한 단계 작게) / body 줄 안의 **구절** 은 볼드 / value_short: 제목 아래 요약 줄 전용 값(없으면 value)
export interface NumbersData { intro: string; items: NumbersItem[] }

/** 04 부스터 데이터 카드 — 운영 전/후 비교 (사진 대신 코드로 그림). 숫자는 실제 사례 수치만. */
export interface DataCardCompare { kind: "compare"; metric: string; unit: string; before: number; after: number; period?: string; handle?: string; handle_sub?: string; subs?: { label: string; value: string }[] }
export type DataCard = DataCardCompare;
export interface TabItem { tag?: string; need?: string; title: string; subtitle?: string; body: string; body_m?: string; tags?: string[]; icon?: IconName; icon_url?: string; image_url?: string; image_alt?: string; data_card?: DataCard }  // icon_url: 3D 아이콘(R2 투명 PNG, 있으면 라인 아이콘 대신)  // body: \n 줄바꿈, **구절** 세미볼드 / image_*: 04 무대 이미지(R2 후)
/** 메인 03 패키지 3종 — 단계 카드 3장 (탭에서 분리, 가격 비노출) */
export interface PackageStep { tag?: string; title: string; target: string; body: string; results_title?: string; results?: string[]; tags?: string[]; image_url?: string; image_alt?: string; video_url?: string; heading?: string; desc?: string; features?: { title: string; sub: string }[] }  // heading: 카드 제목(줄바꿈, **구절** 볼드) / desc: 카드 설명 / features: 카드 아래 2x2 항목 / image_*: 카드 오른쪽 이미지 / video_url: 있으면 이미지 대신 짧은 반복 영상(무음 자동재생, image_url 은 첫 화면)
export interface PackageStepsData { intro?: string; items: PackageStep[]; cta_label: string; cta_href: string }

export interface MarketingTabsData {
  intro?: string;               // 제목 아래 도입문(선택)
  categories: { label: string; display?: "grid"; items: TabItem[] }[];  // display "grid": 스크롤 단계 하나에 격자로 한꺼번에(개별 상품)
  cta_label: string;
  cta_href: string;
}

export interface ProcessData {
  /** 큰 선언 문구: [앞줄, 뒷줄(**강조** 가능)] */
  statement?: [string, string];
  subtitle: string;
  steps: { tag: string; title: string; body: string; icon: IconName; en?: string }[];
  note: string;
}

export interface DifferentiatorsData {
  eyebrow: string;
  items: { title: string; body: string }[];
}

export interface LogoItem { label?: string; logo_url?: string; alt?: string; width?: number; height?: number; scale?: number }  // scale: 표시 높이 배율(기본 1, 예: 365mc 0.65 — 2026-09-23)  // width/height: 실측 px (마퀴가 로드 전에도 자리를 잡게, 2026-09-23)
export interface LogoMarqueeData { rows: LogoItem[][]; note?: string }

/** 메인 05.5 병의원 인사이트 — 발행 글 최신순 4개를 렌더러가 직접 조회(시드 아님). 글이 0개면 섹션 자체를 숨김 (2026-09-22) */
export interface BlogLatestData {
  sub?: string;        // 제목 아래 한 줄
  cta_label?: string;  // 기본 "블로그 전체 보기"
}

export interface FinalCtaData {
  headline: string;
  sub?: string;
  offers: { title: string; body: string }[];
  cta_label: string;
  cta_href: string;
  kakao_label?: string;
  kakao_url?: string;
  contacts: string[];
}

export interface PainQuotesData {
  headline: string;
  categories: { key: string; label: string }[];
  quotes: { text: string; category: string }[];
  big_typo: string;
}

export interface PackagesData {
  items: { category: string; title: string; target: string; body: string; results_title: string; results: string[]; components_title: string; components: { label: string; emphasis?: boolean }[] }[];
  note: string;
  banner: { title: string; body: string; cta_label: string; cta_href: string };
}

export interface BoostersData {
  subtitle?: string;
  items: { icon: IconName; icon_url?: string; title: string; hook: string; body: string; includes_label: string; includes: string[] }[];  // icon_url: 3D 아이콘(R2 투명 PNG, 있으면 라인 아이콘 대신)
  banner: { title: string; body: string; cta_label: string; cta_href: string };
}

export interface ProductsData {
  subtitle: string;
  items: { icon: IconName; icon_url?: string; title: string; lines: string[] }[];  // icon_url: 3D 아이콘(R2 투명 PNG, 있으면 라인 아이콘 대신)
  note: string;
}

export interface ContactIntroData {
  headline: string;
  body: string;
  offers: { title: string; body: string }[];
  kakao_label?: string;
  kakao_url?: string;
  service_types: string[];
}

export type SectionKind =
  | "hero" | "numbers" | "package_steps" | "marketing_tabs" | "process" | "differentiators" | "logo_marquee" | "final_cta"
  | "blog_latest"
  | "pain_quotes" | "packages" | "boosters" | "products"
  | "contact_intro";

export interface PageSection {
  id: string;
  kind: SectionKind;
  title: string | null;
  body: string | null;
  data: unknown;
  sort_order: number;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  nav_label: string | null;
  show_in_nav: boolean;
  nav_order: number;
  is_published: boolean;
  updated_at: string;
  sections: PageSection[];
}
