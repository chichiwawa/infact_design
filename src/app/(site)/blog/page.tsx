import type { Metadata } from "next";
import { getPublishedBlogs } from "@/lib/queries";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: { absolute: "병원 마케팅 블로그 | 인팩트컴퍼니 인사이트" },
};

export default async function BlogIndex() {
  const posts = await getPublishedBlogs();

  return (
    <>
      <section className="bg-canvas pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="container-x">
          <h1 className="t-h-xl text-ink">병원 마케팅 <span className="accent">인사이트</span></h1>
          <p className="t-lead text-body mt-6 prose-ko">현장에서 확인한 것만 씁니다. 유입·전환·브랜딩, 세 가지 고민에 답하는 글을 모았습니다.</p>

          {posts.length === 0 ? (
            <p className="t-body text-mute mt-12">아직 발행된 글이 없습니다.</p>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.id}><BlogCard post={p} /></li>
              ))}
            </ul>
          )}

          <p className="t-body-sm text-mute mt-12">
            RSS 구독: <a href="https://infactcompany.com/rss" className="underline underline-offset-2 hover:text-ink">https://infactcompany.com/rss</a>
          </p>
        </div>
      </section>
    </>
  );
}
