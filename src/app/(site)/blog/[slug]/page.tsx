import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlog, getBusiness, getGlossaryMatches, getPublishedBlogs } from "@/lib/queries";
import BlogCard from "@/components/BlogCard";
import { ArticleBody, ArticleHeader, ArticleImage } from "@/components/BlogArticle";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };
  return { title: post.seo_title || post.title };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, biz] = await Promise.all([getBlog(slug), getBusiness()]);
  if (!post) notFound();

  const bodyText = post.sections_html.map((s) => s.html.replace(/<[^>]*>/g, "")).join(" ");
  const [related, glossary] = await Promise.all([
    getPublishedBlogs(4).then((list) => list.filter((p) => p.slug !== post.slug).slice(0, 3)),
    getGlossaryMatches(bodyText),
  ]);
  const view = { ...post, category_title: post.category?.title ?? null, author_name: post.author?.name ?? biz?.name ?? null, glossary };

  return (
    <>
      <div className="bg-canvas">
        {/* 읽기 컬럼 780px 가운데 정렬, CTA·다른 글은 하단 (2026-09-22 사용자 확정) */}
        <article className="container-x pb-16 md:pb-20">
          <div className="mx-auto max-w-[780px]">
            <ArticleHeader post={view} />
            <ArticleImage post={view} />
            <ArticleBody post={view} />

            <div className="mt-16 rounded-lg bg-primary text-white p-7 md:p-8 text-center">
              <p className="t-eyebrow text-white/80">Consultation</p>
              <p className="mt-2 t-h-md text-white">우리 병원엔 무엇이 필요할까요?</p>
              <p className="mt-2 t-body text-white/85">문의하시면 마케팅 진단 리포트와 상품소개서를 보내드립니다.</p>
              <Link href="/contact" className="btn-on-dark mt-6 inline-flex">문의하기</Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="container-x pb-24 md:pb-32">
            <div className="mx-auto max-w-[1160px]">
              <h2 className="t-h-md text-ink">다른 글</h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => <li key={r.id}><BlogCard post={r} /></li>)}
              </ul>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
