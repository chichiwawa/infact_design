"use client";

/**
 * 03 마케팅 설계(PackageSteps) 어두운 배경 레이아웃 시안 — 사이트 어두운 톤에 맞추고 글을 줄여 읽히게 (2026-10-22)
 *  a: 3열 카드(한눈에 비교) / b: 왼쪽 단계 목록 + 오른쪽 큰 사진 / c: 가로로 펼쳐지는 패널
 *  데이터는 pages.json 의 package_steps 를 그대로 사용. 시안 전용이라 본 사이트(SectionRenderer)에는 연결 안 됨.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PackageStepsData } from "@/lib/sections";
import "./package-steps-dark.css";

// 쉼표(", ") 뒤는 모바일에서만 줄바꿈 (PC 는 그대로 공백)
const mbr = (t: string) => t.split(/(?<=,) /).flatMap((p, i) => (i === 0 ? [p] : [<span key={i} className="psd-mbr"> </span>, p]));

export function Head({ title, intro, variant, steps }: { title: string; intro?: string; variant: "a" | "b" | "c"; steps: string[] }) {
  const parts = title.split("\n");
  const render = (t: string) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith("**") ? <em key={i}>{p.slice(2, -2)}</em> : p));
  // 문장 끝(". ") 뒤는 모바일에서만 줄바꿈
  const bold = (t: string) => t.split(/(\*\*[^*]+\*\*|(?<=\.) )/).map((p, i) => (p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p === " " ? <span key={i} className="psd-mbr"> </span> : p));
  return (
    <div className="psd-head" data-h={variant}>
      <div className="psd-head-l">
        <p className="psd-eyebrow">INFACT. GROWTH DESIGN</p>
        <h2 className="psd-title">{parts.map((l, i) => <span key={i} className="block">{render(l)}</span>)}</h2>
      </div>
      <div className="psd-head-r">
        {intro && <p className="psd-intro">{intro.split("\n").map((l, i) => <span key={i} className="block">{bold(l)}</span>)}</p>}
        {variant === "c" && (
          <ol className="psd-steps" aria-label="성장 단계">
            {steps.map((t, i) => <li key={t}><span>{String(i + 1).padStart(2, "0")}</span>{t}</li>)}
          </ol>
        )}
      </div>
    </div>
  );
}

const no = (i: number) => String(i + 1).padStart(2, "0");

export default function PackageStepsDark({ title, data, variant }: { title: string; data: PackageStepsData; variant: "a" | "b" | "c" }) {
  const [on, setOn] = useState(0);
  // 모바일은 02번 카드부터 펼쳐서 시작
  useEffect(() => {
    if (variant === "c" && window.matchMedia("(max-width: 767px)").matches) setOn(1);
  }, [variant]);
  const items = data.items;
  return (
    <section className="psd">
      <div className="container-x">
        <Head title={title} intro={data.intro} variant={variant} steps={items.map((it) => it.title)} />

        {variant === "a" && (
          <>
            <div className="psd-a-grid">
              {items.map((it, i) => (
                <article key={it.title} className="psd-a-card">
                  <div className="psd-a-img" style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt}>
                    <span className="psd-no">{no(i)}</span>
                  </div>
                  <div className="psd-a-body">
                    <span className="psd-badge" style={{ alignSelf: "flex-start" }}>{it.title}</span>
                    <h3>{it.target}</h3>
                    <p>{it.body}</p>
                    <div className="psd-a-tags">{it.tags?.map((t) => <span key={t}>{t}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="psd-foot"><Link href={data.cta_href} className="psd-cta">{data.cta_label} →</Link></div>
          </>
        )}

        {variant === "b" && (
          <div className="psd-b">
            <div className="psd-b-list">
              {items.map((it, i) => (
                <button key={it.title} type="button" className="psd-b-item" data-on={on === i ? 1 : 0} onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}>
                  <div className="psd-b-row"><span className="psd-no">{no(i)}</span><strong>{it.target}</strong></div>
                  <div className="psd-b-open"><div><p>{it.body}</p></div></div>
                </button>
              ))}
            </div>
            <div className="psd-b-stage">
              {items.map((it, i) => <div key={it.title} className="psd-b-pic" data-on={on === i ? 1 : 0} style={{ backgroundImage: `url(${it.image_url})` }} role="img" aria-label={it.image_alt} />)}
              <div className="psd-b-cap">
                <p>{items[on].results_title}</p>
                <ul className="psd-check">{items[on].results?.map((r) => <li key={r}>{r}</li>)}</ul>
                <Link href={data.cta_href} className="psd-cta" style={{ marginTop: 24 }}>{data.cta_label} →</Link>
              </div>
            </div>
          </div>
        )}

        {variant === "c" && (
          <div className="psd-c">
            {items.map((it, i) => (
              <div key={it.title} className="psd-c-p" data-on={on === i ? 1 : 0} style={{ backgroundImage: `url(${it.image_url})` }} onClick={() => setOn(i)} onMouseEnter={() => setOn(i)} role="img" aria-label={it.image_alt}>
                <div className="psd-c-tab"><span className="psd-no">{no(i)}</span></div>
                {/* 접힌 상태 글씨: PC 는 단계 이름, 모바일은 "어떤 병원인지"(원인)를 먼저 */}
                <span className="psd-c-name"><span className="psd-c-nt">{it.title}</span><span className="psd-c-nw">{it.target.replace(/\.$/, "").split("\n").map((l, k) => <span key={k} className="block">{l}</span>)}</span></span>
                {/* PC(1024px 이상) 전용 펼침 레이아웃: 문제 → ↓ → 해답 상품 박스. 모바일·태블릿은 아래 psd-c-info 사용 */}
                <div className="psd-c-x">
                  <div className="psd-x-top">
                    <div className="psd-x-q">
                      <span className="psd-x-step">{it.tag}</span>
                      <h3>{it.target.split(/(?<=,) /).map((l, k) => <span key={k} className="block">{l}</span>)}</h3>
                      <p>{it.body}</p>
                    </div>
                    <ul className="psd-x-res">{it.results?.map((r) => <li key={r}>{r}</li>)}</ul>
                  </div>
                  <div className="psd-x-down" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></div>
                  <div className="psd-x-sol">
                    <div className="psd-x-sol-top">
                      <div>
                        <span className="psd-x-eyebrow">INFACT. SOLUTION</span>
                        <h4>{it.title} 상품</h4>
                        <p>{it.results?.[0]}</p>
                      </div>
                      <svg className="psd-x-graph" viewBox="0 0 160 110" fill="none" aria-hidden="true">
                        <rect x="14" y="74" width="22" height="30" rx="3" fill="#2f6bff" />
                        <rect x="46" y="58" width="22" height="46" rx="3" fill="#3d82ff" />
                        <rect x="78" y="40" width="22" height="64" rx="3" fill="#56a0ff" />
                        <rect x="110" y="22" width="22" height="82" rx="3" fill="#7cc0ff" />
                        <path d="M10 62 L56 44 L86 28 L140 6" stroke="#8fd0ff" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M128 4 L142 5 L138 19" stroke="#8fd0ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="psd-x-cards">
                      {it.tags?.map((t, k) => (
                        <div key={t} className="psd-x-card"><span className="psd-x-ico">{no(k)}</span><b>{t}</b></div>
                      ))}
                    </div>
                    <Link href={data.cta_href} className="psd-cta psd-x-cta">{data.cta_label} →</Link>
                  </div>
                </div>
                <div className="psd-c-info">
                  <span className="psd-badge">{it.title}</span>
                  <h3><span className="psd-c-tpc">{it.target.replace(/\n/g, " ")}</span><span className="psd-c-tm">{mbr(it.target.replace(/\.$/, "").replace(/\n/g, " "))}</span></h3>
                  <p>{mbr(it.body)}</p>
                  <ul className="psd-check">{it.results?.slice(0, 1).map((r) => <li key={r}>{r}</li>)}</ul>
                  <Link href={data.cta_href} className="psd-cta">{data.cta_label} →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
