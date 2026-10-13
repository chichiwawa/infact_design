"use client";

/**
 * 04 부스터·개별상품 — 와이어프레임 03의 나머지 두 탭 (2026-09-15 재설계)
 *  구조(03 패키지와 동일 틀): 왼쪽 = 제목·도입문·2단 메뉴(대메뉴 = 카테고리, 펼치면 소메뉴 = 상품) / 오른쪽 = 무대(상품 하나: 설명 + 가로 이미지)
 *  PC 모션(2026-09-15 사용자 요청): 섹션을 화면에 고정하고 스크롤 진행도로 단계가 바뀜(부스터 4개는 하나씩, 개별 상품 6종은 격자 한 단계 — 높이 100vh + n×55vh). 메뉴 클릭 = 해당 위치로 스크롤.
 *  - 메뉴 높이는 소메뉴가 가장 긴 카테고리 기준으로 고정 → 카테고리를 바꿔도 제목·CTA 위치 불변 (격자 카테고리는 소메뉴 대신 상품명 2열 목록)
 *  - 대메뉴 펼침: CSS grid-rows 0fr→1fr 전환 / 무대 교체: 살짝 올라오며 교차 페이드 (.stage-in)
 *  - 벤치마킹 03 NOTES 의 coverflow 슬라이더는 카탈로그 성격과 맞지 않아 제거(사용자 결정)
 *  - CTA(2026-09-16): PC 는 왼쪽 메뉴 아래 보조 버튼(03 과 위치·스타일 통일), 모바일은 목록 아래
 *  - 모바일/태블릿(<1024px): 누르는 UI 없이 카테고리 → 상품(제목·설명·태그)을 그대로 쭉 읽는 목록 (2026-09-15 사용자 피드백)
 *  - PC 에서는 모바일 목록이 display:none 이지만 DOM 에 남아 전체 내용이 노출됨(GEO)
 *  2026-09-16: 왼쪽 열을 440px 고정으로 바꿔 03 과 나란히 맞췄다가(03 을 더 넓히면서), 사용자가 "04 는 왜 커졌냐"고 되물어 04 만 원래 그리드(`minmax(0,1fr)_minmax(0,1.5fr)`, gap-20)로 되돌림 — 03 오른쪽 끝과는 더 이상 안 맞지만, 04 자체는 원래 폭 유지가 우선.
 *  2026-09-16 무대(상품 하나) 타이틀·서브타이틀 폰트 크기를 03 카드와 통일(사용자 요청): 타이틀 `text-[30px] lg:text-[40px]` → `text-[35px]`(고정). "서브 타이틀"은 현재 데이터에 값이 없는 `curItem.subtitle` 필드보다는, 실제로 화면에 보이는 제목 아래 설명 문단(`curItem.body`, 기존 전역 `.t-lead` 19px)을 가리키는 것으로 판단 — 이 문단도 명시적 크기로 override(전역 `.t-lead` 클래스는 다른 섹션에서도 널리 쓰여서 그대로 바꾸면 영향 범위가 커짐). PC 무대(article.stage-in)만 대상 — 모바일 목록은 별도 레이아웃이라 그대로 유지. → 15px 로 했다가 사용자가 "너무 작다" 며 18px 로 재조정(subtitle 필드도 동일하게).
 *  2026-09-16 격자(개별 상품 6종) 스텝의 타일 텍스트 x좌표를, 상품 하나짜리 스텝의 타이틀 x좌표에 고정 정렬(사용자 요청 — "메인 타이틀이랑 서브텍스트 고정시켜서라도 가로 위치 맞춰줘"): 실측 결과 타일 안쪽 `p-7`(28px) 때문에 격자 스텝으로 스크롤해 넘어가면 텍스트가 단일 상품 스텝보다 28px 오른쪽에서 시작하던 문제. 타일 자체의 padding(카드 내부 균형)은 안 건드리고, 격자를 감싸는 `<ul>` 에 `-ml-7`(-28px)을 줘서 박스 전체를 왼쪽으로 옮김 — 두 스텝 모두 텍스트 시작 x좌표가 동일해짐.
 *  2026-09-16 격자 2행(체험단·광고·디자인·콘텐츠) 타이틀 y좌표 불일치 수정(사용자 스크린샷 지적 — "이게 텍스트가 맞다고 생각해?"): 타이틀이 `mt-auto`(flex 하단 정렬)로 카드 바닥에 붙어있던 구조라, 설명 줄 수가 다른 타일(디자인·콘텐츠 4줄 vs 체험단/광고 2줄)끼리 같은 행에서 높이가 맞춰지면(grid 행은 가장 큰 타일 기준으로 다 같이 늘어남) 타이틀이 설명 길이만큼 서로 다른 높이에 위치하게 됨(설명이 길수록 타이틀이 위로 밀림). `mt-auto pt-8` → `mt-8`(고정 여백)으로 바꿔 타이틀을 아이콘 기준 top-anchor 로 전환 — 설명 줄 수와 무관하게 모든 타일의 타이틀이 같은 y 에 위치(짧은 설명 타일은 카드 하단에 여백만 남음).
 *  2026-09-16 격자(개별 상품 6종) 스텝 진입 모션 추가(사용자 요청 — "스크롤해서 개별 상품 6종이 보이게 되면 박스가 하나씩 튀어나오는 모션"): globals.css 에 `.tile-pop-stagger`(back-ease 오버슈트로 튀어나오는 느낌, 0.08s 간격 스태거, 04 프로세스의 기존 `.zoom-stagger` 패턴과 동일한 구조) 추가. 이 격자는 이미 부모 `<article key={k}>` 가 스텝 전환마다 리마운트되므로(= 매번 새 DOM), IntersectionObserver 기반 `.is-visible` 토글 없이 애니메이션이 바로 재생됨 — `.stage-in` 과 동일한 방식. `prefers-reduced-motion: reduce` 예외 처리도 기존 리스트에 포함.
 */
import Link from "next/link";
import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import { smoothScrollTo } from "@/lib/scroll";
import { useEffect, useRef, useState } from "react";
import type { MarketingTabsData } from "@/lib/sections";

/* 2026-09-23 이미지 지연 노출 수정: R2 원본 PNG(1.4~5.5MB)를 그대로 <img> 로 쓰고, 무대 <article key={k}> 가 단계마다 리마운트되며
   그때서야 요청을 시작해 부스터 사진·개별 상품 아이콘이 늦게 떴다 → next/image(리사이즈·AVIF/WebP) + 섹션이 두 화면 안으로 오면
   모든 단계의 무대 이미지·아이콘을 미리 받아 둔다(preload — 브라우저가 srcset 에서 고를 URL 과 같은 URL 을 받게 getImageProps 로 뽑음). */
const STAGE_SIZES = "(min-width: 1024px) 55vw, 100vw";
const ICON_SIZES = "96px";
function warm(src: string, sizes: string) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes });
}
import Accent from "@/components/Accent";
import Icon from "@/components/Icon";
import CompareCard from "@/components/sections/cards/CompareCard";

/** 설명 문구: "\n" 은 줄바꿈(블록), "**구절**" 은 세미볼드(색 유지) */
function rich(body: string) {
  return body.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong> : part,
      )}
    </span>
  ));
}

export default function MarketingTabs({ title, data }: { title: string; data: MarketingTabsData }) {
  // 스크롤 단계: 일반 카테고리는 상품 하나 = 한 단계, display "grid" 카테고리는 카테고리 전체 = 한 단계(격자)
  type Step = { ci: number; i: number; grid: boolean };
  const steps: Step[] = data.categories.flatMap((c, ci): Step[] =>
    c.display === "grid" ? [{ ci, i: -1, grid: true }] : c.items.map((_, i) => ({ ci, i, grid: false })),
  );
  const n = steps.length;
  const [k, setK] = useState(0);
  // 모바일 목록 아코디언: 소메뉴가 펼쳐지는(격자 아님) 카테고리는 기본 열림, 격자(개별 상품 6종)는 기본 닫힘 (2026-09-21 사용자 지정)
  const [openCats, setOpenCats] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(data.categories.map((c) => [c.label, c.display !== "grid"])),
  );
  const cur = steps[k];
  const curCat = data.categories[cur.ci];
  const curItem = cur.grid ? undefined : curCat.items[cur.i];
  // 메뉴 예약 높이: 소메뉴가 펼쳐지는(격자 아님) 카테고리 중 가장 긴 것 기준 — 격자 카테고리는 한 줄 텍스트라 더 짧음
  const maxItems = Math.max(...data.categories.filter((c) => c.display !== "grid").map((c) => c.items.length));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, warmed = false;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      if (!warmed && rect.top < window.innerHeight * 2) {
        warmed = true;
        data.categories.forEach((c) => c.items.forEach((it) => { if (it.image_url) warm(it.image_url, STAGE_SIZES); if (it.icon_url) warm(it.icon_url, ICON_SIZES); }));
      }
      // 화면 밖(위/아래로 스크롤이 멀어진 상태)이면 계산을 건너뜀 — 안 그러면 이 핸들러가 페이지 전체
      // 스크롤 내내 계속 돌면서 다른 섹션 스크롤 중 메인 스레드를 다퉈 "스크롤이 안 먹는" 버벅임을 만든다
      // (ParticleDrift.tsx 의 scrollY < innerHeight 가드와 같은 이유, 2026-09-18 pitfall)
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const span = el.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      setK(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n, data]);

  /** 메뉴 클릭 → 해당 상품이 활성되는 스크롤 위치로 이동 */
  const goTo = (target: number) => {
    const el = ref.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + ((target + 0.5) / n) * span;
    smoothScrollTo(top); // Lenis 경유 (브라우저 smooth와 충돌 방지)
  };

  return (
    <section className="bg-elevated py-[72px] lg:py-0">
      <div className="container-x">
        {/* 모바일/태블릿 제목 (PC 는 왼쪽 열 안에) */}
        <div className="lg:hidden" data-reveal>
          <h2 className="t-h-lg text-ink"><Accent text={title} /></h2>
          {data.intro && <p className="t-lead text-body mt-6 whitespace-pre-line">{data.intro}</p>}
        </div>

        {/* PC: 화면에 고정된 무대 — 스크롤 진행도에 따라 상품이 순서대로 바뀜(02 강점 섹션과 같은 방식). 메뉴 클릭 = 해당 위치로 스크롤 */}
        <div ref={ref} className="hidden lg:block [overflow-anchor:none]" style={{ height: `calc(100vh + ${n * 55}vh)` }}>
          {/* 위에서 140px 고정: 03 섹션 왼쪽 열과 같은 자리 (2026-09-16 사용자 요청, 화면 높이와 무관) */}
          <div className="sticky top-0 h-screen flex items-start pt-[140px]">
            <div className="w-full grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20 items-start">
              <div>
                <h2 className="t-h-lg text-ink"><Accent text={title} /></h2>
                {data.intro && <p className="t-lead text-body mt-6 whitespace-pre-line">{data.intro}</p>}
                <nav aria-label="상품 목록" className="cat-nav mt-10 max-w-[320px] border-t border-ink/15" style={{ "--nav-h": `${data.categories.length * 72 + maxItems * 46 + 24}px` } as React.CSSProperties}>
                  {data.categories.map((c, ci) => {
                    const open = ci === cur.ci;
                    return (
                      <div key={c.label} className="border-b border-ink/15">
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => goTo(steps.findIndex((s) => s.ci === ci))}
                          className={`w-full flex items-center justify-between py-5 text-left text-[20px] font-bold tracking-[-0.4px] transition-colors ${open ? "text-ink" : "text-mute hover:text-ink"}`}
                        >
                          {c.label}
                          <span aria-hidden="true" className={`text-[22px] font-light leading-none transition-transform duration-300 ${open ? "rotate-45 text-primary" : ""}`}>+</span>
                        </button>
                        <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                          {c.display === "grid" ? (
                            // 격자 카테고리: 오른쪽에 전부 보이므로 누르는 소메뉴 대신 상품명 2열 목록(높이 = 부스터 4줄과 비슷 → 버튼 위치 유지)
                            <ul className="overflow-hidden grid grid-cols-2" role="list">
                              {c.items.map((it, i) => (
                                <li key={it.title} className={`flex items-center gap-3 py-2.5 text-[16px] text-body ${i >= c.items.length - 2 ? "mb-4" : ""}`}>
                                  <span aria-hidden="true" className="h-px w-3 bg-ink/20" />
                                  {it.title}
                                </li>
                              ))}
                            </ul>
                          ) : (
                          <ul className="overflow-hidden" role="list">
                            {c.items.map((it, i) => {
                              const on = open && !cur.grid && i === cur.i;
                              return (
                                <li key={it.title}>
                                  <button
                                    type="button"
                                    aria-current={on ? "true" : undefined}
                                    onClick={() => goTo(steps.findIndex((s) => s.ci === ci && (s.grid || s.i === i)))}
                                    className={`w-full flex items-center gap-3 py-2.5 text-left text-[16px] transition-colors ${on ? "text-primary font-bold" : "text-body hover:text-ink"} ${i === c.items.length - 1 ? "mb-4" : ""}`}
                                  >
                                    <span aria-hidden="true" className={`h-px transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${on ? "w-6 bg-primary" : "w-3 bg-ink/20"}`} />
                                    {it.title}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </nav>
                <div className="mt-10">
                  <Link href={data.cta_href} className="btn-primary">{data.cta_label.replace(/\s*→$/, "")}</Link>
                </div>
              </div>

              {/* 오른쪽: 무대 — 상품 하나(설명 → 가로 이미지) 또는 격자(개별 상품 6종 한꺼번에) */}
              <article key={k} className="stage-in min-w-0" aria-live="polite">
                {cur.grid ? (
                  <>
                    {/* 제목 없이 격자만 (왼쪽 메뉴가 이미 "개별 상품 6종"을 말해 줌). 카드 높이를 키워 두 줄이 이미지 단계 높이와 맞게 */}
                    <h3 className="sr-only">{curCat.label}</h3>
                    <ul className="grid grid-cols-3 gap-4 -ml-7 tile-pop-stagger">
                      {curCat.items.map((it) => (
                        <li key={it.title} className="relative rounded-[24px] bg-panel p-7 min-h-[268px] flex flex-col">
                          {it.icon_url ? (
                            <span aria-hidden="true" className="absolute top-4 right-4 w-24 h-24 pointer-events-none select-none"><Image src={it.icon_url} alt="" fill sizes={ICON_SIZES} className="object-contain" /></span>
                          ) : it.icon ? (
                            <Icon name={it.icon} className="absolute top-7 right-7 w-7 h-7 text-primary" />
                          ) : null}
                          <p className={`text-[22px] font-extrabold tracking-[-0.5px] text-ink ${it.icon_url ? "mt-[116px]" : "mt-8"}`}>{it.title}</p>
                          <p className="t-body text-body mt-2">
                            {it.body.split(" · ").map((l) => <span key={l} className="block">{l}</span>)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : curItem && (
                  <>
                    <div className="min-w-0">
                      {curItem.tag && <p className="text-[14px] font-semibold text-mute">{curItem.tag}</p>}
                      <h3 className="text-[35px] font-extrabold leading-[1.1] tracking-[-1.2px] text-ink">{curItem.title}</h3>
                      {curItem.subtitle && <p className="text-[18px] font-semibold leading-[1.4] tracking-[-0.4px] text-ink mt-5">{curItem.subtitle}</p>}
                      {/* 설명 높이를 3줄로 고정: 상품마다 줄 수가 달라도 제목·이미지 위치가 움직이지 않게 (2026-09-16 사용자 요청) */}
                      <p className="text-[18px] leading-[1.7] tracking-[-0.2px] text-body mt-4 lg:min-h-[97px] [word-break:keep-all]">{rich(curItem.body)}</p>
                      {curItem.tags?.length ? <p className="text-[14px] text-mute mt-7">{curItem.tags.join("  ·  ")}</p> : null}
                    </div>
                    {/* 이미지: 이중 베젤 틀, 가로 16:9 */}
                    <div className="mt-8 rounded-[28px] bg-ink/[0.04] p-1.5 ring-1 ring-ink/5">
                      <div className="relative w-full aspect-[16/9] rounded-[22px] bg-panel overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        {curItem.data_card ? (
                          <CompareCard card={curItem.data_card} />
                        ) : curItem.image_url ? (
                          <Image src={curItem.image_url} alt={curItem.image_alt ?? curItem.title} fill sizes={STAGE_SIZES} className="object-cover" />
                        ) : (
                          <span className="absolute left-5 bottom-4 text-[12px] text-mute">이미지 준비 중</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </article>
            </div>
          </div>
        </div>

        {/* 모바일/태블릿: 읽는 목록 — 카테고리별 아코디언(+ 토글), 격자(개별 상품 6종)는 기본 닫힘 */}
        <div className="mt-10 lg:hidden">
          {data.categories.map((c) => {
            const open = openCats[c.label];
            return (
              <div key={c.label} className="mt-10 first:mt-0">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenCats((s) => ({ ...s, [c.label]: !s[c.label] }))}
                  className="w-full flex items-center justify-between gap-3 pb-4 border-b-2 border-ink text-left"
                >
                  <h3 className="text-[20px] font-bold tracking-[-0.4px] text-ink">{c.label}</h3>
                  <span aria-hidden="true" className={`shrink-0 text-[22px] font-light leading-none transition-transform duration-300 ${open ? "rotate-45 text-primary" : "text-mute"}`}>+</span>
                </button>
                <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                  <ul className="overflow-hidden">
                    {c.items.map((it) => (
                      <li key={it.title} className={`relative py-6 border-b border-hairline ${it.icon_url ? "pr-20" : ""}`}>
                        {it.icon_url && (
                          <span aria-hidden="true" className="absolute top-5 right-0 w-16 h-16 pointer-events-none select-none"><Image src={it.icon_url} alt="" fill sizes="64px" className="object-contain" /></span>
                        )}
                        {it.tag && <p className="t-eyebrow text-primary">{it.tag}</p>}
                        <p className="text-[22px] font-extrabold tracking-[-0.6px] text-ink mt-1">{it.title}</p>
                        {it.subtitle && <p className="t-body text-mute mt-1">{it.subtitle}</p>}
                        <p className="t-body-lg text-body mt-3 [word-break:keep-all]">{rich(it.body)}</p>
                        {it.data_card ? (
                          <div className="mt-5 rounded-[16px] overflow-hidden bg-elevated ring-1 ring-ink/5"><CompareCard card={it.data_card} compact /></div>
                        ) : it.image_url ? (
                          <div className="relative mt-5 aspect-[16/9] rounded-[16px] overflow-hidden bg-panel">
                            <Image src={it.image_url} alt={it.image_alt ?? it.title} fill sizes="100vw" className="object-cover" />
                          </div>
                        ) : null}
                        {it.tags?.length ? (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {it.tags.map((tg) => (
                              <li key={tg} className="text-[13px] font-semibold px-3 py-1.5 rounded-full bg-primary-soft text-primary">{tg}</li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 모바일/태블릿: CTA 는 목록 아래 (PC 는 왼쪽 메뉴 아래) */}
        <div className="mt-12 text-center lg:hidden" data-reveal>
          <Link href={data.cta_href} className="btn-primary">{data.cta_label.replace(/\s*→$/, "")}</Link>
        </div>
      </div>
    </section>
  );
}
