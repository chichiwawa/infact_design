/**
 * 04 오른쪽 카드 4장의 그림 — 이미지 파일 대신 코드로 그린 화면 (2026-10-14)
 *  인스타 = 프로필 + 팔로워 성장 / 전후사진 = 전·후 비교 3쌍 / AI 노출 = AI 답변 화면 / 유튜브 = 영상 + 쇼츠
 *  글자 크기는 카드 폭(cqw) 기준이라 카드가 줄면 같이 줄어든다. 스타일은 globals.css 의 .bv-* 참고.
 */

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bv" aria-hidden="true">
      <div className="bv-stage">{children}</div>
    </div>
  );
}

export function InstaVisual({ src, draw = true, sides, variant = "yt" }: { src?: string; draw?: boolean; sides?: [string, string]; variant?: string } = {}) {
  const bgImg = src ? { backgroundImage: `url(${src})` } : undefined;
  // 인스타 = 이미지 강조형: 스마트폰 이미지(public/media/ig-hero.webp)가 카드 왼쪽을 채우고, 빛이 천천히 흐름. 스타일은 globals.css 의 .ig-* 참고.
  return (
    <div className={sides ? "bv ig-photo yt-photo" : "bv ig-photo"} aria-hidden="true">
      <div className={src && variant === "yt" ? "ig-back yt-back" : "ig-back"} style={bgImg} />
      {sides && <><i className="yt-side yt-l" style={{ backgroundImage: `url(${sides[0]})` }} /><i className="yt-side yt-r" style={{ backgroundImage: `url(${sides[1]})` }} /></>}
      <div className={!src ? "ig-img" : variant === "yt" ? "ig-img yt-img" : `ig-img ph-${variant}`} style={bgImg}>
        {draw && <svg className="ig-draw" viewBox="0 0 1860 1086" aria-hidden="true">
          <defs><filter id="ig-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter></defs>
          <path className="ig-trail" pathLength="1" d="M830 836 C1010 830 1180 770 1330 690 S1500 580 1568 520" />
          <path className="ig-trail ig-t2" pathLength="1" d="M735 522 C790 520 810 478 850 488 S915 505 950 462 S1010 440 1050 405 S1110 425 1135 392 S1200 340 1250 318" />
          <circle className="ig-ping" cx="1250" cy="318" r="10" />
        </svg>}
      </div>
      <i className="ig-shine" />
      <i className="ig-pulse" />
    </div>
  );
}

/** AI 노출 = 검색창에 질문이 한 글자씩 입력되면 추천 결과가 차례로 나타나는 움직이는 화면 (스타일: globals.css 의 .ais-*) */
export function AiSearchVisual() {
  return (
    <div className="bv ais" aria-hidden="true">
      <div className="ais-in">
        <div className="ais-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg>
          <span className="ais-q"><b>강남역 피부과 추천해줘</b></span>
          <i className="ais-go">↑</i>
        </div>
        <div className="ais-item is-hit">
          <i className="ais-logo" />
          <div><b>인팩트의원 <em><svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path pathLength="1" d="M2.6 6.4l2.3 2.3 4.5-4.9" /></svg></em></b><span>피부과 전문의 · 레이저 · 공식 홈페이지</span></div>
        </div>
        <div className="ais-item"><i className="ais-logo" /><div><i className="ais-line" /><i className="ais-line s" /></div></div>
        <div className="ais-tags"><span>진료 정보</span><span>공식 홈페이지 ↗</span></div>
      </div>
    </div>
  );
}

/** 개별 상품 6종 = 위 부스터 4종에 쓴 이미지를 돌려 보여주는 회전 카드 (가운데 → 왼쪽 → 뒤 → 오른쪽 → 가운데 …, 스타일: globals.css 의 .ind-*) */
const SHOWCASE = [
  { src: "/media/ig-hero4.webp", label: "INSTAGRAM" },
  { src: "/media/ba-face-new.webp", label: "BEFORE & AFTER" },
  { src: "/media/04f0c9aa-1050-4a48-87d3-5f5a8d838cdd.png", label: "AI SEARCH" },
  { src: "/media/yt-hero.webp", label: "YOUTUBE" },
];
export function IndividualShowcase() {
  return (
    <div className="bv ind" aria-hidden="true">
      <div className="ind-stage">
        {SHOWCASE.map((it, k) => (
          <div key={it.label} className={it.src.includes("ba-face") ? "ind-item ind-tall" : it.label === "AI SEARCH" ? "ind-item ind-small" : it.label === "YOUTUBE" ? "ind-item ind-port" : "ind-item ind-wide"} style={{ backgroundImage: `url(${it.src})`, "--k": k } as React.CSSProperties}>
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BeforeAfterVisual() {
  // 전후사진 = 한 얼굴을 반으로 나눈 사진(public/media/ba-face.webp) + 가운데 선을 따라 흐르는 푸른 빛
  return (
    <div className="bv bv-face" aria-hidden="true">
      <div className="bv-face-frame">
        <div className="bv-face-pic" />
        <i className="bv-face-line" />
        <span className="bv-face-pill" data-k="after">AFTER</span>
        <span className="bv-face-pill" data-k="before">BEFORE</span>
      </div>
    </div>
  );
}

export function AiVisual() {
  return (
    <Stage>
      <div className="bv-chat">
        <p className="bv-ask">강남에서 피부과 추천해줘</p>
        <div className="bv-card bv-answer">
          <span className="bv-ai-mark">✦</span>
          <ol>
            <li className="is-hit"><b>인팩트의원</b><span>피부과 전문의 · 레이저 · 공식 홈페이지</span></li>
            <li><i /><i /></li>
            <li><i /><i /></li>
          </ol>
          <div className="bv-chips"><span>진료 정보</span><span>공식 홈페이지 ↗</span></div>
        </div>
      </div>
    </Stage>
  );
}

export function YoutubeVisual() {
  return (
    <Stage>
      <div className="bv-card bv-yt-main">
        <div className="bv-yt-screen">
          <span className="bv-play"><em>▶</em></span>
          <span className="bv-yt-badge">롱폼</span>
        </div>
        <div className="bv-yt-bar"><i /></div>
        <div className="bv-yt-meta"><b>원장 인터뷰 — 시술 전 꼭 알아야 할 것</b><span>조회수 42K · 월 1회 촬영</span></div>
      </div>
      <div className="bv-yt-shorts">
        {[0, 1].map((n) => (
          <div key={n} className="bv-card bv-short" data-n={n}><span className="bv-yt-badge">Shorts</span><em>▶</em></div>
        ))}
      </div>
    </Stage>
  );
}

/** 개별 상품 6종 — 채널마다 작은 그림 + 이름 (영상·블로그·바이럴·체험단·광고·디자인 콘텐츠) */
const TILE_ART = [
  // 영상
  <svg key="v" viewBox="0 0 48 32"><rect x="2" y="2" width="44" height="28" rx="5" fill="rgba(255,255,255,.14)" /><path d="M20 10l11 6-11 6z" fill="#ff4d4d" /></svg>,
  // 블로그
  <svg key="b" viewBox="0 0 48 32"><rect x="4" y="2" width="40" height="28" rx="4" fill="rgba(255,255,255,.14)" /><rect x="9" y="7" width="16" height="3" rx="1.5" fill="#7ea2ff" /><rect x="9" y="14" width="30" height="2.4" rx="1.2" fill="rgba(255,255,255,.55)" /><rect x="9" y="19" width="26" height="2.4" rx="1.2" fill="rgba(255,255,255,.55)" /><rect x="9" y="24" width="20" height="2.4" rx="1.2" fill="rgba(255,255,255,.55)" /></svg>,
  // 바이럴
  <svg key="r" viewBox="0 0 48 32"><rect x="3" y="3" width="26" height="14" rx="6" fill="#4f7dff" /><rect x="19" y="14" width="26" height="14" rx="6" fill="rgba(255,255,255,.3)" /><circle cx="11" cy="10" r="1.6" fill="#fff" /><circle cx="16" cy="10" r="1.6" fill="#fff" /><circle cx="21" cy="10" r="1.6" fill="#fff" /></svg>,
  // 체험단
  <svg key="e" viewBox="0 0 48 32"><circle cx="14" cy="11" r="5" fill="rgba(255,255,255,.5)" /><circle cx="26" cy="11" r="5" fill="rgba(255,255,255,.35)" /><circle cx="38" cy="11" r="5" fill="rgba(255,255,255,.22)" /><path d="M24 30l-2-2.2-3 .3.5-3-2.4-2 3-.9 1.2-2.8 2.3 2 3-.6-.5 3 2.3 2-3 .8z" transform="translate(-6 -2) scale(1.1)" fill="#ffc94d" /></svg>,
  // 광고
  <svg key="a" viewBox="0 0 48 32"><rect x="3" y="2" width="42" height="28" rx="4" fill="rgba(255,255,255,.14)" /><rect x="8" y="17" width="5" height="9" rx="1" fill="#7ea2ff" /><rect x="17" y="12" width="5" height="14" rx="1" fill="#7ea2ff" /><rect x="26" y="7" width="5" height="19" rx="1" fill="#7ea2ff" /><rect x="35" y="10" width="6" height="5" rx="2" fill="#ff7a3d" /></svg>,
  // 디자인 · 콘텐츠
  <svg key="d" viewBox="0 0 48 32"><rect x="3" y="3" width="20" height="26" rx="3" fill="rgba(255,255,255,.14)" /><circle cx="13" cy="12" r="4.5" fill="#b98bff" /><rect x="7" y="20" width="12" height="2.4" rx="1.2" fill="rgba(255,255,255,.55)" /><rect x="27" y="3" width="18" height="12" rx="3" fill="#4f7dff" /><rect x="27" y="18" width="18" height="11" rx="3" fill="rgba(255,255,255,.3)" /></svg>,
];

export function IndividualVisual({ names }: { names: string[] }) {
  return (
    <Stage>
      <ul className="bv-tiles">
        {names.slice(0, 6).map((n, i) => (
          <li key={n} className="bv-card bv-tile">
            <span className="bv-tile-art">{TILE_ART[i]}</span>
            <b>{n}</b>
          </li>
        ))}
      </ul>
    </Stage>
  );
}
