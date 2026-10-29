"use client";

/**
 * PickerSection — 서비스 03(부스터)·04(개별 상품) 공용 "고르는" 레이아웃 (2026-10-13, adotenglish.com 메인 '커리큘럼 진단' 구성 참고)
 *  메인 "필요한 곳만 집중 공략하는 부스터와 개별 상품" 에서 사용 (2026-10-13)
 *  왼쪽: 작은 문구 + "우리 병원은 [단어]가 필요해요"(단어만 파란 박스, 바뀔 때 위로 교체) + 항목 목록(선택된 항목은 파랑·굵게) + 버튼
 *  오른쪽: 선택된 항목의 그림 패널(항목마다 겹쳐 두고 선택된 것만 보임)
 *  PC: 섹션이 화면에 고정(sticky)된 채 스크롤하는 만큼 항목이 차례로 바뀜. 목록을 눌러도 이동. 모바일: 고정 없이 목록을 눌러 바꿈.
 *  ⚠️ 활성 항목은 className 이 아니라 data-on 으로 표시 (Motion 의 is-visible/is-in 클래스를 지우지 않기 위해)
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { zoomInv } from "@/lib/zoom";

export interface PickerItem {
  label: string;       // 목록에 보이는 이름
  need: string;        // "우리 병원은 ___이 필요해요" 에 들어갈 단어
  breakAfter?: string; // 카드 제목에서 이 글자 뒤에서 모바일 줄바꿈
  heading?: string;    // 이 항목 위에 붙는 목록 머리글 (예: "집중 공략 부스터 4종")
  visual: React.ReactNode;   // 오른쪽 그림 패널 안
  below?: React.ReactNode;   // 패널 아래 설명
  icon?: React.ReactNode;    // stack: 카드 왼쪽 위 아이콘 칸
  tag?: string;              // stack: 카드 오른쪽 위 작은 글자
  eyebrow?: string;          // stack: 제목 위 작은 영문 글자 (부스터 카드)
  kind?: string;             // stack: 카드 종류 표시(ig·ba·ai·yt) — 아이콘 배지 선택용
  bg?: React.ReactNode;      // stack: 섹션 전체 배경(PC 만, 이 항목이 활성일 때 서서히 나타남)
  wide?: boolean;            // stack: 그림이 카드 전체가 아니라 안쪽 격자(개별 상품 6종)
}

/** 받침이 있으면 "이", 없으면 "가" */
function josa(word: string) {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return "이";
  return code % 28 === 0 ? "가" : "이";
}

/** 왼쪽 위 문구: 첫 줄 = 영문 라벨("." 은 파란 점), 다음 줄 = 설명("**강조**" 는 굵게) */
function leadLines(lead: string) {
  const lines = lead.split("\n");
  if (lines.length < 2) return lead.replace(/\*\*/g, "");
  return lines.map((t, k) =>
    k === 0 ? (
      <span key={k} className="pk-eyebrow">{t.split(".").map((w, m, a) => <span key={m}>{w}{m < a.length - 1 && <i className="pk-dot">.</i>}</span>)}</span>
    ) : (
      <span key={k} className="block">{t.split(/(\*\*[^*]+\*\*)/).map((p, m) => (p.startsWith("**") ? <b key={m}>{p.slice(2, -2)}</b> : p))}</span>
    ),
  );
}

/** breakAfter 가 있으면 그 글자 뒤에서 항상(PC·노트북·모바일) 줄바꿈 */
const lbl = (it: { label: string; breakAfter?: string }) => {
  const k = it.breakAfter ? it.label.indexOf(it.breakAfter) : -1;
  if (k < 0 || !it.breakAfter) return it.label;
  const e = k + it.breakAfter.length;
  return <>{it.label.slice(0, e)}<br />{it.label.slice(e).trimStart()}</>;
};

export default function PickerSection({
  id, bg, lead, sub, items, cta, variant, acc = "a", btn, igbg, igtx, ytchip, mob,
}: {
  id: string; bg: string; lead: string; sub?: string; variant?: "a" | "b" | "c" | "stack"; acc?: "a" | "b" | "c"; btn?: string; igbg?: string; igtx?: string; ytchip?: string;
  /** 모바일(<768px) 전용 레이아웃 시안 — a 가로 탭 + 카드 1장 / b 옆으로 밀기 / c 타일 메뉴 + 카드 1장. 없으면 기존(세로로 쭉) */
  mob?: "a" | "b" | "c" | "d" | "e" | "f";
  items: PickerItem[]; cta: { label: string; href: string };
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = items.length;

  // PC: 고정된 구간 안에서 스크롤 진행률 → 항목 번호
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const mq = matchMedia("(min-width: 768px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = el.getBoundingClientRect();
      const span = el.getBoundingClientRect().height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(0.9999, Math.max(0, -r.top / span));
      setActive(Math.floor(p * n));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  const pick = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    if (matchMedia("(min-width: 768px)").matches) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo({ top: top + (span * (i + 0.5)) / n, behavior: "smooth" });
    } else {
      setActive(i);
    }
  };

  // stack: 오른쪽 카드가 세로로 쌓이고, 화면 중앙에 걸친 카드가 활성 항목 (2026-10-14, axiom-power-template 참고)
  const cards = useRef<(HTMLElement | null)[]>([]);
  const tapLock = useRef(0); // 모바일 f: 탭을 눌러 스크롤 이동 중에는 스크롤 감지로 활성 탭이 바뀌지 않게
  useEffect(() => {
    if (variant !== "stack") return;
    const el = wrap.current;
    if (!el) return;
    const mq = matchMedia("(min-width: 768px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (mq.matches) {
        // PC: 화면이 멈춘 채 스크롤 진행률만큼 오른쪽 카드 줄이 위로 이동
        const span = el.getBoundingClientRect().height - window.innerHeight;
        const p = span <= 0 ? 0 : Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span));
        const v = p * (n - 1);
        el.style.setProperty("--pk-p", String(v));
        // 오른쪽 카드 윗선 = 왼쪽 맨 위 문구("INFACT. DIAGNOSIS") 윗선, 아랫선 = 왼쪽 버튼 아랫선
        const lead = el.querySelector<HTMLElement>(".pk-lead"), btn = el.querySelector<HTMLElement>(".pk-sbtn"), view = el.querySelector<HTMLElement>(".pk-sview");
        if (lead && btn && view) {
          const top = lead.getBoundingClientRect().top, bottom = btn.getBoundingClientRect().bottom;
          const z = el.getBoundingClientRect().height / el.offsetHeight; // html zoom 배율(1 또는 0.8) — 화면 px 를 CSS px 로 환산
          el.style.setProperty("--pk-top", `${Math.round((top - view.getBoundingClientRect().top) / z)}px`);
          el.style.setProperty("--ch", `${Math.round((bottom - top) / z)}px`);
        }
        setActive(Math.round(v));
      } else if (mob === "f") {
        // 모바일 f: 카드를 전부 아래로 나열 — 탭 바로 아래에 닿아 있는 카드가 활성 탭 (탭을 눌러 이동하는 동안은 잠시 건너뜀)
        if (performance.now() < tapLock.current) return;
        const bar = el.querySelector<HTMLElement>(".pk-h");
        const line = (bar ? bar.getBoundingClientRect().bottom : 100) + 24;
        let best = 0;
        cards.current.forEach((c, i) => { if (c && c.getBoundingClientRect().top <= line) best = i; });
        setActive(best);
      } else if (mob) {
        return; // 모바일 시안: 활성 항목은 탭·스와이프로만 바뀜 (아래 effect)
      } else {
        const mid = window.innerHeight * 0.5;
        let best = 0, bestD = Infinity;
        cards.current.forEach((c, i) => {
          if (!c) return;
          const r = c.getBoundingClientRect();
          const d = mid < r.top ? r.top - mid : mid > r.bottom ? mid - r.bottom : 0;
          if (d < bestD) { bestD = d; best = i; }
        });
        setActive(best);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [variant, n, mob]);

  // 모바일 시안 b: 카드 줄을 옆으로 밀면 가운데에 온 카드가 활성. 활성 탭은 항상 메뉴 가운데로 (2026-10-22)
  useEffect(() => {
    const el = wrap.current;
    if (variant !== "stack" || !mob || !el) return;
    const track = el.querySelector<HTMLElement>(".pk-scards");
    if (!track || mob !== "b") return;
    let raf = 0;
    const onScroll = () => {
      if (raf || !matchMedia("(max-width: 767px)").matches) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bestD = Infinity;
        cards.current.forEach((c, i) => { if (!c) return; const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => { track.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [variant, mob, n]);
  // 모바일 시안 a·c: 카드 영역을 좌우로 밀면 다음/이전 항목으로 (2026-10-22). 세로 스크롤과 구분하려고 가로 이동이 세로보다 확실히 클 때만
  useEffect(() => {
    const el = wrap.current;
    const view = el?.querySelector<HTMLElement>(".pk-sview");
    if (variant !== "stack" || !mob || mob === "b" || mob === "f" || !view) return;
    let x0 = 0, y0 = 0, on = false;
    const down = (e: TouchEvent) => { on = true; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; };
    const up = (e: TouchEvent) => {
      if (!on || !matchMedia("(max-width: 767px)").matches) return;
      on = false;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      setActive((c) => Math.min(n - 1, Math.max(0, c + (dx < 0 ? 1 : -1))));
    };
    view.addEventListener("touchstart", down, { passive: true });
    view.addEventListener("touchend", up, { passive: true });
    return () => { view.removeEventListener("touchstart", down); view.removeEventListener("touchend", up); };
  }, [variant, mob, n]);
  useEffect(() => {
    const el = wrap.current;
    if (!mob || !el || !matchMedia("(max-width: 767px)").matches) return;
    const row = el.querySelector<HTMLElement>(".pk-sgroups");
    const chip = row?.querySelector<HTMLElement>('.pk-sitem[data-on="1"]');
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [active, mob]);

  // 아이패드 가로: 사파리는 html zoom 아래에서 vw·vh·svh 를 크롬과 다르게 계산해(툴바 높이도 빠짐) 04 섹션이 화면보다 커지고 헤더·아래쪽에 잘렸다.
  // 그래서 이 구간만 단위(vw·vh)를 쓰지 않고, 실제 화면 크기를 읽어 --ipad-w / --ipad-h(CSS px)로 넘긴다. 쓰는 곳: globals.css 의 html[data-ipad-land]
  useEffect(() => {
    if (variant !== "stack") return;
    const root = document.documentElement;
    const mq = matchMedia("(min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) and (pointer: coarse)");
    let lastW = 0, lastH = 0;
    const apply = () => {
      if (!mq.matches) {
        root.removeAttribute("data-ipad-land");
        root.style.removeProperty("--ipad-w");
        root.style.removeProperty("--ipad-h");
        lastW = lastH = 0;
        return;
      }
      const w = window.innerWidth, h = window.innerHeight;
      // 사파리 주소창이 접혔다 펴지며 높이가 조금씩 변할 때는 레이아웃을 흔들지 않는다
      if (w === lastW && Math.abs(h - lastH) < 120) return;
      lastW = w; lastH = h;
      const zi = zoomInv();
      root.setAttribute("data-ipad-land", "");
      root.style.setProperty("--ipad-w", `${w * zi}px`);
      root.style.setProperty("--ipad-h", `${h * zi}px`);
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
      root.removeAttribute("data-ipad-land");
      root.style.removeProperty("--ipad-w");
      root.style.removeProperty("--ipad-h");
    };
  }, [variant]);

  // stack 자동 순환 (2026-10-14): 화면이 고정된 동안 3.5초마다 다음 항목으로(제목 단어·카드·목록이 함께 바뀜), 마지막 다음은 처음으로 계속 반복.
  // 사용자가 스크롤·터치·클릭·키 입력을 하면 7초, 카드 위에 마우스가 있는 동안, 움직임 줄이기 설정일 때는 쉰다. PC 만.
  useEffect(() => {
    const el = wrap.current;
    if (variant !== "stack" || !el || n < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lastInput = 0, hover = false;
    const touch = () => { lastInput = performance.now(); };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; };
    const evs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    evs.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const view = el.querySelector(".pk-sview");
    view?.addEventListener("pointerenter", enter);
    view?.addEventListener("pointerleave", leave);
    const id = window.setInterval(() => {
      if (document.hidden || hover || performance.now() - lastInput < 7000 || !matchMedia("(min-width: 768px)").matches) return;
      const rect = el.getBoundingClientRect();
      const span = el.getBoundingClientRect().height - window.innerHeight;
      if (rect.top > 1 || -rect.top > span) return; // 고정 구간 밖
      const idx = Math.round((-rect.top / span) * (n - 1));
      const next = (idx + 1) % n;
      window.scrollTo({ top: window.scrollY + rect.top + (span * next) / (n - 1), behavior: "smooth" });
    }, 3500);
    return () => {
      window.clearInterval(id);
      evs.forEach((e) => window.removeEventListener(e, touch));
      view?.removeEventListener("pointerenter", enter);
      view?.removeEventListener("pointerleave", leave);
    };
  }, [variant, n]);

  // 아코디언: 접힌 그룹 번호 기록. 활성 항목이 접힌 그룹으로 넘어가면 그 그룹을 자동으로 연다.
  const [closed, setClosed] = useState<Record<number, boolean>>({});
  const groupOf = items.reduce<number[]>((a, it, i) => { a.push(it.heading || i === 0 ? (a.length ? a[i - 1] + 1 : 0) : a[i - 1]); return a; }, []);
  const activeGroup = groupOf[active];
  useEffect(() => { setClosed((c) => (c[activeGroup] ? { ...c, [activeGroup]: false } : c)); }, [activeGroup]);

  const cur = items[active];
  if (variant === "stack") {
    const groups: { heading?: string; list: { it: PickerItem; i: number }[] }[] = [];
    items.forEach((it, i) => { if (it.heading || !groups.length) groups.push({ heading: it.heading, list: [] }); groups[groups.length - 1].list.push({ it, i }); });
    const go = (i: number) => {
      const el = wrap.current;
      if (el && matchMedia("(min-width: 768px)").matches) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const span = el.getBoundingClientRect().height - window.innerHeight;
        window.scrollTo({ top: top + (span * i) / Math.max(1, n - 1), behavior: "smooth" });
      } else if (mob === "b") {
        const track = el?.querySelector<HTMLElement>(".pk-scards"), c = cards.current[i];
        if (track && c) track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
        setActive(i);
      } else if (mob) {
        setActive(i);
        // f: 카드가 전부 나열돼 있으므로, 눌러진 카드의 윗선이 따라다니는 탭(헤더 48px 아래) 바로 밑에 오도록 스크롤
        if (mob === "f") {
          const tabs = el?.querySelector<HTMLElement>(".pk-sgroups"), c = cards.current[i];
          if (!tabs || !c) return;
          tapLock.current = performance.now() + 900;
          window.scrollTo({ top: window.scrollY + c.getBoundingClientRect().top - (48 + tabs.offsetHeight + 8), behavior: "smooth" });
        }
      } else cards.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    return (
      <section id={id} className={`pk border-t border-hairline scroll-mt-20 pk-stack ${bg}`} data-step={active} data-acc={acc} data-mob={mob} data-btn={btn} data-igbg={igbg} data-igtx={igtx} data-ytchip={ytchip}>
        <div ref={wrap} className="pk-swrap" style={{ "--pk-n": n, "--pk-p": 0 } as React.CSSProperties}>
        <div className="pk-sstick">
        {items.map((it, i) => it.bg ? <div key={it.label} className="pk-fullbg" data-on={i === active ? "1" : "0"} aria-hidden="true">{it.bg}</div> : null)}
        <div className="container-x pk-sgrid">
          <div className="pk-sleft">
            <div className="pk-sleft-in">
              <p className="pk-lead">{leadLines(lead)}</p>
              <h2 className="pk-h">
                <span className="pk-h1">우리병원은</span>
                <span className="pk-h2">
                  <b key={active} className="pk-word">{cur.need}</b>
                  <span>{josa(cur.need)} 필요해요</span>
                </span>
              </h2>
              <div className="pk-sgroups">
                {groups.map((g, gi) => (
                  <div key={gi} className="pk-sgroup">
                    {g.heading && (
                      <button type="button" className="pk-shead" aria-expanded={!closed[gi]} onClick={() => setClosed((c) => ({ ...c, [gi]: !c[gi] }))}>
                        <span>{g.heading}</span>
                        <em className="pk-scount" aria-hidden="true">{g.list.length}</em>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                      </button>
                    )}
                    <div className="pk-sbody" data-open={closed[gi] ? "0" : "1"}>
                      <ul>
                        {g.list.map(({ it, i }) => (
                          <li key={it.label}>
                            <button type="button" className="pk-sitem" data-on={i === active ? "1" : "0"} onClick={() => go(i)} aria-pressed={i === active} tabIndex={closed[gi] ? -1 : 0}>
                              <i aria-hidden="true" />
                              {it.icon && <em className="pk-sico" aria-hidden="true">{it.icon}</em>}
                              <span className="pk-sl">{lbl(it)}</span>
                              <span className="pk-ss" aria-hidden="true">{it.need}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={cta.href} className="btn-sm-line pk-sbtn">{cta.label}<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 6 }}><path d="M9 6l6 6-6 6" /></svg></Link>
            </div>
          </div>
          <div className="pk-sview"><div className="pk-scards">
            {items.map((it, i) => (
              <article key={it.label} id={`${id}-item-${String(i + 1).padStart(2, "0")}`} ref={(el) => { cards.current[i] = el; }} className="pk-scard" data-on={i === active ? "1" : "0"} data-rel={i < active ? "-1" : i > active ? "1" : "0"} data-wide={it.wide ? "1" : "0"} data-kind={it.kind}>
                <div className="pk-scard-bg">{it.visual}</div>
                <div className="pk-scard-top">
                </div>
                <div className="pk-scard-bottom">
                  {it.eyebrow && <p className="pk-eb">{it.eyebrow}</p>}
                  <h3>{lbl(it)}</h3>
                  {it.below}
                </div>
              </article>
            ))}
          </div></div>
        </div>
        </div>
        </div>
      </section>
    );
  }
  if (variant) {
    // 레이아웃 시안(a·b·c): 래퍼 없이 평평한 구조 — 배치는 globals.css 의 .pk-v-* grid-areas 가 정한다 (2026-10-13)
    const groups: { heading?: string; list: { it: PickerItem; i: number }[] }[] = [];
    items.forEach((it, i) => { if (it.heading || !groups.length) groups.push({ heading: it.heading, list: [] }); groups[groups.length - 1].list.push({ it, i }); });
    return (
      <section id={id} className={`pk border-t border-hairline scroll-mt-20 pk-v-${variant} ${bg}`}>
        <div ref={wrap} className="pk-wrap" style={{ "--pk-n": n } as React.CSSProperties}>
          <div className="pk-stick">
            <div className="container-x pk-grid pk-gridv">
              <p className="pk-lead">{lead}</p>
              {sub && <p className="pk-sub">{sub}</p>}
              <h2 className="pk-h">
                <span className="pk-h1">우리 병원은</span>
                <span className="pk-h2">
                  <b key={active} className="pk-word">{cur.need}</b>
                  <span>{josa(cur.need)} 필요해요</span>
                </span>
              </h2>
              <div className="pk-groups">
                {groups.map((g, gi) => (
                  <div key={gi} className="pk-group">
                    {g.heading && <p className="pk-listlabel">{g.heading}</p>}
                    <ul className="pk-glist">
                      {g.list.map(({ it, i }) => (
                        <li key={it.label}>
                          <button type="button" className="pk-item" data-on={i === active ? "1" : "0"} onClick={() => pick(i)} aria-pressed={i === active}>
                            <em aria-hidden="true">{String(i + 1).padStart(2, "0")}</em>
                            <span>{lbl(it)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="pk-panel">
                {items.map((it, i) => (
                  <div key={it.label} className="pk-vis" data-on={i === active ? "1" : "0"} aria-hidden={i !== active}>{it.visual}</div>
                ))}
              </div>
              <div className="pk-belows" aria-live="polite">
                {items.map((it, i) => <div key={it.label} className="pk-below" data-on={i === active ? "1" : "0"} aria-hidden={i !== active}>{it.below}</div>)}
              </div>
              <Link href={cta.href} className="pk-cta">{cta.label}</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id={id} className={`pk border-t border-hairline scroll-mt-20 ${bg}`}>
      <div ref={wrap} className="pk-wrap" style={{ "--pk-n": n } as React.CSSProperties}>
        <div className="pk-stick">
          <div className="container-x pk-grid">
            <div className="pk-left">
              <p className="pk-lead">{lead}</p>
              {sub && <p className="pk-sub">{sub}</p>}
              <h2 className="pk-h">
                <span className="pk-h1">우리 병원은</span>
                <span className="pk-h2">
                  <b key={active} className="pk-word">{cur.need}</b>
                  <span>{josa(cur.need)} 필요해요</span>
                </span>
              </h2>
              <ul className="pk-list">
                {items.map((it, i) => (
                  <li key={it.label} className={it.heading ? "pk-grouped" : undefined}>
                    {it.heading && <p className="pk-listlabel">{it.heading}</p>}
                    <button type="button" className="pk-item" data-on={i === active ? "1" : "0"} onClick={() => pick(i)} aria-pressed={i === active}>
                      <i aria-hidden="true" />
                      <span>{lbl(it)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Link href={cta.href} className="pk-cta">{cta.label}</Link>
            </div>

            <div className="pk-right" aria-live="polite">
              <div className="pk-panel">
                {items.map((it, i) => (
                  <div key={it.label} className="pk-vis" data-on={i === active ? "1" : "0"} aria-hidden={i !== active}>{it.visual}</div>
                ))}
              </div>
              <div className="pk-belows">
                {items.map((it, i) => <div key={it.label} className="pk-below" data-on={i === active ? "1" : "0"} aria-hidden={i !== active}>{it.below}</div>)}
              </div>
              <div className="pk-dots" aria-hidden="true">
                {items.map((it, i) => <i key={it.label} data-on={i === active ? "1" : "0"} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
