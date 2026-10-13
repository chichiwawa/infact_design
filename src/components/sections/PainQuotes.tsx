"use client";

/**
 * 서비스 01 — 고민 인용문 (2026-09-17 3D 공간 리뉴얼, 시안: design/demos/pain-quotes-3d.html)
 *  - 데스크탑(≥1024): 850vh 스크롤 구간(진행 600 + 여유 50 + 덮임 100, 나머지 100 은 sticky 자체; 2026-09-23 진행 300→600), sticky.
 *    곡면 벽(장식 타일) 앞에 고민 카드가 뒤섞여 떠 있다가 윗줄부터 한 장씩 자기 카테고리 열로 꽂히고(유리 톤 줄로 바뀜),
 *    정렬이 끝나면 유입 → 전환 → 브랜딩 타이틀이 스크롤과 무관하게 차례로 뜬다.
 *    마지막 100vh 동안 다음 섹션(윗모서리 둥근 시트)이 이 화면을 덮으며 올라온다 — globals.css `.pain + .pain-m + section`.
 *  - 그 아래(<1024, 2026-09-21 리뉴얼): 같은 연출을 세로로. 590svh sticky(2026-09-23 진행 1.7→3.4 화면). 카드가 공간에 떠 있다가
 *    유입 → 전환 → 브랜딩 한 그룹씩 화면 가운데로 꽂히고(정렬되면 타이틀이 뜸), 다음 그룹이 올 때 위로 빠진다.
 *  프레임마다 도는 값은 React state 가 아니라 ref + style 로 직접 쓴다 (리렌더 없음).
 */
import { useEffect, useRef } from "react";
import type { PainQuotesData } from "@/lib/sections";

/** 공간 속 시작 위치 (1440×900 기준 px, 화면 중앙 원점). 세 단계 깊이, 카테고리가 뒤섞인 채 서로 겹치지 않게. */
const SLOTS = [
  { x: 440, y: -30, z: 0, blue: true },
  { x: 433, y: 145, z: 130, blue: true },
  { x: -536, y: 363, z: -260, blue: true },
  { x: 197, y: 335, z: -90, blue: true },
  { x: -71, y: 250, z: -260, blue: true },
  { x: -391, y: 118, z: 130, blue: false },
  { x: 60, y: 80, z: 0, blue: false },
  { x: -480, y: -60, z: 0, blue: true },
  { x: 511, y: 319, z: -90, blue: false },
];
const COL_W = 400, COL_GAP = 44, ROW_H = 84;
/** 모바일 시작 위치 (390×760 기준 px, 화면 중앙 원점). 좌우로 엇갈리며 아래로 내려가는 배치, 깊이는 번갈아.
 *  첫 그룹이 꽂히기 시작하면 나머지는 자기 쪽(x 부호) 화면 밖으로 비켜났다가 차례가 오면 그쪽에서 날아 들어온다. */
const SLOTS_M = [
  { x: -70, y: -150, z: -60, blue: true },
  { x: 80, y: -94, z: -200, blue: true },
  { x: -45, y: -38, z: 90, blue: true },
  { x: 90, y: 18, z: -80, blue: false },
  { x: -80, y: 74, z: -240, blue: true },
  { x: 70, y: 120, z: 20, blue: false },
  { x: -75, y: 198, z: -140, blue: true },
  { x: 70, y: 226, z: 60, blue: true },
  { x: -95, y: 300, z: -60, blue: false },
];
/** 모바일 타임라인(진행도 0~1): 그룹 k 는 START_M + k*STEP_M 에 출발, ENTER_M 동안 꽂히고, 다음 그룹 출발과 함께 EXIT_M 동안 빠진다 */
const START_M = 0.06, STEP_M = 0.31, ENTER_M = 0.16, EXIT_M = 0.06;
/** 마지막 그룹(브랜딩)이 켜지는 시점: START_M + 2*STEP_M + ENTER_M = 0.84 (카테고리 3개 기준) */
/** ps(진행도)를 컨테이너 전체 스크롤 가능 거리(el.offsetHeight−inner.offsetHeight, ≈3.2*H)에 그대로 묶으면 진행도 1.0 지점이
 *  다음 섹션이 덮어오는 구간(globals.css `.pain-m + section`, 마지막 100svh)의 "끝"과 겹쳐, 브랜딩 라벨이 켜지는 ps=0.84 시점이
 *  이미 그 덮임 구간 중간(ps 0.6875~1)에 들어가 브랜딩이 절반쯤 가려진 채 나타나는 버그가 있었다(2026-09-22).
 *  PC 버전이 `-rect.top / (3*H)`로 진행도를 고정 거리에만 묶어 여유 50vh를 확보하는 것과 같은 원리로,
 *  여기서도 진행도를 스크롤 전체가 아닌 고정 1.7*H 로만 묶어 브랜딩이 켜진 뒤 덮임 구간(2.2*H~)이 시작되기 전까지 정지 여유를 둔다. */
const CONTENT_VH_M = 3.4;
/** PC 진행 구간(vh). 2026-09-23 "한 번 스크롤에 다 지나간다" → 3 → 4.5 → 6 (모바일 1.7 → 2.6 → 3.4, 사용자 재요청으로 2배). 섹션 높이는 globals.css .pain(850vh)/.pain-m(590svh) 과 함께 움직인다. */
const PROGRESS_VH = 6;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** 곡면 벽: 원통 안쪽 면에 벽돌 쌓기로 놓인 타일. 일부에만 고민 문구가 작게 적힌다 (장식). */
function wallTiles(quotes: PainQuotesData["quotes"], R: number, rows: number, cols: number, stepDeg: number) {
  const tiles = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const n = r * cols + c, lit = n % 11 === 4;
    const deg = (c - (cols - 1) / 2 + (r % 2 ? 0.5 : 0)) * stepDeg, y = (r - (rows - 1) / 2) * 112;
    tiles.push(
      <div key={n} className={lit ? "pain-tile lit" : "pain-tile"} style={{ transform: `rotateY(${deg}deg) translate3d(0, ${y}px, ${-R}px)` }}>
        {(n % 3 === 1 || lit) && quotes.length ? quotes[(n * 5 + r) % quotes.length].text : null}
      </div>,
    );
  }
  return tiles;
}

function Card({ text }: { text: string }) {
  return (
    <div className="pain-shell">
      <div className="pain-core">
        <span className="pain-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 7H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3c0 1.7-1 3-3 3v2c3.3 0 5-2.2 5-5V8a1 1 0 0 0-1-1zm10 0h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3c0 1.7-1 3-3 3v2c3.3 0 5-2.2 5-5V8a1 1 0 0 0-1-1z" /></svg>
        </span>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Label({ text, index }: { text: string; index: number }) {
  return (
    <div className="pain-lab" style={{ "--i": index } as React.CSSProperties}>
      <div className="pain-arrow" aria-hidden="true">↓</div>
      <div className="pain-word">{text}</div>
    </div>
  );
}

export default function PainQuotes({ data }: { data: PainQuotesData }) {
  const ref = useRef<HTMLElement>(null), refM = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wallScene = el.querySelector<HTMLElement>(".pain-wall")!, wall = wallScene.firstElementChild as HTMLElement;
    const world = el.querySelector<HTMLElement>(".pain-cards > .pain-world")!;
    const labels = [...el.querySelectorAll<HTMLElement>(".pain-lab")];
    const cards = [...el.querySelectorAll<HTMLElement>(".pain-q")].map((node, i) => {
      const q = data.quotes[i];
      const ci = Math.max(0, data.categories.findIndex((c) => c.key === q.category));
      const qi = data.quotes.slice(0, i).filter((x) => x.category === q.category).length;
      return { node, ci, qi, nat: COL_W, s: SLOTS[i % SLOTS.length] };
    });
    const mid = (data.categories.length - 1) / 2;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, ps = -1, mx = 0, my = 0, mxs = 0, mys = 0, lw = 0, lh = 0, labelsOn = false, dirty = true;

    /* 떠 있을 때의 카드 폭 = 문구 길이만큼 (굵은 글자 기준). 웹폰트가 늦게 오면 다시 잰다. */
    const measure = () => {
      cards.forEach((c) => { const w = c.node.style.width; c.node.style.width = "max-content"; c.nat = Math.min(COL_W, c.node.offsetWidth + 2); c.node.style.width = w; });
      dirty = true;
    };
    measure();
    document.fonts?.ready.then(measure);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const W = window.innerWidth, H = window.innerHeight;
      if (W < 1024) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > H) return;
      const p = clamp(-rect.top / (PROGRESS_VH * H));
      /* 빨리 내려 이미 덮이는 구간에 들어왔으면: 남은 정렬을 빠르게 끝내고 타이틀을 지연 없이 띄운다 */
      if (-rect.top > el.offsetHeight - 2.25 * H && ps < 0.64) el.classList.add("fast"); else if (ps < 0.5) el.classList.remove("fast");
      const next = reduce || ps < 0 ? p : ps + (p - ps) * (el.classList.contains("fast") ? 0.3 : 0.1);
      const moved = dirty || Math.abs(next - ps) > 0.0002 || lw !== W || lh !== H;
      ps = next; lw = W; lh = H; dirty = false;
      mxs += (mx - mxs) * 0.05; mys += (my - mys) * 0.05;

      /* 벽: 느린 자체 회전 + 마우스 시차, 스크롤하면 앞으로 밀려오며 사라진다 */
      const gAll = 1 - ease(clamp(ps / 0.6)), wp = ease(clamp(ps / 0.5)), drift = reduce ? 0 : Math.sin(now / 9000) * 2.2;
      wall.style.transform = `translateZ(${wp * 700}px) rotateY(${(drift + mxs * 5).toFixed(3)}deg) rotateX(${(-mys * 2.5).toFixed(3)}deg)`;
      world.style.transform = reduce ? "none" : `rotateY(${(mxs * 3 * gAll).toFixed(3)}deg) rotateX(${(-mys * 2 * gAll).toFixed(3)}deg)`;

      /* 타이틀은 스크롤에 묶지 않는다. 켜짐 .64 / 꺼짐 .58 — 경계에서 깜빡이지 않게 간격을 둔다 */
      if (ps > 0.64 && !labelsOn) { labelsOn = true; labels.forEach((l) => l.classList.add("on")); }
      else if (ps < 0.58 && labelsOn) { labelsOn = false; labels.forEach((l) => l.classList.remove("on")); }
      if (!moved) return;

      wallScene.style.opacity = String(1 - wp);
      const sx = clamp(W / 1440, 0.72, 1.3), sy = clamp(H / 900, 0.78, 1.15);
      /* 정렬 상태는 열 폭을 고정하고 화면에 맞춰 통째로 축소 (좁은 화면에서 문구가 넘치지 않게) */
      const sc = Math.min(clamp(H / 900, 0.78, 1), (W - 64) / (COL_W * data.categories.length + COL_GAP * (data.categories.length - 1)));
      const scFloat = Math.min(sc, clamp(W / 1440, 0.7, 1));
      cards.forEach(({ node, ci, qi, nat, s }, i) => {
        /* 윗줄부터 한 장씩 차례로 출발 — 이동 중엔 앞으로 살짝 떠올라 다른 카드 위를 지나간다 */
        const t = clamp((ps - i * 0.035) / 0.32), g = 1 - ease(t), lift = Math.sin(Math.PI * t) * 170, c = clamp((g - 0.1) / 0.25);
        node.style.setProperty("--g", g.toFixed(4));
        node.style.setProperty("--c", c.toFixed(3));
        node.style.setProperty("--tc", clamp((c - 0.35) / 0.3).toFixed(3));
        const fx = (ci - mid) * (COL_W + COL_GAP) * sc, fy = (-46 + qi * ROW_H) * sc;
        const x = fx + (s.x * sx - fx) * g, y = fy + (s.y * sy - fy) * g, w = COL_W + (nat - COL_W) * g;
        /* 기울기 규칙은 하나: 중앙을 바라본다 */
        const ry = (-s.x / 500) * 24 * g * g, rx = (s.y / 400) * 5 * g * g;
        node.style.width = `${w}px`; node.style.marginLeft = `${-w / 2}px`;
        node.style.transform = `translate3d(${x}px, calc(${y}px - 50%), ${s.z * g + lift}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc + (scFloat - sc) * g})`;
      });
      const rows = Math.max(...data.categories.map((c) => data.quotes.filter((q) => q.category === c.key).length), 1);
      labels.forEach((l, ci) => {
        l.style.transform = `translate3d(${(ci - mid) * (COL_W + COL_GAP) * sc}px, calc(${(-46 + rows * ROW_H + 30) * sc}px - 50%), 0) scale(${sc})`;
      });
    };
    const onMove = (e: PointerEvent) => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [data]);


  /* 모바일·태블릿 */
  useEffect(() => {
    const el = refM.current;
    if (!el) return;
    const inner = el.querySelector<HTMLElement>(".pain-inner")!;
    const wallScene = el.querySelector<HTMLElement>(".pain-wall")!, wall = wallScene.firstElementChild as HTMLElement;
    const labels = [...el.querySelectorAll<HTMLElement>(".pain-lab")];
    const cards = [...el.querySelectorAll<HTMLElement>(".pain-q")].map((node, i) => {
      const q = data.quotes[i];
      const ci = Math.max(0, data.categories.findIndex((c) => c.key === q.category));
      const qi = data.quotes.slice(0, i).filter((x) => x.category === q.category).length;
      return { node, ci, qi, nat: 300, s: SLOTS_M[i % SLOTS_M.length] };
    });
    const K = data.categories.length;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const headline = el.querySelector<HTMLElement>(".pain-headline")!;
    let raf = 0, ps = -1, lw = 0, lh = 0, rowH = 60, colW = 300, hlB = 200, dirty = true;
    const labelOn: boolean[] = data.categories.map(() => false);

    /* 떠 있을 때의 카드 폭 = 문구 길이만큼. 정렬 줄 높이는 실제로 재서 정한다 (좁은 폰에서 두 줄이 되면 그만큼 벌림) */
    const measure = () => {
      colW = Math.min(window.innerWidth - 32, 380);
      let maxH = 0;
      cards.forEach((c) => {
        const w = c.node.style.width;
        c.node.style.width = "max-content"; c.nat = Math.min(colW, c.node.offsetWidth + 2);
        c.node.style.width = `${colW}px`; maxH = Math.max(maxH, c.node.offsetHeight);
        c.node.style.width = w;
      });
      rowH = maxH + 8;
      hlB = headline.offsetTop + headline.offsetHeight;
      dirty = true;
    };
    measure();
    document.fonts?.ready.then(measure);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const W = window.innerWidth, H = window.innerHeight;
      if (W >= 1024) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > H) return;
      if (lw !== W || lh !== H) measure();
      const p = clamp(-rect.top / (CONTENT_VH_M * H));
      const next = reduce || ps < 0 ? p : ps + (p - ps) * 0.14;
      const moved = dirty || Math.abs(next - ps) > 0.0002 || lw !== W || lh !== H;
      ps = next; lw = W; lh = H; dirty = false;

      const wp = ease(clamp(ps / 0.4));

      /* 타이틀: 그룹이 다 꽂히면 켜짐(.on), 되감으면 조금 앞에서 꺼짐 */
      labels.forEach((l, k) => {
        const s = START_M + k * STEP_M;
        if (ps > s + ENTER_M && !labelOn[k]) { labelOn[k] = true; l.classList.add("on"); }
        else if (ps < s + ENTER_M - 0.03 && labelOn[k]) { labelOn[k] = false; l.classList.remove("on"); }
      });
      if (!moved) return;

      /* 2026-09-23 모바일 렉: 벽(타일 63장, 3D)을 매 프레임 회전시키면 화면 전체 레이어를 계속 다시 그린다 → 스크롤이 바뀐 프레임에만, 자체 회전 없이 */
      wall.style.transform = `translateZ(${wp * 500}px)`;
      wallScene.style.opacity = String(1 - wp);
      const sh = inner.offsetHeight;
      /* 떠 있는 카드 무리는 제목 아래 52px 에서 시작해 화면 아래 40px 까지를 쓴다 (설계 높이 505 = 슬롯 y 범위 450 + 카드 한 장) */
      const sx = clamp(W / 390, 0.85, 1.4), fieldTop = hlB + 52, sy = clamp((sh - 40 - fieldTop) / 505, 0.72, 1.1);
      /* 정렬 그룹(줄 3개 + 타이틀)이 화면 아래로 넘치지 않게 통째로 축소 */
      const rows = Math.max(...data.categories.map((c) => data.quotes.filter((q) => q.category === c.key).length), 1);
      const Y0 = -50, labY = Y0 + rows * rowH + 26;
      const sc = clamp((sh / 2 - 24) / (labY + 84), 0.78, 1);
      const scFloat = 0.72 * sc;
      cards.forEach(({ node, ci, qi, nat, s }) => {
        const start = START_M + ci * STEP_M;
        const t = clamp((ps - start - qi * 0.035) / (ENTER_M - 2 * 0.035)), g = 1 - ease(t), lift = Math.sin(Math.PI * t) * 120, c = clamp((g - 0.1) / 0.25);
        const x = ci < K - 1 ? ease(clamp((ps - start - STEP_M) / EXIT_M)) : 0;
        node.style.setProperty("--g", g.toFixed(4));
        node.style.setProperty("--c", c.toFixed(3));
        node.style.setProperty("--tc", clamp((c - 0.35) / 0.3).toFixed(3));
        const fy = (Y0 + qi * rowH) * sc - x * 70;
        /* 차례가 안 된 카드는 첫 그룹이 출발하면 자기 쪽 화면 밖으로 비켜난다 (pk) */
        const side = s.x < 0 ? -1 : 1, pk = ci === 0 ? 0 : ease(clamp((ps - START_M) / 0.14));
        const flx = s.x * sx + pk * (side * (W / 2 + 260) - s.x * sx);
        const px = flx * g, py = fy + (fieldTop - sh / 2 + (s.y + 177) * sy - fy) * g, w = colW + (nat - colW) * g;
        const ry = ((-s.x / 150) * 18 - side * 30 * pk) * g * g, rx = (s.y / 400) * 5 * g * g;
        node.style.width = `${w}px`; node.style.marginLeft = `${-w / 2}px`;
        node.style.opacity = String(1 - x);
        node.style.transform = `translate3d(${px}px, calc(${py}px - 50%), ${s.z * g + lift}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc + (scFloat - sc) * g})`;
      });
      labels.forEach((l, k) => {
        const x = k < K - 1 ? ease(clamp((ps - START_M - (k + 1) * STEP_M) / EXIT_M)) : 0;
        l.style.opacity = String(1 - x);
        l.style.transform = `translate3d(0, calc(${labY * sc - x * 70}px - 50%), 0) scale(${sc})`;
      });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [data]);


  return (
    <>
      {/* 데스크탑 */}
      <section ref={ref} className="pain hidden lg:block bg-night text-white on-dark" aria-label={data.headline}>
        <div className="pain-inner">
          <div className="pain-scene pain-wall" aria-hidden="true"><div className="pain-world">{wallTiles(data.quotes, 1700, 11, 11, 13.5)}</div></div>
          <div aria-hidden="true" className="pain-fog" />
          <h1 className="pain-headline t-h-xl">{data.headline}</h1>
          <div className="pain-scene pain-cards">
            <div className="pain-world">
              {data.quotes.map((q, i) => (
                <div key={q.text} className={`pain-q ${SLOTS[i % SLOTS.length].blue ? "b" : "w"}`} style={{ "--amp": 4 + (i % 3) * 2, "--dur": `${5 + i * 0.7}s`, "--delay": `${-i * 1.3}s` } as React.CSSProperties}>
                  <Card text={q.text} />
                </div>
              ))}
              {data.categories.map((c, ci) => <Label key={c.key} text={c.label} index={ci} />)}
            </div>
          </div>
        </div>
      </section>

      {/* 태블릿·모바일 */}
      <section ref={refM} className="pain-m lg:hidden bg-night text-white on-dark" aria-label={data.headline}>
        <div className="pain-inner">
          <div className="pain-scene pain-wall" aria-hidden="true"><div className="pain-world">{wallTiles(data.quotes, 1100, 7, 9, 20.5)}</div></div>
          <div aria-hidden="true" className="pain-fog" />
          <h1 className="pain-headline t-h-lg">{data.headline}</h1>
          <div className="pain-scene pain-cards">
            <div className="pain-world">
              {data.quotes.map((q, i) => (
                <div key={q.text} className={`pain-q ${SLOTS_M[i % SLOTS_M.length].blue ? "b" : "w"}`} style={{ "--amp": 3 + (i % 3) * 1.5, "--dur": `${5 + i * 0.7}s`, "--delay": `${-i * 1.3}s` } as React.CSSProperties}>
                  <Card text={q.text} />
                </div>
              ))}
              {data.categories.map((c) => <Label key={c.key} text={c.label} index={0} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
