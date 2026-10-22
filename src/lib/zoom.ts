/** 노트북 폭(1024~1600px)에서는 globals.css 가 html 에 zoom 0.8 을 건다(--zi = 1/zoom = 1.25).
 *  이때 window.innerWidth/innerHeight·getBoundingClientRect 는 "화면 px", offsetHeight·style px 는 "CSS px"(= 화면 px × --zi)라서
 *  둘을 섞어 계산하면 어긋난다. CSS px 로 환산하려면 화면 px 에 zoomInv() 를 곱한다. 모바일·큰 모니터에서는 1. */
export function zoomInv(): number {
  if (typeof window === "undefined") return 1;
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--zi")) || 1;
}
