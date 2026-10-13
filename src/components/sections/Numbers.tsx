"use client";

/**
 * 02 수치로 증명하는 강점 — 가로 스크롤 (2026-10-12 변경)
 *  화면은 위치 고정(sticky), 세로 스크롤 양만큼 카드 줄이 왼쪽으로 흘러간다.
 *  구성: 제목 패널 1개 + 수치 카드 n개. 카드마다 내용에 맞는 배경(.nb-0~3 + CardArt)이 있다.
 *  스냅 지점은 패널이 화면 가운데에 온 순간(p = i/n)마다 — 세게 튕겨도 한 장씩 멈춘다.
 */
import { useEffect, useRef, useState } from "react";
import type { NumbersData } from "@/lib/sections";
import { setSnapLock, smoothScrollTo } from "@/lib/scroll";

export default function Numbers({ data }: { data: NumbersData }) {
  const ref = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const [cur, setCur] = useState(0); // 가운데 패널 번호(0 = 제목) — 페이지 표시 숫자용

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
        const last = Math.max(1, n - 1); // 카드 n장 → 이동 구간 n-1
        const step = (track.children[1] as HTMLElement).offsetLeft - (track.children[0] as HTMLElement).offsetLeft;
        track.style.transform = `translate3d(${-p * last * step}px,0,0)`;
        const active = Math.round(p * last);
        Array.from(track.children).forEach((c, i) => ((c as HTMLElement).dataset.active = i === active ? "1" : "0"));
        setCur(active);
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

  // 마우스·펜 드래그로 카드 넘기기 — 가로 이동량을 세로 스크롤 위치로 바꿔 쓴다(스크롤 위치가 곧 카드 위치).
  // 드래그 중에는 스냅을 잠시 끄고, 놓으면 가까운(방향 쪽) 카드 위치로 부드럽게 맞춘다. 터치는 가로 드래그만 여기서 받음(touch-action: pan-y).
  useEffect(() => {
    const view = viewRef.current;
    const el = ref.current;
    if (!view || !el || n < 2) return;
    let down = false, startX = 0, startY = 0, k = 1, step = 1, span = 1, startF = 0, startIdx = 0, dx = 0, id = -1;
    const root = document.documentElement;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const track = trackRef.current;
      if (!track || track.children.length < 2) return;
      const rect = el.getBoundingClientRect();
      span = el.offsetHeight - window.innerHeight;
      step = (track.children[1] as HTMLElement).offsetLeft - (track.children[0] as HTMLElement).offsetLeft;
      k = span / ((n - 1) * step);
      startX = e.clientX; startY = window.scrollY; dx = 0; id = e.pointerId;
      startF = (-rect.top / span) * (n - 1);
      startIdx = Math.round(startF);
      down = true;
      view.setPointerCapture(id);
      view.classList.add("is-dragging");
      root.classList.add("strength-drag");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      dx = e.clientX - startX;
      window.scrollTo({ top: startY - dx * k, behavior: "instant" as ScrollBehavior });
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      view.classList.remove("is-dragging");
      const moved = -dx / step;
      let idx = Math.round(startF + moved);
      if (idx === startIdx && Math.abs(moved) > 0.12) idx += moved > 0 ? 1 : -1;
      idx = Math.min(n - 1, Math.max(0, idx));
      const top = window.scrollY + el.getBoundingClientRect().top + (idx / (n - 1)) * span;
      root.classList.remove("strength-drag");
      smoothScrollTo(top);
    };
    view.addEventListener("pointerdown", onDown);
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", onUp);
    view.addEventListener("pointercancel", onUp);
    return () => {
      view.removeEventListener("pointerdown", onDown); view.removeEventListener("pointermove", onMove);
      view.removeEventListener("pointerup", onUp); view.removeEventListener("pointercancel", onUp);
      root.classList.remove("strength-drag");
    };
  }, [n]);

  // 마우스 위치(카드 안 -1~1)를 CSS 변수로 — 카드 그림이 층마다 다르게 따라 움직인다 (React 상태를 쓰지 않음)
  const onCardMove = (e: React.PointerEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".strength-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    card.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onCardLeave = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(".strength-card").forEach((c) => { c.style.setProperty("--px", "0"); c.style.setProperty("--py", "0"); });
  };

  // 이전/다음 카드 위치로 스크롤 (스크롤 위치가 곧 패널 번호)
  const go = (delta: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const span = el.offsetHeight - window.innerHeight;
    const next = Math.min(n - 1, Math.max(0, Math.round((-rect.top / span) * (n - 1)) + delta));
    smoothScrollTo(window.scrollY + rect.top + (next / Math.max(1, n - 1)) * span);
  };

  const [l, r] = splitTitle(data.intro);
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section ref={ref} className="strength text-white on-dark" aria-label="수치로 증명하는 강점">
      {/* 스크롤 멈춤 지점: 위로 나가기 · 제목(0) · 카드별 가운데 · 아래로 나가기 */}
      {snapTops(n).map((t) => (
        <div key={t} aria-hidden="true" className="snap-point" style={{ top: `${t}vh` }} />
      ))}
      <div className="strength-inner">
        <div aria-hidden="true" className="strength-bg absolute inset-0">
          <div className="strength-aurora absolute inset-0" />
          <div className="strength-grid absolute inset-0" />
        </div>

        <div className="strength-content relative h-full flex flex-col justify-center">
          {/* 왼쪽: 제목 + 페이지 이동 */}
          <div className="strength-head">
            <h2 className="tracking-[-1px] md:tracking-[-2px]">
              <span className="block font-light text-white text-[26px] md:text-[clamp(28px,2.6vw,44px)] leading-[1.3] mb-2 md:mb-3">{l.split(" ").map((w, k) => <span key={k}>{k > 0 && " "}<b className="font-extrabold">{w.slice(0, 2)}</b>{w.slice(2)}</span>)}</span>
              <span className="block font-bold text-white text-[40px] md:text-[clamp(46px,4.6vw,78px)] leading-[1.2] md:leading-[1.15] tracking-[-1.5px] md:tracking-[-3px]">{r.split(" ").map((w, k, arr) => <span key={k} className="block">{w}{k === arr.length - 1 && <i className="not-italic text-primary">.</i>}</span>)}</span>
            </h2>
            <div className="strength-pager" role="group" aria-label="강점 카드 이동">
              <button type="button" aria-label="이전" disabled={cur <= 0} onClick={() => go(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <span className="strength-pager-now">{pad(cur + 1)}</span>
              <span className="strength-pager-bar">–</span>
              <span className="strength-pager-total">{pad(n)}</span>
              <button type="button" aria-label="다음" disabled={cur >= n - 1} onClick={() => go(1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          {/* 오른쪽: 카드 줄 (왼쪽 경계에서 잘리며 흘러감) */}
          <div ref={viewRef} className="strength-viewport">
          <div ref={trackRef} className="strength-track" onPointerMove={onCardMove} onPointerLeave={onCardLeave}>
            {/* 수치 카드 */}
            {data.items.map((it, i) => (
              <article key={i} className={`strength-panel strength-card text-white nb-${i % 4}`} data-active={i === 0 ? "1" : "0"}>
                <CardArt i={i % 4} />
                <div className="relative">
                  <div className="text-[15px] md:text-[17px] font-bold tracking-[1px] text-primary">{it.label}</div>
                  <div className="text-[clamp(34px,3vw,46px)] font-extrabold leading-[1] tracking-[-1.5px] lg:tracking-[-3px] mt-3 md:mt-4">{it.value}</div>
                  <p className="t-lead text-[15px] md:text-[17px] leading-[1.55] text-white/75 mt-5 md:mt-6">
                    {it.body.map((line, j) => <span key={j} className="block">{bold(line)}</span>)}
                  </p>
                </div>
                <span className="strength-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {/* 메인 히어로의 FACT CHECK 모션: 카드가 가운데에 오면 스캔선이 훑고 CHECKING → ✓ FACT 로 확정 */}
                <span className="strength-stat" aria-hidden="true">
                  <b className="sc-pend"><i />CHECKING</b>
                  <b className="sc-done"><svg viewBox="0 0 16 16" width="1em" height="1em"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>FACT</b>
                </span>
                <i className="sc-scan" aria-hidden="true" />
                <span className="sc-bar" aria-hidden="true"><i /></span>
              </article>
            ))}
          </div>
          </div>
          <div className="strength-prog" aria-hidden="true"><span ref={barRef} /></div>
        </div>
      </div>
    </section>
  );
}

/** 카드 배경 장식 — 내용에 맞춘 움직이는 그림 (코드 애니메이션, 마우스를 따라 층마다 다르게 살짝 움직임).
 *  0 기간(숨 쉬는 동심원 + 천천히 도는 눈금) · 1 수익률(자라는 막대 + 상승선) · 2 병원 수(반짝이는 점 격자) · 3 전문팀(떠다니는 겹친 원) */
function CardArt({ i }: { i: number }) {
  const q = (v: number) => Math.round(v * 100) / 100; // 서버·브라우저 소수점 차이로 생기는 hydration 경고 방지
  return (
    <svg className="strength-art" viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      {i === 0 && (
        <g fill="none" stroke="#6f93ff">
          <g className="art-d1">
            {[40, 80, 120, 160, 200].map((rad, k) => <circle key={rad} className="art-ring" style={{ animationDelay: `${k * 0.25}s` }} cx="330" cy="250" r={rad} strokeOpacity={0.5 - k * 0.08} strokeWidth="1.5" />)}
          </g>
          <g className="art-d2 art-spin">
            {Array.from({ length: 12 }, (_, k) => {
              const a = (Math.PI * (k + 6)) / 12;
              return <line key={k} x1={q(330 + Math.cos(a) * 200)} y1={q(250 + Math.sin(a) * -200)} x2={q(330 + Math.cos(a) * 214)} y2={q(250 + Math.sin(a) * -214)} strokeOpacity="0.5" />;
            })}
          </g>
        </g>
      )}
      {i === 1 && (
        <g>
          <defs>
            <linearGradient id="nbArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#35d6ff" stopOpacity="0.45" /><stop offset="1" stopColor="#35d6ff" stopOpacity="0" /></linearGradient>
          </defs>
          <g className="art-d1">
            {[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} className="art-bar" style={{ transformOrigin: `${151 + k * 37}px 270px`, animationDelay: `${k * 0.18}s` }} x={140 + k * 37} y={270 - (40 + k * 28)} width="22" height={40 + k * 28} rx="4" fill="#35d6ff" fillOpacity={0.1 + k * 0.03} />)}
          </g>
          <g className="art-d2">
            <path d="M130 250 L180 220 L225 232 L270 170 L315 150 L360 70 L360 290 L130 290 Z" fill="url(#nbArea)" />
            <path className="art-line" pathLength={1} d="M130 250 L180 220 L225 232 L270 170 L315 150 L360 70" fill="none" stroke="#7fe6ff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            <circle className="art-pulse" style={{ transformOrigin: "360px 70px" }} cx="360" cy="70" r="7" fill="#fff" />
          </g>
        </g>
      )}
      {i === 2 && (
        <g fill="#b9a2ff" className="art-d1">
          {Array.from({ length: 8 * 14 }, (_, k) => {
            const cx = 20 + (k % 14) * 27;
            const cy = 20 + Math.floor(k / 14) * 27;
            const hot = (k * 7) % 11 === 0;
            return <circle key={k} className={hot ? "art-twinkle" : undefined} style={hot ? { animationDelay: `${(k % 7) * 0.35}s` } : undefined} cx={cx} cy={cy} r={hot ? 5 : 3} fillOpacity={hot ? 0.95 : 0.28} />;
          })}
        </g>
      )}
      {i === 3 && (
        <g fill="none" strokeWidth="1.5">
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k} className={k % 2 ? "art-d2" : "art-d1"}>
              <circle className="art-float" style={{ animationDelay: `${k * 0.5}s` }} cx={150 + k * 52} cy={190 - (k % 2) * 40} r="70" stroke={["#ff8fb8", "#ffb077", "#7fe6ff", "#9cb4ff", "#c4a6ff"][k]} strokeOpacity="0.6" fill={["#ff8fb8", "#ffb077", "#7fe6ff", "#9cb4ff", "#c4a6ff"][k]} fillOpacity="0.08" />
            </g>
          ))}
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
 *  위로 나가기(-100 = 히어로) · 카드 i 가 왼쪽 시작 위치에 오는 지점(i/(n-1)) · 아래로 나가기(520 = 다음 섹션이 화면 맨 위) */
function snapTops(n: number): number[] {
  return [-100, ...Array.from({ length: n }, (_, i) => Math.round((i * 420) / Math.max(1, n - 1))), 520];
}

function splitTitle(s: string): [string, string] {
  const clean = s.replace(/[「」*]/g, "").trim();
  const words = clean.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
