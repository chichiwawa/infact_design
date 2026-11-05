/** 노트북 폭(1024~1600px)에서는 globals.css 가 html 에 zoom 0.8 을 건다(--zi = 1/zoom = 1.25).
 *  이때 window.innerWidth/innerHeight·getBoundingClientRect 는 "화면 px", offsetHeight·style px 는 "CSS px"(= 화면 px × --zi)라서
 *  둘을 섞어 계산하면 어긋난다. CSS px 로 환산하려면 화면 px 에 zoomInv() 를 곱한다. 모바일·큰 모니터에서는 1. */
/** 아이패드 가로(터치)에서는 사파리 주소창이 접히고 펴질 때마다 innerHeight 가 637~701 로 변해 스크롤 진행도가 흔들린다 →
 *  그때는 변하지 않는 "기준 화면 높이"(--ipad-h, CSS px ÷ zoomInv = 화면 px)를 쓴다. 그 외에는 innerHeight 그대로. */
export function stableH(): number {
  if (typeof window === "undefined") return 0;
  const root = document.documentElement;
  if (!root.hasAttribute("data-ipad-land")) return window.innerHeight;
  const h = parseFloat(root.style.getPropertyValue("--ipad-h"));
  return h > 0 ? h / zoomInv() : window.innerHeight;
}

export function zoomInv(): number {
  if (typeof window === "undefined") return 1;
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--zi")) || 1;
}
