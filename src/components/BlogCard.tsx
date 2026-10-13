import Link from "next/link";
import type { BlogSummary } from "@/lib/queries";

export function fmtDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** 썸네일 맞춤 — 가로세로 비율 1.3 미만(정사각·아이콘류)은 잘리지 않게 contain+여백, 아니면 cover (글 상세 ArticleImage 와 같은 규칙, 2026-09-22) */
export function thumbFit(img: { width: number | null; height: number | null } | null): { box: string; img: string } {
  const ratio = img?.width && img?.height ? img.width / img.height : 16 / 9;
  return ratio < 1.3 ? { box: "p-4", img: "object-contain" } : { box: "", img: "object-cover" };
}

export default function BlogCard({ post }: { post: BlogSummary }) {
  const fit = thumbFit(post.featured_image);
  return (
    <article className="card card-hover overflow-hidden h-full flex flex-col rounded-[20px]">
      <Link href={`/blog/${post.slug}`} className={`block aspect-[16/9] bg-primary-soft overflow-hidden ${fit.box}`}>
        {post.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featured_image.url} alt={post.featured_image.alt || post.title} className={`w-full h-full ${fit.img}`} loading="lazy" />
        ) : (
          <span aria-hidden="true" className="block w-full h-full bg-[radial-gradient(120%_90%_at_20%_10%,#e8eeff_0%,#fafafa_70%)]" />
        )}
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <div className="t-body-sm text-mute flex gap-2">
          {post.category?.title && <span className="text-primary font-semibold">{post.category.title}</span>}
          <time dateTime={post.published_at ?? undefined}>{fmtDate(post.published_at)}</time>
        </div>
        <h2 className="t-h-md text-ink mt-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link>
        </h2>
        {post.excerpt && <p className="t-body text-body mt-2 line-clamp-3">{post.excerpt}</p>}
      </div>
    </article>
  );
}
