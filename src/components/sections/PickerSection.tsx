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

export interface PickerItem {
  label: string;       // 목록에 보이는 이름
  need: string;        // "우리 병원은 ___이 필요해요" 에 들어갈 단어
  heading?: string;    // 이 항목 위에 붙는 목록 머리글 (예: "집중 공략 부스터 4종")
  visual: React.ReactNode;   // 오른쪽 그림 패널 안
  below?: React.ReactNode;   // 패널 아래 설명
}

/** 받침이 있으면 "이", 없으면 "가" */
function josa(word: string) {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return "이";
  return code % 28 === 0 ? "가" : "이";
}

export default function PickerSection({
  id, bg, lead, sub, items, cta,
}: {
  id: string; bg: string; lead: string; sub?: string;
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
      const span = el.offsetHeight - window.innerHeight;
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
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + (span * (i + 0.5)) / n, behavior: "smooth" });
    } else {
      setActive(i);
    }
  };

  const cur = items[active];
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
                      <span>{it.label}</span>
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
