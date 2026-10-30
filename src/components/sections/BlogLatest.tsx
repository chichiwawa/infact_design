/**
 * 05.5 병의원 인사이트 — 발행 글 최신순 4개 (2026-09-22, 사용자 요청 "블로그를 메인 함께한 병원 위에 4개씩 최신글 순으로")
 *  - 카드 내용은 시드가 아니라 blogs 테이블을 직접 조회 → 관리자에서 발행하면 메인(revalidate 300)에 자동 반영.
 *  - 글이 4개 미만이면 있는 만큼만, 0개면 섹션 자체를 렌더하지 않음.
 *  - 배경은 흰색(사용자 결정: 05 차별점만 검정으로 강조). 제목·서브는 05·06 과 같이 중앙 정렬.
 *  - 카드는 블로그 목록(BlogCard)과 같은 가족(흰 카드·hairline·20px 라운드)이되 4열에 맞춰 제목 2줄·요약 2줄로 고정, 이미지는 호버 시 천천히 확대.
 *  - 열 수: <640 가로 스와이프 / 640~ 2열 / 1280~ 4열.
 */
import Link from "next/link";
import Accent from "@/components/Accent";
import { fmtDate, thumbFit } from "@/components/BlogCard";
import { getPublishedBlogs } from "@/lib/queries";
import type { BlogLatestData } from "@/lib/sections";

export default async function BlogLatest({ title, data }: { title: string; data: BlogLatestData }) {
  const posts = await getPublishedBlogs(4);
  if (posts.length === 0) return null;

  return (
    <section className="section-y bg-canvas" aria-label="병의원 인사이트">
      <div className="container-x">
        <div className="text-center" data-reveal>
          <h2 className="t-h-xl text-ink sec-ttl"><Accent text={title} /></h2>
          {data.sub && <p className="t-lead text-body mt-5 text-balance">{data.sub}</p>}
        </div>

        {/* 모바일(<640): 가로 스와이프 한 줄(다음 카드가 살짝 보이게 78% 폭, 스크롤바 숨김) — 세로로 4장 쌓으면 섹션이 2,100px 로 너무 길어짐(사용자가 모바일 세로 여백을 여러 번 지적).
            snap-start 는 스크롤 컨테이너의 패딩 안쪽에 맞추므로 scroll-pl-5 가 없으면 첫 카드가 화면 왼쪽 끝(x=0)에 붙는다(실측).
            640~1279: 2열 / 1280~: 4열 (1024 에서 4열은 카드 222px 라 제목이 세 단어에서 잘림 → xl 부터) */}
        <ul className="reveal-stagger mt-12 md:mt-16 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-5 -mx-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {posts.map((p) => (
            <li key={p.id} className="h-full shrink-0 w-[78%] snap-start sm:w-auto sm:shrink">
              <article className="group card card-hover overflow-hidden h-full flex flex-col rounded-[20px]">
                <Link href={`/blog/${p.slug}`} className={`block aspect-[16/10] bg-primary-soft overflow-hidden ${thumbFit(p.featured_image).box}`} tabIndex={-1} aria-hidden="true">
                  {p.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.featured_image.url}
                      alt=""
                      className={`w-full h-full ${thumbFit(p.featured_image).img} transition-transform duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:scale-[1.04]`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="block w-full h-full bg-[radial-gradient(120%_90%_at_20%_10%,#e8eeff_0%,#fafafa_70%)]" />
                  )}
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="t-body-sm text-mute flex gap-2">
                    {p.category?.title && <span className="text-primary font-semibold">{p.category.title}</span>}
                    <time dateTime={p.published_at ?? undefined}>{fmtDate(p.published_at)}</time>
                  </div>
                  <h3 className="t-h-md text-ink mt-2 line-clamp-2">
                    <Link href={`/blog/${p.slug}`} className="hover:text-primary transition-colors duration-300">{p.title}</Link>
                  </h3>
                  {p.excerpt && <p className="t-body text-body mt-2 line-clamp-2">{p.excerpt}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 md:mt-14 text-center" data-reveal>
          <Link href="/blog" className="btn-secondary">{data.cta_label ?? "블로그 전체 보기"}</Link>
        </div>
      </div>
    </section>
  );
}
