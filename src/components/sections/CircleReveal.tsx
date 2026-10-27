"use client";
/**
 * 히어로 아래 "문구 — 동그라미 — 문구" 섹션 (2026-10-27, btsoft.kr/btsoft/about 레퍼런스) + 진행 프로세스.
 * 한 개의 긴 구간 안에서 안쪽 화면이 sticky 로 붙어 있고, 스크롤 진행도가 두 단계로 나뉜다.
 *  1) 동그라미가 커진다(--cr-p 0→1): 양옆 문구는 밀려나고, 동그라미가 화면을 채우는 동안 그 위로 프로세스 제목이 떠오른다.
 *     제목이 먼저 보이고(--cr-p), 제목이 선명해지면 단계 줄이 떠오른다(--cr-s).
 *  2) 단계 줄이 왼쪽으로 흐른다(가로 스크롤): 문의 → 진단 → 설계 → 실행 → 관리. 지난 단계는 점등(data-on, className 은 Motion.tsx 가 건드리므로 쓰지 않음).
 * 비율 계산은 화면 px, 길이 계산은 CSS px(html zoom 보정: zoomInv).
 */
import { useEffect, useRef, useState } from "react";
import Accent from "@/components/Accent";
import type { CircleRevealData } from "@/lib/sections";
import { zoomInv } from "@/lib/zoom";

const GROW = 1.3; // 동그라미가 커지는 구간 길이(화면 높이 배수)
const SHOW = 0.6; // 제목이 선명해진 뒤 단계 줄이 떠오르는 구간(화면 높이 배수)
const PER_STEP = 0.7; // 단계 하나를 지나는 데 쓰는 스크롤(화면 높이 배수)

/** variant: 생략 = 기본(검은 동그라미) / a 로고 블루 점 / b 스캔 → 체크 검증 / c FACT 도장 + 물결 */
export default function CircleReveal({ data, variant }: { data: CircleRevealData; variant?: "a" | "b" | "c" }) {
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const steps = data.process?.steps ?? [];
  const n = steps.length;
  const [on, setOn] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = secRef.current;
    if (!root) return;
    const track = trackRef.current;
    let raf = 0, last = -1;
    const update = () => {
      raf = 0;
      const H = window.innerHeight;
      const r = root.getBoundingClientRect();
      const scrolled = -r.top;
      const span = r.height - H;
      const p = Math.min(1, Math.max(0, scrolled / (GROW * H)));
      root.style.setProperty("--cr-p", p.toFixed(4));
      setDark(p >= 0.85 && r.bottom > 84 / zoomInv()); // 동그라미가 화면을 채워 배경이 어두워진 뒤에만 헤더를 흰 글씨로
      if (!track) return;
      root.style.setProperty("--cr-s", Math.min(1, Math.max(0, (scrolled - GROW * H) / (SHOW * H))).toFixed(4));
      const hp = Math.min(1, Math.max(0, (scrolled - (GROW + SHOW) * H) / Math.max(1, span - (GROW + SHOW) * H)));
      const max = Math.max(0, track.scrollWidth - window.innerWidth * zoomInv());
      track.style.transform = `translate3d(${(-hp * max).toFixed(1)}px,0,0)`;
      let lit = 0;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const b = c.getBoundingClientRect();
        if (b.left + b.width / 2 < window.innerWidth * 0.62 || (i === n - 1 && hp > 0.97)) lit = i;
      });
      if (lit !== last) { last = lit; setOn(lit); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  const height = n ? `calc(100dvh*var(--zi)*${(GROW + SHOW + 1 + n * PER_STEP).toFixed(2)})` : undefined;

  return (
    <section ref={secRef} className={dark ? "cr on-dark" : "cr"} data-v={variant} style={{ height }} aria-label={`${data.left} ${data.right}`}>
      <div className="cr-stage">
        <p className="cr-text cr-text--l">{data.left}</p>
        {variant === "c" && <div className="cr-rings" aria-hidden="true"><i /><i /><i /></div>}
        <div className="cr-circle" aria-hidden="true">
          <i className="cr-ribbon" />
          {variant === "b" && (
            <>
              <i className="cr-blue" />
              <i className="cr-scan" />
              <svg className="cr-check" viewBox="0 0 100 100" fill="none"><path d="M26 52 L43 69 L76 33" pathLength={1} /></svg>
            </>
          )}
          {variant === "c" && <span className="cr-fact">FACT<b>✓</b></span>}
        </div>
        <p className="cr-text cr-text--r">{data.right}</p>

        {n > 0 && (
          <div className="cr-proc">
            <div className="ph-head">
              <p className="ph-eyebrow">INFACT. PROCESS</p>
              <h2 className="ph-title"><Accent text={`${(data.process_title ?? "").replace("설계하고, ", "설계하고,\n")}.`} /></h2>
            </div>
            <div ref={trackRef} className="ph-track">
              <ul className="ph-list">
                {steps.map((s, i) => (
                  <li key={s.tag} ref={(el) => { cards.current[i] = el; }} data-on={i <= on ? "1" : "0"} data-cur={i === on ? "1" : "0"} className="ph-card">
                    <span aria-hidden="true" className="ph-dot" />
                    {i < n - 1 && <span aria-hidden="true" className="ph-line" />}
                    <p className="ph-tag">{s.tag}</p>
                    <p className="ph-en">{s.en ?? s.title}</p>
                    <p className="ph-body"><b>{s.title}</b> — {s.body.replace(/\n/g, " ")}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
