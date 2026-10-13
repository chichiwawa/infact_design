/**
 * 05 차별점 4가지 — 와이어프레임 05 + 벤치마킹 05-differentiators NOTES
 *  - .reveal-stagger: 뷰포트 진입 시 translateY(32px)→0, .7s, 80ms 스태거, 1회성
 *  디벨롭: 다크 밴드 + 초대형 제목(액센트 구절) + hairline 그리드 셀 (레퍼런스 파트너 그리드 실측 구조) (장식 번호 없음).
 *  2026-09-16 셀 호버 액센트(사용자 요청 — "호버하면 가로 중앙에서 위아래로 시그니처 컬러로 변경"): 처음엔 왼쪽 테두리 바로 구현했다가 사용자가 "배경색이라고 분명히 말했다"고 정정 — 셀 전체를 덮는 `::before`(inset-0, bg-primary)를 기본 `scale-y-0`(origin: center)에서 호버 시 `scale-y-100` 으로 전환, 셀 배경이 세로 중앙에서 위아래로 퍼지며 시그니처 컬러로 채워짐. 텍스트는 `relative` 로 pseudo-element 위에 오도록 처리. 전환 속도는 사용자가 "조금만 낮춰달라"고 해서 300ms → 500ms 로 조정.
 *  2026-09-16 서브 텍스트(본문) 호버 시 흰색으로(사용자 요청): `li` 에 `group` 추가, 본문 `text-white/65` → 호버 시 `group-hover:text-white`(500ms, 배경 전환과 속도 맞춤) — 블루 배경 위에서 가독성 상승.
 *  2026-09-16 섹션이 모니터 크기와 무관하게 항상 화면 전체를 채우도록(사용자 지적 — 04 프로세스 섹션과 함께, 섹션 높이가 짧아 위아래 섹션이 살짝 보임): `min-h-[100dvh] flex items-center` 추가(기존 `section-y` 패딩은 최소 여백으로 유지).
 */
import Accent from "@/components/Accent";
import type { DifferentiatorsData } from "@/lib/sections";

export default function Differentiators({ title, data }: { title: string; data: DifferentiatorsData }) {
  return (
    <section className="section-y min-h-[100dvh] flex items-center bg-night text-white on-dark">
      <div className="container-x">
        {/* 제목 중앙 정렬 (2026-09-16 사용자 요청). 도입구("원장님들이 공통으로 말씀하신")는 제목으로 이어지는 문장이라 제목 위에 둠 */}
        <div className="text-center" data-reveal>
          <p className="t-lead text-white/60">{data.eyebrow}</p>
          <h2 className="t-h-xl mt-3"><Accent text={title} /></h2>
        </div>

        <ol className="reveal-stagger dark-grid mt-16 md:grid-cols-2">
          {data.items.map((it) => (
            <li key={it.title} className="group relative overflow-hidden p-8 md:p-12 flex flex-col before:content-[''] before:absolute before:inset-0 before:bg-primary before:origin-center before:scale-y-0 before:transition-transform before:duration-500 hover:before:scale-y-100">
              <div className="relative">
                <h3 className="text-[22px] md:text-[26px] font-bold leading-[1.3] tracking-[-0.8px]">{it.title}</h3>
                <p className="t-body-lg text-white/65 group-hover:text-white transition-colors duration-500 mt-4 max-w-[46ch]">{it.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
