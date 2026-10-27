"use client";
/**
 * 04 진행 프로세스 — 가로 스크롤형(2026-10-27). 문의 → 진단 → 설계 → 실행 → 관리.
 * 제목(INFACT. PROCESS / 진단하고, 설계하고, 직접 실행합니다.)은 화면 위쪽 가운데, 단계 줄은 그 아래(2026-10-27 시안).
 * 세로로 스크롤하는 동안 안쪽 화면이 sticky 로 붙어 있고, 단계 줄이 왼쪽으로 흐른다(--ph-x 가 아니라 transform 직접 갱신).
 * 화면 가운데를 지난 단계는 점등된다. 점등 표시는 className 이 아니라 data-on 으로(Motion.tsx 가 className 을 건드리므로).
 * 길이 계산은 CSS px(html zoom 보정: zoomInv) 기준.
 */
import { useEffect, useRef, useState } from "react";
import Accent from "@/components/Accent";
import type { ProcessData } from "@/lib/sections";
import { zoomInv } from "@/lib/zoom";

const VH = "calc(100dvh*var(--zi))";

export default function ProcessAlt({ title, data }: { title?: string; data: ProcessData }) {
  const n = data.steps.length;
  const [on, setOn] = useState(0);
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const sec = secRef.current, track = trackRef.current;
    if (!sec || !track) return;
    let raf = 0, last = -1;
    const update = () => {
      raf = 0;
      const zi = zoomInv();
      const r = sec.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const max = Math.max(0, track.scrollWidth - window.innerWidth * zi);
      track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
      // 카드 중심이 화면 폭의 62% 보다 왼쪽에 오면 켜짐 (마지막 카드는 끝에서 반드시 켜지도록 p 도 함께 본다)
      let lit = 0;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const b = c.getBoundingClientRect();
        if (b.left + b.width / 2 < window.innerWidth * 0.62 || (i === n - 1 && p > 0.97)) lit = i;
      });
      if (lit !== last) { last = lit; setOn(lit); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  return (
    <section ref={secRef} className="ph on-dark" style={{ height: `calc(${VH}*${n * 0.7 + 1})` }} aria-label="진행 프로세스">
      <div className="ph-stage" style={{ height: VH }}>
        <div aria-hidden="true" className="ph-glow" style={{ opacity: 0.55 + (on / Math.max(1, n - 1)) * 0.45 }} />
        <div className="ph-head">
          <p className="ph-eyebrow">INFACT. PROCESS</p>
          <h2 className="ph-title"><Accent text={`${(title ?? "").replace("설계하고, ", "설계하고,\n")}.`} /></h2>
        </div>
        <div ref={trackRef} className="ph-track">
          <ul className="ph-list">
            {data.steps.map((s, i) => (
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
    </section>
  );
}
