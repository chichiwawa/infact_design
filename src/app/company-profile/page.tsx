/**
 * 회사소개서 뷰어 (2026-09-28) — 헤더의 "회사소개서" 버튼이 새 탭으로 연다.
 * PDF 대신 슬라이드 이미지(public/company-profile/*.jpg, 1920×1080, 목록은 아래 SLIDES)를 세로로 이어 붙인다:
 * 안드로이드 크롬은 PDF 를 화면에 띄우지 않고 내려받기 때문. (site) 그룹 밖이라 사이트 헤더·푸터 없이 문서만 보인다.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "회사소개서",
  description: "인팩트컴퍼니 회사소개서 — 2018년부터 병원 마케팅만 해온 병원 전문 마케팅 대행사.",
  robots: { index: false, follow: true },  // 이미지뿐인 문서 뷰어라 검색 색인에서 제외 (같은 내용은 메인·서비스 페이지가 담당)
};

/* 슬라이드를 교체할 때는 같은 이름으로 덮어쓰지 말고 새 파일명(예: 01-v2 → 01-v3)으로 넣고 여기 file 만 바꾼다.
   next/image 최적화 결과가 minimumCacheTTL(31일) 동안 URL 기준으로 캐시돼, 같은 이름이면 옛 이미지가 계속 나간다. */
const SLIDES = [
  { file: "01-v2.jpg", alt: "인팩트컴퍼니 회사소개서 표지" },
  { file: "02.jpg", alt: "목차" },
  { file: "03.jpg", alt: "01 회사 소개" },
  { file: "04.jpg", alt: "02 조직 구성" },
  { file: "05.jpg", alt: "03 일하는 방식" },
  { file: "06.jpg", alt: "04 진행 프로세스" },
  { file: "07.jpg", alt: "05 패키지 구성" },
  { file: "08.jpg", alt: "06 개별 상품" },
  { file: "09.jpg", alt: "07 차별점" },
  { file: "10.jpg", alt: "08 문의 안내" },
  { file: "11.jpg", alt: "감사합니다" },
];

export default function CompanyProfilePage() {
  return (
    <div className="min-h-full bg-[#0a1024] text-white">
      <header className="sticky top-0 z-10 bg-[#0a1024]/90 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="logo" aria-label="인팩트컴퍼니 홈">
            <span className="logo-word" aria-hidden="true" />
            <span className="logo-dot text-primary" aria-hidden="true" />
          </Link>
          <Link href="/contact" className="btn-sm">문의하기</Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-0 md:px-6 py-4 md:py-8 flex flex-col gap-2 md:gap-4">
        <h1 className="sr-only">인팩트컴퍼니 회사소개서</h1>
        {SLIDES.map((s, i) => (
          <Image
            key={s.file}
            src={`/company-profile/${s.file}`}
            alt={s.alt}
            width={1920}
            height={1080}
            sizes="(min-width: 1280px) 1232px, 100vw"
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-auto md:rounded-lg"
          />
        ))}
      </main>
    </div>
  );
}
