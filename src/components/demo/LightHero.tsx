"use client";

/**
 * 메인 히어로 시안(밝은 글라스 톤) — 2026-10-13
 *  A: 흐르는 유리 리본 + 떠다니는 구슬, 큰 파란 제목은 오른쪽 아래
 *  B: 가운데 반짝이는 파란 구슬 + 동심원 + 궤도 위의 유리 알약(키워드)
 *  C: A 의 리본 배경 + B 의 구슬을 오른쪽에 두고 제목은 왼쪽
 *  공통: 마우스를 움직이면 층마다 다른 깊이로 따라 움직임(--mx/--my, 터치 기기에서는 정지). 스타일은 globals.css 의 .lh-*
 *  문구는 시안 확인용으로 pages.json 홈 히어로 문구를 그대로 옮겨 둠(확정되면 Hero.tsx 로 이식).
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import "./light-hero.css";

export type LightHeroVariant = "a" | "b" | "c";

const COPY = {
  eyebrow: "2018년부터, 오직 병원 마케팅만",
  headline: ["환자가 찾는 병원으로", "성장을 설계합니다"],
  tagline: ["광고 한 번의 반짝임이 아니라,", "병원이 오래 성장할 수 있는", "데이터 기반 마케팅 구조를 만듭니다."],
  chips: ["성형외과", "피부과", "퍼포먼스 광고", "브랜딩"],
};

type Orb = { x: string; y: string; s: string; d: 1 | 2 | 3; delay?: string };

const ORBS_A: Orb[] = [
  { x: "60vw", y: "-6vh", s: "8vw", d: 2 },
  { x: "2vw", y: "74vh", s: "12vw", d: 3, delay: "-2s" },
  { x: "93vw", y: "34vh", s: "3.4vw", d: 1, delay: "-4s" },
  { x: "21vw", y: "30vh", s: "2.4vw", d: 1, delay: "-1s" },
];
const ORBS_C: Orb[] = [
  { x: "44vw", y: "8vh", s: "3.6vw", d: 1, delay: "-3s" },
  { x: "31vw", y: "84vh", s: "6vw", d: 3, delay: "-2s" },
  { x: "93vw", y: "14vh", s: "4vw", d: 2, delay: "-5s" },
];

function Ribbons() {
  return (
    <svg className="lh-ribbons" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="lh-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b9bff" stopOpacity=".62" />
          <stop offset=".55" stopColor="#a9ccff" stopOpacity=".34" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".05" />
        </linearGradient>
        <linearGradient id="lh-g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".78" />
          <stop offset=".5" stopColor="#bcd7ff" stopOpacity=".5" />
          <stop offset="1" stopColor="#d9c8ff" stopOpacity=".5" />
        </linearGradient>
        <linearGradient id="lh-g3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset=".5" stopColor="#ffffff" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-120 90C240 20 560 250 500 520S210 860 720 980L-120 980Z" fill="url(#lh-g1)" />
      <path d="M-120 250C180 170 440 330 420 560S250 820 600 940" fill="none" stroke="url(#lh-g3)" strokeWidth="3" />
      <path d="M-120 330C150 250 380 390 360 590S220 790 520 920" fill="none" stroke="url(#lh-g3)" strokeWidth="1.5" />
      <path d="M-80 430C300 400 660 620 1020 770S1420 880 1560 830L1560 980L-80 980Z" fill="url(#lh-g2)" />
      <path d="M0 560C340 520 700 720 1060 840" fill="none" stroke="url(#lh-g3)" strokeWidth="2" />
    </svg>
  );
}

function Orbs({ list }: { list: Orb[] }) {
  return (
    <>
      {list.map((o, i) => (
        <span key={i} className={`lh-par lh-d${o.d}`} style={{ left: o.x, top: o.y, width: o.s, height: o.s }} aria-hidden="true">
          <i className="lh-orb" style={{ animationDelay: o.delay }} />
        </span>
      ))}
    </>
  );
}

function Actions() {
  return (
    <div className="lh-actions">
      <Link href="/contact" className="lh-btn">문의하기</Link>
      <Link href="/services" className="lh-btn lh-btn--line">서비스 보기</Link>
    </div>
  );
}

function Switcher({ variant }: { variant: LightHeroVariant }) {
  return (
    <nav className="lh-switch" aria-label="시안 선택">
      {(["a", "b", "c"] as const).map((v) => (
        <Link key={v} href={`/demo/hero-${v}`} data-on={v === variant ? "true" : undefined}>{v.toUpperCase()}</Link>
      ))}
    </nav>
  );
}

export default function LightHero({ variant }: { variant: LightHeroVariant }) {
  const ref = useRef<HTMLElement>(null);

  // 마우스 위치(-1~1)를 --mx/--my 로 전달. 모션 줄이기 설정이면 움직이지 않음
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", String(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)).toFixed(3)));
      el.style.setProperty("--my", String(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2)).toFixed(3)));
    };
    const leave = () => { el.style.setProperty("--mx", "0"); el.style.setProperty("--my", "0"); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, []);

  // B: 구슬 안이 메인 제목(h1) / C: 제목은 왼쪽에 있으므로 구슬 안은 "2018" 숫자 포인트
  const sphere = (
    <div className="lh-sphere-wrap">
      <span className="lh-par lh-d2 lh-fill">
        <span className="lh-sphere">
          {variant === "b" ? (
            <h1 className="lh-sphere-text">
              <b>{COPY.headline[0]}</b>
              <b>{COPY.headline[1]}</b>
              <em>HOSPITAL MARKETING · SINCE 2018</em>
            </h1>
          ) : (
            <span className="lh-sphere-text" aria-hidden="true">
              <em>ONLY HOSPITAL MARKETING</em>
              <b className="lh-big">2018</b>
              <em>SINCE</em>
            </span>
          )}
        </span>
      </span>
    </div>
  );

  const satellites = (pos: [string, string][]) =>
    COPY.chips.map((label, i) => (
      <span key={label} className={`lh-par lh-d${(i % 3) + 1}`} style={{ left: `calc(50% + var(--s) * ${pos[i][0]})`, top: `calc(50% + var(--s) * ${pos[i][1]})` }}>
        <i className="lh-glass" style={{ animationDelay: `${-i * 1.3}s` }}>{label}</i>
      </span>
    ));

  return (
    <section ref={ref} className={`lh lh--${variant}`} aria-label="인팩트 소개 시안">
      <div className="lh-spot" aria-hidden="true" />

      {variant !== "b" && (
        <div className="lh-par lh-d1 lh-fill" aria-hidden="true"><Ribbons /></div>
      )}
      {variant === "a" && <Orbs list={ORBS_A} />}

      {variant === "b" && (
        <div className="lh-stage">
          {[1.55, 2.2, 3.0, 4.0].map((k, i) => (
            <span key={i} className="lh-ring" style={{ width: `calc(var(--s) * ${k})`, height: `calc(var(--s) * ${k})` }} aria-hidden="true" />
          ))}
          {sphere}
          {satellites([["-1.15", "-.62"], ["-1.45", ".1"], ["1.05", "-.15"], ["1.4", ".3"]])}
          <span className="lh-par lh-d1" style={{ left: "calc(50% + var(--s) * -1.9)", top: "calc(50% + var(--s) * -.15)" }} aria-hidden="true"><i className="lh-bead" /></span>
          <span className="lh-par lh-d3" style={{ left: "calc(50% + var(--s) * .72)", top: "calc(50% + var(--s) * -.78)" }} aria-hidden="true"><i className="lh-bead" style={{ animationDelay: "-2s" }} /></span>
          <span className="lh-par lh-d2" style={{ left: "calc(50% + var(--s) * .6)", top: "calc(50% + var(--s) * .86)" }} aria-hidden="true"><i className="lh-bead" style={{ animationDelay: "-4s" }} /></span>
        </div>
      )}

      {variant === "c" && (
        <>
          <Orbs list={ORBS_C} />
          <div className="lh-stage">
            {sphere}
            {satellites([["-.98", "-.62"], ["-1.12", ".42"], [".1", "-.74"], [".45", ".72"]])}
          </div>
        </>
      )}

      <div className="lh-in container-x">
        {variant === "b" && <p className="lh-eyebrow lh-eyebrow--top">{COPY.eyebrow}<b>.</b></p>}

        {variant === "a" && (
          <div className="lh-copy lh-copy--right">
            <p className="lh-eyebrow">{COPY.eyebrow}<b>.</b></p>
            <h1 className="lh-h1">{COPY.headline.map((l) => <span key={l}>{l}</span>)}</h1>
            <span className="lh-rule" aria-hidden="true" />
            <p className="lh-sub">{COPY.tagline.join(" ")}</p>
            <Actions />
          </div>
        )}

        {variant === "c" && (
          <div className="lh-copy">
            <p className="lh-eyebrow">{COPY.eyebrow}<b>.</b></p>
            <h1 className="lh-h1 lh-h1--ink">{COPY.headline.map((l) => <span key={l}>{l}</span>)}</h1>
            <p className="lh-sub">{COPY.tagline.map((l) => <span key={l} className="block">{l}</span>)}</p>
            <Actions />
          </div>
        )}

        {variant === "b" && (
          <div className="lh-foot">
            <p className="lh-sub">{COPY.tagline.map((l) => <span key={l} className="block">{l}</span>)}</p>
            <Actions />
          </div>
        )}
      </div>

      <Switcher variant={variant} />
    </section>
  );
}
