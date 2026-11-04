"use client";

/**
 * 서비스 02 — 패키지 3종 (결과 중심, 가격 비노출)
 *  2026-09-17 호버: "이 패키지를 진행하면" 결과 영역만 시그니처 컬러로 — 구분선에서 아래로 드러난다.
 *  파란 배경 + 흰 글자 사본(aria-hidden)을 한 겹으로 겹쳐 두고 clip-path 로 함께 드러내는 방식이라 (globals.css `.pkg-res-fill`),
 *  속도를 어떻게 바꿔도 파랑이 지나간 곳의 글자만 정확히 흰색이 된다 (채움과 글자색을 따로 타이밍 맞추던 방식은 속도를 바꾸면 어긋났음).
 *  사본은 좌우·아래로 48px 더 뻗고 같은 만큼 안쪽 여백을 줘서 줄바꿈이 원본과 똑같다. 넘친 부분은 카드의 overflow-hidden 이 둥근 모서리로 자른다.
 *  2026-09-18: 사본 내용을 "이 패키지를 진행하면"(results) 그대로 복사하던 것에서, 호버 전용 "패키지 구성 항목"(components) 목록으로 교체.
 *  평소엔 results가 보이고, 호버 시 파란 채움과 함께 다른 내용(구성 항목)이 드러나는 구조로 변경.
 *  2026-09-18(2차, 사용자 제안): components 중 emphasis(예: "패키지 1 전체 포함") 항목이 있으면 한 줄 통짜로 먼저 보여주고 구분선 → 나머지는
 *  기존과 같은 columns-2(왼쪽 열부터 위→아래로 채움)로 정렬. emphasis 없는 카드(유입 구축형)는 레이아웃 그대로 유지.
 *  2026-09-18(3차, 사용자 요청): 통합 브랜드형 문구 교체 + 여백을 넓히면서도(간격 통일) 긴 항목("브랜드 콘셉트 · 핵심 시술 설정")이 한 줄에 들어가야 해서,
 *  목록 글자를 t-body(15px)→t-body-sm(13px)로 줄여 확보한 여유로 위아래 여백을 다시 넉넉하게(mt-4/mb-2.5). 3장 카드 모두 같은 Components 컴포넌트를 쓰므로 자동으로 통일됨.
 *  2026-09-22: PC는 마우스 호버로 구성 항목이 드러나지만 모바일(<1024)엔 호버가 없어 탭해야 하는데 그걸 알려주는 버튼이 없어 그냥 지나칠 수 있다는
 *  사용자 지적 → lg 미만에서만 보이는 "구성 보기" 토글 버튼 추가. `.pkg-card:hover`와 별개로 `.pkg-card.is-open`도 같은 clip-path 를 열도록
 *  globals.css 에 규칙 추가(카드별 useState). 토글 버튼은 카드 상단 배지 옆(사용자가 스크린샷에 표시한 위치)에 둠.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import type { PackagesData } from "@/lib/sections";
import "./packages-variants.css";

function Results({ title, results }: { title: string; results: string[] }) {
  return (
    <>
      <p className="t-eyebrow font-bold text-primary" style={{ letterSpacing: "0.9px" }}>{title}</p>
      <ul className="mt-3 md:mt-4 space-y-3">
        {results.map((r) => (
          <li key={r} className="t-body-lg font-semibold flex gap-3 text-ink"><span className="shrink-0 text-primary" aria-hidden="true">→</span><span>{r}</span></li>
        ))}
      </ul>
    </>
  );
}

// 3장 카드가 나란히 붙어있어서, 왼쪽 열 너비가 카드마다 자기 글자에 맞춰 달라지면 오른쪽 열이 시작하는 위치도 카드마다 어긋나 보인다
// (사용자 지적 — "글자수에 따라 위치가 다르면 안 되지 않냐"). 전 패키지의 왼쪽 열 항목 중 가장 긴 것(브랜딩 "브랜드 콘셉트 · 핵심 시술 설정",
// 13px 기준 실측 165px)에 여유를 둔 고정 너비를 왼쪽 열에 줘서, 3장 모두 오른쪽 열이 같은 x 위치에서 시작하게 맞춘다.
// 좁은 화면에서는 `min-w-0`+flex-shrink(기본값)로 줄어들며 줄바꿈 허용(넘치지 않음).
const COL1_WIDTH = "172px";

function Components({ title, items }: { title: string; items: { label: string; emphasis?: boolean }[] }) {
  const lead = items.find((c) => c.emphasis);
  const rest = lead ? items.filter((c) => c !== lead) : items;
  const mid = Math.ceil(rest.length / 2);
  const columns = [rest.slice(0, mid), rest.slice(mid)];
  return (
    <>
      <p className="t-eyebrow font-bold text-white" style={{ letterSpacing: "0.9px" }}>{title}</p>
      {lead && (
        <>
          <p className="mt-3 t-body font-bold text-white flex gap-2"><span className="shrink-0" aria-hidden="true">·</span><span>{lead.label}</span></p>
          <div className="mt-2 border-t border-white/25" />
        </>
      )}
      <div className="mt-3 flex gap-x-6">
        {columns.map((col, i) => (
          <ul key={i} className="min-w-0 space-y-1.5" style={i === 0 ? { flex: `0 1 ${COL1_WIDTH}` } : undefined}>
            {col.map((c) => (
              <li key={c.label} className="t-body-sm font-semibold flex gap-2 text-white/80"><span className="shrink-0" aria-hidden="true">·</span><span>{c.label}</span></li>
            ))}
          </ul>
        ))}
      </div>
    </>
  );
}

/** variant: 디자인 시안용(없으면 기존 모양 그대로) — 앞 섹션(성장단계에 맞춘 맞춤형 마케팅 전략, package-steps-cards.css)과 이어지는 다크 톤 — a 파란 테두리 카드 / b 무채색 카드 + 호버 때 파랑 / c 흰 카드 + 파란 강조. 스타일은 packages-variants.css */
// 시안 d 의 구성 항목 아이콘 4종 (말풍선 · 문서 · 사람 · 광고) — 앞 섹션(PackageStepsCards)과 같은 모양
const ICONS = [
  <path key="a" d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM8.5 11h.01M12 11h.01M15.5 11h.01" />,
  <path key="b" d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5M10 8h2" />,
  <path key="c" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0" />,
  <path key="d" d="M4 10v4h3l7 4V6L7 10H4zM17 9.5a4 4 0 0 1 0 5" />,
  <path key="e" d="M4 17l5-5 4 4 7-8M15 8h5v5" />,
  <path key="f" d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />,
];
const rich = (t: string) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));
const Check = () => (
  <span className="pkd-check" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </span>
);

/** 시안 d: 앞 섹션 모바일 카드처럼 가운데 정렬 — 번호 · 고민 제목(2줄, 둘째 줄 파랑) · 설명 · "진행하면?" 알약 · 구성 항목 남색 칩. 호버/토글 없이 전부 펼쳐 보임 */
function CardD({ it, i, on, onPick }: { it: PackagesData["items"][number]; i: number; on: boolean; onPick: () => void }) {
  const rest = it.components; // 구성 칩은 데이터 그대로 전부 (01 5개 · 02 6개 · 03 6개), "전체 포함" 항목도 칩으로
  return (
    <article className="pkd-card" data-on={on ? 1 : 0} onClick={onPick}>
      <p className="pkd-top"><span className="pkd-no">{String(i + 1).padStart(2, "0")}</span><span className="pkd-name">{it.title}</span></p>
      <h3 className="pkd-title">{(it.heading ?? it.target).split("\n").map((l, k) => <span key={k} className="block">{rich(l)}</span>)}</h3>
      <span className="pkd-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></span>
      <p className="pkd-desc whitespace-pre-line">{it.body}</p>
      <ul className="pkd-pills">{it.results.map((r) => <li key={r}>{r}</li>)}</ul>
      <ul className="pkd-chips">
        {rest.map((c, k) => (
          <li key={c.label} className={c.emphasis ? "pkd-chip-lead" : undefined}>
            <span className="pkd-ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k % ICONS.length]}</svg></span>
            <span className="whitespace-pre-line">{c.emphasis ? c.label.includes(",") ? <>{c.label.replace(" 패키지 전체 포함", "")}<br className="lb-pc" /> 패키지 <br className="lb-ipad" />전체 포함</> : c.label.replace(" 전체 포함", "\n전체 포함") : c.label}</span>
          </li>
        ))}
      </ul>
      <Link href="/contact" className="pkd-cta">문의하기<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></Link>
    </article>
  );
}

export default function Packages({ title, data, variant, ipad }: { title: string; data: PackagesData; variant?: "a" | "b" | "c" | "d"; ipad?: "a" | "b" }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [selD, setSelD] = useState<number | null>(null); // 시안 d: 눌러서 테두리가 생긴 카드
  const secRef = useRef<HTMLElement>(null);

  // 시안 d, 아이패드 가로: 사파리가 글자를 박스보다 크게 그려 카드 제목이 세 줄로 넘치고 잘렸다.
  // 제목을 한 줄씩(줄바꿈 금지) 두 줄로 두고, 가장 긴 줄이 카드 안쪽 폭에 들어오는 배율 k 를 실측해 제목에 곱한다.
  // 같은 k 를 --pkd-k 로 넘겨 설명·알약·칩 글자도 같은 비율로 줄인다(packages-variants.css 마지막 블록). 세 카드는 같은 크기로 맞춘다.
  useEffect(() => {
    const sec = secRef.current;
    if (variant !== "d" || !sec) return;
    const mq = matchMedia("(min-width: 744px) and (max-width: 1366px) and (pointer: coarse) and (orientation: landscape), (min-width: 744px) and (max-width: 1023px) and (pointer: coarse) and (orientation: portrait)");
    const mqPad = matchMedia("(min-width: 744px) and (max-width: 1023px)"); // 아이패드 세로 시안(ipad) 페이지용
    const fit = () => {
      const titles = Array.from(sec.querySelectorAll<HTMLElement>(".pkd-title"));
      titles.forEach((t) => t.style.removeProperty("font-size"));
      sec.style.removeProperty("--pkd-k");
      if (!mq.matches && !(ipad && mqPad.matches)) return;
      let k = 1;
      titles.forEach((t) => {
        const card = t.parentElement as HTMLElement;
        const cs = getComputedStyle(card);
        const z = card.getBoundingClientRect().width / card.offsetWidth; // html zoom 배율(화면 px ÷ CSS px)
        const avail = card.getBoundingClientRect().width - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)) * z;
        t.querySelectorAll<HTMLElement>(":scope > span").forEach((l) => {
          const w = l.getBoundingClientRect().width;
          if (w > 0) k = Math.min(k, avail / w);
        });
      });
      k = Math.min(1, k * 0.96);
      sec.style.setProperty("--pkd-k", String(k));
      titles.forEach((t) => { t.style.fontSize = `${parseFloat(getComputedStyle(t).fontSize) * k}px`; });
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    mq.addEventListener("change", fit);
    return () => { window.removeEventListener("resize", fit); mq.removeEventListener("change", fit); };
  }, [variant, ipad]);

  return (
    <section ref={secRef} id="packages" className="section-y bg-elevated scroll-mt-20" data-pkv={variant} data-ipad={ipad}>
      <div className="container-x">
        {/* 안내 문구(note)는 제목 아래 서브로 올렸다 (2026-09-17) */}
        <SectionHead title={title} sub={data.note} />

        <div className="reveal-stagger mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
          {variant === "d" ? data.items.map((it, i) => <CardD key={it.title} it={it} i={i} on={selD === i} onPick={() => setSelD(selD === i ? null : i)} />) : data.items.map((it, i) => {
            const open = openIdx === i;
            return (
              <article key={it.title} className={`group relative rounded-[24px] p-6 md:p-9 flex flex-col overflow-hidden card-hover pkg-card bg-panel text-ink${open ? " is-open" : ""}`}>
                <span className="pkg-no relative" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="relative flex items-center justify-between gap-3">
                  <span className="pkg-badge text-[13px] font-bold px-3 py-1.5 rounded-full bg-ink text-white transition-colors duration-300">{it.category}패키지</span>
                  <button
                    type="button"
                    className="lg:hidden shrink-0 inline-flex items-center gap-1 p-2 -m-2 text-[13px] font-bold text-primary active:opacity-60 transition-opacity"
                    aria-expanded={open}
                    aria-controls={`pkg-components-${i}`}
                    onClick={() => setOpenIdx(open ? null : i)}
                  >
                    구성 보기
                    <svg aria-hidden="true" viewBox="0 0 24 24" className={`w-3.5 h-3.5 transition-transform duration-300${open ? " rotate-180" : ""}`}>
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <h3 className="relative t-h-md md:text-[26px] mt-5 md:mt-6">{it.title}</h3>
                <p className="relative t-body mt-2 text-mute">{it.target}</p>
                <p className="relative t-body-lg mt-5 text-body whitespace-pre-line">{it.body}</p>
                <div className="relative flex-1 mt-6 pt-6 md:mt-8 border-t border-ink/10">
                  <Results title={it.results_title} results={it.results} />
                  <div id={`pkg-components-${i}`} aria-hidden={!open} className="pkg-res-fill"><Components title={it.components_title} items={it.components} /></div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="pk-banner mt-8 rounded-[24px] bg-primary-soft p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6" data-reveal>
          <div>
            <p className="t-h-md text-ink">{data.banner.title}</p>
            <p className="t-body-lg text-body mt-2">{data.banner.body}</p>
          </div>
          <Link href={data.banner.cta_href} className="btn-primary shrink-0">{data.banner.cta_label}</Link>
        </div>
      </div>
    </section>
  );
}
