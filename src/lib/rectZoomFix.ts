/**
 * 아이패드 사파리 보정 (2026-11-05): 이 사이트는 노트북·아이패드 폭에서 html { zoom } 으로 화면을 줄여 보여 준다.
 * 크롬은 getBoundingClientRect() 가 "줄여서 보이는 화면 px"(scrollY·innerHeight 와 같은 단위)를 돌려주지만,
 * 아이패드 사파리는 "줄이기 전 CSS px"(= 화면 px ÷ zoom)를 돌려줘서, 위치를 재는 코드 전부가 1/zoom 배(1.667배) 어긋났다
 * (실측: 창 높이 670 인데 첫 화면 높이가 1117). 그래서 사파리에서만 getBoundingClientRect 결과에 zoom 을 곱해 크롬과 같은 단위로 맞춘다.
 * 단위는 한 번 실제로 재서 판단하므로 크롬·PC 에서는 아무 일도 하지 않는다. 이 파일은 IpadLandscape.tsx 가 불러와 모든 공개 페이지에서 실행된다.
 */
const orig = typeof Element !== "undefined" ? Element.prototype.getBoundingClientRect : null;
const FLAG = "__rectZoomFix";
if (orig && typeof window !== "undefined") (window as unknown as Record<string, unknown>).__rawRect = orig; // 확인용 상자가 원래 값을 보여 주려고 쓴다

if (orig && typeof window !== "undefined" && !(Element.prototype as unknown as Record<string, unknown>)[FLAG]) {
  let cachedW = -1, cachedK = 1;
  const factor = () => {
    const w = window.innerWidth;
    if (w === cachedW) return cachedK;
    let k = 1;
    try {
      const zi = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--zi")) || 1;
      if (zi > 1.01 && document.body) {
        const p = document.createElement("div");
        p.style.cssText = "position:absolute;left:0;top:0;width:100px;height:1px;visibility:hidden;pointer-events:none";
        document.body.appendChild(p);
        const measured = orig.call(p).width; // 크롬: 100/zi(줄인 값) · 사파리: 100(줄이기 전 값)
        p.remove();
        if (measured > 100 / zi * 1.2) k = 1 / zi;
      }
    } catch { /* 보정 없이 진행 */ }
    cachedW = w; cachedK = k;
    return k;
  };
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const r = orig.call(this);
    const k = factor();
    if (k === 1) return r;
    return new DOMRect(r.x * k, r.y * k, r.width * k, r.height * k);
  };
  (Element.prototype as unknown as Record<string, unknown>)[FLAG] = true;
}

export {};
