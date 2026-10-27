"use client";
/**
 * 04 진행 프로세스 — 검은 배경 스크롤 점등형(2026-10-27, btsoft 레퍼런스).
 * 왼쪽 선언 문구는 고정, 오른쪽 세로선을 따라 스크롤할 때마다 단계가 하나씩 켜진다.
 * 구간 높이(단계 수 × 한 화면)를 스크롤하는 동안 안쪽 화면이 sticky 로 붙어 있다.
 * 현재 단계는 투명 감지 칸(IntersectionObserver)으로 잡는다 — html zoom 에서도 값이 틀어지지 않는다.
 * 켜짐 표시는 className 이 아니라 data-on 으로(Motion.tsx 가 className 을 건드리므로).
 */
import { useEffect, useRef, useState } from "react";
import Accent from "@/components/Accent";
import type { ProcessData } from "@/lib/sections";

/* 단계마다 다른 위치·색조의 파란 빛 — 켜진 단계에 맞춰 배경이 천천히 바뀐다 */
const GLOWS = [
  "radial-gradient(60% 55% at 85% 12%, rgba(48,97,255,.30), transparent 70%)",
  "radial-gradient(60% 55% at 90% 38%, rgba(48,97,255,.34), transparent 70%), radial-gradient(40% 40% at 10% 90%, rgba(80,140,255,.14), transparent 70%)",
  "radial-gradient(65% 55% at 70% 62%, rgba(70,60,255,.32), transparent 70%)",
  "radial-gradient(65% 60% at 80% 75%, rgba(48,97,255,.40), transparent 70%), radial-gradient(40% 40% at 15% 20%, rgba(48,97,255,.16), transparent 70%)",
  "radial-gradient(70% 60% at 50% 100%, rgba(90,150,255,.38), transparent 72%)",
];
const VH = "calc(100dvh*var(--zi))";

export default function ProcessAlt({ title, data }: { title: string; data: ProcessData }) {
  const n = data.steps.length;
  const [on, setOn] = useState(0);
  const marks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    marks.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, [n]);

  return (
    <section className="relative bg-black text-white" style={{ height: `calc(${VH}*${n + 1})` }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0">
        {data.steps.map((s, i) => (
          <div key={s.tag} data-i={i} ref={(el) => { marks.current[i] = el; }} style={{ height: VH }} />
        ))}
      </div>

      <div className="sticky top-0 overflow-hidden" style={{ height: VH }}>
        {data.steps.map((s, i) => (
          <div key={s.tag} aria-hidden="true" className="absolute inset-0 pointer-events-none transition-opacity duration-[900ms] ease-out" style={{ opacity: i === on ? 1 : 0, background: GLOWS[i % GLOWS.length] }} />
        ))}
        <div className="container-x relative h-full grid items-center gap-8 lg:gap-16 lg:grid-cols-[1fr_1fr] content-center">
          <div data-reveal>
            <p className="mb-5 md:mb-7 text-[12px] md:text-[13px] font-bold tracking-[.16em] text-[#6b8cff]">INFACT. PROCESS</p>
            <h2 className="t-h-xl text-white tracking-[-0.05em]">
              <span className="block">진단하고, 설계하고,</span>
              <span className="block"><Accent text="**직접 실행**합니다." /></span>
            </h2>
            <p className="mt-5 md:mt-6 text-[15px] md:text-[18px] leading-[1.7] text-white/55 max-w-[460px]">{data.subtitle}</p>
          </div>

          <div className="relative pl-9 md:pl-[88px]">
            <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-px bg-white/25" />
            <span aria-hidden="true" className="absolute left-[7px] top-2 w-px bg-white transition-[height] duration-500 ease-out" style={{ height: `calc((100% - 16px)*${on / (n - 1)})` }} />
            <ul className="flex flex-col gap-5 md:gap-9">
              {data.steps.map((s, i) => (
                <li key={s.tag} data-on={i === on ? "1" : "0"} className="relative group">
                  <span aria-hidden="true" className="absolute -left-9 md:-left-[88px] top-[10px] md:top-[18px] w-[15px] h-[15px] grid place-items-center">
                    <span className="block rounded-full transition-all duration-500 bg-white/30 w-[7px] h-[7px] group-data-[on='1']:bg-primary group-data-[on='1']:w-[15px] group-data-[on='1']:h-[15px] group-data-[on='1']:shadow-[0_0_18px_4px_rgba(48,97,255,.7)]" />
                  </span>
                  <p className="text-[30px] md:text-[56px] font-extrabold leading-[1.05] tracking-[-0.04em] transition-colors duration-500 text-white/20 group-data-[on='1']:text-white">{s.en ?? s.title}</p>
                  <p className="mt-1 md:mt-2 text-[16px] md:text-[22px] tracking-[-0.02em] transition-colors duration-500 text-white/20 group-data-[on='1']:text-white/85 whitespace-pre-line"><b className="font-bold">{s.title}</b> — {s.body.replace(/\n/g, " ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
