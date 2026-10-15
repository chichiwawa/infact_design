"use client";

/**
 * 05 차별점 4가지 — 가운데 로고형 제목 + 4문장(현재 문장만 강조) + 좌우 세로 이미지 컬럼 (2026-10-15 사용자 첨부 레이아웃)
 *  - 래퍼(wrap) 안에서 화면 하나를 sticky 로 고정하고, 스크롤에 따라 강조 문장이 위에서 아래로 넘어간다 (회색 → 시그니처 블루).
 *  - 좌우 이미지 컬럼은 스크롤에 맞춰 서로 반대 방향으로 흐른다 (왼쪽 위로, 오른쪽 아래로).
 *  - 모션 값은 React 상태가 아니라 CSS 변수(--sp, --d)를 직접 갱신 (리렌더·className 충돌 방지).
 *  - 이전 버전: `백업/` 폴더 (괄호 모션 / 사진 콜라주).
 */
import { useEffect, useRef } from "react";
import Accent from "@/components/Accent";
import type { DifferentiatorsData } from "@/lib/sections";

const CARDS = [
  "/media/4c4993e7-035e-490a-904c-3018cf878c27.webp",
  "/media/ig-hero.webp",
  "/media/yt-hero.webp",
  "/media/ba-face.webp",
];

/** 좌우 컬럼 이미지 6장 (diff-1~6.webp) */
const SIDE = [1, 2, 3, 4, 5, 6].map((n) => `/media/diff-${n}.webp`);

function Column({ side }: { side: "l" | "r" }) {
  const order = side === "l" ? [0, 1, 2, 3, 4, 5] : [3, 4, 5, 0, 1, 2];
  const list = [...order, ...order];
  return (
    <div className={`diff-col ${side}`} aria-hidden>
      {list.map((k, i) => (
        <div key={i} className="diff-img" style={{ backgroundImage: `url(${SIDE[k]})` }} />
      ))}
    </div>
  );
}

/** variant: 기본 = "x2"(블루 오브·떠다니는 칩 + 밑줄, 메인 적용). "a" 진행 카운터, "b" 글로우+밑줄, "c" 보조 설명+알약, "dark" 어두운 블루 배경, "x1~x3" 밝은 배경 장식 요소 (시안용, diff-x1~x3, /demo/diff-a~c, diff-dark) */
export default function Differentiators({ title, data, variant = "x2" }: { title: string; data: DifferentiatorsData; variant?: "a" | "b" | "c" | "dark" | "x1" | "x2" | "x3" | "n1" | "n2" | "n3" }) {
  const wrap = useRef<HTMLElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLLIElement | null)[]>([]);
  const cnt = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      const n = data.items.length;
      // 앞뒤 8% 는 여백. q = 현재 강조 위치(0 ~ n-1, 연속값)
      const q = Math.min(1, Math.max(0, (p - 0.08) / 0.84)) * (n - 1);
      stick.current?.style.setProperty("--sp", String(p));
      stick.current?.style.setProperty("--q", String(q));
      stick.current?.style.setProperty("--pr", String(q / Math.max(1, n - 1)));
      if (cnt.current) cnt.current.textContent = String(Math.round(q) + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0");
      lines.current.forEach((li, i) => li?.style.setProperty("--d", String(i - q)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [data.items.length]);

  return (
    <section ref={wrap} className="diff-wrap" style={{ height: `${100 + data.items.length * 60}dvh` }}>
      <div ref={stick} className="diff-stick" data-variant={variant}>
        <div className="diff-glow" aria-hidden />
        {/* 밝은 배경 장식 — 시안 x1(격자·워터마크·링) / x2(블루 오브·떠다니는 칩) / x3(가이드선·태그). 기본 화면에서는 숨김 */}
        <div className="diff-deco" aria-hidden>
          <i className="dd-grid" /><i className="dd-mark">INFACT.</i><i className="dd-ring r1" /><i className="dd-ring r2" />
          <i className="dd-orb o1" /><i className="dd-orb o2" /><i className="dd-orb o3" />
          <i className="dd-rule l" /><i className="dd-rule r" /><b className="dd-cross a">+</b><b className="dd-cross b">+</b><b className="dd-cross c">+</b><b className="dd-cross d">+</b>
          {/* 새 시안 n1(오로라+큰 숫자) / n2(사진 배경 전환) / n3(파동 링+진행 레일) */}
          <i className="nn-aurora a1" /><i className="nn-aurora a2" />
          {[0, 1, 2, 3].map((i) => <i key={`n${i}`} className="nn-num" style={{ ["--i" as string]: i }}>{String(i + 1).padStart(2, "0")}</i>)}
          {CARDS.map((c, i) => <i key={`b${i}`} className="nb-img" style={{ ["--i" as string]: i, backgroundImage: `url(${c})` }} />)}
          <i className="nr-ring g1" /><i className="nr-ring g2" /><i className="nr-ring g3" />
          <span className="nr-rail"><b /><em>{[0, 1, 2, 3].map((i) => <u key={i} style={{ ["--i" as string]: i }}>{String(i + 1).padStart(2, "0")}</u>)}</em></span>
          <span className="nr-side">INFACT. COMPANY — WHY US</span>
          <span className="dd-tag">WHY INFACT</span>
        </div>
        <Column side="l" />
        <Column side="r" />
        <div className="diff-body">
          <p className="diff-logo">INFACT<i>.</i> COMPANY</p>
          <h2 className="diff-title"><Accent text={title} /></h2>
          <ol className="diff-list">
            {data.items.map((it, i) => (
              <li key={it.title} ref={(n) => { lines.current[i] = n; }} className="diff-line" style={{ ["--d" as string]: i }}>
                <span>{it.title}</span>
                <small className="diff-sub">{it.body}</small>
              </li>
            ))}
          </ol>
          <div className="diff-meta" aria-hidden><span ref={cnt}>01 / 04</span><i><b /></i></div>
        </div>
      </div>
    </section>
  );
}
