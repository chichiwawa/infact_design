/**
 * queries.ts — 디자인 전용 사본: DB 대신 src/content/*.json 스냅샷을 읽는다.
 * 문구·이미지 주소를 바꾸려면 src/content 의 JSON 을 고치면 된다. (운영 사이트와는 연결되어 있지 않음)
 */
import type { SitePage } from "./sections";
import businessJson from "@/content/business.json";
import pagesJson from "@/content/pages.json";
import blogsJson from "@/content/blogs.json";
import glossaryJson from "@/content/glossary.json";

export interface Business {
  name: string | null;
  business_type: string | null;
  telephone: string | null;
  url: string | null;
  logo_url: string | null;
  street_address: string | null;
  address_locality: string | null;
  address_region: string | null;
  postal_code: string | null;
  address_country: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string[];
  same_as: { url: string; label?: string }[];
}

export interface FeaturedImage { url: string; alt: string; width: number | null; height: number | null }

export interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
  updated_at: string;
  category: { title: string; slug: string | null } | null;
  featured_image: FeaturedImage | null;
}

export interface BlogPost extends BlogSummary {
  lede: string | null;
  key_answer: string | null;
  tldr: { line: string }[];
  quote_ready: { line: string }[];
  sections_html: { heading: string; html: string }[];
  faqs: { question: string; answer: string }[];
  seo_title: string | null;
  seo_description: string | null;
  author: { name: string } | null;
}

const pages = pagesJson as unknown as SitePage[];
const blogs = blogsJson as unknown as BlogPost[];
const glossary = glossaryJson as { term: string; slug: string | null; description: string | null; one_liner: string | null }[];

export async function getBusiness(): Promise<Business | null> {
  return businessJson as unknown as Business | null;
}

export async function getPage(slug: string): Promise<SitePage | null> {
  return pages.find((p) => p.slug === slug) ?? null;
}

/** 본문에 등장하는 용어 — 글 하단 "용어 정리" */
export async function getGlossaryMatches(bodyText: string, limit = 6) {
  return glossary.filter((g) => g.term && bodyText.includes(g.term)).slice(0, limit);
}

/** 발행 글 최신순 */
export async function getPublishedBlogs(limit?: number): Promise<BlogSummary[]> {
  return limit ? blogs.slice(0, limit) : blogs;
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
  // 한글 slug 는 주소에서 인코딩되어 들어올 수 있다
  const s = decodeURIComponent(slug);
  return blogs.find((b) => b.slug === s) ?? null;
}
