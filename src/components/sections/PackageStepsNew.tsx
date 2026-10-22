"use client";

/**
 * 03 마케팅 설계 — 전면 재구성 시안 5가지 (2026-10-22). 시안 전용(SectionRenderer 연결 없음).
 *  g: 탭 3개 + 큰 카드 한 장 (문제 → 해답)
 *  h: 3장 카드 모두 펼침 (카드 안에서 문제 → ↓ → 해답)
 *  i: 가로 3줄 리스트 (눌러서 사진·상세 펼침)
 *  j: 옆으로 넘기는 큰 사진 카드 (PC 는 3장 한 줄)
 *  k: 계단식 성장 (01 → 02 → 03 으로 올라가는 배치 / 모바일은 세로 타임라인)
 * 데이터는 pages.json 의 package_steps.
 */
import { useState } from "react";
import Link from "next/link";
import type { PackageStepsData } from "@/lib/sections";
import { Head } from "./PackageStepsDark";
import "./package-steps-dark.css";
import "./package-steps-new.css";

const no = (i: number) => String(i + 1).padStart(2, "0");
const Arrow = ({ down }: { down?: boolean }) => (
  <svg className={down ? "psn-arrow psn-arrow-d" : "psn-arrow"} viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

type V = "g" | "h" | "i" | "j" | "k";

export default function PackageStepsNew({ title, data, variant }: { title: string; data: PackageStepsData; variant: V }) {
  const [on, setOn] = useState(0);
  const items = data.items;
  const cta = <Link href={data.cta_href} className="psd-cta psn-cta">{data.cta_label} →</Link>;
  const q = (t: string) => <div className="psn-q"><small>이런 병원이라면</small><p>{t}</p></div>;
  const a = (t: string) => <div className="psn-a"><small>추천 단계</small><b>{t}</b></div>;

  return (
    <section className="psd psn" data-v={variant}>
      <div className="container-x">
        <Head title={title} intro={data.intro} variant="c" steps={items.map((it) => it.title)} />

        {variant === "g" && (
          <div className="psn-g">
            <div className="psn-g-tabs" role="tablist">
              {items.map((it, i) => (
                <button key={it.title} type="button" role="tab" aria-selected={on === i} data-on={on === i ? 1 : 0} onClick={() => setOn(i)}>
                  <span className="psn-no">{no(i)}</span><span className="psn-g-tt">{it.title}</span>
                </button>
              ))}
            </div>
            {items.map((it, i) => (
              <article key={it.title} className="psn-g-card" hidden={on !== i}>
                <div className="psn-g-pic" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt} />
                <div className="psn-g-body">
                  {q(it.target)}
                  <div className="psn-flow"><Arrow down /></div>
                  {a(it.title)}
                  <p className="psn-desc">{it.body}</p>
                  <ul className="psd-check">{it.results?.map((r) => <li key={r}>{r}</li>)}</ul>
                  {cta}
                </div>
              </article>
            ))}
          </div>
        )}

        {variant === "h" && (
          <div className="psn-h">
            {items.map((it, i) => (
              <article key={it.title} className="psn-h-card">
                <div className="psn-h-pic" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt}><span className="psn-no">{no(i)}</span></div>
                <div className="psn-h-q">{q(it.target)}</div>
                <div className="psn-h-join"><Arrow down /></div>
                <div className="psn-h-a">
                  {a(it.title)}
                  <p className="psn-desc">{it.body}</p>
                  <div className="psn-tags">{it.tags?.map((t) => <span key={t}>{t}</span>)}</div>
                </div>
              </article>
            ))}
            <div className="psn-foot">{cta}</div>
          </div>
        )}

        {variant === "i" && (
          <div className="psn-i">
            {items.map((it, i) => (
              <div key={it.title} className="psn-i-row" data-on={on === i ? 1 : 0}>
                <button type="button" className="psn-i-head" aria-expanded={on === i} onClick={() => setOn(on === i ? -1 : i)}>
                  <span className="psn-no">{no(i)}</span>
                  <span className="psn-i-q"><small>이런 병원이라면</small>{it.target}</span>
                  <Arrow />
                  <span className="psn-i-a">{it.title}</span>
                  <span className="psn-i-plus" aria-hidden="true" />
                </button>
                <div className="psn-i-open">
                  <div className="psn-i-inner">
                    <div className="psn-i-pic" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt} />
                    <div>
                      <p className="psn-desc">{it.body}</p>
                      <ul className="psd-check">{it.results?.map((r) => <li key={r}>{r}</li>)}</ul>
                      {cta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === "j" && (
          <div className="psn-j" tabIndex={0} aria-label="마케팅 설계 단계 (옆으로 넘기기)">
            {items.map((it, i) => (
              <article key={it.title} className="psn-j-card" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt}>
                <span className="psn-no psn-j-no">{no(i)}</span>
                <div className="psn-j-info">
                  {q(it.target)}
                  <div className="psn-a psn-a-inline"><Arrow /><b>{it.title}</b></div>
                  <p className="psn-desc">{it.body}</p>
                  {cta}
                </div>
              </article>
            ))}
          </div>
        )}

        {variant === "k" && (
          <div className="psn-k">
            {items.map((it, i) => (
              <article key={it.title} className="psn-k-step" style={{ ["--k" as string]: i }}>
                <div className="psn-k-dot"><span>{no(i)}</span></div>
                <div className="psn-k-card">
                  <div className="psn-k-pic" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt} />
                  {q(it.target)}
                  <div className="psn-flow"><Arrow down /></div>
                  {a(it.title)}
                  <p className="psn-desc">{it.body}</p>
                </div>
              </article>
            ))}
            <div className="psn-foot">{cta}</div>
          </div>
        )}
      </div>
    </section>
  );
}
