"use client";

/**
 * 03 마케팅 설계 — "성장단계에 맞춘 맞춤형 마케팅 전략" 3카드 레이아웃 (2026-10-22 시안 반영)
 *  위: 영문 라벨 · 제목 · 설명 · 단계 원(01/02/03) / 아래: 단계별 카드 3장(번호 · 제목 · 설명 · 항목 4개 · 상품 버튼)
 *  카드 문구는 pages.json 의 package_steps 항목(heading · desc · features · title)에서 가져온다.
 *  스타일은 package-steps-cards.css. 이전 펼침 패널 버전은 PackageStepsDark.tsx(variant "c") 에 그대로 남아 있음.
 */
import { useState } from "react";
import Link from "next/link";
import type { PackageStepsData } from "@/lib/sections";
import "./package-steps-cards.css";

const no = (i: number) => String(i + 1).padStart(2, "0");

// 항목 아이콘 4종 (말풍선 · 문서 · 사람 · 광고)
const ICONS = [
  <path key="a" d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM8.5 11h.01M12 11h.01M15.5 11h.01" />,
  <path key="b" d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5M10 8h2" />,
  <path key="c" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0" />,
  <path key="d" d="M4 10v4h3l7 4V6L7 10H4zM17 9.5a4 4 0 0 1 0 5" />,
];

const rich = (t: string) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));
const lines = (t: string) => t.split("\n").map((l, i) => <span key={i} className="block">{rich(l)}</span>);

export default function PackageStepsCards({ title, data }: { title: string; data: PackageStepsData }) {
  const [on, setOn] = useState(1); // 처음엔 02(전환 성장형)를 강조
  return (
    <section className="psc on-dark">
      <div className="container-x">
        <div className="psc-head">
          <p className="psc-eyebrow">INFACT. GROWTH DESIGN</p>
          <h2 className="psc-title">{title.split("\n").map((l, i, a) => <span key={i} className="block">{rich(l)}{i === a.length - 1 && <i className="not-italic text-primary">.</i>}</span>)}</h2>
          {data.intro && <p className="psc-intro">{lines(data.intro)}</p>}
          <ol className="psc-steps" aria-label="성장 단계">
            {data.items.map((it, i) => (
              <li key={it.title} data-on={on === i ? 1 : 0}>
                <button type="button" onClick={() => setOn(i)} onMouseEnter={() => setOn(i)}>
                  <span className="psc-dot">{no(i)}</span>
                  <span className="psc-step-name">{it.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="psc-grid">
          {data.items.map((it, i) => (
            <article key={it.title} className="psc-card" data-on={on === i ? 1 : 0} onMouseEnter={() => setOn(i)}>
              <span className="psc-no">{no(i)}</span>
              <h3 className="psc-card-title">{lines(it.heading ?? it.target)}</h3>
              <span className="psc-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <p className="psc-desc">{lines(it.desc ?? it.body)}</p>
              <div className="psc-feats">
                {it.features?.map((f, k) => (
                  <div key={f.title} className="psc-feat">
                    <span className="psc-ico">
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[k % ICONS.length]}</svg>
                    </span>
                    <span className="psc-feat-t"><b>{f.title}</b><small>{f.sub}</small></span>
                  </div>
                ))}
              </div>
              <Link href={data.cta_href} className="psc-btn" >
                {it.title} 상품
                <span className="psc-btn-ar" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 5l7 7-7 7" /></svg>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
