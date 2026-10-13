"use client";

/**
 * 01 Hero — 2026-09-16 재설계 (design/demos/hero-vesper.html 시안 이식, 사용자 확정)
 *  - 100svh 한 화면, 카피 블록은 아래쪽(flex-end)에 앉고 맨 아래 통계 4개를 가로 한 줄로 펼침 → 위 2/3 는 영상·이미지 자리
 *  - 제목 2줄: 첫 줄(가는 굵기) / 나머지 줄을 한 줄로(강조 줄은 블루 ExtraBold, 뒤는 흰색 SemiBold) + 영문 태그라인(이탤릭·회색)
 *  - 진입 시간표: 제목 줄 마스크 0.32/0.46s → 태그라인 0.7s → 버튼 0.86/0.98s → 통계 1.04~1.34s. 기본 opacity 1 이라 모션이 실패해도 보임(animationend → .is-in, rAF 폴백)
 *  - 섹션은 sticky(top 0, z 0): 다음 섹션이 위로 덮으며 올라오고(SectionRenderer 가 뒤 섹션을 z 1 로 감쌈) 덮이는 만큼 카피가 물러남(--hero-p)
 *  - 크기 토큰·높이 기준 반응형은 globals.css .hero 블록. 포스터/영상 슬롯 유지(데스크탑에서 <source> 지연 주입)
 *  2026-09-16: 포스터·영상이 없을 때의 배경(기존 고정 라디얼 그라디언트) → PrismGradient(WebGL 셰이더, design/demos/hero-prism.html 시안 확정)로 교체.
 *   실제 영상이 들어오면(poster_url/video_mp4) 기존처럼 그쪽이 우선 노출됨 — 배경은 "에셋 없을 때"만 보임.
 *  2026-09-18: PrismGradient → ParticleDrift(Originkit WebGL 파티클 네트워크, /demo/particle-drift 시안 확정, 사용자 프리셋 조정 반영)로 교체.
 *  2026-09-22: ParticleDrift → RibbonGlow(Originkit WebGL2 리본 글로우, /demo/ribbon-glow 시안 확정)로 교체. ParticleDrift.tsx 는 미사용으로 남김.
 *  2026-09-18(2): 강조 문구("오직 병원 마케팅만")에 ShinyPill(Originkit, /demo/shiny-pill 시안 확정) 좌우 반짝임 효과 추가.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroData, Stat } from "@/lib/sections";
import RibbonGlow from "@/components/RibbonGlow";
import ShinyPill from "@/components/ShinyPill";

function CountUp({ stat, run }: { stat: Stat; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const dur = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(stat.value * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, stat.value]);
  const [unit, tail] = splitSuffix(stat.suffix ?? "");
  return (
    <span className="hero-stat-v">{n.toFixed(stat.decimals ?? 0)}<sup>{unit}{tail}</sup></span>
  );
}
/** "개월+" → ["개월", "+"], "%" → ["", "%"], "곳+" → ["곳", "+"] */
function splitSuffix(s: string): [string, string] {
  const m = s.match(/^(.*?)([+~%]+)$/);
  return m ? [m[1], m[2]] : [s, ""];
}

export default function Hero({ data }: { data: HeroData }) {
  const secRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [run, setRun] = useState(false);

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
    const t = window.setTimeout(() => setRun(true), 1000); // 통계 카운트업은 통계가 나타날 때
    return () => { cancelAnimationFrame(id); clearTimeout(t); els.forEach((el) => el.removeEventListener("animationend", done)); };
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

  useEffect(() => {
    const v = videoRef.current;
    if (!v || (!data.video_webm && !data.video_mp4)) return;
    if (window.matchMedia("(max-width: 767px)").matches) return; // 모바일 제외 (실측)
    const add = (src: string, type: string) => { const s = document.createElement("source"); s.src = src; s.type = type; v.appendChild(s); };
    if (data.video_webm) add(data.video_webm, "video/webm");
    if (data.video_mp4) add(data.video_mp4, "video/mp4");
    const onReady = () => { v.play().then(() => v.classList.add("loaded")).catch(() => {}); };
    v.addEventListener("canplaythrough", onReady, { once: true });
    v.load();
    return () => v.removeEventListener("canplaythrough", onReady);
  }, [data.video_webm, data.video_mp4]);

  const hasVideo = Boolean(data.video_webm || data.video_mp4);
  const accentLine = data.accent_line ?? -1;
  const [first, ...rest] = data.headline;

  return (
    <section ref={secRef} className="hero sticky top-0 z-0 bg-night text-white on-dark overflow-hidden" aria-label="인팩트 소개">
      {/* 배경: 포스터/영상 (없으면 오른쪽 위 블루 빛) + 아래로 갈수록 어두운 스크림 + 옅은 그레인 */}
      <div aria-hidden="true" className="hero-bg absolute inset-0">
        {data.poster_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.poster_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <RibbonGlow background="#0a0a0a" />
        )}
        {hasVideo && (
          <video ref={videoRef} className="hero-video-bg absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline preload="none" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.7)_100%)]" />
        <div className="hero-grain absolute inset-0" />
      </div>

      {/* container-x 는 카피 블록에만: 통계(.hero-stats)는 자체 --hero-stats-x 여백으로 더 넓게(데모 hero-prism.html 과 동일, 2026-09-16).
          2026-09-28 사용자 요청으로 카피 블록 하단 가운데 → PC(md~)만 세로 가운데·좌측 정렬(pt-20 = 헤더 높이 보정, 왼쪽 끝은 로고 선). 모바일은 원래대로 하단 가운데 */}
      <div className="hero-in relative h-[100svh] flex flex-col">
        <div className="container-x flex-1 flex flex-col items-center justify-end text-center md:items-start md:justify-center md:text-left md:pt-20 pb-[var(--hero-gap)]">
          <h1 className="hero-h1">
            <span className="hero-line hero-appear hero-appear--mask" style={{ "--d": ".32s" } as React.CSSProperties}>{first}</span>
            <span className="hero-line hero-line--2 hero-appear hero-appear--mask" style={{ "--d": ".46s" } as React.CSSProperties}>
              {rest.map((line, i) =>
                i + 1 === accentLine ? (
                  <span key={i} className="hero-em">
                    <ShinyPill text={line} textColor="var(--color-primary)" font={{}} />
                    {i < rest.length - 1 ? " " : ""}
                  </span>
                ) : (
                  <span key={i}>{line}{i < rest.length - 1 ? " " : ""}</span>
                ),
              )}
            </span>
          </h1>
          <p className="hero-tag hero-appear hero-appear--soft" style={{ "--d": ".7s", animationDuration: "1.25s" } as React.CSSProperties}>{data.tagline}</p>
          <div className="hero-actions">
            <Link href={data.cta_href} className="hero-btn hero-btn-solid hero-appear hero-appear--btn" style={{ "--d": ".86s" } as React.CSSProperties}>
              {data.cta_label}
              <i aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M8 7h9v9" /></svg></i>
            </Link>
            {data.cta2_label && data.cta2_href && (
              <Link href={data.cta2_href} className="hero-btn hero-btn-ghost hero-appear hero-appear--side" style={{ "--d": ".98s" } as React.CSSProperties}>{data.cta2_label}</Link>
            )}
          </div>
        </div>

        <div className="hero-stats" aria-label="핵심 지표">
          {data.stats.map((s, i) => (
            <div key={i} className="hero-stat hero-appear hero-appear--stat" style={{ "--d": `${1.04 + i * 0.1}s` } as React.CSSProperties}>
              <CountUp stat={s} run={run} />
              <span className="hero-stat-l hero-stat-l-full">{s.label}</span>
              <span className="hero-stat-l hero-stat-l-short">{s.label_m ?? s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
