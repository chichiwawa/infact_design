"use client";

/** 문의 섹션 배경: 마우스를 따라다니는 세로 스캔선 + 좌표 표시 (메인 히어로 FACT CHECK B 와 같은 모양, 2026-11-02) */
import { useEffect, useRef } from "react";
import { zoomInv } from "@/lib/zoom";

export default function FiCursor() {
  const root = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const sec = el?.closest("section");
    if (!el || !sec || matchMedia("(hover: none)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, seen = false;
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.setProperty("--mx", x.toFixed(1) + "px");
      if (read.current) read.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y)).padStart(4, "0")}`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && e.clientX >= r.left && e.clientX <= r.right;
      el.dataset.on = inside ? "1" : "0";
      if (!inside) return;
      const zi = zoomInv();
      tx = (e.clientX - r.left) * zi; ty = (e.clientY - r.top) * zi;
      if (!seen) { x = tx; y = ty; seen = true; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => { el.dataset.on = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={root} className="fi-cur" data-on="0" aria-hidden="true">
      <span ref={read} className="fi-read" />
    </div>
  );
}
