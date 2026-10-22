"use client";

/**
 * 03 마케팅 설계 — "성장단계에 맞춘 맞춤형 마케팅 전략" 3카드 레이아웃 (2026-10-22 시안 반영)
 *  - 실제 레이아웃·스타일은 `PackageStepsCards.tsx`, `package-steps-cards.css` 에 있다. 고칠 때는 그쪽을 수정.
 *  - 이전 펼침 패널 버전(`PackageStepsDark.tsx` variant "c") 은 /demo/ps-c 에서 그대로 볼 수 있다.
 *  - 이전 버전(화면 고정 + 스크롤로 카드 한 장씩 넘김, 밝은 카드)은 `백업/03_마케팅설계_스크롤카드버전_2026-10-22/` 에 보관.
 */
import PackageStepsCards from "@/components/sections/PackageStepsCards";
import type { PackageStepsData } from "@/lib/sections";

export default function PackageSteps({ title, data }: { title: string; data: PackageStepsData }) {
  return <PackageStepsCards title={title} data={data} />;
}
