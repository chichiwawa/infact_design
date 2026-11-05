"use client";
/** 아이패드 가로(1024~1366, 터치): 사파리는 html zoom 아래에서 vw·vh·svh 를 어긋나게 계산해 메인·강점 글자가 PC 보다 훨씬 커 보였고,
 *  섹션 높이(100svh × 1/zoom)가 실제 화면보다 커서 아래가 잘렸다.
 *  PickerSection(서비스 04 섹션)만 이 값을 넣고 있어 다른 페이지에서는 globals.css 의 html[data-ipad-land] 규칙이 전혀 적용되지 않았다.
 *  그래서 모든 공개 페이지에서 화면 폭(--ipad-w, CSS px)과 data-ipad-land 를 넣는다. 높이(--ipad-h)는 PickerSection 이 더 정밀하게 넣으므로 비어 있을 때만 채운다.
 *  또 globals.css·섹션 CSS 가 쓰는 "화면 1%" 변수(--vw1·--vh1·--svh1·--dvh1·--lvh1, 기본은 vw·vh × 1/zoom)를
 *  이 구간에서만 실제로 잰 화면 크기 / 100 (CSS px)로 덮어쓴다. */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { zoomInv } from "@/lib/zoom";

const UNIT_VARS = ["--vw1", "--vh1", "--svh1", "--dvh1", "--lvh1"];

export default function IpadLandscape() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const mq = matchMedia("(min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) and (pointer: coarse)");
    // 아이패드 사파리는 innerHeight 가 실제 보이는 높이보다 작게 나오기도 해서(PickerSection 과 같은 방식) 가장 큰 값을 쓴다
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;left:0;top:0;width:0;height:100lvh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    let lastW = 0;
    const apply = () => {
      if (!mq.matches) {
        UNIT_VARS.forEach((k) => root.style.removeProperty(k));
        lastW = 0;
        return;
      }
      const zi = zoomInv();
      const w = window.innerWidth;
      // 2026-11-05: 사파리 주소창이 접히고 펴질 때마다 화면 높이를 다시 재면, 서비스 고민 섹션(화면 8.5배 길이)처럼 긴 구간의 높이가 통째로 바뀌어
      // 스크롤 위치가 수백 px 순간이동했다. 높이 기준은 주소창이 펼쳐진 상태의 높이(100svh)로 한 번만 정하고, 가로 폭·방향이 바뀔 때만 다시 잰다.
      if (w === lastW) return;
      lastW = w;
      // 값은 예전처럼 "가장 큰 높이"(주소창이 접힌 상태 포함)로 잡아야 섹션 아래에 흰 띠가 안 생긴다. 대신 한 번만 정하므로 주소창이 움직여도 값이 변하지 않는다.
      const big = Math.min(probe.getBoundingClientRect().height, window.innerHeight * 1.2);
      const dev = Math.min(Math.min(screen.width, screen.height), window.innerHeight * 1.2);
      const h = Math.max(window.innerHeight, window.visualViewport?.height ?? 0, big, dev);
      root.setAttribute("data-ipad-land", "");
      root.style.setProperty("--ipad-w", `${w * zi}px`);
      if (!root.style.getPropertyValue("--ipad-h")) root.style.setProperty("--ipad-h", `${h * zi}px`);
      root.style.setProperty("--vw1", `${(w * zi) / 100}px`);
      const v = `${(h * zi) / 100}px`;
      ["--vh1", "--lvh1", "--svh1", "--dvh1"].forEach((k) => root.style.setProperty(k, v));
    };
    apply();
    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
      probe.remove();
    };
  }, [pathname]);
  // 확인용 표시(2026-11-05): 주소 끝에 ?debug=1 을 붙이면 왼쪽 아래에 화면 수치가 뜬다. 일반 방문자에게는 보이지 않는다.
  useEffect(() => {
    if (!new URLSearchParams(location.search).has("debug")) return;
    const box = document.createElement("pre");
    box.style.cssText = "position:fixed;left:6px;bottom:6px;z-index:99999;margin:0;padding:6px 8px;background:rgba(0,0,0,.82);color:#7CFC9A;font:11px/1.35 monospace;border-radius:6px;pointer-events:none;white-space:pre";
    document.body.appendChild(box);
    const css = (k: string) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    const secs = () => Array.from(document.querySelectorAll<HTMLElement>("section, .pain, .pk-swrap, .cr, .diff-wrap")).filter((e) => e.offsetHeight > 300).map((e) => `${(e.className || e.tagName).toString().split(" ")[0].slice(0, 9)}:${Math.round(e.getBoundingClientRect().height)}`);
    // 튄 순간 기록: 스크롤 위치가 한 번에 1200px 넘게 바뀌거나, 문서 전체 길이가 200px 넘게 바뀌면 남긴다 (최근 4건)
    const events: string[] = [];
    let ly = scrollY, ld = document.documentElement.scrollHeight, lh = innerHeight, lv = css("--vh1");
    const rec = () => {
      const y = scrollY, d = document.documentElement.scrollHeight, h = innerHeight, v = css("--vh1");
      const t = (performance.now() / 1000).toFixed(1);
      if (Math.abs(y - ly) > 1200) events.push(`${t}s 위치 ${Math.round(ly)}→${Math.round(y)}`);
      if (Math.abs(d - ld) > 200) events.push(`${t}s 전체길이 ${ld}→${d}`);
      if (h !== lh) events.push(`${t}s 창높이 ${lh}→${h}`);
      if (v !== lv) events.push(`${t}s vh1 ${lv}→${v}`);
      ly = y; ld = d; lh = h; lv = v;
      while (events.length > 4) events.shift();
    };
    window.addEventListener("scroll", rec, { passive: true });
    window.addEventListener("resize", rec);
    const tick = () => {
      rec();
      const vv = window.visualViewport;
      box.textContent = [
        `win ${innerWidth}x${innerHeight} vv ${Math.round(vv?.height ?? 0)} scr ${screen.width}x${screen.height}`,
        `vh1 ${css("--vh1")} dvh1 ${css("--dvh1")} svh1 ${css("--svh1")}`,
        `ipad-h ${css("--ipad-h")} land ${document.documentElement.hasAttribute("data-ipad-land")} zi ${css("--zi")}`,
        `y ${Math.round(scrollY)} / doc ${document.documentElement.scrollHeight}`,
        secs().join(" "),
        ...events,
      ].join("\n");
    };
    tick();
    const id = window.setInterval(tick, 300);
    return () => { window.clearInterval(id); window.removeEventListener("scroll", rec); window.removeEventListener("resize", rec); box.remove(); };
  }, [pathname]);
  return null;
}
