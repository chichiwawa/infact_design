"use client";

/**
 * 01 Hero — 2026-10-13 재설계 (reconers.com 첫 화면 구성 참고, 색은 인팩트 블루 톤 유지)
 *  - 블루 배경 위에 반투명 유리 도형(원·기울인 사각형) + 가운데 큰 마크 + 떠다니는 알약 칩(진료과·서비스 키워드)
 *  - 왼쪽 아래: 작은 문구(eyebrow, 끝에 포인트 점) + 큰 제목 2줄 / 오른쪽 아래: 설명 3줄 + 세로선
 *  - 진입 시간표: 제목 줄 마스크 → 설명 → 칩. 기본 opacity 1 이라 모션이 실패해도 보임(animationend → .is-in, rAF 폴백)
 *  - 섹션은 sticky(top 0, z 0): 다음 섹션이 위로 덮으며 올라오고(SectionRenderer 가 뒤 섹션을 z 1 로 감쌈) 덮이는 만큼 카피가 물러남(--hero-p)
 *  - 이전 버전(RibbonGlow 배경 + 통계 4개 + 버튼 2개)은 백업/01_메인히어로_이전버전_2026-10-13 에 있음. 통계·버튼 데이터(stats, cta_*)는 JSON 에 남아 있으나 지금은 그리지 않는다.
 */
import { useEffect, useRef } from "react";
import type { HeroData } from "@/lib/sections";
import RibbonGlow from "@/components/RibbonGlow";

const DEFAULT_CHIPS: NonNullable<HeroData["chips"]> = [
  { label: "성형외과", tone: "dark" },
  { label: "피부과", tone: "light" },
  { label: "퍼포먼스 광고", tone: "plus" },
  { label: "브랜딩", tone: "white" },
];

export default function Hero({ data }: { data: HeroData }) {
  const secRef = useRef<HTMLElement>(null);

  // 진입 모션: 끝난 요소는 .is-in 으로 고정, 애니메이션이 안 돌면(차단·구형) 두 프레임 뒤 전부 표시
  useEffect(() => {
    const root = secRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".hero-appear"));
    const done = (e: Event) => (e.currentTarget as HTMLElement).classList.add("is-in");
    els.forEach((el) => el.addEventListener("animationend", done, { once: true }));
    const id = requestAnimationFrame(() => requestAnimationFrame(() => {
      const running = typeof root.getAnimations === "function" && root.getAnimations({ subtree: true }).some((a) => a.playState === "running" || a.playState === "finished");
      if (!running) els.forEach((el) => el.classList.add("is-in"));
    }));
    return () => { cancelAnimationFrame(id); els.forEach((el) => el.removeEventListener("animationend", done)); };
  }, []);

  // 덮이는 만큼 물러남: 다음 섹션이 한 화면 올라오는 동안 --hero-p 0→1
  useEffect(() => {
    const root = secRef.current;
    if (!root) return;
    let raf = 0;
    const update = () => { raf = 0; root.style.setProperty("--hero-p", String(Math.min(1, Math.max(0, window.scrollY / window.innerHeight)))); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const chips = data.chips?.length ? data.chips : DEFAULT_CHIPS;
  const descLines = data.tagline.split("\n");

  return (
    <section ref={secRef} className="hero sticky top-0 z-0 bg-[#0a0a0a] text-white on-dark overflow-hidden" aria-label="인팩트 소개">
      {/* 배경: 블랙+블루 리본(마우스를 따라 일렁임) + 가운데 마크 + 알약 칩 + 옅은 그레인 */}
      <div aria-hidden="true" className="hero-bg absolute inset-0">
        <RibbonGlow background="#0a0a0a" hover={140} reach={320} />
        <svg className="hero-mark" viewBox="0 0 200 200">
          <path className="hero-mark-main" d="M70 20h60v50h50v60h-50v50H70v-50H20V70h50z" />
          <path className="hero-mark-ghost" d="M130 20l50 50v60l-50-50z" />
        </svg>
        <span className="hero-dot" />
        {chips.map((c, i) => (
          <span key={i} className={`hero-chip hero-chip--${i + 1} hero-chip--${c.tone ?? "dark"} hero-appear hero-appear--soft`} style={{ "--d": `${0.5 + i * 0.15}s` } as React.CSSProperties}>
            <span className="hero-chip-in">
              {c.tone === "plus" && <i className="hero-chip-plus">+</i>}
              {c.label}
            </span>
          </span>
        ))}
        <div className="hero-grain absolute inset-0" />
      </div>

      <div className="hero-in relative h-[100svh]">
        <div className="hero-copy">
          <p className="hero-eyebrow hero-appear hero-appear--soft" style={{ "--d": ".2s" } as React.CSSProperties}>{data.eyebrow}<b aria-hidden="true">.</b></p>
          <h1 className="hero-h1">
            {data.headline.map((line, i) => (
              <span key={i} className="hero-line hero-appear hero-appear--mask" style={{ "--d": `${0.32 + i * 0.14}s` } as React.CSSProperties}>{line}</span>
            ))}
          </h1>
        </div>
        <div className="hero-desc hero-appear hero-appear--soft" style={{ "--d": ".8s" } as React.CSSProperties}>
          {descLines.map((l, i) => <span key={i} className="block">{l}</span>)}
        </div>
      </div>
    </section>
  );
}
