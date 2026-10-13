"use client";

/**
 * CornerRing — 화면 오른쪽 하단에 고정된 "INFACT." 텍스트 링 (CircularText). 2026-09-21 사용자 요청.
 *  - 표시 시점: `from` 번째(0부터) 섹션이 뷰포트 아래에서 올라와 들어오면 나타나고, 다시 위로 올라가면 숨는다.
 *    섹션은 DOM 에서 찾는다(main 아래 최상위 <section> 중 현재 폭에서 보이는 것만 — PainQuotes 는 PC/모바일용 2개를 렌더).
 *    마커 요소를 섹션 사이에 끼우는 방식은 금지 — 서비스 `.pain + .pain-m + section` 덮기 효과가 끊김(50차).
 *  - 글자색: 링 중심 아래 요소가 .on-dark 안이면 흰색, 아니면 잉크색 (Header 와 같은 elementsFromPoint 방식).
 *  - 모바일은 터치를 가리지 않게 pointer-events 없음(호버 가속은 PC 전용).
 *  - 크기: PC 120px(글자 9px·자간 5px) / 모바일 100px(8px·4px) — 2026-09-21 사용자 지정 지름. 반복 단위가
 *    "INFACT. INFACT."(2개 묶음)이라 글자·자간을 같이 줄여야 4개가 원둘레에 들어간다.
 *  - 2026-09-22: 모바일에서는 아예 표시하지 않음 — 좁은 화면에서 카드 사이로 겹쳐 보여 디자인상 산만하다는 사용자 지적
 *    (서비스 02 패키지 카드 뒤로 비치는 게 특히 눈에 띔). 768px(md) 미만이면 렌더 자체를 생략. PC(≥768)는 기존 그대로.
 */
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import CircularText, { PRESET_FONT } from "./CircularText";

function findSection(index: number): HTMLElement | null {
  const all = [...document.querySelectorAll<HTMLElement>("main > section, main > div > section")];
  const visible = all.filter((el) => el.getClientRects().length > 0);
  return visible[index] ?? null;
}

export default function CornerRing({ from }: { from: number }) {
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [dark, setDark] = useState(false);
  const [md, setMd] = useState(true);
  const diameter = md ? 120 : 100;
  const font = md ? PRESET_FONT : { ...PRESET_FONT, fontSize: "8px", letterSpacing: "4px" };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setMd(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let target: HTMLElement | null = null;
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      target ??= findSection(from);
      if (!target) return;
      setShown(target.getBoundingClientRect().top <= window.innerHeight);
      if (wrap) {
        const r = wrap.getBoundingClientRect();
        const under = document
          .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
          .find((el) => !wrap.contains(el));
        setDark(Boolean(under && under.closest(".on-dark")));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => { target = null; onScroll(); }; // 폭이 바뀌면 보이는 섹션 집합이 달라질 수 있어 다시 찾는다
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname, from]);

  if (!md) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      data-corner-ring
      data-shown={shown ? "1" : "0"}
      className={`fixed right-4 bottom-4 md:right-[calc(var(--edge)+72px)] md:bottom-8 z-40 pointer-events-none md:pointer-events-auto transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        shown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-90"
      }`}
      style={{ width: diameter, height: diameter }}
    >
      <CircularText diameter={diameter} font={font} color={dark ? "#FFFFFF" : "var(--color-ink)"} />
    </div>
  );
}
