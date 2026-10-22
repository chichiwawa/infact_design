"use client";

/**
 * 03 마케팅 설계 — 어두운 배경 + 좌우 분할 제목 + 단계 알약 + 펼쳐지는 사진 패널 3장 (2026-10-22, /demo/ps-c 시안 확정; 처음엔 ps-b 였다가 변경)
 *  - 이전 버전(화면 고정 + 스크롤로 카드 한 장씩 넘김, 밝은 카드)은 `백업/03_마케팅설계_스크롤카드버전_2026-10-22/` 에 보관.
 *  - 실제 레이아웃·스타일은 같은 폴더의 컴포넌트(`PackageStepsDark.tsx` variant "c", `package-steps-dark.css`)를 그대로 쓴다. 고칠 때는 그쪽을 수정.
 *  - 스크롤 고정(pin)·스냅이 없어져서 `setSnapLock("pkg")` 는 더 이상 쓰지 않는다.
 */
import PackageStepsDark from "@/components/sections/PackageStepsDark";
import type { PackageStepsData } from "@/lib/sections";

export default function PackageSteps({ title, data }: { title: string; data: PackageStepsData }) {
  return <PackageStepsDark title={title} data={data} variant="c" />;
}
