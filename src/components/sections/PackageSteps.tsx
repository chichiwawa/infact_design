"use client";

/**
 * 03 병원 맞춤 패키지 3종 — 와이어프레임 03의 첫 탭을 독립 섹션으로 분리 (2026-09-15)
 *  구조: 왼쪽 고정(제목·도입문·단계 목차 + 스크롤로 그려지는 진행선 + CTA) / 오른쪽 = 카드 스택(한 번에 한 장, 스크롤에 따라 다음 카드로 넘어감)
 *  2026-09-16: CTA 를 왼쪽 목차 아래로 이동(04 와 위치 통일), 하단 안내 문구 삭제
 *  2026-09-16 카드 넘김 모션 (사용자 제공 레퍼런스의 플립 스택 효과를 이 프로젝트 방식(라이브러리 없는 vanilla scroll-progress)으로 이식):
 *   - 04(MarketingTabs)와 같은 틀로 오른쪽을 화면에 고정(pin)하고, 스크롤 진행도로 카드가 하나씩 앞으로 넘어옴
 *   - 각 카드: 대기 상태(뒤에 작게 겹쳐 보임, opacity .35) → 앞 순서가 넘어가는 동안 확대되며 등장 → 자기 차례가 지나면 rotateX + 위로 이동하며 퇴장
 *   - 진행선·목차 활성 표시는 이 스크롤 진행도(p)를 그대로 재사용(기존 IntersectionObserver 방식 대체)
 *   - (2026-09-29) 스크롤 1:1 트랜스폼 → 스크롤은 현재 카드만 정하고 넘김은 CSS transition(0.8s) + 카드마다 스크롤 멈춤(스냅). 아래 useEffect 참고
 *   - 모바일/태블릿(<1024px)은 04 와 동일하게 고정 없이 세로로 쭉 읽는 목록 유지(기존 마스크 리빌·hairline 구분 그대로)
 *  2026-09-16 카드 비주얼 1차 (design/demos/package-card-formats.html "안 A"): 카드 배경 블루 통짜 블록 → 이후 아래 2차로 대체됨.
 *  2026-09-16 카드 비주얼 2차 확정 (design/demos/package-steps-centered.html 에서 다듬은 카드 스타일을, 중앙정렬 구조 대신 원래 왼쪽 목차 레이아웃에 결합 — 사용자 확정):
 *   - 카드 배경을 흰색으로, 옅은 블루 테두리(#dbe4ff)+블루 톤 그림자로 카드 경계만 표시. 카드 안의 큰 번호는 제거(왼쪽 목차에 이미 번호가 있어 중복)
 *   - 단계명은 블루 배지(bg-primary text-white) · target 문장은 진한 헤드라인(text-ink)
 *   - "진행하면 달라지는 것"은 구분선 대신 옅은 패널(bg-panel)로 감싸 결과 리스트를 시각적으로 분리(전환에 가장 중요한 내용이라 위계를 따로 줌)
 *   - 오른쪽 이미지 자리는 사선 텍스처 + 하단 스크림 오버레이로 "완성된 척하는 가짜 그라디언트"가 아니라 의도된 플레이스홀더로 읽히게 함(PackageStep.image_url, 힉스필드 생성 전까지 플레이스홀더 — 04 MarketingTabs 의 image_url 패턴과 동일)
 *   - 태그는 배지와 위계를 구분하기 위해 회색 외곽선 고스트 칩으로 배치(결과 패널 아래)
 *   - 모바일/태블릿도 동일한 카드 스타일로 통일(핀 없이 세로 스택, 기존 wipe-stagger 리빌 유지)
 *  2026-09-16 3차 다듬기 (사용자 스크린샷 지적):
 *   - active 판정 버그 수정: 기존엔 `Math.floor(p*n)`으로 왼쪽 목차 활성 단계를 정했는데, 다음 카드가 opacity 1로 이미 다 등장한 시점에도 목차는 이전 단계를 가리키는 미스매치가 있었음(실측 확인). design/demos/package-steps-centered.html 에서 먼저 발견·수정한 대로, 카드별 opacity 를 먼저 계산해 가장 진하게 보이는 카드를 active 로 판정하도록 변경
 *  2026-09-16 4차 (사용자가 3차 되돌림 — 테두리는 있어야 하고, 왼쪽 목차를 좁히는 대신 04 와 그리드 비율이 어긋나 오른쪽 끝이 안 맞았던 게 진짜 원인이었음, 스크린샷으로 04 와 나란히 비교해 확인):
 *   - 왼쪽 목차 열 고정폭(420px)+gap-16 실험을 되돌리고, MarketingTabs.tsx(04) 와 완전히 같은 그리드(`minmax(0,1fr)_minmax(0,1.5fr)` + gap-20)로 복원해 우선 정렬
 *   - 카드 외곽 옅은 블루 링(ring-1 ring-[#dbe4ff]) 복원 — 테두리 없애는 게 아니라 있어야 한다는 뜻이었음
 *  2026-09-16 5차 (4차는 "맞추라"만 반영하고 "더 넓히라"를 놓침 — 사용자 재지시): 04(MarketingTabs.tsx)에도 똑같이 적용해서 정렬은 유지한 채 두 섹션 다 카드 쪽을 더 넓힘. 왼쪽 열을 고정 440px, 카드/무대 쪽은 `minmax(0,1fr)`(남는 폭 전부)로 03·04 동일하게 변경
 *  2026-09-16 6차 (사용자가 04 가 커진 것에 의문 제기 → 04 만 원복 확정): 04 는 원래 그리드(`minmax(0,1fr)_minmax(0,1.5fr)`)로 되돌아가 03 과 오른쪽 끝이 더 이상 안 맞음 — 03 만 이 440px 고정 그리드를 유지
 *  2026-09-16 7차 (7차 1안: padding-left 만으로 텍스트를 밀었더니 카드 왼쪽만 허전하고 오른쪽은 그대로라 비대칭 — 사용자 지적으로 8차로 대체됨, 아래):
 *  2026-09-16 8차 (박스 위치 자체를 옮겨서 텍스트 정렬 — padding 은 다시 대칭 p-10/p-12): 왼쪽 목차 열의 폭을 고정 440px 대신, 04(MarketingTabs.tsx)의 그리드 수식(container-x 1440 캡·32px 패딩·1fr:1.5fr·gap-20)을 역산한 calc() 로 계산 — 그 결과 카드 박스 자체가 04 의 헤드라인 시작 x좌표에서 정확히 `p-12`(48px) 만큼 왼쪽에 오도록 위치하고, 카드 안 padding 은 원래대로 대칭이라 카드 자체 균형은 안 깨짐.
 *   ⚠️ 04 의 왼쪽 열은 여전히 비율(`minmax(0,1fr)`)이라 뷰포트 폭에 따라 헤드라인 시작 위치가 움직임 → 이 calc() 는 04 의 그리드 수식과 강하게 결합돼 있음(04 비율/gap 이나 container-x 최대폭이 바뀌면 재계산 필요). 1920px 실측: 03·04 헤드라인 x좌표 정확히 일치(870px). lg 최소폭(1024px 부근)에서는 320px 로 바닥 처리.
 *  2026-09-16 9차 (사용자 지적 — 스크롤 내리기 전 카드 테두리/그림자가 전혀 안 보임): 카드를 감싸는 `overflow-hidden`(퇴장 카드가 헤더 위로 삐져나오지 않게 자르는 용도)이 카드 크기에 딱 맞게 잡혀 있어 ring·shadow 까지 그 경계에서 잘려나갔던 게 원인. 그 overflow-hidden 을 카드 크기에 맞춘 안쪽 grid 컨테이너에서, 훨씬 여유로운 바깥 `sticky h-screen` 컨테이너로 옮김 — 뷰포트 상단(헤더) 차단 목적은 그대로 유지하면서, 카드 주변에 그림자가 그려질 여유 공간이 생김.
 *  2026-09-16 10차 (사용자가 "이 섹션만 따로 container-x 기준 폭에 안 맞춰도 된다"고 명시적으로 허용 — 카드를 container-x 경계 밖으로 확장): `sticky` 래퍼 자체에 `width: calc(100% + bleed)` / `margin-right: calc(-1 * bleed)` 를 줘서 오른쪽 경계만 밖으로 늘림(왼쪽=04 헤드라인 정렬 기준은 그대로 유지). bleed = `min(180px, max(0px, (100vw - 1440px) / 2))` — container-x 최대폭(1440px)을 넘는 뷰포트에서만, 그 초과분의 절반만큼(최대 180px, 최초 240px에서 11차에서 축소) 카드가 바깥 여백을 파고듦. 1440px 이하에서는 bleed=0 이라 기존과 동일. sticky 래퍼 자체의 폭을 같이 늘린 이유: 8차의 overflow-hidden(9차에서 이 래퍼로 옮김)이 폭 그대로면 이 확장분까지 잘라버리기 때문 — 래퍼와 확장분을 같이 늘려야 클리핑 없이 카드가 실제로 더 오른쪽까지 나감.
 *  2026-09-16 11차 (사용자 요청 — 우측 확장폭이 살짝 과했다는 피드백, "조금만 줄여줘"): bleed 상한 240px → 180px 로 축소. 1920px 실측: 카드 우측 1888→1828px. 1728px 이하 뷰포트는 원래도 상한에 안 걸리던 구간이라 변화 없음.
 */
import Link from "next/link";
import Image from "next/image";
import { setSnapLock, smoothScrollTo } from "@/lib/scroll";
import { useEffect, useRef, useState } from "react";
import Accent from "@/components/Accent";
import type { PackageStepsData } from "@/lib/sections";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** target 문장은 "OO는 ~지만, ~한 병원." 패턴이라, 쉼표 뒤에서 줄바꿈해야 자연스러운 2행이 됨(max-w 자동 줄바꿈은 쉼표 위치와 안 맞음) */
function withCommaBreak(text: string) {
  const idx = text.indexOf(",");
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx + 1)}
      <br />
      {text.slice(idx + 1).trimStart()}
    </>
  );
}

/** 이미지 없을 때만 쓰는 사선 텍스처 + 하단 스크림 (실제 사진 위에는 깔지 않는다 — 사진이 탁해짐) */
const PLACEHOLDER_TEXTURE = "before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.08)_0_2px,transparent_2px_16px)] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,.22)_100%)]";

export default function PackageSteps({ title, data }: { title: string; data: PackageStepsData }) {
  const n = data.items.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // 오른쪽 카드 스택 (2026-09-29 시간 기반 전환으로 변경): 스크롤은 "지금 몇 번째 카드인지(k)"만 정하고, 넘김 자체는 CSS transition 으로 일정한 속도.
  // 이전엔 카드 트랜스폼이 스크롤 px 에 1:1 로 붙어 있어, 스냅이 화면 70% 를 순식간에 옮기면 카드도 휙 넘어갔음(사용자 제보: 부자연스럽고 빠름). 02 Numbers 와 같은 방식.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      // 고정 구간 안에서만 카드별 멈춤(스냅) 켬 — 모바일은 무대가 숨겨져(offsetHeight 0) 항상 꺼짐
      setSnapLock("pkg", el.offsetHeight > 0 && rect.top <= 1 && -rect.top <= span + 1);
      // 화면 밖이면 건너뜀 — MarketingTabs.tsx(04)와 같은 이유(2026-09-18 pitfall)
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      // 카드당 70vh 구간, 경계는 구간 가운데(스냅 지점 i×70−5 · 마지막 i×70 이 모두 자기 카드로 판정됨)
      const k = clamp(Math.floor(-rect.top / (window.innerHeight * 0.7) + 0.5), 0, n - 1);
      if (k === last) return;
      const back = k < last;
      last = k;
      setActive(k);
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${n > 1 ? k / (n - 1) : 1})`;
      // 불투명도 타이밍을 상태별로 나눔: 앞으로 넘길 땐 새 앞 카드가 즉시 불투명(아래에 깔려 있어 튀지 않음) → 뒤 대기 카드가 비치지 않고, 위에 쌓인 이전 카드만 녹아 사라짐(.25s).
      // 뒤로 돌아올 땐 돌아오는 카드가 맨 위라 즉시 나타나면 튀므로 .25s. 한 번에 같이 페이드하면 전환 중간에 카드 3장 글자가 겹쳐 보였음(실측 캡처)
      const move = "transform .8s cubic-bezier(.2,.7,.2,1)";
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        card.style.transition = `${move}, opacity ${i < k ? ".25s" : i === k ? (back ? ".25s" : "0s") : ".3s"} linear`;
        if (i < k) {
          // 지나간 카드: 위로 젖혀지며 퇴장. 앞(위)에 쌓인 카드라 opacity 를 빨리 빼서 아래 카드와 겹쳐 보이지 않게
          card.style.transform = "translateY(-45%) rotateX(16deg)";
          card.style.opacity = "0";
        } else if (i === k) {
          card.style.transform = "none";
          card.style.opacity = "1";
        } else {
          // 대기: 뒤에 작게 겹쳐 보임
          card.style.transform = `translateY(${Math.min((i - k) * 90, 160)}px) scale(${1 - Math.min((i - k) * 0.03, 0.09)})`;
          card.style.opacity = "0.35";
        }
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); setSnapLock("pkg", false); };
  }, [n]);

  /** 목차 클릭 → 그 카드의 스냅 지점으로 이동 */
  const goTo = (i: number) => {
    const el = stageRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (snapTops(n)[i] * window.innerHeight) / 100;
    smoothScrollTo(top);
  };

  return (
    <section className="bg-elevated py-[72px] lg:py-0">
      <div className="container-x">
        {/* 모바일/태블릿 제목 (PC 는 왼쪽 열 안에) */}
        <div className="lg:hidden" data-reveal>
          <h2 className="t-h-lg text-ink"><Accent text={title} /></h2>
          {data.intro && <p className="t-lead text-body mt-6 whitespace-pre-line">{data.intro}</p>}
        </div>

        {/* PC: 화면에 고정된 카드 스택 — 카드 콘텐츠 길이에 맞춰 04 보다 넉넉한 70vh/카드 */}
        <div ref={stageRef} className="hidden lg:block relative" style={{ height: `calc(100vh + ${n * 70}vh)` }}>
          {/* 스크롤 멈춤 지점(2026-09-29): 카드마다 한 번씩 멈춤 — 02 Numbers 와 같은 방식 */}
          {snapTops(n).map((t) => (
            <div key={t} aria-hidden="true" className="snap-point" style={{ top: `${t}vh` }} />
          ))}
          <div
            className="sticky top-0 h-screen flex items-start pt-[140px] overflow-hidden"
            style={{
              "--pkg-bleed": "min(180px, max(0px, (100vw - 1440px) / 2))",
              width: "calc(100% + var(--pkg-bleed))",
              marginRight: "calc(-1 * var(--pkg-bleed))",
            } as React.CSSProperties}
          >
            <div
              className="w-full grid lg:gap-16 items-start"
              style={{ gridTemplateColumns: "max(320px, calc(0.4 * min(100vw - 64px, 1376px) - 64px)) minmax(0,1fr)" }}
            >
              {/* 왼쪽: 제목·도입문·단계 목차(진행선 포함)·CTA */}
              <div>
                <h2 className="t-h-lg text-ink"><Accent text={title} /></h2>
                {data.intro && <p className="t-lead text-body mt-6 whitespace-pre-line">{data.intro}</p>}

                <ol className="relative mt-10" aria-label="단계 목차">
                  <span aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-px bg-hairline" />
                  <span ref={lineRef} aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-px bg-primary origin-top transition-transform duration-700 ease-out" style={{ transform: "scaleY(0)" }} />
                  {data.items.map((it, i) => (
                    <li key={it.title} className="relative pl-7 py-2.5">
                      <span aria-hidden="true" className={`absolute left-0 top-[15px] w-[11px] h-[11px] rounded-full border-2 transition-colors duration-500 ${i <= active ? "bg-primary border-primary" : "bg-elevated border-hairline"}`} />
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        className={`flex items-baseline gap-3 transition-colors duration-300 ${i === active ? "text-ink" : "text-mute hover:text-body"}`}
                      >
                        <span className="text-[13px] font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[17px] font-bold">{it.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="mt-12">
                  <Link href={data.cta_href} className="btn-primary">{data.cta_label}</Link>
                </div>
              </div>

              {/* 오른쪽: 카드 스택 — 같은 그리드 셀에 겹쳐 쌓고(grid-area) 카드별 transform 으로 넘김. overflow-hidden 은 퇴장 카드가 위 헤더 쪽으로 삐져나오지 않도록 잘라내는 뷰포트 역할 */}
              <div className="relative grid min-w-0 min-h-[480px] lg:min-h-[500px]" style={{ perspective: "1200px" }}>
                {data.items.map((it, i) => (
                  <div
                    key={it.title}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    data-active={i === active ? "" : undefined}
                    className="[grid-area:1/1] self-start grid lg:grid-cols-[1.15fr_0.85fr] rounded-[28px] overflow-hidden bg-elevated ring-1 ring-[#dbe4ff] shadow-[0_30px_70px_-12px_rgba(48,97,255,0.18)] min-h-[480px] lg:min-h-[500px] data-[active]:pointer-events-auto pointer-events-none"
                    style={{
                      zIndex: n - i,
                      transformOrigin: "top center",
                      backfaceVisibility: "hidden",
                      transform: i === 0 ? "none" : `translateY(${Math.min(i * 90, 160)}px) scale(${1 - Math.min(i * 0.03, 0.09)})`,
                      opacity: i === 0 ? 1 : 0.35,
                    }}
                  >
                    <div className="flex flex-col min-w-0 p-10 lg:p-12">
                      <span className="inline-block self-start rounded-full bg-primary text-white text-[13px] font-bold px-4 py-[7px]">{it.title}</span>
                      <p className="mt-5 text-[35px] font-extrabold leading-[1.18] tracking-[-0.5px] text-ink">{withCommaBreak(it.target)}</p>
                      <p className="mt-4 text-[18px] leading-[1.6] text-body">{withCommaBreak(it.body)}</p>

                      {it.results?.length ? (
                        <div className="mt-6 rounded-2xl bg-panel px-5 py-[18px]">
                          {it.results_title && <p className="text-[12.5px] font-bold text-primary">{it.results_title}</p>}
                          <ul className="mt-2.5 space-y-1.5">
                            {it.results.map((r) => (
                              <li key={r} className="text-[15px] leading-[1.6] text-ink">{r}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {it.tags?.length ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {it.tags.map((t) => (
                            <span key={t} className="text-[12px] font-semibold tracking-[0.02em] text-mute border border-hairline rounded-full px-3 py-1">{t}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className={`relative m-2.5 lg:m-3 lg:ml-0 rounded-[20px] overflow-hidden bg-primary ${it.image_url ? "" : PLACEHOLDER_TEXTURE}`}>
                      {it.image_url ? (
                        <Image src={it.image_url} alt={it.image_alt ?? it.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                      ) : (
                        <span className="absolute left-5 bottom-4 text-[12px] text-white/70">이미지 준비 중</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 모바일/태블릿: 동일한 카드 스타일을 세로로 스택(핀 없음, 기존 마스크 리빌 유지) */}
        <ol className="mt-10 space-y-6 lg:hidden">
          {data.items.map((it, i) => (
            <li key={it.title} className="wipe-stagger rounded-[24px] overflow-hidden bg-elevated ring-1 ring-[#dbe4ff] shadow-[0_24px_60px_-10px_rgba(48,97,255,0.20)]">
              <div className="p-7">
                <div className="flex items-center gap-3">
                  <div className="wipe">
                    <span aria-hidden="true" className="text-[13px] font-bold text-mute tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="wipe">
                    {/* .wipe > * 가 리빌 애니메이션 때문에 display:block 이 강제돼 배지가 카드 전체 폭으로 늘어남 → w-fit 으로 내용 폭만 차지하게 고정 */}
                    <span className="inline-block w-fit rounded-full bg-primary text-white text-[13px] font-bold px-4 py-[7px]">{it.title}</span>
                  </div>
                </div>
                <div className="wipe mt-4">
                  <p className="text-[22px] font-extrabold leading-[1.25] tracking-[-0.4px] text-ink">{withCommaBreak(it.target)}</p>
                </div>
                <div className="wipe mt-3">
                  <p className="text-[18px] leading-[1.6] text-body">{withCommaBreak(it.body)}</p>
                </div>

                {it.results?.length ? (
                  <div className="wipe mt-6">
                    <div className="rounded-2xl bg-panel px-5 py-[18px]">
                      {it.results_title && <p className="text-[12.5px] font-bold text-primary">{it.results_title}</p>}
                      <ul className="mt-2.5 space-y-1.5">
                        {it.results.map((r) => (
                          <li key={r} className="text-[15px] leading-[1.6] text-ink">{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {it.tags?.length ? (
                  <div className="wipe mt-5">
                    <div className="flex flex-wrap gap-2">
                      {it.tags.map((t) => (
                        <span key={t} className="text-[12px] font-semibold tracking-[0.02em] text-mute border border-hairline rounded-full px-3 py-1">{t}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={`relative mx-2.5 mb-2.5 h-[180px] rounded-[18px] overflow-hidden bg-primary ${it.image_url ? "" : PLACEHOLDER_TEXTURE}`}>
                {it.image_url ? (
                  <Image src={it.image_url} alt={it.image_alt ?? it.title} fill sizes="100vw" className="object-cover" />
                ) : (
                  <span className="absolute left-5 bottom-4 text-[12px] text-white/70">이미지 준비 중</span>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* 모바일/태블릿: CTA 는 목록 아래 (PC 는 왼쪽 목차 아래) */}
        <div className="mt-12 text-center lg:hidden" data-reveal>
          <Link href={data.cta_href} className="btn-primary">{data.cta_label}</Link>
        </div>
      </div>
    </section>
  );
}

/** 스냅 지점(무대 상단 기준 vh, 카드당 70vh): 첫 카드(0) · 카드 i 는 앞 카드가 다 빠지고 자기 퇴장 직전(i×70−5) ·
 *  마지막 카드는 퇴장이 없어 구간 시작(i×70) · 아래로 나가기(100+n×70 = 다음 섹션이 화면 맨 위). 위로 나가면 02 의 마지막 지점에 붙음 */
function snapTops(n: number): number[] {
  return [0, ...Array.from({ length: n - 1 }, (_, k) => (k + 1) * 70 - (k + 1 === n - 1 ? 0 : 5)), 100 + n * 70];
}
