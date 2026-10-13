import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-40 pb-32">
      <div className="container-x text-center">
        <p className="t-eyebrow text-primary">404</p>
        <h1 className="t-h-xl text-ink mt-5">페이지를 찾을 수 없습니다</h1>
        <p className="t-body text-body mt-3">주소가 바뀌었거나 삭제된 페이지입니다.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">메인으로</Link>
          <Link href="/blog" className="btn-secondary">블로그 보기</Link>
        </div>
      </div>
    </section>
  );
}
