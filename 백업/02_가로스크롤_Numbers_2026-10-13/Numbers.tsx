"use client";

/**
 * 02 수치로 증명하는 강점 — 가로 스크롤 (2026-10-12 변경)
 *  화면은 위치 고정(sticky), 세로 스크롤 양만큼 카드 줄이 왼쪽으로 흘러간다.
 *  구성: 제목 패널 1개 + 수치 카드 n개. 카드마다 내용에 맞는 배경(.nb-0~3 + CardArt)이 있다.
 *  스냅 지점은 패널이 화면 가운데에 온 순간(p = i/n)마다 — 세게 튕겨도 한 장씩 멈춘다.
 */
import { useEffect, useRef } from "react";
import type { NumbersData } from "@/lib/sections";
import { setSnapLock } from "@/lib/scroll";

export default function Numbers({ data }: { data: NumbersData }) {
  const ref = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

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
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (veilRef.current) veilRef.current.style.opacity = String(0.25 + p * 0.4);
      // 진입 덮기: 섹션 상단이 화면 아래에서 위까지 올라오는 동안 배경 0→1 (히어로가 비치다 서서히 덮임)
      el.style.setProperty("--cover", String(Math.min(1, Math.max(0, (vh - rect.top) / vh))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); setSnapLock("numbers", false); };
  }, [n]);

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
          <div ref={veilRef} className="absolute inset-0 bg-night" style={{ opacity: 0.25 }} />
        </div>

        <div className="strength-content relative h-full flex flex-col justify-center">
          <div ref={trackRef} className="strength-track">
            {/* 제목 패널 */}
            <div className="strength-panel strength-title" data-active="1">
              <h2 className="text-[34px] md:text-[clamp(48px,5.5vw,80px)] leading-[1.15] md:leading-[1.1] tracking-[-1px] md:tracking-[-2.8px]">
                <span className="block font-extrabold text-white">{l}</span>
                <span className="block font-extrabold accent">{r}</span>
              </h2>
              <p className="mt-6 md:mt-8 text-[14px] md:text-[18px] text-white/60">옆으로 이어지는 {n}가지 숫자를 확인하세요 →</p>
            </div>
            {/* 수치 카드 */}
            {data.items.map((it, i) => (
              <article key={i} className={`strength-panel strength-card nb-${i % 4}`} data-active="0">
                <CardArt i={i % 4} />
                <div className="relative">
                  <div className="text-[15px] md:text-[18px] font-bold tracking-[1px] text-primary">{it.label}</div>
                  <div className="text-[clamp(40px,6vw,88px)] font-extrabold leading-[1] tracking-[-1.5px] lg:tracking-[-3px] mt-4 md:mt-5">{it.value}</div>
                  <p className="t-lead md:text-[21px] text-white/75 mt-6 md:mt-8">
                    {it.body.map((line, j) => <span key={j} className="block">{bold(line)}</span>)}
                  </p>
                </div>
                <span className="strength-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              </article>
            ))}
          </div>
          <div className="strength-prog" aria-hidden="true"><span ref={barRef} /></div>
        </div>
      </div>
    </section>
  );
}

/** 카드 배경 장식 — 내용에 맞춘 그림. 0 기간(동심원) · 1 수익률(상승 그래프) · 2 병원 수(점 격자) · 3 전문팀(겹친 원) */
function CardArt({ i }: { i: number }) {
  return (
    <svg className="strength-art" viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      {i === 0 && (
        <g fill="none" stroke="#6f93ff">
          {[40, 80, 120, 160, 200].map((rad, k) => <circle key={rad} cx="330" cy="250" r={rad} strokeOpacity={0.5 - k * 0.08} strokeWidth="1.5" />)}
          {Array.from({ length: 12 }, (_, k) => {
            const a = (Math.PI * (k + 6)) / 12;
            return <line key={k} x1={330 + Math.cos(a) * 200} y1={250 + Math.sin(a) * -200} x2={330 + Math.cos(a) * 214} y2={250 + Math.sin(a) * -214} strokeOpacity="0.5" />;
          })}
        </g>
      )}
      {i === 1 && (
        <g>
          <defs>
            <linearGradient id="nbArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#35d6ff" stopOpacity="0.45" /><stop offset="1" stopColor="#35d6ff" stopOpacity="0" /></linearGradient>
          </defs>
          {[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} x={140 + k * 37} y={270 - (40 + k * 28)} width="22" height={40 + k * 28} rx="4" fill="#35d6ff" fillOpacity={0.1 + k * 0.03} />)}
          <path d="M130 250 L180 220 L225 232 L270 170 L315 150 L360 70 L360 290 L130 290 Z" fill="url(#nbArea)" />
          <path d="M130 250 L180 220 L225 232 L270 170 L315 150 L360 70" fill="none" stroke="#7fe6ff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="360" cy="70" r="7" fill="#fff" />
        </g>
      )}
      {i === 2 && (
        <g fill="#b9a2ff">
          {Array.from({ length: 8 * 14 }, (_, k) => {
            const cx = 20 + (k % 14) * 27;
            const cy = 20 + Math.floor(k / 14) * 27;
            const hot = (k * 7) % 11 === 0;
            return <circle key={k} cx={cx} cy={cy} r={hot ? 5 : 3} fillOpacity={hot ? 0.95 : 0.28} />;
          })}
        </g>
      )}
      {i === 3 && (
        <g fill="none" strokeWidth="1.5">
          {[0, 1, 2, 3, 4].map((k) => <circle key={k} cx={150 + k * 52} cy={190 - (k % 2) * 40} r="70" stroke={["#ff8fb8", "#ffb077", "#7fe6ff", "#9cb4ff", "#c4a6ff"][k]} strokeOpacity="0.6" fill={["#ff8fb8", "#ffb077", "#7fe6ff", "#9cb4ff", "#c4a6ff"][k]} fillOpacity="0.08" />)}
        </g>
      )}
    </svg>
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
