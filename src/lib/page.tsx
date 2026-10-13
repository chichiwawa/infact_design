/**
 * page.tsx — 공개 페이지 공통 조립 (메타데이터 + 섹션 렌더)
 */
import type { Metadata } from "next";
import { getPage, getBusiness } from "./queries";
import SectionRenderer from "@/components/SectionRenderer";

/** 오른쪽 하단 "INFACT." 링이 나타나는 섹션 인덱스 — 메인: 3번째(흰 배경 03)부터, 서비스: 2번째부터 (2026-09-21 사용자 지정) */
const RING_FROM: Record<string, number> = { home: 2, services: 1 };

export async function pageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: slug === "home" ? { absolute: page.title } : page.title,
    description: page.meta_description ?? undefined,
  };
}

export async function SitePageView({ slug }: { slug: string }) {
  const [page, biz] = await Promise.all([getPage(slug), getBusiness()]);

  if (!page) {
    return (
      <section className="pt-40 pb-32">
        <div className="container-x text-center">
          <h1 className="t-h-lg text-ink">페이지 콘텐츠를 준비 중입니다</h1>
          <p className="t-body text-body mt-3">
            <code>src/content/pages.json</code>에 <code>{slug}</code> 페이지가 없습니다.
          </p>
        </div>
      </section>
    );
  }

  return <SectionRenderer sections={page.sections} biz={biz} ringFrom={RING_FROM[slug]} />;
}
