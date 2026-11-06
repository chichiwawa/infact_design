/** 서비스 03 — 집중 공략 부스터 4종 (구성 항목 노출, 가격 비노출) */
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import Accent from "@/components/Accent";
import BoosterArt from "./BoosterArt";
import type { BoostersData } from "@/lib/sections";
import "./boosters-variants.css";

/** variant: 디자인 시안용(없으면 기존 모양) — a 2×2 카드 / b 4열 세로 카드 / c 왼쪽 고정 머리말 + 가로 줄 / d 선으로 나뉜 표 / e 큰 카드 1 + 작은 카드 3.
 *  theme: light 밝은 바탕 / dark 어두운 남색 바탕. 스타일은 boosters-variants.css, 시안 보기: /demo/boost-a ~ e */
export default function Boosters({ title, data, variant, theme = "light" }: { title: string; data: BoostersData; variant?: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i"; theme?: "light" | "dark" }) {
  if (variant) return <BoostersV title={title} data={data} variant={variant} theme={theme} />;
  return (
    <section id="boosters" className="section-y bg-canvas border-t border-hairline scroll-mt-20">
      <div className="container-x">
        <SectionHead title={title} sub={data.subtitle} />

        <div className="reveal-stagger mt-14 grid gap-4 md:grid-cols-2 md:gap-6">
          {data.items.map((it) => (
            <article key={it.title} className="relative card card-hover rounded-[24px] p-8 md:p-10 overflow-hidden">
              {/* 아이콘 없음 — 2026-09-21 사용자 결정 (3D·라인 모두 제거) */}
              <h3 className="t-h-md md:text-[26px] text-ink">{it.title}</h3>
              <p className="text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.5px] text-primary mt-4">{it.hook}</p>
              <p className="t-body-lg text-body mt-3 whitespace-pre-line">{it.body}</p>
              <div className="mt-7 pt-6 border-t border-hairline">
                <p className="t-eyebrow text-mute">{it.includes_label}</p>
                <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {it.includes.map((r) => (
                    <li key={r} className="t-body-lg text-ink flex gap-2"><span className="text-success shrink-0" aria-hidden="true">✔</span><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* 2026-09-22 사용자 결정: 중앙 정렬 대형 배너("패키지를 모두 진행하고 계신다면?" — '모두'가 뜻을 바꿔 어색)를 버리고
            02 패키지 배너(Packages.tsx)와 같은 구조(왼쪽 제목+설명, 오른쪽 버튼)로 통일, 배경만 검정(bg-night). 옛 본문 첫 줄이 제목, 둘째 줄이 설명. */}
        <div className="mt-8 rounded-[24px] bg-night text-white on-dark p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6" data-reveal>
          <div>
            <p className="t-h-md text-white">{data.banner.title}</p>
            <p className="t-body-lg text-white/70 mt-2">{data.banner.body}</p>
          </div>
          <Link href={data.banner.cta_href} className="btn-primary shrink-0">{data.banner.cta_label}</Link>
        </div>
      </div>
    </section>
  );
}

/** 시안 F: 글을 줄이고 상품명을 크게 — 아이콘+상품명 / 큰 일러스트 자리 / 파란 한 줄 알약 / 키워드 칩 3개. 구성 항목 전체 목록·긴 설명은 뺌 */
/** 유리(글래스) 시안: 가운데 검색 창 모형 + 둘레에 떠 있는 타일 + 아래 가로 카드 4장 + 문의 버튼 */
const GLASS_TAG: Record<string, string> = { instagram: "유입", camera: "근거", sparkles: "추천", youtube: "신뢰" };
function GlassIcon({ icon }: { icon: string }) {
  const p = { width: 34, height: 34, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (icon === "instagram") return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>;
  if (icon === "camera") return <svg {...p}><rect x="3" y="4.5" width="18" height="15" rx="3" /><path d="m4 17 5-5 4 4 3-3 4 4" /><circle cx="15.5" cy="9" r="1.4" /></svg>;
  if (icon === "sparkles") return <svg {...p}><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /><path d="M18 3v4M16 5h4" /></svg>;
  return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m10 9.5 5 2.5-5 2.5z" /></svg>;
}

/** 떠 있는 타일용 큰 그림 — 시안처럼 인스타 로고+릴스 배지 / 전후 반반 사진 / AI 돋보기+반짝이 / 유튜브 썸네일 */
function GlassArt({ icon }: { icon: string }) {
  if (icon === "instagram") return (
    <svg className="art" viewBox="0 0 56 56" aria-hidden="true">
      <defs><linearGradient id="gaIg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#fdc468" /><stop offset=".4" stopColor="#f2563b" /><stop offset=".75" stopColor="#d6249f" /><stop offset="1" stopColor="#7b3fe4" /></linearGradient></defs>
      <rect x="4" y="4" width="48" height="48" rx="14" fill="url(#gaIg)" />
      <rect x="14" y="14" width="28" height="28" rx="9" fill="none" stroke="#fff" strokeWidth="3.4" />
      <circle cx="28" cy="28" r="6.5" fill="none" stroke="#fff" strokeWidth="3.4" />
      <circle cx="39" cy="17" r="2" fill="#fff" />
    </svg>);
  if (icon === "camera") return (
    <svg className="art" viewBox="0 0 76 60" aria-hidden="true">
      <defs><linearGradient id="gaBa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b9c3f5" /><stop offset="1" stopColor="#8d9de6" /></linearGradient></defs>
      <rect x="2" y="4" width="72" height="52" rx="8" fill="#fff" stroke="#dfe5fb" />
      <rect x="6" y="8" width="64" height="44" rx="5" fill="url(#gaBa)" />
      <g fill="#6f7fd0" opacity=".85"><circle cx="24" cy="26" r="9" /><path d="M8 52c0-12 7-17 16-17s16 5 16 17z" /></g>
      <g fill="#fff" opacity=".7"><circle cx="52" cy="26" r="9" /><path d="M36 52c0-12 7-17 16-17s16 5 16 17z" /></g>
      <rect x="37" y="8" width="2" height="44" fill="#fff" />
      <circle cx="38" cy="30" r="4.5" fill="#fff" stroke="#c7cff3" />
    </svg>);
  if (icon === "sparkles") return (
    <svg className="art" viewBox="0 0 72 64" aria-hidden="true">
      <circle cx="30" cy="30" r="19" fill="rgba(255,255,255,.55)" stroke="#7c3aed" strokeWidth="5" />
      <path d="m44 44 16 16" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" />
      <path d="M56 4c.8 7 5 11 12 12-7 1-11.2 5-12 12-.8-7-5-11-12-12 7-1 11.2-5 12-12z" fill="#109aaa" />
    </svg>);
  return (
    <svg className="art" viewBox="0 0 80 60" aria-hidden="true">
      <defs><linearGradient id="gaYt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dfe6f5" /><stop offset="1" stopColor="#b9c4de" /></linearGradient></defs>
      <rect x="2" y="2" width="76" height="46" rx="6" fill="url(#gaYt)" />
      <path d="M2 40l18-16 14 12 12-9 32 18v3a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6z" fill="#9aa8ca" opacity=".7" />
      <rect x="27" y="12" width="26" height="19" rx="6" fill="#e53935" />
      <path d="M36.5 16.5v10l9-5z" fill="#fff" />
      <rect x="6" y="52" width="68" height="3" rx="1.5" fill="#cdd5ea" /><rect x="6" y="52" width="16" height="3" rx="1.5" fill="#8fa3d8" />
    </svg>);
}

/** 개별 상품 6종 — 움직이는 선 아이콘(SVG+CSS 모션) + 한 줄 설명. 내용은 '채널은 전부 다룹니다' 섹션과 동일 */
const GLASS_PRODUCTS = [
  { key: "video", title: "영상", text: "유튜브 바이럴 · 릴스" },
  { key: "blog", title: "블로그", text: "브랜드 · GEO/SEO" },
  { key: "viral", title: "바이럴", text: "카페 침투 · 상위노출" },
  { key: "group", title: "체험단", text: "블로그·인스타 · 리얼모델" },
  { key: "ad", title: "광고", text: "파워링크 · 플레이스 · 메타" },
  { key: "design", title: "디자인 · 콘텐츠", text: "KEY VISUAL · 랜딩페이지" },
];
/** 개별 상품 6종 아이콘 — 색이 있는 3D 아이콘 이미지(public/media) */
const PROD_IMG: Record<string, string> = {
  video: "57d0fb08-fba0-42d0-bb7a-1bede3d0c85f", blog: "c749c192-297e-4577-b412-74483a4faa4a", viral: "0dd94869-f04a-483d-a81e-dec7fcac1b81",
  group: "14cea382-1c19-462f-af5c-962abc600a40", ad: "3753c9da-4371-437f-8cee-4b5673e71487", design: "251686a1-dba9-4bda-a356-f68496838799",
};
function ProdIcon({ k }: { k: string }) {
  if (k === "video") return (
    <svg viewBox="0 0 64 64" className="pi-img pi-col" aria-hidden="true">
      <defs><linearGradient id="pcV" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6d8dff" /><stop offset="1" stopColor="#2447d6" /></linearGradient></defs>
      <rect x="3" y="14" width="58" height="36" rx="9" fill="url(#pcV)" />
      <rect x="8" y="19" width="48" height="26" rx="5" fill="#fff" opacity=".18" />
      <circle cx="32" cy="32" r="10" fill="#fff" /><path d="M28.500 26.500v11l9.500-5.500z" fill="#2447d6" />
      <rect x="22" y="54" width="20" height="2.500" rx="1.200" fill="#fff" opacity=".7" />
      <path d="M54 4c.8 4 3 6 7 7-4 1-6.200 3-7 7-.8-4-3-6-7-7 4-1 6.200-3 7-7z" fill="#ffb84a" />
    </svg>);
  if (k === "viral") return (
    <svg viewBox="0 0 64 64" className="pi-img pi-col" aria-hidden="true">
      <defs><linearGradient id="pcVi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b79cff" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
      <circle cx="32" cy="32" r="29" fill="none" stroke="#3fd0c9" strokeWidth="2.500" opacity=".5" /><circle cx="32" cy="32" r="21" fill="none" stroke="#3fd0c9" strokeWidth="2.500" opacity=".8" />
      <path d="M32 46C16 36 14 24 22 19c5-3 9 0 10 4 1-4 5-7 10-4 8 5 6 17-10 27z" fill="url(#pcVi)" />
      <circle cx="54" cy="12" r="4" fill="#ffb84a" /><circle cx="9" cy="50" r="3" fill="#ff7a59" />
    </svg>);
  if (k === "ad") return (
    <svg viewBox="0 0 64 64" className="pi-img pi-col" aria-hidden="true">
      <defs><linearGradient id="pcA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6d8dff" /><stop offset="1" stopColor="#2447d6" /></linearGradient></defs>
      <path d="M8 26h12l22-13v38L20 38H8z" fill="url(#pcA)" /><rect x="20" y="38" width="9" height="15" rx="3" fill="#2447d6" />
      <path d="M48 24c4 4 4 12 0 16" stroke="#ffb84a" strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M54 17c8 8 8 22 0 30" stroke="#ff7a59" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>);
  if (k === "design") return (
    <svg viewBox="0 0 64 64" className="pi-img pi-col" aria-hidden="true">
      <defs><linearGradient id="pcD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b79cff" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs>
      <rect x="5" y="8" width="30" height="30" rx="8" fill="url(#pcD)" />
      <circle cx="42" cy="40" r="15" fill="#3fd0c9" opacity=".92" />
      <path d="M14 58l14-24 14 24z" fill="#ffb84a" opacity=".95" />
    </svg>);
  if (k === "blog") return (
    <svg viewBox="0 0 64 64" className="pi-img pi-col" aria-hidden="true">
      <defs><linearGradient id="pcB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3fd0c9" /><stop offset="1" stopColor="#0e8f9f" /></linearGradient></defs>
      <rect x="10" y="6" width="38" height="50" rx="8" fill="url(#pcB)" />
      <rect x="17" y="17" width="24" height="4" rx="2" fill="#fff" /><rect x="17" y="26" width="24" height="4" rx="2" fill="#fff" opacity=".85" /><rect x="17" y="35" width="14" height="4" rx="2" fill="#fff" opacity=".7" />
      <path d="M46 30l9 9-16 16-10 1 1-10z" fill="#ffb84a" /><path d="M46 30l9 9-4 4-9-9z" fill="#ff7a59" /><path d="M30 46l-1 10 10-1z" fill="#2b2f4a" />
    </svg>);
  if (k === "group") return (
    <svg viewBox="0 0 64 64" className="pi-img pi-col" aria-hidden="true">
      <defs><linearGradient id="pcG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#7c3aed" /></linearGradient><linearGradient id="pcG2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3fd0c9" /><stop offset="1" stopColor="#0e8f9f" /></linearGradient></defs>
      <circle cx="40" cy="22" r="9" fill="url(#pcG2)" /><path d="M22 54c0-12 8-19 18-19s18 7 18 19z" fill="url(#pcG2)" />
      <circle cx="24" cy="20" r="10" fill="url(#pcG1)" /><path d="M5 56c0-13 8-21 19-21s19 8 19 21z" fill="url(#pcG1)" />
      <path d="M50 6l2 4.500 5 .6-3.700 3.300 1 5-4.300-2.500-4.300 2.500 1-5L43 11l5-.6z" fill="#ffb84a" />
    </svg>);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/media/${PROD_IMG[k]}.png`} alt="" className="pi-img" draggable={false} />;
}

function BoostersGlass({ title, data }: { title: string; data: BoostersData }) {
  const items = data.items;
  return (
    <section id="boosters" className="bsg section-y scroll-mt-20">
      <div className="container-x">
        <div className="bsg-head" data-reveal>
          <p className="bsg-eyebrow"><span /> INFACT. FOCUS BOOSTER <span /></p>
          <h2><Accent text={title} /></h2>
          <p className="bsg-sub">{data.subtitle}</p>
        </div>

        <div className="bsg-stage" data-reveal>
          <svg className="bsg-orbit" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="500" cy="210" rx="470" ry="170" fill="none" stroke="rgba(120,150,255,.35)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="bsg-tile bsg-t1" aria-hidden="true"><GlassArt icon="instagram" /><span>인스타 콘텐츠</span></div>
          <div className="bsg-tile bsg-t2" aria-hidden="true"><GlassArt icon="camera" /><span>전후사진</span></div>
          <div className="bsg-tile bsg-t3" aria-hidden="true"><GlassArt icon="sparkles" /><span>AI 노출</span></div>
          <div className="bsg-tile bsg-t4" aria-hidden="true"><GlassArt icon="youtube" /><span>유튜브</span></div>
          <i className="bsg-dot bsg-d1" aria-hidden="true" /><i className="bsg-dot bsg-d2" aria-hidden="true" /><i className="bsg-dot bsg-d3" aria-hidden="true" />

          <ul className="bsg-mini">
            {GLASS_PRODUCTS.map((x, i) => (
              <li key={x.key} className={`bsg-m bsg-m${i + 1}`}>
                <span className="bsg-pi"><ProdIcon k={x.key} /></span>
                <b>{x.title}</b>
              </li>
            ))}
          </ul>

          <div className="bsg-win" aria-hidden="true">
            <div className="bsg-bar"><b /><b /><b /></div>
            <p className="bsg-brand">INFACT<i /></p>
            <div className="bsg-search"><span className="bsg-typed"><span className="bsg-tx">우리병원에 필요한 부스터 찾기</span></span><svg className="bsg-mag" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg></div>
            <div className="bsg-pills"><span className="p1">유입</span><span className="p2">전환</span><span className="p3">신뢰</span><span className="p4">추천</span></div>
            <div className="bsg-rec"><svg width="18" height="18" viewBox="0 0 24 24" fill="#3061ff"><path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10z" /></svg><span>우리 병원, 지금은 <b>인스타 유입 강화</b>가 효과적이에요.</span><i>›</i></div>
          </div>
        </div>

        <div className="bsg-cta" data-reveal>
          <Link href={data.banner.cta_href} className="bsg-btn">{data.banner.cta_label}<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></Link>
        </div>
      </div>
    </section>
  );
}

function BoostersF({ title, data, lay }: { title: string; data: BoostersData; lay: string }) {
  if (lay === "f") return <BoostersGlass title={title} data={data} />;
  return (
    <section id="boosters" className="bst bstf section-y scroll-mt-20" data-v="f" data-lay={lay} data-theme="light">
      <div className="container-x">
        <div className="bst-head" data-reveal>
          <p className="bstf-pill">INFACT. <b>FOCUS BOOSTER</b></p>
          <h2><Accent text={title} /></h2>
          <p className="bst-sub">{data.subtitle}</p>
        </div>
        <svg className="bstf-links" viewBox="0 0 1000 110" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="bstfLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8b5cf6" stopOpacity=".05" />
              <stop offset=".55" stopColor="#6d7cff" stopOpacity=".6" />
              <stop offset="1" stopColor="#3061ff" stopOpacity=".9" />
            </linearGradient>
          </defs>
          {[125, 375, 625, 875].map((x) => (
            <path key={x} d={`M500 0 C500 55, ${x} 45, ${x} 110`} fill="none" stroke="url(#bstfLine)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          ))}
          {[125, 375, 625, 875].map((x) => (
            <circle key={x} cx={x} cy="108" r="3" fill="#3061ff" />
          ))}
        </svg>
        <div className="bstf-float bstf-float-a" aria-hidden="true">Reels</div>
        <div className="bstf-float bstf-float-b" aria-hidden="true">Review</div>
        <div className="bstf-float bstf-float-c" aria-hidden="true">GEO</div>
        <div className="bstf-float bstf-float-d" aria-hidden="true">Trust</div>
        <div className="bst-list reveal-stagger">
          {data.items.map((it, i) => (
            <article key={it.title} className="bstf-card">
              <span className="bstf-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div className="bstf-art" aria-hidden="true">
                <BoosterArt icon={it.icon} />
              </div>
              <h3 className="bstf-name">{it.title}</h3>
              <p className="bstf-line"><Accent text={it.pill ?? it.hook} /></p>
              <ul className="bstf-chips">{(it.chips ?? it.includes.slice(0, 3)).map((c) => <li key={c}>{c}</li>)}</ul>
              <p className="bstf-stat"><i aria-hidden="true" />{it.hook}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BoostersV({ title, data, variant, theme }: { title: string; data: BoostersData; variant: string; theme: string }) {
  if (["f", "g", "h", "i"].includes(variant)) return <BoostersF title={title} data={data} lay={variant} />;
  return (
    <section id="boosters" className="bst section-y scroll-mt-20" data-v={variant} data-theme={theme}>
      <div className="container-x">
        <div className="bst-wrap">
          <div className="bst-head" data-reveal>
            <p className="bst-eyebrow">BOOSTER</p>
            <h2><Accent text={title} /></h2>
            <p className="bst-sub">{data.subtitle}</p>
          </div>
          <div className="bst-list reveal-stagger">
            {data.items.map((it, i) => (
              <article key={it.title} className="bst-card">
                <span className="bst-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="bst-t">
                  <h3>{it.title}</h3>
                  <p className="bst-hook">{it.hook}</p>
                </div>
                <div className="bst-d">
                  <p className="bst-body">{it.body}</p>
                  <div className="bst-inc">
                    <p className="bst-lb">{it.includes_label}</p>
                    <ul>
                      {it.includes.map((r) => (
                        <li key={r}><i aria-hidden="true">✓</i><span>{r}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="bst-banner" data-reveal>
          <div>
            <p className="bst-bt">{data.banner.title}</p>
            <p className="bst-bb">{data.banner.body}</p>
          </div>
          <Link href={data.banner.cta_href} className="btn-primary shrink-0">{data.banner.cta_label}</Link>
        </div>
      </div>
    </section>
  );
}
