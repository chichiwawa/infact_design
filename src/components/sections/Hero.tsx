"use client";

/**
 * 01 Hero — 2026-10-13 재설계 (reconers.com 첫 화면 구성 참고, 색은 인팩트 블루 톤 유지)
 *  - 블루 배경 위에 반투명 유리 도형(원·기울인 사각형) + 가운데 큰 마크 + 떠다니는 알약 칩(진료과·서비스 키워드)
 *  - 왼쪽 아래: 작은 문구(eyebrow, 끝에 포인트 점) + 큰 제목 2줄 / 오른쪽 아래: 설명 3줄 + 세로선
 *  - 진입 시간표: 제목 줄 마스크 → 설명 → 칩. 기본 opacity 1 이라 모션이 실패해도 보임(animationend → .is-in, rAF 폴백)
 *  - 섹션은 sticky(top 0, z 0): 다음 섹션이 위로 덮으며 올라오고(SectionRenderer 가 뒤 섹션을 z 1 로 감쌈) 덮이는 만큼 카피가 물러남(--hero-p)
 *  - 2026-10-13 배경: FACT CHECK B(검증 카드 + 커서를 따라가는 세로 스캔선). 이전 블루 리본 배경은 RibbonGlow 컴포넌트에 그대로 있고 background 로 바꿔 끼울 수 있음
 *  - 이전 버전(RibbonGlow 배경 + 통계 4개 + 버튼 2개)은 백업/01_메인히어로_이전버전_2026-10-13 에 있음. 통계·버튼 데이터(stats, cta_*)는 JSON 에 남아 있으나 지금은 그리지 않는다.
 */
import { useEffect, useRef } from "react";
import type { HeroData } from "@/lib/sections";
import FactCheckBg from "@/components/FactCheckBg";

/** 문구 안의 **구절** 을 굵게(<b>) — 색은 그대로 */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((p, i) => {
        const m = p.match(/^\*\*([^*]+)\*\*$/);
        return m ? <b key={i}>{m[1]}</b> : <span key={i}>{p}</span>;
      })}
    </>
  );
}

export default function Hero({ data, background, cursorGlow = false }: { data: HeroData; background?: React.ReactNode; cursorGlow?: boolean }) {
  const secRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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

  // 커서 블루 빛: 커서를 부드럽게 따라오는 큰 블루 광원 (RibbonGlow 의 일렁임 위에 한 겹 더)
  useEffect(() => {
    const glow = glowRef.current;
    const root = secRef.current;
    if (!glow || !root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = -9999, ty = -9999, x = tx, y = ty, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && window.scrollY < window.innerHeight;
      glow.dataset.on = inside ? "1" : "0";
      if (!inside) return;
      tx = e.clientX; ty = e.clientY - r.top;
      if (x < -9000) { x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { glow.dataset.on = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const descLines = data.tagline.split("\n");

  return (
    <section ref={secRef} className="hero sticky top-0 z-0 bg-[#0a0a0a] text-white on-dark overflow-hidden" aria-label="인팩트 소개">
      {/* 배경: 블랙+블루 리본(마우스를 따라 일렁임) + 가운데 마크 + 알약 칩 + 옅은 그레인 */}
      <div aria-hidden="true" className="hero-bg absolute inset-0">
        {background ?? <FactCheckBg variant="b" />}
        {cursorGlow && <div ref={glowRef} className="hero-cursor-glow" data-on="0" />}
        <div className="hero-grain absolute inset-0" />
      </div>

      <div className="hero-in relative h-[100svh]">
        <div className="hero-copy">
          <p className="hero-eyebrow hero-appear hero-appear--soft" style={{ "--d": ".2s" } as React.CSSProperties}><Rich text={data.eyebrow} /></p>
          <h1 className="hero-h1">
            {data.headline.map((line, i) => (
              <span key={i} className="hero-line hero-appear hero-appear--mask" style={{ "--d": `${0.32 + i * 0.14}s` } as React.CSSProperties}>
                {/* 줄 끝의 마침표는 로고처럼 시그니처 블루 점으로 */}
                {line.endsWith(".") ? <>{line.slice(0, -1)}<i className="hero-dotmark">.</i></> : line}
              </span>
            ))}
          </h1>
        </div>
        <div className="hero-desc hero-appear hero-appear--soft" style={{ "--d": ".8s" } as React.CSSProperties}>
          {data.years && (
            <div className="hero-years"><span>{data.years[0]}</span><i aria-hidden="true" /><span>{data.years[1]}</span></div>
          )}
          {descLines.map((l, i) => <span key={i} className="block"><Rich text={l} /></span>)}
        </div>
      </div>
    </section>
  );
}
