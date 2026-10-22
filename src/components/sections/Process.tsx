/**
 * 04 진행 프로세스 — 와이어프레임 04 + 벤치마킹 04-process NOTES
 *  - 카드가 zoomIn 0.5s, 0.25s 간격 순차 등장 (.zoom-stagger — 뷰포트 진입 시 1회 재생)
 *  디벨롭: 대형 번호 타이포(실제 순서라 유지), 아이콘 타일 제거.
 *  2026-09-16 사용자 요청 일괄 반영:
 *   - 메인 타이틀을 05 차별점 섹션과 크기 통일: `t-h-lg`(44px) → `t-h-xl`(56px)
 *   - 타이틀·서브텍스트를 한 줄로: DB 의 `\n` 개행 제거(제목은 공백으로, 서브텍스트는 공백으로) — 서브텍스트 문단의 `max-w-[32ch]`(줄바꿈 유도용)도 같이 제거
 *   - 스텝 5개 본문을 전부 2행으로 재작성(DB 값 자체를 수정 — `scripts/`가 아니라 일회성 스크립트로 해당 page_sections row만 UPDATE, seed 전체 재실행 금지 규칙 준수), 본문 문단에 `whitespace-pre-line` 추가해 `\n` 이 실제 줄바꿈으로 렌더되게 함
 *   - 박스 안 타이틀 y좌표 정렬: 04(MarketingTabs) 격자에서 겪은 것과 같은 원인(`md:mt-auto` 로 바닥 정렬 → 본문 줄 수 다르면 타이틀 높이 어긋남) — `md:mt-auto` 제거, 번호 아래 고정 gap(기존 `gap-5`)으로 top-anchor 전환. 이제 본문이 전부 2행이라 자연히도 맞지만, 구조적으로도 줄 수와 무관하게 정렬됨
 *  2026-09-16 섹션이 모니터 크기와 무관하게 항상 화면 전체를 채우도록(사용자 지적 — 섹션 높이가 짧아 위아래 섹션이 살짝 보임): `min-h-[calc(100dvh*var(--zi))] flex items-center` 추가(기존 `section-y` 패딩은 유지 — 짧은 화면에서 콘텐츠가 화면 경계에 바로 붙지 않도록 최소 여백 역할). 콘텐츠+패딩이 100dvh 보다 작으면 남는 공간을 flex 로 위아래 분배해 정확히 한 화면을 채우고, 콘텐츠가 더 크면(좁은 화면에서 카드가 여러 줄로 줄바꿈되는 경우 등) 자연스럽게 그 이상으로 늘어남.
 *  2026-09-16 PC 스텝을 화살표(쉐브론) 리본 체인으로 재설계(사용자 제공 레퍼런스 — "Step 01" 화살표가 오른쪽으로 이어지는 인포그래픽).
 *   1차: clip-path 이중 겹치기로 만들었다가 사용자가 "레퍼런스랑 정말 같냐"고 지적 — 세로로 너무 길쭉하고(레퍼런스는 얇고 넓은 리본), 뾰족함이 약하고(레퍼런스는 훨씬 두드러진 화살표), 모서리가 각지고(레퍼런스는 둥근 모서리), 테두리가 흐릿하고(진짜 stroke 가 아니라 3px 인셋 이중 도형 트릭), 그림자도 없어서 완전히 다시 만듦.
 *   2차: 진짜 SVG `<path>` + `stroke`(윤곽선) + `filter: drop-shadow`(도형 실루엣을 따라가는 그림자)로 교체. `roundedPolygonPath()` 헬퍼로 꼭짓점 목록을 받아 각 모서리를 둥글린 path data 를 생성(레퍼런스처럼 뾰족한 끝도 살짝 둥글게). 비율도 레퍼런스에 맞춰 훨씬 낮고 넓게(260px → 150px), 뾰족한 정도(팁 깊이)도 폭 대비 훨씬 크게 키움.
 *   3차: 2차에서 타이틀 라벨(문의/진단/…) 색도 P% 그라데이션을 그대로 써서, 35~50% 구간은 흰 배경 위에서 거의 안 보일 정도로 대비가 낮았음(스크린샷으로 발견) — 라벨 텍스트는 단계와 무관하게 항상 `text-primary`(100%, 읽기 쉬움)로 고정하고, 그라데이션은 윤곽선(stroke)에만 남김.
 *   4차: 3차 스크린샷에서 2번째 조각부터 라벨 위에 흐릿한 어두운 얼룩이 보임 — `drop-shadow` 가 원인이라 보고 `<li>` 개별 filter 를 `<ol>` 전체 하나로 옮겼는데도 얼룩이 그대로 남음(오판).
 *   5차(현재): 격리된 미니 재현(HTML 파일 두 개 놓고 겹쳐서 스크린샷)으로 원인 확정 — `-ml-12` 로 조각끼리 겹쳐놓은 게 진짜 원인. 각 조각의 왼쪽 홈(notch)은 그 부분에 아무것도 안 그리는 완전 투명 영역이라, 겹친 상태에서는 "뒤" 조각(이전 조각)의 뾰족한 끝 가장자리(그리고 그 둘레의 stroke anti-aliasing)가 살짝 비쳐 보이고, 이게 하필 라벨 텍스트 줄 높이와 겹쳐 얼룩처럼 보였음(2-조각만 떼어놓은 재현에서도 동일하게 재현·확인). 겹치기(`-ml-12`) 자체를 없애고 조각들을 그냥 나란히(gap 없이 flush) 배치 — 뾰족한 끝과 홈이 같은 자리에서 맞닿기만 하고 서로의 영역을 침범하지 않아 얼룩이 완전히 사라짐(격리 재현으로 그림자 포함 확인). 시각적으로도 이음매가 충분히 자연스러워 겹치기가 굳이 필요 없었음.
 *   색은 새 색 없이 시그니처 프라이머리 하나만 — `color-mix(in srgb, var(--color-primary) P%, white)`, P 를 35→100 으로 올려 윤곽선이 제일 오른쪽(05)만 순수 시그니처 컬러가 되게 함.
 *  2026-09-16 6차(사용자 질문 — "글씨랑 도형이랑 잘 맞는거지?"): 실측해보니 뾰족한 끝/홈의 침범 깊이는 타일 폭에 비례(SVG 뷰박스 %)하는데, 텍스트 padding 은 고정 px(`pl-11`/`pr-14`) 였음 — container-x 최대폭(1376px)에서 타일이 제일 넓어질 때(≈275px) 깊이도 같이 커져서(≈50px) 고정 padding 여유가 오히려 제일 좁아지는(심지어 음수에 가까워지는) 역설적인 상황. padding 을 고정 px 대신 `calc(뾰족한 비율% + 여유px)` 로 바꿔 타일 폭이 커지든 작아지든 항상 비례해서 안전 여유를 유지하게 함. 1728/1280/1024px 3개 폭에서 텍스트 bounding box 실측으로 도형 가장자리와 안 겹치는 것 확인.
 *  2026-09-17 7차 — 레퍼런스 재대조로 구조 자체를 바로잡음(사용자 지적: "도형 테두리 전체에 색을 넣지 말고 오른쪽 화살표 변만 조금 두껍게 + 파란 그라데이션, 5단계가 시그니처 컬러" / 조각 사이 간격도 틀림):
 *   - 윤곽선(stroke) 전체 채색 → 폐기. 흰 몸통(stroke 없음) 위에, 오른쪽 화살표 두 변만 따라가는 두꺼운 ">" 모양 색 띠(`bandPath`, 몸통과 같은 뾰족 끝 둥글림을 공유하는 별도 폴리곤)를 겹쳐 그림. 띠 색만 단계별 tint(45→100%, 05 = 순수 시그니처).
 *   - 5차에서 겹치기를 아예 없앴더니 앞 조각의 뾰족 끝과 다음 조각의 홈이 서로 안 맞물려 조각 사이에 큰 V자 빈틈이 생겼음(스크린샷의 "간격" 문제). 다시 겹치되, 겹침 양 = (팁 깊이 − SEAM_GAP) 로 두어 띠 바깥선과 다음 홈 사이에 의도된 얇은 틈만 남김 — 5차의 얼룩은 "정확히 딱 맞물린 두 가장자리의 안티에일리어싱이 겹쳐서" 생긴 것이라, 틈을 두면 깨끗한 이음매로 읽힘(격리 데모 + 1440/1024/1920 캡처로 확인). 겹침 양은 팁 깊이가 타일 폭 비례(%)라서 `ol` 폭 기준 % 로 환산: W=(O+(n−1)m)/n, m=ratio·W−G 를 풀어 m=(ratio·O/n−G)/(1−(n−1)ratio/n).
 *   - 몸통/띠 모서리 둥글림을 꼭짓점별로 다르게(`roundedPolygonPath` 가 반경 배열을 받음): 왼쪽 모서리 12, 뾰족 끝 14(띠 안쪽 끝 6), 홈 14, 띠가 덮는 위·아래 꼭짓점은 3.
 *   - 텍스트 세로 정렬을 가운데 → 상단 고정(pt-[30px])으로: 05 본문이 3행이라 가운데 정렬이면 "Step 05" 만 위로 떠서 헤더 라인이 안 맞았음.
 *  2026-09-17 8차 — 본문이 2행 카피인데도 3행으로 자동 줄바꿈되는 문제(사용자 스크린샷, 03·04·05): 글 영역 padding 을 "띠가 제일 안쪽까지 들어오는 위쪽 모서리" 기준 최악값으로 잡아서 실제로는 사선 아래쪽에 남는 공간을 못 쓰고 있었음.
 *   padding 대신 float 두 개로 교체: 왼쪽은 홈 깊이만큼의 사각형(글 왼쪽 끝은 일직선 유지), 오른쪽은 띠 안쪽 사선 모양의 `shape-outside` polygon — 각 줄이 자기 높이에서 실제로 남는 폭까지 흐름. 글 컨테이너는 flex-col → block 으로(float 는 flex 컨테이너 안에서 무시됨), 위아래 여백은 컨테이너 padding 이 아니라 첫/끝 문단의 padding 으로 옮겨 float 높이(100%)가 도형 높이와 정확히 일치하게 함(컨테이너 padding 이 있으면 polygon 의 50% 가 도형 세로 중앙과 어긋남).
 *   STEP 4 본문은 줄바꿈 위치를 "설계한 전략을 직접 / 실행하며 성과를 만듭니다." 로 DB 일회성 UPDATE(+seed.ts 동기화).
 *   ⚠️ 칸 높이는 `min-h` 가 아니라 화면 폭 구간별 고정 높이(`h-[236px] xl:h-[206px] 2xl:h-[190px]`) — float 높이(100%)가 칸 높이에, 칸 높이가 글 줄 수에 의존하는 순환 때문에 min-h 로 두면 브라우저가 첫 계산을 float 없이 하고(줄 수 과소) 나중에 늘어난 높이로 float 를 적용해 글이 칸 밖으로 넘침(1024/1280 실측). 고정 높이면 계산이 한 번에 끝남. 높이를 바꾸려면 세 값을 같이 조정(2xl=1536↑ 2행, xl=1280↑ 3행, lg=1024↑ 4행 기준으로 맞춘 값).
 */
import Accent from "@/components/Accent";
import type { ProcessData } from "@/lib/sections";

/** 화살표 띠 색 단계 — 제일 오른쪽(05)만 100%(순수 시그니처 컬러), 그 전은 옅은 단계 */
const STEP_TINT = [45, 60, 75, 88, 100];
/**
 * 타이틀(문의/진단/…) 색 단계 — 띠(STEP_TINT)와 완전히 동일한 그라데이션.
 * ⚠️ 1·2단계(45%·60%)는 흰 배경 위 대비가 1.9:1·2.5:1로 WCAG 3:1(굵은 22px 대문자, large-text 기준) 미달
 * (이 파일 히스토리의 "3차" 항목·2026-09-17 한 차례 더 겪은 것과 동일한 트레이드오프) — 사용자가 가독성보다 띠와 완전히 같은 그라데이션 톤을 선호해 이대로 확정.
 */
const TITLE_TINT = STEP_TINT;

const CHEVRON_W = 320;
const CHEVRON_H = 150;
const CHEVRON_TIP = 60; // 폭의 ~18% — 레퍼런스처럼 뾰족함이 두드러지게
const BAND_W = 15; // 오른쪽 화살표 변을 따라가는 색 띠의 가로 두께(뷰박스 단위)
const SEAM_GAP = 5; // 앞 조각 띠 바깥선 ↔ 다음 조각 홈 사이 틈(px)
const R_CORNER = 12; // 왼쪽 모서리
const R_TIP = 14; // 뾰족 끝(바깥)
const R_TIP_IN = 5; // 띠 안쪽 끝
const R_NOTCH = 14; // 홈
const R_EDGE = 3; // 띠가 덮는 위·아래 꼭짓점

function normalize([x, y]: [number, number]): [number, number] {
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

/** 꼭짓점 목록을 꼭짓점별 반경만큼 둥글린 SVG path data 로 변환(각 꼭짓점을 2차 베지어로 깎아냄) */
function roundedPolygonPath(points: [number, number][], radii: number[]) {
  const n = points.length;
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const cur = points[i];
    const next = points[(i + 1) % n];
    const r = radii[i];
    const toPrev = normalize([prev[0] - cur[0], prev[1] - cur[1]]);
    const toNext = normalize([next[0] - cur[0], next[1] - cur[1]]);
    const p1: [number, number] = [cur[0] + toPrev[0] * r, cur[1] + toPrev[1] * r];
    const p2: [number, number] = [cur[0] + toNext[0] * r, cur[1] + toNext[1] * r];
    d.push(i === 0 ? `M ${p1[0]} ${p1[1]}` : `L ${p1[0]} ${p1[1]}`);
    d.push(`Q ${cur[0]} ${cur[1]} ${p2[0]} ${p2[1]}`);
  }
  d.push("Z");
  return d.join(" ");
}

/** 흰 몸통 — 오른쪽 뾰족(팁), i>0 은 왼쪽에 앞 조각의 팁이 들어오는 홈 */
function bodyPath(isFirst: boolean) {
  const [w, h, t] = [CHEVRON_W, CHEVRON_H, CHEVRON_TIP];
  const points: [number, number][] = isFirst
    ? [[0, 0], [w - t, 0], [w, h / 2], [w - t, h], [0, h]]
    : [[0, 0], [w - t, 0], [w, h / 2], [w - t, h], [0, h], [t, h / 2]];
  const radii = isFirst ? [R_CORNER, R_EDGE, R_TIP, R_EDGE, R_CORNER] : [R_CORNER, R_EDGE, R_TIP, R_EDGE, R_CORNER, R_NOTCH];
  return roundedPolygonPath(points, radii);
}

/** 색 띠 — 오른쪽 화살표 두 변만 따라가는 두꺼운 ">" (몸통 위에 겹쳐 그림, 바깥 뾰족 끝 둥글림은 몸통과 동일) */
function bandPath() {
  const [w, h, t, b] = [CHEVRON_W, CHEVRON_H, CHEVRON_TIP, BAND_W];
  const points: [number, number][] = [[w - t - b, 0], [w - t, 0], [w, h / 2], [w - t, h], [w - t - b, h], [w - b, h / 2]];
  return roundedPolygonPath(points, [0, R_EDGE, R_TIP, R_EDGE, 0, R_TIP_IN]);
}

/**
 * 조각 겹침 양(i>0 의 margin-left) — 팁 깊이(ratio·W) − SEAM_GAP.
 * W 는 ol 폭 O 에 겹침이 더해져 커지므로(W=(O+(n−1)m)/n) m 을 O 기준 % 로 풀어 씀: m=(ratio·O/n−G)/(1−(n−1)·ratio/n)
 */
function overlapMargin(n: number) {
  const ratio = CHEVRON_TIP / CHEVRON_W;
  const k = 1 - ((n - 1) * ratio) / n;
  return `calc(${((-ratio / n / k) * 100).toFixed(4)}% + ${(SEAM_GAP / k).toFixed(2)}px)`;
}

/** 글 영역 float 치수 — 홈 깊이 / (팁+띠) 폭 / 오른쪽 float 안에서 띠 안쪽 끝의 x (모두 %) */
const tipPct = +((CHEVRON_TIP / CHEVRON_W) * 100).toFixed(2);
const rightPct = +(((CHEVRON_TIP + BAND_W) / CHEVRON_W) * 100).toFixed(2);
const bandInnerX = +((CHEVRON_TIP / (CHEVRON_TIP + BAND_W)) * 100).toFixed(2);

/**
 * 모바일 세로 화살표 체인(2026-09-21 사용자 확정, design/demos/process-mobile-vchevron.html 시안 이식) —
 * PC 쉐브론(오른쪽으로 뾰족)을 90도 돌려 아래로 뾰족하게: 카드는 화면 전체 폭이라 PC 처럼 정교한
 * float+shape-outside 텍스트 회피는 불필요(그냥 중앙 정렬 + 아래쪽 고정 여백). 좌표는 픽셀 고정(카드
 * 높이 자체가 고정 px 라 % 환산 불필요 — PC 는 폭이 breakpoint 마다 크게 달라져 % 계산이 필요했음).
 */
const V_W = 340, V_H = 192;
const V_TIP = 28;     // 아래로 파고드는 뾰족한 깊이
const V_BAND = 10;    // 두 사선을 따라가는 색 띠 두께
const V_SEAM_GAP = 6; // 앞 조각 뾰족 끝 ↔ 다음 조각 홈 사이 의도된 얇은 틈(px)
const V_R_CORNER = 18;
const V_R_TIP = 14;
const V_R_TIP_IN = 5;
const V_R_EDGE = 4;
const V_R_NOTCH = 14;

/** 흰 몸통 — 아래로 뾰족(팁), i>0 은 위쪽 가운데에 앞 조각의 팁이 들어오는 홈 */
function vBodyPath(isFirst: boolean) {
  const points: [number, number][] = isFirst
    ? [[0, 0], [V_W, 0], [V_W, V_H - V_TIP], [V_W / 2, V_H], [0, V_H - V_TIP]]
    : [[0, 0], [V_W / 2, V_TIP], [V_W, 0], [V_W, V_H - V_TIP], [V_W / 2, V_H], [0, V_H - V_TIP]];
  const radii = isFirst
    ? [V_R_CORNER, V_R_CORNER, V_R_EDGE, V_R_TIP, V_R_EDGE]
    : [V_R_CORNER, V_R_NOTCH, V_R_CORNER, V_R_EDGE, V_R_TIP, V_R_EDGE];
  return roundedPolygonPath(points, radii);
}
/** 색 띠 — 아래 화살표 두 변만 따라가는 두꺼운 색 띠(몸통과 동일한 뾰족 끝 둥글림 공유) */
function vBandPath() {
  const points: [number, number][] = [[0, V_H - V_TIP - V_BAND], [0, V_H - V_TIP], [V_W / 2, V_H], [V_W, V_H - V_TIP], [V_W, V_H - V_TIP - V_BAND], [V_W / 2, V_H - V_BAND]];
  return roundedPolygonPath(points, [0, V_R_EDGE, V_R_TIP, V_R_EDGE, 0, V_R_TIP_IN]);
}

export default function Process({ title, data }: { title: string; data: ProcessData }) {
  return (
    <section className="section-y min-h-[calc(100dvh*var(--zi))] flex items-center bg-canvas border-t border-hairline">
      <div className="container-x">
        {/* 제목·부제 중앙 정렬 (2026-09-16 사용자 요청) */}
        <div className="text-center" data-reveal>
          <h2 className="t-h-xl text-ink"><Accent text={title} /></h2>
          <p className="t-lead text-body mt-6 mx-auto">{data.subtitle}</p>
        </div>

        {/* PC: 화살표(쉐브론) 리본 체인 — 흰 몸통 + 오른쪽 화살표 변만 두꺼운 색 띠, 앞 조각 팁이 다음 조각 홈에 (SEAM_GAP 만큼 틈을 두고) 맞물림 */}
        <ol className="zoom-stagger mt-16 hidden lg:flex" style={{ filter: "drop-shadow(0 10px 20px rgba(16,24,40,0.10))" }}>
          {data.steps.map((s, i) => {
            const pct = STEP_TINT[i] ?? 100;
            const color = `color-mix(in srgb, var(--color-primary) ${pct}%, white)`;
            const titleColor = `color-mix(in srgb, var(--color-primary) ${TITLE_TINT[i] ?? 100}%, white)`;
            const isFirst = i === 0;
            return (
              <li key={s.tag} className="relative flex-1 h-[236px] xl:h-[206px] 2xl:h-[190px]" style={isFirst ? undefined : { marginLeft: overlapMargin(data.steps.length) }}>
                <svg viewBox={`0 0 ${CHEVRON_W} ${CHEVRON_H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
                  <path d={bodyPath(isFirst)} fill="white" />
                  <path d={bandPath()} fill={color} />
                </svg>
                {/* 글 영역 — 왼쪽은 홈 깊이만큼 고정 여백(float 사각형: 글 왼쪽 끝이 일직선), 오른쪽은 띠 안쪽 사선을 따라 글이 흐르도록 shape-outside float */}
                <div className="relative h-full">
                  <span aria-hidden="true" className="float-left h-full" style={isFirst ? { width: 32 } : { width: `${tipPct}%`, marginRight: 12 }} />
                  <span aria-hidden="true" className="float-right h-full" style={{ width: `${rightPct}%`, shapeOutside: `polygon(0 0, ${bandInnerX}% 50%, 0 100%, 100% 100%, 100% 0)`, shapeMargin: 12 }} />
                  <p className="flex items-baseline gap-1.5 text-mute pt-[30px]">
                    <span className="text-[15px] font-semibold">Step</span>
                    <span className="text-[20px] font-extrabold text-ink tracking-[-1px]">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <p className="mt-3 text-[22px] font-bold tracking-[0.04em] uppercase" style={{ color: titleColor }}>{s.title}</p>
                  <p className="mt-1.5 pb-6 text-[15px] leading-[1.55] text-body whitespace-pre-line">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* 모바일/태블릿: 세로 화살표 체인 — PC 쉐브론을 90도 돌려 아래로 뾰족, 뾰족 끝이 다음 카드 위쪽 홈에 맞물림 */}
        <ol className="zoom-stagger mt-16 lg:hidden">
          {data.steps.map((s, i) => {
            const isFirst = i === 0;
            const pct = STEP_TINT[i] ?? 100;
            const color = `color-mix(in srgb, var(--color-primary) ${pct}%, white)`;
            return (
              <li key={s.tag} className="relative" style={isFirst ? undefined : { marginTop: -(V_TIP - V_SEAM_GAP) }}>
                <svg viewBox={`0 0 ${V_W} ${V_H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 8px 20px rgba(16,24,40,0.09))" }} aria-hidden="true">
                  <path d={vBodyPath(isFirst)} fill="white" />
                  <path d={vBandPath()} fill={color} />
                </svg>
                <div className="relative text-center px-6" style={{ height: V_H, paddingTop: isFirst ? 24 : 24 + V_TIP - 10 }}>
                  <p className="flex items-baseline justify-center gap-1.5 text-mute">
                    <span className="text-[13px] font-semibold">Step</span>
                    <span className="text-[17px] font-extrabold text-ink tracking-[-0.6px]">{String(i + 1).padStart(2, "0")}</span>
                  </p>
                  <p className="mt-2 text-[21px] leading-[1.2] font-bold tracking-[0.02em] uppercase" style={{ color }}>{s.title}</p>
                  <p className="mt-1 text-[14.5px] leading-[1.55] text-body whitespace-pre-line">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="t-body-lg text-mute mt-10 text-center">{data.note}</p>
      </div>
    </section>
  );
}
