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
import PickerSection from "./PickerSection";
import { InstaVisual, BeforeAfterVisual, AiVisual, YoutubeVisual, IndividualVisual } from "./cards/BoosterVisuals";
import type { MarketingTabsData } from "@/lib/sections";

/** 설명 문구: "\n" 은 줄바꿈, "**구절**" 은 세미볼드 */
function rich(body: string) {
  return body.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong> : part,
      )}
    </span>
  ));
}

/** 부스터 4종 카드 그림(코드로 그림). 순서 = 인스타 · 전후사진 · AI 노출 · 유튜브 */
const BOOSTER_VISUALS = [InstaVisual, BeforeAfterVisual, AiVisual, YoutubeVisual];

const BOOSTER_ICONS =["instagram", "camera", "search", "youtube"] as const;

export default function MarketingTabs({ title, data, variant = "stack", acc = "b", btn }: { title: string; data: MarketingTabsData; variant?: "a" | "b" | "c" | "stack"; acc?: "a" | "b" | "c"; btn?: string }) {
  const items = data.categories.flatMap((c) => {
    if (c.display === "grid") {
      // 격자 카테고리(개별 상품 6종)는 한 단계로
      return [{
        label: "영상, 블로그, 바이럴, 체험단, 광고, 디자인콘텐츠",
        need: "개별 상품",
        heading: c.label,
        icon: <Icon name="sparkles" className="w-6 h-6" />,
        tag: `INDIVIDUAL ${c.items.length}`,
        wide: true,
        visual: <IndividualVisual names={c.items.map((it) => it.title)} />,
        below: <p className="pk-below-body">패키지가 아니어도 괜찮습니다. 병원 진단 후, 필요한 것만 골라 설계합니다.</p>,
      }];
    }
    return c.items.map((it, i) => ({
      label: it.title,
      need: it.need ?? it.title.replace(/\s*부스터.*$/, ""),
      heading: i === 0 ? c.label : undefined,
      icon: <Icon name={BOOSTER_ICONS[i] ?? "sparkles"} className="w-6 h-6" />,
      tag: `BOOSTER ${String(i + 1).padStart(2, "0")}`,
      visual: BOOSTER_VISUALS[i] ? (
        (() => { const V = BOOSTER_VISUALS[i]; return <V />; })()
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
          {it.tags?.length ? <ul className="pk-tags">{it.tags.map((tg) => <li key={tg}>{tg}</li>)}</ul> : null}
        </>
      ),
    }));
  });
  return (
    <PickerSection
      id="marketing" bg="bg-night text-white on-dark pk-dark" lead={title} sub={variant === "stack" ? undefined : data.intro?.replace(/\n/g, " ")}
      variant={variant} acc={acc} btn={btn} items={items} cta={{ label: data.cta_label.replace(/\s*→$/, ""), href: data.cta_href }}
    />
  );
}
