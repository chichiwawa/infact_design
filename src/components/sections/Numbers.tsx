"use client";

/**
 * 02 수치로 증명하는 강점 — 가로 스크롤 페이지
 *  화면은 위치 고정(sticky), 세로 스크롤 양만큼 패널 줄이 왼쪽으로 흘러간다. 가운데 패널만 꽉 찬 글자 + 문구, 양옆은 은은한 흐린 글자.
 *  구성: 제목 패널 1개 + 수치 패널 n개. 패널마다 메인 히어로와 같은 블루 톤 배경 + 내용에 맞는 그래픽(Scene: 링·그래프·점 격자·겹친 원)이 있고 패널이 바뀔 때 크로스페이드.
 *  자동 넘김: 고정 구간 안에서 사용자 입력이 멈추면 AUTO_MS 마다 다음 패널로 스크롤(마지막에서 멈춤 — 되감지 않음).
 *  스냅 지점은 패널이 화면 가운데에 온 순간(p = i/n)마다 — 세게 튕겨도 한 장씩 멈춘다.
 */
import { useEffect, useRef, useState } from "react";
import type { NumbersData } from "@/lib/sections";
import { setSnapLock, smoothScrollTo } from "@/lib/scroll";

const AUTO_MS = 3500;   // 자동 넘김 간격
const IDLE_MS = 4000;   // 사용자가 휠·터치·키를 만진 뒤 자동 넘김을 쉬는 시간

export default function Numbers({ data }: { data: NumbersData }) {
  const ref = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [cur, setCur] = useState(0); // 가운데 패널 번호(0 = 제목) — 배경 이미지 전환용 (섹션 className 이 아니라 data-* 로만 씀)

  const n = data.items.length;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = el.offsetHeight - vh;
      // 고정 구간 안에서만 단계별 멈춤(스냅) 켬 — 밖에서는 평소 스크롤
      // 고정이 풀린 뒤 다음 섹션(03)이 올라오는 한 화면(span~span+vh)까지 포함 — 빠지면 그 사이에 어중간하게 멈춤.
      // 끝(= 나가기 지점 520vh)에 정확히 닿으면 끔: 모바일은 03 스냅 지점이 없어서 켜진 채면 아래로 갈 곳이 없어 갇힘
      setSnapLock("numbers", rect.top <= 1 && -rect.top < span + vh - 1);
      // 화면 밖이면 건너뜀 — MarketingTabs.tsx(04)와 같은 이유(2026-09-18 pitfall)
      if (rect.bottom < 0 || rect.top > vh) return;
      const p = Math.min(1, Math.max(0, -rect.top / span));
      const track = trackRef.current;
      if (track && track.children.length > 1) {
        const step = (track.children[1] as HTMLElement).offsetLeft - (track.children[0] as HTMLElement).offsetLeft;
        track.style.transform = `translate3d(${-p * n * step}px,0,0)`;
        const active = Math.round(p * n);
        Array.from(track.children).forEach((c, i) => ((c as HTMLElement).dataset.active = i === active ? "1" : "0"));
        setCur(active);
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      // 진입 덮기: 섹션 상단이 화면 아래에서 위까지 올라오는 동안 배경 0→1 (히어로가 비치다 서서히 덮임)
      el.style.setProperty("--cover", String(Math.min(1, Math.max(0, (vh - rect.top) / vh))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); setSnapLock("numbers", false); };
  }, [n]);

  // 자동 넘김 — 고정 구간 안에서만, 사용자 입력이 IDLE_MS 동안 없을 때 AUTO_MS 마다 다음 패널 위치로 스크롤
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastInput = 0;
    let lastAuto = Date.now();
    const touch = () => { lastInput = Date.now(); };
    const evs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    evs.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (document.hidden || now - lastInput < IDLE_MS || now - lastAuto < AUTO_MS) return;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      if (rect.top > 1 || -rect.top >= span - 1) return; // 고정 구간 밖 / 마지막 패널이면 쉼
      const next = Math.round((-rect.top / span) * n) + 1;
      if (next > n) return;
      lastAuto = now;
      smoothScrollTo(window.scrollY + rect.top + (next / n) * span);
    }, 500);
    return () => { evs.forEach((e) => window.removeEventListener(e, touch)); window.clearInterval(timer); };
  }, [n]);

  // 좌우 화살표 — 이전/다음 패널 위치로 스크롤 (스크롤 위치가 곧 패널 번호라 다른 동작과 항상 맞는다)
  const go = (delta: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const span = el.offsetHeight - window.innerHeight;
    const next = Math.min(n, Math.max(0, Math.round((-rect.top / span) * n) + delta));
    smoothScrollTo(window.scrollY + rect.top + (next / n) * span);
  };

  const [l, r] = splitTitle(data.intro);

  return (
    <section ref={ref} className="strength text-white on-dark" aria-label="수치로 증명하는 강점">
      {/* 스크롤 멈춤 지점: 위로 나가기 · 제목(0) · 카드별 가운데 · 아래로 나가기 */}
      {snapTops(n).map((t) => (
        <div key={t} aria-hidden="true" className="snap-point" style={{ top: `${t}vh` }} />
      ))}
      <div className="strength-inner">
        <div aria-hidden="true" className="strength-bg absolute inset-0 bg-night">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_110%,rgba(48,97,255,0.7)_0%,rgba(48,97,255,0.15)_40%,#0a0a0a_75%)]" />
          {/* 패널별 배경 그래픽 — 가운데 패널과 같은 번호만 보임 (0 = 제목, 1~n = 수치 카드) */}
          {Array.from({ length: n + 1 }, (_, i) => <Scene key={i} i={i} on={i === cur} />)}
          <div ref={veilRef} className="absolute inset-0 bg-night" style={{ opacity: 0.2 }} />
        </div>

        <div className="strength-content relative h-full flex flex-col justify-center">
          <div ref={trackRef} className="strength-track">
            {/* 제목 패널 */}
            <div className="strength-panel strength-title" data-active="1">
              <h2 className="text-[34px] md:text-[clamp(48px,5.5vw,75px)] leading-[1.15] md:leading-[1.1] tracking-[-1px] md:tracking-[-2.8px]">
                <span className="block font-extrabold text-white">{l}</span>
                <span className="block font-extrabold accent">{r}</span>
              </h2>
             
            </div>
            {/* 수치 카드 */}
            {data.items.map((it, i) => (
              <article key={i} className="strength-panel strength-card" data-active="0">
                <div className="strength-label text-[18px] md:text-[24px] font-bold tracking-[1px] text-primary">{it.label}</div>
                <div className="strength-value font-extrabold leading-[1] tracking-[-1.5px] lg:tracking-[-3px]">{it.value}</div>
                <p className="strength-body t-lead md:text-[21px] text-white/80">
                  {it.body.map((line, j) => <span key={j} className="block">{bold(line)}</span>)}
                </p>
              </article>
            ))}
          </div>
          <button type="button" className="strength-arrow strength-arrow-prev" aria-label="이전" disabled={cur <= 0} onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="strength-arrow strength-arrow-next" aria-label="다음" disabled={cur >= n} onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="strength-prog" aria-hidden="true"><span ref={barRef} /></div>
        </div>
      </div>
    </section>
  );
}

/** 패널 배경 그래픽 (블루 톤, 코드로 그림) — 0 제목(리본 호) · 1 기간(시계 링) · 2 수익률(막대+상승선) · 3 병원 수(점 격자) · 4 전문팀(겹친 원). 5번째부터는 순환 */
function Scene({ i, on }: { i: number; on: boolean }) {
  const k = i % 5;
  const glow = [["72%", "30%"], ["78%", "62%"], ["62%", "78%"], ["50%", "55%"], ["28%", "60%"]][k];
  return (
    <div className="strength-scene" data-on={on ? "1" : "0"} aria-hidden="true" style={{ ["--gx" as string]: glow[0], ["--gy" as string]: glow[1] }}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`scArea${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4d7bff" stopOpacity="0.5" /><stop offset="1" stopColor="#4d7bff" stopOpacity="0" /></linearGradient>
        </defs>
        {k === 0 && (
          <g fill="none" stroke="#6f93ff">
            {[0, 1, 2, 3, 4, 5].map((r) => <ellipse key={r} cx="1180" cy="1000" rx={420 + r * 110} ry={560 + r * 80} strokeOpacity={0.5 - r * 0.07} strokeWidth="1.5" />)}
          </g>
        )}
        {k === 1 && (
          <g fill="none" stroke="#6f93ff">
            {[120, 220, 320, 420, 520, 620].map((r, j) => <circle key={r} cx="1120" cy="620" r={r} strokeOpacity={0.55 - j * 0.07} strokeWidth="1.5" />)}
            {Array.from({ length: 48 }, (_, j) => {
              const a = (Math.PI * 2 * j) / 48;
              const r2 = j % 4 === 0 ? 660 : 640;
              const p = (v: number) => Math.round(v); // 서버·브라우저의 소수점 계산 차이로 생기는 hydration 경고 방지
              return <line key={j} x1={p(1120 + Math.cos(a) * 620)} y1={p(620 + Math.sin(a) * 620)} x2={p(1120 + Math.cos(a) * r2)} y2={p(620 + Math.sin(a) * r2)} strokeOpacity="0.5" />;
            })}
            <line x1="1120" y1="620" x2="1120" y2="260" stroke="#9cb4ff" strokeWidth="3" strokeLinecap="round" />
            <line x1="1120" y1="620" x2="1340" y2="700" stroke="#9cb4ff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="1120" cy="620" r="9" fill="#fff" stroke="none" />
          </g>
        )}
        {k === 2 && (
          <g>
            {[0, 1, 2, 3, 4].map((r) => <line key={r} x1="0" x2="1440" y1={300 + r * 120} y2={300 + r * 120} stroke="#6f93ff" strokeOpacity="0.12" />)}
            {Array.from({ length: 14 }, (_, j) => <rect key={j} x={120 + j * 92} y={820 - (80 + j * 34)} width="52" height={80 + j * 34} rx="8" fill="#4d7bff" fillOpacity={0.1 + j * 0.016} />)}
            <path d="M120 760 L304 700 L488 720 L672 600 L856 560 L1040 400 L1224 330 L1360 190 L1360 880 L120 880 Z" fill={`url(#scArea${k})`} />
            <path d="M120 760 L304 700 L488 720 L672 600 L856 560 L1040 400 L1224 330 L1360 190" fill="none" stroke="#8fb0ff" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="1360" cy="190" r="11" fill="#fff" />
          </g>
        )}
        {k === 3 && (
          <g fill="#7f9fff">
            {Array.from({ length: 12 * 22 }, (_, j) => {
              const hot = (j * 7) % 13 === 0;
              return <circle key={j} cx={60 + (j % 22) * 63} cy={110 + Math.floor(j / 22) * 66} r={hot ? 7 : 3.5} fillOpacity={hot ? 0.9 : 0.25} />;
            })}
          </g>
        )}
        {k === 4 && (
          <g fill="none" strokeWidth="2">
            {[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={420 + j * 150} cy={470 - (j % 2) * 90} r="240" stroke={["#35d6ff", "#6f93ff", "#4d7bff", "#9cb4ff", "#6fb7ff"][j]} strokeOpacity="0.5" fill={["#35d6ff", "#6f93ff", "#4d7bff", "#9cb4ff", "#6fb7ff"][j]} fillOpacity="0.07" />)}
          </g>
        )}
      </svg>
    </div>
  );
}

/** "**구절**" → <strong>(흰색·Bold), "\n" → 모바일 전용 줄바꿈(<br className="md:hidden" />, PC는 한 줄로 이어짐) */
function bold(line: string) {
  const lines = line.split("\n");
  return lines.flatMap((l, i) => {
    const nodes = l.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
      part.startsWith("**") ? <strong key={`${i}-${j}`} className="font-bold text-white">{part.slice(2, -2)}</strong> : part,
    );
    return i < lines.length - 1 ? [...nodes, <br key={`br-${i}`} className="md:hidden" />] : nodes;
  });
}

/** 스냅 지점(섹션 상단 기준 vh, 고정 구간 420vh = globals.css .strength 520vh − 100vh):
 *  위로 나가기(-100 = 히어로) · 제목(0) · 카드 i 가 가운데에 오는 지점(i/n) · 아래로 나가기(520 = 다음 섹션이 화면 맨 위) */
function snapTops(n: number): number[] {
  return [-100, ...Array.from({ length: n + 1 }, (_, i) => Math.round((i * 420) / n)), 520];
}

function splitTitle(s: string): [string, string] {
  const clean = s.replace(/[「」*]/g, "").trim();
  const words = clean.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
