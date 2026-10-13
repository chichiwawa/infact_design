/**
 * scroll.ts — 프로그램 스크롤(메뉴 클릭 등)은 이 함수로.
 * 2026-09-21: Lenis 제거 후 브라우저 기본 smooth 스크롤만 사용. (Lenis 시절 두 애니메이션이 충돌해 04 구간에서
 * 스크롤이 거꾸로 밀리던 버그의 재발 방지를 위해, 스크롤을 쓰는 코드를 한 곳에 모아 둔다.)
 */
export function smoothScrollTo(top: number) {
  window.scrollTo({ top, behavior: "smooth" });
}

/**
 * 2026-09-29 단계별 스크롤 멈춤: 고정(pin) 구간 안에 있는 동안만 문서 스냅을 mandatory 로 켠다(globals.css `html[class*="snap-lock-"]`).
 * 섹션마다 자기 키로 켜고 꺼서, 이웃 섹션의 끄기가 내 켜기를 덮지 않게 한다. 멈춤 지점은 `.snap-point` div.
 */
export function setSnapLock(key: string, on: boolean) {
  document.documentElement.classList.toggle(`snap-lock-${key}`, on);
}
