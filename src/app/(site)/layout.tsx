/** 공개 사이트 셸 — 헤더·푸터·스크롤 모션. 관리자(/admin)는 이 그룹 밖이라 붙지 않는다. */
import Motion from "@/components/Motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollTopButton from "@/components/ScrollTopButton";
import { getBusiness } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const biz = await getBusiness();
  return (
    <>
      <Motion />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer biz={biz} />
      <ScrollTopButton />
    </>
  );
}
