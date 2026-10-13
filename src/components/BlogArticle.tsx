/**
 * BlogArticle — 공개 글 페이지와 관리자 편집기 미리보기가 같이 쓰는 렌더러 (02 §2.1 운영원칙 2: 미리보기 = 공개 마크업).
 * 2026-09-22 재설계(사용자 확정): 가운데 정렬 단일 읽기 컬럼 780px (레퍼런스 실측: 제목 중앙·도입문 640px·저자 띠·대표 이미지 원본 비율·
 *   핵심 요약 블록·목차·본문 16px/1.85·결론 인용·용어·FAQ 아코디언). 색·폰트는 INFACT 토큰 유지. CTA·다른 글은 페이지 하단.
 * 05 부록 D-6: sections_html 의 html 은 완결된 블록 — <p>로 다시 감싸지 않고 그대로 삽입. 표는 가로 스크롤 래퍼로 감싼다.
 */
import Link from "next/link";
import type { FeaturedImage } from "@/lib/queries";
import { fmtDate } from "@/components/BlogCard";

export interface GlossaryItem { term: string; slug?: string | null; description?: string | null; one_liner?: string | null }

export interface ArticleView {
  title: string;
  published_at: string | null;
  lede: string | null;
  key_answer: string | null;
  tldr: { line: string }[];
  quote_ready?: { line: string }[];
  sections_html: { heading: string; html: string }[];
  faqs: { question: string; answer: string }[];
  featured_image: FeaturedImage | null;
  category_title?: string | null;
  author_name?: string | null;
  glossary?: GlossaryItem[];
}

/** 한글 기준 분당 500자 */
export function readMinutes(post: ArticleView): number {
  const chars = [post.lede ?? "", post.key_answer ?? "", ...post.sections_html.map((s) => s.html)].join("").replace(/<[^>]*>/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

/** 모델이 만든 html 에는 표 래퍼가 없다 → 모바일 가로 스크롤 컨테이너로 감싼다 */
function wrapTables(html: string): string {
  return html.replace(/<table/g, '<div class="table-scroll"><table').replace(/<\/table>/g, "</table></div>");
}

const EYEBROW = "t-eyebrow text-primary";

export function ArticleHeader({ post, preview }: { post: ArticleView; preview?: boolean }) {
  const date = post.published_at ? fmtDate(post.published_at) : preview ? "발행 전" : "";
  return (
    <header className={preview ? "pb-6" : "pt-32 md:pt-40 pb-2"}>
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <nav aria-label="현재 위치" className="t-body-sm text-mute">
          {preview ? <span>블로그</span> : <Link href="/blog" className="hover:text-ink">블로그</Link>}
        </nav>
        {post.category_title && <span className="rounded-full border border-primary/30 text-primary text-[12px] font-semibold px-3 py-1">{post.category_title}</span>}
        {date && <span className="t-body-sm text-mute tracking-wide">· {date}</span>}
      </div>

      <h1 className="t-h-lg text-ink mt-5 text-center break-keep">{post.title || (preview ? "제목을 입력하세요" : "")}</h1>

      {post.lede && <p className="mt-6 mx-auto max-w-[640px] t-body-lg text-body text-center break-keep">{post.lede}</p>}

      {/* 저자 띠 — E-E-A-T. 조직 저자(인팩트컴퍼니)라 사진 대신 마크 */}
      <div className="mt-8 py-5 border-y border-hairline flex items-center gap-3">
        <span aria-hidden="true" className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center text-[11px] font-extrabold tracking-tight shrink-0">IN<span className="text-primary">.</span></span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-ink">{post.author_name ?? "인팩트컴퍼니"}<span className="font-normal text-mute"> · 병원 전문 마케팅 대행사</span></p>
          <p className="mt-0.5 text-[11px] tracking-[0.08em] text-mute">
            {date && <><time dateTime={post.published_at ?? undefined}>{date}</time> · </>}{readMinutes(post)} MIN READ
          </p>
        </div>
      </div>
    </header>
  );
}

/** 대표 이미지 — 원본 비율 그대로 폭 맞춤(레퍼런스). 비율 1.3 미만(정사각·아이콘류)만 16:9 패널 안에 contain */
export function ArticleImage({ post }: { post: ArticleView; preview?: boolean }) {
  const img = post.featured_image;
  if (!img) return null;
  const ratio = img.width && img.height ? img.width / img.height : 16 / 9;
  const squarish = ratio < 1.3;
  return (
    <figure className={`mt-10 m-0 overflow-hidden rounded-lg ${squarish ? "aspect-[16/9] bg-panel border border-hairline p-6 md:p-10" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.url} alt={img.alt || post.title} width={img.width ?? undefined} height={img.height ?? undefined} className={squarish ? "w-full h-full object-contain" : "w-full h-auto block"} fetchPriority="high" />
    </figure>
  );
}

function TocBox({ items }: { items: { id: string; heading: string }[] }) {
  if (items.length < 2) return null;
  return (
    <details open className="group mt-8 rounded-md border border-hairline bg-elevated px-5 py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="t-label text-ink">목차</span>
        <span className="t-body-sm text-mute border border-hairline rounded-sm px-2 py-0.5 group-open:hidden">펼치기</span>
        <span className="t-body-sm text-mute border border-hairline rounded-sm px-2 py-0.5 hidden group-open:inline">접기</span>
      </summary>
      <ol className="mt-4 space-y-2">
        {items.map((it, i) => (
          <li key={it.id} className="flex gap-2 text-[14px] leading-relaxed">
            <span className="text-mute shrink-0 tabular-nums">{i + 1}.</span>
            <a href={`#${it.id}`} className="text-body hover:text-primary break-keep">{it.heading}</a>
          </li>
        ))}
      </ol>
    </details>
  );
}

export function ArticleBody({ post }: { post: ArticleView }) {
  const toc = post.sections_html.filter((s) => s.heading).map((s, i) => ({ id: `sec-${i + 1}`, heading: s.heading }));
  const quotes = (post.quote_ready ?? []).filter((q) => q.line?.trim());
  const glossary = post.glossary ?? [];

  return (
    <div className="prose-ko text-ink">
      {/* 핵심 요약 — BLUF(key_answer)만 화면에. TL;DR(tldr)은 핵심 답변과 겹쳐 화면에서 제외(2026-09-22 사용자 결정) — 데이터는 저장·excerpt 생성에 계속 쓰임 */}
      {post.key_answer && (
        <section className="mt-8 rounded-lg bg-primary-soft/60 border border-primary/15 p-6 md:p-7">
          <p className={EYEBROW}>핵심 요약</p>
          <p className="mt-3 mb-0 text-[16px] md:text-[17px] leading-[1.85] text-ink font-medium break-keep">{post.key_answer}</p>
        </section>
      )}

      <TocBox items={toc} />

      <div className="mt-12 space-y-10">
        {post.sections_html.map((s, i) => (
          <section key={i} id={`sec-${i + 1}`} className="scroll-mt-28">
            {s.heading && <h2 className="break-keep">{s.heading}</h2>}
            <div className="mt-3 text-body break-keep" dangerouslySetInnerHTML={{ __html: wrapTables(s.html) }} />
          </section>
        ))}
      </div>

      {quotes.length > 0 && (
        <section className="mt-14">
          <p className={EYEBROW}>이 글의 결론</p>
          <div className="mt-5 space-y-4">
            {quotes.map((q, i) => (
              <blockquote key={i} className="m-0 border-l-2 border-primary pl-5 text-[16px] leading-[1.85] text-ink break-keep">{q.line}</blockquote>
            ))}
          </div>
        </section>
      )}

      {glossary.length > 0 && (
        <section className="mt-16">
          <p className={EYEBROW}>Glossary</p>
          <h2 className="mt-2">용어 정리</h2>
          <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
            {glossary.map((g, i) => (
              <div key={i} className="py-4">
                <dt className="font-semibold text-ink text-[15px]">{g.term}</dt>
                {g.description && <dd className="mt-1.5 text-[14.5px] leading-[1.8] text-body break-keep">{g.description}</dd>}
                {g.one_liner && <dd className="mt-1 text-[13.5px] leading-[1.75] text-mute break-keep">쉽게 말하면 — {g.one_liner}</dd>}
              </div>
            ))}
          </dl>
        </section>
      )}

      {post.faqs.length > 0 && (
        <section className="mt-16">
          <p className={EYEBROW}>FAQ</p>
          <h2 className="mt-2">자주 묻는 질문</h2>
          <div className="mt-6 divide-y divide-hairline border-y border-hairline">
            {post.faqs.map((f, i) => (
              <details key={i} className="group py-4" open={i === 0}>
                <summary className="flex items-start gap-3 cursor-pointer list-none">
                  <span className="text-[11px] font-semibold text-primary tracking-wider shrink-0 mt-1">Q{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-semibold text-ink text-[15px] break-keep">{f.question}</span>
                  <span aria-hidden="true" className="text-primary text-lg leading-none shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 mb-0 pl-9 text-[14.5px] leading-[1.85] text-body break-keep">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
