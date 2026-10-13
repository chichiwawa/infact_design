/**
 * SectionHead — 서비스 페이지 섹션 머리말 (2026-09-17: 세 섹션의 제목을 중앙정렬·같은 크기로 통일)
 *  제목 t-h-xl(56) + 선택적 서브 t-lead(19) — 메인 하단 CTA 머리말과 같은 조합.
 *  서브는 한 줄 문구 (좁은 화면에선 자동 줄바꿈, 줄 길이는 text-balance 로 고르게).
 */
import Accent from "@/components/Accent";

export default function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center" data-reveal>
      {/* 56px 고정이면 가장 긴 제목(패키지 둘째 줄, 56px 에서 ≈1043px)이 1200px 아래 폭에서 세 줄로 넘어간다 → 폭에 비례해 줄여 두 줄 유지 */}
      <h2 className="t-h-xl text-ink" style={{ fontSize: "clamp(30px, 4.6vw, 56px)" }}><Accent text={title} /></h2>
      {sub && <p className="t-lead text-body mt-5 text-balance">{sub}</p>}
    </div>
  );
}
