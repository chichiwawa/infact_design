/** 모바일 시안 확인용: PC 화면에서는 가운데에 폰 크기(390×780) 액자로, 실제 폰에서는 화면 전체로 보여준다. 모바일 레이아웃은 화면 폭 기준이라 iframe 안에서 정확히 모바일로 동작 */
export function PhoneFrame({ src, label }: { src: string; label: string }) {
  return (
    <main style={{ minHeight: "100svh", background: "#1b1f2a", display: "grid", placeItems: "center", padding: "clamp(0px, 2vw, 24px)" }}>
      <div style={{ width: "min(390px, 100vw)", height: "min(780px, 100svh)", borderRadius: "clamp(0px, 8vw, 36px)", overflow: "hidden", boxShadow: "0 0 0 8px #0b0d14, 0 30px 80px rgba(0,0,0,.6)", background: "#000" }}>
        <iframe src={src} title={label} style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
      </div>
      <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 80, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,.92)", color: "#111", fontSize: 13, fontWeight: 700 }}>{label}</div>
    </main>
  );
}
