"use client";
/** 아이패드 가로(1024~1366, 터치): 사파리는 html zoom 아래에서 vw 를 어긋나게 계산해 메인·강점 글자가 PC 보다 훨씬 커 보였다.
 *  PickerSection(서비스 04 섹션)만 이 값을 넣고 있어 다른 페이지에서는 globals.css 의 html[data-ipad-land] 규칙이 전혀 적용되지 않았다.
 *  그래서 모든 공개 페이지에서 화면 폭(--ipad-w, CSS px)과 data-ipad-land 를 넣는다. 높이(--ipad-h)는 PickerSection 이 더 정밀하게 넣으므로 비어 있을 때만 채운다. */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { zoomInv } from "@/lib/zoom";

export default function IpadLandscape() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const mq = matchMedia("(min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) and (pointer: coarse)");
    const apply = () => {
      if (!mq.matches) return;
      const zi = zoomInv();
      root.setAttribute("data-ipad-land", "");
      root.style.setProperty("--ipad-w", `${window.innerWidth * zi}px`);
      if (!root.style.getPropertyValue("--ipad-h")) root.style.setProperty("--ipad-h", `${window.innerHeight * zi}px`);
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
    };
  }, [pathname]);
  return null;
}
