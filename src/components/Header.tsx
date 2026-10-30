"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/nav";
import { zoomInv } from "@/lib/zoom";

/**
 * Header — 항상 투명, 글자색만 전환.
 *  글자색은 헤더 바로 아래 지점(.on-dark 여부)을 보고 흰색/검정을 고른다 — 바 배경(도형) 없이 텍스트만으로 대비.
 *  2026-09-16 사용자 요청으로 스크롤 시 뜨던 반투명 바(bg-night/85, bg-elevated/90 + blur + 밑줄) 제거.
 * 상단 3px 스크롤 진행바(레퍼런스 실측 요소, 색만 블루).
 */

export default function Header() {
  /* 2026-09-23 Vercel ISR 은 루트 페이지를 "/index" 경로로 렌더한다(실측: 배포 HTML 의 RSC payload c:["","index"], 로컬 빌드는 ["",""]).
     그대로 두면 서버 HTML 은 text-ink(활성 탭 없음)로 나오고, 클라이언트는 "/" 로 계산해 hydration 불일치 → React 19 는 속성 불일치를
     고치지 않아 검정 히어로 위에 검정 메뉴가 남았다(배포 후 "상단 메뉴 안 보임"). 서버·클라이언트가 같은 값을 보도록 여기서 정규화. */
  const rawPathname = usePathname();
  const pathname = rawPathname === "/index" ? "/" : rawPathname;
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [overBlue, setOverBlue] = useState(false);  // 2026-09-22 파란 최종 CTA 위에서는 로고 점을 흰색으로(시그니처 블루 점이 파란 배경에 묻힘)
  const barRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean) => setOpenPath(v ? pathname : null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    let raf = 0, tiltStep = -1;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const under = document.elementFromPoint(window.innerWidth / 2, 84 / zoomInv());
      setOverDark(Boolean(under && under.closest(".on-dark")));
      setOverBlue(Boolean(under && under.closest(".bg-primary")));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      /* "INFACT" 글자가 막대 끝에 오른쪽을 맞춰 매달려 같이 간다 (2026-09-17). 막대는 scaleX 라 자식으로 넣으면 찌그러져서 따로 둔다.
         글자마다 기울기·높낮이가 제각각이고, 스크롤이 2% 나아갈 때마다 새로 뽑아서 달그락거리며 따라온다 */
      const tag = dotRef.current;
      if (tag) {
        const cw = window.innerWidth * zoomInv(); // CSS px (html zoom 보정)
        tag.style.transform = `translateX(${Math.max(0, Math.min(cw - tag.offsetWidth, p * cw - tag.offsetWidth))}px)`;
        tag.dataset.state = p < 0.004 ? "hidden" : p > 0.995 ? "end" : "";
        const step = Math.floor(p * 50);
        if (step !== tiltStep) {
          tiltStep = step;
          const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
          [...tag.children].forEach((el) => { (el as HTMLElement).style.transform = still ? "none" : `translateY(${(Math.random() * 2 - 1).toFixed(1)}px) rotate(${(Math.random() * 30 - 15).toFixed(1)}deg)`; });
        }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [pathname]);

  const darkTop = (pathname === "/" || pathname === "/services") && !scrolled && !open;
  const onDark = darkTop || (overDark && !open);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div ref={barRef} className="scroll-progress" aria-hidden="true" />
      <div ref={dotRef} className="scroll-tag" data-state="hidden" aria-hidden="true">{"INFACT".split("").map((c, i) => <i key={i}>{c}</i>)}</div>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[color,background-color,border-color] duration-300 ${open ? "bg-elevated" : scrolled ? `backdrop-blur-md border-b ${onDark ? "bg-[rgba(8,10,20,.28)] border-white/10" : "bg-white/40 border-black/5"}` : "bg-transparent"} ${onDark ? "text-white" : "text-ink"}`}
      >
        <div className="container-x flex items-center justify-between h-12 md:h-20">
          {/* 2026-09-23 사용자 로고 PNG(흰색 "INFACT.")로 교체 — 글자·점을 잘라 CSS mask 로 그려 색은 currentColor(헤더 흰/검 전환 그대로), 점만 시그니처 블루(파란 CTA 위에서는 흰색, 2026-09-22 규칙 유지) */}
          <Link href="/" className="logo" aria-label="인팩트컴퍼니 홈" onClick={(e) => { if (rawPathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}>
            <span className="logo-word" aria-hidden="true" />
            <span className={`logo-dot ${onDark && overBlue && !open ? "text-white" : "text-primary"}`} aria-hidden="true" />
          </Link>

          <nav aria-label="주 메뉴" className="hidden md:flex items-center gap-1 lg:gap-8 ml-auto mr-2 lg:mr-8 whitespace-nowrap">
            {NAV.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`nav-glow font-outfit text-[17px] lg:text-[19px] px-3 lg:px-5 py-2.5 rounded-full ${
                  isActive(it.href)
                    ? "font-bold"
                    : onDark ? "text-white/70 hover:text-white" : "text-body"
                }`}
                aria-current={isActive(it.href) ? "page" : undefined}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <a href="/company-profile" target="_blank" rel="noopener" className="!hidden md:!inline-flex btn-sm-line">회사소개서</a>
            <Link href="/contact" className="!hidden md:!inline-flex btn-sm">문의하기</Link>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        <div id="mobile-menu" hidden={!open} className="md:hidden fixed inset-x-0 top-12 bottom-0 bg-elevated border-t border-hairline text-ink">
          <nav aria-label="모바일 메뉴" className="container-x py-3 flex flex-col">
            {NAV.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`py-3.5 text-[13.5px] font-extrabold tracking-[-0.3px] border-b border-hairline-soft ${isActive(it.href) ? "text-primary" : "text-ink"}`}
              >
                {it.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-6">문의하기</Link>
            <a href="/company-profile" target="_blank" rel="noopener" className="btn-secondary mt-3">회사소개서</a>
          </nav>
        </div>
      </header>
    </>
  );
}
