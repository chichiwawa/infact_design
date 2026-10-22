"use client";

/**
 * 03 마케팅 설계 — "문제(어떤 병원) → 결과(유입 구축형)" 흐름이 한눈에 보이게 한 레이아웃 시안 (2026-10-22)
 *  d: 펼침 패널 — 접힌 패널에도 문제 문구가 보이고, 펼치면 문제 → 해결 두 단으로 나뉨
 *  e: 가로 3줄 — 한 줄 = 문제 → 화살표 → 결과, 호버 없이 3개가 전부 보임
 *  f: 3열 카드 — 사진 아래 "문제" 칸과 "해결" 칸을 화살표로 이어 붙임
 * 시안 전용(SectionRenderer 연결 없음). 데이터는 pages.json 의 package_steps.
 */
import { useState } from "react";
import Link from "next/link";
import type { PackageStepsData } from "@/lib/sections";
import { Head } from "./PackageStepsDark";
import "./package-steps-dark.css";
import "./package-steps-flow.css";

const no = (i: number) => String(i + 1).padStart(2, "0");
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function PackageStepsFlow({ title, data, variant }: { title: string; data: PackageStepsData; variant: "d" | "e" | "f" }) {
  const [on, setOn] = useState(0);
  const items = data.items;
  return (
    <section className="psd psf">
      <div className="container-x">
        <Head title={title} intro={data.intro} variant="c" steps={items.map((it) => it.title)} />

        {variant === "d" && (
          <div className="psd-c psf-d">
            {items.map((it, i) => (
              <div key={it.title} className="psd-c-p" data-on={on === i ? 1 : 0} style={{ backgroundImage: `url(${it.image_url})` }} onClick={() => setOn(i)} onMouseEnter={() => setOn(i)} role="img" aria-label={it.image_alt}>
                <div className="psd-c-tab"><span className="psd-no">{no(i)}</span></div>
                {/* 접힌 상태: 문제 문구 + 아래에 결과 이름 */}
                <div className="psf-d-fold">
                  <p className="psf-d-q">{it.target}</p>
                  <p className="psf-d-a"><Arrow />{it.title}</p>
                </div>
                {/* 펼친 상태: 문제 → 해결 */}
                <div className="psd-c-info psf-d-open">
                  <div className="psf-d-problem">
                    <span className="psf-label">이런 병원이라면</span>
                    <h3>{it.target}</h3>
                  </div>
                  <div className="psf-d-arrow"><Arrow /></div>
                  <div className="psf-d-solution">
                    <span className="psd-badge">{it.title}</span>
                    <p>{it.body}</p>
                    <Link href={data.cta_href} className="psd-cta">{data.cta_label} →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === "e" && (
          <div className="psf-e">
            {items.map((it, i) => (
              <article key={it.title} className="psf-e-row">
                <span className="psf-e-no">{no(i)}</span>
                <div className="psf-e-q">
                  <span className="psf-label">이런 병원이라면</span>
                  <h3>{it.target}</h3>
                </div>
                <div className="psf-e-mid"><Arrow /></div>
                <div className="psf-e-a">
                  <span className="psd-badge">{it.title}</span>
                  <p>{it.body}</p>
                </div>
                <div className="psf-e-pic" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt} />
              </article>
            ))}
            <div className="psd-foot"><Link href={data.cta_href} className="psd-cta">{data.cta_label} →</Link></div>
          </div>
        )}

        {variant === "f" && (
          <>
            <div className="psf-f">
              {items.map((it, i) => (
                <article key={it.title} className="psf-f-card">
                  <div className="psf-f-pic" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt}>
                    <span className="psd-no">{no(i)}</span>
                  </div>
                  <div className="psf-f-q">
                    <span className="psf-label">이런 병원이라면</span>
                    <h3>{it.target}</h3>
                  </div>
                  <div className="psf-f-join"><Arrow /></div>
                  <div className="psf-f-a">
                    <span className="psd-badge">{it.title}</span>
                    <p>{it.body}</p>
                    <ul className="psd-check">{it.results?.slice(0, 1).map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
            <div className="psd-foot"><Link href={data.cta_href} className="psd-cta">{data.cta_label} →</Link></div>
          </>
        )}
      </div>
    </section>
  );
}
