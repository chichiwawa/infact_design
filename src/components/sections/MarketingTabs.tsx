/**
 * 메인 04 — 필요한 곳만 집중 공략하는 부스터와 개별 상품 (2026-10-13 재설계, adotenglish.com '커리큘럼 진단' 구성 참고)
 *  이전 버전(스크롤 고정 + 2단 아코디언 메뉴)은 백업/04_메인_부스터개별상품_이전버전_2026-10-13 에 있음.
 *  구조: 왼쪽 "우리 병원은 [유입]이 필요해요" + 목록(부스터 4종 → 개별 상품 6종) + 버튼 / 오른쪽 이미지 패널 + 아래 설명. 동작은 PickerSection 참고.
 *  부스터 = 항목마다 이미지(image_url) 또는 데이터 카드 / 개별 상품 = 마지막 한 단계에 6종 격자.
 *  "우리 병원은 ___" 의 단어는 항목의 need (없으면 title).
 */
import Image from "next/image";
import Icon from "@/components/Icon";
import CompareCard from "@/components/sections/cards/CompareCard";
import PickerSection, { type PickerItem } from "./PickerSection";
import { InstaVisual, BeforeAfterVisual, AiVisual, AiSearchVisual, YoutubeVisual, IndividualVisual, IndividualShowcase } from "./cards/BoosterVisuals";
import type { MarketingTabsData } from "@/lib/sections";

/** 설명 문구: "\n" 은 줄바꿈, "**구절**" 은 세미볼드 */
function rich(body: string) {
  const lines = body.split("\n");
  const hl = lines.reduce((a, l, i) => (l.includes("**") ? i : a), -1); // 굵은 구절이 있는 마지막 줄 = 하늘색 강조
  return lines.map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={j} className="font-semibold" data-hl={i === hl ? "1" : undefined}>{part.slice(2, -2)}</strong> : part,
      )}
    </span>
  ));
}

/** 부스터 4종 카드 그림(코드로 그림). 순서 = 인스타 · 전후사진 · AI 노출 · 유튜브 */
const BOOSTER_VISUALS = [InstaVisual, BeforeAfterVisual, AiSearchVisual, YoutubeVisual];

const BOOSTER_EYEBROWS = ["INSTAGRAM", "BEFORE & AFTER", "AI SEARCH", "YOUTUBE"];
const BOOSTER_KINDS = ["ig", "ba", "ai", "yt"];

/** 사진형 카드(인스타·유튜브): 이미지가 카드 위쪽, 글이 아래 / 섹션 전체 배경은 같은 이미지를 흐리게 */
const PHOTO_SRC: (string | undefined)[] = [undefined, "/media/ba-face.webp", undefined, "/media/yt-hero.webp"];
/** 유튜브 카드: 가운데 사진 양옆에 놓일 작은 영상 카드 2장(왼쪽·오른쪽). 다른 썸네일로 바꾸려면 같은 이름으로 public/media 에 덮어쓰기 */
const PHOTO_SIDES: ([string, string] | undefined)[] = [undefined, undefined, undefined, ["/media/yt-side-1.webp", "/media/yt-side-2.webp"]];
/** 유튜브 카드 오른쪽 장식 칩 아이콘 (채널 운영 · 월 1회 촬영 · 롱폼+숏츠) */
const CHIP_ICONS = [
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="12" rx="2.5" /><path d="M10 9.2v4.6l4-2.3z" fill="currentColor" /><path d="M8 20.5h8" /></svg>,
  <svg key="m" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2l1.3-1.8h6L16.3 6h1.200A2.5 2.5 0 0 1 20 8.500v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.500z" /><circle cx="12" cy="12.5" r="3.2" /></svg>,
  <svg key="l" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="6" width="12" height="9" rx="2" /><rect x="16.5" y="4" width="5" height="16" rx="1.8" /><path d="M7 8.700v3.600l3-1.800z" fill="currentColor" /></svg>,
];
/** 인스타 카드 칩 아이콘 (계정 운영 · 릴스 · 메타 광고) */
const IG_ICONS = [
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" /></svg>,
  <svg key="r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4" width="17" height="16" rx="4" /><path d="M3.5 9h17M9 4l3 5M15 4l3 5" /><path d="M10.5 12.5v4l3.5-2z" fill="currentColor" /></svg>,
  <svg key="m" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1z" /><path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" /></svg>,
];
/** 전후사진 · AI 노출 카드 칩 아이콘 */
const BA_ICONS = [
  CHIP_ICONS[1],
  <svg key="p" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3.5 19c0-3.2 2.4-5 5.5-5s5.5 1.8 5.5 5" /><circle cx="17" cy="9" r="2.3" /><path d="M16.5 14c2.7 0 4.5 1.5 4.5 4" /></svg>,
  <svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l2.4 5 5.5.7-4 3.8 1 5.5L12 16.4 7.1 19l1-5.5-4-3.8L9.6 9z" /></svg>,
];
const AI_ICONS = [
  <svg key="q" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg>,
  <svg key="h" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" /></svg>,
  IG_ICONS[0],
];
const CHIP_SETS = [IG_ICONS, BA_ICONS, AI_ICONS, CHIP_ICONS];

/** 사진형 카드 이미지: 부스터 순서(인스타 · 전후사진 · AI 노출 · 유튜브). 인스타는 기본 이미지(CSS), 나머지는 파일 + 모양(variant) */
const PHOTO_VARIANT = [undefined, "ba", "ai", "yt"];
const isPhoto = (i: number) => i < 4;

const BOOSTER_ICONS =["instagram", "camera", "search", "youtube"] as const;

export default function MarketingTabs({ title, data, variant = "stack", acc = "b", btn, igbg = "b", igtx = "4", ytchip = "3", mob }: { title: string; data: MarketingTabsData; variant?: "a" | "b" | "c" | "stack"; acc?: "a" | "b" | "c"; btn?: string; igbg?: "a" | "b" | "c"; igtx?: "1" | "2" | "3" | "4"; ytchip?: "1" | "2" | "3" | "4" | "5"; mob?: "a" | "b" | "c" | "d" | "e" | "f" }) {
  const items = data.categories.flatMap((c): PickerItem[] => {
    if (c.display === "grid") {
      // 격자 카테고리(개별 상품 6종)는 한 단계로
      return [{
        label: "영상, 블로그, 바이럴, 체험단, 광고, 디자인콘텐츠",
        need: "개별 상품",
        heading: c.label,
        icon: <Icon name="sparkles" className="w-6 h-6" />,
        tag: `INDIVIDUAL ${c.items.length}`,
        eyebrow: "INDIVIDUAL 6",
        kind: "ig",
        visual: <IndividualShowcase />,
        below: (
          <>
            <p className="pk-below-body">패키지가 아니어도 괜찮습니다. 병원 진단 후, 필요한 것만 골라 설계합니다.</p>
            <ul className="yt-chips">
              <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9.5 4h5v2.5h-5z" /><path d="M9 13l2 2 4-4" /></svg></i><span>진단 후 설계</span></li>
              <li><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h9M18 8h1M5 16h2M11 16h8" /><circle cx="16" cy="8" r="2" /><circle cx="9" cy="16" r="2" /></svg></i><span>필요한 것만</span></li>
            </ul>
          </>
        ),
      }];
    }
    return c.items.map((it, i) => ({
      label: it.title,
      need: it.need ?? it.title.replace(/\s*부스터.*$/, ""),
      heading: i === 0 ? c.label : undefined,
      icon: <Icon name={BOOSTER_ICONS[i] ?? "sparkles"} className="w-6 h-6" />,
      tag: `BOOSTER ${String(i + 1).padStart(2, "0")}`,
      eyebrow: BOOSTER_EYEBROWS[i],
      kind: isPhoto(i) ? "ig" : BOOSTER_KINDS[i],
      bg: i === 0 || i === 3 ? <InstaVisual src={PHOTO_SRC[i]} draw={i === 0} /> : undefined,
      visual: BOOSTER_VISUALS[i] ? (
        (() => { if (PHOTO_SRC[i]) return <InstaVisual src={PHOTO_SRC[i]} draw={false} sides={PHOTO_SIDES[i]} variant={PHOTO_VARIANT[i]} />; const V = BOOSTER_VISUALS[i]; return <V />; })()
      ) : it.data_card ? (
        <CompareCard card={it.data_card} />
      ) : it.image_url ? (
        <Image src={it.image_url} alt={it.image_alt ?? it.title} fill sizes="(min-width: 1024px) 50vw, 92vw" className="object-cover" />
      ) : (
        <span className="pk-noimg">이미지 준비 중</span>
      ),
      below: (
        <>
          <p className="pk-below-body">{rich(it.body)}</p>
          {isPhoto(i) && it.tags?.length ? <ul className="yt-chips">{it.tags.map((tg, k) => <li key={tg}><i>{CHIP_SETS[i]?.[k]}</i><span>{tg}</span></li>)}</ul> : null}
          {it.tags?.length && !isPhoto(i) ? <ul className="pk-tags">{it.tags.map((tg) => <li key={tg}>{tg}</li>)}</ul> : null}
        </>
      ),
    }));
  });
  return (
    <PickerSection
      id="marketing" bg="bg-night text-white on-dark pk-dark" lead={title} sub={variant === "stack" ? undefined : data.intro?.replace(/\n/g, " ")}
      variant={variant} acc={acc} btn={btn} igbg={igbg} igtx={igtx} ytchip={ytchip} mob={mob} items={items} cta={{ label: data.cta_label.replace(/\s*→$/, ""), href: data.cta_href }}
    />
  );
}
