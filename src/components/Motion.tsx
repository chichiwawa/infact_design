"use client";

/**
 * Motion — 전역 스크롤/리빌 (01-hero NOTES 전역 설정 실측값)
 *  - (2026-09-21 제거) Lenis 스무스 스크롤: 사용자 환경(Windows Chrome)에서 메인 04 구간 "아래로 스크롤 안 됨"이
 *    3회 재발했고 `?nolenis=1`(Lenis 비활성)로 열면 끝까지 내려감을 사용자가 확인 → Lenis가 원인으로 확정, 제거.
 *    스크롤 연동 섹션(02·03·04)은 window scroll 기반이라 기본 스크롤로 그대로 동작한다.
 *  - 리빌: [data-reveal] (AOS 대응: 800ms ease-out-cubic once) / .reveal-stagger(05) / .zoom-stagger(04) / .wipe-stagger(03 마스크 리빌) — 1회성
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal], .reveal-stagger, .zoom-stagger, .wipe-stagger");
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        el.classList.add(el.hasAttribute("data-reveal") ? "is-in" : "is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
