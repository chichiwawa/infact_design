"use client";

/**
 * 배경 시안 E — FACT CHECK: "감"은 걸러내고 "팩트"만 남기는 검증 모션 (CSS 만, 10초 반복)
 *  주장 카드가 떠오름 → 스캔 빔이 위에서 아래로 훑음 → 빔이 지나가는 순간 VERIFIED 로 확정(블루 번쩍)
 *  맨 위 카드는 "감" 문구라 UNVERIFIED 로 취소선. 문구는 2026-10-13 에 변경(맨 위 "감" 카드 1장 + 사실 카드 3장).
 *  variant a~d: 카드 배치 + 커서 효과가 시안마다 다름
 *   a 레티클(조준선 링 + 좌표 표시, 가까운 카드가 떠오름) / b 세로 스캔선(커서 x 를 따라다니며 지나간 카드가 밝아짐)
 *   c 돋보기 렌즈(커서 둘레 격자·카드가 밝아짐) / d 거대한 FACT 글자(커서 둘레만 파랗게 채워짐)
 */
import { useEffect, useRef } from "react";
import { zoomInv } from "@/lib/zoom";

type Variant = "a" | "b" | "c" | "d";
/** 위에서 아래로 내려오는 스캔 광선 모양 — 생략하면 기존(굵은 블루 띠) / line 가는 레이저 / curtain 넓은 빛 커튼 / prism 컬러 라인 + 스캔라인 꼬리 */
type Beam = "line" | "curtain" | "prism";
const CARDS: { cls: string; label: string; text: string; ok: boolean; at: number }[] = [
  { cls: "fc-c0", label: "CLAIM 01", text: "“효과가 좋을 것 같아요”", ok: false, at: 1.0 },
  { cls: "fc-c1", label: "CLAIM 02", text: "성과가 나오기 어려운 병원은 받지 않습니다.", ok: true, at: 1.5 },
  { cls: "fc-c2", label: "CLAIM 03", text: "전담 PM이 병원 내부까지 봅니다.", ok: true, at: 2.5 },
  { cls: "fc-c3", label: "CLAIM 04", text: "누적대행 병원 457곳+", ok: true, at: 2.8 },
];

export default function FactCheckBg({ variant = "a", beam }: { variant?: Variant; beam?: Beam }) {
  const root = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);

  // 커서: --mx/--my 를 부드럽게 따라가게 갱신, 가까운 카드에 data-near 표시
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(hover: none)").matches) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".fc-card"));
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, seen = false;
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.setProperty("--mx", x.toFixed(1) + "px");
      el.style.setProperty("--my", y.toFixed(1) + "px");
      if (read.current) read.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y)).padStart(4, "0")}`;
      const R = variant === "c" ? 190 : 170;
      for (const c of cards) {
        const b = c.offsetLeft, t = c.offsetTop, w = c.offsetWidth, h = c.offsetHeight;
        const near = variant === "b"
          ? Math.abs(x - (b + w / 2)) < w / 2 + 24
          : Math.hypot(Math.max(b - x, 0, x - (b + w)), Math.max(t - y, 0, y - (t + h))) < (variant === "d" ? 120 : R * 0.55);
        c.dataset.near = near ? "1" : "0";
      }
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && window.scrollY < window.innerHeight;
      el.dataset.on = inside ? "1" : "0";
      if (!inside) return;
      { const zi = zoomInv(); tx = (e.clientX - r.left) * zi; ty = (e.clientY - r.top) * zi; }
      if (!seen) { x = tx; y = ty; seen = true; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { el.dataset.on = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); if (raf) cancelAnimationFrame(raf); };
  }, [variant]);

  return (
    <div ref={root} className={`fc fc--${variant}`} data-on="0" data-beam={beam} aria-hidden="true">
      <div className="fc-grid" />
      <i className="fc-cross fc-cross--tl" /><i className="fc-cross fc-cross--tr" /><i className="fc-cross fc-cross--bl" /><i className="fc-cross fc-cross--br" />
      {variant === "d" && <div className="fc-giant"><span className="fc-giant-line">FACT</span><div className="fc-giant-fill"><span>FACT</span></div></div>}
      <div className="fc-beam" />
      {variant === "a" && <div className="fc-cur fc-reticle"><i /><span ref={read} className="fc-read" /></div>}
      {variant === "b" && <div className="fc-cur fc-vline"><span ref={read} className="fc-read" /></div>}
      {variant === "c" && <div className="fc-cur fc-lens"><i /></div>}
      {variant === "d" && <div className="fc-cur fc-ring" />}
      {CARDS.map((c) => (
        <div key={c.cls} className={`fc-card ${c.cls} ${c.ok ? "" : "is-bad"}`} style={{ "--dl": `${(c.at - 3).toFixed(1)}s` } as React.CSSProperties}>
          <div className="fc-top"><span>{c.label}</span><span className="fc-stat">
            <b className="fc-pend"><i />CHECKING</b>
            <b className="fc-done">{c.ok ? <><svg viewBox="0 0 16 16" width="1em" height="1em"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>FACT</> : <><svg viewBox="0 0 16 16" width="1em" height="1em"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>NO DATA</>}</b>
          </span></div>
          <p className="fc-text"><span>{c.text}</span></p>
          <div className="fc-bar"><i /></div>
        </div>
      ))}
    </div>
  );
}
