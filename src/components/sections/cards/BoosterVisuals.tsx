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

export function InstaVisual() {
  return (
    <Stage>
      <div className="bv-card bv-insta-profile">
        <div className="bv-insta-head">
          <i className="bv-avatar" />
          <div><b>infact_clinic</b><span>피부과 · 서울</span></div>
        </div>
        <ul className="bv-insta-stats">
          <li><b>24</b><span>게시물</span></li>
          <li><b>5.8K</b><span>팔로워</span></li>
          <li><b>120</b><span>팔로잉</span></li>
        </ul>
        <div className="bv-insta-reels">
          {[0, 1, 2].map((n) => <i key={n} data-n={n}><em>▶</em></i>)}
        </div>
      </div>
      <div className="bv-card bv-insta-growth">
        <span className="bv-label">팔로워</span>
        <b className="bv-big">1.2K <i>→</i> 5.8K</b>
        <svg viewBox="0 0 120 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f7dff" stopOpacity=".5" /><stop offset="1" stopColor="#4f7dff" stopOpacity="0" /></linearGradient>
          </defs>
          <path d="M0 44 C20 42 30 38 45 34 S75 24 90 14 L120 4 L120 50 L0 50Z" fill="url(#bvg)" />
          <path pathLength="1" d="M0 44 C20 42 30 38 45 34 S75 24 90 14 L120 4" fill="none" stroke="#7ea2ff" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="bv-chips"><span>도달 125K</span><span>참여 8.4K</span></div>
      </div>
    </Stage>
  );
}

export function BeforeAfterVisual() {
  // 전후사진 = 시술 사진 8장(public/media/ba-1~8.jpg, 검색 결과 이미지에서 잘라 낸 것)이 차례로 떠오르고 푸른 빛이 훑고 지나가는 움직임
  return (
    <Stage>
      <div className="bv-photos-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <i key={n} style={{ backgroundImage: `url(/media/ba-${n}.jpg)`, animationDelay: `${(n - 1) * 0.18}s` }}><em>★★★★★</em></i>
        ))}
        <span className="bv-photos-scan" />
      </div>
    </Stage>
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
