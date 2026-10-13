"use client";

/**
 * CompareCard — 04 부스터 무대의 "데이터 카드" (사진 대신 코드로 그린 운영 전/후 비교). 2026-09-21 사용자 결정.
 *  - 주 지표 1개(before → after)만 크게, 보조 지표는 있을 때만 작게. 숫자는 DB(TabItem.data_card)에서 옴 — 실제 사례 수치.
 *  - 진입 시 증가폭 숫자 카운트업 + 그래프 라인 드로잉 (prefers-reduced-motion 이면 즉시 표시).
 *  - 16:9 무대 안(absolute inset-0)과 모바일 목록(정적 높이) 양쪽에서 씀.
 */
import { useEffect, useRef } from "react";
import type { DataCardCompare } from "@/lib/sections";

const fmt = (n: number) => n.toLocaleString("ko-KR");

function Profile({ after, value, card, compact }: { after: boolean; value: number; card: DataCardCompare; compact: boolean }) {
  return (
    <div className={`relative rounded-[18px] p-4 grid gap-3 ${after ? "bg-primary-soft ring-[1.5px] ring-primary/35" : "bg-elevated ring-1 ring-ink/[0.06]"}`}>
      <span className={`absolute -top-3 left-4 text-[11px] font-bold tracking-[0.04em] px-2.5 py-1 rounded-full text-white ${after ? "bg-primary" : "bg-faint"}`}>{after ? "운영 후" : "운영 전"}</span>
      <div className="flex items-center gap-3">
        <i aria-hidden="true" className={`w-9 h-9 rounded-full shrink-0 ${after ? "bg-[linear-gradient(135deg,#7ea0ff,#3061ff)]" : "bg-[linear-gradient(135deg,#dfe6f5,#c7d3ee)]"}`} />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-ink truncate">{card.handle ?? "oo_clinic"}</p>
          {card.handle_sub && <p className="text-[11px] text-mute truncate">{card.handle_sub}</p>}
        </div>
      </div>
      <div className="text-center">
        <b className={`block text-[22px] font-extrabold tracking-[-0.02em] tabular-nums ${after ? "text-primary" : "text-ink"}`}>{fmt(value)}</b>
        <i className="not-italic text-[11px] text-mute">{card.metric}</i>
      </div>
      {!compact && (
        <div className="grid grid-cols-3 gap-1" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => <i key={i} className={`aspect-square rounded-md ${after ? "bg-[linear-gradient(135deg,#c9d7ff,#9fb6ff)]" : "bg-[linear-gradient(135deg,#e9edf5,#d9e0ee)]"}`} />)}
        </div>
      )}
    </div>
  );
}

export default function CompareCard({ card, compact = false }: { card: DataCardCompare; compact?: boolean }) {
  const delta = card.after - card.before;
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(delta); return; }
    let start = 0, raf = 0;
    const dur = 1400;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      el.textContent = fmt(Math.round(delta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delta]);

  return (
    <div className={`${compact ? "grid gap-4 p-5" : "absolute inset-0 grid grid-cols-[1fr_auto_1fr] gap-5 px-8 py-7 items-center"}`}>
      <Profile after={false} value={card.before} card={card} compact={compact} />
      <div className="grid justify-items-center gap-1.5 min-w-[170px]">
        <p className="text-[38px] font-extrabold tracking-[-0.04em] leading-none text-primary tabular-nums">
          +<span ref={ref}>0</span><small className="text-[17px] font-bold ml-0.5">{card.unit}</small>
        </p>
        <p className="text-[12px] text-mute">{card.metric}{card.period ? ` · ${card.period}` : ""}</p>
        <svg viewBox="0 0 170 64" className="w-[160px] h-[60px] overflow-visible" aria-hidden="true">
          <defs><linearGradient id="cc-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3061ff" stopOpacity=".25" /><stop offset="1" stopColor="#3061ff" stopOpacity="0" /></linearGradient></defs>
          <path d="M0 56 C 40 54, 70 44, 100 30 S 150 8, 170 4 L170 64 L0 64Z" fill="url(#cc-g)" />
          <path className="cc-line" d="M0 56 C 40 54, 70 44, 100 30 S 150 8, 170 4" fill="none" stroke="#3061ff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="170" cy="4" r="4" fill="#3061ff" />
        </svg>
        {card.subs?.length ? (
          <div className="flex gap-2 mt-1">
            {card.subs.map((s) => (
              <div key={s.label} className="bg-elevated border border-hairline rounded-xl px-2.5 py-2 text-[11px] text-body grid gap-0.5 min-w-[78px]">
                {s.label}<b className="text-[14px] text-ink tracking-[-0.02em] tabular-nums">{s.value}<em className="not-italic text-success text-[11px] ml-0.5">↑</em></b>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <Profile after value={card.after} card={card} compact={compact} />
    </div>
  );
}
